/* Kapitel 3 – Zeitformen (Berliner Rahmenlehrplan Deutsch, Klasse 5) */
(() => {
  "use strict";
  const U = "#7b4fd6", SOFT = "#ece5fb", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    ORANGE = "#ee7a1a", PENCIL = "#5d6678", TEAL = "#0e7c86", BROWN = "#9a5b1f";
  // one colour per Zeitform – used everywhere in this chapter
  const TC = { plusq: BROWN, prat: BLUE, perf: TEAL, pras: ORANGE, fut: GREEN };

  const CSS = `
.z3-mark{font-weight:700;background-image:linear-gradient(#ffe97a,#ffe97a);background-repeat:no-repeat;background-size:0% 70%;background-position:0 85%;transition:background-size .7s ease;border-radius:4px;padding:0 2px}
.z3-mark.on{background-size:100% 70%}
.z3-w{display:inline-flex;align-items:center;justify-content:center;padding:6px 14px;border-radius:12px;background:#fff;border:2px solid var(--line);font:700 34px/1.15 var(--f-display);white-space:nowrap}
.z3-kl{display:inline-flex;gap:12px;padding:0 10px 14px;border:4px solid transparent;border-top:0;border-radius:0 0 16px 16px;transition:border-color .5s}
.z3-kl.on{border-color:${U}}
.z3-tab{border-collapse:collapse;width:100%}
.z3-tab th{font:700 19px/1 var(--f-body);color:var(--pencil);text-align:left;padding:6px 10px;border-bottom:3px solid var(--ink)}
.z3-tab td{font:600 22px/1.15 var(--f-body);padding:7px 10px;border-bottom:2px solid var(--line);background:#fff;white-space:nowrap}
.z3-tab td.pat{font:700 19px/1.1 var(--f-display);text-align:center;color:#fff;border-bottom:3px solid #fff}
.z3-blk{display:inline-flex;align-items:center;justify-content:center;height:54px;padding:0 12px;border-radius:10px;font:700 28px/1 var(--f-display);color:#fff;white-space:nowrap}
.z3-bub{max-width:330px;padding:9px 14px;border-radius:16px;font-size:20px;line-height:1.3;box-shadow:0 1px 2px rgba(0,0,0,.15)}
.z3-dots span{display:inline-block;width:10px;height:10px;margin:0 3px;border-radius:50%;background:#9aa3b2;animation:z3dot 1s infinite}
.z3-dots span:nth-child(2){animation-delay:.15s}.z3-dots span:nth-child(3){animation-delay:.3s}
@keyframes z3dot{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
`;
  if (!document.getElementById("z3css")) { const st = document.createElement("style"); st.id = "z3css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------- helpers ---------- */
  /** rich text: [x] = highlighted word in colour c1, {x} = highlighted word in colour c2 */
  function rt(s, str, c1 = BLUE, c2 = RED) {
    const out = []; const re = /\[([^\]]+)\]|\{([^}]+)\}/g; let i = 0, m;
    while ((m = re.exec(str))) {
      if (m.index > i) out.push(str.slice(i, m.index));
      out.push(s.h("span", { class: "z3-mark", style: { color: m[1] != null ? c1 : c2 } }, m[1] != null ? m[1] : m[2]));
      i = re.lastIndex;
    }
    if (i < str.length) out.push(str.slice(i));
    return out;
  }
  async function marksOn(s, root, gap = 160) {
    const ms = [...root.querySelectorAll(".z3-mark")];
    for (const m of ms) { if (!s.alive) return; m.classList.add("on"); s.sfx.scribble(); await s.wait(gap); }
  }
  const T = (s, x, y, text, o = {}) => { const e = s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: INK, text }, o)); if (o.fill) e.style.fill = o.fill; if (o["font-size"]) e.style.fontSize = o["font-size"] + "px"; return e; };
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const merk = (s, ...kids) => s.h("div", { class: "merk later" }, ...kids);
  const B = (t, c) => ({ t, c });

  /** big timeline (Vergangenheit – jetzt – Zukunft) */
  function bigTL(s, w, h, o = {}) {
    const y = o.y || Math.round(h / 2), now = o.now || Math.round(w / 2), band = o.band || 40, x0 = 14, x1 = w - 14;
    const svg = s.svg(w, h);
    const p = {};
    p.past = s.el("rect", { x: x0, y: y - band, width: now - x0, height: band * 2, rx: 16, fill: "#e6ebfa", class: "later" });
    p.fut = s.el("rect", { x: now, y: y - band, width: x1 - now - 4, height: band * 2, rx: 16, fill: "#e0f2e7", class: "later" });
    p.line = s.el("line", { x1: x0, y1: y, x2: x1 - 18, y2: y, stroke: INK, "stroke-width": 5, "stroke-linecap": "round", class: "later" });
    p.head = s.el("polygon", { points: `${x1},${y} ${x1 - 26},${y - 14} ${x1 - 26},${y + 14}`, fill: INK, class: "later" });
    p.nowLine = s.el("line", { x1: now, y1: y - band - 6, x2: now, y2: y + band + 6, stroke: RED, "stroke-width": 5, "stroke-linecap": "round", class: "later" });
    p.nowDot = s.el("circle", { cx: now, cy: y, r: 12, fill: RED, class: "later" });
    p.lblPast = T(s, (x0 + now) / 2, y - band - 14, "Vergangenheit", { fill: BLUE, "font-size": 26, class: "later" });
    p.lblNow = T(s, now, y - band - 14, "jetzt", { fill: RED, "font-size": 26, class: "later" });
    p.lblFut = T(s, (now + x1) / 2, y - band - 14, "Zukunft", { fill: GREEN, "font-size": 26, class: "later" });
    svg.append(p.past, p.fut, p.line, p.head, p.nowLine, p.nowDot, p.lblPast, p.lblNow, p.lblFut);
    return { svg, p, y, now, band, x0, x1 };
  }

  /** small recurring timeline strip with a marker for one Zeitform */
  const MINIPOS = { plusq: 170, prat: 420, perf: 420, pras: 700, fut: 950 };
  const MININAME = { plusq: "Plusquamperfekt", prat: "Präteritum", perf: "Perfekt", pras: "Präsens", fut: "Futur I" };
  function miniTL(s, key) {
    const w = 1100, h = 112, y = 58, now = 700;
    const svg = s.svg(w, h);
    svg.append(
      s.el("rect", { x: 14, y: y - 16, width: now - 14, height: 32, rx: 10, fill: "#e6ebfa" }),
      s.el("rect", { x: now, y: y - 16, width: 1068 - now, height: 32, rx: 10, fill: "#e0f2e7" }),
      s.el("line", { x1: 14, y1: y, x2: 1062, y2: y, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }),
      s.el("polygon", { points: `1086,${y} 1062,${y - 12} 1062,${y + 12}`, fill: INK }),
      s.el("line", { x1: now, y1: y - 22, x2: now, y2: y + 22, stroke: RED, "stroke-width": 4 }),
      T(s, 330, 24, "Vergangenheit", { fill: BLUE, "font-size": 20 }), T(s, now, 24, "jetzt", { fill: RED, "font-size": 20 }), T(s, 900, 24, "Zukunft", { fill: GREEN, "font-size": 20 }));
    const c = TC[key], X = MINIPOS[key];
    const mk = s.el("circle", { cx: now, cy: y, r: 15, fill: c, stroke: "#fff", "stroke-width": 4 });
    const lbl = T(s, X, 102, MININAME[key], { fill: c, "font-size": 22, class: "later" });
    svg.append(mk, lbl);
    const run = async () => {
      s.sfx.whoosh();
      await s.tween({ from: now, to: X, dur: 900, ease: "back", update: v => mk.setAttribute("cx", v) });
      s.sfx.pop(); s.show(lbl, "pop");
    };
    return { svg, run };
  }

  Deck.unit({
    id: "u3", num: 3, title: "Zeitformen", color: U, soft: SOFT,
    subtitle: "Gestern, heute, morgen – das Verb verrät es",
    blurb: "Präsens, Präteritum, Perfekt, Plusquamperfekt und Futur.",
    goals: ["Auf der Zeitleiste zeigen, wann etwas passiert", "Präsens, Präteritum und Perfekt bilden", "Starke Verben und ihre Stammformen kennen", "Plusquamperfekt und Futur verstehen", "Wissen, wann man welche Zeitform benutzt"],
    icon(svg, el) {
      svg.append(el("line", { x1: 6, y1: 40, x2: 58, y2: 40, stroke: U, "stroke-width": 5, "stroke-linecap": "round" }),
        el("polygon", { points: "66,40 54,32 54,48", fill: U }),
        el("circle", { cx: 18, cy: 40, r: 7, fill: BLUE }), el("circle", { cx: 36, cy: 40, r: 9, fill: RED }), el("circle", { cx: 54, cy: 40, r: 7, fill: GREEN }),
        el("path", { d: "M18,28 Q36,8 54,28", fill: "none", stroke: U, "stroke-width": 3, "stroke-dasharray": "5 5" }));
    },
    slides: [
      /* 1 ─────────────── Zeitleiste */
      {
        title: "Die Zeitleiste",
        say: "Alles, was passiert, hat einen Platz auf der Zeitleiste. Links ist die Vergangenheit, in der Mitte das Jetzt, rechts die Zukunft.",
        build(s) {
          const tl = bigTL(s, 1100, 250, { now: 550, y: 118, band: 46 });
          const pw = [[100, "früher"], [270, "letzte Woche"], [440, "gestern"]].map(([x, t]) => T(s, x, 214, t, { class: "hlbl later", "font-weight": 600, "font-size": 30, fill: BLUE }));
          const fw = [[670, "morgen"], [830, "nächste Woche"], [995, "in den Ferien"]].map(([x, t]) => T(s, x, 214, t, { class: "hlbl later", "font-weight": 600, "font-size": 30, fill: GREEN }));
          tl.svg.append(...pw, ...fw);
          const clock = s.el("circle", { cx: 14, cy: tl.y, r: 9, fill: U });
          tl.svg.append(clock);
          const cards = [
            ex(s, "Vergangenheit", s.h("p", { class: "t" }, rt(s, "Gestern [spielte] Leon Fußball. ⚽"))),
            ex(s, "Gegenwart", s.h("p", { class: "t" }, rt(s, "Jetzt [liest] Leon ein Buch. 📖", ORANGE))),
            ex(s, "Zukunft", s.h("p", { class: "t" }, rt(s, "Morgen [wird] Leon [schwimmen].", GREEN))),
          ];
          cards.forEach(c => c.classList.add("later"));
          const m = merk(s, "Das ", s.h("b", null, "Verb"), " verrät, ", s.h("b", null, "wann"), " etwas passiert. Seine Formen heißen ", s.h("span", { class: "hl" }, "Zeitformen"), " (Fachwort: Tempus).");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, tl.svg, s.h("div", { class: "cols3" }, cards), m));
          (async () => {
            s.sfx.whoosh(); await s.show([tl.p.line], "draw"); s.show(tl.p.head, "pop");
            await s.tween({ from: 14, to: 550, dur: 900, ease: "out", update: v => clock.setAttribute("cx", v) });
            s.sfx.ding(); s.show([tl.p.nowLine, tl.p.nowDot], "pop"); s.show(tl.p.lblNow, "bounce");
          })();
          s.step(async () => { s.sfx.swoosh(); s.show(tl.p.past, "fade"); s.show(tl.p.lblPast, "left"); for (let i = 2; i >= 0; i--) { s.sfx.count(2 - i); await s.show(pw[i], "right", 0); } });
          s.step(async () => { s.sfx.swoosh(); s.show(tl.p.fut, "fade"); s.show(tl.p.lblFut, "right"); for (let i = 0; i < 3; i++) { s.sfx.count(i + 3); await s.show(fw[i], "left", 0); } });
          s.preload("ball-kick"); s.preload("page-turn-1"); s.preload("splash");
          const CS = [["ball-kick", { vol: 0.7 }], ["page-turn-1", { vol: 0.8 }], ["splash", { vol: 0.5 }]];
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sound(...CS[i]); await s.show(cards[i], "up"); marksOn(s, cards[i]); await s.wait(250); } s.say("Das Verb zeigt die Zeit. Spielte, liest, wird schwimmen."); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ─────────────── Präsens */
      {
        title: "Präsens: jetzt und immer",
        say: "Das Präsens ist die Gegenwart. Du brauchst es für jetzt, für Dinge, die immer wieder passieren, und sogar für die Zukunft.",
        build(s) {
          const tl = bigTL(s, 1100, 200, { now: 550, y: 96, band: 36 });
          Object.values(tl.p).forEach(e => e.classList.remove("later"));
          const pulse = s.el("circle", { cx: 550, cy: 96, r: 26, fill: "none", stroke: ORANGE, "stroke-width": 5, class: "later" });
          const habit = [130, 230, 330, 430, 660, 750, 960].map(x => s.el("circle", { cx: x, cy: 96, r: 10, fill: ORANGE, class: "later" }));
          const habitLbl = T(s, 280, 168, "jeden Morgen", { class: "hlbl later", "font-weight": 600, "font-size": 30, fill: ORANGE });
          const arc = s.el("path", { d: "M550,90 Q700,20 850,86", fill: "none", stroke: ORANGE, "stroke-width": 5, "stroke-dasharray": "10 8", class: "later" });
          const arcDot = s.el("circle", { cx: 850, cy: 96, r: 13, fill: ORANGE, class: "later" });
          const morgen = T(s, 850, 168, "morgen", { class: "hlbl later", "font-weight": 600, "font-size": 30, fill: ORANGE });
          tl.svg.append(pulse, ...habit, habitLbl, arc, arcDot, morgen);
          const cards = [
            ex(s, "1 · Jetzt gerade", s.photo("geige-foto", { w: "100%", h: 130 }), s.h("p", { class: "t", style: { marginTop: "8px" } }, rt(s, "Leon [übt] gerade Geige.", ORANGE))),
            ex(s, "2 · Immer wieder", s.photo("u8", { w: "100%", h: 130, pos: "50% 45%" }), s.h("p", { class: "t", style: { marginTop: "8px" } }, rt(s, "Jeden Morgen [fährt] Leon mit der U-Bahn.", ORANGE))),
            ex(s, "3 · Zukunft + Zeitwort", s.photo("auto", { w: "100%", h: 130, pos: "50% 60%" }), s.h("p", { class: "t", style: { marginTop: "8px" } }, rt(s, "Morgen [fahren] wir zu Oma.", ORANGE))),
          ];
          cards.forEach(c => c.classList.add("later"));
          const m = merk(s, s.h("b", null, "Präsens: "), "ich spiel", s.h("b", { class: "red" }, "e"), ", du spiel", s.h("b", { class: "red" }, "st"), ", er/sie/es spiel", s.h("b", { class: "red" }, "t"), ", wir spiel", s.h("b", { class: "red" }, "en"), ", ihr spiel", s.h("b", { class: "red" }, "t"), ", sie spiel", s.h("b", { class: "red" }, "en"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "20px" } }, tl.svg, s.h("div", { class: "cols3" }, cards), m));
          s.sfx.pop();
          s.step(async () => {
            s.sound("geige", { vol: 0.5, dur: 2.5, fade: 0.6 }); s.show(pulse, "zoom"); await s.show(cards[0], "up"); marksOn(s, cards[0]);
            s.tween({ from: 0, to: 6, dur: 3000, ease: "linear", update: v => pulse.setAttribute("r", 22 + 6 * Math.abs(Math.sin(v * Math.PI))) });
          });
          s.step(async () => {
            for (let i = 0; i < habit.length; i++) { s.sfx.tick(); s.show(habit[i], "pop"); await s.wait(110); }
            s.sound("ubahn-train", { vol: 0.45, dur: 2.5, fade: 0.6 }); s.show(habitLbl, "fade"); await s.show(cards[1], "up"); marksOn(s, cards[1]);
          });
          s.step(async () => { s.sound("autohupe", { vol: 0.5 }); await s.show(arc, "draw"); s.show(arcDot, "pop"); s.show(morgen, "fade"); await s.show(cards[2], "up"); marksOn(s, cards[2]); s.say("Mit einem Zeitwort wie morgen zeigt das Präsens sogar die Zukunft."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(m, "up"); });
        },
      },
      /* 3 ─────────────── Fußball live */
      {
        title: "Im Alltag: Fußball live",
        say: "Sportreporter sprechen im Präsens. So fühlt es sich an, als wärst du live dabei.",
        build(s) {
          const svg = s.svg(540, 380);
          svg.append(
            s.el("rect", { x: 4, y: 4, width: 532, height: 372, rx: 16, fill: "#3f9b4a" }),
            ...[0, 1, 2, 3, 4, 5].map(i => s.el("rect", { x: 20 + i * 84, y: 20, width: 42, height: 340, fill: "#46a652" })),
            s.el("rect", { x: 20, y: 20, width: 500, height: 340, fill: "none", stroke: "#fff", "stroke-width": 4 }),
            s.el("line", { x1: 270, y1: 20, x2: 270, y2: 360, stroke: "#fff", "stroke-width": 4 }),
            s.el("circle", { cx: 270, cy: 190, r: 50, fill: "none", stroke: "#fff", "stroke-width": 4 }),
            s.el("rect", { x: 440, y: 110, width: 80, height: 160, fill: "none", stroke: "#fff", "stroke-width": 4 }),
            s.el("rect", { x: 20, y: 110, width: 80, height: 160, fill: "none", stroke: "#fff", "stroke-width": 4 }));
          const net = s.el("rect", { x: 520, y: 150, width: 14, height: 80, fill: "#fff", opacity: .85 });
          svg.append(net);
          const player = (x, y, col, n) => { const g = s.el("g", { transform: `translate(${x},${y})` }); g.append(s.el("circle", { r: 20, fill: col, stroke: "#fff", "stroke-width": 3 }), s.el("text", { y: 7, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#fff", text: n })); svg.append(g); return { g, x, y, put(nx, ny) { this.x = nx; this.y = ny; g.setAttribute("transform", `translate(${nx},${ny})`); } }; };
          const opp1 = player(300, 120, RED, "4"), opp2 = player(340, 250, RED, "5"), keeper = player(495, 190, "#222", "1");
          const ten = player(150, 210, BLUE, "10"), mia = player(380, 80, BLUE, "7");
          const ball = s.el("circle", { cx: 175, cy: 222, r: 9, fill: "#fff", stroke: INK, "stroke-width": 2 });
          svg.append(ball);
          const tor = T(s, 270, 345, "TOR!", { "font-size": 44, "font-weight": 800, fill: "#ffd94a", stroke: INK, "stroke-width": 1.5, class: "later" });
          svg.append(tor);
          const setBall = (x, y) => { ball.setAttribute("cx", x); ball.setAttribute("cy", y); };
          const lines = [
            "Anpfiff! Die Nummer 10 [hat] den Ball.",
            "Sie [läuft] an zwei Gegnern vorbei.",
            "Jetzt [passt] sie zu Mia.",
            "Mia [schießt] … Tor! Alle [jubeln]!",
          ].map((t, i) => s.h("p", { class: "t" + (i ? " later" : "") }, rt(s, t, ORANGE)));
          const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "hand", style: { margin: 0, color: RED } }, "🎙 Der Reporter sagt:"), ...lines);
          const lf = life(s, s.photo("olympiastadion", { w: "100%", h: 150, caption: "Live im Stadion" }), s.h("p", { class: "small", style: { marginTop: "8px" } }, "Live-Reporter, Liveticker im Handy, Spielberichte im Radio: Sie erzählen im Präsens. So bist du mittendrin."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, card, lf)));
          s.show(svg, "zoom"); s.sound("whistle", { vol: 0.6 }); marksOn(s, lines[0]);
          s.step(async () => {
            s.show(lines[1], "left"); marksOn(s, lines[1]); s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 1200, update: v => { const x = 150 + 180 * v, y = 210 - 20 * Math.sin(v * Math.PI * 2); ten.put(x, y); setBall(x + 25, y + 12); } });
          });
          s.step(async () => {
            s.show(lines[2], "left"); marksOn(s, lines[2]); s.sound("ball-kick", { vol: 0.6 });
            const x0 = 355, y0 = 222; await s.tween({ dur: 650, update: v => setBall(x0 + (400 - x0) * v, y0 + (100 - y0) * v) });
            s.sfx.snap();
          });
          s.step(async () => {
            s.show(lines[3], "left"); marksOn(s, lines[3]); s.sound("ball-kick", { vol: 0.8 });
            await s.tween({ dur: 500, ease: "in", update: v => setBall(400 + (528 - 400) * v, 100 + (175 - 100) * v) });
            s.tween({ dur: 400, update: v => net.setAttribute("x", 520 + 6 * Math.sin(v * Math.PI * 4)) });
            s.sound("crowd-cheer", { vol: 0.55, dur: 3, fade: 0.8 }); s.show(tor, "zoom"); s.confetti(330, 280, 90);
          });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 4 ─────────────── Präteritum schwach */
      {
        title: "Präteritum: mit -te",
        say: "Das Präteritum erzählt von der Vergangenheit. Bei regelmäßigen Verben hängst du einfach te an den Stamm.",
        build(s) {
          const mini = miniTL(s, "prat");
          const words = [["spielen", "spiel"], ["machen", "mach"], ["lachen", "lach"], ["kaufen", "kauf"]];
          const rows = words.map(([inf, st]) => {
            const a = s.h("span", { class: "z3-w", style: { minWidth: "170px" } }, inf);
            const arr = s.h("span", { class: "big", style: { color: PENCIL } }, "→");
            const stem = s.h("span", { class: "z3-blk", style: { background: BLUE } }, st);
            const te = s.h("span", { class: "z3-blk", style: { background: RED } }, "te");
            const r = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "12px" } }, a, arr, s.h("span", { style: { display: "inline-flex", gap: "3px" } }, stem, te));
            r.parts = { a, arr, stem, te }; return r;
          });
          const conj = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "auto auto", gap: "6px 18px", alignContent: "start", fontSize: "24px" } },
            ...[["ich", "spiel", "te"], ["du", "spiel", "test"], ["er/sie/es", "spiel", "te"], ["wir", "spiel", "ten"], ["ihr", "spiel", "tet"], ["sie", "spiel", "ten"]].flatMap(([p, st, e]) => [
              s.h("span", { style: { color: PENCIL } }, p), s.h("span", null, st, s.h("b", { class: "red" }, e))]));
          const m = merk(s, "Regelmäßige (", s.h("b", null, "schwache"), ") Verben: ", s.h("b", { class: "blue" }, "Stamm"), " + ", s.h("b", { class: "red" }, "te"), ". Der Stamm bleibt gleich: ", s.h("i", null, "Ich kaufte ein Eis. 🍦"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, mini.svg,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.25fr 1fr", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "12px" } }, rows), conj), m));
          mini.run();
          const build = async (r, slow) => {
            r.classList.remove("later");
            const { a, arr, stem, te } = r.parts;
            s.sfx.pop(); await s.show(a, "pop"); s.show(arr, "left");
            s.sfx.swoosh(); await s.show(stem, "left", slow ? 200 : 0);
            s.sfx.snap(); await s.show(te, "right");
          };
          s.step(async () => { await build(rows[0], true); s.say("spielen, spielte"); });
          s.step(async () => { for (let i = 1; i < 4; i++) await build(rows[i]); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(conj, "right"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 5 ─────────────── Präteritum stark */
      {
        title: "Starke Verben: neuer Vokal",
        say: "Starke Verben bekommen im Präteritum kein te. Dafür ändert sich der Vokal im Stamm. Das nennt man Ablaut.",
        build(s) {
          const mini = miniTL(s, "prat");
          // [infinitive parts, präteritum parts] – middle part = vowel
          const data = [[["g", "e", "hen"], ["g", "i", "ng"]], [["f", "i", "nden"], ["f", "a", "nd"]], [["s", "i", "ngen"], ["s", "a", "ng"]], [["l", "au", "fen"], ["l", "ie", "f"]], [["schr", "ei", "ben"], ["schr", "ie", "b"]]];
          const word = (parts, col) => s.h("span", null, parts[0], s.h("b", { style: { color: col } }, parts[1]), parts[2]);
          const rows = data.map(([inf, pr]) => {
            const flip = s.h("span", { class: "z3-w", style: { minWidth: "170px", transition: "none" } }, word(inf, BLUE));
            const r = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "14px" } }, s.h("span", { class: "z3-w", style: { minWidth: "200px" } }, word(inf, BLUE)), s.h("span", { class: "big", style: { color: PENCIL } }, "→"), flip);
            r.flip = flip; r.pr = pr; return r;
          });
          const flipTo = async r => {
            r.classList.remove("later"); s.show(r, "left");
            await s.wait(350);
            await s.tween({ from: 1, to: 0, dur: 220, update: v => { r.flip.style.transform = `scaleY(${v})`; } });
            r.flip.textContent = ""; r.flip.append(word(r.pr, RED)); r.flip.style.borderColor = RED;
            s.sfx.boing();
            await s.tween({ from: 0, to: 1, dur: 260, ease: "back", update: v => { r.flip.style.transform = `scaleY(${v})`; } });
          };
          const nope = s.h("div", { class: "card later", style: { textAlign: "center" } },
            s.h("p", { class: "small pencil" }, "Nicht so:"),
            s.h("p", { class: "big", style: { textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: "5px", color: PENCIL } }, "gehte"),
            s.h("p", { class: "small", style: { marginTop: "6px" } }, "ich ging, du gingst, er ging, wir gingen"));
          const m = merk(s, s.h("b", null, "Starke Verben"), " ändern im Präteritum ihren ", s.h("b", { class: "red" }, "Stammvokal"), " (Ablaut) – und bekommen ", s.h("b", null, "kein -te"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, mini.svg,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.2fr 1fr", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, rows), s.h("div", { class: "stack" }, nope, m))));
          mini.run();
          s.step(async () => { await flipTo(rows[0]); s.say("gehen, ging"); });
          s.step(async () => { for (let i = 1; i < rows.length; i++) await flipTo(rows[i]); });
          s.step(async () => { s.sfx.zap(); await s.show(nope, "pop"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ─────────────── Geschichten im Präteritum */
      {
        title: "Im Alltag: Geschichten",
        say: "Wer eine Geschichte aufschreibt, nimmt meistens das Präteritum. Im Tagebuch, in der Feriengeschichte und im Märchen.",
        build(s) {
          const legend = s.h("div", { class: "row", style: { justifyContent: "center" } },
            s.h("span", { class: "chip", style: { color: BLUE } }, "blau = schwach (mit -te)"), s.h("span", { class: "chip", style: { color: RED } }, "rot = stark (neuer Vokal)"));
          const mk = (label, icon, txt, foot) => {
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } },
              s.h("span", { class: "exlabel" }, label),
              icon,
              s.h("p", { class: "small", style: { fontSize: "21px" } }, rt(s, txt, BLUE, RED)),
              foot ? s.h("p", { class: "small pencil", style: { marginTop: "auto" } }, foot) : null);
            return c;
          };
          const cards = [
            mk("Tagebuch", s.photo("tagebuch", { w: "100%", h: 130 }), "Liebes Tagebuch! Heute {war} ein super Tag. In der Musikstunde [spielten] wir zum ersten Mal zusammen. Danach {aß} ich mit Ole Pizza."),
            mk("Feriengeschichte", s.photo("ostsee-strand", { w: "100%", h: 130, caption: "Ostsee" }), "Im Sommer {fuhren} wir an die Ostsee. Wir [bauten] eine riesige Sandburg. Abends {sahen} wir, wie die Sonne im Meer [versank]."),
            mk("Märchen", s.photo("haensel-gretel", { w: "100%", h: 130, pos: "50% 30%" }), "„Vor einem großen Walde [wohnte] ein armer Holzhacker mit seiner Frau und seinen zwei Kindern; das Bübchen {hieß} Hänsel und das Mädchen Gretel.“", "Brüder Grimm, „Hänsel und Gretel“"),
          ];
          // versank is strong – fix colour of that mark
          const vs = [...cards[1].querySelectorAll(".z3-mark")].find(x => x.textContent === "versank"); if (vs) vs.style.color = RED;
          const m = merk(s, "Geschichten, Berichte und Märchen schreibt man meist im ", s.h("b", { class: "blue" }, "Präteritum"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, legend, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, cards), m));
          s.show(legend, "down"); s.sfx.pop();
          s.preload("pencil-write"); s.preload("waves"); s.preload("birds");
          const CS = [["pencil-write", { vol: 0.8 }], ["waves", { vol: 0.4, dur: 3, fade: 0.8 }], ["birds", { vol: 0.4, dur: 3, fade: 0.8 }]];
          cards.forEach((c, i) => s.step(async () => { s.sound(...CS[i]); await s.show(c, "up"); await marksOn(s, c, 220); }));
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 7 ─────────────── Perfekt */
      {
        title: "Perfekt: zwei Teile",
        say: "Das Perfekt hat zwei Teile. Eine Form von haben oder sein und das Partizip zwei. Zusammen bilden sie eine Klammer um den Satz.",
        build(s) {
          const mini = miniTL(s, "perf");
          const w = (t, col) => s.h("span", { class: "z3-w", style: col ? { color: col, borderColor: col } : {} }, t);
          const habe = w("habe", TEAL), gesp = w("gespielt.", TEAL);
          const kl = s.h("span", { class: "z3-kl" }, habe, w("Geige"), gesp);
          const sent = s.h("div", { class: "row", style: { justifyContent: "center", alignItems: "flex-start", gap: "12px" } }, w("Ich"), kl);
          const klLbl = s.h("p", { class: "hand later", style: { margin: 0, textAlign: "center", color: U } }, "Satzklammer");
          const part = [["spielen", "spiel", "t", BLUE], ["singen", "sung", "en", RED], ["fahren", "fahr", "en", RED]].map(([inf, st, e, c]) => {
            const ge = s.h("span", { class: "z3-blk", style: { background: U } }, "ge");
            const stB = s.h("span", { class: "z3-blk", style: { background: "#fff", color: INK, border: "2px solid var(--line)" } }, st);
            const eB = s.h("span", { class: "z3-blk", style: { background: c } }, e);
            const r = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px" } }, s.h("span", { class: "t", style: { width: "110px" } }, inf), s.h("span", { class: "t pencil" }, "→"), s.h("span", { style: { display: "inline-flex", gap: "3px" } }, ge, stB, eB));
            r.p = [ge, stB, eB]; return r;
          });
          const exs = s.h("div", { class: "card later stack", style: { gap: "8px" } }, s.h("span", { class: "exlabel" }, "Beispiele"),
            ...["Wir [haben] Pizza [gegessen]. 🍕", "Mia [hat] ein Tor [geschossen]. ⚽", "Ich [bin] nach Hause [gegangen]. 🏠"].map(t => s.h("p", { class: "t" }, rt(s, t, TEAL))));
          const m = merk(s, s.h("b", null, "Perfekt"), " = ", s.h("b", { style: { color: TEAL } }, "haben/sein"), " + ", s.h("b", { style: { color: TEAL } }, "Partizip II"), ". Schwache Verben: ge…", s.h("b", { class: "blue" }, "t"), " · starke Verben: ge…", s.h("b", { class: "red" }, "en"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, mini.svg, s.h("div", { class: "stack", style: { gap: "2px" } }, sent, klLbl),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.15fr" } }, s.h("div", { class: "stack", style: { gap: "10px" } }, part), exs), m));
          mini.run();
          s.step(async () => { s.sfx.snap(); kl.classList.add("on"); s.show([habe, gesp], "bounce"); await s.show(klLbl, "up"); s.say("habe und gespielt umklammern den Satz."); });
          s.step(async () => {
            for (const r of part) { r.classList.remove("later"); s.sfx.pop(); s.show(r.p[1], "zoom"); await s.wait(220); s.sfx.snap(); s.show(r.p[0], "left"); s.show(r.p[2], "right"); await s.wait(500); }
          });
          s.step(async () => { s.sfx.whoosh(); await s.show(exs, "right"); await marksOn(s, exs); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8 ─────────────── haben oder sein */
      {
        title: "Perfekt: haben oder sein?",
        say: "Die meisten Verben bilden das Perfekt mit haben. Mit sein geht es, wenn man sich von A nach B bewegt oder wenn sich etwas verändert.",
        build(s) {
          const col = (title, color, svg, items) => {
            const rows = items.map(([inf, aux, p]) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px", fontSize: "23px" } },
              s.h("span", { style: { width: "150px" } }, inf), s.h("span", { class: "pencil" }, "→"), s.h("span", null, s.h("b", { style: { color } }, aux), " " + p)));
            const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "7px", borderColor: color } },
              s.h("p", { class: "h2", style: { color } }, title), svg, ...rows);
            return { card, rows };
          };
          // movement graphic
          const sv = s.svg(470, 92);
          sv.append(s.el("line", { x1: 50, y1: 70, x2: 420, y2: 70, stroke: PENCIL, "stroke-width": 3, "stroke-dasharray": "8 8" }),
            s.el("circle", { cx: 50, cy: 70, r: 9, fill: TEAL }), s.el("circle", { cx: 420, cy: 70, r: 9, fill: TEAL }),
            T(s, 22, 78, "A", { fill: TEAL }), T(s, 448, 78, "B", { fill: TEAL }));
          const walker = s.el("text", { x: 50, y: 56, "text-anchor": "middle", "font-size": 34, text: "🚶" });
          sv.append(walker);
          const hv = s.svg(470, 80);
          const vio = s.el("text", { x: 235, y: 58, "text-anchor": "middle", "font-size": 40, text: "🎻" });
          hv.append(s.el("circle", { cx: 235, cy: 44, r: 36, fill: "#fff3e0" }), vio);
          const L = col("mit sein", TEAL, sv, [["gehen", "ist", "gegangen"], ["fahren", "ist", "gefahren"], ["kommen", "ist", "gekommen"], ["aufwachen", "ist", "aufgewacht"], ["einschlafen", "ist", "eingeschlafen"], ["bleiben", "ist", "geblieben"]]);
          const R = col("mit haben", ORANGE, hv, [["spielen", "hat", "gespielt"], ["essen", "hat", "gegessen"], ["lesen", "hat", "gelesen"], ["hören", "hat", "gehört"], ["malen", "hat", "gemalt"], ["schlafen", "hat", "geschlafen"]]);
          const m = merk(s, s.h("b", { style: { color: TEAL } }, "sein"), ": Bewegung von A nach B oder Veränderung (aufwachen, einschlafen) – und bei ", s.h("i", null, "sein"), " und ", s.h("i", null, "bleiben"), ". Fast alle anderen: ", s.h("b", { style: { color: ORANGE } }, "haben"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols" }, L.card, R.card), m));
          s.show([L.card, R.card], "up"); s.sfx.pop();
          s.step(async () => {
            s.sound("footsteps", { vol: 0.6, dur: 1.6, fade: 0.3 }); s.tween({ dur: 1400, update: v => walker.setAttribute("x", 50 + 370 * v) });
            for (let i = 0; i < 3; i++) { L.rows[i].classList.remove("later"); s.sfx.count(i); await s.show(L.rows[i], "left"); }
          });
          s.step(async () => {
            s.sound("alarm-clock", { vol: 0.45, dur: 2, fade: 0.4 });
            s.tween({ dur: 1200, update: v => walker.textContent = v < 0.5 ? "😴" : "🙂" });
            for (let i = 3; i < 6; i++) { L.rows[i].classList.remove("later"); s.sfx.count(i); await s.show(L.rows[i], "left"); }
            walker.textContent = "🚶"; walker.setAttribute("x", 420);
          });
          s.step(async () => {
            s.sound("geige", { vol: 0.45, dur: 2.5, fade: 0.6 });
            s.tween({ dur: 1200, ease: "linear", update: v => vio.setAttribute("transform", `rotate(${8 * Math.sin(v * Math.PI * 6)} 235 44)`) });
            for (let i = 0; i < 6; i++) { R.rows[i].classList.remove("later"); s.sfx.count(i); await s.show(R.rows[i], "right"); }
            s.say("Achtung. Ich habe geschlafen, aber ich bin eingeschlafen.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 9 ─────────────── Chat */
      {
        title: "Im Alltag: Chat vom Wochenende",
        say: "Im Gespräch und im Chat erzählen wir meistens im Perfekt. Nur war und hatte bleiben oft im Präteritum.",
        build(s) {
          const msgs = [
            ["l", "Hi! Was [hast] du am Wochenende [gemacht]?"],
            ["r", "Ich [bin] mit Papa zum Tempelhofer Feld [geradelt]. 🚲"],
            ["r", "Danach [haben] wir Pizza [gegessen]. 🍕"],
            ["l", "Cool! Ich [habe] Minecraft [gespielt]. 😄"],
            ["r", "Am Sonntag {war} ich bei Oma. Es {war} super!"],
          ];
          const bubs = msgs.map(([side, t]) => s.h("div", { class: "row later", style: { justifyContent: side === "l" ? "flex-start" : "flex-end" } },
            s.h("div", { class: "z3-bub", style: { background: side === "l" ? "#fff" : "#d9f7c4" } }, rt(s, t, TEAL, BLUE))));
          const dots = s.h("div", { class: "row later" }, s.h("div", { class: "z3-bub z3-dots", style: { background: "#fff" } }, s.h("span"), s.h("span"), s.h("span")));
          const chat = s.h("div", { class: "stack", style: { gap: "10px", padding: "14px", flex: 1, justifyContent: "flex-start" } }, ...bubs, dots);
          const phone = s.h("div", { style: { width: "430px", height: "600px", borderRadius: "40px", background: INK, padding: "14px", display: "flex", flexDirection: "column", margin: "0 auto" } },
            s.h("div", { style: { flex: 1, borderRadius: "28px", background: "#ece5dd", display: "flex", flexDirection: "column", overflow: "hidden" } },
              s.h("div", { style: { background: "#075e54", color: "#fff", padding: "14px 18px", font: "700 22px/1 var(--f-display)" } }, "Ole ⚽"), chat));
          const found = s.h("div", { class: "card", style: { display: "flex", flexWrap: "wrap", gap: "8px" } },
            s.h("span", { class: "exlabel", style: { width: "100%" } }, "Perfekt im Chat"),
            ...["hast … gemacht", "bin … geradelt", "haben … gegessen", "habe … gespielt"].map(t => s.h("span", { class: "chip later", style: { color: TEAL, fontSize: "21px" } }, t)));
          const tip = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "Aber"), s.h("p", { class: "small" }, rt(s, "Bei sein und haben sagt man meist {war} und {hatte}: „Es {war} super!“", TEAL, BLUE)));
          const lf = life(s, s.h("p", { class: "small" }, "Im Gespräch, am Telefon und im Chat erzählen wir meist im Perfekt."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", alignItems: "center", height: "100%" } }, phone, s.h("div", { class: "stack", style: { gap: "14px" } }, s.photo("tempelhofer-feld", { w: "100%", h: 170, caption: "Tempelhofer Feld in Berlin" }), found, tip, lf)));
          s.show(phone, "up"); s.sfx.whoosh();
          const chips = [...found.querySelectorAll(".chip")];
          const post = async (i, chipIdx) => {
            dots.classList.remove("later"); bubs[i].after(dots); dots.style.justifyContent = msgs[i][0] === "l" ? "flex-start" : "flex-end";
            chat.insertBefore(dots, bubs[i]);
            await s.wait(700); dots.classList.add("later"); chat.append(dots);
            if (i === 1) s.sound("bike-bell", { vol: 0.6 }); else s.sfx.pop();
            await s.show(bubs[i], msgs[i][0] === "l" ? "left" : "right"); marksOn(s, bubs[i]);
            if (chipIdx != null) { s.sfx.coin(); s.show(chips[chipIdx], "pop"); }
          };
          s.step(async () => { await post(0, 0); });
          s.step(async () => { await post(1, 1); await post(2, 2); });
          s.step(async () => { await post(3, 3); });
          s.step(async () => { await post(4); s.sfx.ding(); await s.show(tip, "up"); });
          s.step(async () => { s.sfx.chord([0, 5, 9]); await s.show(lf, "up"); });
        },
      },
      /* 10 ─────────────── Plusquamperfekt */
      {
        title: "Plusquamperfekt: noch früher",
        say: "Das Plusquamperfekt zeigt, was noch früher passiert ist als etwas anderes in der Vergangenheit.",
        build(s) {
          const svg = s.svg(1100, 270), y = 150;
          svg.append(
            s.el("rect", { x: 14, y: y - 30, width: 886, height: 60, rx: 14, fill: "#e6ebfa" }),
            s.el("rect", { x: 900, y: y - 30, width: 176, height: 60, rx: 14, fill: "#e0f2e7" }),
            s.el("line", { x1: 14, y1: y, x2: 1062, y2: y, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("polygon", { points: `1086,${y} 1060,${y - 14} 1060,${y + 14}`, fill: INK }),
            s.el("line", { x1: 900, y1: y - 38, x2: 900, y2: y + 38, stroke: RED, "stroke-width": 5 }),
            T(s, 900, 96, "jetzt", { fill: RED, "font-size": 26 }));
          const e2 = [s.el("circle", { cx: 610, cy: y, r: 14, fill: BLUE }), T(s, 610, 96, "② Wir kamen am Bahnhof an.", { fill: BLUE, "font-size": 23 }), T(s, 610, 212, "Präteritum", { fill: BLUE, "font-size": 22 })];
          const e1 = [s.el("circle", { cx: 250, cy: y, r: 14, fill: BROWN }), T(s, 250, 96, "① Der Zug war schon abgefahren.", { fill: BROWN, "font-size": 23 }), T(s, 250, 212, "Plusquamperfekt", { fill: BROWN, "font-size": 22 })];
          const arc = s.el("path", { d: `M268,${y - 18} Q430,${y - 52} 590,${y - 18}`, fill: "none", stroke: U, "stroke-width": 4, "stroke-dasharray": "8 6", class: "later" });
          const arcHead = s.el("polygon", { points: `594,${y - 16} 576,${y - 30} 574,${y - 12}`, fill: U, class: "later" });
          const fam = s.el("text", { x: 610, y: 258, "text-anchor": "middle", "font-size": 36, text: "🧍", class: "later" });
          const train = s.el("text", { x: 250, y: 258, "text-anchor": "middle", "font-size": 38, text: "🚆", class: "later" });
          [...e1, ...e2].forEach(e => e.classList.add("later"));
          svg.append(...e1, ...e2, arc, arcHead, fam, train);
          const m = merk(s, s.h("b", { style: { color: BROWN } }, "Plusquamperfekt"), " = ", s.h("b", null, "hatte/war"), " + ", s.h("b", null, "Partizip II"), ". Es zeigt, was ", s.h("span", { class: "hl" }, "vor"), " einer anderen Sache in der Vergangenheit passiert war.");
          const card = (lbl, a, b) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lbl),
            s.h("p", { class: "small", style: { fontSize: "21px" } }, rt(s, a, BROWN, BLUE)), s.h("p", { class: "small", style: { fontSize: "21px" } }, rt(s, b, BROWN, BLUE)));
          const c1 = card("Nach dem Üben", "① Leon [hatte] Geige [geübt].", "② Dann {spielte} er Fußball. ⚽");
          const c2 = card("In der Pause", "① Lena [hatte] ihr Pausenbrot [vergessen].", "② Deshalb {kaufte} sie eine Brezel. 🥨");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, svg, m, s.h("div", { class: "cols" }, c1, c2)));
          s.sfx.pop();
          s.step(async () => { s.sound("footsteps", { vol: 0.6, dur: 1.5, fade: 0.3 }); await s.show(e2, "pop"); s.show(fam, "bounce"); s.say("Wir kamen am Bahnhof an."); });
          s.step(async () => {
            s.sfx.pop(); await s.show(e1, "pop"); s.show(train, "pop"); await s.wait(300);
            s.sound("ubahn-train", { vol: 0.5, dur: 2.5, fade: 0.7 }); await s.tween({ from: 250, to: 60, dur: 1100, ease: "in", update: v => train.setAttribute("x", v) });
            s.say("Aber der Zug war schon abgefahren. Das war noch früher.");
          });
          s.step(async () => { s.sfx.swoosh(); await s.show(arc, "draw"); s.show(arcHead, "pop"); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(c1, "up"); marksOn(s, c1); s.sfx.pop(); await s.show(c2, "up"); marksOn(s, c2); });
        },
      },
      /* 11 ─────────────── Futur I */
      {
        title: "Futur I: werden + Infinitiv",
        say: "Für die Zukunft gibt es das Futur eins. Du nimmst werden und die Grundform des Verbs.",
        build(s) {
          const mini = miniTL(s, "fut");
          const w = (t, col) => s.h("span", { class: "z3-w", style: col ? { color: col, borderColor: col } : {} }, t);
          const werde = w("werde", GREEN), spielen = w("spielen.", GREEN);
          const kl = s.h("span", { class: "z3-kl" }, werde, w("Geige"), spielen);
          const sent = s.h("div", { class: "row", style: { justifyContent: "center", alignItems: "flex-start", gap: "12px" } }, w("Ich"), kl, s.h("span", { style: { fontSize: "40px" } }, "🎻"));
          const conj = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "auto auto", gap: "4px 16px", alignContent: "start", fontSize: "23px" } },
            s.h("span", { class: "exlabel", style: { gridColumn: "1 / 3" } }, "werden"),
            ...[["ich", "werde"], ["du", "wirst"], ["er/sie/es", "wird"], ["wir", "werden"], ["ihr", "werdet"], ["sie", "werden"]].flatMap(([p, f]) => [s.h("span", { class: "pencil" }, p), s.h("b", { style: { color: GREEN } }, f)]));
          const exs = [["Plan", "In den Ferien [werden] wir nach Spanien [fliegen]. ✈️"], ["Vermutung", "Morgen [wird] es bestimmt [regnen]. ☔"], ["Versprechen", "Ich [werde] mein Zimmer [aufräumen]!"]]
            .map(([l, t]) => s.h("div", { class: "ex later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, l), s.h("p", { class: "small", style: { fontSize: "21px" } }, rt(s, t, GREEN))));
          const m = merk(s, s.h("b", { style: { color: GREEN } }, "Futur I"), " = werden + Infinitiv (Grundform). Tipp: Mit Zeitwort geht auch Präsens: ", s.h("i", null, "Morgen fliegen wir."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, mini.svg, sent,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "260px 1fr", gap: "18px" } }, conj, s.h("div", { class: "stack", style: { gap: "8px" } }, exs)), m));
          mini.run();
          s.step(async () => { s.sound("geige", { vol: 0.45, dur: 2.5, fade: 0.6 }); kl.classList.add("on"); await s.show([werde, spielen], "bounce"); s.say("werde und spielen bilden eine Klammer."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(conj, "left"); });
          s.preload("flugzeug"); s.preload("rain");
          const ES = [() => s.sound("flugzeug", { vol: 0.5, dur: 2.5, fade: 0.8 }), () => s.sound("rain", { vol: 0.4, dur: 2.5, fade: 0.8 }), () => s.sfx.pop()];
          s.step(async () => { for (let i = 0; i < exs.length; i++) { ES[i](); await s.show(exs[i], "right"); marksOn(s, exs[i]); await s.wait(500); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 ─────────────── Wetterbericht */
      {
        title: "Im Alltag: Wetterbericht",
        say: "Im Wetterbericht hörst du oft das Futur. Die Sonne wird scheinen, es wird regnen.",
        build(s) {
          const mkSvg = () => { const v = s.svg(300, 150); v.append(s.el("rect", { x: 0, y: 0, width: 300, height: 150, rx: 16, fill: "#dff0ff" })); return v; };
          // sun
          const sv1 = mkSvg(); const rays = s.el("g");
          for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; rays.append(s.el("line", { x1: 150 + 46 * Math.cos(a), y1: 75 + 46 * Math.sin(a), x2: 150 + 64 * Math.cos(a), y2: 75 + 64 * Math.sin(a), stroke: "#f5a300", "stroke-width": 6, "stroke-linecap": "round" })); }
          sv1.append(rays, s.el("circle", { cx: 150, cy: 75, r: 36, fill: "#ffc93c" }));
          // rain
          const sv2 = mkSvg(); const drops = [];
          for (let i = 0; i < 9; i++) { const d = s.el("line", { x1: 0, y1: 0, x2: -4, y2: 14, stroke: BLUE, "stroke-width": 4, "stroke-linecap": "round" }); drops.push({ d, x: 95 + (i % 5) * 28 + (i > 4 ? 14 : 0), o: i * 0.11 }); sv2.append(d); }
          sv2.append(s.el("ellipse", { cx: 150, cy: 52, rx: 74, ry: 30, fill: "#9aa6b8" }), s.el("circle", { cx: 125, cy: 42, r: 30, fill: "#aab4c4" }), s.el("circle", { cx: 170, cy: 36, r: 32, fill: "#aab4c4" }));
          // wind
          const sv3 = mkSvg(); const winds = [0, 1, 2].map(i => { const p = s.el("path", { d: `M40,${45 + i * 30} q60,-24 120,0 t100,0`, fill: "none", stroke: "#5d7fa8", "stroke-width": 6, "stroke-linecap": "round", "stroke-dasharray": "60 30" }); sv3.append(p); return p; });
          const tree = s.el("g"); tree.append(s.el("rect", { x: 252, y: 92, width: 8, height: 44, fill: "#8a5a2b" }), s.el("circle", { cx: 256, cy: 82, r: 22, fill: GREEN }));
          sv3.append(tree);
          let started = false;
          s.loop(t => {
            if (!started) return;
            rays.setAttribute("transform", `rotate(${t * 30} 150 75)`);
            drops.forEach(o => { const k = ((t * 1.3 + o.o) % 1); const y = 82 + k * 56; o.d.setAttribute("transform", `translate(${o.x - k * 6},${y})`); o.d.setAttribute("opacity", 1 - k * 0.6); });
            winds.forEach((p, i) => p.setAttribute("stroke-dashoffset", -t * 120 - i * 30));
            tree.setAttribute("transform", `rotate(${-8 + 6 * Math.sin(t * 4)} 256 136)`);
          });
          if (s.fast) drops.forEach(o => o.d.setAttribute("transform", `translate(${o.x},${100})`));
          const day = (name, temp, sv, txt) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", width: "100%" } }, s.h("span", { class: "h2" }, name), s.h("span", { class: "h2 mono", style: { color: RED } }, temp)),
            sv, s.h("p", { class: "small", style: { fontSize: "21px", alignSelf: "stretch" } }, rt(s, txt, GREEN)));
          const days = [day("Montag", "22 °C", sv1, "Am Montag [wird] die Sonne [scheinen]."), day("Dienstag", "15 °C", sv2, "Am Dienstag [wird] es den ganzen Tag [regnen]."), day("Mittwoch", "17 °C", sv3, "Am Mittwoch [wird] ein kräftiger Wind [wehen].")];
          const hdr = s.h("p", { class: "hand", style: { margin: 0, textAlign: "center", color: RED } }, "📺 Das Wetter für Berlin – die nächsten Tage (ausgedacht)");
          const lf = life(s, s.h("p", { class: "small" }, "Futur hörst du auch bei Plänen für die Klassenfahrt, bei Versprechen („Ich werde aufräumen!“) und bei Vermutungen („Das wird klappen!“)."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, hdr, s.h("div", { class: "cols3" }, days), lf));
          s.show(hdr, "down"); s.sfx.whoosh();
          s.preload("birds"); s.preload("rain"); s.preload("wind");
          const DS = ["birds", "rain", "wind"];
          days.forEach((d, i) => s.step(async () => { started = true; s.sound(DS[i], { vol: 0.45, dur: 3, fade: 0.8 }); await s.show(d, "up"); marksOn(s, d); }));
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 13 ─────────────── Stammformen */
      {
        title: "Stammformen starker Verben",
        say: "Starke Verben lernt man am besten in drei Formen. Infinitiv, Präteritum und Partizip zwei. Viele folgen einem Vokal-Muster.",
        build(s) {
          const vw = (str) => { // vowels between | | are coloured
            const parts = str.split("|"); return parts.map((p, i) => i % 2 ? s.h("b", { class: "red" }, p) : p);
          };
          const groups = [
            ["i – a – u", "#7b4fd6", [["s|i|ngen", "s|a|ng", "hat ges|u|ngen"], ["f|i|nden", "f|a|nd", "hat gef|u|nden"], ["tr|i|nken", "tr|a|nk", "hat getr|u|nken"]]],
            ["ei – ie – ie", "#1d5bd0", [["schr|ei|ben", "schr|ie|b", "hat geschr|ie|ben"], ["bl|ei|ben", "bl|ie|b", "ist gebl|ie|ben"]]],
            ["e – a – e", "#0e7c86", [["l|e|sen", "l|a|s", "hat gel|e|sen"], ["s|e|hen", "s|a|h", "hat ges|e|hen"], ["|e|ssen", "|a|ß", "hat geg|e|ssen"]]],
            ["e – a – o", "#138a5a", [["spr|e|chen", "spr|a|ch", "hat gespr|o|chen"], ["n|e|hmen", "n|a|hm", "hat gen|o|mmen"], ["h|e|lfen", "h|a|lf", "hat geh|o|lfen"]]],
            ["a – u – a", "#ee7a1a", [["f|a|hren", "f|u|hr", "ist gef|a|hren"], ["tr|a|gen", "tr|u|g", "hat getr|a|gen"]]],
            ["Sonder\u00adfälle", "#9a5b1f", [["g|e|hen", "g|i|ng", "ist geg|a|ngen"], ["k|o|mmen", "k|a|m", "ist gek|o|mmen"], ["sein", "war", "ist gewesen"]]],
          ];
          const allRows = [];
          const table = gs => {
            const tb = s.h("tbody");
            gs.forEach(([pat, col, rows]) => {
              const trs = rows.map((r, i) => {
                const tr = s.h("tr", { class: "later" }, i === 0 ? s.h("td", { class: "pat", rowspan: rows.length, style: { background: col } }, pat) : null, ...r.map(c => s.h("td", null, vw(c))));
                return tr;
              });
              trs.forEach(t => tb.append(t)); allRows.push(trs);
            });
            return s.h("table", { class: "z3-tab" }, s.h("thead", null, s.h("tr", null, s.h("th", { style: { width: "84px" } }, "Muster"), s.h("th", null, "Infinitiv"), s.h("th", null, "Präteritum"), s.h("th", null, "Partizip II"))), tb);
          };
          const t1 = table(groups.slice(0, 3)), t2 = table(groups.slice(3));
          const tip = s.h("p", { class: "t later", style: { textAlign: "center" } }, "Tipp: Lies jede Zeile laut wie einen Rap – ", s.h("i", null, "singen, sang, gesungen"), "! 🎤");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "20px" } }, s.h("div", { class: "cols", style: { gap: "24px", alignItems: "start" } }, t1, t2), tip));
          s.show([t1, t2], "fade"); s.sfx.pop();
          const reveal = async gi => { const trs = allRows[gi]; for (let i = 0; i < trs.length; i++) { s.sfx.note([0, 4, 7, 12][i] + gi); trs[i].classList.remove("later"); await s.show(trs[i], "left"); } };
          s.step(async () => { await reveal(0); await reveal(1); await reveal(2); });
          s.step(async () => { await reveal(3); await reveal(4); await reveal(5); });
          s.step(async () => { s.sfx.drum(); await s.wait(200); s.sfx.drum(); await s.show(tip, "bounce"); s.say("singen, sang, gesungen. fahren, fuhr, gefahren."); });
        },
      },
      /* 14 ─────────────── Zeitreise */
      {
        title: "Zeitreise mit einem Satz",
        say: "Schieb den Regler über die Zeitleiste. Der Satz reist mit durch alle Zeitformen.",
        build(s) {
          const KEYS = ["plusq", "prat", "perf", "pras", "fut"];
          const XS = [175, 420, 420, 700, 950];
          const FORMS = {
            spielen: ["Leon [hatte] Geige [gespielt].", "Leon [spielte] Geige.", "Leon [hat] Geige [gespielt].", "Leon [spielt] Geige.", "Leon [wird] Geige [spielen]."],
            gehen: ["Leon [war] zur Schule [gegangen].", "Leon [ging] zur Schule.", "Leon [ist] zur Schule [gegangen].", "Leon [geht] zur Schule.", "Leon [wird] zur Schule [gehen]."],
            singen: ["Leon [hatte] im Chor [gesungen].", "Leon [sang] im Chor.", "Leon [hat] im Chor [gesungen].", "Leon [singt] im Chor.", "Leon [wird] im Chor [singen]."],
          };
          let verb = "spielen", cur = 3, mx = XS[3];
          const svg = s.svg(1100, 190), y = 72;
          svg.append(
            s.el("rect", { x: 14, y: y - 30, width: 686, height: 60, rx: 14, fill: "#e6ebfa" }),
            s.el("rect", { x: 700, y: y - 30, width: 376, height: 60, rx: 14, fill: "#e0f2e7" }),
            s.el("line", { x1: 14, y1: y, x2: 1062, y2: y, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("polygon", { points: `1086,${y} 1060,${y - 14} 1060,${y + 14}`, fill: INK }),
            s.el("line", { x1: 700, y1: y - 38, x2: 700, y2: y + 38, stroke: RED, "stroke-width": 5 }));
          const st = [[175, "Plusquamperfekt", [0]], [420, "Präteritum / Perfekt", [1, 2]], [700, "Präsens", [3]], [950, "Futur I", [4]]].map(([x, t, ks]) => {
            const dot = s.el("circle", { cx: x, cy: y, r: 9, fill: "#fff", stroke: INK, "stroke-width": 3 });
            const lb = T(s, x, 146, t, { "font-size": 22, fill: PENCIL });
            svg.append(dot, lb); return { lb, ks };
          });
          svg.append(T(s, 700, 178, "jetzt", { "font-size": 20, fill: RED }));
          const mk = s.el("g", { transform: `translate(${mx},${y})` });
          const mkC = s.el("circle", { r: 22, fill: TC.pras, stroke: "#fff", "stroke-width": 5 });
          mk.append(mkC, s.el("polygon", { points: "-11,-46 11,-46 0,-30", fill: INK }));
          svg.append(mk);
          const name = s.h("span", { class: "chip", style: { fontSize: "22px", color: "#fff", background: TC.pras } }, "Präsens");
          const sentence = s.h("p", { class: "big", style: { textAlign: "center" } });
          const box = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", minHeight: "128px", justifyContent: "center" } }, name, sentence);
          const render = (anim) => {
            const k = KEYS[cur], c = TC[k];
            name.textContent = MININAME[k]; name.style.background = c; mkC.setAttribute("fill", c);
            sentence.textContent = ""; sentence.append(...rt(s, FORMS[verb][cur], c));
            sentence.querySelectorAll(".z3-mark").forEach(e => e.classList.add("on"));
            st.forEach(o => { const on = o.ks.includes(cur); o.lb.setAttribute("fill", on ? c : PENCIL); });
            if (anim) { s.show(sentence, "pop"); }
          };
          const moveTo = v => {
            const from = mx, to = XS[v]; cur = v; render(true);
            if (from !== to) { s.sfx.whoosh(); s.tween({ from, to, dur: 500, ease: "out", update: x => { mx = x; mk.setAttribute("transform", `translate(${x},${y})`); } }); }
            else s.sfx.pop();
          };
          const sl = s.slider({ label: "Zeitreise", min: 0, max: 4, value: 3, fmt: v => MININAME[KEYS[v]], onInput: v => moveTo(v) });
          const vbtn = (v, label) => s.h("button", { class: "btn" + (v === verb ? " solid" : ""), onclick: e => { s.sfx.click(); verb = v; [...e.currentTarget.parentNode.children].forEach(b => b.classList.toggle("solid", b === e.currentTarget)); render(true); } }, label);
          const vrow = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } }, vbtn("spielen", "🎻 Geige"), vbtn("gehen", "🏫 Schule"), vbtn("singen", "🎤 Chor"));
          const tour = async () => { for (let v = 0; v <= 4; v++) { sl.set(v); await s.wait(1300); if (!s.alive) return; } };
          const play = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); tour(); } }, "▶ Zeitreise");
          const m = merk(s, "Nur das ", s.h("b", null, "Verb"), " ändert sich – der Rest des Satzes bleibt gleich.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, svg, box,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr auto", alignItems: "end", gap: "24px" } }, sl, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px" } }, vrow, play)), m));
          render(false); s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { await tour(); });
          s.step(async () => { s.sfx.click(); vrow.children[1].click(); s.sfx.ding(); await s.show(m, "up"); s.say("Bei gehen heißt es war gegangen und ist gegangen."); });
        },
      },
      /* 15 ─────────────── Welche Zeitform wann */
      {
        title: "Welche Zeitform wann?",
        say: "Für jede Situation gibt es eine passende Zeitform. Geschichten im Präteritum, Gespräche im Perfekt.",
        build(s) {
          const rows = [
            ["prat", "📖", "Geschichten, Märchen, Berichte, Aufsätze", "Wir [fuhren] an die Ostsee."],
            ["perf", "💬", "Gespräch, Telefon, Chat", "Ich [habe] Pizza [gegessen]!"],
            ["pras", "⚽", "jetzt, immer wieder, live", "Mia [schießt] – Tor!"],
            ["fut", "🌦", "Pläne, Wetterbericht, Versprechen", "Morgen [wird] es [regnen]."],
            ["plusq", "⏪", "was noch früher passiert war", "Der Zug [war] schon [abgefahren]."],
          ].map(([k, ic, where, exs]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "230px 50px 1fr 1fr", alignItems: "center", gap: "14px", background: "#fff", border: `3px solid ${TC[k]}`, borderRadius: "16px", padding: "10px 16px" } },
            s.h("span", { class: "chip", style: { background: TC[k], color: "#fff", fontSize: "22px", justifyContent: "center" } }, MININAME[k]),
            s.h("span", { style: { fontSize: "34px", lineHeight: 1 } }, ic),
            s.h("span", { class: "t", style: { fontSize: "22px" } }, where),
            s.h("span", { class: "t", style: { fontSize: "22px" } }, rt(s, exs, TC[k]))));
          const m = merk(s, s.h("b", null, "Sonderfall: "), "sein, haben, können, müssen … stehen auch im Gespräch oft im Präteritum: ", s.h("i", null, "Ich war krank. Ich musste üben."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, rows, m));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 2; i++) { s.sfx.count(i * 2); await s.show(rows[i], "left"); marksOn(s, rows[i]); } });
          s.step(async () => { for (let i = 2; i < 5; i++) { s.sfx.count(i * 2); await s.show(rows[i], "left"); marksOn(s, rows[i]); } });
          s.step(async () => { s.sfx.success(); await s.show(m, "up"); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
