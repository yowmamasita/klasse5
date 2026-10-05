/* Unit 10 – Looking ahead: bigger, better, tomorrow (Englisch Klasse 5 → preview of Klasse 6).
   Comparison of adjectives, going to future, will future, possessive pronouns.
   Cast: Ruby (11, London, Year 7, dog Biscuit), Lukas (10, Berlin, Klasse 5), his sister Julia (8) and her cat Mo,
   Ellie (11, Brighton). Teacher: Ms Clark. Facts checked 2026-10-05 (see report). */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const CSS = `
.k10-spk{width:56px;min-width:56px;height:56px;padding:0;border-radius:50%;flex:none}
.k10-spk svg,.k10-hear svg{width:26px;height:26px;flex:none}
.k10-hear{padding:0 18px}
.k10-line{display:flex;align-items:center;gap:12px}
.k10-en{font-family:var(--f-body);font-weight:700;color:var(--ink);margin:0}
.k10-tag{font:700 19px/1.2 var(--f-display);color:var(--pencil);margin:0}
.k10-ping{animation:k10ping .45s ease}
@keyframes k10ping{50%{transform:scale(1.12)}}
.k10-g{transform-box:fill-box;transform-origin:50% 100%}
.k10-tok{display:inline-block;white-space:nowrap;padding:6px 12px;border-radius:12px;background:#fff;border:3px solid var(--line);font:700 30px/1.15 var(--f-display)}
.k10-tok.be{border-color:var(--unit);color:var(--unit)}
.k10-tok.gt{border-color:var(--red);color:var(--red);background:#fdecea}
.k10-tok.q{border:0;background:none;padding:6px 2px}
.k10-let{display:inline-block;font:800 40px/1.1 var(--f-display);color:var(--ink);padding:0 1px}
.k10-let.new{color:var(--red)}
.k10-let.gone{color:var(--pencil);text-decoration:line-through;text-decoration-thickness:4px}
.k10-bub{background:#fff;border:2px solid var(--line);border-radius:18px;padding:6px 12px;font-size:20px;line-height:1.3;font-weight:700;margin:0;flex:0 1 auto;min-width:0}
.k10-av{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font:800 19px/1 var(--f-display);color:#fff;flex:none}
.k10-day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:14px;border:2px solid var(--line);background:#fff;padding:8px 4px;font:700 20px/1.1 var(--f-display);color:var(--ink)}
.k10-day .em{font-size:40px;line-height:1}
.k10-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:118px;height:112px;border-radius:16px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink);font:700 19px/1.1 var(--f-body);padding:4px}
.k10-item .em{font-size:38px;line-height:1.2}
.k10-item.on{border-color:var(--unit);background:var(--unit-soft)}
.k10-chk{display:grid;grid-template-columns:40px 1fr 56px;align-items:center;gap:10px}
.k10-box{width:36px;height:36px;border:3px solid var(--ink);border-radius:8px;display:grid;place-items:center;font:800 26px/1 var(--f-display);color:var(--green);background:#fff}
`;
  if (!document.getElementById("k10css")) { const st = document.createElement("style"); st.id = "k10css"; st.textContent = CSS; document.head.appendChild(st); }

  function ping(el) { el.classList.remove("k10-ping"); void (el.getBBox ? el.getBBox() : el.offsetWidth); el.classList.add("k10-ping"); }
  function hear(s, text, label) {
    const b = s.h("button", { class: label ? "btn k10-hear" : "btn k10-spk", "aria-label": "Anhören: " + (typeof text === "function" ? "" : text), onclick: () => { s.sfx.click(); s.speak(typeof text === "function" ? text() : text, EN); ping(b); } });
    b.insertAdjacentHTML("afterbegin", SPK);
    if (label) b.append(s.h("span", null, label));
    return b;
  }
  /* speaker button + English text (show = nodes instead of plain text, de = German note below) */
  function line(s, text, o = {}) {
    const p = s.h("p", { class: "k10-en", style: { fontSize: (o.size || 22) + "px", lineHeight: "1.3", flex: "1", minWidth: "0", color: o.color || null } }, o.show || text);
    if (o.de) p.append(s.h("span", { style: { display: "block", font: "400 19px/1.25 var(--f-body)", color: "var(--pencil)" } }, o.de));
    return s.h("div", { class: "k10-line" + (o.later ? " later" : ""), style: o.style || null }, hear(s, o.speak || text), p);
  }
  async function seq(s, els, kind = "pop", gap = 160, snd) {
    for (let i = 0; i < els.length; i++) {
      if (!s.alive) return;
      (snd || (j => s.sfx.count(j)))(i);
      s.show(els[i], kind);
      await s.wait(gap);
    }
  }
  async function flipText(s, el, text) {
    if (s.fast || !s.alive) { el.textContent = text; return; }
    await s.tween({ dur: 140, ease: "in", update: v => { el.style.transform = `scaleY(${1 - v})`; } });
    el.textContent = text;
    await s.tween({ dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }
  const B = (s, t) => s.h("b", null, t);
  const RED = (s, t) => s.h("b", { style: { color: "var(--red)" } }, t);
  const U = (s, t) => s.h("b", { style: { color: "var(--unit)" } }, t);
  const life = (s, label, ...kids) => s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, ...kids) => s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, ...kids);
  const card = (s, label, kids, st = {}) => s.h("div", { class: "card" + (st.later ? " later" : ""), style: Object.assign({ padding: "10px 16px" }, st.style || {}) }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);

  /* ---------- the cast (same drawing style as unit 9; origin = between the feet, height 200 at scale 1) ---------- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a" },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a" },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true },
    ellie: { skin: "#f6d3b5", hair: "#c0502a", style: "long", shirt: "#7b4fd6" },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "k10-g" });
    const g = E("g", { transform: `translate(${o.x} ${o.y}) scale(${sc})` });
    outer.append(g);
    const skin = o.skin || "#f2c9a5", hair = o.hair || "#5a3a22", shirt = o.shirt || "#1d5bd0", pants = o.pants || "#39435a";
    const st = o.style || "short";
    if (st === "long" || st === "curly") g.append(E("path", { d: "M-36 -170 C-46 -130 -44 -104 -26 -98 L26 -98 C44 -104 46 -130 36 -170 Z", fill: hair }));
    if (st === "curly") [-38, 38].forEach(x => [-150, -126, -104].forEach(y => g.append(E("circle", { cx: x, cy: y, r: 11, fill: hair }))));
    g.append(E("rect", { x: -19, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }), E("rect", { x: 4, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }));
    g.append(E("ellipse", { cx: -12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }), E("ellipse", { cx: 12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }));
    if (o.skirt) g.append(E("path", { d: "M-30 -74 L30 -74 L38 -38 L-38 -38 Z", fill: o.skirt }));
    g.append(E("rect", { x: -31, y: -132, width: 62, height: 74, rx: 20, fill: shirt }));
    g.append(E("path", { d: "M-26 -118 L-42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: -43, cy: -66, r: 8, fill: skin }));
    if (o.wave) g.append(E("path", { d: "M26 -118 L48 -160", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 51, cy: -166, r: 8, fill: skin }));
    else if (o.reach) g.append(E("path", { d: "M26 -118 L62 -100", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 68, cy: -98, r: 8, fill: skin }));
    else g.append(E("path", { d: "M26 -118 L42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 43, cy: -66, r: 8, fill: skin }));
    if (o.tie) g.append(E("path", { d: "M-13 -132 L0 -114 L13 -132 Z", fill: "#fff" }), E("path", { d: "M-4 -120 L4 -120 L6 -96 L0 -89 L-6 -96 Z", fill: o.tie }));
    g.append(E("rect", { x: -8, y: -140, width: 16, height: 12, fill: skin }));
    g.append(E("circle", { cx: -30, cy: -160, r: 6, fill: skin }), E("circle", { cx: 30, cy: -160, r: 6, fill: skin }));
    g.append(E("circle", { cx: 0, cy: -163, r: 30, fill: skin }));
    if (st === "short") g.append(E("path", { d: "M-31 -166 C-34 -199 34 -199 31 -166 C25 -180 10 -186 -2 -180 C-14 -186 -27 -178 -31 -166 Z", fill: hair }));
    if (st === "long" || st === "pony") g.append(E("path", { d: "M-32 -160 C-37 -200 37 -200 32 -160 C28 -178 14 -187 0 -183 C-14 -187 -28 -178 -32 -160 Z", fill: hair }));
    if (st === "pony") g.append(E("ellipse", { cx: 36, cy: -158, rx: 9, ry: 22, fill: hair, transform: "rotate(-15 36 -158)" }), E("circle", { cx: 31, cy: -178, r: 5, fill: "#dc3b2a" }));
    if (st === "curly") [-160, -135, -110, -90, -70, -45, -20].forEach(a => { const r = a * Math.PI / 180; g.append(E("circle", { cx: 29 * Math.cos(r), cy: -165 + 29 * Math.sin(r), r: 12, fill: hair })); });
    g.append(E("circle", { cx: -11, cy: -164, r: 3.6, fill: "#1b2740" }), E("circle", { cx: 11, cy: -164, r: 3.6, fill: "#1b2740" }));
    g.append(E("path", { d: o.sad ? "M-11 -144 Q0 -152 11 -144" : "M-11 -149 Q0 -140 11 -149", stroke: "#1b2740", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }));
    g.append(E("circle", { cx: -19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }), E("circle", { cx: 19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }));
    if (o.glasses) g.append(E("circle", { cx: -11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("circle", { cx: 11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("path", { d: "M-2 -165 L2 -165", stroke: "#1b2740", "stroke-width": 2.6 }));
    return outer;
  }
  const cast = (s, who, x, y, extra = {}) => person(s, Object.assign({}, CAST[who], { x, y }, extra));
  function cat(s, { x, y, sc = 1, c = "#8d96a3" }) {
    const E = s.el, outer = E("g", { class: "k10-g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    g.append(E("path", { d: "M-34 -40 Q-62 -50 -52 -96", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    [-26, -12, 14, 26].forEach(lx => g.append(E("rect", { x: lx, y: -30, width: 10, height: 30, rx: 4, fill: c })));
    g.append(E("ellipse", { cx: 0, cy: -40, rx: 38, ry: 19, fill: c }));
    g.append(E("path", { d: "M26 -82 L28 -106 L42 -90 Z M50 -90 L62 -106 L62 -80 Z", fill: c }));
    g.append(E("circle", { cx: 44, cy: -70, r: 21, fill: c }));
    g.append(E("circle", { cx: 37, cy: -74, r: 3.4, fill: "#1b2740" }), E("circle", { cx: 52, cy: -74, r: 3.4, fill: "#1b2740" }), E("path", { d: "M42 -66 L46 -66 L44 -63 Z", fill: "#e88a9a" }));
    return outer;
  }
  /* grow an SVG group upwards from a ground line (y) */
  const grow = (s, g, ground, dur = 800) => { g.classList.remove("later"); return s.tween({ from: 0, to: 1, dur, ease: "out", update: v => g.setAttribute("transform", `translate(0 ${ground}) scale(1 ${Math.max(v, .001)}) translate(0 ${-ground})`) }); };

  Deck.unit({
    id: "u10", num: 10, title: "Looking ahead: bigger, better, tomorrow", color: "#4338ca", soft: "#e7e8fb",
    subtitle: "Ausblick auf Klasse 6: vergleichen, Pläne und die Zukunft",
    blurb: "taller, the best, going to, will, mine – ein Blick auf Klasse 6",
    goals: ["Vergleichen: tall – taller – the tallest, more / most", "good – better – the best, as … as und than", "Pläne mit going to: I'm going to …", "Vorhersagen und Versprechen mit will: I'll help you!", "Wem gehört das? mine, yours, his, hers …"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 28, fill: "#4338ca", opacity: .14 }),
        el("rect", { x: 14, y: 40, width: 11, height: 18, rx: 2, fill: "#4338ca", opacity: .55 }),
        el("rect", { x: 29, y: 28, width: 11, height: 30, rx: 2, fill: "#4338ca", opacity: .8 }),
        el("rect", { x: 44, y: 14, width: 11, height: 44, rx: 2, fill: "#4338ca" }),
        el("path", { d: "M12 22 Q30 8 46 8", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
        el("path", { d: "M40 3 l8 5 l-7 6", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "tall – taller – the tallest",
        say: "Im Englischen vergleichst du mit e r und e s t. Lukas ist größer als Julia – und Ruby ist die Größte.",
        build(s) {
          const E = s.el, G = 400, svg = s.svg(500, 440);
          for (let y = G; y >= 60; y -= 40) svg.append(E("line", { x1: 20, x2: 480, y1: y, y2: y, stroke: "#d5e4ee", "stroke-width": 2 }));
          svg.append(E("line", { x1: 20, x2: 480, y1: G, y2: G, stroke: "#1b2740", "stroke-width": 4 }));
          const P = [["julia", 100, 230, "tall", "Julia"], ["lukas", 250, 278, "taller", "Lukas"], ["ruby", 400, 316, "the tallest", "Ruby"]];
          const figs = [], words = [], dash = [];
          P.forEach(([w, x, h, word, nm], i) => {
            const f = cast(s, w, x, G, { h }); f.classList.add("later"); figs.push(f);
            const top = G - h * 0.995;
            const d = E("line", { x1: 20, x2: x - 40, y1: top, y2: top, stroke: ["#138a5a", "#ee7a1a", "#dc3b2a"][i], "stroke-width": 3, "stroke-dasharray": "8 6", class: "later" });
            dash.push(d);
            const t = E("text", { x, y: top - 14, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: i === 2 ? "#dc3b2a" : "#4338ca", class: "later", text: word });
            words.push(t);
            svg.append(d, f, t, E("text", { x, y: 430, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#5d6678", text: nm }));
          });
          const L = [
            line(s, "Julia is tall.", { size: 26, show: ["Julia is ", U(s, "tall"), "."], later: true }),
            line(s, "Lukas is taller than Julia.", { size: 26, show: ["Lukas is ", U(s, "tall"), RED(s, "er"), " ", B(s, "than"), " Julia."], later: true }),
            line(s, "Ruby is the tallest.", { size: 26, show: ["Ruby is ", RED(s, "the "), U(s, "tall"), RED(s, "est"), "."], later: true })];
          const ex = life(s, "Noch mehr Beispiele", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "Ruby is older than Lukas.", { size: 21, de: "Ruby ist 11, Lukas ist 10." }),
            line(s, "Mo is smaller than Biscuit.", { size: 21, de: "Die Katze ist kleiner als der Hund." }),
            line(s, "A bike is faster than a scooter.", { size: 21 })));
          const m = merk(s, "Zwei vergleichen: ", B(s, "-er + than"), " (= als). Der/die/das Größte: ", B(s, "the … -est"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "22px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "card", style: { padding: "8px" } }, svg), s.h("div", { class: "stack", style: { gap: "12px" } }, L, ex, m)));
          const showP = async i => { s.sfx.note([0, 4, 7][i] + 5, .2); await s.show(figs[i], "bounce"); s.show(dash[i], "draw"); s.sfx.pop(); await s.show(words[i], "pop"); await s.show(L[i], "left"); };
          showP(0);
          s.step(async () => { await showP(1); s.say("Lukas ist größer als Julia: taller than."); });
          s.step(async () => { await showP(2); s.sfx.fanfare(); s.speak("Ruby is the tallest.", EN); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Spelling: nicer, bigger, happier",
        say: "Beim Anhängen von e r und e s t ändert sich manchmal die Schreibung. Die Regeln kennst du schon von e d und i n g.",
        build(s) {
          const R = [
            { lab: "Einfach -er / -est", word: "cold", cmp: "colder", sup: "the coldest", more: ["long → longer", "fast → faster"], sent: "Today is colder than yesterday." },
            { lab: "Stummes e: nur + r / + st", word: "nice", cmp: "nicer", sup: "the nicest", more: ["large → larger", "safe → safer"], sent: "Your dog is nicer than mine!", add: "r" },
            { lab: "Kurzer Vokal + 1 Konsonant: verdoppeln", word: "big", cmp: "bigger", sup: "the biggest", more: ["hot → hotter", "thin → thinner"], sent: "An elephant is bigger than a horse.", dbl: "g" },
            { lab: "Konsonant + y: y wird zu i", word: "happy", cmp: "happier", sup: "the happiest", more: ["funny → funnier", "easy → easier"], sent: "This is the funniest film ever!", y: true },
          ];
          const cards = R.map(r => {
            const letters = [...r.word].map(ch => s.h("span", { class: "k10-let" }, ch));
            const extra = [];
            if (r.dbl) extra.push(s.h("span", { class: "k10-let new later" }, r.dbl));
            if (r.y) extra.push(s.h("span", { class: "k10-let new later" }, "i"));
            const er = [...(r.add ? "r" : "er")].map(ch => s.h("span", { class: "k10-let new later" }, ch));
            const w = s.h("p", { style: { margin: 0, minHeight: "50px", whiteSpace: "nowrap" } }, letters, extra, er);
            const sup = s.h("p", { class: "k10-en later", style: { fontSize: "24px", color: "var(--unit)" } }, r.sup);
            const more = s.h("div", { class: "stack later", style: { gap: "2px" } }, r.more.map(t => s.h("p", { class: "k10-en", style: { fontSize: "20px", color: "var(--pencil)" } }, t)));
            const sent = line(s, r.sent, { size: 20, later: true });
            const c = s.h("div", { class: "card later", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" } },
              s.h("span", { class: "exlabel", style: { margin: 0, minHeight: "34px" } }, r.lab), w, sup, more, sent);
            c.go = async () => {
              s.sfx.whoosh(); await s.show(c, "up");
              if (r.y) { const y = letters[4]; s.sfx.error(); y.classList.add("gone", "a-shake"); await s.wait(600); y.style.display = "none"; s.sfx.snap(); await s.show(extra[0], "pop"); }
              else if (r.dbl) { s.sfx.snap(); await s.show(extra[0], "bounce"); }
              s.sfx.zap(); await s.show(er, "right"); if (!s.fast) s.speak(`${r.word}. ${r.cmp}. ${r.sup}.`, EN);
              s.sfx.pop(); await s.show(sup, "left"); await s.show(more, "fade"); await s.show(sent, "up");
            };
            return c;
          });
          const m = merk(s, "Die Regeln kennst du schon von ", B(s, "-ed"), " und ", B(s, "-ing"), ": stummes e, Verdoppeln, y → i. Also: nice → nicer, big → bigger, happy → happier.");
          const lf = life(s, "Im Alltag", s.h("div", { class: "cols3", style: { gap: "10px" } },
            line(s, "My bag is heavier than yours!", { size: 20 }), line(s, "Today is the hottest day of the year!", { size: 20 }), line(s, "Your joke is funnier than mine.", { size: 20 })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, cards), m, lf));
          cards[0].go();
          s.step(async () => { await cards[1].go(); });
          s.step(async () => { await cards[2].go(); s.say("Big wird zu bigger, mit zwei g."); });
          s.step(async () => { await cards[3].go(); s.say("Happy wird zu happier: aus y wird i."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: London is tall!",
        say: "Echte Höhen aus London und Berlin. Schau, wie die Türme wachsen – und vergleiche!",
        build(s) {
          const E = s.el, G = 462, k = 1.0, svg = s.svg(600, 510);
          svg.append(E("rect", { x: 0, y: 0, width: 600, height: 510, rx: 14, fill: "#eef4fb" }), E("line", { x1: 10, x2: 590, y1: G, y2: G, stroke: "#1b2740", "stroke-width": 4 }));
          const T = [
            { x: 80, m: 96, name: "Big Ben", col: "#b58a3c" },
            { x: 220, m: 135, name: "London Eye", col: "#4a6fa5" },
            { x: 375, m: 310, name: "The Shard", col: "#6f9fc8" },
            { x: 520, m: 368, name: "Fernsehturm", col: "#9aa6b4" }];
          T.forEach(t => {
            const h = t.m * k, top = G - h, g = E("g", { class: "later" });
            if (t.name === "Big Ben") g.append(E("rect", { x: t.x - 16, y: top + 22, width: 32, height: h - 22, fill: t.col }), E("path", { d: `M${t.x - 18} ${top + 24} L${t.x} ${top} L${t.x + 18} ${top + 24} Z`, fill: "#5d6678" }), E("circle", { cx: t.x, cy: top + 38, r: 9, fill: "#fff", stroke: "#1b2740", "stroke-width": 2 }));
            if (t.name === "London Eye") { const r = 62, cy = G - h + r; g.append(E("circle", { cx: t.x, cy, r, fill: "none", stroke: t.col, "stroke-width": 5 })); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.append(E("line", { x1: t.x, y1: cy, x2: t.x + r * Math.cos(a), y2: cy + r * Math.sin(a), stroke: t.col, "stroke-width": 1.5 }), E("circle", { cx: t.x + r * Math.cos(a), cy: cy + r * Math.sin(a), r: 4.5, fill: "#4338ca" })); } g.append(E("path", { d: `M${t.x - 30} ${G} L${t.x} ${cy} L${t.x + 30} ${G}`, stroke: "#5d6678", "stroke-width": 5, fill: "none" })); }
            if (t.name === "The Shard") g.append(E("path", { d: `M${t.x - 44} ${G} L${t.x - 3} ${top} L${t.x + 2} ${G} Z`, fill: "#8db6da" }), E("path", { d: `M${t.x + 2} ${G} L${t.x + 3} ${top + 6} L${t.x + 44} ${G} Z`, fill: t.col }));
            if (t.name === "Fernsehturm") { const ball = G - 250 * k; g.append(E("rect", { x: t.x - 9, y: ball, width: 18, height: G - ball, fill: "#cfd6df", stroke: "#8a94a6", "stroke-width": 2 }), E("circle", { cx: t.x, cy: ball, r: 26, fill: "#c7ccd3", stroke: "#8a94a6", "stroke-width": 2 }), E("rect", { x: t.x - 3, y: top, width: 6, height: ball - 26 - top, fill: "#dc3b2a" })); for (let y = top + 8; y < ball - 30; y += 20) g.append(E("rect", { x: t.x - 3, y, width: 6, height: 10, fill: "#fff" })); }
            const lab = E("text", { x: t.x, y: top - 12, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#4338ca", class: "later", text: "0 m" });
            const nm = E("text", { x: t.x, y: 494, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", class: "later", text: t.name });
            svg.append(g, lab, nm); Object.assign(t, { g, lab, nm });
          });
          const cmp = E("line", { x1: 330, x2: 560, y1: G - 310 * k, y2: G - 310 * k, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "8 6", class: "later" });
          svg.append(cmp);
          const rise = async t => { s.sfx.whoosh(); s.show(t.nm, "fade"); s.show(t.lab, "fade"); await Promise.all([grow(s, t.g, G, 900), s.tween({ from: 0, to: t.m, dur: 900, ease: "out", update: v => { t.lab.textContent = Math.round(v) + " m"; } })]); s.sfx.ding(); };
          const ph = [s.photo("the-shard", { w: 200, h: 220, caption: "The Shard", cls: "later", pos: "50% 30%" }), s.photo("fernsehturm", { w: 200, h: 220, caption: "Fernsehturm", cls: "later", pos: "50% 25%" })];
          const lm = merk(s, B(s, "even taller"), " = noch höher · ", B(s, "much taller"), " = viel höher");
          const L = [
            line(s, "The London Eye is taller than Big Ben.", { size: 21, de: "Big Ben ist eigentlich die Glocke im Elizabeth Tower.", later: true }),
            line(s, "The Shard is the tallest building in the UK.", { size: 21, later: true }),
            line(s, "But the Fernsehturm in Berlin is even taller!", { size: 21, later: true })];
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "22px", height: "100%", alignItems: "start" } },
            svg, s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, ph), L, lm)));
          (async () => { await rise(T[0]); await rise(T[1]); if (s.alive) { s.sfx.pop(); s.show(L[0], "left"); } })();
          s.step(async () => { s.show(ph[0], "zoom"); await rise(T[2]); s.sfx.pop(); await s.show(L[1], "left"); s.say("Der Shard ist das höchste Gebäude in Großbritannien: 310 Meter."); });
          s.step(async () => { s.show(ph[1], "zoom"); await rise(T[3]); s.show(cmp, "draw"); s.sfx.fanfare(); await s.show(L[2], "left"); s.say("Aber der Fernsehturm in Berlin ist noch höher: 368 Meter!"); });
          s.step(async () => { s.sfx.ding(); await s.show(lm, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: animal records",
        say: "Tiere mit Rekorden: das schnellste, das höchste und das größte Tier. Echte Fotos, echte Zahlen.",
        build(s) {
          const A = [
            ["cheetah", "fast – faster – the fastest", "The cheetah is the fastest animal on land.", "Er rennt rund 100 km/h.", "A cheetah is faster than a car in town.", "In der Stadt fahren Autos meist nur 50 km/h."],
            ["giraffe", "tall – taller – the tallest", "The giraffe is the tallest animal on land.", "Bis zu 5,7 Meter hoch.", "A giraffe is taller than an elephant.", null],
            ["blue-whale", "big – bigger – the biggest", "The blue whale is the biggest animal in the world.", "Er wird rund 30 Meter lang.", "A blue whale is longer than a tennis court.", "Ein Tennisplatz ist 23,77 m lang."]];
          const cards = A.map(([id, chip, a, ad, b, bd]) => s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.photo(id, { w: "100%", h: 170 }), s.h("span", { class: "chip", style: { alignSelf: "flex-start", fontSize: "19px" } }, chip),
            line(s, a, { size: 20, de: ad }), line(s, b, { size: 20, de: bd })));
          const m = merk(s, "Rekorde stehen im Superlativ: ", B(s, "the fastest, the tallest, the biggest"), ". „Auf der Welt“ heißt ", B(s, "in the world"), " – nicht „of the world“.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards), m));
          s.sfx.whoosh(); s.show(cards[0], "left");
          s.step(async () => { s.sfx.whoosh(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("waves", { vol: .35, dur: 3, fade: .8 }); await s.show(cards[2], "right"); s.say("Der Blauwal ist das größte Tier, das es je gab."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Long words: more and most",
        say: "Lange Adjektive bekommen kein e r. Davor kommt more, und für das Größte the most. Klatsch die Silben mit!",
        build(s) {
          const W = [
            ["tall", 1, "taller", "the tallest"], ["hap·py", 2, "happier", "the happiest"], ["fa·mous", 2, "more famous", "the most famous"],
            ["ex·pen·sive", 3, "more expensive", "the most expensive"], ["beau·ti·ful", 3, "more beautiful", "the most beautiful"], ["in·ter·est·ing", 4, "more interesting", "the most interesting"]];
          const mark = t => t.startsWith("the most") ? [RED(s, "the most"), t.slice(8)] : t.startsWith("more") ? [RED(s, "more"), t.slice(4)] : t.startsWith("the ") ? [RED(s, "the "), t.slice(4)] : [t];
          const rows = W.map(([w, n, c, sp]) => {
            const dots = s.h("span", { style: { display: "flex", gap: "6px" } }, Array.from({ length: n }, () => s.h("span", { style: { width: "16px", height: "16px", borderRadius: "50%", background: "var(--unit)" } })));
            const cE = s.h("span", { class: "k10-en later", style: { fontSize: "22px" } }, ...mark(c)), sE = s.h("span", { class: "k10-en later", style: { fontSize: "22px" } }, ...mark(sp));
            const r = s.h("div", { style: { display: "grid", gridTemplateColumns: "56px 210px 90px 1fr 1.2fr", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "2px solid var(--line)" } },
              hear(s, `${w.replace(/·/g, "")}. ${c}. ${sp}.`), s.h("span", { class: "k10-en", style: { fontSize: "24px" } }, w), dots, cE, sE);
            r.run = async () => { for (let i = 0; i < n; i++) { s.sfx.drum(); await s.wait(170); } s.sfx.pop(); await s.show(cE, "left"); s.sfx.pop(); await s.show(sE, "left"); };
            return r;
          });
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "56px 210px 90px 1fr 1.2fr", gap: "12px" } }, s.h("span"), s.h("span", { class: "k10-tag" }, "Wort"), s.h("span", { class: "k10-tag" }, "Silben"), s.h("span", { class: "k10-tag" }, "Vergleich"), s.h("span", { class: "k10-tag" }, "Superlativ"));
          const tbl = s.h("div", { class: "card", style: { padding: "8px 18px" } }, head, rows);
          const ex = life(s, "Im Alltag", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "A taxi is more expensive than the bus.", { size: 21 }),
            line(s, "Big Ben is one of the most famous clocks in the world.", { size: 21 })));
          const m = merk(s, "Kurze Wörter: ", B(s, "-er / -est"), ". Lange Wörter: ", B(s, "more / the most"), ". Nie beides: nicht „more taller“!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } }, tbl, s.h("div", { style: { display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "16px", alignItems: "start" } }, ex, m)));
          (async () => { await rows[0].run(); await rows[1].run(); })();
          s.step(async () => { await rows[2].run(); await rows[3].run(); s.say("Expensive hat drei Silben: more expensive, the most expensive."); });
          s.step(async () => { await rows[4].run(); await rows[5].run(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "good – better – the best",
        say: "Zwei wichtige Adjektive sind unregelmäßig: good, better, the best und bad, worse, the worst.",
        build(s) {
          const E = s.el, svg = s.svg(480, 300);
          const pod = [[160, 180, 2, "Bears", "#ee7a1a"], [240, 120, 1, "Lions", "#dc3b2a"], [320, 210, 3, "Bees", "#e8b923"]];
          svg.append(E("line", { x1: 20, x2: 460, y1: 290, y2: 290, stroke: "#1b2740", "stroke-width": 4 }));
          const P = {};
          pod.forEach(([x, top, n, nm, c]) => {
            const g = E("g", { class: "later" });
            g.append(E("rect", { x: x - 40, y: top, width: 80, height: 290 - top, fill: "#cfd6e8", stroke: "#4338ca", "stroke-width": 3 }), E("text", { x, y: top + 44, "text-anchor": "middle", "font-size": 36, "font-weight": 800, fill: "#4338ca", text: String(n) }),
              E("circle", { cx: x, cy: top - 34, r: 26, fill: c }), E("text", { x, y: top - 26, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: nm }));
            svg.append(g); P[n] = g;
          });
          const cup = E("g", { class: "later" }, E("path", { d: "M222 22 h36 v18 a18 18 0 0 1 -36 0z", fill: "#f2c200", stroke: "#a07800", "stroke-width": 2 }), E("rect", { x: 234, y: 56, width: 12, height: 10, fill: "#a07800" }));
          svg.append(cup);
          const L = [
            line(s, "The Bees are good.", { size: 22, show: ["The Bees are ", U(s, "good"), "."], later: true }),
            line(s, "The Bears are better than the Bees.", { size: 22, show: ["The Bears are ", RED(s, "better"), " than the Bees."], later: true }),
            line(s, "The Lions are the best!", { size: 22, show: ["The Lions are ", RED(s, "the best"), "!"], later: true })];
          const left = s.h("div", { class: "card", style: { padding: "8px 16px", display: "flex", flexDirection: "column", gap: "6px" } }, s.h("span", { class: "exlabel" }, "Schulturnier – Fußball"), svg, L);
          const days = [["☁️", "Monday", "bad"], ["🌧️", "Tuesday", "worse"], ["⛈️", "Wednesday", "the worst"]].map(([e, d, w]) => s.h("div", { class: "k10-day later" }, s.h("span", { class: "em" }, e), s.h("span", null, d), s.h("span", { style: { color: "var(--red)" } }, w)));
          const bad = s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "bad – worse – the worst"),
            s.h("div", { class: "cols3", style: { gap: "10px" } }, days), line(s, "Wednesday was the worst day of the week!", { size: 21, later: true, style: { marginTop: "8px" } }));
          const ex = life(s, "Im Alltag", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "Ellie is my best friend.", { size: 21, de: "mein bester Freund / meine beste Freundin" }),
            line(s, "My cold is worse today.", { size: 21, de: "Meine Erkältung ist heute schlimmer." })));
          const m = merk(s, B(s, "good – better – the best"), s.h("br"), B(s, "bad – worse – the worst"), s.h("br"), "Auswendig lernen – wie go – went!");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "20px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, bad, ex, m)));
          const showPod = async (n, i) => { s.sfx.note([0, 4, 7][i] + 5, .2); await s.show(P[n], "up"); await s.show(L[i], "left"); };
          showPod(3, 0);
          s.step(async () => { await showPod(2, 1); });
          s.step(async () => { await showPod(1, 2); s.show(cup, "bounce"); s.sound("crowd-cheer", { vol: .45, dur: 3, fade: .8 }); s.confetti(330, 220, 50); s.speak("The Lions are the best!", EN); });
          s.step(async () => { s.sound("rain", { vol: .35, dur: 3, fade: .8 }); await seq(s, days, "pop", 450); s.sound("thunder", { vol: .3, dur: 2, fade: .5 }); await s.show(bad.querySelector(".k10-line.later"), "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "as tall as – taller than",
        say: "Wenn zwei gleich sind, sagst du as, Adjektiv, as. Wenn nicht: not as … as, oder e r plus than.",
        build(s) {
          const E = s.el, G = 380, svg = s.svg(460, 420);
          svg.append(E("rect", { x: 0, y: 0, width: 460, height: 420, rx: 14, fill: "#f3f4fd" }), E("line", { x1: 10, x2: 450, y1: G, y2: G, stroke: "#1b2740", "stroke-width": 4 }));
          const ruby = cast(s, "ruby", 100, G, { h: 300 }), ellie = cast(s, "ellie", 252, G, { h: 300 }), julia = cast(s, "julia", 385, G, { h: 236 });
          julia.classList.add("later");
          const eq = E("line", { x1: 30, x2: 320, y1: G - 300, y2: G - 300, stroke: "#138a5a", "stroke-width": 4, "stroke-dasharray": "8 6", class: "later" });
          const eqT = E("text", { x: 176, y: G - 312, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: "#138a5a", class: "later", text: "=" });
          const ne = E("line", { x1: 330, x2: 445, y1: G - 236, y2: G - 236, stroke: "#dc3b2a", "stroke-width": 4, "stroke-dasharray": "8 6", class: "later" });
          svg.append(eq, eqT, ruby, ellie, julia, ne,
            ...[["Ruby", 100], ["Ellie", 252], ["Julia", 385]].map(([n, x]) => E("text", { x, y: 408, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: "#5d6678", text: n })));
          const L = [
            line(s, "Ruby is as tall as Ellie.", { size: 24, show: ["Ruby is ", U(s, "as tall as"), " Ellie."], de: "so groß wie" }),
            line(s, "Julia isn't as tall as Ruby.", { size: 24, show: ["Julia ", RED(s, "isn't as tall as"), " Ruby."], de: "nicht so groß wie", later: true }),
            line(s, "Ruby is taller than Julia.", { size: 24, show: ["Ruby is ", U(s, "taller than"), " Julia."], de: "größer als", later: true })];
          const ex = life(s, "Im Alltag", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "London is about as rainy as Berlin.", { size: 21 }),
            line(s, "My new bike is as fast as yours.", { size: 21 }),
            line(s, "Mo isn't as big as Biscuit.", { size: 21 })));
          const m = merk(s, B(s, "than"), " = als: taller than – nie „taller as“!", s.h("br"), B(s, "as … as"), " = so … wie.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "460px 1fr", gap: "22px", height: "100%", alignItems: "start" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, L, ex, m)));
          s.sfx.pop(); s.show(eq, "draw"); s.show(eqT, "pop");
          s.step(async () => { s.sfx.boing(); await s.show(julia, "bounce"); s.sfx.error(); s.show(ne, "draw"); await s.show(L[1], "left"); s.sfx.pop(); await s.show(L[2], "left"); s.say("Julia ist nicht so groß wie Ruby. Ruby ist größer als Julia."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: records",
        say: "Echte Rekorde aus Großbritannien und Deutschland: Stadien, Wetter und Flüsse. Vergleiche mit e r und e s t.",
        build(s) {
          const E = s.el;
          const bars = (rows, max, w = 300) => { const v = s.svg(w, rows.length * 46), els = []; rows.forEach(([n, val, txt, c], i) => { const y = i * 46; v.append(E("text", { x: 0, y: y + 28, "font-size": 19, "font-weight": 700, fill: "#1b2740", text: n })); const r = E("rect", { x: 112, y: y + 8, width: 0, height: 28, rx: 6, fill: c }); const t = E("text", { x: w - 4, y: y + 29, "text-anchor": "end", "font-size": 19, "font-weight": 800, fill: "#1b2740", class: "later", text: txt }); v.append(r, t); els.push({ r, t, len: (val / max) * (w - 112 - 96) }); }); v.run = async () => { for (const e of els) { s.sfx.count(els.indexOf(e)); await s.tween({ from: 0, to: e.len, dur: 700, ease: "out", update: x => e.r.setAttribute("width", x) }); s.show(e.t, "fade"); } }; return v; };
          const b1 = bars([["London", 90000, "90,000", "#4338ca"], ["Berlin", 74000, "74,000", "#9aa6b4"]], 90000);
          const c1 = s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.photo("wembley", { w: "100%", h: 140, caption: "Wembley Stadium, London" }), s.h("span", { class: "k10-tag" }, "Sitzplätze: Wembley – Olympiastadion"), b1,
            line(s, "Wembley is bigger than the Olympiastadion in Berlin.", { size: 20 }));
          const th = s.svg(300, 170);
          const yOf = c => 92 - c * 1.9;
          th.append(E("line", { x1: 10, x2: 290, y1: yOf(0), y2: yOf(0), stroke: "#8a94a6", "stroke-width": 2, "stroke-dasharray": "5 5" }), E("text", { x: 16, y: yOf(0) - 6, "font-size": 19, fill: "#5d6678", text: "0 °C" }));
          const hot = E("rect", { x: 150, y: yOf(0), width: 56, height: 0, rx: 6, fill: "#dc3b2a" }), cold = E("rect", { x: 222, y: yOf(0), width: 56, height: 0, rx: 6, fill: "#1d5bd0" });
          const hotT = E("text", { x: 136, y: yOf(40.3) + 16, "text-anchor": "end", "font-size": 20, "font-weight": 800, fill: "#dc3b2a", class: "later", text: "40.3 °C" });
          const coldT = E("text", { x: 136, y: yOf(-27.2) - 4, "text-anchor": "end", "font-size": 20, "font-weight": 800, fill: "#1d5bd0", class: "later", text: "−27.2 °C" });
          th.append(hot, cold, hotT, coldT);
          th.run = async () => { s.sfx.zap(); await s.tween({ from: 0, to: 40.3, dur: 800, ease: "out", update: v => { hot.setAttribute("y", yOf(v)); hot.setAttribute("height", yOf(0) - yOf(v)); } }); s.show(hotT, "fade"); s.sfx.zap(); await s.tween({ from: 0, to: 27.2, dur: 800, ease: "out", update: v => cold.setAttribute("height", v * 1.9) }); s.show(coldT, "fade"); };
          const c2 = s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("span", { class: "exlabel", style: { margin: 0 } }, "UK weather records"), th,
            line(s, "The hottest day in the UK was 19th July 2022.", { size: 20, speak: "The hottest day in the UK was the nineteenth of July, twenty twenty-two.", de: "40,3 °C in Coningsby" }),
            line(s, "The coldest temperature was −27.2 °C.", { size: 20, speak: "The coldest temperature was minus twenty-seven point two degrees.", de: "in Schottland" }));
          const b3 = bars([["Severn", 354, "354 km", "#138a5a"], ["Thames", 346, "346 km", "#7cc4f0"]], 354);
          const riv = s.svg(300, 90);
          const wave = (y, c, len) => E("path", { d: `M10 ${y} ` + Array.from({ length: Math.round(len / 40) }, (_, i) => `q10 -12 20 0 t20 0`).join(" "), stroke: c, "stroke-width": 8, fill: "none", "stroke-linecap": "round", class: "later" });
          const w1 = wave(30, "#138a5a", 280), w2 = wave(66, "#7cc4f0", 272); riv.append(w1, w2);
          const c3 = s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("span", { class: "exlabel", style: { margin: 0 } }, "Rivers – Flüsse"), riv, b3,
            line(s, "The Severn is longer than the Thames.", { size: 20 }), line(s, "It's the longest river in Great Britain.", { size: 20 }));
          const rm = merk(s, "Rekorde: ", B(s, "the hottest, the coldest, the longest"), ". Vergleiche: ", B(s, "bigger than, longer than"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "cols3", style: { gap: "16px", alignItems: "start" } }, c1, c2, c3), rm));
          s.sound("crowd-cheer", { vol: .35, dur: 2.5, fade: .6 }); s.show(c1, "up").then(() => s.alive && b1.run());
          s.step(async () => { s.sfx.whoosh(); await s.show(c2, "up"); await th.run(); s.say("Der heißeste Tag in Großbritannien: 40,3 Grad im Juli 2022."); });
          s.step(async () => { s.sound("water-pour", { vol: .35, dur: 2 }); await s.show(c3, "up"); s.show(w1, "draw"); await s.show(w2, "draw"); await b3.run(); });
          s.step(async () => { s.sfx.ding(); await s.show(rm, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Plans: I'm going to …",
        say: "Für Pläne, die du schon gemacht hast, benutzt du going to. Am, is oder are, dann going to, dann die Grundform.",
        build(s) {
          const tok = (t, c) => s.h("span", { class: "k10-tok " + (c || "") }, t);
          const T = [tok("I"), tok("am", "be later"), tok("going to", "gt later"), tok("play", "later"), tok("football", "later"), tok(".", "q later")];
          T[0].style.cssText = "background:#1d5bd0;color:#fff;border-color:#1d5bd0";
          const row = s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center", flexWrap: "nowrap", minHeight: "62px" } }, T);
          const formula = s.h("p", { class: "t later", style: { textAlign: "center", fontSize: "22px" } }, U(s, "am / is / are"), " + ", RED(s, "going to"), " + Grundform");
          const top = s.h("div", { class: "card stack", style: { alignItems: "center", gap: "10px", padding: "12px" } }, s.h("span", { class: "k10-tag" }, "Lukas, Freitagabend: Pläne fürs Wochenende"), row, formula);
          const P = [["I'm", "#1d5bd0"], ["you're", "#138a5a"], ["he's", "#ee7a1a"], ["she's", "#dc3b2a"], ["we're", "#7b4fd6"], ["they're", "#0e7c8c"]];
          const pers = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Für alle Personen"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px" } }, P.map(([p, c]) => s.h("p", { class: "k10-en", style: { fontSize: "21px" } }, s.h("span", { style: { color: c } }, p), " going to …"))));
          const PL = [
            ["⚽", "Saturday morning", "I'm going to play football with Max.", "ball-kick"],
            ["🎂", "Saturday afternoon", "Julia is going to bake a cake with Grandma.", "sizzle"],
            ["🧺", "Sunday", "We're going to have a picnic at Tempelhofer Feld.", "birds"]];
          const plans = PL.map(([e, d, t]) => s.h("div", { class: "ex later", style: { padding: "8px 12px", display: "grid", gridTemplateColumns: "52px 1fr", gap: "10px", alignItems: "center" } },
            s.h("span", { style: { fontSize: "40px" } }, e), s.h("div", null, s.h("p", { class: "k10-tag" }, d), line(s, t, { size: 21 }))));
          const ph = s.photo("tempelhofer-feld", { w: "100%", h: 150, caption: "Tempelhofer Feld, Berlin", cls: "later", pos: "50% 22%" });
          const m = merk(s, "Signalwörter: ", B(s, "tomorrow, next week, this weekend, on Saturday"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, top, pers, m), s.h("div", { class: "stack", style: { gap: "10px" } }, plans, ph)));
          s.sfx.pop();
          s.step(async () => { s.sfx.boing(); await s.show(T[1], "down"); s.sfx.snap(); await s.show(T[2], "bounce"); s.sfx.pop(); await s.show([T[3], T[4], T[5]], "left"); s.speak("I am going to play football.", EN); s.show(formula, "fade"); });
          s.step(async () => { s.sfx.zap(); await flipText(s, T[0], "I'm"); T[1].style.display = "none"; s.speak("I'm going to play football.", EN); s.sfx.pop(); await s.show(pers, "up"); });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sound(PL[i][3], { vol: .4, dur: 2, fade: .5 }); await s.show(plans[i], "left"); await s.wait(350); } s.say("Fußball, Kuchen backen, Picknick: alles schon geplant."); });
          s.step(async () => { s.sfx.whoosh(); s.show(ph, "zoom"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Are you going to …?",
        say: "Fragen mit going to: Am, is oder are kommt nach vorne. Und nein heißt: I'm not going to.",
        build(s) {
          const Q = [
            ["Are you going to swim in the sea?", "Yes, I am!", "Yes, I am."],
            ["Is Biscuit going to come with you?", "Yes, he is.", "Yes, he is."],
            ["Are you going to take your laptop?", "No, I'm not. I'm not going to do homework!", "No, I'm not. I'm not going to do homework!"]];
          const qa = Q.map(([q, a, sa]) => s.h("div", { class: "card later", style: { padding: "8px 14px", display: "flex", flexDirection: "column", gap: "4px" } },
            line(s, q, { size: 21 }), line(s, sa, { size: 21, color: "var(--unit)", show: "– " + a })));
          const holiday = s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "24px" } }, "🏖️ Ruby's summer holiday"), qa);
          const C = [
            ["We're going to have a party on Saturday.", true],
            ["I'm going to invite eight friends.", true],
            ["Dad is going to make a chocolate cake.", true],
            ["We aren't going to watch a film – we're going to play games!", false]];
          const ticks = [];
          const list = C.map(([t, ok]) => { const bx = s.h("span", { class: "k10-box" }); const mk = s.h("span", { class: "later", style: { color: ok ? "var(--green)" : "var(--red)" } }, ok ? "✓" : "✗"); bx.append(mk); ticks.push(mk); return s.h("div", { class: "k10-chk later" }, bx, s.h("p", { class: "hand", style: { margin: 0, fontSize: "27px", lineHeight: "1.1" } }, t), hear(s, t)); });
          const note = s.h("div", { class: "card", style: { padding: "12px 16px", background: "repeating-linear-gradient(#fffdf2 0 37px, #e3e8f4 37px 38px)", display: "flex", flexDirection: "column", gap: "10px", borderLeft: "8px solid var(--unit)" } },
            s.h("p", { class: "h2", style: { fontSize: "24px" } }, "🎉 Lukas's birthday party"), list);
          const m = merk(s, "Frage: ", B(s, "Are you going to …?"), " – ", B(s, "Yes, I am. / No, I'm not."), s.h("br"), "Nein: ", B(s, "I'm not / he isn't / we aren't going to …"));
          const lf = life(s, "Im Alltag – vor den Ferien", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "What are you going to do in the holidays?", { size: 20 }), line(s, "I'm going to visit my cousins in Hamburg.", { size: 20 })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, holiday, m), s.h("div", { class: "stack", style: { gap: "14px" } }, note, lf)));
          s.sound("waves", { vol: .35, dur: 2.5, fade: .6 }); s.show(qa[0], "up");
          s.step(async () => { s.sound("dog-bark", { vol: .5 }); await s.show(qa[1], "up"); s.sfx.pop(); await s.show(qa[2], "up"); s.say("Nein, ich werde keine Hausaufgaben machen!"); });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sound("pencil-write", { vol: .5, dur: .8 }); await s.show(list[i], "left"); s.sfx.snap(); await s.show(ticks[i], "pop"); } });
          s.step(async () => { s.sound("pencil-write", { vol: .5, dur: .8 }); await s.show(list[3], "left"); s.sfx.error(); await s.show(ticks[3], "pop"); s.speak("We aren't going to watch a film.", EN); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Look! It's going to rain.",
        say: "Going to benutzt du auch, wenn du jetzt schon siehst, was gleich passiert. Schau genau hin!",
        build(s) {
          const E = s.el;
          /* vignette 1: clouds + rain */
          const v1 = s.svg(320, 210);
          v1.append(E("rect", { x: 0, y: 0, width: 320, height: 210, rx: 12, fill: "#b7c3cf" }), E("rect", { x: 0, y: 176, width: 320, height: 34, fill: "#86b86a" }));
          [[70, 50], [150, 40], [240, 55]].forEach(([x, y]) => v1.append(E("g", null, E("circle", { cx: x, cy: y, r: 30, fill: "#5d6678" }), E("circle", { cx: x + 30, cy: y + 6, r: 24, fill: "#5d6678" }), E("circle", { cx: x - 28, cy: y + 8, r: 22, fill: "#5d6678" }))));
          v1.append(cast(s, "ruby", 160, 196, { h: 130 }));
          const drops = Array.from({ length: 30 }, (_, i) => E("line", { x1: 0, y1: 0, x2: -3, y2: 12, stroke: "#1d5bd0", "stroke-width": 2.5, "stroke-linecap": "round", opacity: 0 }));
          drops.forEach(d => v1.append(d));
          const umb = E("g", { class: "later" }, E("path", { d: "M110 72 a50 34 0 0 1 100 0 z", fill: "#dc3b2a" }), E("line", { x1: 160, y1: 72, x2: 160, y2: 120, stroke: "#1b2740", "stroke-width": 3 }));
          v1.append(umb);
          /* vignette 2: Mo + glass at the table edge */
          const v2 = s.svg(320, 210);
          v2.append(E("rect", { x: 0, y: 0, width: 320, height: 210, rx: 12, fill: "#fdf3e1" }), E("rect", { x: 20, y: 120, width: 220, height: 14, rx: 4, fill: "#a0703f" }), E("rect", { x: 40, y: 134, width: 12, height: 76, fill: "#a0703f" }), E("rect", { x: 210, y: 134, width: 12, height: 76, fill: "#a0703f" }));
          v2.append(cat(s, { x: 120, y: 120, sc: .9 }));
          const glass = E("g", null, E("path", { d: "M222 84 h24 l-3 36 h-18 z", fill: "#bfe3f5", stroke: "#5d6678", "stroke-width": 2 }), E("rect", { x: 226, y: 98, width: 16, height: 20, fill: "#7cc4f0", opacity: .7 }));
          v2.append(glass);
          const splash = E("g", { class: "later" }, ...[[-20, -8], [-8, -14], [6, -16], [20, -8]].map(([dx, dy]) => E("line", { x1: 260, y1: 200, x2: 260 + dx, y2: 200 + dy, stroke: "#5d6678", "stroke-width": 3, "stroke-linecap": "round" })));
          v2.append(splash);
          /* vignette 3: the bus is leaving */
          const v3 = s.svg(320, 210);
          v3.append(E("rect", { x: 0, y: 0, width: 320, height: 210, rx: 12, fill: "#dfeefa" }), E("rect", { x: 0, y: 170, width: 320, height: 40, fill: "#8a94a6" }), E("rect", { x: 10, y: 176, width: 300, height: 4, fill: "#fff", opacity: .6 }));
          const bus = E("g", null, E("rect", { x: 150, y: 70, width: 150, height: 100, rx: 10, fill: "#dc3b2a" }), E("rect", { x: 150, y: 116, width: 150, height: 6, fill: "#8f1d12" }));
          [160, 196, 232, 268].forEach(x => bus.append(E("rect", { x, y: 80, width: 26, height: 26, rx: 3, fill: "#cfe8f7" }), E("rect", { x, y: 130, width: 26, height: 22, rx: 3, fill: "#cfe8f7" })));
          bus.append(E("circle", { cx: 182, cy: 172, r: 12, fill: "#1b2740" }), E("circle", { cx: 268, cy: 172, r: 12, fill: "#1b2740" }));
          v3.append(bus, cast(s, "lukas", 60, 196, { h: 120, wave: true }));
          const busClip = s.h("div", { style: { overflow: "hidden", borderRadius: "12px" } }, v3);
          const V = [
            [v1, "Look at the clouds! It's going to rain.", "Schau dir die Wolken an! Es wird gleich regnen."],
            [v2, "Oh no! The glass is going to fall!", "Das Glas fällt gleich runter!"],
            [busClip, "Hurry up! We're going to miss the bus!", "Wir verpassen gleich den Bus!"]];
          const cards = V.map(([v, t, d]) => { const ln = line(s, t, { size: 20, de: d, later: true }); const c = s.h("div", { class: "card later", style: { padding: "8px", display: "flex", flexDirection: "column", gap: "8px" } }, v, ln); c.ln = ln; return c; });
          const ph = s.h("div", { class: "life later", style: { padding: "10px 16px", display: "grid", gridTemplateColumns: "250px 1fr", gap: "16px", alignItems: "center" } },
            s.photo("rain-clouds", { w: 250, h: 150, caption: "Sussex, England" }),
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, "Im Alltag – echte Wolken"), line(s, "Look at the sky! It's going to rain.", { size: 21 })));
          const m = merk(s, B(s, "going to"), " = man sieht schon jetzt ein ", B(s, "Anzeichen"), ": Wolken, ein wackelndes Glas, ein abfahrender Bus.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards), s.h("div", { style: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px", alignItems: "start" } }, ph, m)));
          s.sfx.whoosh(); seq(s, cards, "up", 250, () => s.sfx.pop());
          s.step(async () => {
            s.sound("rain", { vol: .45, dur: 3.5, fade: .8 }); await s.show(cards[0].ln, "left"); s.speak("Look at the clouds! It's going to rain.", EN);
            const pos = drops.map(() => [Math.random() * 320, Math.random() * 180]);
            drops.forEach((d, i) => d.setAttribute("opacity", 1));
            s.loop((t, dt) => { drops.forEach((d, i) => { pos[i][1] += 260 * Math.min(dt || 0, .05); if (pos[i][1] > 180) pos[i] = [Math.random() * 320, 0]; d.setAttribute("transform", `translate(${pos[i][0]} ${pos[i][1]})`); }); });
            await s.wait(500); s.sfx.pop(); await s.show(umb, "pop");
          });
          s.step(async () => {
            await s.show(cards[1].ln, "left"); s.speak("Oh no! The glass is going to fall!", EN);
            await s.tween({ dur: 900, ease: "in", update: v => glass.setAttribute("transform", `translate(${v * 20} ${v * 86}) rotate(${v * 100} 234 100)`) });
            s.sound("glass-clink", { vol: .6 }); glass.setAttribute("opacity", 0); await s.show(splash, "pop");
          });
          s.step(async () => {
            await s.show(cards[2].ln, "left"); s.speak("Hurry up! We're going to miss the bus!", EN); s.sound("london-bus-sound", { vol: .45, dur: 2.5, fade: .6 });
            await s.tween({ dur: 1600, ease: "in", update: v => bus.setAttribute("transform", `translate(${v * 200} 0)`) });
          });
          s.step(async () => { s.sfx.whoosh(); await s.show(ph, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "will: the weather forecast",
        say: "Mit will sagst du, was in der Zukunft passieren wird – zum Beispiel im Wetterbericht. Will plus Grundform, für alle Personen gleich.",
        build(s) {
          const D = [["Tomorrow", "☀️", "22°", "Tomorrow it will be sunny and warm.", "birds"], ["Thursday", "☁️", "17°", "On Thursday it will be cloudy.", "wind"], ["Friday", "🌧️", "14°", "On Friday it will rain.", "rain"], ["Saturday", "🌬️", "15°", "On Saturday it will be windy, but it won't rain.", "wind"]];
          const tiles = D.map(([d, e, t]) => s.h("div", { class: "k10-day later" }, s.h("span", null, d), s.h("span", { class: "em" }, e), s.h("span", { style: { color: "var(--red)", fontSize: "24px" } }, t)));
          const say1 = s.h("p", { class: "k10-en", style: { fontSize: "23px", color: "#fff", minHeight: "60px" } }, "Good evening! Here is the weather for London.");
          let cur = "Good evening! Here is the weather for London.";
          const tv = s.h("div", { style: { background: "#1b2740", borderRadius: "22px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { style: { font: "800 22px/1 var(--f-display)", color: "#ffd94a" } }, "WEATHER · London"), hear(s, () => cur)),
            s.h("div", { class: "cols4", style: { gap: "10px" } }, tiles), say1);
          const P = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "will + Grundform – für alle gleich"),
            s.h("p", { class: "k10-en", style: { fontSize: "22px", lineHeight: "1.5" } }, "I ", U(s, "will"), " = I", U(s, "'ll"), " · she", U(s, "'ll"), " · we", U(s, "'ll"), " · they", U(s, "'ll")),
            s.h("p", { class: "k10-en", style: { fontSize: "22px" } }, "will not = ", RED(s, "won't")));
          const ex = life(s, "Im Alltag – was glaubst du?", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "I think Ellie will win the race.", { size: 21 }),
            line(s, "In ten years, I'll be twenty.", { size: 21 }),
            line(s, "Maybe it will snow at Christmas.", { size: 21 })));
          const m = merk(s, B(s, "will"), " für Vorhersagen und Vermutungen – oft mit ", B(s, "I think, maybe, probably"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "20px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, tv, P), s.h("div", { class: "stack", style: { gap: "12px" } }, ex, m)));
          const day = async i => { s.sound(D[i][4], { vol: .35, dur: 1.8, fade: .5 }); await s.show(tiles[i], "pop"); cur = D[i][3]; await flipText(s, say1, D[i][3]); if (!s.fast) s.speak(D[i][3], EN); await s.wait(s.fast ? 0 : 1800); };
          s.sfx.fanfare();
          s.step(async () => { await day(0); await day(1); });
          s.step(async () => { await day(2); await day(3); s.say("It won't rain heißt: Es wird nicht regnen."); });
          s.step(async () => { s.sfx.pop(); await s.show(P, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "The fortune-teller",
        say: "Die Wahrsagerin schaut in ihre Kristallkugel und sagt dir die Zukunft voraus – natürlich mit will! Tippe auf die Kugel.",
        build(s) {
          const E = s.el, svg = s.svg(420, 330);
          const defs = E("defs"); const rg = E("radialGradient", { id: "k10ball", cx: "40%", cy: "35%", r: "65%" });
          rg.append(E("stop", { offset: "0%", "stop-color": "#ffffff" }), E("stop", { offset: "45%", "stop-color": "#b9a8f5" }), E("stop", { offset: "100%", "stop-color": "#4338ca" }));
          defs.append(rg); svg.append(defs);
          svg.append(E("rect", { x: 0, y: 0, width: 420, height: 330, rx: 18, fill: "#1e1b4b" }));
          const stars = Array.from({ length: 18 }, (_, i) => E("circle", { cx: 20 + (i * 97) % 390, cy: 16 + (i * 53) % 120, r: 2.5, fill: "#ffd94a" }));
          stars.forEach(st => svg.append(st));
          const glow = E("circle", { cx: 210, cy: 170, r: 118, fill: "#7b6cf6", opacity: .25 });
          const ball = E("circle", { cx: 210, cy: 170, r: 100, fill: "url(#k10ball)", style: { cursor: "pointer" } });
          const swirl = E("path", { d: "M160 170 q50 -60 100 0 q-50 60 -100 0", stroke: "#fff", "stroke-width": 4, fill: "none", opacity: .5 });
          svg.append(glow, ball, swirl, E("path", { d: "M140 272 h140 l20 40 h-180 z", fill: "#a0703f" }), E("rect", { x: 120, y: 306, width: 180, height: 14, rx: 4, fill: "#7a4b25" }));
          const PR = ["You will travel to London.", "You'll be a great musician.", "You will have a dog called Max.", "Your team will win on Saturday.", "You won't have homework tomorrow!", "You'll meet a famous footballer."];
          let idx = 0;
          const out = s.h("p", { class: "k10-en", style: { fontSize: "26px", color: "var(--unit)", textAlign: "center", minHeight: "68px" } }, "…");
          const ask = async () => { const t = PR[idx % PR.length]; idx++; s.sound("magic-chime", { vol: .5 }); ping(glow); await s.tween({ dur: 600, update: v => swirl.setAttribute("transform", `rotate(${v * 360} 210 170)`) }); await flipText(s, out, t); if (!s.fast) s.speak(t, EN); };
          ball.addEventListener("click", () => ask());
          const btn = s.h("button", { class: "btn solid", onclick: () => ask() }, "🔮 Nächste Vorhersage");
          const left = s.h("div", { class: "card", style: { padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" } }, svg, out, btn);
          const Q = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Fragen mit will"),
            s.h("div", { class: "stack", style: { gap: "8px" } },
              line(s, "Will I be rich? – No, you won't.", { size: 21 }),
              line(s, "Will it be sunny tomorrow? – Yes, it will.", { size: 21 }),
              line(s, "Will Biscuit find his ball? – I think he will.", { size: 21 })));
          const m = merk(s, "Frage: ", B(s, "Will you …?"), " Kurzantwort: ", B(s, "Yes, I will. / No, I won't."), s.h("br"), "Achtung: Das deutsche „will“ heißt ", RED(s, "want"), "! I want = ich will.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "22px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, Q, m)));
          s.loop(t => { stars.forEach((st, i) => st.setAttribute("opacity", .4 + .6 * Math.abs(Math.sin(t * 1.5 + i)))); glow.setAttribute("r", 112 + Math.sin(t * 2) * 8); });
          ask();
          s.step(async () => { await ask(); await s.wait(s.fast ? 0 : 1400); await ask(); });
          s.step(async () => { s.sfx.pop(); await s.show(Q, "up"); s.say("Will I be rich? No, you won't."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "I'll help you! – I promise.",
        say: "Will benutzt du auch, wenn du dich gerade spontan entscheidest – oder wenn du etwas versprichst.",
        build(s) {
          const dlg = (a, an, b, bn, snd, emo) => {
            const r1 = s.h("div", { class: "k10-line" }, s.h("span", { class: "k10-av", style: { background: "#5d6678", width: "auto", padding: "0 10px", borderRadius: "21px" } }, an), s.h("p", { class: "k10-bub" }, a), hear(s, a));
            const r2 = s.h("div", { class: "k10-line later", style: { flexDirection: "row-reverse" } }, s.h("span", { class: "k10-av", style: { background: "var(--unit)", width: "auto", padding: "0 10px", borderRadius: "21px" } }, bn), s.h("p", { class: "k10-bub", style: { borderColor: "var(--unit)", background: "var(--unit-soft)" } }, b), hear(s, b));
            const c = s.h("div", { class: "card later", style: { padding: "8px 12px", display: "grid", gridTemplateColumns: "50px 1fr", gap: "10px", alignItems: "center" } }, s.h("span", { style: { fontSize: "38px", textAlign: "center" } }, emo), s.h("div", { class: "stack", style: { gap: "6px" } }, r1, r2));
            c.run = async () => { if (snd) s.sound(snd, { vol: .45, dur: 2, fade: .4 }); else s.sfx.pop(); await s.show(c, "left"); if (!s.fast) s.speak(a, EN); await s.wait(s.fast ? 0 : 1300); s.sfx.ding(); await s.show(r2, "right"); if (!s.fast) s.speak(b, EN); };
            return c;
          };
          const sp = [dlg("This box is so heavy!", "Mum", "Wait, I'll help you!", "Lukas", "knock", "📦"), dlg("The phone's ringing!", "Mum", "Don't worry, I'll get it.", "Lukas", "phone-ring", "📞"), dlg("It's really cold in here.", "Julia", "I'll close the window.", "Lukas", "wind", "🪟")];
          const pr = [
            line(s, "I'll tidy my room – I promise!", { size: 21, later: true }),
            line(s, "I won't forget your birthday.", { size: 21, later: true }),
            line(s, "I'll text you when I get home.", { size: 21, later: true })];
          const prom = s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Promises – Versprechen 🤞"), s.h("div", { class: "stack", style: { gap: "8px" } }, pr));
          const m = merk(s, "Spontan entschieden oder versprochen: ", B(s, "I'll …"), s.h("br"), "Im Deutschen oft Präsens: ", s.h("i", null, "Ich helfe dir!"), " = ", B(s, "I'll help you!"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "20px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "k10-tag" }, "Spontan – jetzt gerade entschieden"), sp), s.h("div", { class: "stack", style: { gap: "14px" } }, prom, m)));
          sp[0].run();
          s.step(async () => { await sp[1].run(); });
          s.step(async () => { await sp[2].run(); s.say("I'll ist die Kurzform von I will."); });
          s.step(async () => { await seq(s, pr, "left", 350, () => s.sfx.pop()); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "going to or will?",
        say: "Going to oder will? Entscheidend ist: Wann hast du dich entschieden – vorher oder genau jetzt?",
        build(s) {
          const E = s.el, svg = s.svg(1060, 160);
          svg.append(E("line", { x1: 30, y1: 100, x2: 1030, y2: 100, stroke: "#1b2740", "stroke-width": 4 }), E("path", { d: "M1030 90 l18 10 l-18 10z", fill: "#1b2740" }));
          const mk = (x, t, c) => svg.append(E("circle", { cx: x, cy: 100, r: 10, fill: c }), E("text", { x, y: 140, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: "#5d6678", text: t }));
          mk(200, "yesterday", "#7b4fd6"); mk(560, "now", "#dc3b2a"); mk(880, "this afternoon", "#138a5a");
          const note = E("g", { class: "later" }, E("rect", { x: 140, y: 26, width: 120, height: 52, rx: 8, fill: "#fff6c9", stroke: "#a07800", "stroke-width": 2 }), E("text", { x: 200, y: 60, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: "📝 buy milk" }));
          const bulb = E("g", { class: "later" }, E("text", { x: 560, y: 86, "text-anchor": "middle", "font-size": 40, text: "💡" }));
          const arc1 = E("path", { d: "M200 90 Q540 -60 880 90", stroke: "#7b4fd6", "stroke-width": 4, fill: "none", "stroke-dasharray": "10 8", class: "later" });
          const arc2 = E("path", { d: "M600 92 Q740 40 880 90", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", class: "later" });
          svg.append(arc1, arc2, note, bulb);
          const A = s.h("div", { class: "card later", style: { padding: "10px 16px", borderColor: "#7b4fd6", borderWidth: "3px" } }, s.h("span", { class: "exlabel", style: { color: "#7b4fd6" } }, "going to – schon vorher geplant"),
            line(s, "I'm going to buy milk after school. It's on my list.", { size: 21, de: "Lukas hat gestern einen Einkaufszettel geschrieben." }));
          const Bc = s.h("div", { class: "card later", style: { padding: "10px 16px", borderColor: "var(--red)", borderWidth: "3px" } }, s.h("span", { class: "exlabel", style: { color: "var(--red)" } }, "will – genau jetzt entschieden"),
            line(s, "Mum: Oh no, there's no milk! – Lukas: I'll go to the shop!", { size: 21, de: "Spontane Idee – die Glühbirne geht an." }));
          const R = [
            ["Look at the clouds! It's going to rain.", "I think it will rain tomorrow."],
            ["We're going to visit London in May.", "Wait, I'll help you!"],
            ["She's going to be eleven next week.", "I'll call you – I promise!"]];
          const hd = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, s.h("p", { class: "k10-tag", style: { color: "#7b4fd6" } }, "going to: Plan · Anzeichen · schon klar"), s.h("p", { class: "k10-tag", style: { color: "var(--red)" } }, "will: Vermutung · spontan · Versprechen"));
          const rows = R.map(([a, b]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } },
            s.h("div", { class: "card", style: { padding: "4px 12px", borderColor: "#c9b6f2" } }, line(s, a, { size: 20 })), s.h("div", { class: "card", style: { padding: "4px 12px", borderColor: "#f3b3ab" } }, line(s, b, { size: 20 }))));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "10px" } }, svg, s.h("div", { class: "cols", style: { gap: "14px" } }, A, Bc), hd, rows));
          s.sfx.whoosh();
          s.step(async () => { s.sound("pencil-write", { vol: .5, dur: 1 }); await s.show(note, "pop"); s.show(arc1, "draw"); await s.show(A, "up"); s.speak("I'm going to buy milk after school.", EN); });
          s.step(async () => { s.sfx.zap(); await s.show(bulb, "bounce"); s.show(arc2, "draw"); await s.show(Bc, "up"); s.speak("Oh no, there's no milk! I'll go to the shop!", EN); });
          s.step(async () => { s.show(hd, "fade"); await seq(s, rows, "up", 350, () => s.sfx.pop()); s.say("Links schon geplant oder sichtbar, rechts Vermutung, spontane Idee oder Versprechen."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Whose is this? – It's mine!",
        say: "Wem gehört das? Statt my bag kannst du einfach mine sagen. Mine steht allein, ohne Nomen danach.",
        build(s) {
          const demoA = s.h("p", { class: "k10-en", style: { fontSize: "32px" } }, "This is ", U(s, "my"), " ball.");
          const demoB = s.h("p", { class: "k10-en later", style: { fontSize: "32px" } }, "This ball is ", RED(s, "mine"), ".");
          const demo = s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("div", { class: "k10-line" }, hear(s, "This is my ball."), demoA), s.h("div", { class: "k10-line" }, hear(s, "This ball is mine."), demoB));
          const P = [["my", "mine", "meins"], ["your", "yours", "deins"], ["his", "his", "seins"], ["her", "hers", "ihrs"], ["our", "ours", "unseres"], ["their", "theirs", "ihres"]];
          const outs = [];
          const rows = P.map(([a, b, de]) => {
            const o = s.h("span", { class: "k10-en", style: { fontSize: "26px", color: "var(--red)", width: "110px" } }, a); outs.push([o, b]);
            return s.h("div", { style: { display: "grid", gridTemplateColumns: "56px 100px 40px 110px 1fr", alignItems: "center", gap: "8px", minHeight: "54px", borderBottom: "2px solid var(--line)" } },
              hear(s, `${a}, ${b}`), s.h("span", { class: "k10-en", style: { fontSize: "26px", color: "var(--unit)" } }, a), s.h("span", { class: "pencil", style: { fontSize: "24px" } }, "→"), o, s.h("span", { class: "small pencil" }, de));
          });
          const tbl = s.h("div", { class: "card", style: { padding: "6px 18px" } }, s.h("span", { class: "exlabel" }, "my book → it's mine"), rows);
          const ex = life(s, "Beispiele", s.h("div", { class: "stack", style: { gap: "6px" } },
            line(s, "Whose pencil case is this? – It's Lukas's. It's his.", { size: 20 }),
            line(s, "Is this your cap? – Yes, it's mine!", { size: 20 }),
            line(s, "These bikes aren't ours. They're theirs.", { size: 20 })));
          const m = merk(s, B(s, "mine, yours, hers …"), " stehen allein – nie „mine bag“. Kein Apostroph: ", B(s, "hers, ours"), ".", s.h("br"), B(s, "Whose …?"), " = Wem gehört …?");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "22px", height: "100%", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, demo, tbl), s.h("div", { class: "stack", style: { gap: "12px" } }, ex, m)));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.show(demoB, "left"); s.speak("This ball is mine.", EN); });
          s.step(async () => { for (const [o, b] of outs) { s.sfx.count(outs.findIndex(x => x[0] === o)); await flipText(s, o, b); } s.say("Mine, yours, his, hers, ours, theirs."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(ex, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Im Alltag: lost property",
        say: "In englischen Schulen gibt es eine Fundkiste: lost property. Ms Clark fragt: Wem gehört das? Tippe auf die Sachen.",
        build(s) {
          const I = [
            ["🧢", "cap", [["Ms Clark", "Whose cap is this?"], ["Lukas", "It's mine! Thank you!"]]],
            ["🧤", "gloves", [["Ms Clark", "Are these gloves yours, Ruby?"], ["Ruby", "No, they aren't mine. I think they're Ellie's."], ["Ellie", "Yes! They're mine."]]],
            ["⚽", "football", [["Ms Clark", "Whose football is this?"], ["Lukas", "It's Sam and Tom's. It's theirs."]]],
            ["🎻", "violin", [["Ms Clark", "And this violin? Is it Mr Brown's?"], ["Ruby", "Yes, it's his. He's the music teacher."]]]];
          const COL = { "Ms Clark": "#5d6678", Lukas: "#ee7a1a", Ruby: "#1e3a6e", Ellie: "#7b4fd6" };
          const items = [], dlgs = [];
          I.forEach(([e, n, D], i) => {
            const b = s.h("button", { class: "k10-item later" }, s.h("span", { class: "em" }, e), s.h("span", null, n));
            const box = s.h("div", { class: "card later", style: { padding: "8px 14px", display: "grid", gridTemplateColumns: "44px 1fr 56px", gap: "12px", alignItems: "center" } },
              s.h("span", { style: { fontSize: "34px", lineHeight: "1.2", textAlign: "center" } }, e),
              s.h("div", { class: "stack", style: { gap: "2px" } }, D.map(([w, t]) => s.h("p", { class: "k10-en", style: { fontSize: "20px", lineHeight: "1.3" } }, s.h("span", { style: { color: COL[w] } }, w + ": "), t))),
              hear(s, D.map(x => x[1]).join(" ")));
            b.onclick = () => { s.sfx.pop(); items.forEach(x => x.classList.toggle("on", x === b)); ping(b); s.speak(D.map(x => x[1]).join(" "), EN); };
            items.push(b); dlgs.push(box);
          });
          const boxEl = s.h("div", { class: "card", style: { padding: "12px", background: "#f6efe3", border: "4px solid #a0703f", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" } },
            s.h("p", { style: { margin: 0, font: "800 26px/1 var(--f-display)", color: "#7a4b25", letterSpacing: ".06em" } }, "LOST PROPERTY"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, items),
            s.h("p", { class: "small pencil", style: { textAlign: "center" } }, "Tippe auf ein Teil!"));
          const m = merk(s, "Mit Namen: ", B(s, "It's Ellie's."), " – mit Pronomen: ", B(s, "It's hers."), " Zwei Besitzer: ", B(s, "Sam and Tom's"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "290px 1fr", gap: "22px", height: "100%", alignItems: "start" } }, boxEl, s.h("div", { class: "stack", style: { gap: "10px" } }, dlgs, m)));
          const run = async i => { s.sfx.boing(); await s.show(items[i], "bounce"); items.forEach(x => x.classList.toggle("on", x === items[i])); s.sfx.pop(); await s.show(dlgs[i], "left"); if (!s.fast) s.speak(I[i][2].map(x => x[1]).join(" "), EN); };
          s.sound("school-bell", { vol: .35, dur: 2, fade: .5 }); run(0);
          s.step(async () => { await run(1); s.say("Die Handschuhe gehören Ellie: They're hers."); });
          s.step(async () => { s.sound("ball-kick", { vol: .5 }); await run(2); });
          s.step(async () => { s.sound("violin-play", { vol: .4, dur: 2.5, fade: .6 }); await run(3); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 18 --------------------------------------------------------------- */
      {
        title: "Im Alltag: a trip to London",
        say: "Lukas' Klasse plant eine Fahrt nach London. Im Chat mit Ruby steckt alles aus diesem Kapitel: Vergleiche, going to, will und mine.",
        build(s) {
          const M = [
            ["L", "Big news! My class is going to visit London next spring!", "going to"],
            ["R", "Amazing! I'll show you my school.", "will"],
            ["L", "Is the Shard taller than the London Eye?", "taller than"],
            ["R", "Yes, much taller! It's the tallest building in the UK.", "the tallest"],
            ["L", "What will the weather be like?", "will"],
            ["R", "It will probably rain. Bring an umbrella – or you can borrow mine!", "mine"],
            ["L", "Thanks! I'll bring you some Berlin chocolate.", "will"]];
          const COL = { "going to": "#7b4fd6", will: "#dc3b2a", "taller than": "#4338ca", "the tallest": "#4338ca", mine: "#138a5a" };
          const msgs = M.map(([w, t, tag]) => s.h("div", { class: "k10-line later", style: { flexDirection: w === "L" ? "row-reverse" : "row", gap: "8px" } },
            s.h("span", { class: "k10-av", style: { background: w === "L" ? "#ee7a1a" : "#1e3a6e" } }, w),
            s.h("p", { class: "k10-bub", style: { background: w === "L" ? "#fff1e3" : "#fff", borderColor: w === "L" ? "#ee7a1a" : "#1e3a6e" } }, t, " ", s.h("span", { class: "chip", style: { fontSize: "19px", padding: "2px 10px", background: COL[tag], color: "#fff", verticalAlign: "middle" } }, tag)),
            hear(s, t)));
          const phone = s.h("div", { style: { background: "#1b2740", borderRadius: "30px", padding: "12px", height: "636px" } },
            s.h("div", { style: { background: "#f4f7fb", borderRadius: "20px", height: "100%", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" } },
              s.h("p", { class: "k10-tag", style: { textAlign: "center" } }, "Lukas ↔ Ruby"), msgs));
          const plan = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Our London trip – the plan"),
            s.h("div", { class: "stack", style: { gap: "6px" } },
              line(s, "Day 1: We're going to take the Tube.", { size: 20 }),
              line(s, "Day 2: We're going to go up the Shard.", { size: 20 }),
              line(s, "Day 3: We're going to see Big Ben.", { size: 20 })));
          const ph = s.photo("tube", { w: "100%", h: 150, caption: "The Tube – die Londoner U-Bahn", cls: "later" });
          const m = merk(s, "Kapitel 10 in einem Satz: ", B(s, "taller, the best, going to, will, mine"), " – das alles lernst du in Klasse 6 genauer!");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "590px 1fr", gap: "20px", height: "100%" } }, phone, s.h("div", { class: "stack", style: { gap: "12px" } }, plan, ph, m)));
          const pop = async (a, b) => { for (let i = a; i < b; i++) { s.sfx.note(i % 2 ? 7 : 12, .12); await s.show(msgs[i], M[i][0] === "L" ? "right" : "left"); } };
          pop(0, 2);
          s.step(async () => { await pop(2, 4); });
          s.step(async () => { s.sound("rain", { vol: .3, dur: 2, fade: .5 }); await pop(4, 7); });
          s.step(async () => { s.sound("mind-the-gap", { vol: .6 }); await s.show(plan, "up"); await s.show(ph, "zoom"); });
          s.step(async () => { s.sfx.fanfare(); await s.show(m, "up"); s.confetti(590, 300, 70); });
        },
      },
    ],
  });
})();
