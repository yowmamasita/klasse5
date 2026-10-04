/* Unit 1 – Hello! Me and my school.
   Cast (used again in Unit 2): Lukas (10, Berlin), his sister Julia (8) and her cat Mo,
   Lukas' pen pal Ruby (11, London, Year 7) and her dog Biscuit. */
(() => {
  "use strict";
  const CSS = `
.e1spk{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:6px 16px 6px 10px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--ink);font:700 23px/1.2 var(--f-display);cursor:pointer;text-align:left}
.e1spk .ic{flex:none;width:32px;height:32px;border-radius:50%;background:var(--unit);color:#fff;display:grid;place-items:center}
.e1spk .ic svg{width:19px;height:19px}
.e1spk .tx{display:flex;flex-direction:column;gap:2px;min-width:0}
.e1spk small{font:400 19px/1.2 var(--f-body);color:var(--pencil)}
.e1spk.on{background:var(--unit-soft)}
.e1spk.sm{font-size:21px}
.e1spk.big{font-size:34px;padding:10px 24px 10px 14px}
.e1spk.big .ic{width:42px;height:42px}
.e1spk.big .ic svg{width:24px;height:24px}
.e1spk.bub{border-color:var(--line);border-radius:22px 22px 22px 6px;align-self:flex-start;max-width:100%}
.e1spk.bub.r{align-self:flex-end;border-radius:22px 22px 6px 22px;background:#eef3fd;border-color:#b9cdf3}
.e1spk.full{width:100%}
.e1who{font:700 19px/1 var(--f-display);color:var(--pencil)}
.e1key{width:100%;height:76px;border-radius:14px;border:2px solid var(--line);background:#fff;font:800 34px/1 var(--f-display);color:var(--ink);cursor:pointer;padding:0}
.e1key.tr{border-color:var(--red);color:var(--red);background:#fdecea}
.e1tile{display:inline-grid;place-items:center;min-width:70px;height:84px;padding:0 12px;border-radius:14px;background:var(--unit);color:#fff;font:800 44px/1 var(--f-display)}
.e1tile.dbl{background:var(--red)}
.e1hl{color:var(--red)}
.e1var{background:#fff3b8;border-radius:8px;padding:0 6px;display:inline-block}
.e1x{text-decoration:line-through;text-decoration-thickness:3px;color:var(--red)}
.e1tabs{display:flex;gap:12px;flex-wrap:wrap}
.e1tab{min-height:56px;padding:0 20px;border-radius:14px;border:2px solid var(--unit);background:#fff;color:var(--unit);font:700 22px/1 var(--f-display);cursor:pointer}
.e1tab.on{background:var(--unit);color:#fff}
.e1g{transform-box:fill-box;transform-origin:50% 100%}
.e1av{display:flex;align-items:center;gap:12px;padding:6px 14px 6px 6px;border-radius:16px;border:2px solid var(--line);background:#fff;cursor:pointer;font:700 24px/1.1 var(--f-display);color:var(--ink);min-height:56px}
.e1av.on{border-color:var(--unit);background:var(--unit-soft)}
.e1pair{display:flex;flex-direction:column;gap:8px}
.e1num{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:56px;padding:12px 4px;border-radius:14px;border:2px solid var(--line);background:#fff;cursor:pointer;color:var(--ink)}
.e1num b{font:800 32px/1 var(--f-display)}
.e1num span{font:400 19px/1.1 var(--f-body)}
.e1num.teen{border-color:var(--unit)}
.e1num.ty{border-color:var(--orange)}
.e1st{color:var(--red);font-weight:700}
.e1art{display:inline-block;min-width:46px;text-align:center;border-radius:10px;padding:2px 8px;color:#fff;font-weight:800}
.e1art.a{background:var(--blue)} .e1art.an{background:var(--violet)}
.e1row{display:grid;align-items:center;gap:10px}
.e1time{font:700 22px/1 var(--f-display);color:var(--pencil);font-variant-numeric:tabular-nums}
.e1pron{display:inline-block;color:#fff;border-radius:10px;padding:3px 10px;font:800 24px/1.15 var(--f-display);min-width:62px;text-align:center}
.e1mail{background:#fff;border:2px solid var(--line);border-radius:18px;padding:14px 20px;display:flex;flex-direction:column;gap:8px}
.e1mail .hd{font:400 19px/1.3 var(--f-body);color:var(--pencil);border-bottom:2px solid var(--line);padding-bottom:8px}
`;
  if (!document.getElementById("e1css")) { const st = document.createElement("style"); st.id = "e1css"; st.textContent = CSS; document.head.appendChild(st); }

  const SPK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9a4 4 0 010 6"/><path d="M19 6.5a8 8 0 010 11"/></svg>';
  const EN = (s, t) => s.speak(t, { lang: "en-GB", rate: 0.85 });

  /* ---------- motion helpers ---------- */
  const noAnim = el => { [...el.classList].forEach(c => { if (/^a-/.test(c)) el.classList.remove(c); }); };
  function bump(s, el, k = 0.12) {
    noAnim(el);
    return s.tween({ dur: 380, ease: "out", update: (v, t) => { el.style.transform = `scale(${1 + k * Math.sin(Math.PI * t)})`; } }).then(() => { el.style.transform = ""; });
  }
  async function flip(s, el, content) {
    const set = () => { el.textContent = ""; if (typeof content === "string") el.textContent = content; else el.append(content); };
    if (s.fast || !s.alive) { set(); return; }
    noAnim(el);
    await s.tween({ dur: 140, ease: "in", update: v => { el.style.transform = `scaleY(${1 - v})`; } });
    set();
    await s.tween({ dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }

  /** tap-to-hear button. label may be a node/array; o: {say, de, who, cls, later, on} */
  function spk(s, text, o = {}) {
    const ic = s.h("span", { class: "ic" }); ic.innerHTML = SPK_ICON;
    const tx = s.h("span", { class: "tx" });
    if (o.who) tx.append(s.h("span", { class: "e1who" }, o.who));
    tx.append(s.h("span", { class: "lb" }, o.label || text));
    if (o.de) tx.append(s.h("small", null, o.de));
    const b = s.h("button", { class: `e1spk ${o.cls || ""} ${o.later ? "later" : ""}` }, ic, tx);
    b.addEventListener("click", () => { EN(s, typeof o.say === "function" ? o.say() : (o.say || text)); s.sfx.pop(); bump(s, b, 0.06); if (o.on) o.on(b); });
    return b;
  }
  /** play several speak-buttons in order (estimated speaking time) */
  async function playSeq(s, items) {
    for (const [el, text] of items) {
      if (!s.alive) return;
      el.classList.add("on"); EN(s, text); s.sfx.tick();
      await s.wait(900 + text.length * 75);
      el.classList.remove("on");
    }
  }
  const life = (s, label, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);

  /* ---------- the cast, drawn in SVG (origin = between the feet, height 200 at scale 1) ---------- */
  const CAST = {
    lukas: { skin: "#f2c9a5", hair: "#7a4b25", style: "short", shirt: "#ee7a1a", h: 150 },
    julia: { skin: "#f4cfae", hair: "#e2b649", style: "pony", shirt: "#138a5a", h: 126 },
    ruby: { skin: "#a8724a", hair: "#2a1a12", style: "curly", shirt: "#1e3a6e", tie: "#c0392b", skirt: "#2c3e50", glasses: true, h: 160 },
  };
  function person(s, o) {
    const E = s.el, sc = (o.h || 200) / 200;
    const outer = E("g", { class: "e1g" });
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
  function dog(s, { x, y, sc = 1, c = "#b07a45" }) {
    const E = s.el, outer = E("g", { class: "e1g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    [-34, -20, 18, 32].forEach(lx => g.append(E("rect", { x: lx, y: -36, width: 11, height: 36, rx: 4, fill: c })));
    g.append(E("path", { d: "M40 -52 Q64 -66 60 -90", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    g.append(E("ellipse", { cx: 0, cy: -46, rx: 46, ry: 22, fill: c }));
    g.append(E("ellipse", { cx: -6, cy: -50, rx: 16, ry: 10, fill: "#8a5a2b", opacity: 0.5 }));
    g.append(E("circle", { cx: 46, cy: -76, r: 23, fill: c }));
    g.append(E("path", { d: "M30 -62 Q44 -54 60 -58", stroke: "#dc3b2a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
    g.append(E("ellipse", { cx: 64, cy: -70, rx: 14, ry: 10, fill: "#e8cba0" }), E("circle", { cx: 76, cy: -73, r: 5, fill: "#1b2740" }), E("circle", { cx: 52, cy: -83, r: 3.6, fill: "#1b2740" }));
    g.append(E("ellipse", { cx: 33, cy: -76, rx: 9, ry: 18, fill: "#7a4b25", transform: "rotate(12 33 -76)" }));
    return outer;
  }
  function cat(s, { x, y, sc = 1, c = "#8d96a3" }) {
    const E = s.el, outer = E("g", { class: "e1g" }), g = E("g", { transform: `translate(${x} ${y}) scale(${sc})` });
    outer.append(g);
    g.append(E("path", { d: "M-34 -40 Q-62 -50 -52 -96", stroke: c, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }));
    [-26, -12, 14, 26].forEach(lx => g.append(E("rect", { x: lx, y: -30, width: 10, height: 30, rx: 4, fill: c })));
    g.append(E("ellipse", { cx: 0, cy: -40, rx: 38, ry: 19, fill: c }));
    g.append(E("path", { d: "M26 -82 L28 -106 L42 -90 Z M50 -90 L62 -106 L62 -80 Z", fill: c }));
    g.append(E("circle", { cx: 44, cy: -70, r: 21, fill: c }));
    g.append(E("circle", { cx: 37, cy: -74, r: 3.4, fill: "#1b2740" }), E("circle", { cx: 52, cy: -74, r: 3.4, fill: "#1b2740" }), E("path", { d: "M42 -66 L46 -66 L44 -63 Z", fill: "#e88a9a" }));
    g.append(E("path", { d: "M30 -64 L16 -66 M30 -61 L16 -58 M58 -64 L72 -66 M58 -61 L72 -58", stroke: "#4b5262", "stroke-width": 1.6 }));
    return outer;
  }

  /* number words */
  const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const numWord = n => (n === 100 ? "a hundred" : n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : ""));

  Deck.unit({
    id: "u1", num: 1, title: "Hello! Me and my school", color: "#1d5bd0", soft: "#e4ecfb",
    subtitle: "Say hello – in English!",
    blurb: "Begrüßen, Alphabet, Zahlen, Farben, Schulsachen, be.",
    goals: [
      "Hallo sagen und dich vorstellen: I'm Lukas.",
      "Das englische Alphabet – und deinen Namen buchstabieren",
      "Zahlen bis 100, Farben und Sachen im Federmäppchen",
      "Classroom English: Was sagt die Lehrerin? Was sagst du?",
      "Eine Schule in London – und I am, you are, he is …",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M8 12 h54 a6 6 0 0 1 6 6 v26 a6 6 0 0 1 -6 6 h-34 l-12 12 v-12 h-8 a6 6 0 0 1 -6 -6 v-26 a6 6 0 0 1 6 -6 z", fill: "#1d5bd0", opacity: 0.15, stroke: "#1d5bd0", "stroke-width": 3 }),
        el("text", { x: 35, y: 40, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#1d5bd0", text: "Hi!" }));
    },
    slides: [
      /* 1 ------------------------------------------------------------ */
      {
        title: "Meet the gang!",
        say: "Das sind unsere Freunde für das ganze Englischjahr: Lukas und Julia aus Berlin, Ruby aus London und ihr Hund Biscuit. Tippe auf die Sprechblasen!",
        build(s) {
          const mk = (draw, name, line, de) => {
            const svg = s.svg(230, 250, { width: 160, height: 174 }); draw(svg);
            return s.h("div", { class: "card stack later", style: { alignItems: "center", gap: "10px", padding: "12px 14px" } },
              svg, s.h("p", { class: "h2", style: { color: "var(--unit)" } }, name),
              typeof line === "string" ? spk(s, line, { cls: "bub sm" }) : line, s.h("p", { class: "small pencil", style: { textAlign: "center" } }, de));
          };
          const cards = [
            mk(v => v.append(cast(s, "lukas", 112, 246, { wave: true, h: 200 })), "Lukas", "Hi! I'm Lukas. I'm from Berlin.", "Lukas ist 10 und geht in die 5. Klasse – wie du."),
            mk(v => v.append(cast(s, "julia", 72, 246, { h: 170 }), cat(s, { x: 150, y: 246, sc: 1.05 })), "Julia & Mo", "Hello! I'm Julia. This is Mo.", "Julia (8) ist Lukas' Schwester. Mo ist ihre Katze."),
            mk(v => v.append(cast(s, "ruby", 112, 246, { wave: true, h: 214 })), "Ruby", "Hi! I'm Ruby. I'm from London.", "Ruby (11) ist Lukas' Brieffreundin – sein pen pal."),
            mk(v => v.append(dog(s, { x: 88, y: 240, sc: 1.6 })), "Biscuit", s.soundBtn("dog-bark", "Woof! Woof!"), "Rubys Hund. Biscuit heißt „Keks“."),
          ];
          const info = s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "330px 1fr", gap: "20px", alignItems: "center", padding: "12px 16px" } },
            s.photo("big-ben", { w: 330, h: 176, pos: "62% 40%", caption: "Big Ben in London" }),
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("span", { class: "exlabel", style: { color: "var(--green)", marginBottom: "0" } }, "In real life"),
              s.h("p", { class: "t" }, "London liegt eine Stunde hinter Berlin: Ist es in Berlin 10 Uhr, ist es in London erst 9 Uhr."),
              s.h("div", { class: "row" }, s.soundBtn("big-ben-chimes", "Big Ben schlägt"))));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "space-between" } }, s.h("div", { class: "cols4", style: { gap: "16px" } }, cards), info));
          s.show(cards[0], "up"); s.sfx.pop();
          [1, 2, 3].forEach(i => s.step(async () => { if (i === 3) s.sound("dog-bark", { vol: 0.6 }); else s.sfx.pop(); await s.show(cards[i], "up"); }));
          s.step(async () => { s.sound("big-ben-chimes", { vol: 0.5, dur: 6 }); await s.show(info, "up"); s.say("Wenn es in Berlin zehn Uhr ist, ist es in London neun Uhr."); });
        },
      },
      /* 2 ------------------------------------------------------------ */
      {
        title: "Hello! Nice to meet you",
        say: "Lukas besucht Rubys Schule in London. Die beiden treffen sich zum ersten Mal. Tippe auf jede Sprechblase, dann hörst du sie.",
        build(s) {
          const svg = s.svg(400, 440);
          svg.append(s.el("rect", { x: 10, y: 380, width: 380, height: 10, rx: 5, fill: "#c8d3de" }));
          const L = cast(s, "lukas", 110, 385, { h: 260 }), R = cast(s, "ruby", 290, 385, { h: 280 });
          svg.append(L, R);
          const lines = [
            ["Ruby", "Hello! I'm Ruby. What's your name?", "r"],
            ["Lukas", "Hi, Ruby! My name is Lukas.", ""],
            ["Ruby", "Nice to meet you, Lukas.", "r"],
            ["Lukas", "Nice to meet you, too!", ""],
          ];
          const bubs = lines.map(([who, t, side]) => spk(s, t, { who, cls: "bub " + side, later: true, on: () => bump(s, who === "Ruby" ? R : L, 0.08) }));
          const play = s.h("button", { class: "btn solid later" }, "▶ Ganzes Gespräch abspielen");
          play.addEventListener("click", async () => { s.sfx.click(); await playSeq(s, bubs.map((b, i) => [b, lines[i][1]])); });
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "I'm"), " = I am  ·  ", s.h("b", null, "What's"), " = What is", s.h("br"), "Nice to meet you. = Schön, dich kennenzulernen.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, ...bubs, s.h("div", { class: "row" }, play), merk)));
          s.show(svg, "fade"); s.sound("school-bell", { vol: 0.4, dur: 2.5 });
          bubs.forEach((b, i) => s.step(async () => { s.sfx.pop(); bump(s, lines[i][0] === "Ruby" ? R : L, 0.08); await s.show(b, lines[i][2] ? "left" : "right"); if (i === 3) s.show(play, "pop"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------ */
      {
        title: "Good morning! How are you?",
        say: "Schiebe die Uhrzeit und sieh, welcher Gruß passt. Danach fragen wir: How are you? Wie geht es dir?",
        build(s) {
          const svg = s.svg(500, 230);
          const sky = s.el("rect", { x: 0, y: 0, width: 500, height: 230, rx: 18, fill: "#9fd3f5" });
          const sun = s.el("circle", { cx: 60, cy: 150, r: 26, fill: "#ffd94a", stroke: "#f2b51b", "stroke-width": 4 });
          const moon = s.el("path", { d: "M0 -24 A24 24 0 1 0 0 24 A18 18 0 1 1 0 -24 Z", fill: "#fff6c9", transform: "translate(420 60)", opacity: 0 });
          const stars = [[80, 40], [150, 70], [250, 30], [330, 80], [470, 120]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 3, fill: "#fff", opacity: 0 }));
          svg.append(sky, ...stars, sun, moon,
            s.el("rect", { x: 0, y: 186, width: 500, height: 44, fill: "#7cc47c" }),
            s.el("rect", { x: 40, y: 120, width: 110, height: 76, fill: "#e9e2d0", stroke: "#8a5a2b", "stroke-width": 3 }),
            s.el("path", { d: "M30 124 L95 82 L160 124 Z", fill: "#b5532a" }),
            s.el("rect", { x: 84, y: 156, width: 24, height: 40, fill: "#1e3a6e" }),
            s.el("rect", { x: 52, y: 136, width: 22, height: 18, fill: "#cfe8fb", stroke: "#8a5a2b", "stroke-width": 2 }));
          const G = h => (h < 12 ? ["Good morning!", "Guten Morgen! (bis 12 Uhr)"] : h < 18 ? ["Good afternoon!", "Guten Tag! (nachmittags)"] : h < 22 ? ["Good evening!", "Guten Abend!"] : ["Good night!", "Gute Nacht! (nur zum Schlafengehen)"]);
          let cur = G(8)[0];
          const gBtn = spk(s, cur, { cls: "big", say: () => cur });
          const lb = gBtn.querySelector(".lb");
          const de = s.h("p", { class: "t pencil" }, G(8)[1]);
          const paint = h => {
            const t = Math.max(0, Math.min(1, (h - 6) / 14));
            sun.setAttribute("cx", 40 + t * 420); sun.setAttribute("cy", 150 - Math.sin(Math.PI * t) * 115);
            const night = h >= 21, eve = h >= 18 && h < 21;
            sky.setAttribute("fill", night ? "#1b2a55" : eve ? "#f4a261" : h < 8 ? "#f7c59f" : "#9fd3f5");
            sun.setAttribute("opacity", night ? 0 : 1); moon.setAttribute("opacity", night ? 1 : 0); stars.forEach(x => x.setAttribute("opacity", night ? 0.9 : 0));
          };
          const sl = s.slider({ label: "Uhrzeit", min: 6, max: 22, value: 8, fmt: v => v + ":00 Uhr", onInput: v => {
            paint(v); const [g, d] = G(v);
            if (g !== cur) { cur = g; flip(s, lb, g); de.textContent = d; if (g === "Good night!") s.sound("owl", { vol: 0.6 }); else if (g === "Good morning!") s.sound("birds", { vol: 0.4, dur: 3 }); else s.sfx.coin(); }
          } });
          paint(8);
          // right: how are you
          const q = spk(s, "How are you?", { who: "Ruby", cls: "bub r later", de: "Wie geht es dir?" });
          const face = (m, c) => { const v = s.svg(34, 34); v.append(s.el("circle", { cx: 17, cy: 17, r: 15, fill: c }), s.el("circle", { cx: 11.5, cy: 14, r: 2.2, fill: "#1b2740" }), s.el("circle", { cx: 22.5, cy: 14, r: 2.2, fill: "#1b2740" }), s.el("path", { d: m, stroke: "#1b2740", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" })); return v; };
          const answers = [
            ["I'm great, thanks!", "Super, danke!", "M10 20 Q17 28 24 20", "#7fd8a6"],
            ["I'm fine, thank you.", "Gut, danke.", "M11 21 Q17 25 23 21", "#bfe6a3"],
            ["I'm OK.", "Es geht.", "M11 22 L23 22", "#ffe08a"],
            ["Not so good.", "Nicht so gut.", "M11 24 Q17 18 23 24", "#f6b3a8"],
          ].map(([t, d, m, c]) => { const b = spk(s, t, { de: d, cls: "sm full", later: true }); b.querySelector(".ic").replaceWith(face(m, c)); return b; });
          const andYou = spk(s, "And you?", { who: "Lukas", cls: "bub later", de: "Und dir?" });
          const gLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Um 8 Uhr im Schulbus: Good morning! · Um 15 Uhr im Laden: Good afternoon! · Am Abend beim Zubettgehen: Good night!"));
          gLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "„Good night!“ sagt man nur zum ", s.h("b", null, "Abschied"), " am Abend – nie zur Begrüßung. „Hi“ und „Hello“ gehen immer.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, sl, s.h("div", { class: "row" }, gBtn), de, gLife),
            s.h("div", { class: "stack", style: { gap: "10px" } }, q, ...answers, andYou, merk)));
          s.show(svg, "zoom"); s.sound("birds", { vol: 0.4, dur: 5 });
          s.step(async () => {
            s.sfx.tick();
            await s.tween({ from: 8, to: 20, dur: 1600, update: v => { const h = Math.round(v); sl.input.value = h; paint(v); } });
            sl.set(20); s.say("Am Abend sagt man: Good evening!");
          });
          s.step(async () => { s.sfx.pop(); s.show(gLife, "up"); await s.show(q, "left"); });
          s.step(async () => { answers.forEach((a, i) => setTimeout(() => s.alive && s.sfx.count(i), i * 120)); await s.show(answers, "right"); s.show(andYou, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------ */
      {
        title: "Introduce yourself",
        say: "So stellst du dich vor. Tippe auf Lukas, Ruby oder Julia – die Sätze passen sich an.",
        build(s) {
          const P = {
            lukas: { name: "Lukas", age: "10", from: "Berlin", live: "Neukölln" },
            ruby: { name: "Ruby", age: "11", from: "London", live: "Camden" },
            julia: { name: "Julia", age: "8", from: "Berlin", live: "Neukölln" },
          };
          const vars = { name: s.h("span", { class: "e1var" }), age: s.h("span", { class: "e1var" }), from: s.h("span", { class: "e1var" }), live: s.h("span", { class: "e1var" }) };
          let who = "lukas";
          const texts = () => { const p = P[who]; return [`My name is ${p.name}.`, `I'm ${p.age} years old.`, `I'm from ${p.from}.`, `I live in ${p.live}.`]; };
          const DEs = ["Ich heiße …", "Ich bin … Jahre alt.", "Ich komme aus …", "Ich wohne in …"];
          const lines = ["name", "age", "from", "live"].map((k, i) => {
            const pre = ["My name is ", "I'm ", "I'm from ", "I live in "][i], post = [".", " years old.", ".", "."][i];
            const lb = s.h("span", null, pre, vars[k], post);
            return spk(s, "", { label: lb, de: DEs[i], cls: "full", say: () => texts()[i] });
          });
          const avs = {};
          const choose = async (k, quiet) => {
            who = k; Object.entries(avs).forEach(([kk, a]) => a.classList.toggle("on", kk === k));
            if (!quiet) s.sfx.whoosh();
            const p = P[k];
            await Promise.all([flip(s, vars.name, p.name), flip(s, vars.age, p.age), flip(s, vars.from, p.from), flip(s, vars.live, p.live)]);
          };
          ["lukas", "ruby", "julia"].forEach(k => {
            const v = s.svg(100, 120); v.append(cast(s, k, 50, 118, { h: 116 }));
            avs[k] = s.h("button", { class: "e1av" }, v, P[k].name);
            avs[k].addEventListener("click", () => choose(k));
          });
          const play = s.h("button", { class: "btn solid" }, "▶ Alles vorlesen");
          play.addEventListener("click", () => { s.sfx.click(); playSeq(s, lines.map((b, i) => [b, texts()[i]])); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Ich bin 10 Jahre alt. → ", s.h("b", null, "I'm 10."), " oder ", s.h("b", null, "I'm 10 years old."), s.h("br"), "Nie: ", s.h("span", { class: "e1x" }, "I have 10 years."), " Im Englischen ", s.h("b", null, "ist"), " man sein Alter.");
          const iLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Am ersten Tag im Feriencamp, im Sportverein mit Kindern aus England oder in deiner ersten Nachricht an einen pen pal."));
          iLife.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "250px 1fr", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "t pencil" }, "Wer stellt sich vor?"), avs.lukas, avs.ruby, avs.julia),
            s.h("div", { class: "stack", style: { gap: "8px" } }, ...lines, s.h("div", { class: "row" }, play), merk, iLife)));
          choose("lukas", true);
          s.show(lines, "left"); s.sfx.pop();
          s.step(async () => { await choose("ruby"); s.say("Ruby ist elf und kommt aus London."); });
          s.step(async () => { await choose("julia"); s.say("Julia ist acht."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(iLife, "up"); s.say("Achtung: Im Englischen sagt man I am ten, nicht I have ten years."); });
        },
      },
      /* 5 ------------------------------------------------------------ */
      {
        title: "The alphabet: A to Z",
        say: "Das englische Alphabet. Tippe auf jeden Buchstaben und hör genau hin. Einige Buchstaben klingen ganz anders als im Deutschen!",
        build(s) {
          const TR = { A: "„äi“", E: "„ii“", I: "„ai“", G: "„dschii“", J: "„dschäi“", R: "„aa“", Y: "„wai“", H: "„äitsch“" };
          const keys = {};
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: "10px" } });
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((L, i) => {
            const k = s.h("button", { class: "e1key a-pop", style: { "--d": i * 25 + "ms" } }, L);
            k.addEventListener("click", () => { EN(s, L + "."); s.sfx.note(i % 12, 0.15); bump(s, k, 0.15); });
            keys[L] = k; grid.append(k);
          });
          const tcard = L => {
            const b = s.h("button", { class: "e1num later", style: { flexDirection: "row", gap: "14px", justifyContent: "flex-start", padding: "14px 14px", borderColor: "var(--red)" } },
              s.h("b", { style: { fontSize: "40px", color: "var(--red)" } }, L), s.h("span", null, "klingt wie ", s.h("b", { style: { fontSize: "24px" } }, TR[L])));
            b.addEventListener("click", () => { EN(s, L + "."); s.sfx.pop(); bump(s, b, 0.08); });
            return b;
          };
          const groups = [["A", "E", "I"], ["G", "J"], ["R", "Y", "H"]];
          const cards = {}; Object.keys(TR).forEach(L => (cards[L] = tcard(L)));
          const tgrid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" } }, ["A", "E", "I", "G", "J", "R", "Y", "H"].map(L => cards[L]));
          const head = s.h("p", { class: "t later" }, s.h("b", { class: "red" }, "Vorsicht, Falle!"), " Diese Buchstaben klingen anders als im Deutschen:");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "E"), " klingt wie unser I, und ", s.h("b", null, "I"), " klingt wie „ai“ – wie vertauscht! Auch ", s.h("b", null, "G"), " (dschii) und ", s.h("b", null, "J"), " (dschäi) nicht verwechseln.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px" } }, grid, head, tgrid, merk));
          s.sfx.whoosh();
          groups.forEach((gr, gi) => s.step(async () => {
            if (gi === 0) s.show(head, "fade");
            gr.forEach((L, i) => { keys[L].classList.add("tr"); bump(s, keys[L], 0.25); setTimeout(() => s.alive && s.sfx.count(i + gi * 3), i * 150); });
            await s.show(gr.map(L => cards[L]), "up");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("E klingt wie ein deutsches I, und I klingt wie ai."); });
        },
      },
      /* 6 ------------------------------------------------------------ */
      {
        title: "How do you spell that?",
        say: "Englische Namen buchstabiert man ganz oft: am Telefon, im Hotel oder in der Schule. Tippe auf einen Namen!",
        build(s) {
          const dlg = [
            ["Lukas", "What's your name?", ""],
            ["Ruby", "My name is Ruby.", "r"],
            ["Lukas", "How do you spell that?", ""],
            ["Ruby", "R – U – B – Y.", "r"],
          ].map(([who, t, side], i) => spk(s, t, { who, cls: "bub " + side, later: i > 1, say: i === 3 ? "R. U. B. Y." : t }));
          const tiles = s.h("div", { class: "row", style: { gap: "10px", minHeight: "84px", flexWrap: "nowrap" } });
          const tileBox = s.h("div", { class: "card later", style: { display: "grid", placeItems: "center", minHeight: "120px" } }, tiles);
          let busy = 0;
          const NAMES = { RUBY: ["R", "U", "B", "Y"], LUKAS: ["L", "U", "K", "A", "S"], JULIA: ["J", "U", "L", "I", "A"], GEORGE: ["G", "E", "O", "R", "G", "E"], BELLA: ["B", "E", "double L", "A"] };
          const spell = async name => {
            const my = ++busy;
            tiles.innerHTML = "";
            for (const [i, t] of NAMES[name].entries()) {
              if (!s.alive || my !== busy) return;
              const el = s.h("span", { class: "e1tile later" + (t.length > 1 ? " dbl" : "") }, t === "double L" ? "LL" : t);
              if (t.length > 1) el.title = "double L";
              tiles.append(el);
              s.sfx.count(i); EN(s, t === "double L" ? "double L" : t + ".");
              await s.show(el, "pop");
              await s.wait(t.length > 1 ? 500 : 250);
            }
            if (my === busy) { s.sfx.success(); EN(s, name.charAt(0) + name.slice(1).toLowerCase()); }
          };
          const nameBtns = s.h("div", { class: "row later", style: { gap: "10px" } }, Object.keys(NAMES).map(n => { const b = s.h("button", { class: "btn" }, n.charAt(0) + n.slice(1).toLowerCase()); b.addEventListener("click", () => { s.sfx.click(); spell(n); }); return b; }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Zwei gleiche Buchstaben hintereinander: ", s.h("b", null, "double"), ".", s.h("br"), "Bella = B – E – ", s.h("b", null, "double L"), " – A");
          const phone = ex(s, "Am Telefon", spk(s, "Can I have your surname, please?", { cls: "sm", de: "Wie ist dein Nachname, bitte?" }), s.h("div", { style: { height: "8px" } }), spk(s, "Yes, it's Schulz: S – C – H – U – L – Z.", { cls: "sm", say: "Yes, it's Schulz. S. C. H. U. L. Z." }));
          phone.classList.add("later");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Am Telefon, im Hotel, beim Arzt, auf Klassenfahrt: „How do you spell that?“ – dann buchstabierst du deinen Namen."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...dlg, lf),
            s.h("div", { class: "stack", style: { gap: "14px" } }, tileBox, s.h("p", { class: "t pencil later" }, "Tippe auf einen Namen:"), nameBtns, merk, phone)));
          s.show(dlg.slice(0, 2), "up"); s.sfx.pop();
          const lab = s.root.querySelector(".t.pencil.later");
          s.step(async () => { s.sfx.pop(); await s.show(dlg.slice(2), "up"); });
          s.step(async () => { await s.show(tileBox, "zoom"); await spell("RUBY"); });
          s.step(async () => { s.sfx.whoosh(); s.show(lab, "fade"); await s.show(nameBtns, "up"); s.show(lf, "up"); });
          s.step(async () => { s.show(merk, "up"); s.show(phone, "up", 200); s.sound("phone-ring", { vol: 0.5, dur: 2.4 }); if (!s.fast) await s.wait(2600); await spell("BELLA"); });
        },
      },
      /* 7 ------------------------------------------------------------ */
      {
        title: "Numbers: -teen or -ty?",
        say: "Zahlen auf Englisch. Bei dreizehn und dreißig musst du ganz genau hinhören: Wo liegt die Betonung?",
        build(s) {
          const row1 = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "8px" } });
          const t12 = [];
          for (let n = 1; n <= 12; n++) {
            const b = s.h("button", { class: "e1num later" }, s.h("b", null, String(n)), s.h("span", null, ONES[n]));
            b.addEventListener("click", () => { EN(s, ONES[n]); s.sfx.count(n - 1); bump(s, b, 0.12); });
            t12.push(b); row1.append(b);
          }
          const PAIRS = [["thir", 13, 30, "thir"], ["four", 14, 40, "for"], ["fif", 15, 50, "fif"], ["six", 16, 60, "six"], ["seven", 17, 70, "seven"], ["eigh", 18, 80, "eigh"], ["nine", 19, 90, "nine"]];
          const teens = [], tys = [];
          const pairs = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" } }, PAIRS.map(([a, n1, n2, b]) => {
            const bt = s.h("button", { class: "e1num teen later" }, s.h("b", null, String(n1)), s.h("span", null, a, s.h("span", { class: "e1st" }, "TEEN")));
            const by = s.h("button", { class: "e1num ty later" }, s.h("b", null, String(n2)), s.h("span", null, s.h("span", { class: "e1st" }, b.toUpperCase()), "ty"));
            bt.addEventListener("click", () => { EN(s, ONES[n1]); s.sfx.note(7, 0.2); bump(s, bt, 0.12); });
            by.addEventListener("click", () => { EN(s, TENS[n2 / 10]); s.sfx.note(0, 0.2); bump(s, by, 0.12); });
            teens.push(bt); tys.push(by);
            return s.h("div", { class: "e1pair" }, bt, by);
          }));
          const lab2 = s.h("p", { class: "t later" }, s.h("b", { style: { color: "var(--unit)" } }, "13–19: -teen"), "  und  ", s.h("b", { class: "orange" }, "30–90: -ty"), " – rot = hier liegt die Betonung");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "thir", s.h("b", { class: "red" }, "TEEN"), " (13): Betonung hinten, langes „ii“.  ", s.h("b", { class: "red" }, "THIR"), "ty (30): Betonung vorn.", s.h("br"), "Achtung: four → ", s.h("b", null, "forty"), " (40) – ohne u!");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Im Bus, im Laden, am Gleis: „It's fifteen pounds“ oder „fifty pounds“? Ein großer Unterschied – also auf die Betonung hören!"));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "t" }, s.h("b", null, "1–12"), " musst du einfach lernen:"), row1, lab2, pairs, s.h("div", { class: "cols", style: { gridTemplateColumns: "1.25fr 1fr", gap: "16px" } }, merk, lf)));
          t12.forEach((b, i) => setTimeout(() => s.alive && s.sfx.count(i), i * 60));
          s.show(t12, "pop");
          s.step(async () => { s.show(lab2, "fade"); teens.forEach((b, i) => setTimeout(() => s.alive && s.sfx.note(i + 2, 0.12), i * 120)); await s.show(teens, "down"); });
          s.step(async () => { tys.forEach((b, i) => setTimeout(() => s.alive && s.sfx.note(i - 5, 0.12), i * 120)); await s.show(tys, "up"); s.say("Vergleiche: thirteen und thirty."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sound("coins", { vol: 0.6 }); s.show(lf, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------ */
      {
        title: "Numbers up to 100",
        say: "Schiebe den Regler bis hundert. Im Englischen kommen erst die Zehner, dann die Einer – andersherum als im Deutschen.",
        build(s) {
          const big = s.h("p", { class: "huge mono", style: { color: "var(--unit)", fontSize: "110px" } }, "45");
          const word = s.h("p", { class: "big", style: { minHeight: "50px" } });
          let n = 45;
          const render = () => {
            word.textContent = "";
            if (n >= 20 && n < 100 && n % 10) { const [a, b] = numWord(n).split("-"); word.append(s.h("span", { class: "blue" }, a), s.h("span", { class: "pencil" }, "-"), s.h("span", { class: "red" }, b)); }
            else word.append(s.h("span", { class: "blue" }, numWord(n)));
            big.textContent = String(n);
          };
          render();
          const hear = s.h("button", { class: "btn solid" }, "🔊 Anhören");
          hear.addEventListener("click", () => { EN(s, numWord(n)); s.sfx.pop(); bump(s, big, 0.1); });
          const sl = s.slider({ label: "Zahl", min: 1, max: 100, value: 45, onInput: v => { n = v; render(); } });
          const setN = async v => { const from = n; await s.tween({ from, to: v, dur: 700, update: x => { n = Math.round(x); sl.input.value = n; render(); } }); sl.set(v); };
          const exs = [
            ["Open your books at page 45, please.", 45, "Schlagt bitte Seite 45 auf."],
            ["Ruby lives at number 72.", 72, "Ruby wohnt in Hausnummer 72."],
            ["My grandma is 67.", 67, "Meine Oma ist 67."],
            ["There are 28 pupils in my class.", 28, "In meiner Klasse sind 28 Kinder."],
          ].map(([t, v, d]) => spk(s, t, { de: d, cls: "sm full", later: true, on: () => setN(v) }));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Deutsch: fünf", s.h("i", null, "und"), "vierzig. Englisch: ", s.h("b", { class: "blue" }, "forty"), "-", s.h("b", { class: "red" }, "five"), " – erst die Zehner, dann die Einer, mit Bindestrich. 100 = ", s.h("b", null, "a hundred"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", height: "100%" } },
            s.h("div", { class: "card stack", style: { alignItems: "center", justifyContent: "center", gap: "14px" } }, big, word, hear, s.h("div", { style: { width: "100%" } }, sl)),
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "t pencil" }, "Tippe – der Regler springt mit:"), ...exs, merk)));
          s.show(big, "zoom"); s.sfx.whoosh();
          s.step(async () => { exs.forEach((_, i) => setTimeout(() => s.alive && s.sfx.pop(), i * 120)); await s.show(exs, "right"); await setN(72); });
          s.step(async () => { s.sfx.ding(); await setN(45); await s.show(merk, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------ */
      {
        title: "Colours in London",
        say: "Farben auf Englisch. Tippe auf eine Farbe oder auf etwas im Bild.",
        build(s) {
          const COL = [["red", "#dc3b2a", "rot"], ["blue", "#1d5bd0", "blau"], ["green", "#2f9e44", "grün"], ["yellow", "#ffd94a", "gelb"], ["orange", "#ee7a1a", "orange"], ["purple", "#7b4fd6", "lila"], ["pink", "#f06fa5", "rosa"], ["brown", "#8a5a2b", "braun"], ["black", "#1b2740", "schwarz"], ["white", "#ffffff", "weiß"], ["grey", "#8d96a3", "grau"]];
          const swatch = c => { const v = s.svg(30, 30); v.append(s.el("circle", { cx: 15, cy: 15, r: 13, fill: c, stroke: "#8a94a6", "stroke-width": 2 })); return v; };
          const pal = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } }, COL.map(([w, c, d]) => {
            const b = spk(s, w, { de: d, cls: "sm full" }); b.querySelector(".ic").replaceWith(swatch(c)); return b;
          }));
          const svg = s.svg(600, 360);
          const sentence = s.h("span", { class: "lb" }, "Tippe auf etwas im Bild!");
          let curS = "";
          const sBtn = s.h("button", { class: "e1spk" }, (() => { const ic = s.h("span", { class: "ic" }); ic.innerHTML = SPK_ICON; return ic; })(), s.h("span", { class: "tx" }, sentence));
          sBtn.addEventListener("click", () => { if (curS) { EN(s, curS); s.sfx.pop(); } });
          const obj = (g, text) => { g.style.cursor = "pointer"; g.addEventListener("click", () => { curS = text; flip(s, sentence, text); EN(s, text); s.sfx.pop(); bump(s, g, 0.1); }); return g; };
          const E = s.el;
          svg.append(E("rect", { x: 0, y: 0, width: 600, height: 360, rx: 18, fill: "#cfe8fb" }), E("rect", { x: 0, y: 290, width: 600, height: 70, fill: "#c8ccd4" }));
          const sunG = obj(E("g", { class: "e1g" }, E("circle", { cx: 540, cy: 60, r: 34, fill: "#ffd94a", stroke: "#f2b51b", "stroke-width": 4 })), "The sun is yellow.");
          const cloud = obj(E("g", { class: "e1g" }, ...[[90, 60, 26], [120, 48, 32], [155, 62, 24], [120, 70, 26]].map(([x, y, r]) => E("circle", { cx: x, cy: y, r, fill: "#fff" }))), "The cloud is white.");
          const tree = obj(E("g", { class: "e1g" }, E("rect", { x: 48, y: 200, width: 20, height: 92, fill: "#8a5a2b" }), E("circle", { cx: 58, cy: 178, r: 46, fill: "#2f9e44" }), E("circle", { cx: 30, cy: 205, r: 28, fill: "#2f9e44" }), E("circle", { cx: 86, cy: 205, r: 28, fill: "#2f9e44" })), "The tree is green.");
          const bus = obj(E("g", { class: "e1g" },
            E("rect", { x: 130, y: 128, width: 250, height: 160, rx: 18, fill: "#dc3b2a" }),
            ...[0, 1, 2, 3, 4].map(i => E("rect", { x: 144 + i * 46, y: 142, width: 38, height: 40, rx: 6, fill: "#e8f4fd" })),
            ...[0, 1, 2, 3].map(i => E("rect", { x: 190 + i * 46, y: 206, width: 38, height: 40, rx: 6, fill: "#e8f4fd" })),
            E("rect", { x: 144, y: 206, width: 36, height: 74, rx: 4, fill: "#f4c9c3" }),
            E("rect", { x: 130, y: 192, width: 250, height: 8, fill: "#a82a1d" }),
            E("circle", { cx: 180, cy: 290, r: 20, fill: "#1b2740" }), E("circle", { cx: 330, cy: 290, r: 20, fill: "#1b2740" }),
            E("circle", { cx: 180, cy: 290, r: 8, fill: "#c8ccd4" }), E("circle", { cx: 330, cy: 290, r: 8, fill: "#c8ccd4" })), "The bus is red.");
          const box = obj(E("g", { class: "e1g" }, E("rect", { x: 410, y: 196, width: 50, height: 100, rx: 8, fill: "#dc3b2a" }), E("path", { d: "M406 200 Q435 168 464 200 Z", fill: "#a82a1d" }), E("rect", { x: 420, y: 216, width: 30, height: 6, rx: 3, fill: "#1b2740" })), "The post box is red.");
          const biscuit = obj(dog(s, { x: 510, y: 330, sc: 0.75 }), "Biscuit is brown.");
          const pigeon = obj(E("g", { class: "e1g" }, E("ellipse", { cx: 410, cy: 336, rx: 20, ry: 13, fill: "#8d96a3" }), E("circle", { cx: 428, cy: 322, r: 9, fill: "#8d96a3" }), E("path", { d: "M436 322 L444 325 L436 327 Z", fill: "#ee7a1a" }), E("circle", { cx: 430, cy: 320, r: 1.8, fill: "#1b2740" })), "The pigeon is grey.");
          svg.append(sunG, cloud, tree, bus, box, biscuit, pigeon);
          svg.firstChild.style.cursor = "pointer";
          svg.firstChild.addEventListener("click", () => { curS = "The sky is blue."; flip(s, sentence, curS); EN(s, curS); s.sfx.pop(); });
          const fact = life(s, "In real life", s.h("p", { class: "small" }, "Londoner Busse müssen seit 1997 zu 80 % rot sein. Die Briefkästen (post boxes) sind seit 1874 rot."));
          fact.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Britisch: ", s.h("b", null, "colour, grey"), s.h("br"), "Amerikanisch: color, gray");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", height: "100%", gap: "24px" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, pal, merk),
            s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "row" }, sBtn), fact)));
          s.show(pal.children ? [...pal.children] : pal, "pop"); s.sfx.whoosh();
          s.step(async () => {
            for (const [g, t] of [[bus, "The bus is red."], [sunG, "The sun is yellow."], [biscuit, "Biscuit is brown."]]) { curS = t; flip(s, sentence, t); s.sfx.pop(); await bump(s, g, 0.12); await s.wait(350); }
          });
          s.step(async () => { s.sound("london-bus-street", { vol: 0.45, dur: 4 }); await s.show(fact, "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(merk, "up"); s.say("Britisches Englisch schreibt colour mit u und grey mit e."); });
        },
      },
      /* 9b ---------------------------------------------------------- */
      {
        title: "Colours: London in echt",
        say: "So sehen die Farben von London in echt aus. Tippe auf die Sätze und hör dir die Stadt an!",
        build(s) {
          const o = pos => ({ w: "100%", h: 330, pos });
          const P = [
            [s.photo("london-bus", o("56% 50%")), "The bus is red.", "Doppeldecker – double-decker"],
            [s.photo("post-box", o("50% 50%")), "The post box is red.", "Briefkasten – post box"],
            [s.photo("phone-box", o("50% 45%")), "The phone box is red.", "Telefonzelle – phone box"],
            [s.photo("black-cab", o("38% 55%")), "The taxi is black.", "Londoner Taxis: black cabs"],
          ];
          const cols = P.map(([ph, t, d]) => s.h("div", { class: "stack later", style: { gap: "10px", alignItems: "stretch" } }, ph, spk(s, t, { de: d, cls: "sm full" })));
          const sounds = s.h("div", { class: "row later", style: { gap: "14px" } }, s.h("span", { class: "t pencil" }, "Hör dir London an:"),
            s.soundBtn("london-bus-street", "Ein Bus fährt vorbei"), s.soundBtn("bus-announce", "Ansage im Bus"), s.soundBtn("big-ben-chimes", "Big Ben"));
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" } }, cols), sounds));
          s.show(cols[0], "up"); s.sound("london-bus-street", { vol: 0.45, dur: 5 });
          s.step(async () => { s.sfx.pop(); await s.show(cols[1], "up"); });
          s.step(async () => { s.sound("phone-ring", { vol: 0.45, dur: 2.4 }); await s.show(cols[2], "up"); });
          s.step(async () => { s.sound("traffic", { vol: 0.4, dur: 3 }); await s.show(cols[3], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(sounds, "up"); s.say("Typisch London: rote Busse, rote Briefkästen, rote Telefonzellen und schwarze Taxis."); });
        },
      },
      /* 10 ----------------------------------------------------------- */
      {
        title: "My pencil case",
        say: "Was ist in deinem Federmäppchen? Die Sachen fliegen heraus – tippe auf jede, um das Wort zu hören.",
        build(s) {
          const E = s.el;
          const ICONS = {
            pen: v => v.append(E("rect", { x: 14, y: 30, width: 110, height: 16, rx: 8, fill: "#1d5bd0" }), E("path", { d: "M124 32 L142 38 L124 44 Z", fill: "#1b2740" }), E("rect", { x: 30, y: 24, width: 40, height: 5, rx: 2, fill: "#9bb4e8" })),
            pencil: v => v.append(E("rect", { x: 14, y: 29, width: 100, height: 18, fill: "#ffd94a", stroke: "#e0b000", "stroke-width": 2 }), E("path", { d: "M114 29 L142 38 L114 47 Z", fill: "#f1d3a8" }), E("path", { d: "M134 35 L142 38 L134 41 Z", fill: "#1b2740" }), E("rect", { x: 6, y: 29, width: 10, height: 18, rx: 3, fill: "#f06fa5" })),
            rubber: v => v.append(E("g", { transform: "rotate(-12 75 38)" }, E("rect", { x: 40, y: 22, width: 70, height: 34, rx: 6, fill: "#f6b3a8" }), E("rect", { x: 70, y: 22, width: 40, height: 34, rx: 6, fill: "#1d5bd0" }))),
            ruler: v => v.append(E("rect", { x: 6, y: 24, width: 140, height: 28, rx: 3, fill: "#d8f0ff", stroke: "#6aa6d6", "stroke-width": 2 }), ...Array.from({ length: 14 }, (_, i) => E("line", { x1: 14 + i * 10, y1: 24, x2: 14 + i * 10, y2: i % 5 === 0 ? 40 : 33, stroke: "#1b2740", "stroke-width": 1.5 }))),
            sharpener: v => v.append(E("rect", { x: 50, y: 20, width: 52, height: 38, rx: 6, fill: "#7b4fd6" }), E("circle", { cx: 66, cy: 39, r: 10, fill: "#3b2470" }), E("path", { d: "M80 26 L98 30 L80 34 Z", fill: "#c8ccd4" })),
            "glue stick": v => v.append(E("rect", { x: 30, y: 26, width: 70, height: 24, rx: 5, fill: "#ffffff", stroke: "#8a94a6", "stroke-width": 2 }), E("rect", { x: 100, y: 24, width: 26, height: 28, rx: 5, fill: "#dc3b2a" }), E("rect", { x: 44, y: 32, width: 36, height: 12, rx: 3, fill: "#ffd94a" })),
            scissors: v => v.append(E("path", { d: "M58 30 L136 52 M58 46 L136 24", stroke: "#8d96a3", "stroke-width": 6, "stroke-linecap": "round" }), E("circle", { cx: 42, cy: 26, r: 12, fill: "none", stroke: "#ee7a1a", "stroke-width": 6 }), E("circle", { cx: 42, cy: 52, r: 12, fill: "none", stroke: "#ee7a1a", "stroke-width": 6 })),
            "felt tip": v => v.append(E("rect", { x: 20, y: 28, width: 86, height: 20, rx: 6, fill: "#2f9e44" }), E("rect", { x: 106, y: 26, width: 30, height: 24, rx: 6, fill: "#1f7a33" }), E("rect", { x: 30, y: 32, width: 56, height: 12, rx: 3, fill: "#fff", opacity: 0.6 })),
            "exercise book": v => v.append(E("rect", { x: 44, y: 6, width: 64, height: 64, rx: 4, fill: "#1d5bd0" }), E("rect", { x: 54, y: 18, width: 44, height: 16, rx: 2, fill: "#fff" }), E("line", { x1: 58, y1: 24, x2: 94, y2: 24, stroke: "#8a94a6", "stroke-width": 1.5 }), E("line", { x1: 58, y1: 29, x2: 86, y2: 29, stroke: "#8a94a6", "stroke-width": 1.5 })),
            "school bag": v => v.append(E("rect", { x: 46, y: 14, width: 60, height: 58, rx: 14, fill: "#dc3b2a" }), E("path", { d: "M62 14 Q76 -2 90 14", stroke: "#a82a1d", "stroke-width": 5, fill: "none" }), E("rect", { x: 54, y: 42, width: 44, height: 22, rx: 6, fill: "#a82a1d" })),
          };
          const DE = { pen: "Kuli / Füller", pencil: "Bleistift", rubber: "Radiergummi", ruler: "Lineal", sharpener: "Anspitzer", "glue stick": "Klebestift", scissors: "Schere", "felt tip": "Filzstift", "exercise book": "Heft", "school bag": "Schultasche" };
          const SAY = { sharpener: "a pencil sharpener", scissors: "scissors", "exercise book": "an exercise book" };
          const cards = Object.keys(ICONS).map(k => {
            const v = s.svg(150, 76); ICONS[k](v);
            const b = spk(s, k === "sharpener" ? "pencil sharpener" : k, { de: DE[k], cls: "sm", say: SAY[k] || "a " + k });
            b.style.width = "100%";
            return s.h("div", { class: "card stack later", style: { alignItems: "center", gap: "6px", padding: "8px 8px 10px" } }, v, b);
          });
          // pencil case: a real one
          const pc = s.photo("pencil-case", { w: 270, h: 190, pos: "50% 55%", caption: "a pencil case" });
          const q = spk(s, "What's in your pencil case?", { de: "Was ist in deinem Federmäppchen?" });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "rubber"), " (britisch) = eraser (amerikanisch) = Radiergummi");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "22px" } }, pc, s.h("div", { class: "stack", style: { gap: "10px" } }, q, merk)),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" } }, cards)));
          s.show(pc, "zoom"); s.sfx.pop();
          const open = async () => { s.sound("zipper", { vol: 0.7 }); await bump(s, pc, 0.06); };
          s.step(async () => { await open(); cards.slice(0, 5).forEach((_, i) => setTimeout(() => s.alive && s.sfx.pop(), i * 120)); await s.show(cards.slice(0, 5), "down"); });
          s.step(async () => { s.sound("scissors", { vol: 0.6 }); await s.show(cards.slice(5), "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "left"); s.say("Rubber ist britisches Englisch für Radiergummi."); });
        },
      },
      /* 11 ----------------------------------------------------------- */
      {
        title: "a or an?",
        say: "Wann sagt man a, wann an? Es kommt auf den ersten Laut an, nicht auf den Buchstaben.",
        build(s) {
          const item = (art, first, rest, hint) => {
            const lbl = s.h("span", null, s.h("span", { class: "e1art " + art }, art), " ", s.h("span", { class: "e1hl" }, first), rest);
            const b = spk(s, `${art} ${first}${rest}`, { label: lbl, cls: "full later", de: hint });
            return b;
          };
          const A = [item("a", "r", "uler"), item("a", "p", "en"), item("a", "b", "ook"), item("a", "s", "chool bag")];
          const AN = [item("an", "a", "pple"), item("an", "e", "xercise book"), item("an", "o", "range"), item("an", "u", "mbrella")];
          const PRO = [item("a", "u", "niform", "„ju-niform“ – klingt wie j"), item("an", "h", "our", "h ist stumm: „auer“")];
          const colA = s.h("div", { class: "card stack", style: { gap: "10px" } }, s.h("p", { class: "h2 blue" }, "a + Konsonant-Laut"), ...A);
          const colAN = s.h("div", { class: "card stack later", style: { gap: "10px" } }, s.h("p", { class: "h2 violet" }, "an + Vokal-Laut"), ...AN);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "an"), " steht vor einem Vokal-", s.h("b", null, "Laut"), " (a, e, i, o, u gesprochen). Sonst ", s.h("b", null, "a"), ".");
          const pro = s.h("div", { class: "card stack later", style: { gap: "8px", padding: "12px 16px" } }, s.h("p", { class: "t" }, s.h("b", { class: "red" }, "Profi-Tipp:"), " Ohr vor Auge!"), ...PRO);
          const aLife = life(s, "Im Alltag",
            s.h("div", { class: "cols3", style: { gap: "12px" } },
              spk(s, "an orange juice and a sandwich", { cls: "sm full", de: "im Café" }),
              spk(s, "an elephant and a lion", { cls: "sm full", de: "im Zoo" }),
              spk(s, "an English book and a German book", { cls: "sm full", de: "in der Schule" })));
          aLife.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "16px" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr 1fr", gap: "18px", alignItems: "start" } }, colA, colAN, s.h("div", { class: "stack", style: { gap: "12px" } }, merk, pro)), aLife));
          s.show(colA, "left"); s.show(A, "left", 200); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(colAN, "right"); AN.forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i + 3), i * 120)); await s.show(AN, "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.zap(); await s.show(pro, "zoom"); await s.show(PRO, "pop"); s.show(aLife, "up"); s.say("A uniform, weil man ju hört. An hour, weil das h stumm ist."); });
        },
      },
      /* 12 ----------------------------------------------------------- */
      {
        title: "Classroom English",
        say: "Diese Sätze hörst und sagst du jede Englischstunde. Links spricht die Lehrerin, rechts sprichst du.",
        build(s) {
          const T = [["Open your books, please.", "Öffnet bitte eure Bücher."], ["Close your books.", "Schließt eure Bücher."], ["Listen!", "Hört zu!"], ["Look at the board.", "Schaut an die Tafel."], ["Work with a partner.", "Arbeitet mit einem Partner."]];
          const Y = [["Can you help me, please?", "Kannst du / Können Sie mir helfen?"], ["Sorry, I don't understand.", "Tut mir leid, ich verstehe das nicht."], ["What's „Lineal“ in English?", "Was heißt „Lineal“ auf Englisch?"], ["Can you say that again, please?", "Kannst du das bitte wiederholen?"], ["Can I go to the toilet, please?", "Darf ich bitte zur Toilette?"]];
          const tb = T.map(([t, d]) => spk(s, t, { de: d, cls: "sm full later" }));
          const yb = Y.map(([t, d], i) => spk(s, t, { de: d, cls: "sm full later", say: i === 2 ? "What's Lineal in English?" : t }));
          const cLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Nicht nur in der Schule: „Can you help me, please?“ im Urlaub am Bahnhof, „Sorry, I don't understand.“ im Feriencamp, „Listen!“ beim Sporttraining."));
          cLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "Befehlsform"), " (imperative) = Grundform des Verbs, ohne „you“: ", s.h("b", null, "Open!  Listen!"), "  Verneint: ", s.h("b", null, "Don't talk!"));
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { class: "cols", style: { gap: "22px" } },
              s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2" }, "👩‍🏫 Your teacher says:"), ...tb),
              s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2" }, "🙋 You say:"), ...yb)),
            merk, cLife));
          s.sound("classroom", { vol: 0.35, dur: 5 }); s.show(tb, "left");
          s.step(async () => { yb.forEach((_, i) => setTimeout(() => s.alive && s.sfx.pop(), i * 120)); await s.show(yb, "right"); s.say("Wenn du etwas nicht verstehst: Sorry, I don't understand."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(cLife, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------- */
      {
        title: "School subjects",
        say: "Schulfächer auf Englisch. Viele kennst du aus deinem eigenen Stundenplan.",
        build(s) {
          const SUB = [["🇬🇧", "English", "Englisch"], ["🇩🇪", "German", "Deutsch"], ["➗", "maths", "Mathe"], ["🧪", "science", "NaWi"], ["🎨", "art", "Kunst"], ["🎵", "music", "Musik"], ["⚽", "PE", "Sport"], ["🏰", "history", "Geschichte (GeWi)"], ["🌍", "geography", "Erdkunde (GeWi)"]];
          const cards = SUB.map(([e, w, d]) => {
            const b = spk(s, w, { de: d, cls: "sm full", say: w === "PE" ? "P. E." : w });
            return s.h("div", { class: "card stack later", style: { alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px 10px" } }, s.h("span", { style: { fontSize: "50px", lineHeight: "1" } }, e), b);
          });
          const sent = [
            ["Lukas", "My favourite subject is PE.", "Mein Lieblingsfach ist Sport."],
            ["Ruby", "I like art and music.", "Ich mag Kunst und Musik."],
            ["Julia", "I don't like maths.", "Ich mag Mathe nicht."],
          ].map(([who, t, d]) => spk(s, t, { who, de: d, cls: "sm full later", say: t.replace("PE", "P. E.") }));
          const sLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Auf Rubys timetable (Stundenplan) steht am Montag: maths, English, science und PE."));
          sLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Nur Sprachen schreibt man groß: ", s.h("b", null, "English, German, French"), ". Alle anderen klein: maths, art, music. ", s.h("b", null, "PE"), " = physical education.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", height: "100%", gap: "22px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: "12px" } }, cards),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...sent, merk, sLife)));
          s.sfx.whoosh(); cards.forEach((_, i) => setTimeout(() => s.alive && s.sfx.count(i), i * 70)); s.show(cards, "pop");
          s.step(async () => { s.sfx.pop(); await s.show(sent, "right"); });
          s.step(async () => { s.sound("pencil-write", { vol: 0.6 }); await s.show(merk, "up"); s.show(sLife, "up"); s.say("Nur Sprachen wie English und German schreibt man groß."); });
        },
      },
      /* 14 ----------------------------------------------------------- */
      {
        title: "A school day: London & Berlin",
        say: "So sieht ein Schultag bei Ruby in London aus – und so bei Lukas in Berlin. Was ist anders?",
        build(s) {
          const row = (t, en, de, say) => {
            const b = spk(s, en, { de, cls: "sm full", say: say || en });
            return s.h("div", { class: "e1row later", style: { gridTemplateColumns: "66px 1fr" } }, s.h("span", { class: "e1time" }, t), b);
          };
          const R = [["8:40", "Registration", "Anwesenheit beim form tutor"], ["9:00", "Assembly", "Versammlung in der Aula"], ["9:20", "Lessons: maths, English …", "Unterricht"], ["12:30", "Lunch", "school dinner oder packed lunch"], ["15:10", "Home time", "Schulschluss"]].map(a => row(...a));
          const L = [["8:00", "Art – a double lesson", "Kunst, 90 Minuten"], ["9:30", "Break", "große Pause"], ["10:45", "English", "Englisch"], ["12:15", "Lunch break", "Mittagspause"], ["14:25", "Home time", "Schulschluss"]].map(a => row(...a));
          const hdr = (who, place, col) => { const v = s.svg(54, 58); v.append(cast(s, who, 27, 57, { h: 56 })); return s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, v, s.h("p", { class: "h2", style: { color: col } }, place)); };
          const colR = s.h("div", { class: "card stack", style: { gap: "8px", padding: "10px 14px" } }, hdr("ruby", "Ruby · London, Year 7", "var(--red)"), ...R);
          const colL = s.h("div", { class: "card stack later", style: { gap: "8px", padding: "10px 14px" } }, hdr("lukas", "Lukas · Berlin, Klasse 5", "var(--unit)"), ...L);
          const F = [["👔 Uniform", "Über 90 % der Schulen in England haben eine Schuluniform."], ["🧑‍🏫 Form tutor", "Klassenlehrer/in. Morgens: registration."], ["🏠 Houses", "Schul-Teams, die house points sammeln – z. B. beim sports day."]];
          const facts = F.map(([h, t]) => s.h("div", { class: "life later", style: { padding: "10px 14px" } }, s.h("p", { class: "t", style: { fontWeight: 700 } }, h), s.h("p", { class: "small" }, t)));
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } },
            s.h("div", { class: "cols", style: { gap: "16px" } }, colR, colL),
            s.h("div", { class: "cols3", style: { gap: "12px" } }, facts)));
          s.show(colR, "left"); s.sound("school-bell", { vol: 0.4, dur: 2.5 });
          s.step(async () => { for (const [i, r] of R.entries()) { s.sfx.count(i); s.show(r, "left"); await s.wait(160); } await s.wait(300); });
          s.step(async () => { await s.show(colL, "right"); for (const [i, r] of L.entries()) { s.sfx.count(i); s.show(r, "right"); await s.wait(160); } await s.wait(300); s.say("In Berlin beginnt der Tag schon um acht Uhr."); });
          s.step(async () => { s.sfx.ding(); await s.show(facts, "up"); s.say("Typisch britisch: Schuluniform, form tutor und houses."); });
        },
      },
      /* 14b --------------------------------------------------------- */
      {
        title: "School uniform: in echt",
        say: "So sieht eine Schuluniform in England aus. Tippe auf die Sätze – du kennst die Farben schon!",
        build(s) {
          const ph = s.photo("school-uniform", { w: 560, h: 420, pos: "50% 60%", caption: "Schülerinnen in Schuluniform, Großbritannien" });
          const L = [["This is a school uniform.", "Das ist eine Schuluniform."], ["The jumpers are green.", "jumper = Pullover"], ["The skirts are green, too.", "skirt = Rock"], ["The socks are white.", "socks = Socken"], ["The shoes are black.", "shoes = Schuhe"]];
          const lines = L.map(([t, d]) => spk(s, t, { de: d, cls: "sm full later" }));
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Jede Schule hat ihre eigenen Farben. Ruby trägt eine blaue Uniform mit roter Krawatte (tie)."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ph, s.h("div", { class: "row" }, s.soundBtn("school-bell", "Schulklingel"))),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...lines, lf)));
          s.show(ph, "zoom"); s.sound("camera-shutter", { vol: 0.6 });
          s.step(async () => { s.sfx.pop(); await s.show(lines.slice(0, 3), "right"); });
          s.step(async () => { s.sfx.pop(); await s.show(lines.slice(3), "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------- */
      {
        title: "I am, you are, he is …",
        say: "Das wichtigste Verb: be, also sein. Es hat drei Formen: am, is und are. Und alles lässt sich kurz sagen.",
        build(s) {
          const PR = [["I", "am", "I'm", "#1d5bd0", "ich"], ["you", "are", "you're", "#138a5a", "du"], ["he", "is", "he's", "#ee7a1a", "er"], ["she", "is", "she's", "#dc3b2a", "sie"], ["it", "is", "it's", "#8a5a2b", "es"], ["we", "are", "we're", "#7b4fd6", "wir"], ["they", "are", "they're", "#0e7c8c", "sie (Mz.)"]];
          const shortEls = [];
          const rows = PR.map(([p, v, sh, c, de]) => {
            const sp = s.h("span", { class: "big later", style: { fontSize: "32px", color: c } }, sh);
            shortEls.push(sp);
            const b = s.h("button", { class: "e1spk sm", style: { padding: "8px 12px 8px 6px", width: "100%", display: "grid", gridTemplateColumns: "86px 70px 34px 1fr", alignItems: "center", gap: "8px" } },
              s.h("span", { class: "e1pron", style: { background: c } }, p), s.h("span", { style: { fontSize: "26px" } }, v), s.h("span", { class: "pencil" }, "→"), sp);
            b.addEventListener("click", () => { EN(s, `${p === "I" ? "I" : p} ${v}. ${sh}.`); s.sfx.pop(); bump(s, b, 0.05); });
            return s.h("div", { class: "e1row", style: { gridTemplateColumns: "1fr 92px" } }, b, s.h("span", { class: "small pencil" }, de));
          });
          const EXS = [
            ["Ruby is from London.", "She's from London.", 3],
            ["Biscuit is a dog.", "It's a dog.", 4],
            ["Lukas and Julia are from Berlin.", "They're from Berlin.", 6],
            ["Ruby and I are pen pals.", "We're pen pals.", 5],
          ].map(([a, b2, k]) => {
            const lb = s.h("span", null, a, s.h("br"), "→ ", s.h("span", { style: { color: PR[k][3] } }, b2));
            return spk(s, `${a} ${b2}`, { label: lb, cls: "sm full later" });
          });
          const bLife = life(s, "Im Alltag", s.h("p", { class: "small" }, "Am Telefon: „Hi, it's Lukas!“ · Beim Vorstellen: „We're from Berlin.“ · Über den Hund: „He's my dog!“ – bei Haustieren mit Namen sagt man oft he oder she."));
          bLife.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, s.h("b", null, "you"), " = du ", s.h("b", null, "und"), " ihr ", s.h("b", null, "und"), " Sie!  ", s.h("b", null, "it"), " = für Dinge und Tiere.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", height: "100%", gap: "24px" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...rows),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...EXS, merk, bLife)));
          s.show(rows, "left"); s.sfx.whoosh();
          s.step(async () => { for (const [i, e] of shortEls.entries()) { s.sfx.snap(); s.show(e, "zoom"); await s.wait(170); } await s.wait(400); s.say("I am wird zu I'm. Der Apostroph ersetzt den fehlenden Buchstaben."); });
          s.step(async () => { s.sfx.pop(); await s.show(EXS, "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.show(bLife, "up"); });
        },
      },
      /* 16 ----------------------------------------------------------- */
      {
        title: "In real life: Hello, London!",
        say: "Jetzt wird es echt: Lukas schreibt Ruby seine erste Nachricht, besucht ihre Schule und bekommt ein Namensschild.",
        build(s) {
          const tabs = {}, panels = {};
          // panel 1: pen pal message
          const mailLines = [
            "Hi Ruby,",
            "My name is Lukas. I'm 10 years old and I'm from Berlin.",
            "My sister is Julia. She's 8. Her cat is Mo.",
            "My school is big. My favourite subject is PE.",
            "How are you? Please write soon!",
            "Bye, Lukas",
          ];
          const mb = mailLines.map(t => spk(s, t, { cls: "sm full", say: t.replace("PE", "P. E.") }));
          const mPlay = s.h("button", { class: "btn solid" }, "▶ Ganze Nachricht vorlesen");
          mPlay.addEventListener("click", () => { s.sfx.click(); playSeq(s, mb.map((b, i) => [b, mailLines[i].replace("PE", "P. E.")])); });
          panels.mail = s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 330px", gap: "20px" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "e1mail" }, s.h("div", { class: "hd" }, "From: Lukas  ·  To: Ruby  ·  Subject: Hello from Berlin!"), ...mb), s.h("div", { class: "row" }, mPlay)),
            s.h("div", { class: "stack" }, life(s, "Im Alltag", s.h("p", { class: "small" }, "Eine erste Nachricht an einen pen pal: Gruß, Name, Alter, Wohnort, eine Frage – und ein Abschied.")),
              s.h("div", { class: "merk", style: { fontSize: "21px" } }, "Anfang: ", s.h("b", null, "Hi / Dear …,"), s.h("br"), "Ende: ", s.h("b", null, "Bye / Best wishes"))));
          // panel 2: school visit
          const svs = s.svg(360, 440);
          svs.append(s.el("rect", { x: 0, y: 410, width: 360, height: 10, rx: 5, fill: "#c8d3de" }), person(s, { x: 284, y: 415, h: 300, skin: "#f0c8a0", hair: "#b5532a", style: "bun", shirt: "#7b4fd6", skirt: "#3a4560" }), cast(s, "lukas", 62, 415, { h: 230, badge: true, wave: true }), cast(s, "ruby", 168, 415, { h: 250 }));
          const visL = [
            ["Lukas", "Good morning! I'm Lukas from Berlin.", ""],
            ["Miss Hill", "Hello, Lukas! Welcome to our school. I'm Ruby's form tutor.", "r"],
            ["Lukas", "Nice to meet you, Miss Hill.", ""],
            ["Ruby", "Come on, Lukas! Assembly is at nine.", "r"],
          ];
          const vis = visL.map(([who, t, side]) => spk(s, t, { who, cls: "bub sm " + side }));
          const vPlay = s.h("button", { class: "btn solid" }, "▶ Ganzes Gespräch abspielen");
          vPlay.addEventListener("click", () => { s.sfx.click(); playSeq(s, vis.map((b, i) => [b, visL[i][1]])); });
          panels.visit = s.h("div", { class: "cols", style: { gridTemplateColumns: "360px 1fr", gap: "20px" } }, svs,
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...vis, s.h("div", { class: "row" }, vPlay),
              s.h("div", { class: "life", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "In britischen Schulen sagt man zu Lehrerinnen oft „Miss“ und zu Lehrern „Sir“."))));
          // panel 3: name badge (pick who wears it)
          const BADGE = { lukas: ["Lukas", "I'm from Berlin. I'm 10.", "Visitor · Year 7"], ruby: ["Ruby", "I'm from London. I'm 11.", "Pupil · Year 7"], julia: ["Julia", "I'm from Berlin. I'm 8.", "Visitor · Year 3"] };
          let bw = "lukas";
          const tName = s.el("text", { x: 220, y: 196, "text-anchor": "middle", "font-size": 76, fill: "#1d5bd0", style: { fontFamily: "var(--f-hand)", fontWeight: 700 }, text: "Lukas" });
          const tFrom = s.el("text", { x: 220, y: 262, "text-anchor": "middle", "font-size": 26, fill: "#1b2740", text: BADGE.lukas[1] });
          const tRole = s.el("text", { x: 220, y: 300, "text-anchor": "middle", "font-size": 22, fill: "#5d6678", text: BADGE.lukas[2] });
          const bd = s.svg(440, 330);
          const badgeG = s.el("g", { class: "e1g", style: { transformOrigin: "50% 50%" } },
            s.el("rect", { x: 10, y: 10, width: 420, height: 310, rx: 22, fill: "#fff", stroke: "#dc3b2a", "stroke-width": 6 }),
            s.el("rect", { x: 10, y: 10, width: 420, height: 92, rx: 22, fill: "#dc3b2a" }), s.el("rect", { x: 10, y: 70, width: 420, height: 32, fill: "#dc3b2a" }),
            s.el("text", { x: 220, y: 56, "text-anchor": "middle", "font-size": 40, "font-weight": 800, fill: "#fff", text: "HELLO" }),
            s.el("text", { x: 220, y: 90, "text-anchor": "middle", "font-size": 22, fill: "#fff", text: "my name is" }), tName, tFrom, tRole);
          bd.append(badgeG);
          const bl = [
            spk(s, "", { label: s.h("span", null, "Hello, my name is ", s.h("span", { class: "bn" }, "Lukas"), "."), de: "Hallo, ich heiße …", cls: "sm full", say: () => `Hello, my name is ${BADGE[bw][0]}.` }),
            spk(s, "", { label: s.h("span", { class: "bf" }, BADGE.lukas[1]), de: "Woher? Wie alt?", cls: "sm full", say: () => BADGE[bw][1] }),
            spk(s, "", { label: s.h("span", { class: "br" }, BADGE.lukas[2]), de: "Visitor = Besucher/in · Pupil = Schüler/in", cls: "sm full", say: () => BADGE[bw][2].replace("·", ".") }),
          ];
          const who = {};
          const setBadge = async k => {
            bw = k; Object.entries(who).forEach(([kk, b]) => b.classList.toggle("on", kk === k));
            const [n, f, r] = BADGE[k];
            s.sfx.scribble();
            await s.tween({ dur: 160, update: v => badgeG.style.transform = `scaleX(${1 - v})` });
            tName.textContent = n; tFrom.textContent = f; tRole.textContent = r;
            bl[0].querySelector(".bn").textContent = n; bl[1].querySelector(".bf").textContent = f; bl[2].querySelector(".br").textContent = r;
            await s.tween({ dur: 260, ease: "back", update: v => badgeG.style.transform = `scaleX(${v})` });
            badgeG.style.transform = "";
          };
          ["lukas", "ruby", "julia"].forEach(k => { who[k] = s.h("button", { class: "e1tab" + (k === "lukas" ? " on" : "") }, BADGE[k][0]); who[k].addEventListener("click", () => setBadge(k)); });
          panels.badge = s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", gap: "24px", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, bd, s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { class: "t pencil" }, "Wer?"), ...Object.values(who))),
            s.h("div", { class: "stack", style: { gap: "10px" } }, ...bl, life(s, "Im Alltag", s.h("p", { class: "small" }, "Namensschilder gibt es beim Schulbesuch, im Feriencamp oder beim Sportturnier."))));
          const order = [["mail", "✉️ Pen pal message"], ["visit", "🏫 School visit"], ["badge", "🏷️ Name badge"]];
          const area = s.h("div", { style: { flex: "1", minHeight: 0 } });
          const showTab = async (k, anim = true) => {
            Object.entries(tabs).forEach(([kk, t]) => t.classList.toggle("on", kk === k));
            Object.entries(panels).forEach(([kk, p]) => { p.style.display = kk === k ? "" : "none"; });
            if (anim) { s.sfx.whoosh(); await s.show(panels[k], "right"); }
          };
          order.forEach(([k, l]) => { tabs[k] = s.h("button", { class: "e1tab" }, l); tabs[k].addEventListener("click", () => showTab(k)); });
          Object.values(panels).forEach(p => area.append(p));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "e1tabs" }, order.map(([k]) => tabs[k])), area));
          showTab("mail", false); s.show(panels.mail, "up"); s.sound("keyboard", { vol: 0.5, dur: 2 });
          s.step(async () => { s.sound("school-bell", { vol: 0.4, dur: 2.5 }); await showTab("visit"); });
          s.step(async () => { await showTab("badge"); s.confetti(700, 300, 60); s.sound("applause", { vol: 0.45, dur: 3 }); });
        },
      },
    ],
  });
})();
