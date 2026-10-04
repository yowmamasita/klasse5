/* Kapitel 9 – Inszenieren: Standbild, Maske, Foto und Film (Kunst 5/6, Berlin RLP: Inszenieren, Medien) */
(() => {
  const UC = "#a16207", INK = "#1b2740", RED = "#dc3b2a", BLUE = "#1d5bd0", GREEN = "#138a5a", SKIN = "#f2c9a0";
  const RAD = Math.PI / 180;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const cols2 = (s, l, r, lw = 560, gap = 28) => s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", alignItems: "center", height: "100%", gap: gap + "px" } }, l, r);
  const P = (s, html, cls = "t", later = false) => s.h("p", { class: cls + (later ? " later" : ""), html });
  const box = (s, cls, label, html, later = true) => s.h("div", { class: cls + (later ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const merk = (s, html, later = true) => s.h("div", { class: "merk" + (later ? " later" : ""), html });
  const stack = (s, gap, ...k) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...k);
  const fx = (s, n = "pop") => { try { s.sfx[n](); } catch (e) {} };
  const reveal = (s, els, kind = "pop", snd = "pop", delay = 0) => { fx(s, snd); return s.show(els, kind, delay); };
  const lbl = (s, x, y, t, extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, extra));
  const pill = (s, text, onclick, extra = {}) => { const b = s.h("button", { style: Object.assign({ minHeight: "56px", padding: "0 16px", border: "2px solid " + UC, borderRadius: "14px", background: "#fff", color: UC, font: "700 19px var(--f-display)", cursor: "pointer" }, extra), onclick }, text); b.setOn = on => { b.style.background = on ? UC : "#fff"; b.style.color = on ? "#fff" : UC; }; return b; };
  const pillGroup = (s, items, onPick, start) => { const bs = {}; const pick = k => { Object.entries(bs).forEach(([kk, b]) => b.setOn(kk === k)); onPick(k); }; items.forEach(([k, t]) => { bs[k] = pill(s, t, () => { s.sfx.click(); pick(k); }); }); if (start) Object.entries(bs).forEach(([kk, b]) => b.setOn(kk === start)); return { btns: bs, pick }; };
  const row = (s, label, btns, later = true) => s.h("div", { class: later ? "later" : "", style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } }, label ? s.h("span", { class: "t", style: { fontWeight: 700, minWidth: "122px" } }, label) : null, ...btns);

  /* ---------- a poseable person (local coords: hip at 230/330, feet on y = 450) ---------- */
  const POSES = {
    neutral: { lean: 0, tilt: 0, drop: 0, aLs: -12, aLe: 0, aRs: 12, aRe: 0, leg: 8, knee: 0, brow: 0, mouth: .3, open: 0, lx: 0, ly: 0 },
    freude: { lean: 0, tilt: -4, drop: 0, aLs: -155, aLe: -10, aRs: 155, aRe: 10, leg: 16, knee: 0, brow: .4, mouth: 1, open: .7, lx: 0, ly: -1 },
    angst: { lean: -6, tilt: 10, drop: 4, aLs: -120, aLe: -142, aRs: 120, aRe: 142, leg: 14, knee: 1, brow: 1, mouth: -.3, open: 1, lx: 1, ly: 0 },
    wut: { lean: 4, tilt: 0, drop: 0, aLs: -45, aLe: 105, aRs: 45, aRe: -105, leg: 24, knee: 0, brow: -1, mouth: -.8, open: .35, lx: 0, ly: 0 },
    trauer: { lean: 0, tilt: 18, drop: 12, aLs: -4, aLe: 0, aRs: 4, aRe: 0, leg: 4, knee: .3, brow: 1, mouth: -1, open: 0, lx: 0, ly: 1 },
    stolz: { lean: -4, tilt: -10, drop: -2, aLs: -45, aLe: 105, aRs: 45, aRe: -105, leg: 18, knee: 0, brow: 0, mouth: .6, open: 0, lx: 0, ly: -.6 },
    stopp: { lean: 0, tilt: 0, drop: 0, aLs: -90, aLe: 0, aRs: 90, aRe: 0, leg: 20, knee: 0, brow: -.4, mouth: 0, open: .2, lx: 0, ly: 0 },
    winken: { lean: 0, tilt: -4, drop: 0, aLs: -12, aLe: 0, aRs: 150, aRe: 20, leg: 10, knee: 0, brow: .3, mouth: 1, open: .3, lx: 0, ly: 0 },
  };
  function figure(s, opts = {}) {
    const g = s.el("g", {});
    const st = (c, w) => ({ stroke: c, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
    const legs = s.el("path", st(opts.pants || "#3a3f55", 16));
    const torso = s.el("path", st(opts.shirt || BLUE, 34));
    const arms = s.el("path", st(opts.shirt || BLUE, 13));
    const hands = [0, 1].map(() => s.el("circle", { r: 9, fill: SKIN, stroke: "#b88a5e", "stroke-width": 2 }));
    const headG = s.el("g", {});
    const browL = s.el("path", st(INK, 4)), browR = s.el("path", st(INK, 4));
    const eyes = [-14, 14].map(x => s.el("circle", { cx: x, cy: -4, r: 7, fill: "#fff", stroke: INK, "stroke-width": 2 }));
    const pups = [0, 1].map(() => s.el("circle", { r: 3.6, fill: INK }));
    const mouth = s.el("path", st(INK, 4));
    const mo = s.el("ellipse", { cx: 0, cy: 20, rx: 8, ry: 0, fill: "#7a2230" });
    headG.append(s.el("circle", { r: 38, fill: SKIN, stroke: INK, "stroke-width": 3 }),
      s.el("path", { d: "M-38,-4 Q-38,-46 0,-42 Q38,-46 38,-4 Q26,-26 0,-26 Q-26,-26 -38,-4 Z", fill: opts.hair || "#5a3a22" }), ...eyes, ...pups, browL, browR, mo, mouth);
    const back = s.el("g", {}), front = s.el("g", {});
    g.append(back, legs, torso, headG, arms, ...hands, front);
    let cur = Object.assign({}, POSES.neutral);
    const pts = {};
    const L = (x, y, a, len) => [x + Math.sin(a * RAD) * len, y + Math.cos(a * RAD) * len];
    const draw = p => {
      const hipX = 230, hipY = 330 + p.knee * 30, fy = 450;
      const neck = L(hipX, hipY, 180 - p.lean, 112);
      const fxL = hipX - 26 - p.leg * 2, fxR = hipX + 26 + p.leg * 2;
      const kL = [(hipX - 10 + fxL) / 2 - p.knee * 28, (hipY + fy) / 2], kR = [(hipX + 10 + fxR) / 2 + p.knee * 28, (hipY + fy) / 2];
      legs.setAttribute("d", `M${fxL - 14},${fy} L${fxL},${fy} L${kL} L${hipX - 10},${hipY} M${hipX + 10},${hipY} L${kR} L${fxR},${fy} L${fxR + 14},${fy}`);
      torso.setAttribute("d", `M${hipX},${hipY - 6} L${neck}`);
      const shL = [neck[0] - 18, neck[1] + 8], shR = [neck[0] + 18, neck[1] + 8];
      const eL = L(shL[0], shL[1], p.aLs, 62), hL = L(eL[0], eL[1], p.aLs + p.aLe, 58);
      const eR = L(shR[0], shR[1], p.aRs, 62), hR = L(eR[0], eR[1], p.aRs + p.aRe, 58);
      arms.setAttribute("d", `M${shL} L${eL} L${hL} M${shR} L${eR} L${hR}`);
      hands[0].setAttribute("cx", hL[0]); hands[0].setAttribute("cy", hL[1]); hands[1].setAttribute("cx", hR[0]); hands[1].setAttribute("cy", hR[1]);
      const hc = L(neck[0], neck[1], 180 - p.lean, 44 - p.drop);
      headG.setAttribute("transform", `translate(${hc[0]},${hc[1]}) rotate(${p.tilt})`);
      browL.setAttribute("d", `M-24,-17 L-7,${-17 - p.brow * 6}`); browR.setAttribute("d", `M24,-17 L7,${-17 - p.brow * 6}`);
      pups[0].setAttribute("cx", -14 + p.lx * 3); pups[1].setAttribute("cx", 14 + p.lx * 3); pups.forEach(c => c.setAttribute("cy", -4 + p.ly * 3));
      eyes.forEach(e => e.setAttribute("r", 7 + p.open * 1.5));
      mouth.setAttribute("d", `M-14,16 Q0,${16 + p.mouth * 14} 14,16`);
      mo.setAttribute("ry", (p.open * 8).toFixed(1)); mo.setAttribute("cy", 18 + Math.max(0, p.mouth) * 4);
      Object.assign(pts, { hip: [hipX, hipY], neck, hc, hL, hR, shL, shR });
    };
    draw(cur);
    return {
      g, back, front, pts, draw,
      get pose() { return cur; },
      shirt(c) { torso.setAttribute("stroke", c); arms.setAttribute("stroke", c); },
      async set(name, dur = 700) {
        const from = Object.assign({}, cur), to = typeof name === "string" ? POSES[name] : name;
        if (s.fast) { cur = Object.assign({}, to); draw(cur); return; }
        await s.tween({ from: 0, to: 1, dur, ease: "inOut", update: t => { const p = {}; for (const k in to) p[k] = lerp(from[k], to[k], t); cur = p; draw(p); } });
        cur = Object.assign({}, to); draw(cur);
      },
    };
  }
  const place = (fig, x, feetY, k) => fig.g.setAttribute("transform", `translate(${x - 230 * k},${feetY - 450 * k}) scale(${k})`);

  Deck.unit({
    id: "u9", num: 9, title: "Inszenieren: Standbild, Maske, Foto und Film", color: UC, soft: "#fbf1d6",
    subtitle: "Du bist Regisseur: Körper, Licht, Bild und Bewegung",
    blurb: "Standbild, Masken, Schattentheater, Foto, Daumenkino, Film",
    goals: [
      "Mit dem Körper ein Standbild bauen: Haltung, Gestik, Mimik, Blick",
      "Masken aus aller Welt kennen und selbst eine gestalten",
      "Schattentheater, Einstellungsgrößen und Licht im Foto verstehen",
      "Wie Bilder laufen lernen: Daumenkino, Stop-Motion und Film",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M8,14 Q8,48 26,52 Q42,48 42,14 Q25,20 8,14 Z", fill: UC, opacity: .9 }),
        el("path", { d: "M30,22 Q30,56 47,60 Q63,56 63,22 Q46,28 30,22 Z", fill: "#fff", stroke: UC, "stroke-width": 3 }),
        el("circle", { cx: 18, cy: 28, r: 3, fill: "#fff" }), el("circle", { cx: 32, cy: 28, r: 3, fill: "#fff" }), el("path", { d: "M17,39 Q25,46 33,39", stroke: "#fff", "stroke-width": 3, fill: "none" }),
        el("circle", { cx: 40, cy: 36, r: 3, fill: UC }), el("circle", { cx: 54, cy: 36, r: 3, fill: UC }), el("path", { d: "M39,50 Q47,43 55,50", stroke: UC, "stroke-width": 3, fill: "none" }));
    },
    slides: [
      /* 1 ---- Was ist Inszenieren? */
      {
        title: "Inszenieren: Was ist das?",
        say: "Inszenieren heißt: Du planst genau, was die Zuschauer sehen. Wie ein Regisseur im Theater, beim Foto oder im Film.",
        build(s) {
          const svg = s.svg(540, 440);
          svg.append(s.el("rect", { x: 0, y: 0, width: 540, height: 440, rx: 14, fill: "#3b2d4f" }), s.el("polygon", { points: "0,350 540,350 540,440 0,440", fill: "#b07a45" }),
            ...[60, 140, 220, 300, 380, 460].map(x => s.el("line", { x1: x, y1: 350, x2: x - 30, y2: 440, stroke: "#8d5f33", "stroke-width": 3 })));
          const spot = s.el("polygon", { points: "270,0 160,400 380,400", fill: "#fff6c8", opacity: 0 });
          const pool = s.el("ellipse", { cx: 270, cy: 400, rx: 120, ry: 22, fill: "#fff6c8", opacity: 0 });
          svg.append(spot, pool);
          const fig = figure(s, { shirt: "#c0392b" }); place(fig, 270, 405, .66); fig.draw(POSES.winken); svg.append(fig.g);
          const curtain = side => { const g = s.el("g", {}); for (let i = 0; i < 6; i++) g.append(s.el("rect", { x: side * 270 + i * 45, y: 0, width: 45, height: 440, fill: i % 2 ? "#a3122b" : "#bd1a35" })); return g; };
          const cL = curtain(0), cR = curtain(1);
          svg.append(cL, cR, s.el("rect", { x: 0, y: 0, width: 540, height: 46, fill: "#7d0c22" }), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => s.el("circle", { cx: 30 + i * 60, cy: 46, r: 14, fill: "#7d0c22" })));
          const setCurtain = t => { cL.setAttribute("transform", `scale(${1 - .82 * t},1)`); cR.setAttribute("transform", `translate(540,0) scale(${1 - .82 * t},1) translate(-540,0)`); };
          const card = (c, t, txt) => s.h("div", { class: "card later", style: { padding: "8px 16px", borderLeft: `10px solid ${c}` } }, P(s, `<b>${t}</b>`, "t"), P(s, txt, "small"));
          const k1 = card(RED, "Theater", "Menschen spielen eine Szene – live vor Publikum.");
          const k2 = card(BLUE, "Foto", "Du hältst einen Moment fest und wählst den Ausschnitt.");
          const k3 = card(GREEN, "Film", "Viele Bilder hintereinander erzählen eine Geschichte.");
          const m = merk(s, "<b>Inszenieren</b> heißt: Du planst, <b>was</b> die Zuschauer sehen und <b>wie</b> – mit Körper, Licht, Kostüm und Ort.");
          const life = box(s, "life", "Im Alltag", "Die Schulaufführung, das Geburtstagsfoto, ein Werbespot im Fernsehen: Alles ist inszeniert.");
          s.add(cols2(s, svg, stack(s, 10, k1, k2, k3, m, life), 540));
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1300, ease: "inOut", update: setCurtain }); s.sound("applause", { vol: .4, dur: 2.5 }); });
          s.step(async () => { s.sfx.zap(); await s.tween({ from: 0, to: .5, dur: 500, update: v => { spot.setAttribute("opacity", v); pool.setAttribute("opacity", v + .2); } }); s.say("Licht an! Jetzt schauen alle auf die Figur."); });
          [k1, k2, k3].forEach(k => s.step(async () => { await reveal(s, k, "left", "pop"); }));
          s.step(async () => { await reveal(s, m, "up", "ding"); });
          s.step(async () => { await reveal(s, life, "up", "success"); });
        },
      },
      /* 2 ---- Standbild: Körpersprache */
      {
        title: "Standbild: Körper erzählen",
        say: "Bei einem Standbild spricht niemand. Nur der Körper erzählt: Haltung, Gestik, Mimik und Blick.",
        build(s) {
          const svg = s.svg(460, 470);
          svg.append(s.el("ellipse", { cx: 230, cy: 456, rx: 170, ry: 12, fill: "#d9cdb4" }));
          const fig = figure(s, { shirt: BLUE }); svg.append(fig.g);
          const ringStyle = { fill: "none", stroke: RED, "stroke-width": 5, "stroke-dasharray": "10 7" };
          const rH = s.el("ellipse", Object.assign({ cx: 230, cy: 300, rx: 95, ry: 165, class: "later" }, ringStyle));
          const rG = s.el("g", { class: "later" }, s.el("circle", Object.assign({ cx: fig.pts.hL[0], cy: fig.pts.hL[1], r: 26 }, ringStyle)), s.el("circle", Object.assign({ cx: fig.pts.hR[0], cy: fig.pts.hR[1], r: 26 }, ringStyle)));
          const rM = s.el("circle", Object.assign({ cx: fig.pts.hc[0], cy: fig.pts.hc[1], r: 52, class: "later" }, ringStyle));
          const rB = s.el("g", { class: "later" }, s.el("path", { d: `M${fig.pts.hc[0] + 30},${fig.pts.hc[1] - 4} L${fig.pts.hc[0] + 150},${fig.pts.hc[1] - 4}`, stroke: RED, "stroke-width": 5, "stroke-dasharray": "10 7" }), s.el("polygon", { points: `${fig.pts.hc[0] + 166},${fig.pts.hc[1] - 4} ${fig.pts.hc[0] + 148},${fig.pts.hc[1] - 14} ${fig.pts.hc[0] + 148},${fig.pts.hc[1] + 6}`, fill: RED }));
          svg.append(rH, rG, rM, rB);
          const term = (t, txt) => s.h("div", { class: "card later", style: { padding: "8px 14px" } }, P(s, `<b>${t}</b>`, "t"), P(s, txt, "small"));
          const t1 = term("Körperhaltung", "aufrecht, gebückt, geduckt, breitbeinig");
          const t2 = term("Gestik", "Was tun Arme und Hände?");
          const t3 = term("Mimik", "Augenbrauen, Augen und Mund");
          const t4 = term("Blickrichtung", "Wohin schaut die Figur?");
          const names = { freude: "Freude", angst: "Angst", wut: "Wut", trauer: "Trauer", stolz: "Stolz" };
          const grp = pillGroup(s, Object.entries(names), k => { fig.set(k); s.say(names[k]); });
          const pr = row(s, "", Object.values(grp.btns));
          const m = merk(s, "Ein <b>Standbild</b> ist wie ein angehaltener Film: Alle <b>frieren</b> in einer Haltung ein. Niemand spricht.");
          s.add(cols2(s, svg, stack(s, 12, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, t1, t2, t3, t4), pr, m), 460));
          const hl = async (t, r, txt) => { s.sfx.pop(); s.show(t, "left"); await s.show(r, r.tagName === "g" ? "pop" : "draw"); s.say(txt); };
          s.step(async () => { await hl(t1, rH, "Die Körperhaltung: Steht die Figur aufrecht oder geduckt?"); });
          s.step(async () => { s.hide(rH); await hl(t2, rG, "Die Gestik: Was machen die Hände?"); });
          s.step(async () => { s.hide(rG); await hl(t3, rM, "Die Mimik: das Gesicht."); });
          s.step(async () => { s.hide(rM); await hl(t4, rB, "Und die Blickrichtung."); });
          s.step(async () => { s.hide(rB); s.sfx.whoosh(); await s.show(pr, "up"); for (const k of ["freude", "angst", "wut"]) { grp.pick(k); await s.wait(1000); } grp.pick("trauer"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 3 ---- Standbild bauen */
      {
        title: "Ein Standbild bauen",
        say: "Einer ist der Bildhauer. Er formt die anderen wie Knete, bis die Szene stimmt. Dann frieren alle ein.",
        build(s) {
          const svg = s.svg(600, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 470, rx: 14, fill: "#eef3f8" }), s.el("rect", { x: 0, y: 410, width: 600, height: 60, fill: "#c9b79a" }));
          const A = figure(s, { shirt: RED }), B = figure(s, { shirt: GREEN, hair: "#2a2a2a" }), C = figure(s, { shirt: "#7b4fd6", hair: "#b5651d" });
          place(A, 110, 440, .7); place(B, 300, 440, .7); place(C, 490, 440, .7);
          svg.append(A.g, B.g, C.g);
          const ice = s.el("rect", { x: 0, y: 0, width: 600, height: 470, rx: 14, fill: "#8fd0ff", opacity: 0 });
          const flake = s.el("g", { opacity: 0 }, ...[0, 60, 120].map(a => s.el("line", { x1: 0, y1: -26, x2: 0, y2: 26, stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round", transform: `translate(555,45) rotate(${a})` })));
          const look = s.el("g", { class: "later" }, s.el("path", { d: "M150,150 Q300,90 450,150", fill: "none", stroke: RED, "stroke-width": 5, "stroke-dasharray": "12 8" }), s.el("polygon", { points: "458,154 440,154 448,138", fill: RED }));
          svg.append(ice, flake, look);
          const st = (n, t) => s.h("div", { class: "card later row", style: { padding: "8px 14px", gap: "12px", flexWrap: "nowrap", alignItems: "center" } }, s.h("span", { style: { width: "38px", height: "38px", borderRadius: "50%", background: UC, color: "#fff", fontWeight: 800, display: "grid", placeItems: "center", flex: "none", fontSize: "21px" } }, String(n)), P(s, t, "small"));
          const s1 = st(1, "<b>Szene wählen:</b> Streit auf dem Schulhof.");
          const s2 = st(2, "<b>Bildhauer formt:</b> Haltung, Hände, Gesicht, Blick.");
          const s3 = st(3, "<b>Einfrieren!</b> Alle halten still wie Statuen.");
          const s4 = st(4, "<b>Zuschauer beschreiben:</b> Wer ist wütend? Wer hat Angst? Wer hilft?");
          const life = box(s, "life", "Im Alltag", "Märchen nachstellen (Rotkäppchen trifft den Wolf), die Siegerehrung auf dem Treppchen, ein berühmtes Gemälde mit Freunden nachbauen.");
          s.add(cols2(s, svg, stack(s, 10, s1, s2, s3, s4, life), 600));
          s.step(async () => { await reveal(s, s1, "left", "pop"); s.say("Wir nehmen eine Szene: Streit auf dem Schulhof."); });
          s.step(async () => { await reveal(s, s2, "left", "pop"); s.sfx.swoosh(); await A.set("wut"); s.sfx.swoosh(); await C.set("angst"); s.sfx.swoosh(); await B.set("stopp"); s.say("Links ist jemand wütend, rechts hat jemand Angst. In der Mitte sagt einer: Stopp!"); });
          s.step(async () => { s.show(s3, "left"); s.sound("camera-shutter"); await s.tween({ from: 0, to: 1, dur: 500, update: v => { ice.setAttribute("opacity", (.28 * v).toFixed(2)); flake.setAttribute("opacity", v); } }); s.say("Einfrieren! Jetzt bewegt sich niemand mehr."); });
          s.step(async () => { await reveal(s, s4, "left", "pop"); await s.show(look, "draw"); s.say("Schau auf die Blicke: Wer schaut wen an?"); });
          s.step(async () => { await reveal(s, life, "up", "success"); });
        },
      },
      /* 4 ---- Masken aus aller Welt */
      {
        title: "Masken: ein neues Gesicht",
        say: "Mit einer Maske wirst du jemand anderes. Masken gibt es seit Tausenden von Jahren, auf der ganzen Welt.",
        build(s) {
          const mk = (id, pos, cap, txt) => s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, s.photo(id, { w: 324, h: 250, pos, caption: cap }), P(s, txt, "small"));
          const k1 = mk("theatermaske-mosaik", "38% 50%", "Theatermaske, Pompeji", "Im Theater der Antike trugen Schauspieler Masken. Auf Lateinisch hieß die Maske <b>„persona“</b> – daher kommt unser Wort Person.");
          const k2 = mk("venedig-masken", "50% 50%", "Karnevalsmasken, Venedig", "Beim <b>Karneval in Venedig</b> trägt man seit Jahrhunderten Masken. Mit der weißen „Bauta“ erkannte dich niemand.");
          const k3 = mk("dan-maske", "50% 62%", "Holzmaske der Dan", "Die <b>Dan</b> in Westafrika (Côte d’Ivoire, Liberia) schnitzen Masken aus Holz. Diese ist rund 100 Jahre alt.");
          const m = merk(s, "Eine Maske verwandelt dich in eine <b>Figur</b>. Ihr Ausdruck ist <b>übertrieben</b>, damit man ihn auch von weit weg erkennt.");
          s.add(stack(s, 14, s.h("div", { class: "cols3" }, k1, k2, k3), m));
          s.step(async () => { await reveal(s, k1, "zoom", "whoosh"); s.say("Diese Theatermaske ist ein Mosaik aus Pompeji. Sie ist rund zweitausend Jahre alt."); });
          s.step(async () => { await reveal(s, k2, "zoom", "whoosh"); s.say("In Venedig ist Karneval ohne Masken nicht denkbar."); });
          s.step(async () => { await reveal(s, k3, "zoom", "whoosh"); s.say("Diese Maske haben Künstler der Dan aus Holz geschnitzt."); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 5 ---- Maske gestalten */
      {
        title: "Eine Maske gestalten",
        say: "So baust du eine Maske aus Pappe. Probiere aus, wie Augen, Mund und Farbe den Ausdruck verändern.",
        build(s) {
          const svg = s.svg(440, 440);
          const shape = "M220,40 C320,40 370,100 370,190 C370,300 300,400 220,400 C140,400 70,300 70,190 C70,100 120,40 220,40 Z";
          const band = s.el("path", { d: "M70,180 C30,170 10,190 4,215 M370,180 C410,170 430,190 436,215", fill: "none", stroke: "#e2c044", "stroke-width": 5, class: "later" });
          const outline = s.el("path", { d: shape, fill: "none", stroke: INK, "stroke-width": 4, "stroke-dasharray": "12 8", class: "later" });
          const face = s.el("path", { d: shape, fill: "#f6f1e6", stroke: INK, "stroke-width": 4, class: "later" });
          const deco = s.el("g", { class: "later" });
          const eyeG = s.el("g", { class: "later" }), mouthG = s.el("g", { class: "later" });
          svg.append(band, face, deco, eyeG, mouthG, outline);
          const HOLE = "#2a2238";
          const EYES = {
            rund: () => [s.el("circle", { cx: 160, cy: 180, r: 30, fill: HOLE }), s.el("circle", { cx: 280, cy: 180, r: 30, fill: HOLE })],
            schmal: () => [s.el("path", { d: "M120,185 Q160,160 200,185 Q160,200 120,185 Z", fill: HOLE }), s.el("path", { d: "M240,185 Q280,160 320,185 Q280,200 240,185 Z", fill: HOLE })],
            wuetend: () => [s.el("path", { d: "M118,160 L204,192 L150,205 Q122,196 118,160 Z", fill: HOLE }), s.el("path", { d: "M322,160 L236,192 L290,205 Q318,196 322,160 Z", fill: HOLE })],
          };
          const MOUTH = {
            lachen: () => [s.el("path", { d: "M140,285 Q220,380 300,285 Q220,315 140,285 Z", fill: HOLE })],
            traurig: () => [s.el("path", { d: "M150,335 Q220,270 290,335", fill: "none", stroke: HOLE, "stroke-width": 14, "stroke-linecap": "round" })],
            staunen: () => [s.el("ellipse", { cx: 220, cy: 315, rx: 26, ry: 38, fill: HOLE })],
          };
          const COL = { gold: ["#f2c94c", "#b8860b"], rot: ["#e8483b", "#2a2238"], gruen: ["#5fb76a", "#ffe066"], weiss: ["#f6f1e6", "#1d5bd0"] };
          const setEyes = k => { eyeG.replaceChildren(...EYES[k]()); };
          const setMouth = k => { mouthG.replaceChildren(...MOUTH[k]()); };
          const setCol = k => { const [a, b] = COL[k]; face.setAttribute("fill", a); deco.replaceChildren(...[[220, 92], [196, 106], [244, 106], [110, 250], [330, 250], [128, 286], [312, 286]].map(([x, y], i) => s.el("circle", { cx: x, cy: y, r: i < 3 ? 9 : 12, fill: b })), s.el("path", { d: "M175,128 Q220,112 265,128", fill: "none", stroke: b, "stroke-width": 6, "stroke-linecap": "round" })); };
          setEyes("rund"); setMouth("lachen"); face.setAttribute("fill", "#f6f1e6");
          const st = (n, t) => s.h("div", { class: "later row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: UC, color: "#fff", fontWeight: 800, display: "grid", placeItems: "center", flex: "none", fontSize: "19px" } }, String(n)), P(s, t, "small"));
          const a1 = st(1, "Form auf Pappe oder einen Pappteller zeichnen und ausschneiden.");
          const a2 = st(2, "Augenlöcher anzeichnen – genau vor deinen Augen – und ausschneiden.");
          const a3 = st(3, "Ausdruck <b>übertreiben</b> und kräftig bemalen.");
          const a4 = st(4, "Seitlich Löcher stechen und ein Gummiband festknoten.");
          const gE = pillGroup(s, [["rund", "rund"], ["schmal", "schmal"], ["wuetend", "wütend"]], k => { setEyes(k); s.sound("scissors", { dur: .8 }); }, "rund");
          const gM = pillGroup(s, [["lachen", "lachen"], ["traurig", "traurig"], ["staunen", "staunen"]], k => { setMouth(k); s.sfx.pop(); }, "lachen");
          const gC = pillGroup(s, [["gold", "Gold"], ["rot", "Rot"], ["gruen", "Grün"], ["weiss", "Weiß"]], k => { setCol(k); s.sound("pinsel-strich", { vol: .7 }); });
          const r1 = row(s, "Augen:", Object.values(gE.btns)), r2 = row(s, "Mund:", Object.values(gM.btns)), r3 = row(s, "Farbe:", Object.values(gC.btns));
          s.add(cols2(s, svg, stack(s, 10, a1, a2, a3, a4, r1, r2, r3), 440));
          s.step(async () => { s.show(a1, "left"); s.sound("scissors"); await s.show(outline, "draw"); s.show(face, "fade"); });
          s.step(async () => { s.show(a2, "left"); s.sound("scissors"); await s.show(eyeG, "pop"); await s.show(mouthG, "pop"); });
          s.step(async () => { s.show(a3, "left"); s.sound("pinsel-strich", { vol: .7 }); setCol("gold"); gC.btns.gold.setOn(true); await s.show(deco, "pop"); });
          s.step(async () => { s.show(a4, "left"); s.sfx.snap(); await s.show(band, "draw"); });
          s.step(async () => { s.sfx.whoosh(); await s.show([r1, r2, r3], "up"); s.say("Jetzt du: Tippe und verändere den Ausdruck."); gE.pick("wuetend"); await s.wait(700); gM.pick("traurig"); });
        },
      },
      /* 6 ---- Schattentheater: Licht, Figur, Leinwand */
      {
        title: "Schattentheater: Licht und Figur",
        say: "Für ein Schattentheater brauchst du eine Lampe, eine Figur und eine Leinwand. Je näher die Figur an der Lampe ist, desto größer wird der Schatten.",
        build(s) {
          const side = s.svg(620, 290), front = s.svg(440, 290);
          side.append(s.el("rect", { x: 0, y: 0, width: 620, height: 290, rx: 14, fill: "#2b2f45" }));
          const LX = 50, LY = 150, SX = 580;
          const rayT = s.el("line", { stroke: "#ffe066", "stroke-width": 3, "stroke-dasharray": "8 6" }), rayB = s.el("line", { stroke: "#ffe066", "stroke-width": 3, "stroke-dasharray": "8 6" });
          const lamp = s.el("g", {}, s.el("circle", { cx: LX, cy: LY, r: 34, fill: "#ffe066", opacity: .3 }), s.el("circle", { cx: LX, cy: LY, r: 20, fill: "#ffe066", stroke: "#e09a00", "stroke-width": 3 }), s.el("rect", { x: LX - 8, y: LY + 20, width: 16, height: 120, fill: "#8b95a5" }));
          const screen = s.el("rect", { x: SX, y: 20, width: 14, height: 250, fill: "#fdf6e3", stroke: "#c8b78f", "stroke-width": 2 });
          const puppet = s.el("g", {}, s.el("rect", { x: -3, y: 0, width: 6, height: 110, fill: "#8d5538" }), s.el("rect", { x: -7, y: -40, width: 14, height: 40, rx: 3, fill: "#111" }));
          side.append(rayT, rayB, lamp, screen, puppet);
          front.append(s.el("rect", { x: 0, y: 0, width: 440, height: 290, rx: 14, fill: "#2b2f45" }));
          const defs = s.el("defs", {}, s.el("filter", { id: "k9-blur", x: "-50%", y: "-50%", width: "200%", height: "200%" }, s.el("feGaussianBlur", { stdDeviation: 2 })), s.el("clipPath", { id: "k9-clip" }, s.el("rect", { x: 20, y: 20, width: 400, height: 250, rx: 6 })));
          const blur = defs.querySelector("feGaussianBlur");
          const scr = s.el("rect", { x: 20, y: 20, width: 400, height: 250, rx: 6, fill: "#fff4d6" });
          const cat = s.el("g", { fill: "#1b1b22" }, s.el("ellipse", { cx: 0, cy: 22, rx: 36, ry: 24 }), s.el("circle", { cx: 26, cy: -8, r: 18 }), s.el("polygon", { points: "14,-20 18,-40 28,-24" }), s.el("polygon", { points: "30,-24 40,-40 42,-18" }),
            s.el("path", { d: "M-34,18 Q-60,0 -50,-24", fill: "none", stroke: "#1b1b22", "stroke-width": 8, "stroke-linecap": "round" }), s.el("rect", { x: -26, y: 36, width: 9, height: 16 }), s.el("rect", { x: 16, y: 36, width: 9, height: 16 }));
          const catW = s.el("g", { filter: "url(#k9-blur)" }, cat), clipG = s.el("g", { "clip-path": "url(#k9-clip)" }, catW);
          front.append(defs, scr, clipG);
          // side-view cat stands for the puppet head: height 40 at y LY-20..LY+20
          const upd = v => {
            const fxp = 170 + v * 3.6; // 170..530
            puppet.setAttribute("transform", `translate(${fxp},${LY + 20})`);
            const k = (SX - LX) / (fxp - LX);
            const yT = LY + (-20) * k, yB = LY + 20 * k;
            rayT.setAttribute("x1", LX); rayT.setAttribute("y1", LY); rayT.setAttribute("x2", SX); rayT.setAttribute("y2", yT);
            rayB.setAttribute("x1", LX); rayB.setAttribute("y1", LY); rayB.setAttribute("x2", SX); rayB.setAttribute("y2", yB);
            const sc = clamp(k * .55, .4, 3.2);
            cat.setAttribute("transform", `translate(220,${150}) scale(${sc.toFixed(3)})`);
            blur.setAttribute("stdDeviation", ((SX - fxp) / 55).toFixed(2));
          };
          const sl = s.slider({ label: "Wo steht die Figur?", min: 0, max: 100, step: 1, value: 50, fmt: v => (v < 34 ? "nah an der Lampe" : v > 66 ? "nah an der Leinwand" : "in der Mitte"), onInput: upd });
          upd(50);
          const slW = s.h("div", { class: "later" }, sl);
          const e1 = box(s, "ex", "Nah an der Lampe", "Der Schatten wird <b>groß</b> und am Rand <b>unscharf</b>.");
          const e2 = box(s, "ex", "Nah an der Leinwand", "Der Schatten wird <b>klein</b> und <b>scharf</b> – fast so groß wie die Figur.");
          const m = merk(s, "Licht läuft <b>geradeaus</b> (wie in NaWi). Wo die Figur das Licht versperrt, entsteht der Schatten.");
          const top = s.h("div", { style: { display: "grid", gridTemplateColumns: "620px 440px", gap: "40px" } }, s.h("div", { class: "stack", style: { gap: "4px" } }, side, P(s, "Von der Seite: Lampe, Figur, Leinwand", "small")), s.h("div", { class: "stack", style: { gap: "4px" } }, front, P(s, "Das sehen die Zuschauer", "small")));
          s.add(stack(s, 10, top, slW, s.h("div", { class: "cols3", style: { gap: "14px" } }, e1, e2, m)));
          s.step(async () => { s.sfx.pop(); s.show(slW, "up"); s.say("Wir schieben die Figur nah an die Lampe."); await s.tween({ from: 50, to: 0, dur: 1300, ease: "inOut", update: v => sl.set(Math.round(v)) }); await s.show(e1, "up"); });
          s.step(async () => { s.sfx.swoosh(); s.say("Und jetzt nah an die Leinwand."); await s.tween({ from: 0, to: 100, dur: 1600, ease: "inOut", update: v => sl.set(Math.round(v)) }); await s.show(e2, "up"); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 7 ---- Schattentheater in aller Welt */
      {
        title: "Schattentheater in aller Welt",
        say: "Schattentheater ist sehr alt. In Indonesien und China wird es bis heute gespielt. Und eine Berlinerin hat daraus einen berühmten Film gemacht.",
        build(s) {
          const c1 = s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, s.photo("wayang-schatten", { w: 510, h: 300, pos: "50% 50%", caption: "Wayang Kulit, Bali (Indonesien)" }),
            P(s, "Die flachen Figuren sind aus <b>Leder</b>, fein gelocht und bemalt. Man führt sie an Stäben. Die UNESCO zählt Wayang Kulit seit 2003 zum Erbe der Menschheit.", "small"));
          const c2 = s.h("div", { class: "card later", style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } }, s.photo("china-schattenspiel", { w: 510, h: 300, pos: "50% 45%", caption: "Chinesisches Schattenspiel" }),
            P(s, "Die Figuren sind aus dünnem, bunt bemaltem <b>Leder</b> und haben <b>Gelenke</b>. Hinter der Leinwand bewegt man sie mit Stäben.", "small"));
          const lr = box(s, "ex", "Aus Berlin", "<b>Lotte Reiniger</b> (geboren 1899 in Berlin) schnitt Figuren aus schwarzem Papier. Daraus machte sie 1926 „Die Abenteuer des Prinzen Achmed“ – den ältesten erhaltenen langen Trickfilm.");
          s.add(stack(s, 14, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" } }, c1, c2), lr));
          s.step(async () => { s.sound("gong", { vol: .5, dur: 3 }); await s.show(c1, "zoom"); s.say("In Indonesien heißt das Schattenspiel Wayang Kulit. Dazu spielt oft ein Orchester mit Gongs."); });
          s.step(async () => { await reveal(s, c2, "zoom", "whoosh"); });
          s.step(async () => { s.sound("projektor", { vol: .4, dur: 3 }); await s.show(lr, "up"); });
        },
      },
      /* 8 ---- Einstellungsgrößen */
      {
        title: "Fotografieren: Einstellungsgrößen",
        say: "Wie viel zeigt dein Foto? Von ganz weit bis ganz nah: Das nennt man Einstellungsgrößen.",
        build(s) {
          const svg = s.svg(640, 420);
          svg.setAttribute("viewBox", "0 0 1280 840"); svg.style.display = "block";
          svg.append(s.el("rect", { x: 0, y: 0, width: 1280, height: 560, fill: "#bfe4f5" }), s.el("rect", { x: 0, y: 560, width: 1280, height: 280, fill: "#8fd085" }),
            s.el("path", { d: "M560,840 Q640,700 760,560 L820,560 Q760,700 780,840 Z", fill: "#e8d8b0" }),
            s.el("circle", { cx: 1120, cy: 110, r: 50, fill: "#ffd54a" }),
            // Fernsehturm
            s.el("line", { x1: 260, y1: 40, x2: 260, y2: 200, stroke: "#c0392b", "stroke-width": 8 }), s.el("rect", { x: 248, y: 230, width: 24, height: 330, fill: "#d6dbe3", stroke: "#8b95a5", "stroke-width": 3 }),
            s.el("circle", { cx: 260, cy: 230, r: 40, fill: "#c8ced8", stroke: "#8b95a5", "stroke-width": 3 }), s.el("rect", { x: 222, y: 224, width: 76, height: 10, fill: "#7a8494" }),
            // tree + bench
            s.el("rect", { x: 1030, y: 420, width: 30, height: 160, fill: "#7a4a22" }), s.el("circle", { cx: 1045, cy: 380, r: 90, fill: "#4a9d4a" }),
            s.el("rect", { x: 880, y: 600, width: 150, height: 14, fill: "#8d5538" }), s.el("rect", { x: 890, y: 614, width: 10, height: 40, fill: "#5a3420" }), s.el("rect", { x: 1010, y: 614, width: 10, height: 40, fill: "#5a3420" }));
          const fig = figure(s, { shirt: "#ee7a1a" }); fig.g.setAttribute("transform", "translate(470,310)"); fig.draw(POSES.winken); svg.append(fig.g);
          const H = [470 + fig.pts.hc[0], 310 + fig.pts.hc[1]];
          const R = 640 / 420;
          const frame = (top, bottom, cx = 700) => { const h = bottom - top, w = h * R; return [cx - w / 2, top, w, h]; };
          const F = {
            totale: { n: "Totale", t: "Der ganze Ort: Park, Turm, Baum – der Mensch ist klein.", w: "Überblick: Wo sind wir?", v: [0, 0, 1280, 840] },
            halbtotale: { n: "Halbtotale", t: "Der ganze Mensch von Kopf bis Fuß.", w: "Man sieht die ganze Körpersprache.", v: frame(H[1] - 70, 790) },
            halbnah: { n: "Halbnah", t: "Vom Kopf bis zur Hüfte.", w: "Wie im Gespräch: Gesicht und Hände.", v: frame(H[1] - 60, 680) },
            nah: { n: "Nah", t: "Kopf und Brust.", w: "Jetzt zählt die Mimik.", v: frame(H[1] - 52, H[1] + 120) },
            gross: { n: "Groß", t: "Nur das Gesicht.", w: "Ganz viel Gefühl – wir sind ganz dicht dran.", v: frame(H[1] - 46, H[1] + 46, H[0]) },
            detail: { n: "Detail", t: "Ein winziger Ausschnitt: ein Auge.", w: "Spannung! Worauf sollen wir achten?", v: frame(H[1] - 18, H[1] + 10, H[0] - 14) },
          };
          let cur = [0, 0, 1280, 840];
          const nameEl = P(s, "Totale", "big"), tEl = P(s, F.totale.t, "t"), wEl = P(s, "<b>Wirkung:</b> " + F.totale.w, "small");
          const info = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, nameEl, tEl, wEl);
          const go = async k => {
            const f = F[k]; nameEl.textContent = f.n; tEl.textContent = f.t; wEl.innerHTML = "<b>Wirkung:</b> " + f.w; s.sound("camera-shutter", { vol: .7 });
            const from = cur.slice();
            await s.tween({ from: 0, to: 1, dur: 800, ease: "inOut", update: t => { cur = from.map((a, i) => lerp(a, f.v[i], t)); svg.setAttribute("viewBox", cur.map(n => n.toFixed(1)).join(" ")); } });
          };
          const grp = pillGroup(s, Object.entries(F).map(([k, f]) => [k, f.n]), go, "totale");
          const btns = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" } }, ...Object.values(grp.btns));
          const life = box(s, "life", "Im Alltag", "Fußball im Fernsehen: Totale für das ganze Spielfeld, Groß für den Jubel nach dem Tor, Detail für den Ball auf der Linie.");
          const frameWrap = s.h("div", { style: { width: "640px", height: "420px", borderRadius: "14px", overflow: "hidden", border: "4px solid " + INK, boxSizing: "content-box" } }, svg);
          s.add(cols2(s, frameWrap, stack(s, 12, info, btns, life), 648, 20));
          s.step(async () => { s.sfx.pop(); await s.show(info, "left"); s.show(btns, "up"); s.say("Das ist die Totale. Tippe auf die anderen Einstellungen."); });
          s.step(async () => { for (const k of ["halbtotale", "halbnah", "nah", "gross", "detail"]) { grp.pick(k); await s.wait(s.fast ? 0 : 1300); } s.say("Vom Überblick bis zum winzigen Detail."); });
          s.step(async () => { grp.pick("totale"); await reveal(s, life, "up", "success"); });
        },
      },
      /* 9 ---- Licht und Blickwinkel */
      {
        title: "Licht setzen im Foto",
        say: "Woher das Licht kommt, verändert ein Gesicht total. Von vorn freundlich, von unten gruselig.",
        build(s) {
          const svg = s.svg(460, 460);
          const defs = s.el("defs", {});
          const grad = s.el("radialGradient", { id: "k9-light", gradientUnits: "userSpaceOnUse", cx: 230, cy: 200, r: 420 },
            s.el("stop", { offset: "0", "stop-color": "#141428", "stop-opacity": 0 }), s.el("stop", { offset: ".5", "stop-color": "#141428", "stop-opacity": .05 }), s.el("stop", { offset: "1", "stop-color": "#141428", "stop-opacity": .82 }));
          const clip = s.el("clipPath", { id: "k9-face" }, s.el("circle", { cx: 230, cy: 200, r: 118 }), s.el("rect", { x: 200, y: 300, width: 60, height: 60 }), s.el("path", { d: "M112,190 Q110,70 230,78 Q350,70 348,190 Z" }), s.el("path", { d: "M60,460 Q70,350 230,345 Q390,350 400,460 Z" }));
          defs.append(grad, clip);
          svg.append(defs, s.el("rect", { x: 0, y: 0, width: 460, height: 460, rx: 14, fill: "#dfe7ef" }));
          const person = s.el("g", {}, s.el("path", { d: "M60,460 Q70,350 230,345 Q390,350 400,460 Z", fill: "#3f7fbf" }), s.el("rect", { x: 200, y: 290, width: 60, height: 66, fill: SKIN }),
            s.el("circle", { cx: 230, cy: 200, r: 118, fill: SKIN }), s.el("path", { d: "M112,190 Q110,70 230,78 Q350,70 348,190 Q320,120 230,122 Q140,120 112,190 Z", fill: "#5a3a22" }),
            s.el("ellipse", { cx: 190, cy: 200, rx: 12, ry: 14, fill: INK }), s.el("ellipse", { cx: 270, cy: 200, rx: 12, ry: 14, fill: INK }),
            s.el("path", { d: "M168,172 L210,168 M250,168 L292,172", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }),
            s.el("path", { d: "M230,212 L220,250 L240,252", fill: "none", stroke: "#b88a5e", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }), s.el("path", { d: "M195,275 Q230,298 265,275", fill: "none", stroke: "#a8453a", "stroke-width": 6, "stroke-linecap": "round" }));
          const shade = s.el("g", { "clip-path": "url(#k9-face)" }, s.el("rect", { x: 0, y: 0, width: 460, height: 460, fill: "url(#k9-light)" }));
          const rim = s.el("circle", { cx: 230, cy: 200, r: 119, fill: "none", stroke: "#ffe9a0", "stroke-width": 7, opacity: 0 });
          const lamp = s.el("g", {}, ...[0, 45, 90, 135, 180, 225, 270, 315].map(a => s.el("line", { x1: 0, y1: 22, x2: 0, y2: 32, stroke: "#e09a00", "stroke-width": 4, "stroke-linecap": "round", transform: `rotate(${a})` })), s.el("circle", { r: 18, fill: "#ffe066", stroke: "#e09a00", "stroke-width": 3 }));
          svg.append(person, shade, rim, lamp);
          const L = {
            vorn: { n: "Licht von vorn", w: "flach und freundlich, kaum Schatten – wie beim Passfoto.", g: [230, 200, 420], lp: [410, 60], rim: 0 },
            seite: { n: "Licht von der Seite", w: "spannend: Eine Hälfte hell, eine dunkel. Man sieht die Form.", g: [-60, 210, 470], lp: [40, 200], rim: 0 },
            unten: { n: "Licht von unten", w: "gruselig! Wie die Taschenlampe unterm Kinn.", g: [230, 470, 380], lp: [230, 420], rim: 0 },
            hinten: { n: "Gegenlicht", w: "Man sieht nur den Umriss: eine Silhouette. Geheimnisvoll.", g: [230, -3000, 10], lp: [400, 40], rim: 1 },
          };
          let cg = L.vorn.g.slice(), cl = L.vorn.lp.slice(), cr = 0;
          const apply = () => { grad.setAttribute("cx", cg[0]); grad.setAttribute("cy", cg[1]); grad.setAttribute("r", cg[2]); lamp.setAttribute("transform", `translate(${cl[0]},${cl[1]})`); rim.setAttribute("opacity", cr); };
          apply();
          const nEl = P(s, L.vorn.n, "h2"), wEl = P(s, L.vorn.w, "t");
          const info = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, nEl, wEl);
          const go = async k => {
            const f = L[k]; nEl.textContent = f.n; wEl.textContent = f.w; s.sfx.zap();
            const g0 = cg.slice(), l0 = cl.slice(), r0 = cr;
            await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: t => { cg = g0.map((a, i) => lerp(a, f.g[i], t)); cl = l0.map((a, i) => lerp(a, f.lp[i], t)); cr = lerp(r0, f.rim, t); apply(); } });
          };
          const grp = pillGroup(s, [["vorn", "von vorn"], ["seite", "von der Seite"], ["unten", "von unten"], ["hinten", "Gegenlicht"]], go, "vorn");
          const btns = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, ...Object.values(grp.btns));
          const ex = box(s, "ex", "Und der Blickwinkel?", "Kennst du aus Kapitel 4: Von unten fotografiert wirkt jemand <b>groß und mächtig</b>, von oben <b>klein</b>.");
          const life = box(s, "life", "Im Alltag", "Sonnenuntergang am Strand gibt Silhouetten. Im Fotostudio stehen Lampen links und rechts. Horrorfilme leuchten von unten.");
          s.add(cols2(s, svg, stack(s, 12, info, btns, ex, life), 460));
          s.step(async () => { s.sfx.pop(); await s.show(info, "left"); s.show(btns, "up"); });
          s.step(async () => { for (const k of ["seite", "unten", "hinten"]) { grp.pick(k); await s.wait(s.fast ? 0 : 1400); } s.say("Tippe selbst und vergleiche."); });
          s.step(async () => { await reveal(s, ex, "up", "pop"); });
          s.step(async () => { await reveal(s, life, "up", "success"); });
        },
      },
      /* 10 ---- Bildgeschichte und Fotostory */
      {
        title: "Bildgeschichte und Fotostory",
        say: "Mehrere Bilder hintereinander erzählen eine Geschichte. Das kann man zeichnen oder mit Fotos machen.",
        build(s) {
          const ph = s.photo("max-moritz", { w: 500, h: 245, pos: "50% 50%", caption: "Wilhelm Busch: Max und Moritz (1865)" });
          const intro = box(s, "ex", "Bildgeschichte", "Wilhelm Busch zeichnete <b>Max und Moritz</b> Bild für Bild, mit Versen darunter. Solche Bildgeschichten gelten als Vorläufer des Comics.", false);
          const intro2 = box(s, "ex", "Fotostory", "Dasselbe mit Fotos: Ihr spielt jede Szene als <b>Standbild</b> und fotografiert sie. Wechselt die Einstellungsgrößen!");
          const panel = (draw) => { const v = s.svg(250, 150); v.append(s.el("rect", { x: 2, y: 2, width: 246, height: 146, rx: 8, fill: "#f4f8fb" })); draw(v); v.append(s.el("rect", { x: 2, y: 2, width: 246, height: 146, rx: 8, fill: "none", stroke: INK, "stroke-width": 3 })); return v; };
          const p1 = panel(v => { v.append(s.el("rect", { x: 4, y: 110, width: 242, height: 36, fill: "#c9b79a" }), s.el("rect", { x: 20, y: 26, width: 130, height: 86, fill: "#e8b87a", stroke: "#a8753a", "stroke-width": 3 }),
            ...[0, 1, 2].flatMap(i => [s.el("rect", { x: 32 + i * 40, y: 40, width: 24, height: 20, fill: "#cfeaf7" }), s.el("rect", { x: 32 + i * 40, y: 74, width: 24, height: 20, fill: "#cfeaf7" })]), s.el("circle", { cx: 214, cy: 30, r: 16, fill: "#ffd54a" }));
            const f = figure(s, { shirt: "#ee7a1a" }); place(f, 196, 132, .2); v.append(f.g); v.append(s.el("rect", { x: 188, y: 92, width: 14, height: 16, rx: 3, fill: RED })); });
          const p2 = panel(v => { const f = figure(s, { shirt: "#ee7a1a" }); f.draw(POSES.angst); f.g.setAttribute("transform", "translate(-219,-200) scale(1.3)"); v.append(f.g);
            v.append(s.el("path", { d: "M144,18 L234,18 Q242,18 242,26 L242,60 Q242,68 234,68 L170,68 L156,84 L160,68 L144,68 Q136,68 136,60 L136,26 Q136,18 144,18 Z", fill: "#fff", stroke: INK, "stroke-width": 2.5 }), s.el("text", { x: 189, y: 50, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: INK, text: "Mein Brot?" })); });
          const p3 = panel(v => { v.append(s.el("rect", { x: 50, y: 66, width: 150, height: 60, rx: 10, fill: "#5fb76a", stroke: "#2f7d32", "stroke-width": 4 }), s.el("rect", { x: 60, y: 74, width: 130, height: 44, rx: 6, fill: "#e9f6ea" }),
            s.el("path", { d: "M50,66 L70,22 L220,22 L200,66 Z", fill: "#7fcb87", stroke: "#2f7d32", "stroke-width": 4 }), ...[[90, 100], [120, 92], [150, 106], [170, 96]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 3, fill: "#c49a5a" }))); });
          const p4 = panel(v => { v.append(s.el("rect", { x: 4, y: 116, width: 242, height: 30, fill: "#c9b79a" }), s.el("ellipse", { cx: 160, cy: 100, rx: 44, ry: 22, fill: "#b07a45" }), s.el("circle", { cx: 204, cy: 78, r: 18, fill: "#b07a45" }), s.el("ellipse", { cx: 196, cy: 66, rx: 7, ry: 14, fill: "#7a4f2a" }),
            s.el("rect", { x: 128, y: 112, width: 8, height: 22, fill: "#b07a45" }), s.el("rect", { x: 180, y: 112, width: 8, height: 22, fill: "#b07a45" }), s.el("path", { d: "M118,92 Q100,80 106,66", fill: "none", stroke: "#b07a45", "stroke-width": 6, "stroke-linecap": "round" }),
            s.el("circle", { cx: 210, cy: 74, r: 3, fill: INK }), s.el("rect", { x: 214, y: 80, width: 24, height: 14, rx: 3, fill: "#f4d58a", stroke: "#b8862a", "stroke-width": 2 }));
            const f = figure(s, { shirt: "#ee7a1a" }); f.draw(POSES.freude); place(f, 60, 134, .27); v.append(f.g); });
          const pc = (svg, t) => s.h("div", { class: "later stack", style: { gap: "4px" } }, svg, P(s, t, "small"));
          const q1 = pc(p1, "<b>1 Totale:</b> Pause auf dem Schulhof."), q2 = pc(p2, "<b>2 Nah:</b> Wo ist mein Pausenbrot?"), q3 = pc(p3, "<b>3 Detail:</b> Die Dose ist leer!"), q4 = pc(p4, "<b>4 Halbtotale:</b> Der Hund war’s.");
          const top = s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "20px", alignItems: "center" } }, ph, stack(s, 10, intro, intro2));
          s.add(s.h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", gap: "22px", height: "100%" } }, top, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 250px)", gap: "16px" } }, q1, q2, q3, q4)));
          s.step(async () => { await reveal(s, intro2, "up", "pop"); });
          [q1, q2, q3, q4].forEach((q, i) => s.step(async () => { s.sound("camera-shutter", { vol: .6 }); await s.show(q, "up"); if (i === 3) { s.sfx.success(); s.say("Anfang, Mitte, Ende – und jedes Bild in einer anderen Einstellungsgröße."); } }));
        },
      },
      /* 11 ---- Daumenkino */
      {
        title: "Daumenkino: Bilder laufen",
        say: "Ein Daumenkino hat viele Bilder mit kleinen Unterschieden. Blätterst du schnell, siehst du Bewegung.",
        build(s) {
          const W = 560, Hc = 340, GY = 300;
          const page = s.canvas(W, Hc), strip = s.canvas(W, 64);
          page.canvas.style.borderRadius = "12px"; page.canvas.style.border = "3px solid " + INK; strip.canvas.style.borderRadius = "8px";
          const base = () => { const f = []; for (let i = 0; i < 10; i++) { const x = 60 + i * 48, ph = (i % 5) / 4; f.push({ x, y: GY - 26 - 190 * (1 - Math.pow(2 * ph - 1, 2)) }); } return f; };
          let frames = base(), cur = 0, playing = false, fps = 8, acc = 0;
          const drawBall = (g, f, a, rm = 1) => { const squash = f.y > GY - 34 ? 1.25 : 1; g.globalAlpha = a; g.fillStyle = RED; g.beginPath(); g.ellipse(f.x, f.y + (squash > 1 ? 4 : 0), 26 * squash * rm, 26 / squash * rm, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; };
          const render = () => {
            const g = page.g; g.clearRect(0, 0, W, Hc); g.fillStyle = "#fffaf0"; g.fillRect(0, 0, W, Hc);
            g.strokeStyle = "#8b95a5"; g.lineWidth = 4; g.beginPath(); g.moveTo(20, GY); g.lineTo(W - 20, GY); g.stroke();
            if (!playing && cur > 0) drawBall(g, frames[cur - 1], .18);
            drawBall(g, frames[cur], 1);
            g.fillStyle = INK; g.font = "700 22px sans-serif"; g.fillText(`Bild ${cur + 1} von ${frames.length}`, 20, 34);
            const sg = strip.g, n = frames.length, tw = Math.min(56, (W - 8) / n), th = 40;
            sg.clearRect(0, 0, W, 64);
            frames.forEach((f, i) => { const x = 4 + i * tw; sg.save(); sg.translate(x, 12); sg.fillStyle = i === cur ? "#ffe9a8" : "#fff"; sg.fillRect(0, 0, tw - 4, th); sg.strokeStyle = i === cur ? UC : "#b9c3cf"; sg.lineWidth = i === cur ? 3 : 1.5; sg.strokeRect(0, 0, tw - 4, th); sg.beginPath(); sg.rect(0, 0, tw - 4, th); sg.clip(); sg.scale((tw - 4) / W, th / Hc); drawBall(sg, f, 1, 2.6); sg.restore(); });
          };
          render();
          s.drag(page.canvas, { space: page.canvas, onStart: p => { if (playing) return; frames[cur] = { x: clamp(p.x, 30, W - 30), y: clamp(p.y, 50, GY - 26) }; render(); }, onMove: p => { if (playing) return; frames[cur] = { x: clamp(p.x, 30, W - 30), y: clamp(p.y, 50, GY - 26) }; render(); } });
          const stepTo = d => { cur = (cur + d + frames.length) % frames.length; s.sfx.tick(); render(); };
          let stopLoop = null;
          const play = on => { playing = on; playB.lastChild.textContent = on ? "Stopp" : "Abspielen"; if (stopLoop) { stopLoop(); stopLoop = null; } if (on) { s.sound("papier-reiben", { vol: .4, dur: 1 }); acc = 0; stopLoop = s.loop((t, dt) => { acc += dt; if (acc >= 1 / fps) { acc = 0; cur = (cur + 1) % frames.length; render(); } }); } render(); };
          const btn = (t, f, solid) => s.h("button", { class: "btn" + (solid ? " solid" : ""), onclick: f }, s.h("span", null, t));
          const prevB = btn("◀", () => { if (!playing) stepTo(-1); }), nextB = btn("▶", () => { if (!playing) stepTo(1); });
          const addB = btn("+ Bild", () => { if (playing || frames.length >= 16) return; const f = frames[cur]; frames.splice(cur + 1, 0, { x: clamp(f.x + 30, 30, W - 30), y: f.y }); cur++; s.sfx.pop(); render(); });
          const playB = btn("Abspielen", () => { s.sfx.click(); play(!playing); }, true);
          const newB = btn("Neu", () => { play(false); frames = base(); cur = 0; s.sfx.whoosh(); render(); });
          const ctr = s.h("div", { class: "later", style: { display: "flex", gap: "8px" } }, prevB, nextB, addB, playB, newB);
          const sl = s.slider({ label: "Bilder pro Sekunde", min: 2, max: 24, step: 1, value: 8, fmt: v => v + " Bilder/s", onInput: v => { fps = v; } });
          const slW = s.h("div", { class: "later" }, sl);
          const ph = s.photo("kineograph", { w: 236, h: 300, pos: "50% 30%", caption: "Kineograph", cls: "later" });
          const txt = box(s, "ex", "1868", "John Barnes Linnett aus England ließ das Daumenkino patentieren. Er nannte es <b>Kineograph</b>: „bewegtes Bild“.");
          const tip = P(s, "Ziehe den Ball an eine neue Stelle. Mit <b>+ Bild</b> machst du ein neues Bild. Der blasse Ball zeigt das Bild davor.", "small", true);
          const m = merk(s, "Viele Bilder mit <b>kleinen Unterschieden</b>, schnell hintereinander: Dein Auge sieht <b>Bewegung</b>.");
          const right = stack(s, 10, s.h("div", { style: { display: "grid", gridTemplateColumns: "236px 1fr", gap: "12px", alignItems: "start" } }, ph, txt), tip, m);
          s.add(cols2(s, stack(s, 8, page.canvas, strip.canvas, ctr, slW), right, 560, 24));
          s.step(async () => { s.say("Schau: Wir spielen die zehn Bilder schnell ab."); s.show(ctr, "up"); s.show(slW, "up"); play(true); await s.wait(s.fast ? 0 : 2600); });
          s.step(async () => { play(false); cur = 0; render(); await reveal(s, tip, "up", "pop"); s.say("Jetzt du: Zieh den Ball und bau dein eigenes Daumenkino."); });
          s.step(async () => { s.sound("papier-reiben", { vol: .5, dur: 1 }); s.show(ph, "zoom"); await s.show(txt, "left"); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 12 ---- Muybridge, Stop-Motion und Film */
      {
        title: "Vom Foto zum Film",
        say: "Achtzehnhundertachtundsiebzig fotografierte Eadweard Muybridge ein Pferd im Galopp. Spielt man die Fotos schnell ab, läuft das Pferd.",
        build(s) {
          const PW = 520, PH = 320, k = PW / 1100;
          const fig = s.photo("muybridge-pferd", { w: PW, h: PH, pos: "50% 50%" });
          const ov = s.svg(PW, PH); ov.style.cssText = `position:absolute;left:0;top:0;width:${PW}px;height:${PH}px;pointer-events:none`;
          const hi = s.el("rect", { width: 252 * k, height: 162 * k, fill: "none", stroke: "#ffcc00", "stroke-width": 5, rx: 4 });
          ov.append(hi);
          const wrap = s.h("div", { style: { position: "relative", width: PW + "px", height: PH + "px" } }, fig, ov);
          const CX = [26, 290, 554, 818], CY = [28, 200, 372];
          const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push([CX[c], CY[r]]);
          const run = cells.slice(0, 11);
          const cv = s.canvas(400, 257); cv.canvas.style.borderRadius = "12px"; cv.canvas.style.border = "3px solid " + INK;
          const img = fig.querySelector("img");
          let fr = 0, fps = 12, acc = 0, on = false;
          const draw = () => {
            const [x, y] = run[fr]; hi.setAttribute("x", x * k); hi.setAttribute("y", y * k);
            const g = cv.g; g.fillStyle = "#222"; g.fillRect(0, 0, 400, 257);
            if (img.complete && img.naturalWidth) { const q = img.naturalWidth / 1100; g.drawImage(img, x * q, y * q, 252 * q, 162 * q, 0, 0, 400, 257); }
          };
          if (img.complete) draw(); else img.addEventListener("load", draw);
          draw();
          const start = () => { if (on) return; on = true; s.loop((t, dt) => { if (!on) return false; acc += dt; if (acc >= 1 / fps) { acc = 0; fr = (fr + 1) % run.length; draw(); } }); };
          const sl = s.slider({ label: "Bilder pro Sekunde", min: 1, max: 24, step: 1, value: 12, fmt: v => v + " Bilder/s", onInput: v => { fps = v; } });
          const slW = s.h("div", { class: "later" }, sl);
          const cvW = s.h("div", { class: "later" }, cv.canvas);
          const e1 = box(s, "ex", "1878", "Muybridge stellte viele Kameras nebeneinander. Das Pferd löste sie im Vorbeilaufen aus. So sah man zum ersten Mal: Kurz sind <b>alle vier Hufe in der Luft</b>.", false);
          const e2 = box(s, "ex", "Stop-Motion", "Du bewegst eine Knete- oder Legofigur ein winziges Stück und machst jedes Mal ein Foto. Bei <b>12 Bildern pro Sekunde</b> brauchst du für 10 Sekunden Film 120 Fotos.");
          const m = merk(s, "Ein Film ist eine schnelle Folge von Fotos. Im Kino laufen <b>24 Bilder pro Sekunde</b>.");
          s.add(stack(s, 12, s.h("div", { style: { display: "grid", gridTemplateColumns: `${PW}px 1fr`, gap: "24px", alignItems: "start" } }, stack(s, 10, wrap, e1), stack(s, 10, cvW, slW, e2)), m));
          s.step(async () => { s.sound("projektor", { vol: .45 }); s.show(cvW, "zoom"); await s.show(slW, "up"); start(); s.say("Das sind die echten Fotos von damals. Das Pferd galoppiert!"); });
          s.step(async () => { await reveal(s, e2, "up", "pop"); s.say("Mit Stop-Motion kannst du selbst Trickfilme machen."); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 13 ---- Kostüm und Bühnenbild */
      {
        title: "Kostüm und Bühnenbild",
        say: "Das Kostüm zeigt, wer jemand ist. Das Bühnenbild zeigt, wo die Geschichte spielt.",
        build(s) {
          const svg = s.svg(560, 400);
          const bg = s.el("g", {});
          svg.append(bg, s.el("rect", { x: 0, y: 330, width: 560, height: 70, fill: "#b07a45" }));
          const fig = figure(s, { shirt: "#8b95a5" }); place(fig, 280, 372, .66); svg.append(fig.g);
          svg.append(s.el("path", { d: "M0,0 L560,0 L560,40 Q280,20 0,40 Z", fill: "#7d0c22" }), s.el("rect", { x: 0, y: 0, width: 26, height: 400, fill: "#a3122b" }), s.el("rect", { x: 534, y: 0, width: 26, height: 400, fill: "#a3122b" }));
          const P0 = fig.pts; const hc = P0.hc, nk = P0.neck;
          const SETS = {
            wald: () => [s.el("rect", { x: 0, y: 0, width: 560, height: 340, fill: "#cfe8cf" }), ...[70, 170, 400, 490].map((x, i) => s.el("g", {}, s.el("rect", { x: x - 10, y: 200, width: 20, height: 140, fill: "#7a4a22" }), s.el("polygon", { points: `${x},${60 + i * 12} ${x - 60},240 ${x + 60},240`, fill: i % 2 ? "#2f7d32" : "#3f9a46" })))],
            schloss: () => [s.el("rect", { x: 0, y: 0, width: 560, height: 340, fill: "#e9e1f3" }), s.el("rect", { x: 60, y: 120, width: 440, height: 220, fill: "#c8bfd8", stroke: "#8a7fa3", "stroke-width": 3 }),
              ...[60, 440].map(x => s.el("rect", { x, y: 70, width: 60, height: 270, fill: "#b9aecd", stroke: "#8a7fa3", "stroke-width": 3 })), ...[80, 460].map(x => s.el("polygon", { points: `${x - 26},70 ${x + 10},10 ${x + 46},70`, fill: "#8e2a20" })),
              s.el("path", { d: "M240,340 L240,250 Q280,210 320,250 L320,340 Z", fill: "#6b5a85" })],
            meer: () => [s.el("rect", { x: 0, y: 0, width: 560, height: 220, fill: "#bfe4f5" }), s.el("rect", { x: 0, y: 220, width: 560, height: 120, fill: "#3b8fd0" }), s.el("circle", { cx: 460, cy: 90, r: 40, fill: "#ffd54a" }),
              s.el("path", { d: "M0,250 Q35,235 70,250 T140,250 T210,250 T280,250 T350,250 T420,250 T490,250 T560,250", fill: "none", stroke: "#fff", "stroke-width": 4 }), s.el("path", { d: "M80,200 L200,200 L180,225 L100,225 Z", fill: "#7a4a22" }), s.el("polygon", { points: "140,198 140,110 186,190", fill: "#fff", stroke: INK, "stroke-width": 2 })],
          };
          const COST = {
            koenig: { shirt: "#c0392b", back: () => [s.el("path", { d: `M${nk[0] - 30},${nk[1] + 4} L${nk[0] - 70},${nk[1] + 210} L${nk[0] + 70},${nk[1] + 210} L${nk[0] + 30},${nk[1] + 4} Z`, fill: "#7d0c22" })],
              front: () => [s.el("polygon", { points: `${hc[0] - 30},${hc[1] - 34} ${hc[0] - 34},${hc[1] - 72} ${hc[0] - 15},${hc[1] - 52} ${hc[0]},${hc[1] - 78} ${hc[0] + 15},${hc[1] - 52} ${hc[0] + 34},${hc[1] - 72} ${hc[0] + 30},${hc[1] - 34}`, fill: "#f2c94c", stroke: "#b8860b", "stroke-width": 3 })] },
            pirat: { shirt: "#1d5bd0", back: () => [],
              front: () => [s.el("path", { d: `M${hc[0] - 60},${hc[1] - 30} Q${hc[0]},${hc[1] - 90} ${hc[0] + 60},${hc[1] - 30} Q${hc[0]},${hc[1] - 48} ${hc[0] - 60},${hc[1] - 30} Z`, fill: "#1b1b22" }), s.el("circle", { cx: hc[0] + 14, cy: hc[1] - 4, r: 11, fill: "#1b1b22" }), s.el("line", { x1: hc[0] - 34, y1: hc[1] - 22, x2: hc[0] + 36, y2: hc[1] + 4, stroke: "#1b1b22", "stroke-width": 3 }),
                s.el("line", { x1: P0.hR[0], y1: P0.hR[1], x2: P0.hR[0] + 10, y2: P0.hR[1] + 70, stroke: "#c8ced8", "stroke-width": 7, "stroke-linecap": "round" })] },
            zauberer: { shirt: "#5b3fa6", back: () => [s.el("path", { d: `M${nk[0] - 36},${nk[1] + 4} L${nk[0] - 80},${nk[1] + 230} L${nk[0] + 80},${nk[1] + 230} L${nk[0] + 36},${nk[1] + 4} Z`, fill: "#3b2a7a" })],
              front: () => [s.el("polygon", { points: `${hc[0] - 48},${hc[1] - 26} ${hc[0] + 6},${hc[1] - 130} ${hc[0] + 48},${hc[1] - 26}`, fill: "#3b2a7a", stroke: "#ffd54a", "stroke-width": 3 }), s.el("circle", { cx: hc[0] + 2, cy: hc[1] - 70, r: 7, fill: "#ffd54a" }),
                s.el("path", { d: `M${hc[0] - 24},${hc[1] + 18} Q${hc[0]},${hc[1] + 80} ${hc[0] + 24},${hc[1] + 18} Z`, fill: "#f4f4f4", stroke: "#b9c3cf", "stroke-width": 2 })] },
          };
          const setSet = k => { bg.replaceChildren(...SETS[k]()); };
          const setCost = k => { const c = COST[k]; fig.shirt(c.shirt); fig.back.replaceChildren(...c.back()); fig.front.replaceChildren(...c.front()); };
          setSet("wald");
          const gS = pillGroup(s, [["wald", "Wald"], ["schloss", "Schloss"], ["meer", "Meer"]], k => { setSet(k); s.sfx.swoosh(); if (k === "meer") s.sound("waves", { vol: .4, dur: 2.5 }); if (k === "wald") s.sound("birds", { vol: .4, dur: 2.5 }); }, "wald");
          const gK = pillGroup(s, [["koenig", "König"], ["pirat", "Pirat"], ["zauberer", "Zauberer"]], k => { setCost(k); s.sfx.pop(); });
          const r1 = row(s, "Bühnenbild:", Object.values(gS.btns)), r2 = row(s, "Kostüm:", Object.values(gK.btns));
          const ph = s.photo("buehnenbild-tristan", { w: 480, h: 290, pos: "50% 50%", caption: "Bühnenbild-Modell, München 1865", cls: "later" });
          const e1 = box(s, "ex", "Echtes Modell", "Für die Oper „Tristan und Isolde“ baute Angelo Quaglio zuerst ein <b>kleines Modell</b> der Bühne. So plant man bis heute.");
          const m = merk(s, "<b>Kostüm</b>: Wer ist die Figur? <b>Bühnenbild</b>: Wo und wann spielt es? Farbe, Form und Requisiten verraten es.");
          s.add(cols2(s, stack(s, 10, svg, r1, r2), stack(s, 10, ph, e1, m), 560, 24));
          s.step(async () => { s.show(r1, "up"); s.say("Wo spielt die Geschichte? Im Wald, im Schloss oder am Meer?"); for (const k of ["schloss", "meer", "wald"]) { gS.pick(k); await s.wait(s.fast ? 0 : 900); } });
          s.step(async () => { s.show(r2, "up"); s.say("Und wer ist die Figur?"); for (const k of ["koenig", "pirat", "zauberer"]) { gK.pick(k); await s.wait(s.fast ? 0 : 900); } gS.pick("schloss"); gK.pick("koenig"); });
          s.step(async () => { s.sfx.whoosh(); s.show(ph, "zoom"); await s.show(e1, "up"); });
          s.step(async () => { await reveal(s, m, "up", "ding"); });
        },
      },
      /* 14 ---- Im Alltag */
      {
        title: "Im Alltag: alles inszeniert?",
        say: "Werbung, Selfies, Fotos im Internet und euer Schultheater: Überall wird inszeniert. Tippe auf eine Karte, um sie nochmal zu sehen.",
        build(s) {
          const mk = (title, text, drawFn) => {
            const svg = s.svg(170, 130); svg.style.cssText = "width:220px;height:168px;flex:none"; const api = drawFn(svg);
            const c = s.h("div", { class: "life later", style: { display: "flex", gap: "16px", alignItems: "center", cursor: "pointer" }, onclick: async () => { s.sfx.click(); await api(); } },
              svg, s.h("div", null, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "h2", style: { fontSize: "27px" } }, title), s.h("p", { class: "small", style: { marginTop: "6px" }, html: text })));
            c.api = api; return c;
          };
          const c1 = mk("Werbung", "Der Burger im Werbefoto ist <b>gestylt</b>: hoch und perfekt. In echt ist er oft flacher.", v => {
            const g = s.el("g", {}, s.el("path", { d: "M30,60 Q85,0 140,60 Z", fill: "#e0a040" }), s.el("rect", { x: 26, y: 60, width: 118, height: 12, rx: 5, fill: "#5fb76a" }), s.el("rect", { x: 30, y: 72, width: 110, height: 22, rx: 8, fill: "#7a3f22" }), s.el("rect", { x: 28, y: 94, width: 114, height: 9, fill: "#ffd54a" }), s.el("path", { d: "M30,103 L140,103 Q140,124 85,124 Q30,124 30,103 Z", fill: "#e0a040" }));
            v.append(g);
            return async () => { s.sfx.boing(); await s.tween({ from: 0, to: 1, dur: 500, ease: "out", update: t => g.setAttribute("transform", `translate(0,${124 * .45 * t}) scale(1,${1 - .45 * t})`) }); await s.wait(500); await s.tween({ from: 1, to: 0, dur: 400, update: t => g.setAttribute("transform", `translate(0,${124 * .45 * t}) scale(1,${1 - .45 * t})`) }); };
          });
          const c2 = mk("Selfie", "Arm hoch, Licht von vorn, bestes Lächeln: Ein Selfie ist <b>geplant</b>.", v => {
            v.append(s.el("rect", { x: 45, y: 6, width: 80, height: 118, rx: 12, fill: INK }), s.el("rect", { x: 51, y: 16, width: 68, height: 98, rx: 4, fill: "#bfe4f5" }), s.el("circle", { cx: 85, cy: 56, r: 20, fill: SKIN }), s.el("path", { d: "M74,62 Q85,72 96,62", fill: "none", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 78, cy: 52, r: 2.5, fill: INK }), s.el("circle", { cx: 92, cy: 52, r: 2.5, fill: INK }), s.el("path", { d: "M58,114 Q85,80 112,114 Z", fill: "#ee7a1a" }));
            const flash = s.el("rect", { x: 51, y: 16, width: 68, height: 98, rx: 4, fill: "#fff", opacity: 0 }); v.append(flash);
            return async () => { s.sound("camera-shutter", { vol: .7 }); await s.tween({ from: 1, to: 0, dur: 500, update: o => flash.setAttribute("opacity", o) }); };
          });
          const c3 = mk("Internet oder echt?", "Ein Foto zeigt nur einen <b>Ausschnitt</b>. Was daneben liegt, siehst du nicht.", v => {
            const mess = s.el("g", {}, s.el("rect", { x: 4, y: 4, width: 162, height: 122, rx: 6, fill: "#f2e6d2" }), ...[[16, 20, "#dc3b2a", 20], [140, 100, "#1d5bd0", -30], [20, 104, "#7b4fd6", 40], [146, 22, "#138a5a", 10], [12, 62, "#ee7a1a", -15]].map(([x, y, c, r]) => s.el("rect", { x: x - 10, y: y - 6, width: 22, height: 12, rx: 3, fill: c, transform: `rotate(${r} ${x} ${y})` })));
            const tidy = s.el("g", {}, s.el("rect", { x: 45, y: 33, width: 80, height: 64, fill: "#fffaf0", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 70, cy: 70, r: 12, fill: "#c47a4a" }), s.el("rect", { x: 88, y: 56, width: 26, height: 32, rx: 3, fill: "#5fb76a" }));
            const cover = s.el("path", { d: "M0,0 H170 V130 H0 Z M45,33 V97 H125 V33 Z", "fill-rule": "evenodd", fill: "#e6f6ee" });
            v.append(mess, tidy, cover);
            return async () => { s.sfx.whoosh(); await s.tween({ from: 1, to: 0, dur: 700, update: o => cover.setAttribute("opacity", o) }); await s.wait(900); await s.tween({ from: 0, to: 1, dur: 500, update: o => cover.setAttribute("opacity", o) }); };
          });
          const c4 = mk("Schultheater", "Kostüm, Bühnenbild, Licht und Standbilder: Eure Aufführung ist eine <b>Inszenierung</b>.", v => {
            v.append(s.el("rect", { x: 4, y: 4, width: 162, height: 122, rx: 6, fill: "#3b2d4f" }), s.el("rect", { x: 4, y: 100, width: 162, height: 26, fill: "#b07a45" }));
            const f = figure(s, { shirt: "#c0392b" }); f.draw(POSES.freude); place(f, 85, 112, .2); v.append(f.g);
            const cl = s.el("rect", { x: 4, y: 4, width: 81, height: 122, fill: "#bd1a35" }), cr = s.el("rect", { x: 85, y: 4, width: 81, height: 122, fill: "#bd1a35" }); v.append(cl, cr);
            const set = t => { cl.setAttribute("transform", `translate(4,0) scale(${1 - .8 * t},1) translate(-4,0)`); cr.setAttribute("transform", `translate(166,0) scale(${1 - .8 * t},1) translate(-166,0)`); };
            set(1);
            return async () => { set(0); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 900, ease: "inOut", update: set }); s.sound("applause", { vol: .4, dur: 2 }); };
          });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "100%", alignContent: "center" } }, c1, c2, c3, c4));
          [c1, c2, c3, c4].forEach(c => s.step(async () => { s.sfx.whoosh(); await s.show(c, "up"); await c.api(); }));
          s.step(async () => { s.sound("applause", { vol: .5, dur: 3 }); s.confetti(550, 320, 60); s.say("Jetzt weißt du, wie man inszeniert. Vorhang auf für deine eigene Szene!"); });
        },
      },
    ],
  });
})();
