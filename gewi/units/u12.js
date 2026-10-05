/* Kapitel 12 – Kindheit früher und heute (Berliner Rahmenlehrplan GeWi 5/6, Wahlmodul „Kindheit“).
   Zeitreise: Steinzeit, Ägypten, Rom, Mittelalter, Berlin um 1900, Berlin nach 1945 (Ost und West), heute,
   Kinder anderswo heute, Kinderrechte, Interview mit den Großeltern.
   Fakten geprüft 2026-10-05 (Chauvet-Höhle, Étiolles, British Museum/Walters, Bulla, römische Schule, Grottarossa-Puppe,
   KHM Wien „Kinderspiele“, LeMO Mietskaserne, Preußisches Regulativ 1839, Kinderschutzgesetz 1903, General-Land-Schul-Reglement 1763,
   preußische Schulstatistik 1901, Luftbrücke/Halvorsen, POS, KIM-Studie 2024, ILO/UNICEF 2025, UN-KRK, JArbSchG). Quellen im Bericht. */
(() => {
  const C = "#be185d", SOFT = "#fce7f1", INK = "#1b2740", PEN = "#5d6678";
  const ERAS = [
    ["Steinzeit", "vor 26.000 J.", "#8a5a2b"],
    ["Ägypten", "vor 3.500 J.", "#b7791f"],
    ["Rom", "vor 1.900 J.", "#b91c1c"],
    ["Mittelalter", "vor 600 J.", "#4d7c0f"],
    ["Berlin 1900", "vor 125 J.", "#475569"],
    ["Berlin 1945", "vor 80 J.", "#1d4ed8"],
    ["Heute", "2026", C],
  ];

  const grid = (s, tpl, ...kids) => s.h("div", { style: { display: "grid", gridTemplateColumns: tpl, gap: "24px", alignItems: "center", height: "100%" } }, ...kids);
  const exc = (s, label, cls, ...kids) => s.h("div", { class: "ex" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, label), ...kids);
  const lifeBox = (s, cls, ...kids) => s.h("div", { class: "life" + (cls ? " " + cls : "") }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const p = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, t) => s.h("b", null, t);
  const svgBox = (s, w, h) => s.el("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  const txt = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "font-size": 20, "font-weight": 700, fill: INK, "text-anchor": "middle", text: t }, o));
  const later = el => { el.classList.add("later"); return el; };
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  // station badge: "Station 3 · Rom · vor 1.900 J."
  const badge = (s, i) => s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } },
    s.h("span", { class: "chip", style: { background: ERAS[i][2], color: "#fff" } }, "Station " + (i + 1)),
    s.h("span", { class: "chip", style: { background: "#fff", border: `2px solid ${ERAS[i][2]}`, color: ERAS[i][2] } }, ERAS[i][0] + " · " + ERAS[i][1]));
  async function countUp(s, el, to, { dur = 900, post = "", from = 0, dec = 0 } = {}) {
    let last = -1;
    await s.tween({ from, to, dur, ease: "out", update: v => { el.textContent = s.fmt(dec ? Math.round(v * 10) / 10 : Math.round(v), dec) + post; const k = Math.floor((v - from) / ((to - from) / 8 || 1)); if (k !== last) { last = k; s.sfx.tick(); } } });
    el.textContent = s.fmt(to, dec) + post;
  }
  // small white symbol for each station, centred on 0,0 (about ±26)
  function eraIcon(s, k) {
    const g = s.el("g");
    const W = { fill: "#fff" }, S = { fill: "none", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" };
    if (k === 0) g.append(s.el("path", Object.assign({ d: "M0,-26 C14,-14 18,8 10,22 L-10,22 C-18,8 -14,-14 0,-26 Z" }, W)));
    if (k === 1) g.append(s.el("path", Object.assign({ d: "M-26,20 L0,-22 L26,20 Z" }, W)));
    if (k === 2) g.append(s.el("path", Object.assign({ d: "M-14,-22 L0,-6 L14,-22" }, S)), s.el("circle", Object.assign({ cx: 0, cy: 8, r: 14 }, W)));
    if (k === 3) g.append(s.el("path", Object.assign({ d: "M-18,22 L-18,-22 L-10,-22 L-10,-14 L-4,-14 L-4,-22 L4,-22 L4,-14 L10,-14 L10,-22 L18,-22 L18,22 Z" }, W)), s.el("path", { d: "M-6,22 L-6,8 Q0,2 6,8 L6,22 Z", fill: ERAS[3][2] }));
    if (k === 4) { g.append(s.el("rect", Object.assign({ x: -20, y: -24, width: 40, height: 46 }, W))); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.append(s.el("rect", { x: -15 + c * 11, y: -19 + r * 13, width: 7, height: 8, fill: ERAS[4][2] })); }
    if (k === 5) g.append(s.el("path", Object.assign({ d: "M-26,0 L26,0 M-4,-2 L-12,-20 M-4,2 L-12,20 M20,0 L24,-10" }, S)), s.el("path", Object.assign({ d: "M6,-3 L12,-24 M6,3 L12,24" }, S)));
    if (k === 6) g.append(s.el("rect", Object.assign({ x: -16, y: -24, width: 32, height: 48, rx: 6 }, W)), s.el("rect", { x: -11, y: -18, width: 22, height: 32, rx: 2, fill: C }), s.el("circle", { cx: 0, cy: 19, r: 2.5, fill: C }));
    return g;
  }

  Deck.unit({
    id: "u12", num: 12, title: "Kindheit früher und heute", color: C, soft: SOFT,
    subtitle: "Eine Zeitreise: Wie lebten, lernten und spielten Kinder?",
    blurb: "Zeitreise: Kinder in Steinzeit, Rom, Mittelalter, 1900 und heute.",
    goals: ["Ich kann erzählen, wie Kinder zu verschiedenen Zeiten lebten.", "Ich vergleiche Spielen, Lernen und Arbeiten früher und heute.", "Ich weiß, warum Kinderarbeit verboten wurde – und wo es sie noch gibt.", "Ich kann meine Großeltern zu ihrer Kindheit befragen."],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 30, fill: SOFT, stroke: C, "stroke-width": 3 }),
        el("path", { d: "M35 14 L35 35 L49 43", stroke: C, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
        el("circle", { cx: 35, cy: 35, r: 4, fill: C }),
        el("circle", { cx: 35, cy: 9, r: 2.5, fill: C }), el("circle", { cx: 61, cy: 35, r: 2.5, fill: C }), el("circle", { cx: 35, cy: 61, r: 2.5, fill: C }), el("circle", { cx: 9, cy: 35, r: 2.5, fill: C }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Eine Zeitreise in 7 Stationen",
        say: "Kinder gab es zu allen Zeiten. Aber ihr Leben sah ganz verschieden aus. Wir reisen durch die Zeit – von der Steinzeit bis heute.",
        build(s) {
          const svg = svgBox(s, 1060, 230);
          const X = i => 76 + i * 151;
          svg.append(s.el("path", { d: `M20 90 L1040 90`, stroke: PEN, "stroke-width": 4, "stroke-dasharray": "2 10", "stroke-linecap": "round" }));
          const line = s.el("path", { d: `M${X(0)} 90 L${X(6)} 90`, stroke: C, "stroke-width": 6, "stroke-linecap": "round", class: "later" });
          svg.append(line);
          const st = ERAS.map(([n, y, col], i) => {
            const g = s.el("g", { class: "later" }); fb(g);
            const ic = eraIcon(s, i); ic.setAttribute("transform", `translate(${X(i)} 90)`);
            g.append(s.el("circle", { cx: X(i), cy: 90, r: 44, fill: col, stroke: "#fff", "stroke-width": 4 }), ic, txt(s, X(i), 168, n, { fill: col, "font-size": 21 }), txt(s, X(i), 194, y, { fill: PEN, "font-size": 19, "font-weight": 600 }));
            svg.append(g); return g;
          });
          const kid = s.el("g", { class: "later" });
          kid.append(s.el("circle", { cx: 0, cy: -16, r: 8, fill: C }), s.el("path", { d: "M0,-8 L0,8 M-9,0 L9,0 M0,8 L-7,20 M0,8 L7,20", stroke: C, "stroke-width": 4, "stroke-linecap": "round" }));
          kid.setAttribute("transform", `translate(${X(0)} 22)`);
          svg.append(kid);
          const qs = [["Wohnen", "Wo und wie wohnten Kinder?"], ["Lernen", "Gingen sie zur Schule?"], ["Arbeiten", "Mussten sie mitarbeiten?"], ["Spielen", "Womit spielten sie?"]]
            .map(([a, b]) => later(s.h("div", { class: "card", style: { padding: "12px 16px", borderTop: `6px solid ${C}` } }, s.h("span", { class: "exlabel" }, a), p(s, "small", b))));
          const merk = later(s.h("div", { class: "merk" }, B(s, "Kindheit"), " ist die Zeit, bevor man erwachsen ist. Zu jeder Zeit sah sie anders aus – das zeigen uns Funde, Bilder und Erzählungen."));
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols4" }, ...qs), merk));
          s.sfx.whoosh();
          s.step(async () => {
            s.show(kid, "pop"); s.show(line, "fade");
            for (let i = 0; i < 7; i++) {
              s.sfx.count(i); s.show(st[i], "pop");
              const a = X(Math.max(0, i - 1)), b = X(i);
              await s.tween({ dur: 260, update: v => kid.setAttribute("transform", `translate(${a + (b - a) * v} ${22 - Math.sin(v * Math.PI) * 10})`) });
            }
            s.sfx.success();
          });
          s.step(async () => { for (const q of qs) { s.sfx.pop(); await s.show(q, "up"); } s.say("Auf jeder Station fragen wir: Wohnen, Lernen, Arbeiten, Spielen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Steinzeit: Lernen durch Mitmachen",
        say: "In der Steinzeit gab es keine Schule. Kinder lernten, indem sie zuschauten und mithalfen.",
        build(s) {
          const svg = svgBox(s, 480, 560);
          svg.append(s.el("rect", { x: 0, y: 0, width: 480, height: 560, rx: 18, fill: "#2b2119" }));
          svg.append(s.el("path", { d: "M0,120 Q120,95 240,110 T480,100 L480,0 L0,0 Z", fill: "#3b2e22" }));
          svg.append(txt(s, 240, 42, "Chauvet-Höhle (Frankreich)", { fill: "#f3e2c0", "font-size": 22 }), txt(s, 240, 72, "vor rund 26.000 Jahren", { fill: "#d9c39a", "font-size": 19, "font-weight": 600 }));
          const pts = [];
          for (let i = 0; i < 12; i++) { const t = i / 11; pts.push([70 + 300 * t + Math.sin(t * 5) * 22, 490 - 300 * t]); }
          const prints = pts.map(([x, y], i) => {
            const n = pts[Math.min(i + 1, 11)], q = pts[Math.max(i - 1, 0)];
            const ang = Math.atan2(n[1] - q[1], n[0] - q[0]) * 180 / Math.PI + 90;
            const side = i % 2 ? 9 : -9;
            const g = s.el("g", { class: "later", transform: `translate(${x} ${y}) rotate(${ang}) translate(${side} 0)` });
            g.append(s.el("ellipse", { cx: 0, cy: 2, rx: 7, ry: 12, fill: "#c9a97a" }));
            [-5, -2, 1, 4].forEach((tx, k) => g.append(s.el("circle", { cx: tx, cy: -13 + (k === 0 ? 1 : 0), r: 2.2, fill: "#c9a97a" })));
            svg.append(g); return g;
          });
          const glow = s.el("circle", { cx: 420, cy: 150, r: 46, fill: "#ff9a2e", opacity: 0 });
          const smudge = s.el("g", { class: "later" });
          smudge.append(s.el("path", { d: "M400,140 q8,-10 18,-4 q10,-8 18,2 q-6,10 -20,8 q-10,6 -16,-6 Z", fill: "#0d0907" }));
          svg.append(glow, smudge);
          const lab = s.el("g", { class: "later" });
          lab.append(txt(s, 240, 538, "Fußspuren eines etwa 8-jährigen Kindes", { fill: "#f3e2c0", "font-size": 19 }));
          const lab2 = later(txt(s, 190, 140, "Fackel-Spuren an der Wand", { fill: "#ffcf8a", "font-size": 19, "text-anchor": "middle" }));
          svg.append(lab, lab2);
          const c1 = exc(s, "Lernen durch Mitmachen", "later", p(s, "small", "Eine Schule gab es nicht. Kinder sammelten Beeren und Nüsse, holten Holz und Wasser und schauten den Erwachsenen bei der Arbeit zu (Kapitel 3)."));
          const c2 = exc(s, "Übungs-Steine", "later", p(s, "small", "In Étiolles (Frankreich) fand man Feuersteine, an denen Anfänger geübt haben – mit typischen Fehlern. Die Meister saßen am Feuer und nahmen den besten Stein. Die Lernenden übten am Rand mit schlechterem Stein."));
          const lf = lifeBox(s, "later", p(s, "small", "So lernst du heute noch vieles: Fahrradfahren, Schwimmen, Kochen – zuschauen, ausprobieren, üben!"));
          s.add(grid(s, "480px 1fr", svg, stack(s, 12, badge(s, 0), c1, c2, lf)));
          s.sfx.pop();
          s.step(async () => {
            for (const pr of prints) { s.sfx.tick(); s.show(pr, "fade"); await s.wait(140); }
            s.show(lab, "fade");
            s.sound("fire", { vol: .35, dur: 2.5 });
            s.loop(t => { glow.setAttribute("opacity", (0.25 + Math.sin(t * 9) * 0.06 + Math.sin(t * 23) * 0.04).toFixed(3)); });
            await s.show(smudge, "pop"); s.show(lab2, "fade");
            s.say("Ein Kind lief mit einer Fackel durch die Höhle. Es putzte die Fackel an der Wand ab.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); });
          s.step(async () => { s.sound("stein-schlag", { vol: .6 }); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Ägypten: Spielzeug aus Gräbern",
        say: "Im alten Ägypten bekamen Tote Dinge mit ins Grab – auch Spielzeug. Darum kennen wir es heute noch.",
        build(s) {
          const dogPh = s.photo("spielzeug-hund", { w: 460, h: 300, caption: "Spielzeughund aus Ägypten", pos: "50% 55%" });
          const svg = svgBox(s, 300, 170);
          svg.append(s.el("rect", { x: 0, y: 0, width: 300, height: 170, rx: 14, fill: "#f6ecd9" }));
          const body = "#c9a46a", dark = "#8a6a3b";
          svg.append(s.el("ellipse", { cx: 120, cy: 100, rx: 70, ry: 30, fill: body, stroke: dark, "stroke-width": 3 }));
          [70, 100, 140, 170].forEach(x => svg.append(s.el("rect", { x: x - 6, y: 118, width: 12, height: 34, rx: 4, fill: body, stroke: dark, "stroke-width": 3 })));
          svg.append(s.el("path", { d: "M52,90 Q30,60 46,48", stroke: dark, "stroke-width": 8, fill: "none", "stroke-linecap": "round" }));
          svg.append(s.el("circle", { cx: 200, cy: 70, r: 28, fill: body, stroke: dark, "stroke-width": 3 }), s.el("path", { d: "M188,46 L194,26 L204,44 Z", fill: dark }), s.el("circle", { cx: 210, cy: 62, r: 4, fill: INK }));
          svg.append(s.el("path", { d: "M222,62 L262,70 L258,80 L224,80 Z", fill: body, stroke: dark, "stroke-width": 3 }));
          const jaw = s.el("path", { d: "M222,84 L258,84 L254,94 L222,94 Z", fill: body, stroke: dark, "stroke-width": 3 });
          jaw.style.transformBox = "view-box"; jaw.style.transformOrigin = "222px 86px";
          const str = s.el("path", { d: "M228,94 Q236,130 270,150", stroke: "#7c2d12", "stroke-width": 2.5, fill: "none", "stroke-dasharray": "4 3" });
          svg.append(str, jaw);
          let busy = false;
          const snap = async () => { if (busy) return; busy = true; s.sfx.boing(); await s.tween({ dur: 220, update: v => jaw.style.transform = `rotate(${24 * v}deg)` }); s.sfx.snap(); await s.tween({ dur: 220, update: v => jaw.style.transform = `rotate(${24 * (1 - v)}deg)` }); busy = false; };
          const btn = s.h("button", { class: "btn solid", onclick: snap }, "An der Schnur ziehen");
          const tryBox = later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, svg, stack(s, 8, p(s, "small", "Mit einer Schnur ging das Maul auf und zu."), btn)));
          const balls = s.photo("spielbaelle-aegypten", { w: "100%", h: 200, caption: "Bälle aus Fayence, Neues Reich", pos: "50% 60%", cls: "later" });
          const c1 = exc(s, "Woher wissen wir das?", "later", p(s, "small", "Spielzeug lag als Grabbeigabe in Gräbern (Kapitel 7). Im trockenen Sand blieb es über 3.000 Jahre erhalten: Puppen, Bälle, Tiere mit beweglichen Teilen – und das Brettspiel Senet."));
          const c2 = exc(s, "Lernen und arbeiten", "later", p(s, "small", "Nur wenige Jungen gingen in die Schreiberschule (Kapitel 6). Die meisten Kinder halfen früh mit: auf dem Feld, beim Vieh und im Haus."));
          s.add(grid(s, "460px 1fr", stack(s, 14, dogPh, tryBox), stack(s, 12, badge(s, 1), balls, c1, c2)));
          s.show(dogPh, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(tryBox, "up"); await snap(); s.say("Tippe auf den Knopf: Der Hund schnappt zu!"); });
          s.step(async () => { s.sound("steine-fallen", { vol: .4, dur: 1.5 }); s.show(balls, "zoom"); await s.show(c1, "left"); });
          s.step(async () => { s.sound("korn-schuetten", { vol: .4, dur: 1.5 }); await s.show(c2, "left"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Rom: Die Bulla",
        say: "Freie römische Kinder trugen ein Amulett um den Hals: die Bulla. Sie sollte vor bösen Geistern schützen.",
        build(s) {
          const ph = s.photo("bulla-ostia", { w: 330, h: 540, fit: "contain", caption: "Goldene Bulla aus Ostia", style: { background: "#3a332c" } });
          const svg = svgBox(s, 620, 250);
          svg.append(s.el("rect", { x: 0, y: 0, width: 620, height: 250, rx: 14, fill: "#fbf3e6" }), s.el("path", { d: "M10 228 L610 228", stroke: "#c9b48f", "stroke-width": 3 }));
          // house altar (Lararium)
          svg.append(s.el("path", { d: "M470,228 L470,130 L560,130 L560,228 Z", fill: "#e8d3ad", stroke: "#8a6a3b", "stroke-width": 3 }), s.el("path", { d: "M460,132 L515,96 L570,132 Z", fill: "#b91c1c" }), txt(s, 515, 214, "Hausaltar", { "font-size": 19, fill: "#8a6a3b" }));
          const fig = s.el("g");
          const head = s.el("circle", { cx: 0, cy: -170, r: 22, fill: "#f2c7a0", stroke: INK, "stroke-width": 3 });
          const tunic = s.el("path", { d: "M-34,-144 L34,-144 L44,-40 L-44,-40 Z", fill: "#e9b949", stroke: INK, "stroke-width": 3 });
          const legs = s.el("path", { d: "M-16,-40 L-18,0 M16,-40 L18,0", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" });
          const arms = s.el("path", { d: "M-34,-138 L-52,-80 M34,-138 L52,-80", stroke: "#f2c7a0", "stroke-width": 9, "stroke-linecap": "round" });
          fig.append(legs, tunic, arms, head);
          svg.append(fig);
          const chain = s.el("path", { d: "", stroke: "#b7791f", "stroke-width": 2.5, fill: "none" });
          const bulla = s.el("circle", { cx: 0, cy: 0, r: 11, fill: "#e0b23a", stroke: "#8a5a10", "stroke-width": 2.5 });
          svg.append(chain, bulla);
          const ageT = txt(s, 24, 40, "", { "text-anchor": "start", "font-size": 24, fill: C });
          svg.append(ageT);
          const phase = p(s, "small", "");
          let onAltar = false;
          const set = a => {
            const sc = 0.42 + a / 17 * 0.58, fx = 210;
            fig.setAttribute("transform", `translate(${fx} 228) scale(${sc})`);
            tunic.setAttribute("fill", a >= 15 ? "#ffffff" : "#e9b949");
            ageT.textContent = a === 0 ? "Baby (9. Tag)" : a + (a === 1 ? " Jahr" : " Jahre");
            const cx = fx, cy = 228 - 120 * sc;
            if (a >= 15) { bulla.setAttribute("cx", 515); bulla.setAttribute("cy", 160); chain.setAttribute("d", ""); }
            else { bulla.setAttribute("cx", cx); bulla.setAttribute("cy", cy); chain.setAttribute("d", `M${cx - 14 * sc} ${228 - 148 * sc} L${cx} ${cy - 10} L${cx + 14 * sc} ${228 - 148 * sc}`); }
            if (a >= 15 && !onAltar) { onAltar = true; s.sfx.chord([0, 4, 7]); } if (a < 15) onAltar = false;
            phase.textContent = a === 0 ? "Am 8. oder 9. Tag bekommt das Baby seinen Namen – und die Bulla."
              : a < 15 ? "Die Bulla zeigt: Dieses Kind ist frei geboren. Sie soll es vor bösen Geistern schützen."
              : "Mit etwa 14 bis 16 Jahren bekommt der Junge die Männer-Toga. Die Bulla gibt er den Hausgöttern.";
          };
          const sl = s.slider({ label: "Alter", min: 0, max: 17, step: 1, value: 0, fmt: v => v + " J.", onInput: set });
          set(0);
          const panel = later(s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" } }, svg, phase, sl));
          const c2 = exc(s, "Und die Mädchen?", "later", p(s, "small", "Mädchen trugen eine ", B(s, "Lunula"), " – einen Anhänger wie eine Mondsichel. Sie legten ihn erst am Abend vor der Hochzeit ab, zusammen mit ihrem Spielzeug."));
          s.add(grid(s, "330px 1fr", ph, stack(s, 12, badge(s, 2), panel, c2)));
          s.show(ph, "zoom"); s.sound("magic-chime", { vol: .35 });
          s.step(async () => { s.sfx.whoosh(); await s.show(panel, "left"); await s.tween({ from: 0, to: 10, dur: 1400, update: v => sl.set(Math.round(v)) }); s.say("Schiebe den Regler: Das Kind wird älter."); });
          s.step(async () => { await s.tween({ from: 10, to: 16, dur: 1100, update: v => sl.set(Math.round(v)) }); s.sfx.fanfare(); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Rom: Schule mit Wachstafel",
        say: "Römische Kinder schrieben mit einem Griffel auf Wachstafeln. Mit dem breiten Ende konnte man alles wieder glatt streichen.",
        build(s) {
          const svg = svgBox(s, 500, 290);
          svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 290, rx: 16, fill: "#a0703c" }), s.el("rect", { x: 26, y: 26, width: 448, height: 238, rx: 8, fill: "#3b3326" }));
          const L = { R: "M0,120 L0,0 L40,0 Q70,0 70,30 Q70,60 40,60 L0,60 M35,60 L70,120", O: "M35,0 Q72,0 72,60 Q72,120 35,120 Q-2,120 -2,60 Q-2,0 35,0", M: "M0,120 L0,0 L35,70 L70,0 L70,120", A: "M0,120 L35,0 L70,120 M14,78 L56,78" };
          const letters = ["R", "O", "M", "A"].map((k, i) => { const e = s.el("path", { d: L[k], stroke: "#e9d9b4", "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", transform: `translate(${72 + i * 96} 85)`, class: "later" }); svg.append(e); return e; });
          const wipe = s.el("rect", { x: 26, y: 26, width: 0, height: 238, fill: "#3b3326" });
          svg.append(wipe);
          const stylus = s.el("g", { transform: "translate(440 40) rotate(35)" });
          stylus.append(s.el("path", { d: "M0,0 L6,0 L6,150 L3,165 L0,150 Z", fill: "#c9ccd2", stroke: "#6b7280", "stroke-width": 2 }), s.el("rect", { x: -5, y: -14, width: 16, height: 14, rx: 2, fill: "#c9ccd2", stroke: "#6b7280", "stroke-width": 2 }));
          svg.append(stylus);
          let busy = false;
          const write = async () => { if (busy) return; busy = true; wipe.setAttribute("width", 0); letters.forEach(l => s.hide(l)); for (const l of letters) { s.sound("pencil-write", { vol: .5, dur: .6 }); await s.show(l, "draw"); } busy = false; };
          const smooth = async () => { if (busy) return; busy = true; s.sfx.swoosh(); await s.tween({ dur: 900, update: v => wipe.setAttribute("width", 448 * v) }); letters.forEach(l => s.hide(l)); wipe.setAttribute("width", 0); busy = false; };
          const b1 = s.h("button", { class: "btn solid", onclick: write }, "Ritzen"), b2 = s.h("button", { class: "btn", onclick: smooth }, "Glatt streichen");
          const left = stack(s, 12, svg, s.h("div", { class: "row" }, b1, b2), p(s, "small", "Spitzes Ende: schreiben. Breites Ende: Wachs glatt streichen – also löschen."));
          const relief = s.photo("schulrelief-neumagen", { w: "100%", h: 250, caption: "Schulszene auf einem Grabmal, Neumagen bei Trier, um 180 n. Chr.", pos: "50% 30%", cls: "later" });
          const c1 = exc(s, "Grundschule", "later", p(s, "small", "Kinder von etwa 7 bis 11 Jahren lernten lesen, schreiben und rechnen. Die Schule kostete Geld – darum gingen längst nicht alle Kinder hin. Lehrer waren oft streng."));
          const lf = lifeBox(s, "later", p(s, "small", "Die Römer hatten schon ein „Tablet“ – aus Holz und Wachs, ganz ohne Akku."));
          s.add(grid(s, "500px 1fr", left, stack(s, 12, badge(s, 2), relief, c1, lf)));
          s.sfx.pop();
          s.step(async () => { await write(); s.say("ROMA – geritzt ins Wachs."); });
          s.step(async () => { s.sound("classroom", { vol: .3, dur: 2.5 }); s.show(relief, "zoom"); await s.show(c1, "left"); s.say("Dieses Bild aus Stein zeigt einen Lehrer mit seinen Schülern."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Römisches Spielzeug in echt",
        say: "Römische Kinder spielten mit Puppen, Nüssen, Knöchelchen, Reifen und Kreiseln.",
        build(s) {
          const doll = s.photo("puppe-rom", { w: 290, h: 560, caption: "Puppe aus Elfenbein", pos: "50% 40%" });
          const c1 = exc(s, "Eine Puppe, fast 1.900 Jahre alt", "later", p(s, "small", "Sie stammt aus dem 2. Jahrhundert n. Chr. Arme und Beine sind beweglich. Man fand sie in Rom im Sarg eines etwa 8-jährigen Mädchens."));
          const svg = svgBox(s, 330, 150);
          svg.append(s.el("rect", { x: 0, y: 0, width: 330, height: 150, rx: 14, fill: "#f3ead8" }));
          const bones = [0, 1, 2, 3].map(i => {
            const g = s.el("g"); fb(g);
            g.append(s.el("path", { d: "M-24,-12 Q-28,-22 -16,-20 Q0,-30 16,-20 Q28,-22 24,-12 Q30,0 24,12 Q28,22 16,20 Q0,30 -16,20 Q-28,22 -24,12 Q-30,0 -24,-12 Z", fill: "#efe2c4", stroke: "#8a6a3b", "stroke-width": 3 }), s.el("ellipse", { cx: 0, cy: 0, rx: 8, ry: 5, fill: "#c9a97a" }));
            g.setAttribute("transform", `translate(${50 + i * 76} 76)`); svg.append(g); return g;
          });
          const toss = async () => {
            s.sound("stoeckchen", { vol: .7 });
            const tg = bones.map(() => [Math.random() * 360, (Math.random() - .5) * 12]);
            await s.tween({ dur: 650, ease: "out", update: v => bones.forEach((b, i) => b.setAttribute("transform", `translate(${50 + i * 76 + tg[i][1] * v} ${76 - Math.sin(v * Math.PI) * 40}) rotate(${tg[i][0] * v})`)) });
          };
          const tossBtn = s.h("button", { class: "btn solid", onclick: toss }, "Knöchel werfen");
          const kn = later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "330px 1fr", gap: "14px", alignItems: "center" } },
            stack(s, 8, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, "Knöchelspiel"), svg, tossBtn),
            s.photo("bruegel-knoechel", { w: "100%", h: 236, caption: "1.400 Jahre später: Bruegel, 1560", pos: "50% 45%" })));
          const c3 = exc(s, "Nüsse, Reifen, Kreisel", "later", p(s, "small", "Knöchelchen waren kleine Fußknochen von Schafen oder Ziegen. Mit Nüssen spielte man „Paar oder Unpaar“: Sind es gerade oder ungerade viele? Dazu kamen Reifen, Kreisel, Bälle und Rasseln."));
          s.add(grid(s, "290px 1fr", doll, stack(s, 12, badge(s, 2), c1, kn, c3)));
          s.show(doll, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(kn, "up"); await toss(); });
          s.step(async () => { s.sfx.ding(); await s.show(c3, "up"); s.say("Kreisel und Reifen kennst du vielleicht auch."); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Mittelalter: früh mit anpacken",
        say: "Im Mittelalter mussten die meisten Kinder früh mitarbeiten. In die Schule gingen nur wenige.",
        build(s) {
          const tasks = [["Morgens", "Wasser vom Brunnen holen, Hühner füttern", "#f59e0b"], ["Vormittags", "Gänse oder Schweine hüten", "#84cc16"], ["Mittags", "den Eltern Essen aufs Feld bringen", "#eab308"], ["Nachmittags", "Holz sammeln, bei der Ernte helfen", "#f97316"], ["Abends", "Wolle spinnen, kleine Geschwister hüten", "#6366f1"]];
          const bar = svgBox(s, 70, 470);
          bar.append(s.el("rect", { x: 27, y: 10, width: 16, height: 450, rx: 8, fill: "#e5e7eb" }));
          const fill = s.el("rect", { x: 27, y: 10, width: 16, height: 0, rx: 8, fill: "#facc15" });
          const sun = s.el("circle", { cx: 35, cy: 30, r: 20, fill: "#facc15", stroke: "#f59e0b", "stroke-width": 4 });
          bar.append(fill, sun);
          const rows = tasks.map(([t, d, col]) => later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "150px 1fr", gap: "10px", alignItems: "center", borderLeft: `8px solid ${col}` } }, s.h("b", { style: { fontSize: "21px" } }, t), p(s, "small", d))));
          const left = s.h("div", { class: "card soft", style: { padding: "12px 16px", display: "grid", gridTemplateColumns: "70px 1fr", gap: "12px", alignItems: "center" } },
            bar, stack(s, 10, s.h("p", { class: "h2", style: { fontSize: "24px" } }, "So könnte der Tag eines Bauernkindes aussehen"), ...rows));
          const c1 = exc(s, "Schule? Nur für wenige", "later", p(s, "small", "Lesen und schreiben konnten die wenigsten. Manche Jungen lernten in Klosterschulen Latein. Später gab es in Städten auch Stadtschulen. Bauernkinder gingen fast nie zur Schule."));
          const lf = lifeBox(s, "later", p(s, "small", "Du hilfst vielleicht beim Tischdecken oder Einkaufen. Aber deine wichtigste Arbeit ist die Schule – und spielen darfst du auch."));
          s.add(grid(s, "620px 1fr", left, stack(s, 14, badge(s, 3), c1, lf)));
          s.sfx.pop();
          const go = async i => { const y = 30 + i * 105; s.tween({ dur: 450, update: v => { const yy = 30 + (i ? (i - 1) * 105 : 0) + (i ? 105 * v : 0); sun.setAttribute("cy", yy); fill.setAttribute("height", Math.max(0, yy - 10)); } }); s.sfx.count(i * 2); await s.show(rows[i], "left"); return y; };
          s.step(async () => { s.sound("birds", { vol: .3, dur: 2 }); await go(0); await go(1); });
          s.step(async () => { s.sound("schwein-grunzen", { vol: .4 }); await go(2); await go(3); });
          s.step(async () => { await go(4); s.sfx.chord([0, 3, 7]); });
          s.step(async () => { s.sound("church-bells", { vol: .3, dur: 2.5 }); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Lehrling, Geselle, Meister",
        say: "Wer ein Handwerk lernen wollte, ging als Lehrling zu einem Meister. Danach wurde er Geselle – und vielleicht einmal selbst Meister.",
        build(s) {
          const svg = svgBox(s, 520, 440);
          const steps = [["Lehrling", 20, 300, "#a16207"], ["Geselle", 180, 210, "#4d7c0f"], ["Meister", 340, 120, C]];
          const blocks = steps.map(([n, x, y, col]) => { const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x, y, width: 160, height: 430 - y, rx: 8, fill: col }), txt(s, x + 80, y + 40, n, { fill: "#fff", "font-size": 24 })); svg.append(g); return g; });
          const man = s.el("g");
          man.append(s.el("circle", { cx: 0, cy: -62, r: 13, fill: "#f2c7a0", stroke: INK, "stroke-width": 3 }), s.el("path", { d: "M-14,-48 L14,-48 L18,-16 L-18,-16 Z", fill: "#1b2740" }), s.el("path", { d: "M-8,-16 L-10,0 M8,-16 L10,0", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }));
          man.setAttribute("transform", "translate(100 300)");
          const hammer = s.el("g", { class: "later" });
          hammer.append(s.el("path", { d: "M462,70 L462,110", stroke: "#8a5a2b", "stroke-width": 6 }), s.el("rect", { x: 446, y: 58, width: 32, height: 14, rx: 3, fill: "#6b7280" }));
          svg.append(man, hammer);
          const moveTo = async i => { const [, x, y] = steps[i]; const [, x0, y0] = steps[Math.max(0, i - 1)]; s.sfx.boing(); await s.tween({ dur: 600, update: v => man.setAttribute("transform", `translate(${x0 + 80 + (x - x0) * v} ${y0 + (y - y0) * v - Math.sin(v * Math.PI) * 40})`) }); };
          const cards = [
            ["Lehrling", "Mit etwa 12 bis 14 Jahren zog ein Junge zu einem Meister. Er wohnte und aß dort. Die Eltern zahlten Lehrgeld. Die Lehre dauerte mehrere Jahre."],
            ["Geselle", "Nach der Lehre bekam er Lohn. Viele Gesellen gingen auf Wanderschaft und lernten bei anderen Meistern dazu."],
            ["Meister", "Mit einem Meisterstück zeigte er sein Können. Dann durfte er eine eigene Werkstatt führen – wenn die Zunft es erlaubte."],
          ].map(([a, b]) => exc(s, a, "later", p(s, "small", b)));
          const lf = lifeBox(s, "later", p(s, "small", "Heute heißt das Ausbildung – nach der Schule und mit Lohn. Zimmerleute auf Wanderschaft („auf der Walz“) siehst du manchmal noch."));
          s.add(grid(s, "520px 1fr", svg, stack(s, 10, badge(s, 3), ...cards, lf)));
          s.sfx.pop();
          s.step(async () => { s.sound("amboss", { vol: .45, dur: 1 }); await s.show(blocks[0], "up"); await s.show(cards[0], "left"); });
          s.step(async () => { s.show(blocks[1], "up"); await moveTo(1); s.sound("footsteps", { vol: .5, dur: 2 }); await s.show(cards[1], "left"); });
          s.step(async () => { s.show(blocks[2], "up"); await moveTo(2); s.show(hammer, "pop"); s.sfx.fanfare(); await s.show(cards[2], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Kinderspiele vor 465 Jahren",
        say: "Der Maler Pieter Bruegel malte 1560 ein Bild voller spielender Kinder. Tippe auf die Nummern und schau genau hin!",
        build(s) {
          const spots = [["Reifen treiben", .565, .9], ["Knöchelspiel", .085, .9], ["Bockspringen", .6, .53], ["Auf dem Fass reiten", .7, .76], ["Auf dem Zaun reiten", .37, .47]];
          const pic = s.photo("bruegel-kinderspiele", { w: 680, h: 494 });
          const wrap = s.h("div", { style: { position: "relative", width: "680px", height: "494px" } }, pic);
          const cv = s.canvas(350, 240); cv.canvas.style.display = "block";
          const zoom = s.h("div", { style: { width: "350px", height: "240px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 2px var(--line)" } }, cv.canvas);
          const src = pic.querySelector("img");
          let cur = [0.5, 0.5, 1];
          const draw = (x, y, z) => {
            const iw = src.naturalWidth, ih = src.naturalHeight; if (!iw) return;
            const sw = iw / z, sh = sw * 240 / 350; const sx = Math.max(0, Math.min(iw - sw, x * iw - sw / 2)), sy = Math.max(0, Math.min(ih - sh, y * ih - sh / 2));
            cv.g.drawImage(src, sx, sy, sw, sh, 0, 0, 350, 240);
          };
          if (src.complete) draw(.5, .5, 1); else src.addEventListener("load", () => { if (s.alive) draw(...cur); });
          const name = s.h("p", { class: "h2", style: { color: C } }, "Tippe auf eine Nummer!");
          const btns = spots.map(([n, x, y], i) => {
            const b = s.h("button", { class: "btn solid", style: { position: "absolute", left: `${x * 680 - 24}px`, top: `${y * 494 - 24}px`, width: "48px", minHeight: "48px", height: "48px", padding: 0, borderRadius: "50%", border: "3px solid #fff" }, onclick: () => pick(i) }, String(i + 1));
            wrap.append(b); return b;
          });
          function pick(i) {
            const [n, x, y] = spots[i];
            s.sfx.pop(); name.textContent = n;
            const from = cur.slice(), to = [x, y, 4]; cur = to;
            s.tween({ dur: 700, update: v => draw(from[0] + (to[0] - from[0]) * v, from[1] + (to[1] - from[1]) * v, from[2] === 1 ? 1 + 3 * v : 4) });
            btns.forEach((b, k) => b.classList.toggle("solid", k === i));
          }
          const c1 = exc(s, "Ein Wimmelbild", "later", p(s, "small", "Über 230 Kinder spielen hier 83 verschiedene Spiele! Das Bild hängt heute im Kunsthistorischen Museum in Wien."));
          const lf = lifeBox(s, "later", p(s, "small", "Bockspringen, Fangen, Verstecken: Viele dieser Spiele spielst du in der Hofpause heute noch."));
          s.add(grid(s, "680px 1fr", wrap, stack(s, 12, zoom, name, c1, lf)));
          s.show(wrap, "fade"); s.sound("kids-cheer", { vol: .3, dur: 2.5 });
          spots.forEach((_, i) => s.step(async () => { pick(i); if (i === 0) s.show(c1, "left"); await s.wait(400); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Berlin um 1900: Mietskaserne",
        say: "Um 1900 wuchs Berlin rasant. Viele Familien wohnten in Mietskasernen: Vorne hell und teuer, hinten dunkel und eng.",
        build(s) {
          const svg = svgBox(s, 560, 560);
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 560, rx: 14, fill: "#f1efe9" }));
          svg.append(s.el("rect", { x: 20, y: 486, width: 340, height: 60, fill: "#9ca3af" }), txt(s, 190, 524, "Straße", { fill: "#fff", "font-size": 21 }));
          const B1 = (x, y, w, h, col, l1, l2, tc = "#fff") => { const g = s.el("g", { class: "later" }); g.append(s.el("rect", { x, y, width: w, height: h, fill: col, stroke: "#4b5563", "stroke-width": 2 }), txt(s, x + w / 2, y + h / 2 + (l2 ? -4 : 7), l1, { fill: tc, "font-size": 20 })); if (l2) g.append(txt(s, x + w / 2, y + h / 2 + 20, l2, { fill: tc, "font-size": 19, "font-weight": 600 })); svg.append(g); return g; };
          const vh = B1(40, 386, 300, 90, "#f4c26b", "Vorderhaus", "groß und hell", INK);
          const sf1 = B1(40, 266, 92, 120, "#c08a52", "Seiten-", "flügel");
          const hh1 = B1(40, 186, 300, 80, "#8a6d55", "Hinterhaus", "");
          const sf2 = B1(40, 96, 92, 90, "#6f5846", "Seiten-", "flügel");
          const hh2 = B1(40, 16, 300, 80, "#57463a", "2. Hinterhaus", "klein und dunkel");
          const hofs = [later(txt(s, 236, 292, "1. Hof", { fill: PEN, "font-size": 20 })), later(txt(s, 236, 146, "2. Hof", { fill: PEN, "font-size": 20 }))];
          svg.append(...hofs);
          const circ = later(s.el("circle", { cx: 236, cy: 344, r: 38, fill: "none", stroke: "#dc2626", "stroke-width": 3, "stroke-dasharray": "7 5" }));
          const wag = later(s.el("rect", { x: 222, y: 333, width: 28, height: 22, rx: 4, fill: "#dc2626" }));
          svg.append(circ, wag);
          const grad = s.el("linearGradient", { id: "u12-gr", x1: 0, y1: 1, x2: 0, y2: 0 });
          grad.append(s.el("stop", { offset: "0", "stop-color": "#fde68a" }), s.el("stop", { offset: "1", "stop-color": "#44403c" }));
          const defs = s.el("defs"); defs.append(grad); svg.append(defs);
          const scale = s.el("g", { class: "later" });
          scale.append(s.el("rect", { x: 372, y: 30, width: 20, height: 440, rx: 10, fill: "url(#u12-gr)" }), txt(s, 404, 52, "dunkel,", { "text-anchor": "start", "font-size": 20 }), txt(s, 404, 76, "eng, billig", { "text-anchor": "start", "font-size": 19, "font-weight": 600, fill: PEN }), txt(s, 404, 438, "hell,", { "text-anchor": "start", "font-size": 20 }), txt(s, 404, 462, "groß, teuer", { "text-anchor": "start", "font-size": 19, "font-weight": 600, fill: PEN }));
          svg.append(scale);
          const num = s.h("span", { class: "big mono", style: { color: C } }, "0");
          const numBox = later(s.h("div", { class: "card", style: { padding: "10px 16px" } }, num, p(s, "small", "Menschen lebten im Dezember 1900 in der Stadt Berlin.")));
          const c1 = exc(s, "Vorne und hinten", "later", p(s, "small", "Arme Familien wohnten hinten, oft in Stube und Küche – mit vielen Kindern. Manche vermieteten sogar ein Bett an einen „Schlafgänger“. Die Höfe mussten nur 5,34 × 5,34 m groß sein: Platz zum Wenden für die Feuerwehr."));
          const play = s.photo("zille-handstand", { w: "100%", h: 170, caption: "Gespielt wurde draußen (Foto: Heinrich Zille)", pos: "50% 8%", cls: "later" });
          s.add(grid(s, "560px 1fr", svg, stack(s, 12, badge(s, 4), numBox, c1, play)));
          s.sfx.pop();
          s.step(async () => { s.sound("traffic", { vol: .25, dur: 2 }); await s.show(vh, "up"); s.sfx.pop(); await s.show(sf1, "up"); s.sfx.pop(); await s.show(hh1, "down"); s.show(hofs[0], "fade"); s.sfx.pop(); await s.show(sf2, "up"); s.sfx.pop(); await s.show(hh2, "down"); s.show(hofs[1], "fade"); });
          s.step(async () => { s.show(numBox, "left"); await countUp(s, num, 1888848, { dur: 1300 }); s.sfx.coin(); });
          s.step(async () => { await s.show(scale, "fade"); s.sound("door-creak", { vol: .4 }); await s.show(c1, "left"); s.show(circ, "draw"); await s.show(wag, "pop"); s.sound("kutsche", { vol: .4, dur: 1.5 }); await s.tween({ dur: 1200, update: v => { const a = v * Math.PI * 2; wag.setAttribute("x", 236 + Math.cos(a) * 38 - 14); wag.setAttribute("y", 344 + Math.sin(a) * 38 - 11); } }); });
          s.step(async () => { s.sound("kids-cheer", { vol: .3, dur: 2 }); await s.show(play, "zoom"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Kinderarbeit um 1900",
        say: "Viele Kinder armer Familien mussten um 1900 Geld dazuverdienen. Nach und nach wurde Kinderarbeit durch Gesetze verboten.",
        build(s) {
          const ph = s.photo("kegeljungen-zille", { w: "100%", h: 300, caption: "Kegeljungen in Berlin (Foto: Heinrich Zille)", pos: "50% 60%" });
          const c1 = exc(s, "Arbeit nach der Schule", "later", p(s, "small", "Zeitungen und Brötchen austragen, als Kegeljunge die Kegel aufstellen – oft bis spät in die Nacht. Andere halfen zu Hause bei der Heimarbeit: kleben, nähen, falten."));
          const laws = [
            ["1839", "Preußen", "Kinder unter 9 Jahren dürfen nicht in Fabriken arbeiten.", "#475569"],
            ["1903", "Deutsches Reich", "Kinderschutzgesetz: keine Arbeit in fremden Werkstätten unter 12 Jahren, keine Nachtarbeit.", "#1d4ed8"],
            ["heute", "Deutschland", "Kinderarbeit ist verboten. Ab 13 ist leichte Arbeit erlaubt, z. B. Zeitungen austragen: mit Erlaubnis der Eltern, höchstens 2 Stunden am Tag, nicht vor der Schule.", C],
          ].map(([y, w, t, col]) => later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "96px 1fr", gap: "12px", alignItems: "center", borderLeft: `8px solid ${col}` } },
            s.h("div", { style: { font: "800 30px/1 var(--f-display)", color: col, textAlign: "center" } }, y), stack(s, 2, s.h("b", { style: { fontSize: "20px" } }, w), p(s, "small", t)))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%", alignContent: "center", alignItems: "start" } },
            stack(s, 12, ph, c1), stack(s, 12, badge(s, 4), ...laws)));
          s.show(ph, "zoom"); s.sound("stimmengewirr", { vol: .25, dur: 2 });
          s.step(async () => { s.sound("papier-rascheln", { vol: .5 }); await s.show(c1, "left"); });
          laws.forEach((l, i) => s.step(async () => { s.sfx.snap(); await s.show(l, "zoom"); if (i === 2) { s.sfx.success(); s.say("Heute ist Kinderarbeit in Deutschland verboten."); } }));
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Schule um 1900",
        say: "In Preußen gab es schon lange eine Schulpflicht. Um 1900 saßen oft über fünfzig Kinder in einer Klasse.",
        build(s) {
          const ph = s.photo("klassenzimmer-1900", { w: 500, h: 300, caption: "Klassenzimmer um 1900 (Schulmuseum Leipzig)" });
          const tl = [["1717", "Der König befiehlt: Kinder sollen zur Schule."], ["1763", "Schulpflicht in Preußen: von 5 bis 13 oder 14 Jahren."], ["um 1900", "8 Jahre Volksschule für fast alle Kinder."]]
            .map(([y, t]) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, s.h("span", { class: "chip", style: { background: ERAS[4][2], color: "#fff", minWidth: "96px", justifyContent: "center" } }, y), p(s, "small", t))));
          const svg = svgBox(s, 470, 250);
          const dots = [];
          for (let i = 0; i < 54; i++) { const c = i % 9, r = Math.floor(i / 9); const d = later(s.el("circle", { cx: 30 + c * 51, cy: 24 + r * 40, r: 15, fill: "#94a3b8" })); dots.push(d); svg.append(d); }
          const n54 = s.h("b", { class: "mono" }, "0");
          const mine = s.h("b", { class: "mono", style: { color: C } }, "25");
          const paint = n => dots.forEach((d, i) => d.setAttribute("fill", i < n ? C : "#94a3b8"));
          const sl = s.slider({ label: "Deine Klasse", min: 15, max: 35, step: 1, value: 25, fmt: v => v + " Kinder", onInput: v => { mine.textContent = v; paint(v); } });
          const card = later(s.h("div", { class: "card", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" } },
            p(s, "t", n54, " Kinder pro Klasse – so viele waren es 1901 in Preußens Volksschulen im Durchschnitt."), svg, later(sl)));
          const c2 = exc(s, "Tafel und Rohrstock", "later", p(s, "small", "Man schrieb mit dem Griffel auf eine Schiefertafel. Wer störte, bekam oft Schläge mit dem Rohrstock – heute ist das streng verboten."));
          s.add(grid(s, "500px 1fr", stack(s, 12, ph, ...tl), stack(s, 12, badge(s, 4), card, c2)));
          s.show(ph, "zoom"); s.sound("school-bell", { vol: .35, dur: 2 });
          s.step(async () => { for (const t of tl) { s.sfx.pop(); await s.show(t, "left"); } });
          s.step(async () => { s.show(card, "up"); s.sound("classroom", { vol: .3, dur: 2.5 }); for (let i = 0; i < 54; i++) { s.show(dots[i], "pop"); n54.textContent = i + 1; if (i % 6 === 0) s.sfx.tick(); await s.wait(25); } });
          s.step(async () => { await s.show(sl, "up"); paint(25); s.sfx.ding(); s.say("Wie viele Kinder seid ihr in deiner Klasse? Stell es mit dem Regler ein."); });
          s.step(async () => { s.sound("chalk-write", { vol: .5, dur: 1.5 }); await s.show(c2, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Berlin nach 1945: Trümmerkinder",
        say: "Nach dem Zweiten Weltkrieg lag Berlin in Trümmern. 1948 kamen sogar Süßigkeiten vom Himmel.",
        build(s) {
          const p1 = s.photo("truemmerkinder", { w: "100%", h: 290, caption: "Kinder in den Trümmern, Berlin 1948" });
          const c1 = exc(s, "Trümmerkinder", "later", p(s, "small", "Kinder spielten in Ruinen – gefährlich, denn dort lag noch Munition. Sie sammelten Holz und Kohle zum Heizen. In der Schule gab es oft eine warme Mahlzeit: die Schulspeisung."));
          const p2 = s.photo("rosinenbomber", { w: "100%", h: 290, caption: "Kinder in Tempelhof, 1948", pos: "50% 40%" });
          const ov = svgBox(s, 520, 290);
          Object.assign(ov.style, { position: "absolute", left: 0, top: 0, width: "100%", height: "290px", pointerEvents: "none" });
          const chutes = [];
          for (let i = 0; i < 6; i++) { const g = s.el("g", { opacity: 0 }); g.append(s.el("path", { d: "M-12,0 Q0,-16 12,0 Z", fill: "#fff", stroke: "#94a3b8", "stroke-width": 1.5 }), s.el("path", { d: "M-12,0 L0,14 L12,0", stroke: "#fff", "stroke-width": 1.2, fill: "none" }), s.el("rect", { x: -4, y: 13, width: 8, height: 6, fill: "#7c2d12" })); ov.append(g); chutes.push(g); }
          const box2 = s.h("div", { style: { position: "relative" } }, p2, ov);
          const drop = async () => {
            s.sound("propeller", { vol: .5 });
            const start = chutes.map((_, i) => [140 + i * 45 + Math.random() * 20, 40 + Math.random() * 20]);
            await s.tween({ dur: 2200, ease: "linear", update: v => chutes.forEach((g, i) => { const t = Math.max(0, Math.min(1, v * 1.4 - i * 0.07)); g.setAttribute("opacity", t > 0 ? 1 : 0); g.setAttribute("transform", `translate(${start[i][0] + Math.sin(t * 8 + i) * 10} ${start[i][1] + t * 110})`); }) });
          };
          const btn = s.h("button", { class: "btn solid", onclick: drop }, "Abwurf!");
          const c2 = exc(s, "Die Rosinenbomber", "later", p(s, "small", "1948/49 sperrte die Sowjetunion alle Wege nach West-Berlin. Flugzeuge brachten Essen und Kohle: die Luftbrücke. Der Pilot Gail Halvorsen warf Schokolade an kleinen Taschentuch-Fallschirmen ab."), s.h("div", { class: "row", style: { marginTop: "6px" } }, btn));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", height: "100%", alignContent: "center", alignItems: "start" } }, stack(s, 12, badge(s, 5), p1, c1), stack(s, 12, s.h("div", { style: { height: "36px" } }), box2, c2)));
          s.show(p1, "zoom"); s.sound("wind", { vol: .25, dur: 2 });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "left"); });
          s.step(async () => { await s.show(c2, "up"); await drop(); s.say("Andere Piloten machten mit. Zusammen warfen sie rund 20 Tonnen Süßigkeiten ab."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Schule in Ost und West",
        say: "Ab 1949 gab es zwei deutsche Staaten. Berlin war geteilt. Auch die Schule war in Ost und West verschieden.",
        build(s) {
          const ph = s.photo("klassenzimmer-ddr", { w: "100%", h: 210, caption: "DDR-Klassenzimmer um 1970 (Schulmuseum)" });
          const row = (a, b) => later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "150px 1fr", gap: "10px", alignItems: "center" } }, s.h("b", { style: { fontSize: "20px", color: ERAS[5][2] } }, a), p(s, "small", b)));
          const tri = col => { const v = svgBox(s, 56, 34); v.append(s.el("path", { d: "M2,4 L54,4 L28,32 Z", fill: col, stroke: "#1b2740", "stroke-width": 2 })); return v; };
          const ost = [row("Schule", "10 Jahre gemeinsam in der Polytechnischen Oberschule (ab 1959)"), row("Sprache", "Russisch ab Klasse 5 für alle"), row("Samstag", "Schultag mit weniger Stunden (bis 1990)"),
            later(s.h("div", { class: "card", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "150px 1fr", gap: "10px", alignItems: "center" } }, s.h("b", { style: { fontSize: "20px", color: ERAS[5][2] } }, "Pioniere"),
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "8px" } }, tri("#2563eb"), p(s, "small", "Kl. 1–3"), tri("#dc2626"), p(s, "small", "Kl. 4–7 (ab 1973)"))))];
          const west = [row("Schule", "nach der Grundschule: Gymnasium, Realschule oder Hauptschule"), row("Sprache", "zum Beispiel Englisch oder Französisch"), row("Freizeit", "Sportverein, Pfadfinder, Jugendgruppen")];
          const head = (t, col) => s.h("p", { class: "h2", style: { color: col, fontSize: "26px" } }, t);
          const wall = svgBox(s, 16, 560);
          const wl = s.el("path", { d: "M8,10 L8,550", stroke: "#6b7280", "stroke-width": 10, "stroke-linecap": "round", class: "later" });
          wall.append(wl);
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px" } }, "Ab 1961 stand die Mauer (Kapitel 10). Kinder aus Ost und West konnten sich nicht mehr einfach besuchen."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 16px 1fr", gap: "18px", height: "100%", alignItems: "center" } },
            stack(s, 10, head("Ost-Berlin (DDR)", "#b91c1c"), ph, ...ost), wall, stack(s, 10, badge(s, 5), head("West-Berlin", "#1d4ed8"), ...west, merk)));
          s.show(ph, "zoom"); s.sfx.pop();
          s.step(async () => { for (const r of ost) { s.sfx.pop(); await s.show(r, "left"); } });
          s.step(async () => { for (const r of west) { s.sfx.pop(); await s.show(r, "right"); } });
          s.step(async () => { s.sound("steine-fallen", { vol: .4, dur: 1.5 }); await s.show(wl, "draw"); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Kindheit heute",
        say: "Und heute? Eine große Umfrage, die KIM-Studie 2024, hat Kinder von 6 bis 13 Jahren gefragt, was sie in ihrer Freizeit machen.",
        build(s) {
          const items = [["Freunde treffen", 94], ["Fernsehen", 94], ["Hausaufgaben, Lernen", 91], ["Drinnen und draußen spielen", 85], ["Videos im Internet", 70], ["Bücher lesen", 50]];
          const svg = svgBox(s, 520, 330);
          const bars = items.map(([n, v], i) => {
            const y = 14 + i * 52;
            svg.append(txt(s, 0, y + 22, n, { "text-anchor": "start", "font-size": 19, "font-weight": 600 }), s.el("rect", { x: 0, y: y + 30, width: 440, height: 16, rx: 8, fill: "#eef0f4" }));
            const r = s.el("rect", { x: 0, y: y + 30, width: 0, height: 16, rx: 8, fill: C });
            const t = txt(s, 452, y + 45, "", { "text-anchor": "start", "font-size": 19 });
            svg.append(r, t); return [r, t, v];
          });
          const chart = s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Mindestens 1× pro Woche (in Prozent)"), svg, p(s, "small pencil", "„Bücher lesen“: rund die Hälfte. Quelle: KIM-Studie 2024"));
          const ages = [["6–7", 11], ["8–9", 33], ["10–11", 63], ["12–13", 79]];
          const ph = svgBox(s, 440, 170);
          const fills = ages.map(([a, v], i) => {
            const x = 20 + i * 108;
            ph.append(s.el("rect", { x, y: 10, width: 70, height: 120, rx: 12, fill: "#fff", stroke: INK, "stroke-width": 3 }));
            const f = s.el("rect", { x: x + 6, y: 124, width: 58, height: 0, rx: 6, fill: C });
            const t = txt(s, x + 35, 78, "", { "font-size": 20, ...{ stroke: "#fff", "stroke-width": 4, "paint-order": "stroke" } });
            ph.append(f, t, txt(s, x + 35, 160, a + " J.", { "font-size": 19, fill: PEN }));
            return [f, t, v];
          });
          const phone = later(s.h("div", { class: "card", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, "Eigenes Smartphone"), ph));
          const c2 = exc(s, "Früher und heute", "later", p(s, "small", "Jeden Tag Freunde treffen: 1999 waren es ", B(s, "54 %"), " der Kinder, 2024 nur noch ", B(s, "31 %"), "."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "22px", height: "100%", alignItems: "center" } }, chart, stack(s, 12, badge(s, 6), phone, c2)));
          s.sfx.pop();
          s.step(async () => { for (const [r, t, v] of bars) { s.sfx.count(Math.round(v / 10)); s.tween({ dur: 600, ease: "out", update: k => { r.setAttribute("width", 440 * v / 100 * k); t.textContent = Math.round(v * k); } }); await s.wait(220); } await s.wait(400); s.sfx.ding(); });
          s.step(async () => { await s.show(phone, "left"); for (const [f, t, v] of fills) { s.sfx.tick(); await s.tween({ dur: 450, ease: "out", update: k => { f.setAttribute("height", 108 * v / 100 * k); f.setAttribute("y", 124 - 108 * v / 100 * k); t.textContent = Math.round(v * k) + " %"; } }); } s.say("Mit zehn oder elf Jahren haben schon fast zwei von drei Kindern ein eigenes Smartphone."); });
          s.step(async () => { s.sound("kids-cheer", { vol: .3, dur: 2 }); await s.show(c2, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Kinder anderswo auf der Welt",
        say: "Auch heute müssen viele Kinder auf der Welt arbeiten, statt zur Schule zu gehen. Aber es werden weniger.",
        build(s) {
          const svg = svgBox(s, 460, 300);
          const data = [["2000", 246], ["2020", 160], ["2024", 138]];
          svg.append(s.el("path", { d: "M20 260 L450 260", stroke: INK, "stroke-width": 3 }));
          const cols = data.map(([y, v], i) => {
            const x = 50 + i * 140, h = v / 246 * 200;
            const r = s.el("rect", { x, y: 260, width: 90, height: 0, rx: 8, fill: i === 2 ? C : "#94a3b8" });
            const t = txt(s, x + 45, 250, "", { "font-size": 22 });
            svg.append(r, t, txt(s, x + 45, 288, y, { "font-size": 20, fill: PEN }));
            return [r, t, v, h];
          });
          const chart = s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Kinder in Kinderarbeit (Millionen)"), svg, p(s, "small pencil", "Quelle: ILO und UNICEF, 2025"));
          const def = later(s.h("div", { class: "merk", style: { fontSize: "21px" } }, B(s, "Kinderarbeit"), " ist Arbeit, die Kindern schadet oder sie vom Lernen abhält. Rund 54 Millionen von ihnen machen sogar gefährliche Arbeit."));
          const pie = svgBox(s, 170, 170);
          const parts = [[61, "#4d7c0f"], [27, "#1d4ed8"], [13, "#b91c1c"]];
          let a0 = -Math.PI / 2; const segs = [];
          parts.forEach(([v, col]) => { const a1 = a0 + v / 101 * Math.PI * 2; const big = a1 - a0 > Math.PI ? 1 : 0; const d = `M85,85 L${85 + 80 * Math.cos(a0)},${85 + 80 * Math.sin(a0)} A80,80 0 ${big} 1 ${85 + 80 * Math.cos(a1)},${85 + 80 * Math.sin(a1)} Z`; const e = later(s.el("path", { d, fill: col, stroke: "#fff", "stroke-width": 3 })); fb(e); pie.append(e); segs.push(e); a0 = a1; });
          const leg = stack(s, 6, ...[["61 % Landwirtschaft", "#4d7c0f", "Kakao, Baumwolle, Vieh"], ["27 % Dienste", "#1d4ed8", "Haushalt, Verkaufen"], ["13 % Industrie", "#b91c1c", "Ziegeleien, Bergbau"]].map(([a, col, b]) => s.h("div", null, s.h("b", { style: { color: col, fontSize: "20px" } }, a), p(s, "small", b))));
          const where = later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "grid", gridTemplateColumns: "170px 1fr", gap: "14px", alignItems: "center" } }, pie, leg));
          const lf = lifeBox(s, "later", p(s, "small", "Achte beim Einkaufen auf das Fairtrade-Siegel, zum Beispiel bei Schokolade. Die Fairtrade-Regeln verbieten ausbeuterische Kinderarbeit."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "22px", height: "100%", alignItems: "center" } }, stack(s, 12, chart, def), stack(s, 12, badge(s, 6), where, lf)));
          s.sfx.pop();
          s.step(async () => { for (const [r, t, v, h] of cols) { s.sfx.tick(); await s.tween({ dur: 600, ease: "out", update: k => { r.setAttribute("height", h * k); r.setAttribute("y", 260 - h * k); t.setAttribute("y", 250 - h * k); t.textContent = Math.round(v * k); } }); } s.say("Seit dem Jahr 2000 hat sich die Zahl fast halbiert. Aber 138 Millionen Kinder sind immer noch sehr viele."); });
          s.step(async () => { s.sfx.ding(); await s.show(def, "up"); });
          s.step(async () => { s.show(where, "left"); for (const g of segs) { s.sfx.pop(); await s.show(g, "pop"); } });
          s.step(async () => { s.sound("cash-register", { vol: .35 }); await s.show(lf, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Ein langer Weg zu Kinderrechten",
        say: "Schritt für Schritt bekamen Kinder mehr Schutz. Seit 1989 haben sie eigene Rechte: die UN-Kinderrechtskonvention.",
        build(s) {
          const ev = [["1763", "Schulpflicht|in Preußen"], ["1839", "Fabrikarbeit unter|9 Jahren verboten"], ["1903", "Kinderschutz-|gesetz"], ["1989", "UN-Kinderrechts-|konvention"], ["1992", "gilt auch|in Deutschland"]];
          const svg = svgBox(s, 1060, 200);
          const X = i => 90 + i * 220;
          svg.append(s.el("path", { d: "M30 70 L1040 70", stroke: "#cbd5e1", "stroke-width": 8, "stroke-linecap": "round" }));
          const prog = s.el("path", { d: "M30 70 L1040 70", stroke: C, "stroke-width": 8, "stroke-linecap": "round", "stroke-dasharray": "1010", "stroke-dashoffset": "1010" });
          svg.append(prog);
          const evs = ev.map(([y, t], i) => { const g = s.el("g", { class: "later" }); fb(g); g.append(s.el("circle", { cx: X(i), cy: 70, r: 18, fill: i >= 3 ? C : "#475569", stroke: "#fff", "stroke-width": 4 }), txt(s, X(i), 34, y, { "font-size": 24, fill: i >= 3 ? C : INK })); const [l1, l2] = t.split("|"); g.append(txt(s, X(i), 122, l1, { "font-size": 19, "font-weight": 600 }), txt(s, X(i), 146, l2, { "font-size": 19, "font-weight": 600 })); svg.append(g); return g; });
          const cards = [
            ["Art. 28", "Bildung", "Früher gingen nur wenige zur Schule. Heute hat jedes Kind ein Recht darauf."],
            ["Art. 31", "Spiel und Freizeit", "Gespielt haben Kinder zu allen Zeiten. Heute ist es ein Recht."],
            ["Art. 32", "Schutz vor Ausbeutung", "Keine Arbeit, die gefährlich ist, der Gesundheit schadet oder vom Lernen abhält."],
          ].map(([a, n, t], i) => later(s.h("div", { class: "card", style: { padding: "12px 16px", borderTop: `8px solid ${i === 2 ? C : "#94a3b8"}` } }, s.h("span", { class: "exlabel" }, a), s.h("p", { class: "h2", style: { fontSize: "24px" } }, n), p(s, "small", t))));
          const note = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Weiter in Kapitel 8"), p(s, "small", "Mehr Kinderrechte – Mitreden, Schutz vor Gewalt, Gesundheit – lernst du in Kapitel 8 kennen.")));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols3" }, ...cards), note));
          s.sfx.whoosh();
          s.step(async () => { let off = 1010; for (let i = 0; i < 5; i++) { s.sfx.count(i * 2); s.show(evs[i], "pop"); const to = i === 4 ? 0 : 1010 - (X(i) - 30), from = off; await s.tween({ dur: 320, update: v => prog.setAttribute("stroke-dashoffset", from + (to - from) * v) }); off = to; } s.sfx.fanfare(); s.say("Am 20. November 1989 beschlossen die Vereinten Nationen die Kinderrechte."); });
          s.step(async () => { for (const c of cards) { s.sfx.pop(); await s.show(c, "up"); } });
          s.step(async () => { s.sfx.ding(); await s.show(note, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Frag deine Großeltern!",
        say: "Deine Großeltern sind Zeitzeugen. Frag sie, wie ihre Kindheit war – das ist eine echte Quelle!",
        build(s) {
          const qs = ["Wo hast du als Kind gewohnt?", "Wie sah deine Schule aus? Wie viele Kinder waren in deiner Klasse?", "Womit hast du am liebsten gespielt?", "Musstest du zu Hause mithelfen?", "Hattet ihr ein Telefon oder einen Fernseher?", "Was war früher besser – und was ist heute besser?"];
          const notes = qs.map((q, i) => later(s.h("div", { class: "card", style: { padding: "10px 14px", background: ["#fff6c9", "#e6f6ee", "#fce7f1", "#e4ecfb", "#fde9dc", "#efe8fb"][i], transform: `rotate(${[-1.5, 1, -0.6, 1.4, -1, 0.8][i]}deg)` } }, p(s, "small", B(s, (i + 1) + ". "), q))));
          let shown = 0;
          const more = s.h("button", { class: "btn solid", onclick: async () => { if (shown >= notes.length) return; s.sound("paper-crumple", { vol: .4, dur: .6 }); await s.show(notes[shown++], "pop"); } }, "Noch eine Frage");
          const left = stack(s, 12, s.h("p", { class: "h2" }, "Deine Fragen-Kiste"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, ...notes), s.h("div", { class: "row" }, more));
          const plan = [["1", "Vorbereiten", "Fragen auf Karten schreiben."], ["2", "Fragen und zuhören", "Nachfragen: „Wie war das genau?“"], ["3", "Festhalten", "Mitschreiben – oder aufnehmen, wenn Oma oder Opa einverstanden sind."], ["4", "Vergleichen", "Tabelle: damals – heute."]]
            .map(([n, a, b]) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "flex-start" } }, s.h("span", { class: "chip", style: { background: C, color: "#fff", minWidth: "40px", justifyContent: "center" } }, n), stack(s, 0, s.h("b", { style: { fontSize: "20px" } }, a), p(s, "small", b)))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "21px" } }, "Zeitzeugen sind Quellen (Kapitel 1). Ihre Erinnerungen sind spannend – aber persönlich. Darum vergleicht man mehrere Quellen."));
          s.add(grid(s, "1fr 430px", left, stack(s, 12, ...plan, merk)));
          s.sfx.pop();
          s.step(async () => { for (let k = 0; k < 3; k++) { s.sound("paper-crumple", { vol: .4, dur: .6 }); await s.show(notes[shown++], "pop"); } });
          s.step(async () => { while (shown < notes.length) { s.sfx.pop(); await s.show(notes[shown++], "pop"); } });
          s.step(async () => { for (const r of plan) { s.sound("pencil-write", { vol: .5, dur: .6 }); await s.show(r, "left"); } });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.confetti(550, 300, 60); s.say("Viel Spaß beim Interview!"); });
        },
      },
    ],
  });
})();
