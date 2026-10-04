/* Unit 5 – Hobbies and free time (Englisch Klasse 5) */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6"/></svg>';
  const CSS = `
.u5-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:var(--card);border:2px solid var(--line);border-radius:16px;padding:8px 8px;cursor:pointer;color:var(--ink);font-family:var(--f-body);text-align:center}
.u5-tile:active{transform:scale(.97)}
.u5-tile .em{font-size:46px;line-height:1.05}
.u5-tile .en{font:700 23px/1.12 var(--f-display);color:var(--unit)}
.u5-tile .de{font-size:19px;line-height:1.2;color:var(--pencil)}
.u5-hear{min-height:56px;padding:6px 16px;border-radius:14px;border:2px solid var(--unit);background:var(--card);color:var(--ink);font:700 22px/1.2 var(--f-display);cursor:pointer;display:flex;align-items:center;gap:10px;text-align:left}
.u5-hear svg{flex:none;color:var(--unit)}
.u5-hear small{display:block;font:400 19px/1.2 var(--f-body);color:var(--pencil)}
.u5-hear:active{transform:scale(.98)}
.u5-hear.g{border-color:var(--green)} .u5-hear.g svg{color:var(--green)}
.u5-hear.r{border-color:var(--red)} .u5-hear.r svg{color:var(--red)}
.u5-chip{min-height:52px;padding:0 18px;border-radius:999px;border:2px solid var(--line);background:#fff;font:700 22px/1 var(--f-display);color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;white-space:nowrap}
.u5-basket{border-radius:20px 20px 34px 34px;padding:14px 16px 18px;display:flex;flex-direction:column;align-items:center;gap:10px;
 background:repeating-linear-gradient(90deg,#e9c48f 0 14px,#dcae6f 14px 28px);border:4px solid #a8743a}
.u5-basket .bh{font:800 40px/1 var(--f-display);color:#fff;background:var(--unit);padding:6px 22px;border-radius:14px}
.u5-basket .bs{font-size:19px;background:#fff8ec;border-radius:8px;padding:2px 10px}
.u5-basket .bl{display:flex;flex-direction:column;gap:8px;align-items:center;min-height:232px}
.u5-flip{border:3px solid var(--line);border-radius:20px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;padding:10px;color:var(--ink);font-family:var(--f-body)}
.u5-flip .em{font-size:72px;line-height:1}
.u5-flip .q{font:700 26px/1.1 var(--f-display);color:var(--unit)}
.u5-flip .mark{font:800 60px/1 var(--f-display)}
.u5-flip .sent{font:700 25px/1.15 var(--f-display);text-align:center}
.u5-bub{border-radius:18px;padding:10px 14px;font:700 22px/1.2 var(--f-display);border:0;cursor:pointer;display:flex;gap:8px;align-items:center;text-align:left;color:var(--ink);min-height:56px}
.u5-bub.q{background:#fde6e3;align-self:flex-start;border-bottom-left-radius:4px}
.u5-bub.a{background:#e3f2e4;align-self:flex-end;border-bottom-right-radius:4px}
.u5-bub svg{flex:none;color:var(--pencil)}
.u5-letter{display:inline-block;font:800 56px/1 var(--f-display);text-align:center;letter-spacing:.02em}
.u5-letter.new{color:var(--green)}
.u5-letter.gone{color:var(--red);text-decoration:line-through}
.u5-sign{border-radius:18px;border:3px solid #1f4f8a;background:#fff;overflow:hidden;display:flex;flex-direction:column}
.u5-sign .sh{background:#1f4f8a;color:#fff;font:800 22px/1.15 var(--f-display);padding:10px 14px;letter-spacing:.03em}
.u5-sign .sb{padding:12px;display:flex;flex-direction:column;gap:8px}
.u5-poster{background:#fff;border:3px solid var(--unit);border-radius:10px;box-shadow:4px 6px 0 rgba(0,0,0,.12);padding:16px 20px;position:relative}
.u5-poster .ph{font:800 34px/1 var(--f-display);color:var(--unit);text-align:center}
.u5-poster .ps{font:600 26px/1 var(--f-hand);color:var(--blue);text-align:center;margin:6px 0 10px}
.u5-prow{display:grid;grid-template-columns:150px 1fr;align-items:center;gap:10px;border-top:2px dashed var(--line);padding:9px 0}
.u5-prow .d{font:700 21px/1 var(--f-display);color:var(--pencil)}
.u5-phone{width:400px;height:620px;border-radius:44px;background:#1b2740;padding:16px;box-sizing:border-box}
.u5-screen{width:100%;height:100%;border-radius:32px;background:#eef1f6;display:flex;flex-direction:column;overflow:hidden}
.u5-screen .top{background:#fff;padding:12px 16px;font:700 21px/1 var(--f-display);border-bottom:2px solid var(--line);display:flex;gap:10px;align-items:center}
.u5-screen .msgs{flex:1;padding:12px;display:flex;flex-direction:column;gap:8px}
.u5-msg{max-width:84%;border-radius:16px;padding:8px 12px;font-size:19px;line-height:1.25;border:0;text-align:left;cursor:pointer;color:var(--ink);font-family:var(--f-body)}
.u5-msg.me{align-self:flex-end;background:#c9f1cf;border-bottom-right-radius:4px}
.u5-msg.you{align-self:flex-start;background:#fff;border-bottom-left-radius:4px}
.u5-cell{background:#fff;border:2px solid var(--line);border-radius:16px;padding:16px 14px;display:flex;gap:10px;align-items:center;cursor:pointer;text-align:left;color:var(--ink);font-family:var(--f-body)}
.u5-cell .em{font-size:40px;line-height:1;flex:none}
.u5-cell .en{font:700 21px/1.2 var(--f-display)}
.u5-cell .de{font-size:19px;line-height:1.2;color:var(--pencil)}
.u5-dayh{font:800 26px/1 var(--f-display);color:#fff;background:var(--unit);border-radius:12px;padding:10px 14px;text-align:center}
.u5-timeh{font:700 21px/1 var(--f-display);color:var(--pencil);display:flex;align-items:center}
`;
  if (!document.getElementById("u5-css")) { const st = document.createElement("style"); st.id = "u5-css"; st.textContent = CSS; document.head.appendChild(st); }

  /** tap-to-hear button: English text, optional German line */
  function hear(s, en, de, cls = "") {
    const b = s.h("button", { class: "u5-hear " + cls, onclick: () => { s.sfx.click(); s.speak(en, EN); } });
    b.innerHTML = SPK;
    b.appendChild(s.h("span", null, en, de ? s.h("small", null, de) : null));
    return b;
  }
  function tile(s, em, en, de, say) {
    return s.h("button", { class: "u5-tile", onclick: () => { s.sfx.pop(); s.speak(say || en, EN); } },
      s.h("span", { class: "em" }, em), s.h("span", { class: "en" }, en), s.h("span", { class: "de" }, de));
  }
  /* the cast (same look as Unit 1/2): Ruby (11, London) and Lukas (10, Berlin) */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "u5g" });
    const g = E("g", { transform: `translate(${o.x} ${o.y}) scale(${sc})` });
    outer.append(g);
    const skin = o.skin || "#f2c9a5", hair = o.hair || "#5a3a22", shirt = o.shirt || "#1d5bd0", pants = o.pants || "#39435a";
    const st = o.style || "short";
    if (st === "long" || st === "curly") g.append(E("path", { d: "M-36 -170 C-46 -130 -44 -104 -26 -98 L26 -98 C44 -104 46 -130 36 -170 Z", fill: hair }));
    if (st === "curly") [-38, 38].forEach(x => [-150, -126, -104].forEach(y => g.append(E("circle", { cx: x, cy: y, r: 11, fill: hair }))));
    g.append(E("rect", { x: -19, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }), E("rect", { x: 4, y: -64, width: 15, height: 60, rx: 6, fill: o.skirt ? skin : pants }));
    if (o.skirt) g.append(E("rect", { x: -19, y: -40, width: 38, height: 8, fill: "#8a94a6", opacity: 0.0 }));
    g.append(E("ellipse", { cx: -12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }), E("ellipse", { cx: 12, cy: -4, rx: 13, ry: 6, fill: "#262b36" }));
    if (o.skirt) g.append(E("path", { d: "M-30 -74 L30 -74 L38 -38 L-38 -38 Z", fill: o.skirt }));
    g.append(E("rect", { x: -31, y: -132, width: 62, height: 74, rx: 20, fill: shirt }));
    g.append(E("path", { d: "M-26 -118 L-42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: -43, cy: -66, r: 8, fill: skin }));
    if (o.wave) g.append(E("path", { d: "M26 -118 L48 -160", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 51, cy: -166, r: 8, fill: skin }));
    else g.append(E("path", { d: "M26 -118 L42 -72", stroke: shirt, "stroke-width": 15, "stroke-linecap": "round", fill: "none" }), E("circle", { cx: 43, cy: -66, r: 8, fill: skin }));
    if (o.tie) g.append(E("path", { d: "M-13 -132 L0 -114 L13 -132 Z", fill: "#fff" }), E("path", { d: "M-4 -120 L4 -120 L6 -96 L0 -89 L-6 -96 Z", fill: o.tie }));
    if (o.badge) g.append(E("rect", { x: -26, y: -112, width: 26, height: 16, rx: 3, fill: "#fff", stroke: "#dc3b2a", "stroke-width": 2 }));
    g.append(E("rect", { x: -8, y: -140, width: 16, height: 12, fill: skin }));
    g.append(E("circle", { cx: -30, cy: -160, r: 6, fill: skin }), E("circle", { cx: 30, cy: -160, r: 6, fill: skin }));
    g.append(E("circle", { cx: 0, cy: -163, r: 30, fill: skin }));
    if (st === "short") g.append(E("path", { d: "M-31 -166 C-34 -199 34 -199 31 -166 C25 -180 10 -186 -2 -180 C-14 -186 -27 -178 -31 -166 Z", fill: hair }));
    if (st === "long" || st === "pony" || st === "bun") g.append(E("path", { d: "M-32 -160 C-37 -200 37 -200 32 -160 C28 -178 14 -187 0 -183 C-14 -187 -28 -178 -32 -160 Z", fill: hair }));
    if (st === "pony") g.append(E("ellipse", { cx: 36, cy: -158, rx: 9, ry: 22, fill: hair, transform: "rotate(-15 36 -158)" }), E("circle", { cx: 31, cy: -178, r: 5, fill: "#dc3b2a" }));
    if (st === "bun") g.append(E("circle", { cx: 0, cy: -197, r: 13, fill: hair }));
    if (st === "curly") [-160, -135, -110, -90, -70, -45, -20].forEach(a => { const r = a * Math.PI / 180; g.append(E("circle", { cx: 29 * Math.cos(r), cy: -165 + 29 * Math.sin(r), r: 12, fill: hair })); });
    if (st === "bald") g.append(E("path", { d: "M-31 -150 C-34 -170 -28 -178 -24 -176 L-26 -150 Z M31 -150 C34 -170 28 -178 24 -176 L26 -150 Z", fill: hair }));
    g.append(E("circle", { cx: -11, cy: -164, r: 3.6, fill: "#1b2740" }), E("circle", { cx: 11, cy: -164, r: 3.6, fill: "#1b2740" }));
    g.append(E("path", { d: "M-11 -149 Q0 -140 11 -149", stroke: "#1b2740", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }));
    g.append(E("circle", { cx: -19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }), E("circle", { cx: 19, cy: -153, r: 4.5, fill: "#ef8f8f", opacity: 0.45 }));
    if (o.glasses) g.append(E("circle", { cx: -11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("circle", { cx: 11, cy: -164, r: 9, fill: "none", stroke: "#1b2740", "stroke-width": 2.6 }), E("path", { d: "M-2 -165 L2 -165", stroke: "#1b2740", "stroke-width": 2.6 }));
    if (o.beard) g.append(E("path", { d: "M-26 -160 C-26 -126 26 -126 26 -160 C18 -144 -18 -144 -26 -160 Z", fill: hair }));
    return outer;
  }
  const cast = (s, who, x, y, extra = {}) => person(s, Object.assign({}, CAST[who], { x, y }, extra));
  let avN = 0;
  /** round portrait badge of a cast member (head + shoulders of person()) */
  function avatar(s, who, size = 90) {
    const svg = s.svg(100, 100, { width: size, height: size });
    const id = "u5av" + (++avN);
    const clip = s.el("clipPath", { id }, s.el("circle", { cx: 50, cy: 50, r: 46.5 }));
    const fig = s.el("g", { "clip-path": `url(#${id})` }, s.el("g", { transform: "translate(50 167) scale(0.75)" }, cast(s, who, 0, 0, { h: 200 })));
    svg.append(s.el("defs", null, clip),
      s.el("circle", { cx: 50, cy: 50, r: 48, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), fig);
    return svg;
  }
  const rootScale = s => s.root.getBoundingClientRect().width / 1100 || 1;
  /** move elements to new parents and animate them from their old place (FLIP) */
  async function fly(s, moves, others = []) {
    const sc = rootScale(s);
    const all = [...moves.map(m => m[0]), ...others];
    const before = all.map(e => e.getBoundingClientRect());
    moves.forEach(([el, to]) => to.appendChild(el));
    if (s.fast) return;
    const after = all.map(e => e.getBoundingClientRect());
    const d = all.map((e, i) => [(before[i].left - after[i].left) / sc, (before[i].top - after[i].top) / sc]);
    await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: v => all.forEach((e, i) => { e.style.transform = v >= 1 ? "" : `translate(${d[i][0] * (1 - v)}px, ${d[i][1] * (1 - v)}px)`; }) });
  }

  Deck.unit({
    id: "u5", num: 5, title: "Hobbies and free time", color: "#dc2626", soft: "#fde6e3",
    subtitle: "What do you do in your free time?",
    blurb: "Hobbys, play/go/do, can, like + -ing, Befehle, there is/are",
    goals: ["Über Hobbys und Sport sprechen (play, go, do)", "Sagen, was du kannst: I can swim. I can't skate.", "Sagen, was du magst: I love reading.", "Befehle und Regeln verstehen: Stand up! Don't run!", "Orte beschreiben: There's a skate park."],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 27, fill: "#dc2626", opacity: .14 }),
        el("circle", { cx: 35, cy: 35, r: 17, fill: "#fff", stroke: "#dc2626", "stroke-width": 3 }),
        el("path", { d: "M35 18 L35 52 M18 35 L52 35 M23 23 Q35 35 23 47 M47 23 Q35 35 47 47", stroke: "#dc2626", "stroke-width": 2.5, fill: "none" }));
    },
    slides: [
      /* 1 */
      {
        title: "Hobbies – what do you do?",
        say: "Was machst du in deiner Freizeit? Hier sind zwölf Hobbys auf Englisch. Tippe auf eine Karte, dann hörst du das Wort.",
        build(s) {
          const items = [["⚽", "play football", "Fußball spielen"], ["🎻", "play the violin", "Geige spielen"], ["🏊", "go swimming", "schwimmen gehen"], ["🛹", "go skateboarding", "Skateboard fahren"],
            ["🥋", "do judo", "Judo machen"], ["📚", "read books", "Bücher lesen"], ["🎨", "draw pictures", "Bilder malen"], ["🎮", "play computer games", "Computerspiele spielen"],
            ["🚲", "ride a bike", "Fahrrad fahren"], ["💃", "dance", "tanzen"], ["🎤", "sing in a choir", "im Chor singen"], ["🧗", "go climbing", "klettern gehen"]];
          const tiles = items.map(([e, en, de]) => tile(s, e, en, de));
          const rows = [tiles.slice(0, 4), tiles.slice(4, 8), tiles.slice(8)];
          rows[1].concat(rows[2]).forEach(t => t.classList.add("later"));
          const q = hear(s, "What do you do in your free time?", "Was machst du in deiner Freizeit?");
          const grid = s.h("div", { class: "cols4", style: { gap: "14px", flex: "1", gridTemplateRows: "repeat(3, 1fr)" } }, tiles);
          s.add(s.h("div", { class: "stack", style: { height: "100%" } }, s.h("div", { class: "row", style: { justifyContent: "space-between" } }, q, s.h("p", { class: "hand", style: { margin: 0, color: "var(--red)" } }, "Tippe auf eine Karte!")), grid));
          s.show(q, "down"); s.show(rows[0], "up", 150); s.sfx.whoosh();
          rows[0].forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i), 150 + i * 120));
          s.step(async () => { rows[1].forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i + 4), i * 120)); await s.show(rows[1], "up"); s.say("Judo, lesen, malen, Computerspiele."); });
          s.step(async () => { rows[2].forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i + 8), i * 120)); await s.show(rows[2], "up"); s.say("Und welches Hobby hast du?"); });
        },
      },
      /* 2 */
      {
        title: "play, go oder do?",
        say: "Im Englischen braucht man für Hobbys das richtige Verb: play, go oder do. Wir sortieren die Wörter in drei Körbe.",
        build(s) {
          const groups = {
            play: { words: ["football", "tennis", "the piano", "the violin"], sub: "Ballspiele + Instrumente" },
            go: { words: ["swimming", "skating", "riding", "climbing"], sub: "Sport mit -ing" },
            do: { words: ["judo", "karate", "gymnastics", "athletics"], sub: "Kampfsport, Turnen" },
          };
          const order = ["tennis", "swimming", "judo", "the piano", "climbing", "football", "gymnastics", "riding", "the violin", "karate", "skating", "athletics"];
          const chips = {};
          for (const [verb, g] of Object.entries(groups)) for (const w of g.words) chips[w] = s.h("button", { class: "u5-chip", onclick: () => { s.sfx.pop(); s.speak((chips[w].parentNode.dataset.verb ? chips[w].parentNode.dataset.verb + " " : "") + w, EN); } }, w);
          const pool = s.h("div", { class: "row", style: { position: "absolute", inset: "0", justifyContent: "center", alignContent: "center", gap: "12px" } }, order.map(w => chips[w]));
          const merk = s.h("div", { class: "merk later", style: { position: "absolute", top: "34px", left: "0", right: "0", fontSize: "23px" } },
            s.h("b", null, "play"), " + Ballspiele und Instrumente (", s.h("i", null, "play the violin"), ") · ",
            s.h("b", null, "go"), " + Sport mit -ing (", s.h("i", null, "go swimming"), ") · ",
            s.h("b", null, "do"), " + Kampfsport und Turnen (", s.h("i", null, "do judo"), ")");
          const top = s.h("div", { style: { position: "relative", height: "190px" } }, pool, merk);
          const lists = {}, baskets = {};
          for (const [verb, g] of Object.entries(groups)) {
            lists[verb] = s.h("div", { class: "bl", "data-verb": verb });
            baskets[verb] = s.h("div", { class: "u5-basket" }, s.h("div", { class: "bh" }, verb), s.h("div", { class: "bs later" }, g.sub), lists[verb]);
          }
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px" } }, top, s.h("div", { class: "cols3", style: { flex: "1" } }, Object.values(baskets))));
          s.show(Object.values(chips), "pop"); s.sfx.whoosh();
          const sort = verb => async () => {
            const rest = order.filter(w => !groups[verb].words.includes(w) && chips[w].parentNode === pool).map(w => chips[w]);
            s.sfx.whoosh();
            await fly(s, groups[verb].words.map(w => [chips[w], lists[verb]]), rest);
            s.sfx.snap(); s.show(baskets[verb].querySelector(".bs"), "pop"); s.sfx.ding();
            s.speak(groups[verb].words.map(w => verb + " " + w).join(", "), EN);
          };
          s.step(sort("play"));
          s.step(sort("go"));
          s.step(sort("do"));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Play für Ballspiele und Instrumente, go für Sport mit i n g, do für Kampfsport und Turnen."); });
        },
      },
      /* 3 */
      {
        title: "Music: play an instrument",
        say: "Musik ist auch ein Hobby. Bei Instrumenten sagt man play the: I play the violin. Tippe auf ein Instrument!",
        build(s) {
          const inst = [
            { em: "🎻", en: "the violin", de: "Geige", tune: [7, 9, 11, 12, 14], type: "sawtooth" },
            { em: "🎺", en: "the trumpet", de: "Trompete", tune: [0, 4, 7, 12, 7], type: "square" },
            { em: "🎷", en: "the saxophone", de: "Saxofon", tune: [-5, -2, 0, 3, 5], type: "square" },
            { em: "🎸", en: "the guitar", de: "Gitarre", tune: [-12, -8, -5, 0, -5], type: "triangle" },
            { em: "🥁", en: "the drums", de: "Schlagzeug", drum: true },
          ];
          const W = 500, H = 330;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 22, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }),
            s.el("rect", { x: 30, y: 262, width: W - 60, height: 18, rx: 6, fill: "#e9c48f" }));
          const big = s.el("text", { x: W / 2, y: 236, "text-anchor": "middle", "font-size": 160, text: "🎻" });
          svg.append(big);
          const notes = [];
          for (let i = 0; i < 6; i++) {
            const g = s.el("g", { opacity: 0 });
            g.append(s.el("ellipse", { cx: 0, cy: 0, rx: 11, ry: 8, fill: "#dc2626", transform: "rotate(-20)" }), s.el("line", { x1: 10, y1: -2, x2: 10, y2: -34, stroke: "#dc2626", "stroke-width": 3.5 }), s.el("path", { d: "M10 -34 Q22 -28 20 -16", stroke: "#dc2626", "stroke-width": 3.5, fill: "none" }));
            svg.append(g); notes.push({ g, t0: -10, x: 0 });
          }
          let tnow = 0;
          s.loop(t => {
            tnow = t;
            notes.forEach(n => {
              const a = t - n.t0;
              if (a < 0 || a > 1.6) { n.g.setAttribute("opacity", 0); return; }
              const x = n.x + Math.sin(a * 5) * 14, y = 200 - a * 110;
              n.g.setAttribute("transform", `translate(${x},${y})`);
              n.g.setAttribute("opacity", Math.max(0, 1 - a / 1.6));
            });
          });
          const label = s.h("p", { class: "big", style: { textAlign: "center" } }, "I play the violin.");
          const play = (it) => {
            big.textContent = it.em; label.textContent = "I play " + it.en + ".";
            big.classList.remove("a-pop"); void big.getBoundingClientRect(); big.classList.add("a-pop");
            s.speak("I play " + it.en + ".", EN);
            (it.tune || [0, 0, 0, 0, 0]).forEach((n, i) => setTimeout(() => { if (!s.alive) return; it.drum ? s.sfx.drum() : s.sfx.tone(523.25 * Math.pow(2, n / 12), 0.22, it.type, 0.12); }, 350 + i * 170));
            notes.forEach((n, i) => { n.t0 = tnow + i * 0.17; n.x = 120 + i * 55; });
          };
          const btns = inst.map(it => s.h("button", { class: "u5-tile", style: { padding: "6px 4px" }, onclick: () => { s.sfx.click(); play(it); } },
            s.h("span", { class: "em", style: { fontSize: "38px" } }, it.em), s.h("span", { class: "de" }, it.de)));
          const left = s.h("div", { class: "stack", style: { width: "500px" } }, svg, label, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px" } }, btns));
          const ex = [hear(s, "I play the violin.", "Ich spiele Geige."), hear(s, "My sister plays the piano.", "Meine Schwester spielt Klavier."), hear(s, "Do you play an instrument? – Yes, I play the trumpet.", "Spielst du ein Instrument? – Ja, Trompete.")];
          ex.forEach(e => e.classList.add("later"));
          const merk = s.h("div", { class: "merk later" }, "Instrumente: ", s.h("b", null, "play the …"), s.h("br"), "Sport ohne the: ", s.h("i", null, "play football"));
          const inst5 = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Bei dir"), s.h("p", { class: "small" }, "In der Instrumentalklasse suchst du dir am Ende von Klasse 5 ein Streich- oder Blasinstrument aus. Dann sagst du: ", s.h("b", null, "I play the cello."), " oder ", s.h("b", null, "I play the flute.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "30px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, ex, merk, inst5)));
          s.show(svg, "zoom"); s.show(btns, "up", 200); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(ex[0], "left"); s.sfx.pop(); await s.show(ex[1], "left"); s.sfx.pop(); await s.show(ex[2], "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Bei Instrumenten steht play the. Bei Sport steht kein the."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(inst5, "up"); s.say("Welches Instrument wählst du in der Instrumentalklasse?"); });
        },
      },
      /* 4 */
      {
        title: "can – das kann ich!",
        say: "Ruby aus London zeigt dir ihre Fähigkeiten-Karten. Mit can sagst du, was du kannst. Mit can't, was du nicht kannst.",
        build(s) {
          const data = [["🏊", "swim?", true, "I can swim."], ["⛸️", "skate?", false, "I can't skate."], ["🎸", "play the guitar?", true, "I can play the guitar."], ["🐴", "ride a horse?", false, "I can't ride a horse."]];
          const cards = data.map(([em, q, yes, sent]) => {
            const front = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" } }, s.h("span", { class: "em" }, em), s.h("span", { class: "q" }, q));
            const back = s.h("div", { style: { display: "none", flexDirection: "column", alignItems: "center", gap: "10px" } },
              s.h("span", { class: "mark", style: { color: yes ? "var(--green)" : "var(--red)" } }, yes ? "✓" : "✗"), s.h("span", { class: "sent" }, sent));
            const c = s.h("button", { class: "u5-flip", style: { height: "290px" }, onclick: () => { s.sfx.click(); s.speak(back.style.display === "flex" ? sent : "Can you " + q, EN); } }, front, back);
            c.flip = async () => {
              s.sfx.swoosh();
              await s.tween({ from: 1, to: -1, dur: 520, update: v => {
                const showBack = v < 0;
                front.style.display = showBack ? "none" : "flex"; back.style.display = showBack ? "flex" : "none";
                c.style.transform = `scaleX(${Math.max(0.02, Math.abs(v))})`;
                c.style.borderColor = showBack ? (yes ? "#9fd8bd" : "#f2b8b0") : "";
                c.style.background = showBack ? (yes ? "#e6f6ee" : "#fdeceb") : "";
              } });
              c.style.transform = "";
              yes ? s.sfx.success() : s.sfx.boing();
              s.speak(sent, EN);
            };
            return c;
          });
          const head = s.h("div", { class: "row" }, avatar(s, "ruby", 84), s.h("div", null, s.h("p", { class: "h2" }, "Ruby's skill cards"), s.h("p", { class: "small pencil" }, "Ruby, 11, wohnt in London. Weiter = Karte umdrehen.")));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "can"), " (kann) / ", s.h("b", null, "can't = cannot"), " (kann nicht) + Grundform. Immer gleich: I can, you can, ", s.h("b", null, "she can"), " – nie ", s.h("s", null, "cans"), "!",
            s.h("span", { style: { display: "flex", gap: "10px", marginTop: "8px" } }, hear(s, "Lukas can skate."), hear(s, "He can't play the guitar.")));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } }, head, s.h("div", { class: "cols4" }, cards), merk));
          s.show(head, "left"); s.show(cards, "pop", 150); s.sfx.whoosh();
          cards.forEach(c => s.step(() => c.flip()));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Can und can't bleiben immer gleich. Nach can kommt die Grundform."); });
        },
      },
      /* 5 */
      {
        title: "Can you …? – Yes, I can!",
        say: "So fragst du, ob jemand etwas kann: Can you swim? Die kurze Antwort ist: Yes, I can. Oder: No, I can't.",
        build(s) {
          const bub = (cls, txt) => { const b = s.h("button", { class: "u5-bub later " + cls, onclick: () => { s.sfx.click(); s.speak(txt, EN); } }); b.innerHTML = SPK; b.appendChild(s.h("span", null, txt)); return b; };
          const sets = [
            ["Beispiel 1 · at the pool", "🏊", "Can you swim?", "Yes, I can."],
            ["Beispiel 2 · in the music room", "🎹", "Can you play the piano?", "No, I can't. But I can play the drums."],
            ["Beispiel 3 · at the skate park", "🛹", "Can Lukas skate?", "Yes, he can. He's great!"],
          ];
          const cards = sets.map(([lab, em, q, a]) => {
            const bq = bub("q", q), ba = bub("a", a);
            const c = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "12px" } }, s.h("span", { class: "exlabel" }, lab), s.h("div", { style: { fontSize: "64px", lineHeight: 1, textAlign: "center" } }, em), bq, ba);
            c.q = bq; c.a = ba; return c;
          });
          const merk = s.h("div", { class: "merk later" }, "Frage: ", s.h("b", null, "Can"), " + Person + Verb? → Kurzantwort: ", s.h("b", null, "Yes, I can."), " / ", s.h("b", null, "No, I can't."), s.h("br"), "Nicht nur „Yes.“ – mit Kurzantwort klingt es freundlich und richtig.");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag · Probetraining im Schwimmverein"), s.h("div", { class: "row", style: { gap: "10px" } }, hear(s, "Can you swim 25 metres?", "Kannst du 25 Meter schwimmen?"), hear(s, "Yes, I can!", "Ja, kann ich!", "g")));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, cards), merk, life));
          cards.forEach((c, i) => s.step(async () => {
            s.sfx.pop(); await s.show(c, "up"); s.sfx.note(4, .15); await s.show(c.q, "left"); s.speak(sets[i][2], EN);
            await s.wait(900); s.sfx.note(9, .2); await s.show(c.a, "right"); s.speak(sets[i][3], EN);
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Antworte mit Kurzantwort: Yes, I can. No, I can't."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); s.speak("Can you swim 25 metres? Yes, I can!", EN); });
          s.sfx.whoosh();
        },
      },
      /* 6 */
      {
        title: "I love reading! like + -ing",
        say: "Was magst du? Schiebe den Regler von hate bis love und wähle ein Hobby. Nach like, love und hate steht das Verb mit i n g.",
        build(s) {
          const lv = ["hate", "don't like", "like", "love"];
          const acts = ["reading", "swimming", "dancing", "playing football", "cooking"];
          let L = 3, A = 0, mouth = 1.5;
          const svg = s.svg(260, 230, { width: 300, height: 265 });
          const face = s.el("circle", { cx: 130, cy: 115, r: 100, fill: "#ffd94a", stroke: "#c79a12", "stroke-width": 5 });
          const mouthP = s.el("path", { stroke: "#1b2740", "stroke-width": 8, fill: "none", "stroke-linecap": "round" });
          const browL = s.el("line", { stroke: "#1b2740", "stroke-width": 7, "stroke-linecap": "round" }), browR = s.el("line", { stroke: "#1b2740", "stroke-width": 7, "stroke-linecap": "round" });
          const heartL = s.el("path", { d: "M-14 -4 C-14 -16 0 -16 0 -6 C0 -16 14 -16 14 -4 C14 6 0 14 0 18 C0 14 -14 6 -14 -4 Z", fill: "#dc2626", transform: "translate(92,92)" });
          const heartR = s.el("path", { d: "M-14 -4 C-14 -16 0 -16 0 -6 C0 -16 14 -16 14 -4 C14 6 0 14 0 18 C0 14 -14 6 -14 -4 Z", fill: "#dc2626", transform: "translate(168,92)" });
          const eyeL = s.el("circle", { cx: 92, cy: 95, r: 10, fill: "#1b2740" }), eyeR = s.el("circle", { cx: 168, cy: 95, r: 10, fill: "#1b2740" });
          svg.append(face, browL, browR, eyeL, eyeR, heartL, heartR, mouthP);
          const drawFace = m => {
            const cy = 150 + (m - 1.5) * 26;
            mouthP.setAttribute("d", `M85 155 Q130 ${cy + (m - 1.5) * 18} 175 155`);
            const tilt = Math.max(0, 1.5 - m) * 10;
            browL.setAttribute("x1", 72); browL.setAttribute("y1", 70 - tilt); browL.setAttribute("x2", 108); browL.setAttribute("y2", 70 + tilt);
            browR.setAttribute("x1", 152); browR.setAttribute("y1", 70 + tilt); browR.setAttribute("x2", 188); browR.setAttribute("y2", 70 - tilt);
            const love = m > 2.5;
            heartL.style.display = heartR.style.display = love ? "" : "none";
            eyeL.style.display = eyeR.style.display = love ? "none" : "";
            const col = m < 0.5 ? "#f59a8f" : m < 1.5 ? "#ffcf87" : "#ffd94a";
            face.setAttribute("fill", col);
          };
          drawFace(3);
          const sent = s.h("p", { class: "big", style: { fontSize: "44px" } });
          const upd = () => { sent.innerHTML = ""; sent.append("I ", s.h("span", { class: "hl" }, lv[L]), " ", s.h("span", { style: { color: "var(--unit)" } }, acts[A]), "."); };
          upd();
          const say = () => s.speak(`I ${lv[L]} ${acts[A]}.`, EN);
          const sayBtn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); say(); } }); sayBtn.innerHTML = SPK; sayBtn.appendChild(s.h("span", null, "Anhören"));
          const sl = s.slider({ label: "Wie sehr?", min: 0, max: 3, value: 3, fmt: v => lv[v], onInput: v => { L = v; upd(); s.tween({ from: mouth, to: v, dur: 350, update: x => { mouth = x; drawFace(x); } }); } });
          const actBtns = acts.map((a, i) => s.h("button", { class: "u5-chip", onclick: () => { s.sfx.pop(); A = i; upd(); say(); } }, a));
          const scale = s.h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "19px", color: "var(--pencil)", marginTop: "-6px" } }, s.h("span", null, "😖 hasse"), s.h("span", null, "mag nicht"), s.h("span", null, "mag"), s.h("span", null, "liebe 😍"));
          const ex = [hear(s, "Ruby loves playing football.", "Ruby liebt Fußballspielen."), hear(s, "Lukas hates getting up early.", "Lukas hasst frühes Aufstehen."), hear(s, "My dad likes cooking.", "Mein Papa kocht gern.")];
          ex.forEach(e => e.classList.add("later"));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "like / love / hate"), " + Verb mit ", s.h("b", null, "-ing"), ". Bei he/she/it: ", s.h("b", null, "likes, loves, hates"), ".");
          const left = s.h("div", { class: "stack", style: { alignItems: "stretch", gap: "10px" } }, s.h("div", { class: "center" }, svg), sl, scale, merk);
          const right = s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "card soft", style: { display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" } }, sent, sayBtn), s.h("div", { class: "row", style: { gap: "10px" } }, actBtns), s.h("div", { class: "stack", style: { gap: "10px" } }, ex));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "430px 1fr", gap: "34px", height: "100%" } }, left, right));
          s.show(svg, "zoom"); s.sfx.boing();
          s.step(async () => { for (const e of ex) { s.sfx.pop(); await s.show(e, "left"); } s.say("Ruby, Lukas und Papa: drei Beispiele."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 */
      {
        title: "-ing richtig schreiben",
        say: "So hängst du i n g an. Meistens einfach dran. Ein stummes e fällt weg. Und bei kurzen Wörtern wird der letzte Buchstabe verdoppelt.",
        build(s) {
          const rows = [
            { word: "read", rule: "einfach -ing dran", ex: "play → playing · sing → singing", res: "reading" },
            { word: "dance", rule: "stummes e fällt weg", ex: "ride → riding · write → writing", res: "dancing", drop: 4 },
            { word: "swim", rule: "kurzes Wort: letzter Buchstabe doppelt", ex: "run → running · shop → shopping", res: "swimming", dbl: "m" },
          ];
          const built = rows.map((r, i) => {
            const letters = [...r.word].map(ch => s.h("span", { class: "u5-letter" }, ch));
            const dbl = r.dbl ? s.h("span", { class: "u5-letter new later" }, r.dbl) : null;
            const ing = [..."ing"].map(ch => s.h("span", { class: "u5-letter new later" }, ch));
            const wordBox = s.h("button", { class: "u5-tile", style: { flexDirection: "row", gap: "0", justifyContent: "flex-start", padding: "8px 16px", minHeight: "100px" }, onclick: () => { s.sfx.click(); s.speak(r.word + ". " + r.res, EN); } }, letters, dbl, ing);
            const card = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "250px 380px 1fr", gap: "18px", alignItems: "center", padding: "12px 18px" } },
              s.h("div", null, s.h("span", { class: "exlabel" }, "Regel " + (i + 1)), s.h("p", { class: "t", style: { fontWeight: 700 } }, r.rule)), wordBox, s.h("p", { class: "t later" }, r.ex));
            card.later = card.querySelector("p.later");
            card.run = async () => {
              s.sfx.pop(); await s.show(card, "left");
              if (r.drop != null) { s.sfx.error(); letters[r.drop].classList.add("gone", "a-shake"); await s.wait(700); letters[r.drop].style.display = "none"; }
              if (dbl) { s.sfx.snap(); await s.show(dbl, "pop"); }
              ing.forEach((x, k) => setTimeout(() => s.alive && s.sfx.count(k + 3), k * 120)); await s.show(ing, "bounce");
              s.speak(r.res, EN); s.sfx.coin(); s.show(card.later, "fade");
            };
            card.classList.add("later");
            return card;
          });
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "t" }, "Auf einem Steckbrief steht oft: ", s.h("b", null, "Hobbies: swimming, dancing, reading."), " Das -ing-Wort ist dann wie ein Nomen."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, built, life));
          s.sfx.whoosh();
          built.forEach(b => s.step(() => b.run()));
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 8 */
      {
        title: "Befehle: Stand up! Don't run!",
        say: "Mit Befehlen sagt man, was jemand tun soll. Der Satz beginnt einfach mit dem Verb. Verbote beginnen mit Don't.",
        build(s) {
          const svg = s.svg(240, 330);
          svg.append(
            s.el("circle", { cx: 120, cy: 60, r: 38, fill: "#f6d2b3", stroke: "#1b2740", "stroke-width": 4 }),
            s.el("path", { d: "M82 52 C84 18 156 18 158 52 C140 40 100 40 82 52 Z", fill: "#3b2a1e" }),
            s.el("rect", { x: 66, y: 104, width: 108, height: 120, rx: 22, fill: "#dc2626" }),
            s.el("text", { x: 120, y: 172, "text-anchor": "middle", "font-size": 21, "font-weight": 800, fill: "#fff", text: "COACH" }),
            s.el("line", { x1: 100, y1: 224, x2: 92, y2: 318, stroke: "#1b2740", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("line", { x1: 140, y1: 224, x2: 148, y2: 318, stroke: "#1b2740", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("line", { x1: 162, y1: 118, x2: 206, y2: 70, stroke: "#f6d2b3", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("line", { x1: 78, y1: 118, x2: 50, y2: 196, stroke: "#f6d2b3", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("circle", { cx: 105, cy: 62, r: 4, fill: "#1b2740" }), s.el("circle", { cx: 135, cy: 62, r: 4, fill: "#1b2740" }));
          const whistle = s.el("g", { transform: "translate(120,82)" }, s.el("rect", { x: -6, y: 0, width: 26, height: 12, rx: 5, fill: "#9aa3b3" }));
          const waves = s.el("path", { d: "M150 20 q10 -10 20 0 q10 10 20 0 M160 40 q10 -10 20 0 q10 10 20 0", stroke: "#1d5bd0", "stroke-width": 4, fill: "none", class: "later" });
          svg.append(whistle, waves);
          const whistleSnd = () => { s.sfx.tone(2400, 0.35, "sine", 0.18, 0, 2600); };
          const pos = [["Stand up!", "Steh auf!"], ["Sit down, please.", "Setz dich bitte."], ["Listen!", "Hör zu!"], ["Open your books.", "Öffnet eure Bücher."]];
          const neg = [["Don't run!", "Renn nicht!"], ["Don't shout!", "Schrei nicht!"], ["Don't touch it!", "Fass das nicht an!"], ["Don't be late!", "Komm nicht zu spät!"]];
          const gp = pos.map(([e, d]) => { const b = hear(s, e, d, "g"); b.classList.add("later"); return b; });
          const gn = neg.map(([e, d]) => { const b = hear(s, e, d, "r"); b.classList.add("later"); return b; });
          const colP = s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2 green" }, "✓ Mach das!"), gp);
          const colN = s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2 red" }, "✗ Lass das!"), gn);
          const merk = s.h("div", { class: "merk later" }, "Befehl: ", s.h("b", null, "Verb in der Grundform"), " am Anfang – ohne „you“. Verbot: ", s.h("b", null, "Don't + Verb"), ". Mit ", s.h("b", null, "please"), " klingt es freundlich.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "240px 1fr 1fr", gap: "26px", alignItems: "start" } }, svg, colP, colN), merk));
          s.show(svg, "up"); s.sfx.whoosh();
          s.step(async () => { s.show(waves, "fade"); whistleSnd(); for (const b of gp) { s.sfx.pop(); await s.show(b, "left", 0); } s.say("Steh auf! Setz dich! Hör zu!"); });
          s.step(async () => { whistleSnd(); for (const b of gn) { s.sfx.zap(); await s.show(b, "right", 0); } s.say("Verbote fangen mit Don't an."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 */
      {
        title: "Im Alltag: Regeln und Spiele",
        say: "Befehle stehen überall: auf Schildern im Schwimmbad, in Spielanleitungen und im Musikunterricht. Tippe auf einen Satz.",
        build(s) {
          const signs = [
            { h: "🏊 SWIMMING POOL RULES", col: "#1f4f8a", lines: ["Take a shower first.", "Don't run!", "Don't push other people.", "Listen to the lifeguard."] },
            { h: "🎲 HOW TO PLAY", col: "#7b4fd6", lines: ["Throw the dice.", "Move your counter.", "Don't look at the cards!", "Wait for your turn."] },
            { h: "🎻 IN THE MUSIC LESSON", col: "#138a5a", lines: ["Hold the bow like this.", "Play softly.", "Don't stop – keep going!", "Listen to the others."] },
          ];
          const boxes = signs.map(sg => {
            const ls = sg.lines.map(l => { const b = hear(s, l); b.classList.add("later"); b.style.borderColor = sg.col; b.style.fontSize = "21px"; return b; });
            const box = s.h("div", { class: "u5-sign later", style: { borderColor: sg.col } }, s.h("div", { class: "sh", style: { background: sg.col } }, sg.h), s.h("div", { class: "sb" }, ls));
            box.ls = ls; return box;
          });
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Tipp"), s.h("p", { class: "t" }, "Schilder und Anleitungen benutzen fast immer Befehle. Achte auf ", s.h("b", null, "Don't"), " – das ist ein Verbot!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } }, s.h("div", { class: "cols3" }, boxes), life));
          s.sfx.whoosh();
          boxes.forEach(b => s.step(async () => { s.sfx.snap(); await s.show(b, "down"); for (const l of b.ls) { s.sfx.tick(); await s.show(l, "fade", 0); } }));
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 10 */
      {
        title: "there is / there are",
        say: "Mit there is und there are beschreibst du einen Ort. There is für eine Sache, there are für mehrere.",
        build(s) {
          const W = 560, H = 520;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 3, y: 3, width: W - 6, height: H - 6, rx: 26, fill: "#cdebb5", stroke: "#6aa84f", "stroke-width": 5 }),
            s.el("path", { d: "M3 300 C150 260 300 330 557 280", stroke: "#e8dcc0", "stroke-width": 34, fill: "none" }));
          // skate park
          const skate = s.el("g", { class: "later" },
            s.el("path", { d: "M40 470 L40 400 Q40 450 110 450 L210 450 Q260 450 260 400 L260 470 Z", fill: "#b9c2cf", stroke: "#5d6678", "stroke-width": 4 }),
            s.el("rect", { x: 120, y: 428, width: 60, height: 10, rx: 5, fill: "#dc2626" }), s.el("circle", { cx: 130, cy: 442, r: 5, fill: "#1b2740" }), s.el("circle", { cx: 170, cy: 442, r: 5, fill: "#1b2740" }));
          // two pools
          const pool1 = s.el("rect", { x: 320, y: 340, width: 200, height: 60, rx: 12, fill: "#5ab0e6", stroke: "#1f4f8a", "stroke-width": 4 });
          const pool2 = s.el("rect", { x: 320, y: 418, width: 200, height: 60, rx: 12, fill: "#5ab0e6", stroke: "#1f4f8a", "stroke-width": 4 });
          const pools = s.el("g", { class: "later" }, pool1, pool2,
            s.el("path", { d: "M340 370 q10 -8 20 0 t20 0 t20 0 M440 448 q10 -8 20 0 t20 0 t20 0", stroke: "#fff", "stroke-width": 3, fill: "none" }));
          // three trees
          const tree = x => s.el("g", null, s.el("rect", { x: x - 8, y: 150, width: 16, height: 70, fill: "#8a5a2b" }), s.el("circle", { cx: x, cy: 130, r: 48, fill: "#3f8f3a" }));
          const trees = s.el("g", { class: "later" }, tree(80), tree(190), tree(300));
          // café
          const cafe = s.el("g", { class: "later" },
            s.el("rect", { x: 400, y: 90, width: 130, height: 110, fill: "#fff3d6", stroke: "#a8743a", "stroke-width": 4 }),
            s.el("path", { d: "M390 92 L465 40 L540 92 Z", fill: "#dc2626" }),
            s.el("rect", { x: 450, y: 145, width: 32, height: 55, fill: "#a8743a" }),
            s.el("text", { x: 465, y: 128, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#a8743a", text: "CAFÉ" }));
          svg.append(trees, cafe, skate, pools);
          const sents = [
            [skate, "There's a skate park.", "Es gibt einen Skatepark."],
            [pools, "There are two pools.", "Es gibt zwei Becken."],
            [trees, "There are three trees.", "Es gibt drei Bäume."],
            [cafe, "There's a café.", "Es gibt ein Café."],
          ];
          const btns = sents.map(([, e, d]) => { const b = hear(s, e, d); b.classList.add("later"); return b; });
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "There is"), " (kurz: ", s.h("b", null, "There's"), ") + eine Sache", s.h("br"), s.h("b", null, "There are"), " + mehrere Sachen", s.h("br"), "Deutsch: „Es gibt …“");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "30px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, btns, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          sents.forEach(([g, e], i) => s.step(async () => { s.sfx.pop(); s.show(g, "pop"); await s.show(btns[i], "left"); s.speak(e, EN); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 */
      {
        title: "some und any",
        say: "Some heißt einige. In Fragen und in verneinten Sätzen sagt man meistens any.",
        build(s) {
          const sets = [
            ["Beispiel 1 · Sports centre", "🎾", [["There are some tennis courts.", "+"], ["Are there any pools? – Yes, there are.", "?"]]],
            ["Beispiel 2 · My school bag", "🎒", [["There are some pens in my bag.", "+"], ["There aren't any sweets.", "–"]]],
            ["Beispiel 3 · Youth club fridge", "🧃", [["Are there any drinks?", "?"], ["Yes, there are some.", "+"]]],
          ];
          const cards = sets.map(([lab, em, ls]) => {
            const bs = ls.map(([t, k]) => { const b = hear(s, t); b.prepend(s.h("span", { style: { font: "800 26px/1 var(--f-display)", color: k === "+" ? "var(--green)" : k === "–" ? "var(--red)" : "var(--blue)", width: "18px", flex: "none" } }, k)); b.classList.add("later"); return b; });
            const c = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "12px" } }, s.h("span", { class: "exlabel" }, lab), s.h("div", { style: { fontSize: "72px", lineHeight: 1, textAlign: "center" } }, em), bs);
            c.bs = bs; return c;
          });
          const merk = s.h("div", { class: "merk later" }, s.h("b", { class: "green" }, "+ some"), " in normalen Sätzen. ", s.h("b", { class: "blue" }, "? any"), " in Fragen. ", s.h("b", { class: "red" }, "– any"), " in verneinten Sätzen (", s.h("i", null, "aren't any"), ").");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } }, s.h("div", { class: "cols3" }, cards), merk));
          s.sfx.whoosh();
          cards.forEach(c => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); for (const b of c.bs) { s.sfx.tick(); await s.show(b, "left", 0); } }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 */
      {
        title: "After-school clubs",
        say: "Viele Schulen in Großbritannien haben After-school clubs. Das sind Gruppen nach dem Unterricht, ähnlich wie bei uns die AGs.",
        build(s) {
          const rows = [["Monday", "⚽", "Football club"], ["Tuesday", "🎭", "Drama club"], ["Wednesday", "♟️", "Chess club"], ["Thursday", "🎤", "Choir"], ["Friday", "💻", "Coding club"]];
          const prs = rows.map(([d, em, c]) => {
            const b = s.h("button", { class: "u5-cell", style: { border: "0", padding: "6px 8px", background: "transparent" }, onclick: () => { s.sfx.click(); s.speak(`${c} is on ${d}.`, EN); } }, s.h("span", { class: "em", style: { fontSize: "32px" } }, em), s.h("span", { class: "en" }, c));
            return s.h("div", { class: "u5-prow later" }, s.h("span", { class: "d" }, d), b);
          });
          const pin = s.h("div", { style: { position: "absolute", top: "-14px", left: "50%", width: "26px", height: "26px", borderRadius: "50%", background: "#dc2626", border: "3px solid #8b1414", marginLeft: "-13px" } });
          const poster = s.h("div", { class: "u5-poster" }, pin, s.h("div", { class: "ph" }, "AFTER-SCHOOL CLUBS"), s.h("div", { class: "ps" }, "Greenfield School · 3.30 – 4.30 pm"), prs,
            s.h("p", { class: "small", style: { textAlign: "center", marginTop: "8px", fontWeight: 700 } }, "Everybody is welcome! Ask your teacher."));
          const ruby = s.h("div", { class: "row later", style: { alignItems: "flex-start", flexWrap: "nowrap" } }, avatar(s, "ruby", 80), s.h("div", { class: "stack", style: { gap: "10px" } }, hear(s, "I go to football club on Mondays."), hear(s, "And I'm in the choir on Thursdays.")));
          const lukas = s.h("div", { class: "row later", style: { alignItems: "center", flexWrap: "nowrap" } }, avatar(s, "lukas", 80), hear(s, "In Berlin I'm in the chess club!", "Lukas (Berlin): Ich bin in der Schach-AG."));
          const facts = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Gut zu wissen"), s.h("p", { class: "small" }, "In Großbritannien heißen solche Gruppen ", s.h("b", null, "clubs"), ": after-school clubs. Bei dir heißen sie AGs (Arbeitsgemeinschaften). ", s.h("b", null, "on Mondays"), " = montags, also jede Woche."));
          const note = s.h("p", { class: "small pencil later" }, "Greenfield School ist ausgedacht – so ein Plakat hängt aber in vielen Schulen.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "30px", height: "100%", alignItems: "start", paddingTop: "14px" } }, poster, s.h("div", { class: "stack", style: { gap: "16px" } }, ruby, lukas, facts, note)));
          s.show(poster, "zoom"); s.sfx.snap();
          s.step(async () => { for (let i = 0; i < prs.length; i++) { s.sfx.count(i); await s.show(prs[i], "left", 0); } s.say("Montag Fußball, Dienstag Theater, Mittwoch Schach, Donnerstag Chor, Freitag Programmieren."); });
          s.step(async () => { s.sfx.pop(); await s.show(ruby, "right"); s.speak("I go to football club on Mondays.", EN); });
          s.step(async () => { s.sfx.pop(); await s.show(lukas, "right"); s.speak("In Berlin I'm in the chess club!", EN); });
          s.step(async () => { s.sfx.ding(); await s.show(facts, "up"); s.show(note, "fade"); });
        },
      },
      /* 13 */
      {
        title: "Einladung zum Youth club",
        say: "Ruby lädt ihre Freundin Zoe in den Youth club ein. Ein Youth club ist ein Jugendtreff. Schau dir die Nachrichten an.",
        build(s) {
          const msgs = [["me", "Hi Zoe! Do you want to come to the youth club on Friday?"], ["you", "Maybe! What can we do there?"], ["me", "We can play table tennis and table football. There's a music room too!"], ["you", "Cool! What time?"], ["me", "At 6 o'clock. Let's meet at the bus stop."], ["you", "OK. See you on Friday! 🙂"]];
          const els = msgs.map(([w, t]) => s.h("button", { class: "u5-msg later " + w, onclick: () => { s.sfx.click(); s.speak(t.replace("🙂", ""), EN); } }, t));
          const dots = s.h("div", { class: "u5-msg you later", style: { fontSize: "26px", letterSpacing: "4px", padding: "2px 14px" } }, "•••");
          const phone = s.h("div", { class: "u5-phone" }, s.h("div", { class: "u5-screen" }, s.h("div", { class: "top" }, avatar(s, "ruby", 40), "Ruby → Zoe"), s.h("div", { class: "msgs" }, els, dots)));
          const phrases = [hear(s, "Do you want to come …?", "Willst du mitkommen …?"), hear(s, "Let's meet at …", "Lass uns treffen bei/um …"), hear(s, "See you!", "Bis dann!")];
          phrases.forEach(p => p.classList.add("later"));
          const info = s.h("div", { class: "card soft" }, s.h("span", { class: "exlabel" }, "youth club"), s.h("p", { class: "small" }, "Ein Treffpunkt für Jugendliche: Tischtennis, Kicker, Basketball, Videospiele, Musik."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "400px 1fr", gap: "40px", height: "100%", alignItems: "center" } }, phone, s.h("div", { class: "stack", style: { gap: "14px" } }, info, s.h("p", { class: "h2" }, "Nützliche Sätze"), phrases)));
          s.show(phone, "up"); s.sfx.whoosh();
          const sendIt = async (i) => {
            const m = els[i];
            if (msgs[i][0] === "you" && !s.fast) { dots.parentNode.insertBefore(dots, m); s.show(dots, "fade"); s.sfx.tick(); await s.wait(700); s.hide(dots); }
            msgs[i][0] === "me" ? s.sfx.swoosh() : s.sfx.pop();
            await s.show(m, msgs[i][0] === "me" ? "right" : "left");
          };
          s.step(async () => { await sendIt(0); await sendIt(1); });
          s.step(async () => { await sendIt(2); await sendIt(3); });
          s.step(async () => { await sendIt(4); await sendIt(5); s.sfx.success(); });
          s.step(async () => { for (const p of phrases) { s.sfx.pop(); await s.show(p, "left", 0); } });
        },
      },
      /* 14 */
      {
        title: "Im Alltag: Ruby's weekend plan",
        say: "Das ist Rubys Wochenendplan. Sie beschreibt ihre Hobbys am Samstag und am Sonntag.",
        build(s) {
          const plan = [
            ["morning", "🏊", "I go swimming.", "Ich gehe schwimmen.", "🎸", "I practise the guitar.", "Ich übe Gitarre."],
            ["afternoon", "⚽", "I play football in the park.", "Fußball im Park.", "🛹", "I go skateboarding.", "Ich fahre Skateboard."],
            ["evening", "🎮", "I play computer games.", "Computerspiele.", "📚", "I read a book.", "Ich lese ein Buch."],
          ];
          const cell = (em, en, de) => s.h("button", { class: "u5-cell later", onclick: () => { s.sfx.click(); s.speak(en, EN); } }, s.h("span", { class: "em" }, em), s.h("span", null, s.h("span", { class: "en" }, en), s.h("br"), s.h("span", { class: "de" }, de)));
          const sat = [], sun = [];
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 1fr 1fr", gap: "12px", alignItems: "stretch" } },
            s.h("div"), s.h("div", { class: "u5-dayh" }, "Saturday"), s.h("div", { class: "u5-dayh" }, "Sunday"));
          plan.forEach(([t, e1, en1, de1, e2, en2, de2]) => { const a = cell(e1, en1, de1), b = cell(e2, en2, de2); sat.push(a); sun.push(b); grid.append(s.h("div", { class: "u5-timeh" }, "in the " + t), a, b); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, s.h("b", null, "on"), " Saturday · ", s.h("b", null, "in"), " the morning / afternoon / evening · ", s.h("b", null, "at"), " 3 o'clock", s.h("br"), "Zusammen: ", s.h("i", null, "on Saturday morning"), " (ohne in the!)");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "row" }, avatar(s, "ruby", 64), s.h("p", { class: "h2" }, "My weekend"), s.h("span", { class: "hand", style: { color: "var(--red)" } }, "– tippe auf ein Feld")), grid, merk));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i); await s.show(sat[i], "left", 0); } s.speak("On Saturday morning I go swimming.", EN); });
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i + 3); await s.show(sun[i], "right", 0); } s.speak("On Sunday morning I practise the guitar.", EN); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("On Saturday, in the morning, at three o'clock. Und zusammen: on Saturday morning."); });
        },
      },
      /* 15 */
      {
        title: "Im Alltag: Sport in London",
        say: "In London gibt es berühmte Sportorte. Das Wembley-Stadion hat neunzigtausend Plätze. Das Berliner Olympiastadion hat knapp vierundsiebzigtausend.",
        build(s) {
          const W = 470, H = 450;
          const svg = s.svg(W, H);
          const base = 380, maxH = 300;
          const bars = [{ x: 70, val: 90000, name: "Wembley", col: "#dc2626", sub: "London" }, { x: 270, val: 73877, name: "Olympiastadion", col: "#1d5bd0", sub: "Berlin" }];
          svg.append(s.el("line", { x1: 20, y1: base, x2: W - 20, y2: base, stroke: "#1b2740", "stroke-width": 3 }));
          const parts = bars.map(b => {
            const r = s.el("rect", { x: b.x, y: base, width: 130, height: 0, rx: 8, fill: b.col });
            const v = s.el("text", { x: b.x + 65, y: base - 12, "text-anchor": "middle", "font-size": 28, "font-weight": 800, fill: b.col, text: "0" });
            const n1 = s.el("text", { x: b.x + 65, y: base + 26, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: b.name });
            const n2 = s.el("text", { x: b.x + 65, y: base + 48, "text-anchor": "middle", "font-size": 19, fill: "#5d6678", text: b.sub });
            svg.append(r, v, n1, n2); return { r, v, b };
          });
          const grow = async p => {
            const hh = p.b.val / 90000 * maxH;
            s.sfx.whoosh();
            await s.tween({ dur: 1200, ease: "out", update: (x) => { p.r.setAttribute("y", base - hh * x); p.r.setAttribute("height", hh * x); p.v.setAttribute("y", base - hh * x - 12); p.v.textContent = s.fmt(Math.round(p.b.val * x)); } });
            s.sfx.ding();
          };
          const cap = s.h("p", { class: "t", style: { textAlign: "center" } }, "Sitzplätze im Stadion");
          const c1 = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Wembley Stadium"), hear(s, "Wembley has got 90,000 seats.", "Das größte Stadion in Großbritannien."));
          const c2 = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Hyde Park"), s.h("p", { class: "small" }, "140 Hektar groß, mit Fußballplätzen, Tennis und einem Freibad im See ", s.h("b", null, "Serpentine"), " (seit 1930)."), hear(s, "You can go swimming in the Serpentine."));
          const c3 = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "London Aquatics Centre"), s.h("p", { class: "small" }, "Das Olympia-Schwimmbad von 2012 – seit 2014 darf jeder hier schwimmen. Es hat zwei 50-Meter-Becken."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "30px", height: "100%", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "4px" } }, svg, cap), s.h("div", { class: "stack", style: { gap: "12px" } }, c1, c2, c3)));
          s.show(svg, "fade");
          s.step(async () => { await grow(parts[0]); s.sfx.pop(); await s.show(c1, "left"); s.speak("Wembley has got 90,000 seats.", EN); });
          s.step(async () => { await grow(parts[1]); s.say("Das Olympiastadion in Berlin hat 73.877 Plätze."); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "left"); s.sfx.success(); });
        },
      },
    ],
  });
})();
