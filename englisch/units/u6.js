/* Unit 6 – At home and in town (Englisch Klasse 5) */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6"/></svg>';
  const CSS = `
.u6-hear{min-height:56px;padding:6px 16px;border-radius:14px;border:2px solid var(--unit);background:var(--card);color:var(--ink);font:700 22px/1.2 var(--f-display);cursor:pointer;display:flex;align-items:center;gap:10px;text-align:left}
.u6-hear svg{flex:none;color:var(--unit)}
.u6-hear small{display:block;font:400 19px/1.2 var(--f-body);color:var(--pencil)}
.u6-hear:active{transform:scale(.98)}
.u6-hear.on{background:var(--unit-soft)}
.u6-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:var(--card);border:2px solid var(--line);border-radius:16px;padding:8px;cursor:pointer;color:var(--ink);font-family:var(--f-body);text-align:center}
.u6-tile:active{transform:scale(.97)}
.u6-tile .em{font-size:46px;line-height:1.05}
.u6-tile .en{font:700 24px/1.12 var(--f-display);color:var(--unit)}
.u6-tile .de{font-size:19px;line-height:1.2;color:var(--pencil)}
.u6-bub{border-radius:18px;padding:8px 14px;font:700 21px/1.22 var(--f-display);border:0;cursor:pointer;display:flex;gap:8px;align-items:center;text-align:left;color:var(--ink);min-height:56px;max-width:92%}
.u6-bub.q{background:#fff3d6;align-self:flex-start;border-bottom-left-radius:4px}
.u6-bub.a{background:#e3f2e4;align-self:flex-end;border-bottom-right-radius:4px}
.u6-bub svg{flex:none;color:var(--pencil)}
.u6-bub b{font:800 19px/1 var(--f-body);color:var(--pencil);flex:none}
.u6-letter{background:#fffdf5;background-image:linear-gradient(transparent 37px,#c9daf0 37px,#c9daf0 38px,transparent 38px);background-size:100% 38px;border:2px solid var(--line);border-radius:6px;padding:19px 26px 19px 30px;box-shadow:4px 6px 0 rgba(0,0,0,.08);font-size:23px;line-height:38px}
.u6-letter p{margin:0}
.u6-letter .hand{font-size:34px;line-height:38px}
.u6-word{font-weight:700;color:var(--unit)}
.u6-prep{font-weight:700;color:var(--blue)}
`;
  if (!document.getElementById("u6-css")) { const st = document.createElement("style"); st.id = "u6-css"; st.textContent = CSS; document.head.appendChild(st); }

  function hear(s, en, de, extra = "") {
    const b = s.h("button", { class: "u6-hear " + extra, onclick: () => { s.sfx.click(); s.speak(en, EN); } });
    b.innerHTML = SPK;
    b.appendChild(s.h("span", null, en, de ? s.h("small", null, de) : null));
    return b;
  }
  /* the cast (same look as Unit 1/2): Ruby (11, London) and Lukas (10, Berlin) */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "u6g" });
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
    const id = "u6av" + (++avN);
    const clip = s.el("clipPath", { id }, s.el("circle", { cx: 50, cy: 50, r: 46.5 }));
    const fig = s.el("g", { "clip-path": `url(#${id})` }, s.el("g", { transform: "translate(50 167) scale(0.75)" }, cast(s, who, 0, 0, { h: 200 })));
    svg.append(s.el("defs", null, clip),
      s.el("circle", { cx: 50, cy: 50, r: 48, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), fig);
    return svg;
  }
  /** a little person for maps; returns a <g> with .at(x,y) */
  function walker(s, color = "#dc2626") {
    const g = s.el("g", { style: { pointerEvents: "none" } });
    g.append(s.el("circle", { cx: 0, cy: 0, r: 17, fill: color, stroke: "#fff", "stroke-width": 4 }), s.el("circle", { cx: 0, cy: -4, r: 6, fill: "#fff" }), s.el("path", { d: "M-8 9 Q0 0 8 9", stroke: "#fff", "stroke-width": 3, fill: "none" }));
    g.pos = { x: 0, y: 0 };
    g.at = (x, y) => { g.pos = { x, y }; g.setAttribute("transform", `translate(${x},${y})`); };
    return g;
  }
  async function walk(s, g, pts, speed = 0.28) {
    for (const p of pts) {
      const a = { ...g.pos }, len = Math.hypot(p[0] - a.x, p[1] - a.y);
      if (len < 1) continue;
      s.sfx.tick();
      await s.tween({ dur: len / speed, ease: "inOut", update: v => g.at(a.x + (p[0] - a.x) * v, a.y + (p[1] - a.y) * v) });
    }
  }
  const glow = (el, on, col = "#ffd94a") => { el.setAttribute("stroke", on ? col : el.dataset.stroke); el.setAttribute("stroke-width", on ? 8 : el.dataset.sw); };
  const bld = (s, x, y, w, h, fill, label, stroke = "#5d6678") => {
    const r = s.el("rect", { x, y, width: w, height: h, rx: 8, fill, stroke, "stroke-width": 3, "data-stroke": stroke, "data-sw": 3 });
    const t = label ? s.el("text", { x: x + w / 2, y: y + h / 2 + 7, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: label }) : null;
    return { r, t, g: s.el("g", null, r, t) };
  };

  Deck.unit({
    id: "u6", num: 6, title: "At home and in town", color: "#2f7d32", soft: "#e3f2e4",
    subtitle: "Where do you live? How do I get to …?",
    blurb: "Zimmer, Möbel, Präpositionen, Wege beschreiben, London",
    goals: ["Dein Zuhause beschreiben: rooms, furniture, there is / there are", "Sagen, wo etwas ist: in, on, under, next to, behind …", "a, an, the richtig benutzen", "Nach dem Weg fragen und den Weg erklären", "London kennenlernen: the Tube, Big Ben, Tower Bridge"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 27, fill: "#2f7d32", opacity: .14 }),
        el("path", { d: "M16 36 L35 18 L54 36 L54 54 L16 54 Z", fill: "#fff", stroke: "#2f7d32", "stroke-width": 3, "stroke-linejoin": "round" }),
        el("rect", { x: 30, y: 40, width: 10, height: 14, fill: "#2f7d32" }));
    },
    slides: [
      /* 1 */
      {
        title: "Where do you live?",
        say: "Wo wohnst du? In England sagt man flat für eine Wohnung. Ruby wohnt in einem Reihenhaus, auf Englisch terraced house.",
        build(s) {
          const draw = kind => {
            const v = s.svg(300, 200);
            v.append(s.el("rect", { x: 0, y: 186, width: 300, height: 14, fill: "#9fd08f" }));
            if (kind === "flat") {
              v.append(s.el("rect", { x: 70, y: 20, width: 160, height: 168, fill: "#e8dcc0", stroke: "#8a7a5a", "stroke-width": 3 }));
              for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) v.append(s.el("rect", { x: 86 + c * 48, y: 32 + r * 38, width: 30, height: 24, fill: r === 0 && c === 2 ? "#ffd94a" : "#bfe0f5", stroke: "#8a7a5a", "stroke-width": 2 }));
              v.append(s.el("rect", { x: 135, y: 156, width: 30, height: 32, fill: "#8a5a2b" }));
            } else if (kind === "terraced") {
              for (let i = 0; i < 4; i++) {
                const x = 14 + i * 68, col = ["#c96b4a", "#d98a5c", "#b85c3c", "#d0795a"][i];
                v.append(s.el("rect", { x, y: 70, width: 68, height: 118, fill: col, stroke: "#6b3a26", "stroke-width": 2 }),
                  s.el("path", { d: `M${x} 70 L${x + 34} 40 L${x + 68} 70 Z`, fill: "#5d6678" }),
                  s.el("rect", { x: x + 8, y: 86, width: 22, height: 26, fill: "#bfe0f5" }), s.el("rect", { x: x + 38, y: 86, width: 22, height: 26, fill: "#bfe0f5" }),
                  s.el("rect", { x: x + 24, y: 140, width: 20, height: 48, fill: i === 1 ? "#1d5bd0" : "#2a3550" }));
              }
            } else {
              v.append(s.el("rect", { x: 90, y: 80, width: 120, height: 108, fill: "#fff3d6", stroke: "#8a5a2b", "stroke-width": 3 }),
                s.el("path", { d: "M78 82 L150 30 L222 82 Z", fill: "#dc3b2a" }),
                s.el("rect", { x: 104, y: 100, width: 30, height: 28, fill: "#bfe0f5" }), s.el("rect", { x: 166, y: 100, width: 30, height: 28, fill: "#bfe0f5" }),
                s.el("rect", { x: 138, y: 140, width: 26, height: 48, fill: "#8a5a2b" }),
                s.el("circle", { cx: 40, cy: 140, r: 32, fill: "#3f8f3a" }), s.el("rect", { x: 35, y: 160, width: 10, height: 28, fill: "#8a5a2b" }),
                s.el("circle", { cx: 262, cy: 150, r: 24, fill: "#3f8f3a" }));
            }
            return v;
          };
          const data = [
            ["flat", "a flat", "die Wohnung", "lukas", "I live in a flat in Berlin. It's on the third floor.", "Lukas: im 3. Stock (gelbes Fenster)."],
            ["terraced", "a terraced house", "das Reihenhaus", "ruby", "I live in a terraced house in London.", "Häuser in einer Reihe, Wand an Wand – in England sehr typisch."],
            ["detached", "a detached house", "das freistehende Haus", null, "My grandma lives in a detached house.", "Ein Haus ganz für sich, mit Garten rundherum."],
          ];
          const cards = data.map(([k, en, de, who, sent, note]) => {
            const pic = draw(k);
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch", padding: "14px 16px" } },
              s.h("div", { class: "center" }, pic), hear(s, en, de),
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px", alignItems: "center" } }, who ? avatar(s, who, 56) : null, hear(s, sent)),
              s.h("p", { class: "small pencil" }, note));
            c.sent = sent; return c;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, s.h("b", null, "flat"), " (britisch) = ", s.h("i", null, "apartment"), " (amerikanisch) = Wohnung. ",
            s.h("b", null, "ground floor"), " = Erdgeschoss, ", s.h("b", null, "first floor"), " = 1. Stock – genau wie bei uns.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { gap: "18px" } }, cards), merk));
          s.sfx.whoosh();
          cards.forEach(c => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); s.speak(c.sent, EN); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Flat heißt Wohnung. Ground floor ist das Erdgeschoss."); });
        },
      },
      /* 2 */
      {
        title: "Ruby's house – upstairs, downstairs",
        say: "Hier siehst du in Rubys Haus hinein. Unten sind Küche, Flur und Wohnzimmer. Oben sind die Schlafzimmer und das Bad. Tippe auf ein Zimmer!",
        build(s) {
          const W = 620, H = 560;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 530, width: W, height: 30, fill: "#9fd08f" }),
            s.el("path", { d: "M14 180 L245 40 L476 180 Z", fill: "#7a4a3a", stroke: "#4a2a20", "stroke-width": 4 }),
            s.el("rect", { x: 330, y: 70, width: 30, height: 60, fill: "#7a4a3a", stroke: "#4a2a20", "stroke-width": 3 }));
          const mk = (x, y, label, em, say, fill) => {
            const r = s.el("rect", { x, y, width: 146, height: 175, fill, stroke: "#4a2a20", "stroke-width": 4 });
            const t = s.el("text", { x: x + 73, y: y + 32, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: label });
            const e = s.el("text", { x: x + 73, y: y + 125, "text-anchor": "middle", "font-size": 54, text: em });
            const g = s.el("g", { class: "later", style: { cursor: "pointer" } }, r, t, e);
            g.addEventListener("click", () => { s.sfx.pop(); s.speak(say, EN); r.setAttribute("fill", "#ffd94a"); setTimeout(() => s.alive && r.setAttribute("fill", fill), 600); });
            svg.append(g); return g;
          };
          const down = [mk(24, 355, "kitchen", "🍳", "the kitchen", "#fff3d6"), mk(170, 355, "hall", "", "the hall", "#f3e6d0"), mk(316, 355, "living room", "🛋️", "the living room", "#fde6e3")];
          const up = [mk(24, 180, "bedroom", "🛏️", "the bedroom", "#e4ecfb"), mk(170, 180, "bathroom", "🛁", "the bathroom", "#d7f0f7"), mk(316, 180, "Ruby's room", "🎸", "Ruby's room", "#e3f2e4")];
          // stairs in the hall + front door
          const stairs = s.el("path", { d: "M190 530 L190 505 L215 505 L215 480 L240 480 L240 455 L265 455 L265 430 L290 430 L290 405", stroke: "#4a2a20", "stroke-width": 5, fill: "none", class: "later" });
          svg.append(stairs);
          const garden = s.el("g", { class: "later", style: { cursor: "pointer" } },
            s.el("rect", { x: 482, y: 360, width: 130, height: 170, rx: 10, fill: "#cdebb5", stroke: "#6aa84f", "stroke-width": 3 }),
            s.el("circle", { cx: 547, cy: 430, r: 36, fill: "#3f8f3a" }), s.el("rect", { x: 541, y: 460, width: 12, height: 50, fill: "#8a5a2b" }),
            s.el("text", { x: 547, y: 386, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: "garden" }));
          garden.addEventListener("click", () => { s.sfx.pop(); s.speak("the garden", EN); });
          svg.append(garden);
          const lblUp = s.el("text", { x: 245, y: 166, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff", text: "UPSTAIRS", class: "later" });
          svg.append(lblUp);
          const s1 = hear(s, "Ruby's room is upstairs.", "Rubys Zimmer ist oben."), s2 = hear(s, "The kitchen is downstairs.", "Die Küche ist unten."), s3 = hear(s, "Go upstairs to the bathroom.", "Geh nach oben ins Bad.");
          [s1, s2, s3].forEach(b => b.classList.add("later"));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "upstairs"), " = oben (im Haus)", s.h("br"), s.h("b", null, "downstairs"), " = unten", s.h("br"), s.h("b", null, "the stairs"), " = die Treppe");
          const tip = s.h("p", { class: "hand", style: { color: "var(--red)", margin: 0 } }, "Tippe auf ein Zimmer!");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "26px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, tip, s1, s2, s3, merk)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (const g of down) { s.sfx.pop(); await s.show(g, "pop", 0); } s.sfx.snap(); s.show(stairs, "draw"); s.speak("the kitchen, the hall, the living room", EN); });
          s.step(async () => { for (const g of up) { s.sfx.pop(); await s.show(g, "pop", 0); } s.show(lblUp, "fade"); s.speak("the bedroom, the bathroom, Ruby's room", EN); });
          s.step(async () => { s.sfx.pop(); await s.show(garden, "pop"); s.speak("the garden", EN); });
          s.step(async () => { for (const b of [s1, s2, s3]) { s.sfx.pop(); await s.show(b, "left", 0); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 */
      {
        title: "Furniture: in Ruby's room",
        say: "Das ist Rubys Zimmer. Hier lernst du die Möbel auf Englisch. Tippe auf ein Möbelstück im Bild oder auf ein Wort.",
        build(s) {
          const W = 620, H = 520;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: 360, fill: "#fdf1dc" }), s.el("rect", { x: 0, y: 360, width: W, height: 160, fill: "#d9b48a" }),
            s.el("rect", { x: 2, y: 2, width: W - 4, height: H - 4, fill: "none", stroke: "#8a5a2b", "stroke-width": 4, rx: 10 }));
          const items = {};
          const add = (key, en, ...els) => { const g = s.el("g", { style: { cursor: "pointer" } }, ...els); g.addEventListener("click", () => tap(key)); svg.append(g); items[key] = { g, en }; };
          add("window", "a window", s.el("rect", { x: 240, y: 40, width: 150, height: 120, fill: "#bfe0f5", stroke: "#fff", "stroke-width": 8 }), s.el("line", { x1: 315, y1: 40, x2: 315, y2: 160, stroke: "#fff", "stroke-width": 6 }));
          add("door", "a door", s.el("rect", { x: 540, y: 140, width: 70, height: 220, fill: "#a8743a", stroke: "#6b4422", "stroke-width": 3 }), s.el("circle", { cx: 552, cy: 255, r: 5, fill: "#ffd94a" }));
          add("poster", "a poster", s.el("rect", { x: 420, y: 50, width: 90, height: 120, fill: "#fff", stroke: "#1d5bd0", "stroke-width": 4 }), s.el("circle", { cx: 465, cy: 100, r: 26, fill: "#dc2626" }), s.el("rect", { x: 440, y: 140, width: 50, height: 10, fill: "#1d5bd0" }));
          add("wardrobe", "a wardrobe", s.el("rect", { x: 20, y: 110, width: 120, height: 290, rx: 6, fill: "#c99a62", stroke: "#6b4422", "stroke-width": 3 }), s.el("line", { x1: 80, y1: 110, x2: 80, y2: 400, stroke: "#6b4422", "stroke-width": 3 }), s.el("circle", { cx: 72, cy: 250, r: 4, fill: "#6b4422" }), s.el("circle", { cx: 88, cy: 250, r: 4, fill: "#6b4422" }));
          add("shelf", "a shelf", s.el("rect", { x: 160, y: 200, width: 70, height: 10, fill: "#6b4422" }), s.el("rect", { x: 166, y: 168, width: 12, height: 32, fill: "#dc2626" }), s.el("rect", { x: 180, y: 172, width: 12, height: 28, fill: "#1d5bd0" }), s.el("rect", { x: 194, y: 166, width: 12, height: 34, fill: "#138a5a" }), s.el("rect", { x: 208, y: 176, width: 14, height: 24, fill: "#ee7a1a" }));
          add("rug", "a rug", s.el("ellipse", { cx: 300, cy: 478, rx: 140, ry: 28, fill: "#7b4fd6", opacity: .75 }));
          add("bed", "a bed", s.el("rect", { x: 150, y: 290, width: 18, height: 150, fill: "#6b4422" }), s.el("rect", { x: 160, y: 360, width: 230, height: 60, rx: 8, fill: "#1d5bd0" }), s.el("rect", { x: 172, y: 340, width: 60, height: 26, rx: 10, fill: "#fff" }), s.el("rect", { x: 380, y: 360, width: 12, height: 80, fill: "#6b4422" }));
          add("desk", "a desk", s.el("rect", { x: 410, y: 330, width: 130, height: 14, fill: "#8a5a2b" }), s.el("rect", { x: 416, y: 344, width: 10, height: 90, fill: "#8a5a2b" }), s.el("rect", { x: 524, y: 344, width: 10, height: 90, fill: "#8a5a2b" }));
          add("lamp", "a lamp", s.el("line", { x1: 515, y1: 330, x2: 515, y2: 280, stroke: "#5d6678", "stroke-width": 5 }), s.el("path", { d: "M495 284 L535 284 L525 256 L505 256 Z", fill: "#ffd94a", stroke: "#c79a12", "stroke-width": 3 }));
          add("chair", "a chair", s.el("rect", { x: 450, y: 300, width: 10, height: 140, fill: "#dc2626" }), s.el("rect", { x: 450, y: 380, width: 60, height: 10, fill: "#dc2626" }), s.el("rect", { x: 500, y: 390, width: 10, height: 50, fill: "#dc2626" }));
          const words = [["bed", "das Bett"], ["desk", "der Schreibtisch"], ["chair", "der Stuhl"], ["wardrobe", "der Kleiderschrank"], ["shelf", "das Regal"], ["lamp", "die Lampe"], ["window", "das Fenster"], ["door", "die Tür"], ["poster", "das Poster"], ["rug", "der Teppich"]];
          const btn = {};
          const tap = key => {
            s.sfx.pop(); s.speak(items[key].en, EN);
            const g = items[key].g; g.classList.remove("a-pop"); void g.getBoundingClientRect(); g.classList.add("a-pop");
            Object.values(btn).forEach(b => b.classList.remove("on")); btn[key] && btn[key].classList.add("on");
          };
          const bs = words.map(([k, de]) => { const b = s.h("button", { class: "u6-hear later", style: { padding: "4px 12px" }, onclick: () => tap(k) }); b.innerHTML = SPK; b.appendChild(s.h("span", null, k, s.h("small", null, de))); btn[k] = b; return b; });
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, bs);
          const tip = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Tipp"), s.h("p", { class: "small" }, "Lerne Möbel immer mit Artikel: ", s.h("b", null, "a bed, a desk"), " – und klebe Zettel mit den Wörtern an deine echten Möbel!"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "26px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, grid, tip)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const group = keys => async () => { for (const k of keys) { await s.show(btn[k], "left", 0); tap(k); await s.wait(500); } };
          s.step(group(["bed", "desk", "chair", "wardrobe"]));
          s.step(group(["shelf", "lamp", "window", "door"]));
          s.step(group(["poster", "rug"]));
          s.step(async () => { s.sfx.ding(); await s.show(tip, "up"); });
        },
      },
      /* 4 */
      {
        title: "Where's the cat? in, on, under …",
        say: "Wo ist die Katze? Die kleinen Wörter in, on, under und so weiter sagen, wo etwas ist. Tippe auf ein Wort und die Katze springt hin.",
        build(s) {
          const W = 560, H = 420;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 392, width: W, height: 28, fill: "#d9b48a" }));
          const back = s.el("g"), mid = s.el("g"), front = s.el("g");
          const table = s.el("g", null, s.el("rect", { x: 130, y: 232, width: 350, height: 16, rx: 4, fill: "#8a5a2b" }), s.el("rect", { x: 150, y: 248, width: 14, height: 146, fill: "#8a5a2b" }), s.el("rect", { x: 446, y: 248, width: 14, height: 146, fill: "#8a5a2b" }));
          const boxBack = s.el("g", null, s.el("path", { d: "M222 150 L200 122 L300 122 L322 150 Z", fill: "#b8834a" }));
          const boxFront = s.el("g", null, s.el("rect", { x: 222, y: 150, width: 100, height: 82, fill: "#d6a565", stroke: "#8a5a2b", "stroke-width": 3 }), s.el("path", { d: "M222 150 L206 176 M322 150 L338 176", stroke: "#8a5a2b", "stroke-width": 3 }));
          const ball = s.el("circle", { cx: 440, cy: 208, r: 24, fill: "#dc2626", stroke: "#8b1414", "stroke-width": 3 });
          const cat = s.el("g");
          cat.append(s.el("path", { d: "M-30 -14 Q-52 -30 -44 -54", stroke: "#ee7a1a", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }),
            s.el("ellipse", { cx: -4, cy: -18, rx: 30, ry: 18, fill: "#ee7a1a" }),
            s.el("circle", { cx: 22, cy: -40, r: 16, fill: "#ee7a1a" }),
            s.el("path", { d: "M10 -50 L12 -66 L22 -54 Z M24 -54 L34 -66 L35 -48 Z", fill: "#ee7a1a" }),
            s.el("circle", { cx: 18, cy: -42, r: 2.5, fill: "#1b2740" }), s.el("circle", { cx: 28, cy: -42, r: 2.5, fill: "#1b2740" }),
            s.el("rect", { x: -26, y: -4, width: 8, height: 6, fill: "#ee7a1a" }), s.el("rect", { x: 10, y: -4, width: 8, height: 6, fill: "#ee7a1a" }));
          svg.append(table, back, boxBack, mid, boxFront, ball, front);
          front.append(cat);
          const P = {
            "in": { x: 268, y: 170, k: 0.9, layer: mid, obj: "the box", de: "in" },
            "on": { x: 268, y: 154, k: 1, layer: front, obj: "the box", de: "auf" },
            "under": { x: 300, y: 394, k: 1.1, layer: front, obj: "the table", de: "unter" },
            "next to": { x: 172, y: 234, k: 0.9, layer: front, obj: "the box", de: "neben" },
            "behind": { x: 280, y: 150, k: 0.85, layer: back, obj: "the box", de: "hinter" },
            "in front of": { x: 270, y: 250, k: 1.15, layer: front, obj: "the box", de: "vor" },
            "between": { x: 372, y: 234, k: 0.75, layer: front, obj: "the box and the ball", de: "zwischen" },
          };
          let cur = { x: 300, y: 394, k: 1.1 };
          const place = (p) => { cat.setAttribute("transform", `translate(${p.x},${p.y}) scale(${p.k})`); };
          place(cur);
          const sent = s.h("p", { class: "big", style: { textAlign: "center", fontSize: "36px" } }, "Where's the cat?");
          const btns = {};
          const go = async key => {
            const p = P[key];
            Object.values(btns).forEach(b => b.classList.remove("on")); btns[key].classList.add("on");
            sent.innerHTML = ""; sent.append("The cat is ", s.h("span", { class: "hl" }, key), " " + p.obj + ".");
            s.speak(`The cat is ${key} ${p.obj}.`, EN);
            const a = { ...cur };
            // jump: up over the table, then switch layer and land
            s.sfx.boing();
            front.appendChild(cat);
            await s.tween({ dur: 650, ease: "inOut", update: v => { const lift = Math.sin(v * Math.PI) * 110; place({ x: a.x + (p.x - a.x) * v, y: a.y + (p.y - a.y) * v - lift, k: a.k + (p.k - a.k) * v }); } });
            p.layer.appendChild(cat); cur = { x: p.x, y: p.y, k: p.k }; place(cur); s.sfx.snap();
          };
          Object.entries(P).forEach(([k, p]) => { const b = s.h("button", { class: "u6-hear", onclick: () => { s.sfx.click(); go(k); } }); b.innerHTML = SPK; b.appendChild(s.h("span", null, k, s.h("small", null, p.de))); btns[k] = b; });
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, Object.values(btns));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "in front of"), " = vor (3 Wörter!)", s.h("br"), s.h("b", null, "between"), " A ", s.h("b", null, "and"), " B = zwischen A und B");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "30px", height: "100%", alignItems: "center" } }, s.h("div", { class: "stack" }, svg, sent), s.h("div", { class: "stack", style: { gap: "14px" } }, grid, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const tour = keys => async () => { for (const k of keys) { await go(k); await s.wait(1300); } };
          s.step(tour(["in", "on", "under"]));
          s.step(tour(["next to", "behind", "in front of"]));
          s.step(async () => { await go("between"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 */
      {
        title: "next to, between, opposite",
        say: "Auch in der Stadt brauchst du diese Wörter. Opposite heißt gegenüber, also auf der anderen Straßenseite.",
        build(s) {
          const W = 1100, H = 320;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 140, width: W, height: 64, fill: "#9aa3b3" }), s.el("line", { x1: 0, y1: 172, x2: W, y2: 172, stroke: "#fff", "stroke-width": 4, "stroke-dasharray": "26 18" }),
            s.el("text", { x: 1080, y: 166, "text-anchor": "end", "font-size": 19, "font-weight": 700, fill: "#fff", text: "High Street" }));
          const B = {
            bakery: bld(s, 50, 20, 210, 110, "#fff3d6", "bakery"),
            bank: bld(s, 300, 20, 210, 110, "#e4ecfb", "bank"),
            cafe: bld(s, 550, 20, 210, 110, "#fde6e3", "café"),
            bookshop: bld(s, 800, 20, 210, 110, "#efe6fb", "bookshop"),
            park: bld(s, 300, 214, 210, 96, "#cdebb5", "park", "#6aa84f"),
            school: bld(s, 800, 214, 210, 96, "#fff6c9", "school"),
          };
          Object.values(B).forEach(b => svg.append(b.g));
          const arrow = s.el("path", { d: "M405 214 L405 132", stroke: "#dc2626", "stroke-width": 6, "marker-end": "", fill: "none", class: "later" });
          const arrowHead = s.el("path", { d: "M393 146 L405 130 L417 146", stroke: "#dc2626", "stroke-width": 6, fill: "none", class: "later" });
          const arrow2 = s.el("path", { d: "M905 214 L905 132", stroke: "#dc2626", "stroke-width": 6, fill: "none", class: "later" });
          const arrow2Head = s.el("path", { d: "M893 146 L905 130 L917 146", stroke: "#dc2626", "stroke-width": 6, fill: "none", class: "later" });
          svg.append(arrow, arrowHead, arrow2, arrow2Head);
          const sets = [
            [["bank", "bakery"], "The bank is next to the bakery.", "Die Bank ist neben der Bäckerei."],
            [["cafe", "bank", "bookshop"], "The café is between the bank and the bookshop.", "Das Café ist zwischen Bank und Buchladen."],
            [["park", "bank"], "The park is opposite the bank.", "Der Park ist gegenüber der Bank."],
            [["school", "bookshop"], "The school is opposite the bookshop.", "Die Schule ist gegenüber dem Buchladen."],
          ];
          const btns = sets.map(([, en, de]) => { const b = hear(s, en, de); b.classList.add("later"); return b; });
          const light = keys => { Object.values(B).forEach(b => glow(b.r, false)); keys.forEach((k, i) => glow(B[k].r, true, i === 0 ? "#dc2626" : "#ffd94a")); };
          sets.forEach(([keys, en], i) => btns[i].addEventListener("click", () => light(keys)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, s.h("b", null, "next to"), " = neben · ", s.h("b", null, "between"), " = zwischen · ", s.h("b", null, "opposite"), " = gegenüber (auf der anderen Straßenseite)");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } }, btns), merk));
          s.show(svg, "fade"); s.sfx.whoosh();
          sets.forEach(([keys, en], i) => s.step(async () => {
            light(keys); s.sfx.pop();
            if (i === 2) { s.show(arrow, "draw"); s.show(arrowHead, "fade", 600); }
            if (i === 3) { s.show(arrow2, "draw"); s.show(arrow2Head, "fade", 600); }
            await s.show(btns[i], "up"); s.speak(en, EN);
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 */
      {
        title: "My room: there's a bed …",
        say: "Lukas aus Berlin beschreibt sein Zimmer. Er benutzt there is, there are und die Ortswörter.",
        build(s) {
          const W = 560, H = 470;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: 350, fill: "#e8f3fb" }), s.el("rect", { x: 0, y: 350, width: W, height: 120, fill: "#c99a62" }),
            s.el("rect", { x: 2, y: 2, width: W - 4, height: H - 4, rx: 10, fill: "none", stroke: "#5d6678", "stroke-width": 4 }),
            s.el("rect", { x: 200, y: 40, width: 160, height: 120, fill: "#bfe0f5", stroke: "#fff", "stroke-width": 8 }), s.el("line", { x1: 280, y1: 40, x2: 280, y2: 160, stroke: "#fff", "stroke-width": 6 }));
          const bed = s.el("g", { class: "later" }, s.el("rect", { x: 170, y: 250, width: 18, height: 130, fill: "#6b4422" }), s.el("rect", { x: 180, y: 300, width: 210, height: 56, rx: 8, fill: "#dc2626" }), s.el("rect", { x: 192, y: 282, width: 60, height: 24, rx: 10, fill: "#fff" }), s.el("rect", { x: 380, y: 300, width: 12, height: 80, fill: "#6b4422" }));
          const posters = s.el("g", { class: "later" }, s.el("rect", { x: 30, y: 50, width: 70, height: 96, fill: "#fff", stroke: "#2f7d32", "stroke-width": 4 }), s.el("circle", { cx: 65, cy: 92, r: 20, fill: "#ffd94a" }), s.el("rect", { x: 112, y: 70, width: 64, height: 84, fill: "#fff", stroke: "#7b4fd6", "stroke-width": 4 }), s.el("path", { d: "M122 140 L144 90 L166 140 Z", fill: "#7b4fd6" }));
          const desk = s.el("g", { class: "later" }, s.el("rect", { x: 412, y: 280, width: 130, height: 14, fill: "#8a5a2b" }), s.el("rect", { x: 418, y: 294, width: 10, height: 92, fill: "#8a5a2b" }), s.el("rect", { x: 526, y: 294, width: 10, height: 92, fill: "#8a5a2b" }),
            s.el("rect", { x: 430, y: 254, width: 40, height: 26, fill: "#1d5bd0" }), s.el("rect", { x: 474, y: 260, width: 40, height: 20, fill: "#138a5a" }));
          const cat = s.el("g", { class: "later" }, s.el("ellipse", { cx: 477, cy: 368, rx: 26, ry: 15, fill: "#5d6678" }), s.el("circle", { cx: 498, cy: 350, r: 13, fill: "#5d6678" }), s.el("path", { d: "M488 342 L490 328 L498 338 Z M500 338 L508 328 L510 344 Z", fill: "#5d6678" }));
          svg.append(posters, bed, desk, cat);
          const P = (t) => s.h("span", { class: "u6-prep" }, t);
          const lines = [
            [bed, "There's a bed under the window.", ["There's a bed ", P("under"), " the window."]],
            [posters, "There are two posters on the wall.", ["There are two posters ", P("on"), " the wall."]],
            [desk, "There's a desk next to the bed.", ["There's a desk ", P("next to"), " the bed."]],
            [cat, "Our cat Mo is under the desk.", ["Our cat Mo is ", P("under"), " the desk."]],
          ];
          const btns = lines.map(([, en, parts]) => { const b = s.h("button", { class: "u6-hear later", onclick: () => { s.sfx.click(); s.speak(en, EN); } }); b.innerHTML = SPK; b.appendChild(s.h("span", null, ...parts)); return b; });
          const merk = s.h("div", { class: "merk later" }, "Zimmer beschreiben:", s.h("br"), s.h("b", null, "There's / There are"), " + Sache + ", s.h("b", { class: "blue" }, "Ortswort"), " + Ort.");
          const head = s.h("div", { class: "row", style: { flexWrap: "nowrap" } }, avatar(s, "lukas", 70), s.h("p", { class: "h2" }, "Lukas's room in Berlin"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "28px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, head, btns, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          lines.forEach(([g, en], i) => s.step(async () => { s.sfx.pop(); s.show(g, "pop"); await s.show(btns[i], "left"); s.speak(en, EN); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 */
      {
        title: "a, an, the – oder gar nichts?",
        say: "Wann sagt man a, an oder the? Und manchmal braucht man im Englischen gar keinen Artikel.",
        build(s) {
          const mkCard = (lab, rule, items) => {
            const bs = items.map(([en, de]) => { const b = hear(s, en, de); b.classList.add("later"); return b; });
            const c = s.h("div", { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("span", { class: "exlabel" }, lab), s.h("p", { class: "t", style: { fontWeight: 700 } }, rule), bs);
            c.bs = bs; return c;
          };
          const c1 = mkCard("a / an = ein, eine", "an vor Vokal-Laut (a, e, i, o, u)", [["a bed, a desk", "ein Bett, ein Schreibtisch"], ["an armchair", "ein Sessel"], ["an old lamp", "eine alte Lampe"]]);
          const c2 = mkCard("the = der, die, das", "wenn klar ist, welches Ding gemeint ist", [["There's a cat in my room. The cat is grey.", "Erst a, dann the."], ["Close the door, please.", "die Tür hier"], ["Turn left at the station.", "der Bahnhof dort"]]);
          const c3 = mkCard("kein Artikel", "bei Mehrzahl allgemein, Namen, Sport", [["I like cats.", "Ich mag Katzen."], ["Lukas lives in Berlin.", "Lukas wohnt in Berlin."], ["I play football.", "Ich spiele Fußball."]]);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, "Achtung: Es zählt der ", s.h("b", null, "Laut"), ", nicht der Buchstabe! ", s.h("b", null, "an hour"), " (h ist stumm), aber ", s.h("b", null, "a uniform"), " (spricht man „ju“).");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3), merk));
          s.sfx.whoosh();
          [c1, c2, c3].forEach(c => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); for (const b of c.bs) { s.sfx.tick(); await s.show(b, "left", 0); } }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.speak("an hour. a uniform.", EN); });
        },
      },
      /* 8 */
      {
        title: "Im Alltag: Brief an einen Pen pal",
        say: "Lukas schreibt seiner Brieffreundin Ruby in London. Eine Brieffreundin heißt auf Englisch pen pal. Er beschreibt seine Wohnung.",
        build(s) {
          const W = (t) => s.h("span", { class: "u6-word" }, t), Pp = (t) => s.h("span", { class: "u6-prep" }, t);
          const paras = [
            ["Dear Ruby,", s.h("p", { class: "hand" }, "Dear Ruby,")],
            ["Thanks for your letter! Now I can tell you about my home. I live in a flat in Berlin. It's on the third floor.", s.h("p", null, "Thanks for your letter! Now I can tell you about my home. I live in ", W("a flat"), " in Berlin. It's ", Pp("on"), " the ", W("third floor"), ".")],
            ["There's a kitchen, a bathroom, a living room and two bedrooms. My room is small, but I love it. There's a bed under the window and there are two posters on the wall. Our cat Mo often sleeps on my bed!", s.h("p", null, W("There's"), " a kitchen, a bathroom, a living room and two bedrooms. My room is small, but I love it. ", W("There's"), " a bed ", Pp("under"), " the window and ", W("there are"), " two posters ", Pp("on"), " the wall. Our cat Mo often sleeps ", Pp("on"), " my bed!")],
            ["Write soon! Love, Lukas", s.h("p", { class: "hand" }, "Write soon!", s.h("br"), "Love, Lukas")],
          ];
          const ps = paras.map(([, el]) => { el.classList.add("later"); return el; });
          const letter = s.h("div", { class: "u6-letter" }, ps);
          const reads = paras.map(([txt], i) => { const b = s.h("button", { class: "btn", style: { minHeight: "56px" }, onclick: () => { s.sfx.click(); s.speak(txt, EN); } }); b.innerHTML = SPK; b.appendChild(s.h("span", null, "Teil " + (i + 1))); b.classList.add("later"); return b; });
          const tips = s.h("div", { class: "card soft later" }, s.h("span", { class: "exlabel" }, "So schreibst du einen Brief"), s.h("p", { class: "small" }, s.h("b", null, "Dear …,"), " = Liebe/Lieber …", s.h("br"), s.h("b", null, "Write soon!"), " = Schreib bald!", s.h("br"), s.h("b", null, "Love, / Best wishes,"), " = Liebe Grüße"));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "pen pal"), s.h("p", { class: "small" }, "= Brieffreund/in. Vielleicht findest du auch einmal einen pen pal in England – dann kannst du so über dein Zuhause schreiben."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "640px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, letter,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, reads), tips, life)));
          s.show(letter, "up"); s.sfx.whoosh();
          s.step(async () => { s.sfx.scribble(); await s.show(ps[0], "fade"); s.sfx.scribble(); await s.show(ps[1], "fade"); s.show(reads.slice(0, 2), "pop"); });
          s.step(async () => { s.sfx.scribble(); await s.show(ps[2], "fade"); s.show(reads[2], "pop"); });
          s.step(async () => { s.sfx.scribble(); await s.show(ps[3], "fade"); s.show(reads[3], "pop"); s.sfx.ding(); });
          s.step(async () => { s.sfx.pop(); await s.show(tips, "left"); s.sfx.pop(); await s.show(life, "left"); });
        },
      },
      /* 9 */
      {
        title: "In town: places",
        say: "Das sind wichtige Orte in der Stadt. Tippe auf eine Karte und hör dir das Wort an.",
        build(s) {
          const items = [["🚉", "station", "Bahnhof"], ["📚", "library", "Bücherei"], ["📮", "post office", "Post"], ["🛒", "supermarket", "Supermarkt"],
            ["🌳", "park", "Park"], ["🏦", "bank", "Bank"], ["🎬", "cinema", "Kino"], ["🏥", "hospital", "Krankenhaus"],
            ["☕", "café", "Café"], ["🏊", "swimming pool", "Schwimmbad"], ["💊", "chemist's", "Apotheke, Drogerie"], ["🚏", "bus stop", "Bushaltestelle"]];
          const tiles = items.map(([e, en, de]) => s.h("button", { class: "u6-tile", onclick: () => { s.sfx.pop(); s.speak("the " + en, EN); } }, s.h("span", { class: "em" }, e), s.h("span", { class: "en" }, en), s.h("span", { class: "de" }, de)));
          const rows = [tiles.slice(0, 4), tiles.slice(4, 8), tiles.slice(8)];
          rows[1].concat(rows[2]).forEach(t => t.classList.add("later"));
          const q = hear(s, "Excuse me, where's the station?", "Entschuldigung, wo ist der Bahnhof?");
          s.add(s.h("div", { class: "stack", style: { height: "100%" } }, s.h("div", { class: "row", style: { justifyContent: "space-between" } }, q, s.h("p", { class: "hand", style: { margin: 0, color: "var(--red)" } }, "Tippe auf eine Karte!")),
            s.h("div", { class: "cols4", style: { gap: "14px", flex: "1", gridTemplateRows: "repeat(3, 1fr)" } }, tiles)));
          s.show(q, "down"); s.show(rows[0], "up", 150); s.sfx.whoosh();
          s.step(async () => { rows[1].forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i + 4), i * 120)); await s.show(rows[1], "up"); });
          s.step(async () => { rows[2].forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i + 8), i * 120)); await s.show(rows[2], "up"); s.say("Chemist's ist die Apotheke oder Drogerie."); });
        },
      },
      /* 10 */
      {
        title: "Asking the way",
        say: "So fragst du nach dem Weg, und so erklärst du ihn. Tippe auf ein Bild, dann siehst du die Bewegung noch einmal.",
        build(s) {
          const mk = (draw, en, de) => {
            const v = s.svg(170, 120);
            const anim = draw(v);
            const b = hear(s, en, de);
            const t = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", padding: "10px 12px", cursor: "pointer" } }, v, b);
            v.addEventListener("click", () => { s.sfx.whoosh(); anim(); s.speak(en, EN); });
            t.anim = anim; t.en = en; return t;
          };
          const road = (v, d) => v.append(s.el("path", { d, stroke: "#c8d3de", "stroke-width": 30, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
          const arr = (v, d, head) => { const p = s.el("path", { d, stroke: "#2f7d32", "stroke-width": 8, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }); const h = s.el("path", { d: head, stroke: "#2f7d32", "stroke-width": 8, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }); v.append(p, h); return () => { h.classList.add("later"); s.show(p, "draw").then(() => s.show(h, "pop")); }; };
          const house = (v, x, col) => v.append(s.el("rect", { x, y: 30, width: 34, height: 40, fill: col, stroke: "#5d6678", "stroke-width": 2 }), s.el("path", { d: `M${x - 4} 30 L${x + 17} 12 L${x + 38} 30 Z`, fill: "#5d6678" }));
          const tiles = [
            mk(v => { road(v, "M85 115 L85 5"); return arr(v, "M85 108 L85 22", "M70 36 L85 20 L100 36"); }, "Go straight on.", "Geh geradeaus."),
            mk(v => { road(v, "M100 115 L100 60 L5 60"); return arr(v, "M100 108 L100 60 L28 60", "M42 45 L26 60 L42 75"); }, "Turn left.", "Bieg links ab."),
            mk(v => { road(v, "M70 115 L70 60 L165 60"); return arr(v, "M70 108 L70 60 L142 60", "M128 45 L144 60 L128 75"); }, "Turn right.", "Bieg rechts ab."),
            mk(v => { road(v, "M100 115 L100 5"); house(v, 30, "#fde6e3"); return arr(v, "M100 108 L100 50 L74 50", "M84 38 L72 50 L84 62"); }, "It's on your left.", "Es ist auf der linken Seite."),
            mk(v => { road(v, "M70 115 L70 5"); house(v, 110, "#e4ecfb"); return arr(v, "M70 108 L70 50 L98 50", "M88 38 L100 50 L88 62"); }, "It's on your right.", "Es ist auf der rechten Seite."),
            mk(v => {
              road(v, "M85 115 L85 5"); road(v, "M5 60 L165 60");
              const lamp = [s.el("circle", { cx: 140, cy: 22, r: 7, fill: "#5d6678" }), s.el("circle", { cx: 140, cy: 40, r: 7, fill: "#5d6678" }), s.el("circle", { cx: 140, cy: 58, r: 7, fill: "#5d6678" })];
              v.append(s.el("rect", { x: 128, y: 10, width: 24, height: 60, rx: 6, fill: "#1b2740" }), ...lamp, s.el("rect", { x: 137, y: 70, width: 6, height: 40, fill: "#1b2740" }));
              const a = arr(v, "M85 108 L85 60", "M70 74 L85 58 L100 74");
              return () => { a(); [["#dc2626", 0], ["#ffd94a", 1], ["#2f7d32", 2]].forEach(([c, i], k) => setTimeout(() => { if (!s.alive) return; lamp.forEach(l => l.setAttribute("fill", "#5d6678")); lamp[i].setAttribute("fill", c); }, k * 350)); };
            }, "Stop at the traffic lights.", "Halt an der Ampel."),
          ];
          const q1 = hear(s, "Excuse me, how do I get to the library?", "Wie komme ich zur Bücherei?"), q2 = hear(s, "Excuse me, where's the post office?", "Wo ist die Post?");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "12px 20px" } }, "Höflich fragen: ", s.h("b", null, "Excuse me, …"), " – Danke sagen: ", s.h("b", null, "Thank you!"), " – Antwort: ", s.h("b", null, "You're welcome."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } }, s.h("div", { class: "row", style: { gap: "12px" } }, q1, q2), s.h("div", { class: "cols3", style: { gap: "14px" } }, tiles), merk));
          s.show([q1, q2], "down"); s.sfx.whoosh();
          s.step(async () => { for (const t of tiles.slice(0, 3)) { s.sfx.pop(); await s.show(t, "up", 0); t.anim(); s.speak(t.en, EN); await s.wait(900); } });
          s.step(async () => { for (const t of tiles.slice(3)) { s.sfx.pop(); await s.show(t, "up", 0); t.anim(); s.speak(t.en, EN); await s.wait(900); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 */
      {
        title: "Follow the directions!",
        say: "Jetzt läufst du mit! Die rote Figur startet am Bahnhof. Wähle ein Ziel und hör dir den Weg an.",
        build(s) {
          const W = 600, H = 600;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#eef3e6" }),
            s.el("rect", { x: 280, y: 0, width: 60, height: H, fill: "#c8ccd4" }),
            s.el("rect", { x: 0, y: 160, width: W, height: 50, fill: "#c8ccd4" }),
            s.el("rect", { x: 0, y: 380, width: W, height: 50, fill: "#c8ccd4" }));
          // street names
          svg.append(s.el("text", { x: 590, y: 192, "text-anchor": "end", "font-size": 19, "font-weight": 700, fill: "#5d6678", text: "Park Road" }),
            s.el("text", { x: 12, y: 412, "font-size": 19, "font-weight": 700, fill: "#5d6678", text: "Mill Lane" }),
            s.el("text", { x: 0, y: 0, transform: "translate(318,150) rotate(-90)", "font-size": 19, "font-weight": 700, fill: "#5d6678", text: "High Street" }));
          const B = {
            postoffice: bld(s, 130, 70, 140, 80, "#fde6e3", "post office"),
            bank: bld(s, 14, 70, 106, 80, "#e4ecfb", "bank"),
            school: bld(s, 360, 30, 220, 120, "#fff6c9", "school"),
            supermarket: bld(s, 136, 225, 134, 80, "#fff3d6", "supermarket"),
            park: bld(s, 352, 222, 234, 70, "#cdebb5", "park", "#6aa84f"),
            library: bld(s, 400, 300, 140, 70, "#efe6fb", "library"),
            station: bld(s, 20, 450, 220, 110, "#e3f2e4", "station"),
            cafe: bld(s, 360, 450, 200, 110, "#fde6e3", "café"),
          };
          Object.values(B).forEach(b => svg.append(b.g));
          // traffic lights at High Street / Mill Lane
          svg.append(s.el("rect", { x: 344, y: 434, width: 14, height: 36, rx: 4, fill: "#1b2740" }), s.el("circle", { cx: 351, cy: 443, r: 4, fill: "#dc2626" }), s.el("circle", { cx: 351, cy: 461, r: 4, fill: "#2f7d32" }));
          const youAre = s.el("text", { x: 250, y: 590, "text-anchor": "end", "font-size": 19, "font-weight": 800, fill: "#dc2626", text: "You are here →" });
          svg.append(youAre);
          const trail = s.el("polyline", { points: "", fill: "none", stroke: "#dc2626", "stroke-width": 5, "stroke-dasharray": "10 8", opacity: .7 });
          svg.append(trail);
          const me = walker(s); svg.append(me); const START = [310, 580]; me.at(...START);
          const routes = {
            library: { name: "the library", pts: [[310, 405], [470, 405]], hl: "library", lines: [["Go straight on.", "Geh geradeaus."], ["Turn right at the traffic lights.", "Bieg an der Ampel rechts ab."], ["The library is on your left.", "Die Bücherei ist links."]] },
            postoffice: { name: "the post office", pts: [[310, 185], [200, 185]], hl: "postoffice", lines: [["Go straight on.", "Geh geradeaus."], ["Take the second street on the left.", "Nimm die zweite Straße links."], ["The post office is on your right.", "Die Post ist rechts."]] },
            supermarket: { name: "the supermarket", pts: [[310, 265]], hl: "supermarket", lines: [["Go straight on, past the traffic lights.", "Geh geradeaus, an der Ampel vorbei."], ["The supermarket is on your left.", "Der Supermarkt ist links."], ["It's opposite the park.", "Er ist gegenüber dem Park."]] },
          };
          const list = s.h("div", { class: "stack", style: { gap: "10px", minHeight: "250px" } });
          const head = s.h("p", { class: "h2" }, "Where do you want to go?");
          let busy = false;
          const run = async key => {
            if (busy && !s.fast) return; busy = true;
            const r = routes[key];
            Object.values(B).forEach(b => glow(b.r, false)); glow(B[r.hl].r, true, "#dc2626");
            Object.entries(dbtn).forEach(([k, b]) => b.classList.toggle("solid", k === key));
            head.textContent = "How do I get to " + r.name + "?";
            s.speak("Excuse me, how do I get to " + r.name + "?", EN);
            list.innerHTML = "";
            const ls = r.lines.map(([en, de]) => { const b = hear(s, en, de); b.classList.add("later"); list.append(b); return b; });
            me.at(...START); trail.setAttribute("points", START.join(","));
            await s.wait(1600);
            const all = [START, ...r.pts];
            const segLines = key === "supermarket" ? [[0], [1, 2]] : [[0], [1], [2]];
            for (let i = 0; i < r.pts.length; i++) {
              for (const li of segLines[i] || []) { s.sfx.pop(); s.show(ls[li], "left"); s.speak(r.lines[li][0], EN); }
              const startLen = i;
              await walk(s, me, [r.pts[i]]);
              trail.setAttribute("points", all.slice(0, startLen + 2).map(p => p.join(",")).join(" "));
            }
            for (const extra of segLines.slice(r.pts.length)) for (const li of extra) { s.sfx.pop(); await s.show(ls[li], "left"); s.speak(r.lines[li][0], EN); }
            s.sfx.success(); busy = false;
          };
          const dbtn = {};
          [["library", "📚 library"], ["postoffice", "📮 post office"], ["supermarket", "🛒 supermarket"]].forEach(([k, l]) => { dbtn[k] = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); run(k); } }, l); });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "28px", height: "100%", alignItems: "start" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, Object.values(dbtn)), head, list)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(() => run("library"));
          s.step(() => run("postoffice"));
          s.step(() => run("supermarket"));
        },
      },
      /* 12 */
      {
        title: "Im Alltag: at King's Cross",
        say: "Am Bahnhof King's Cross in London fragt eine Touristin nach dem Weg zur British Library. Ruby hilft ihr.",
        build(s) {
          const W = 520, H = 330;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#eef3e6" }),
            s.el("rect", { x: 0, y: 222, width: W, height: 56, fill: "#c8ccd4" }),
            s.el("text", { x: 260, y: 300, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: "#5d6678", text: "Euston Road" }));
          const kx = bld(s, 380, 60, 130, 150, "#f2d9c4", "King's Cross", "#8a5a2b");
          const sp = bld(s, 200, 30, 168, 180, "#f5c6b8", "St Pancras", "#8a3a2a");
          const bl = bld(s, 14, 90, 174, 120, "#fff3d6", "British Library", "#a8743a");
          [kx, sp, bl].forEach(b => svg.append(b.g));
          sp.t.setAttribute("font-size", 19); kx.t.setAttribute("font-size", 19); bl.t.setAttribute("font-size", 19);
          const note = s.el("text", { x: 260, y: 322, "text-anchor": "middle", "font-size": 19, fill: "#5d6678", text: "vereinfachte Karte" });
          svg.append(note);
          const trail = s.el("polyline", { points: "445,205", fill: "none", stroke: "#dc2626", "stroke-width": 5, "stroke-dasharray": "10 8", opacity: .7 });
          svg.append(trail);
          const me = walker(s, "#7b4fd6"); svg.append(me); me.at(445, 205);
          const bub = (cls, who, txt) => { const b = s.h("button", { class: "u6-bub later " + cls, onclick: () => { s.sfx.click(); s.speak(txt, EN); } }); b.innerHTML = SPK; b.appendChild(s.h("b", null, who)); b.appendChild(s.h("span", null, txt)); return b; };
          const d = [
            bub("q", "Tourist:", "Excuse me, how do I get to the British Library?"),
            bub("a", "Ruby:", "Go out of the station and turn right."),
            bub("a", "Ruby:", "Go straight on along Euston Road. The British Library is on your right, next to St Pancras station."),
            bub("q", "Tourist:", "Thank you very much!"),
            bub("a", "Ruby:", "You're welcome!"),
          ];
          const facts = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Gut zu wissen"), s.h("p", { class: "small" }, "Im Bahnhof King's Cross gibt es ein Fotomotiv: ", s.h("b", null, "Platform 9¾"), " aus Harry Potter, mit einem Gepäckwagen, der in der Wand verschwindet. Die British Library ist die Nationalbibliothek von Großbritannien."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "26px", height: "100%", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "14px" } }, svg, facts), s.h("div", { class: "stack", style: { gap: "10px" } }, d)));
          s.show(svg, "fade"); s.sfx.whoosh();
          const say = i => s.speak(d[i].textContent.replace(/^(Tourist:|Ruby:)/, ""), EN);
          s.step(async () => { s.sfx.pop(); await s.show(d[0], "left"); say(0); });
          s.step(async () => { s.sfx.pop(); await s.show(d[1], "right"); say(1); await walk(s, me, [[445, 250], [420, 250]]); trail.setAttribute("points", "445,205 445,250 420,250"); });
          s.step(async () => { s.sfx.pop(); await s.show(d[2], "right"); say(2); await walk(s, me, [[100, 250]]); trail.setAttribute("points", "445,205 445,250 100,250"); glow(bl.r, true, "#dc2626"); s.sfx.success(); });
          s.step(async () => { s.sfx.pop(); await s.show(d[3], "left"); say(3); await s.wait(1200); s.sfx.pop(); await s.show(d[4], "right"); say(4); });
          s.step(async () => { s.sfx.ding(); await s.show(facts, "up"); });
        },
      },
      /* 13 */
      {
        title: "Transport: by bus, by Tube",
        say: "In London fährt man mit den roten Doppeldeckerbussen oder mit der Tube, der U-Bahn. Die Tube ist die älteste U-Bahn der Welt.",
        build(s) {
          const W = 1100, H = 280;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: 110, fill: "#e8f3fb" }), s.el("rect", { x: 0, y: 110, width: W, height: 16, fill: "#9aa3b3" }),
            s.el("rect", { x: 0, y: 126, width: W, height: H - 126, fill: "#c99a62" }),
            s.el("rect", { x: 0, y: 176, width: W, height: 78, rx: 39, fill: "#5d4a3a" }));
          const bus = s.el("g", { class: "later" });
          bus.append(s.el("rect", { x: 0, y: 0, width: 190, height: 100, rx: 14, fill: "#dc2626" }),
            ...[0, 1, 2, 3, 4].map(i => s.el("rect", { x: 14 + i * 34, y: 10, width: 26, height: 26, rx: 4, fill: "#bfe0f5" })),
            ...[0, 1, 2, 3, 4].map(i => s.el("rect", { x: 14 + i * 34, y: 52, width: 26, height: 22, rx: 4, fill: "#bfe0f5" })),
            s.el("rect", { x: 0, y: 44, width: 190, height: 4, fill: "#8b1414" }),
            s.el("circle", { cx: 40, cy: 102, r: 13, fill: "#1b2740" }), s.el("circle", { cx: 150, cy: 102, r: 13, fill: "#1b2740" }));
          const train = s.el("g", { class: "later" });
          train.append(...[0, 1, 2].map(i => s.el("rect", { x: i * 132, y: 0, width: 126, height: 50, rx: 18, fill: "#e8e8ee", stroke: "#1d5bd0", "stroke-width": 4 })),
            ...[0, 1, 2].flatMap(i => [0, 1, 2].map(j => s.el("rect", { x: i * 132 + 16 + j * 36, y: 10, width: 26, height: 18, rx: 4, fill: "#5d6678" }))),
            s.el("rect", { x: 0, y: 34, width: 390, height: 6, fill: "#dc2626" }));
          svg.append(bus, train);
          let bx = -220, tx = W + 20, busOn = false, trainOn = false;
          bus.setAttribute("transform", `translate(${s.fast ? 450 : bx},8)`);
          train.setAttribute("transform", `translate(${s.fast ? 360 : tx},190)`);
          s.loop((t, dt) => {
            if (s.fast) return false;
            if (busOn) { bx += dt * 150; if (bx > W + 20) bx = -220; bus.setAttribute("transform", `translate(${bx},8)`); }
            if (trainOn) { tx -= dt * 260; if (tx < -420) tx = W + 20; train.setAttribute("transform", `translate(${tx},190)`); }
          });
          const tubeFact = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "The Tube – seit 1863"), s.h("p", { class: "small" }, "Die älteste U-Bahn der Welt! Die erste Strecke fuhr am 10. Januar 1863 von Paddington nach Farringdon. Heute: 11 Linien, 272 Stationen."));
          const yearT = s.h("span", { class: "huge mono", style: { color: "var(--unit)", fontSize: "60px" } }, "1863");
          const berlin = s.h("div", { class: "card soft later" }, s.h("span", { class: "exlabel" }, "Und in Berlin?"), s.h("p", { class: "small" }, "Die Berliner U-Bahn fährt seit 1902 – 39 Jahre nach London. Sie hat 9 Linien (U1 bis U9) und 175 Bahnhöfe."));
          const ways = [["by bus", "mit dem Bus"], ["by Tube", "mit der U-Bahn"], ["by train", "mit dem Zug"], ["by bike", "mit dem Rad"], ["on foot", "zu Fuß"]].map(([e, d]) => { const b = hear(s, "I go to school " + e + ".", null); b.querySelector("span").innerHTML = ""; b.querySelector("span").append(e, s.h("small", null, d)); b.classList.add("later"); return b; });
          const waysBox = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, ways);
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", alignItems: "start" } }, waysBox, s.h("div", { class: "stack", style: { gap: "12px" } }, tubeFact, berlin))));
          s.show(svg, "fade");
          s.step(async () => { s.show(bus, "fade"); busOn = true; s.sfx.tone(330, 0.25, "square", 0.08); s.sfx.tone(392, 0.3, "square", 0.08, 0.28); s.speak("a red double-decker bus", EN); await s.wait(600); s.sfx.pop(); await s.show(ways[0], "left"); });
          s.step(async () => { s.show(train, "fade"); trainOn = true; s.sfx.whoosh(); await s.wait(400); s.sfx.pop(); await s.show(ways[1], "left"); s.sfx.ding(); await s.show(tubeFact, "up"); s.speak("the Tube, the London Underground", EN); });
          s.step(async () => { for (const w of ways.slice(2)) { s.sfx.pop(); await s.show(w, "left", 0); } s.speak("by train, by bike, on foot", EN); });
          s.step(async () => { s.sfx.ding(); await s.show(berlin, "up"); });
          void yearT;
        },
      },
      /* 14 */
      {
        title: "London landmarks",
        say: "Das sind berühmte Sehenswürdigkeiten in London. Tippe auf die Bilder: Big Ben läutet, und die Tower Bridge öffnet sich!",
        build(s) {
          const card = (lab, pic, en, lines) => {
            const b = hear(s, en);
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 14px" } }, s.h("div", { class: "center", style: { cursor: "pointer" } }, pic), b, s.h("p", { class: "small" }, ...lines));
            c.en = en; return c;
          };
          // Big Ben / Elizabeth Tower
          const v1 = s.svg(220, 200);
          v1.append(s.el("rect", { x: 85, y: 50, width: 50, height: 145, fill: "#d9b46a", stroke: "#8a6a2a", "stroke-width": 3 }), s.el("path", { d: "M85 50 L110 8 L135 50 Z", fill: "#3f4a5a" }),
            s.el("circle", { cx: 110, cy: 80, r: 18, fill: "#fff", stroke: "#8a6a2a", "stroke-width": 3 }));
          const hand = s.el("line", { x1: 110, y1: 80, x2: 110, y2: 67, stroke: "#1b2740", "stroke-width": 3, "stroke-linecap": "round" });
          v1.append(hand, s.el("line", { x1: 110, y1: 80, x2: 119, y2: 80, stroke: "#1b2740", "stroke-width": 3, "stroke-linecap": "round" }));
          v1.addEventListener("click", () => { [[4, 0], [0, .45], [2, .9], [-5, 1.35]].forEach(([n, w]) => s.sfx.tone(392 * Math.pow(2, n / 12), 1.0, "sine", 0.22, w)); setTimeout(() => s.alive && s.speak("Big Ben is the bell.", EN), 2100); s.tween({ from: 0, to: 360, dur: 1500, update: a => hand.setAttribute("transform", `rotate(${a} 110 80)`) }); });
          // Tower Bridge
          const v2 = s.svg(220, 200);
          v2.append(s.el("rect", { x: 0, y: 150, width: 220, height: 50, fill: "#6aa7d8" }),
            s.el("rect", { x: 40, y: 40, width: 30, height: 120, fill: "#c9b48a", stroke: "#6b5a3a", "stroke-width": 2 }), s.el("rect", { x: 150, y: 40, width: 30, height: 120, fill: "#c9b48a", stroke: "#6b5a3a", "stroke-width": 2 }),
            s.el("path", { d: "M40 40 L55 18 L70 40 Z M150 40 L165 18 L180 40 Z", fill: "#3f4a5a" }), s.el("rect", { x: 70, y: 52, width: 80, height: 8, fill: "#1d5bd0" }),
            s.el("rect", { x: 0, y: 128, width: 40, height: 8, fill: "#6b5a3a" }), s.el("rect", { x: 180, y: 128, width: 40, height: 8, fill: "#6b5a3a" }));
          const lb = s.el("rect", { x: 70, y: 128, width: 40, height: 8, fill: "#6b5a3a" }), rb = s.el("rect", { x: 110, y: 128, width: 40, height: 8, fill: "#6b5a3a" });
          const ship = s.el("path", { d: "M-40 160 L0 160 L-6 172 L-34 172 Z M-22 160 L-22 112 L-6 150 Z", fill: "#fff", stroke: "#1b2740", "stroke-width": 2 });
          v2.append(lb, rb, ship);
          v2.addEventListener("click", async () => {
            s.sfx.boing(); s.speak("Tower Bridge opens for ships.", EN);
            await s.tween({ dur: 900, update: v => { lb.setAttribute("transform", `rotate(${-70 * v} 70 132)`); rb.setAttribute("transform", `rotate(${70 * v} 150 132)`); } });
            await s.tween({ dur: 1800, ease: "linear", update: v => ship.setAttribute("transform", `translate(${v * 280},0)`) });
            await s.tween({ dur: 900, update: v => { lb.setAttribute("transform", `rotate(${-70 * (1 - v)} 70 132)`); rb.setAttribute("transform", `rotate(${70 * (1 - v)} 150 132)`); } });
            s.sfx.snap();
          });
          // London Eye
          const v3 = s.svg(220, 200);
          const wheel = s.el("g");
          wheel.append(s.el("circle", { cx: 0, cy: 0, r: 78, fill: "none", stroke: "#9aa3b3", "stroke-width": 4 }), ...Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return s.el("line", { x1: 0, y1: 0, x2: 78 * Math.cos(a), y2: 78 * Math.sin(a), stroke: "#c8ccd4", "stroke-width": 2 }); }),
            ...Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return s.el("circle", { cx: 78 * Math.cos(a), cy: 78 * Math.sin(a), r: 7, fill: "#1d5bd0" }); }));
          v3.append(s.el("path", { d: "M110 96 L70 196 M110 96 L150 196", stroke: "#5d6678", "stroke-width": 5 }), wheel, s.el("circle", { cx: 110, cy: 96, r: 7, fill: "#5d6678" }));
          let rot = 0, fastSpin = 0;
          wheel.setAttribute("transform", "translate(110,96)");
          s.loop((t, dt) => { if (s.fast) return false; rot += dt * (6 + fastSpin); fastSpin = Math.max(0, fastSpin - dt * 40); wheel.setAttribute("transform", `translate(110,96) rotate(${rot})`); });
          v3.addEventListener("click", () => { fastSpin = 120; s.sfx.whoosh(); s.speak("the London Eye", EN); });
          // Buckingham Palace
          const v4 = s.svg(220, 200);
          v4.append(s.el("rect", { x: 10, y: 80, width: 200, height: 100, fill: "#e8e2d4", stroke: "#8a8070", "stroke-width": 3 }), s.el("path", { d: "M80 80 L110 56 L140 80 Z", fill: "#e8e2d4", stroke: "#8a8070", "stroke-width": 3 }),
            ...Array.from({ length: 8 }, (_, i) => s.el("rect", { x: 22 + i * 24, y: 98, width: 12, height: 22, fill: "#5d6678" })),
            ...Array.from({ length: 8 }, (_, i) => s.el("rect", { x: 22 + i * 24, y: 136, width: 12, height: 22, fill: "#5d6678" })),
            s.el("line", { x1: 110, y1: 56, x2: 110, y2: 20, stroke: "#5d6678", "stroke-width": 3 }), s.el("rect", { x: 110, y: 20, width: 34, height: 20, fill: "#1d5bd0" }), s.el("rect", { x: 0, y: 180, width: 220, height: 20, fill: "#9fd08f" }));
          const guard = s.el("g", null, s.el("rect", { x: -6, y: -26, width: 12, height: 14, rx: 4, fill: "#1b2740" }), s.el("rect", { x: -6, y: -12, width: 12, height: 18, fill: "#dc2626" }), s.el("rect", { x: -5, y: 6, width: 10, height: 12, fill: "#1b2740" }));
          guard.setAttribute("transform", "translate(30,182)"); v4.append(guard);
          v4.addEventListener("click", async () => { s.sfx.drum(); s.speak("Buckingham Palace", EN); await s.tween({ dur: 1600, ease: "inOut", update: v => guard.setAttribute("transform", `translate(${30 + 160 * Math.sin(v * Math.PI)},182)`) }); });
          const cards = [
            card("Big Ben", v1, "Big Ben", [s.h("b", null, "Big Ben"), " ist eigentlich die große Glocke! Der Turm heißt seit 2012 ", s.h("b", null, "Elizabeth Tower"), ". 96 m hoch, fertig 1859."]),
            card("Tower Bridge", v2, "Tower Bridge", ["Seit 1894. Die Brücke über die Themse kann sich für große Schiffe öffnen."]),
            card("London Eye", v3, "the London Eye", ["Riesenrad an der Themse, 135 m hoch, seit 2000. 32 Kabinen."]),
            card("Buckingham Palace", v4, "Buckingham Palace", ["Der offizielle Sitz des Königs in London. 775 Zimmer!"]),
          ];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, s.h("p", { class: "hand", style: { color: "var(--red)", margin: 0 } }, "Tippe auf die Bilder!"), s.h("div", { class: "cols4", style: { gap: "14px" } }, cards)));
          s.sfx.whoosh();
          cards.forEach((c, i) => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); s.speak(c.en, EN); if (i === 0) [[4, 0], [0, .45], [2, .9], [-5, 1.35]].forEach(([n, w]) => s.sfx.tone(392 * Math.pow(2, n / 12), 0.9, "sine", 0.18, w + 0.8)); }));
        },
      },
      /* 15 */
      {
        title: "London und Berlin",
        say: "Vergleichen wir London und Berlin. Der Fernsehturm ist viel höher als das London Eye und der Elizabeth Tower.",
        build(s) {
          const W = 520, H = 470;
          const svg = s.svg(W, H);
          const base = 400, k = 360 / 368;
          svg.append(s.el("line", { x1: 10, y1: base, x2: W - 10, y2: base, stroke: "#1b2740", "stroke-width": 3 }));
          const data = [
            { x: 40, v: 368, name: "Fernsehturm", city: "Berlin", col: "#1d5bd0" },
            { x: 200, v: 135, name: "London Eye", city: "London", col: "#dc2626" },
            { x: 360, v: 96, name: "Elizabeth Tower", city: "London", col: "#c79a12" },
          ];
          const bars = data.map(d => {
            const r = s.el("rect", { x: d.x, y: base, width: 120, height: 0, rx: 8, fill: d.col });
            const t = s.el("text", { x: d.x + 60, y: base - 10, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: d.col, text: "" });
            const n = s.el("text", { x: d.x + 60, y: base + 26, "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: "#1b2740", text: d.name });
            const c = s.el("text", { x: d.x + 60, y: base + 50, "text-anchor": "middle", "font-size": 19, fill: "#5d6678", text: d.city });
            const g = s.el("g", { class: "later" }, r, t, n, c); svg.append(g);
            return { g, r, t, d };
          });
          const grow = async b => {
            s.show(b.g, "fade"); s.sfx.whoosh();
            const hh = b.d.v * k;
            await s.tween({ dur: 1300, ease: "out", update: v => { b.r.setAttribute("y", base - hh * v); b.r.setAttribute("height", hh * v); b.t.setAttribute("y", base - hh * v - 10); b.t.textContent = Math.round(b.d.v * v) + " m"; } });
            s.sfx.ding();
          };
          const tl = [[1791, "Brandenburger Tor", "Berlin"], [1859, "Elizabeth Tower", "London"], [1863, "The Tube", "London"], [1894, "Tower Bridge", "London"], [1902, "U-Bahn", "Berlin"], [1969, "Fernsehturm", "Berlin"], [2000, "London Eye", "London"]];
          const rows = tl.map(([y, n, c]) => s.h("div", { class: "row later", style: { gap: "12px", flexWrap: "nowrap" } },
            s.h("span", { style: { font: "800 24px/1 var(--f-display)", width: "64px", color: c === "Berlin" ? "var(--blue)" : "var(--red)" } }, String(y)),
            s.h("span", { style: { width: "14px", height: "14px", borderRadius: "50%", background: c === "Berlin" ? "var(--blue)" : "var(--red)", flex: "none" } }),
            s.h("span", { class: "t", style: { fontSize: "22px" } }, n, s.h("span", { class: "pencil", style: { fontSize: "19px" } }, " · " + c))));
          const tlBox = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "14px 18px" } }, s.h("span", { class: "exlabel" }, "Zeitstrahl: Wie alt?"), rows);
          const sents = [hear(s, "The Fernsehturm is 368 metres tall.", "Der Fernsehturm ist 368 Meter hoch."), hear(s, "The Tube is from 1863.", "Die Tube gibt es seit 1863.")];
          sents.forEach(b => b.classList.add("later"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "28px", height: "100%", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "t", style: { textAlign: "center", fontWeight: 700 } }, "Wie hoch?"), svg), s.h("div", { class: "stack", style: { gap: "12px" } }, tlBox, sents)));
          s.sfx.whoosh();
          s.step(async () => { await grow(bars[0]); s.speak("The Fernsehturm is 368 metres tall.", EN); });
          s.step(async () => { await grow(bars[1]); await grow(bars[2]); s.show(sents[0], "left"); });
          s.step(async () => { for (let i = 0; i < rows.length; i++) { s.sfx.count(i); await s.show(rows[i], "left", 0); } s.show(sents[1], "left"); s.sfx.success(); });
        },
      },
      /* 16 */
      {
        title: "Im Alltag: theme park map",
        say: "Du bist in einem Freizeitpark und hast eine Karte. Wo ist was? Und wie kommst du zur Wasserrutsche?",
        build(s) {
          const W = 600, H = 600;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#d8f0c4" }),
            s.el("rect", { x: 280, y: 60, width: 44, height: 520, rx: 10, fill: "#f0dfb8" }),
            s.el("rect", { x: 40, y: 290, width: 530, height: 44, rx: 10, fill: "#f0dfb8" }));
          const coaster = s.el("g", null, s.el("rect", { x: 30, y: 30, width: 230, height: 230, rx: 12, fill: "#fff6c9", stroke: "#c79a12", "stroke-width": 3, "data-stroke": "#c79a12", "data-sw": 3 }),
            s.el("path", { d: "M50 220 Q80 60 120 160 T200 120 Q230 80 240 220", stroke: "#dc2626", "stroke-width": 7, fill: "none" }),
            s.el("text", { x: 145, y: 252, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: "roller coaster" }));
          const ghost = s.el("g", null, s.el("rect", { x: 344, y: 30, width: 230, height: 230, rx: 12, fill: "#efe6fb", stroke: "#7b4fd6", "stroke-width": 3, "data-stroke": "#7b4fd6", "data-sw": 3 }),
            s.el("path", { d: "M420 200 L420 110 Q459 60 498 110 L498 200 L485 188 L472 200 L459 188 L446 200 L433 188 Z", fill: "#fff", stroke: "#5d6678", "stroke-width": 3 }),
            s.el("circle", { cx: 446, cy: 120, r: 6, fill: "#1b2740" }), s.el("circle", { cx: 472, cy: 120, r: 6, fill: "#1b2740" }),
            s.el("text", { x: 459, y: 252, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: "ghost train" }));
          const lake = s.el("g", null, s.el("ellipse", { cx: 100, cy: 410, rx: 80, ry: 56, fill: "#6aa7d8", stroke: "#1f4f8a", "stroke-width": 3, "data-stroke": "#1f4f8a", "data-sw": 3 }),
            s.el("text", { x: 100, y: 417, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#fff", text: "lake" }));
          const cafe = bld(s, 186, 360, 86, 80, "#fde6e3", "café");
          const slide = s.el("g", null, s.el("rect", { x: 344, y: 350, width: 230, height: 110, rx: 12, fill: "#d7f0f7", stroke: "#1d5bd0", "stroke-width": 3, "data-stroke": "#1d5bd0", "data-sw": 3 }),
            s.el("path", { d: "M370 412 Q420 418 445 432 T545 448", stroke: "#1d5bd0", "stroke-width": 9, fill: "none" }),
            s.el("text", { x: 459, y: 386, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: "#1b2740", text: "water slide" }));
          const toilets = bld(s, 120, 480, 150, 70, "#eef1f6", "toilets");
          const shop = bld(s, 344, 480, 170, 70, "#fff3d6", "gift shop");
          const entrance = s.el("g", null, s.el("rect", { x: 262, y: 556, width: 80, height: 36, rx: 8, fill: "#2f7d32" }), s.el("text", { x: 302, y: 581, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#fff", text: "IN" }));
          svg.append(coaster, ghost, lake, cafe.g, slide, toilets.g, shop.g, entrance);
          const title = s.el("text", { x: 302, y: 40, "text-anchor": "middle", "font-size": 19, "font-weight": 800, fill: "#2f7d32", text: "" });
          svg.append(title);
          const trail = s.el("polyline", { points: "302,545", fill: "none", stroke: "#dc2626", "stroke-width": 5, "stroke-dasharray": "10 8", opacity: .7 });
          svg.append(trail);
          const me = walker(s); svg.append(me); me.at(302, 545);
          const R = { coaster: coaster.firstChild, ghost: ghost.firstChild, lake: lake.firstChild, cafe: cafe.r, slide: slide.firstChild, toilets: toilets.r, shop: shop.r };
          const light = keys => { Object.values(R).forEach(r => glow(r, false)); keys.forEach(k => glow(R[k], true, "#dc2626")); };
          const sets = [
            [["cafe", "lake"], "The café is next to the lake.", "Das Café ist neben dem See."],
            [["ghost", "coaster"], "The ghost train is opposite the roller coaster.", "Die Geisterbahn ist gegenüber der Achterbahn."],
            [["toilets", "shop"], "The toilets are opposite the gift shop.", "Die Toiletten sind gegenüber dem Souvenirladen."],
          ];
          const btns = sets.map(([keys, en, de]) => { const b = hear(s, en, de); b.classList.add("later"); b.addEventListener("click", () => light(keys)); return b; });
          const route = s.h("div", { class: "card soft later", style: { display: "flex", flexDirection: "column", gap: "8px" } }, s.h("span", { class: "exlabel" }, "To the water slide"),
            hear(s, "Go straight on. Turn right at the crossroads. The water slide is on your right.", "Geradeaus, an der Kreuzung rechts – die Rutsche ist rechts."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: `${W}px 1fr`, gap: "26px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, btns, route)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          sets.forEach(([keys, en], i) => s.step(async () => { light(keys); s.sfx.pop(); await s.show(btns[i], "left"); s.speak(en, EN); }));
          s.step(async () => {
            light([]); s.sfx.pop(); await s.show(route, "up");
            s.speak("Go straight on. Turn right at the crossroads. The water slide is on your right.", EN);
            await walk(s, me, [[302, 312]]); trail.setAttribute("points", "302,545 302,312");
            await walk(s, me, [[459, 312]]); trail.setAttribute("points", "302,545 302,312 459,312");
            light(["slide"]); s.sfx.success(); s.confetti(40 + 459, 92 + 330, 60);
          });
          void title;
        },
      },
    ],
  });
})();
