/* Kapitel 4 – Lange Vokale (Klasse 5, Rechtschreibung: kurze/lange Vokale, ie/i/ih/ieh, Dehnungs-h, aa/ee/oo).
   Regeln geprüft am Amtlichen Regelwerk 2024 (Rat für deutsche Rechtschreibung), §§ 1, 2, 6, 8–12. */
(() => {
  const C = "#c2410c";
  const SPK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6"/></svg>';

  if (!document.getElementById("u4css")) {
    const st = document.createElement("style");
    st.id = "u4css";
    st.textContent = `
.u4w{white-space:nowrap;display:inline-block;padding-bottom:.14em}
.u4L,.u4S{position:relative;display:inline-block}
.u4L::after{content:"";position:absolute;left:-3px;right:-3px;bottom:-.06em;height:5px;border-radius:3px;background:${C};transform:scaleX(0);transform-origin:left center;transition:transform .5s cubic-bezier(.2,1.3,.4,1)}
.u4S::after{content:"";position:absolute;left:50%;bottom:-.12em;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:var(--blue);transform:scale(0);transition:transform .45s cubic-bezier(.2,1.8,.4,1)}
.mk .u4L::after,.mk .u4S::after,.u4w.mk .u4L::after,.u4w.mk .u4S::after{transform:none}
.u4c{color:${C}}
.u4q{color:var(--pencil);opacity:.6}
.u4g{color:var(--green)}
.btn.u4say{font:700 30px/1.1 var(--f-display);min-height:62px;padding:0 16px;gap:10px;color:var(--ink);border-color:var(--line);background:#fff}
.btn.u4say svg{flex:none;color:${C}}
.btn.u4say.sm{font-size:26px;min-height:56px;padding:0 12px}
.u4pair{display:grid;grid-template-columns:1fr 46px 1fr;align-items:center;gap:10px}
.u4vs{font:700 30px/1 var(--f-display);color:var(--pencil);text-align:center}
.u4syl{display:flex;justify-content:center;align-items:flex-end;gap:6px;background:#fff;border:2px solid var(--line);border-radius:18px;padding:22px 10px 16px;cursor:pointer;color:var(--ink)}
.u4sy{display:inline-flex;flex-direction:column;align-items:center;font:700 54px/1.05 var(--f-display)}
.u4sy svg{display:block}
.u4box{display:inline-block;border:3px solid ${C};border-radius:12px;padding:0 5px 6px;margin-right:4px}
.u4box.cl{border-color:var(--blue)}
.u4tile{display:inline-grid;place-items:center;width:84px;height:104px;border-radius:14px;background:#fff;border:3px solid var(--line);font:800 70px/1 var(--f-display)}
.u4tag{display:inline-block;font:700 19px/1.2 var(--f-display);padding:5px 12px;border-radius:999px;background:var(--unit-soft);color:${C};white-space:nowrap}
.u4tag.b{background:#e4ecfb;color:var(--blue)}
.u4tag.g{background:#e6f6ee;color:var(--green)}
.u4tag.v{background:#efe8fb;color:var(--violet)}
.u4on{background:${C} !important;color:#fff !important;border-color:${C} !important}
.u4flow{position:relative;display:grid;grid-template-columns:44px 450px 104px 1fr;column-gap:12px;align-items:center}
.u4q1{background:#fff;border:2px solid var(--line);border-radius:16px;padding:12px 16px;font-size:23px;line-height:1.25}
.u4res{border-radius:16px;padding:10px 12px;font:800 34px/1 var(--f-display);text-align:center;background:var(--unit-soft);color:${C};border:3px solid transparent;transition:transform .3s}
.u4arrow{font:700 22px/1 var(--f-display);color:var(--green);text-align:center;border-radius:10px;padding:8px 4px}
.u4down{grid-column:2;font:700 21px/1 var(--f-display);color:var(--red);padding:6px 0 6px 18px}
.u4ball{position:absolute;left:8px;top:0;width:28px;height:28px;border-radius:50%;background:${C};box-shadow:0 3px 8px rgba(0,0,0,.3);z-index:2}
.u4track{position:absolute;left:20px;top:10px;bottom:10px;width:4px;border-radius:2px;background:var(--line)}
.u4bin{position:absolute;border:3px dashed var(--line);border-radius:20px;background:rgba(255,255,255,.65)}
.u4bin b{display:block;font:700 23px/1 var(--f-display);padding:12px 16px 0}
.u4fly{position:absolute;width:132px;height:54px;display:grid;place-items:center;background:#fff;border:2px solid var(--line);border-radius:12px;font:700 27px/1 var(--f-display);box-shadow:0 2px 0 var(--line)}
.u4club{display:flex;flex-direction:column;gap:14px;background:#fff;border:3px solid ${C};border-radius:22px;padding:16px 20px}
.u4club .hd{display:flex;align-items:center;gap:14px}
.u4club .bigl{font:800 64px/1 var(--f-display);color:${C}}
.u4row{display:flex;align-items:center;gap:12px;font:700 32px/1.1 var(--f-display)}
.u4ending{display:inline-block;background:${C};color:#fff;border-radius:10px;padding:2px 8px}
.u4note{cursor:pointer}
.u4paper{background:#fffdf3;border:2px solid #e8dcae;border-radius:6px;box-shadow:3px 4px 0 rgba(0,0,0,.08)}
.u4ub{background:#1d5bd0;color:#fff;border-radius:18px}
.u4ub .btn.u4say{border-color:#fff}
.u4hand{font-family:var(--f-hand);font-size:34px;color:var(--blue);font-weight:700}
`;
    document.head.appendChild(st);
  }

  /* speak a word directly (button press = explicit request, independent of the Vorlesen toggle) */
  function speak(t, rate = 0.75) {
    if (Deck.fast || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "de-DE"; u.rate = rate; u.pitch = 1.05;
      const v = Deck.Voice.voice(); if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  /* word markup: {x} long vowel (line), {!x} long + coloured, [x] short vowel (dot), <x> coloured letters, (x) silent/grey letters */
  function W(s, str, cls = "") {
    const el = s.h("span", { class: "u4w " + cls });
    const re = /\{([^}]*)\}|\[([^\]]*)\]|<([^>]*)>|\(([^)]*)\)|([^{[<(]+)/g;
    let m;
    while ((m = re.exec(str))) {
      if (m[1] != null) el.append(m[1][0] === "!" ? s.h("span", { class: "u4L u4c" }, m[1].slice(1)) : s.h("span", { class: "u4L" }, m[1]));
      else if (m[2] != null) el.append(s.h("span", { class: "u4S" }, m[2]));
      else if (m[3] != null) el.append(s.h("span", { class: "u4c" }, m[3]));
      else if (m[4] != null) el.append(s.h("span", { class: "u4q" }, m[4]));
      else el.append(m[5]);
    }
    return el;
  }
  const plain = str => str.replace(/[{}\[\]<>()!]/g, "");
  const bump = el => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };
  /* a word button that speaks the word slowly */
  function sayBtn(s, str, o = {}) {
    const b = s.h("button", { class: "btn u4say " + (o.cls || "") + (o.later ? " later" : "") });
    b.innerHTML = SPK;
    b.append(W(s, str, o.mk ? "mk" : ""));
    b.addEventListener("click", () => { s.sfx.pop(); bump(b); speak(o.speak || plain(str), o.rate || 0.7); if (o.onTap) o.onTap(b); });
    return b;
  }
  const mark = els => (Array.isArray(els) ? els : [els]).forEach(e => e.classList.add("mk"));
  const P = (s, cls, ...k) => s.h("p", { class: cls }, ...k);

  Deck.unit({
    id: "u4", num: 4, title: "Lange Vokale", color: C, soft: "#fde9dc",
    subtitle: "Hör genau hin – Strich oder Punkt?",
    blurb: "ie, i, ih, Dehnungs-h, aa/ee/oo – lange Vokale richtig schreiben",
    goals: ["Kurze und lange Vokale hören und markieren", "Silben schwingen: offene und geschlossene Silben", "Langes i: ie, i, ih oder ieh?", "Dehnungs-h und Doppelvokale kennen", "Tricks: verlängern, ableiten, Merkwörter üben"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 8, width: 58, height: 54, rx: 12, fill: C, opacity: .14 }),
        el("text", { x: 35, y: 44, "text-anchor": "middle", "font-size": 30, "font-weight": 800, fill: C, text: "ie" }),
        el("rect", { x: 20, y: 51, width: 30, height: 5, rx: 2.5, fill: C }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Kurz oder lang?",
        say: "Hör genau hin. Bei Ofen klingt das O lang, bei offen ganz kurz. Tippe auf die Wörter.",
        build(s) {
          const pairs = [["{O}fen", "[o]ffen"], ["M{ie}te", "M[i]tte"], ["H{ü}te", "H[ü]tte"], ["B{ee}t", "B[e]tt"]];
          const longs = [], shorts = [];
          const rows = pairs.map(([a, b]) => {
            const A = sayBtn(s, a, { rate: 0.55 }), B = sayBtn(s, b, { rate: 0.55 });
            longs.push(A); shorts.push(B);
            return s.h("div", { class: "u4pair later" }, A, s.h("span", { class: "u4vs" }, "↔"), B);
          });
          const sv = s.svg(440, 200);
          const mkRow = (y, label, col) => {
            sv.append(s.el("text", { x: 0, y: y + 27, class: "lbl", text: label }),
              s.el("rect", { x: 78, y, width: 350, height: 38, rx: 19, fill: "#f3f4f1", stroke: "#c8d3de", "stroke-width": 2 }));
            const bar = s.el("rect", { x: 78, y, width: 0, height: 38, rx: 19, fill: col });
            sv.append(bar); return bar;
          };
          const bar1 = mkRow(30, "lang", C), bar2 = mkRow(130, "kurz", "#1d5bd0");
          const runLong = async () => { s.sfx.tone(330, 0.95, "triangle", 0.22); bar1.setAttribute("width", 0); await s.tween({ from: 0, to: 350, dur: 950, ease: "linear", update: v => bar1.setAttribute("width", v) }); };
          const runShort = async () => { s.sfx.tone(330, 0.16, "triangle", 0.22); bar2.setAttribute("width", 0); await s.tween({ from: 0, to: 60, dur: 160, ease: "linear", update: v => bar2.setAttribute("width", v) }); };
          const again = s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); await runLong(); await s.wait(250); await runShort(); } }, "Nochmal hören");
          const card = s.h("div", { class: "card stack later", style: { gap: "10px" } }, P(s, "h2", "So lange klingt der Vokal"), sv, s.h("div", { class: "row" }, again));
          const merk = s.h("div", { class: "merk later" },
            "Langer Vokal: ", s.h("b", null, "Strich"), " darunter – ", W(s, "{O}fen", "mk"), ".", s.h("br"),
            "Kurzer Vokal: ", s.h("b", null, "Punkt"), " darunter – ", W(s, "[o]ffen", "mk"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1.05fr 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "18px" } }, P(s, "t", "Tippe auf ein Wort und hör genau hin!"), ...rows),
            s.h("div", { class: "stack" }, card, merk)));
          s.show(rows, "up"); s.sfx.pop();
          s.step(async () => {
            s.say("Ofen, Miete, Hüte, Beet. Hier klingt der Vokal lang.");
            s.show(card, "zoom"); mark(longs); s.sfx.whoosh(); await s.wait(400); await runLong();
          });
          s.step(async () => {
            s.say("Offen, Mitte, Hütte, Bett. Hier ist der Vokal kurz.");
            mark(shorts); s.sfx.snap(); await runShort();
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Silben schwingen",
        say: "Sprich das Wort langsam und klatsche bei jeder Silbe. Tippe auf ein Wort, dann klatscht es mit.",
        build(s) {
          const words = [["Ho", "se"], ["Ta", "fel"], ["Ba", "na", "ne"], ["Kis", "te"], ["Fuß", "ball"], ["Te", "le", "fon"]];
          const allArcs = [];
          const mkWord = (sy, size) => {
            const cols = [], arcs = [];
            sy.forEach(t => {
              const svg = s.svg(100, 26, { preserveAspectRatio: "none", style: { width: "100%", height: "26px" } });
              const p = s.el("path", { d: "M8 4 Q50 36 92 4", fill: "none", stroke: C, "stroke-width": 5, "stroke-linecap": "round", class: "later" });
              svg.append(p); arcs.push(p);
              cols.push(s.h("span", { class: "u4sy", style: size ? { fontSize: size } : null }, s.h("span", null, t), svg));
            });
            return { cols, arcs };
          };
          const clap = async (cols, word) => {
            for (const c of cols) { if (!s.alive) return; bump(c); s.sfx.drum(); await s.wait(380); }
            speak(word, 0.8);
          };
          const cards = words.map(sy => {
            const { cols, arcs } = mkWord(sy);
            allArcs.push(arcs);
            return s.h("button", { class: "u4syl", onclick: () => clap(cols, sy.join("")) }, ...cols);
          });
          const reim = ["E", "ne,", "me", "ne,", "muh,", "und", "raus", "bist", "du!"];
          const rw = mkWord(reim, "30px");
          rw.arcs.forEach(a => a.classList.remove("later"));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag – Abzählreim"),
            s.h("button", { class: "u4syl", style: { border: 0, background: "transparent", padding: "0", gap: "4px", justifyContent: "flex-start" }, onclick: () => clap(rw.cols, "Ene, mene, muh, und raus bist du!") }, ...rw.cols));
          const merk = s.h("div", { class: "merk later" }, "Jede Silbe hat einen ", s.h("b", null, "Vokal"), " – oder einen Doppellaut wie ", s.h("b", null, "au, ei, eu"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "24px", justifyContent: "center" } },
            P(s, "t", "Sprich langsam, schwinge mit der Hand und klatsche jede Silbe. Tipp auf ein Wort!"),
            s.h("div", { class: "cols3" }, ...cards),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.25fr 1fr", alignItems: "stretch" } }, life, merk)));
          s.show(cards, "pop"); s.sfx.pop();
          s.step(async () => {
            s.say("Ho-se. Ta-fel. Ba-na-ne. Kis-te. Fuß-ball. Te-le-fon.");
            for (const arcs of allArcs) for (const a of arcs) { s.show(a, "draw"); s.sfx.drum(); await s.wait(260); }
          });
          s.step(async () => { s.sfx.whoosh(); await s.show(life, "up"); clap(rw.cols, ""); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Offene und geschlossene Silben",
        say: "Endet die erste Silbe mit einem Vokal, ist sie offen. Dann ist der Vokal meistens lang.",
        build(s) {
          const door = open => {
            const sv = s.svg(110, 130);
            sv.append(s.el("rect", { x: 14, y: 8, width: 82, height: 116, rx: 4, fill: "#fff7ef", stroke: "#8a4b12", "stroke-width": 5 }));
            const panel = open
              ? s.el("path", { d: "M96 8 L120 0 L120 132 L96 124 Z", fill: "#c2410c", opacity: .9, class: "later" })
              : s.el("rect", { x: 17, y: 11, width: 76, height: 110, fill: "#1d5bd0", class: "later" });
            const knob = s.el("circle", { cx: open ? 112 : 82, cy: 68, r: 5, fill: "#ffd94a", class: "later" });
            sv.setAttribute("viewBox", "0 0 124 132"); sv.setAttribute("width", 110); sv.setAttribute("height", 118);
            sv.append(panel, knob);
            return { sv, parts: [panel, knob] };
          };
          const mkSide = (open, items, title, sub) => {
            const d = door(open);
            const btns = items.map(([a, b]) => {
              const btn = s.h("button", { class: "btn u4say", onclick: () => { s.sfx.pop(); bump(btn); speak(plain(a + b), 0.6); } });
              btn.innerHTML = SPK;
              btn.append(s.h("span", { class: "u4box" + (open ? "" : " cl") }, W(s, a)), W(s, b));
              return btn;
            });
            const card = s.h("div", { class: "card stack later", style: { gap: "14px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "18px" } }, d.sv,
                s.h("div", null, P(s, "h2", title), P(s, "t", sub))),
              s.h("div", { class: "cols", style: { gap: "12px" } }, ...btns));
            return { card, btns, d };
          };
          const L = mkSide(true, [["H{o}", "se"], ["T{a}", "fel"], ["l{e}", "sen"], ["Bl{u}", "me"]], "offene Silbe", "endet mit Vokal: Ho | se");
          const R = mkSide(false, [["K[i]s", "te"], ["H[a]m", "mer"], ["M[u]t", "ter"], ["W[o]l", "ke"]], "geschlossene Silbe", "endet mit Konsonant: Kis | te");
          const merk = s.h("div", { class: "merk later" }, "Offene Silbe → Vokal ", s.h("b", null, "meistens lang"), ".  Geschlossene Silbe → Vokal ", s.h("b", null, "meistens kurz"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "22px", justifyContent: "center" } },
            s.h("div", { class: "cols" }, L.card, R.card), merk));
          s.step(async () => {
            s.say("Ho-se, Ta-fel, le-sen, Blu-me. Die Tür ist offen, der Vokal darf lang klingen.");
            s.show(L.card, "left"); s.sfx.whoosh(); await s.wait(350);
            s.show(L.d.parts, "fade"); s.sfx.boing(); await s.wait(300); mark(L.btns); s.sfx.ding();
          });
          s.step(async () => {
            s.say("Kis-te, Ham-mer, Mut-ter, Wol-ke. Ein Konsonant schließt die Tür. Der Vokal ist kurz.");
            s.show(R.card, "right"); s.sfx.whoosh(); await s.wait(350);
            s.show(R.d.parts, "pop"); s.sfx.drum(); await s.wait(300); mark(R.btns); s.sfx.snap();
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Langes i: meistens ie",
        say: "In deutschen Wörtern schreibt man das lange i meistens mit ie. Das e hörst du nicht.",
        build(s) {
          const sv = s.svg(440, 250);
          const tile = (x, ch, col) => {
            const g = s.el("g", null, s.el("rect", { x, y: 70, width: 92, height: 112, rx: 14, fill: "#fff", stroke: col || "#c8d3de", "stroke-width": 4 }),
              s.el("text", { x: x + 46, y: 152, "text-anchor": "middle", "font-size": 76, "font-weight": 800, fill: col || "#1b2740", text: ch }));
            sv.append(g); return g;
          };
          tile(14, "T"); tile(118, "i", C); const e = tile(222, "e", C); tile(326, "r");
          e.classList.add("later");
          const line = s.el("line", { x1: 126, y1: 204, x2: 306, y2: 204, stroke: C, "stroke-width": 9, "stroke-linecap": "round", class: "later" });
          const cap = s.el("text", { x: 264, y: 40, "text-anchor": "middle", class: "hlbl later", text: "e: stumm, macht i lang" });
          sv.append(line, cap);
          const tier = sayBtn(s, "T{!ie}r", { mk: true });
          const left = s.h("div", { class: "stack", style: { alignItems: "center", gap: "12px" } }, sv, tier);
          const box = (lab, words) => {
            const b = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lab),
              s.h("div", { class: "row", style: { gap: "10px" } }, ...words.map(w => sayBtn(s, w, { mk: true, cls: "sm" }))));
            return b;
          };
          const b1 = box("Im Zoo", ["T{!ie}re", "B{!ie}ne", "Z{!ie}ge"]);
          const b2 = box("Post von Oma", ["Br{!ie}f", "L{!ie}be Grüße"]);
          const b3 = box("In der Pause", ["sp{!ie}len", "W{!ie}se", "Z{!ie}l"]);
          const merk = s.h("div", { class: "merk later" }, "Langes i in deutschen Wörtern: ", s.h("b", null, "meistens ie"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "18px" } }, left, merk),
            s.h("div", { class: "stack", style: { gap: "16px" } }, b1, b2, b3)));
          s.show(left, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Aus i wird ie. Das e hörst du nicht, es zeigt nur, das i ist lang.");
            s.show(e, "bounce"); s.sfx.boing(); await s.wait(500); s.show(line, "draw"); s.sfx.zap(); await s.wait(400); s.show(cap, "fade"); s.sfx.ding();
          });
          [b1, b2, b3].forEach((b, i) => s.step(async () => { s.sfx.pop(); s.sfx.count(i * 2); await s.show(b, "right"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Fremdwörter: nur i",
        say: "Viele Wörter kommen aus anderen Sprachen. Bei ihnen ist das i lang, aber man schreibt nur i.",
        build(s) {
          const data = [["Fabrik", "Masch{!i}ne"], ["Obst", "Vitam{!i}n"], ["Freizeit", "K{!i}no"],
            ["Zoo", "Krokod{!i}l"], ["Apotheke", "Mediz{!i}n"], ["Tankstelle", "Benz{!i}n"],
            ["Markt", "Apfels{!i}ne"], ["Schule", "Mus{!i}k"], ["Krankenhaus", "Kl{!i}nik"]];
          const tiles = data.map(([lab, w]) => s.h("div", { class: "ex later", style: { padding: "16px 16px", display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" } },
            s.h("span", { class: "u4tag b" }, lab), sayBtn(s, w, { mk: true })));
          const rows = [tiles.slice(0, 3), tiles.slice(3, 6), tiles.slice(6, 9)];
          const merk = s.h("div", { class: "merk later", style: { flex: "1.3" } }, "Fremdwörter: langes i ", s.h("b", null, "oft nur mit i"), ". Lerne sie als Merkwörter.");
          const vs = s.h("div", { class: "card later", style: { flex: "1", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" } },
            P(s, "t", "Achtung, Unterschied:"),
            s.h("div", { class: "row", style: { gap: "10px" } }, sayBtn(s, "T{!ie}r", { mk: true, cls: "sm" }), sayBtn(s, "T{!i}ger", { mk: true, cls: "sm" })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px", justifyContent: "center" } },
            P(s, "t", "Diese Wörter kommen aus anderen Sprachen. Das i klingt lang – und hat ", s.h("b", null, "kein e"), "."),
            s.h("div", { class: "cols3", style: { gap: "14px" } }, ...tiles),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch", marginTop: "12px" } }, merk, vs)));
          rows.forEach((r, i) => s.step(async () => { s.sfx.pop(); s.sfx.count(i * 3); await s.show(r, "pop"); }));
          s.step(async () => { s.say("Tier ist ein deutsches Wort, also ie. Tiger schreibt man nur mit i."); s.sfx.ding(); s.show(merk, "up"); await s.show(vs, "up", 150); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Merkwörter mit i",
        say: "Ein paar deutsche Wörter haben auch nur ein i. Die lernst du auswendig.",
        build(s) {
          const ws = ["m{!i}r", "d{!i}r", "w{!i}r", "g{!i}b", "{!I}gel", "B{!i}ber", "T{!i}ger", "L{!i}ter"];
          const btns = ws.map(w => sayBtn(s, w, { mk: true, cls: "sm later" }));
          const pair = (a, am, b, bm) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, sayBtn(s, a, { mk: true, cls: "sm" }), P(s, "small pencil", am)),
            s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, sayBtn(s, b, { mk: true, cls: "sm" }), P(s, "small pencil", bm)));
          const p1 = pair("L{!i}d", "am Auge", "L{!ie}d", "zum Singen");
          const p2 = pair("St{!i}l", "die Art, wie man etwas macht", "St{!ie}l", "am Apfel, am Besen");
          const p3 = pair("w{!i}der", "gegen", "w{!ie}der", "noch einmal");
          const merk = s.h("div", { class: "merk later" }, "Gleich gesprochen, anders geschrieben – die Bedeutung entscheidet!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "20px", justifyContent: "center" } },
            P(s, "t", "Diese deutschen Wörter schreibt man ", s.h("b", null, "nur mit i"), ":"),
            s.h("div", { class: "cols4", style: { gap: "12px" } }, ...btns),
            P(s, "h2", "Gleicher Klang – andere Schreibung"),
            s.h("div", { class: "cols3", style: { gap: "16px" } }, p1, p2, p3), merk));
          s.step(async () => { s.say("mir, dir, wir, gib, Igel, Biber, Tiger, Liter"); for (let i = 0; i < btns.length; i++) { s.show(btns[i], "pop"); s.sfx.count(i); await s.wait(110); } });
          [p1, p2, p3].forEach(p => s.step(async () => { s.sfx.whoosh(); await s.show(p, "up"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "ih und ieh: kleine Clubs",
        say: "Mit ih schreibt man nur ihr, ihm, ihn und ihnen. Mit ieh nur Vieh, ziehen, fliehen und wiehern.",
        build(s) {
          const club = (big, n, words, ex) => {
            const btns = words.map(w => sayBtn(s, w, { mk: true, cls: "sm later" }));
            const exEl = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...ex.map(t => P(s, "t", t)));
            const c = s.h("div", { class: "u4club" },
              s.h("div", { class: "hd" }, s.h("span", { class: "bigl" }, big), s.h("span", { class: "u4tag" }, "Nur " + n + " Wörter!")),
              s.h("div", { class: "cols", style: { gap: "12px" } }, ...btns), exEl);
            return { c, btns, exEl };
          };
          const A = club("ih", 4, ["{!ih}r", "{!ih}m", "{!ih}n", "{!ih}nen"], ["„Gib ihm den Ball!“", "„Habt ihr Hunger?“"]);
          const B = club("ieh", 4, ["V{!ieh}", "z{!ieh}en", "fl{!ieh}en", "w{!ieh}ern"], ["Wir ziehen nach Berlin.", "Das Pferd wiehert laut."]);
          const merk = s.h("div", { class: "merk later" }, "Auch ihre Formen gehören dazu: ", s.h("b", null, "ihre, ihrem"), " · ", s.h("b", null, "er zieht, sie flieht"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } }, s.h("div", { class: "cols" }, A.c, B.c), merk));
          s.show([A.c, B.c], "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("ihr, ihm, ihn, ihnen"); for (let i = 0; i < 4; i++) { s.show(A.btns[i], "bounce"); s.sfx.count(i); await s.wait(160); } });
          s.step(async () => { s.say("Vieh, ziehen, fliehen, wiehern"); for (let i = 0; i < 4; i++) { s.show(B.btns[i], "bounce"); s.sfx.count(i + 4); await s.wait(160); } });
          s.step(async () => { s.sfx.pop(); s.show(A.exEl, "up"); await s.show(B.exEl, "up", 150); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "-ieren und -ie: immer ie",
        say: "Verben auf ieren schreibt man immer mit ie. Telefonieren, probieren, reparieren.",
        build(s) {
          const stems = ["telefon", "prob", "repar", "musiz"];
          const rows = stems.map(st => {
            const end = s.h("span", { class: "u4ending later" }, "ieren");
            const r = s.h("div", { class: "u4row" }, s.h("span", null, st), end);
            r.onclick = () => { s.sfx.pop(); bump(r); speak(st + "ieren", 0.75); };
            r.style.cursor = "pointer";
            return { r, end };
          });
          const card1 = s.h("div", { class: "card stack", style: { gap: "16px" } }, P(s, "h2", "Wortbaustein -ieren"), ...rows.map(x => x.r));
          const ies = ["Melod{!ie}", "Batter{!ie}", "Energ{!ie}", "Fantas{!ie}"].map(w => sayBtn(s, w, { mk: true, cls: "sm" }));
          const card2 = s.h("div", { class: "card stack later", style: { gap: "12px" } }, P(s, "h2", "-ie am Wortende"), P(s, "small pencil", "betont und lang"), s.h("div", { class: "cols", style: { gap: "10px" } }, ...ies));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "t", "Ich telefon", s.h("b", null, "ie"), "re mit Oma."), P(s, "t", "In der Instrumentalklasse musiz", s.h("b", null, "ie"), "ren wir."), P(s, "t", "Prob", s.h("b", null, "ie"), "r mal die Suppe!"));
          s.add(s.h("div", { class: "cols", style: { height: "100%", alignItems: "center" } }, card1, s.h("div", { class: "stack" }, card2, life)));
          s.show(card1, "left"); s.sfx.whoosh();
          s.step(async () => {
            s.say("telefonieren, probieren, reparieren, musizieren");
            for (const x of rows) { s.show(x.end, "right"); await s.wait(300); s.sfx.snap(); await s.wait(200); }
          });
          s.step(async () => { s.sfx.pop(); await s.show(card2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Der i-Wegweiser",
        say: "So findest du die richtige Schreibung für das lange i. Frag dich Schritt für Schritt.",
        build(s) {
          const flow = s.h("div", { class: "u4flow" });
          const track = s.h("div", { class: "u4track" });
          const ball = s.h("div", { class: "u4ball later" });
          flow.append(track, ball);
          const qs = [["Ist es ", s.h("b", null, "ihr, ihm, ihn"), " oder ", s.h("b", null, "ihnen"), "?"],
            ["Ist es ", s.h("b", null, "Vieh, ziehen, fliehen"), " oder ", s.h("b", null, "wiehern"), "?"],
            ["Ist es ein ", s.h("b", null, "Fremdwort"), " (Kino) oder ein ", s.h("b", null, "Merkwort"), " (Igel)?"]];
          const res = ["ih", "ieh", "i"];
          const Q = [], A = [], R = [], parts = [];
          qs.forEach((q, i) => {
            const qe = s.h("div", { class: "u4q1", style: { gridColumn: "2" } }, ...q);
            const ae = s.h("div", { class: "u4arrow", style: { gridColumn: "3" } }, "ja →");
            const re = s.h("div", { class: "u4res", style: { gridColumn: "4" } }, res[i]);
            const dn = s.h("div", { class: "u4down" }, "↓ nein");
            Q.push(qe); A.push(ae); R.push(re);
            const grp = [qe, ae, re, dn]; grp.forEach(g => g.classList.add("later"));
            flow.append(...grp); parts.push(grp);
          });
          const fin = s.h("div", { class: "u4res later", style: { gridColumn: "2 / 5", fontSize: "30px" } }, "Sonst fast immer: ie");
          flow.append(fin); parts.push([fin]);
          const routes = { Brief: 3, ihm: 0, ziehen: 1, Kino: 2, Igel: 2, spielen: 3 };
          let busy = false;
          const run = async word => {
            if (busy) return; busy = true;
            [...A, ...R, fin].forEach(x => x.classList.remove("u4on"));
            speak(word, 0.75);
            const target = routes[word];
            const yOf = el => el.offsetTop + el.offsetHeight / 2 - 14;
            ball.classList.remove("later");
            ball.style.transform = `translateY(${yOf(Q[0])}px)`;
            const stops = target < 3 ? Q.slice(0, target + 1) : [...Q, fin];
            let y = yOf(Q[0]);
            for (const st of stops) {
              const ny = yOf(st);
              await s.tween({ from: y, to: ny, dur: 420, ease: "inOut", update: v => (ball.style.transform = `translateY(${v}px)`) });
              y = ny; s.sfx.tick(); await s.wait(250);
            }
            if (target < 3) { A[target].classList.add("u4on"); R[target].classList.add("u4on"); bump(R[target]); }
            else { fin.classList.add("u4on"); bump(fin); }
            s.sfx.ding(); busy = false;
          };
          const picks = s.h("div", { class: "stack later", style: { gap: "12px" } }, P(s, "t", "Wähle ein Wort:"),
            ...Object.keys(routes).map(w => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); run(w); } }, w)));
          s.add(s.h("div", { class: "row", style: { height: "100%", flexWrap: "nowrap", alignItems: "center", gap: "30px" } }, flow, picks));
          parts.forEach((p, i) => s.step(async () => { s.sfx.pop(); s.sfx.count(i * 2); await s.show(p, "left"); }));
          s.step(async () => { s.say("Wähle ein Wort und schau, wohin die Kugel rollt."); s.sfx.whoosh(); await s.show(picks, "right"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Das Dehnungs-h",
        say: "Das Dehnungs-h hörst du nicht. Es zeigt, der Vokal davor ist lang. Es steht nur vor l, m, n oder r.",
        build(s) {
          const items = [["Z{a}<h>", "l"], ["n{e}<h>", "m", "en"], ["w{o}<h>", "n", "en"], ["{U}<h>", "r"]];
          const cards = items.map(([a, c, rest]) => {
            const btn = s.h("button", { class: "btn u4say", style: { fontSize: "40px", minHeight: "72px" }, onclick: () => { s.sfx.pop(); bump(btn); speak(plain(a + c + (rest || "")), 0.6); } });
            btn.innerHTML = SPK; btn.append(s.h("span", { class: "u4w mk" }, W(s, a), s.h("span", { class: "u4g" }, c), rest || ""));
            return s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "14px" } }, btn,
              s.h("span", { class: "u4tag g" }, "h vor " + c));
          });
          const noh = ["T{a}l", "Sch{a}l", "N{a}me", "T{o}r", "Sch{u}le"].map(w => sayBtn(s, w, { mk: true, cls: "sm" }));
          const nohRow = s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" } }, P(s, "t", s.h("b", null, "Aber oft ohne h:")), ...noh);
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "t", "U-Bahn: Fa", s.h("b", null, "h"), "rkarte, Ba", s.h("b", null, "h"), "nhof"), P(s, "t", "Küche: Sa", s.h("b", null, "h"), "ne, Ko", s.h("b", null, "h"), "l, Me", s.h("b", null, "h"), "l"), P(s, "t", "Rad: Fa", s.h("b", null, "h"), "rrad"));
          const merk = s.h("div", { class: "merk later" }, "Dehnungs-h nur vor ", s.h("b", null, "l, m, n, r"), " – und auch dort nur in manchen Wörtern. Wörter mit h sind ", s.h("b", null, "Merkwörter"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "22px", justifyContent: "center" } },
            s.h("div", { class: "cols4" }, ...cards), nohRow,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.2fr", alignItems: "stretch" } }, life, merk)));
          s.step(async () => { s.say("Zahl, nehmen, wohnen, Uhr. Nach dem h kommt l, m, n oder r."); for (let i = 0; i < cards.length; i++) { s.show(cards[i], "down"); s.sfx.count(i * 2); await s.wait(150); } });
          s.step(async () => { s.say("Aber Tal, Schal, Name, Tor und Schule haben kein h."); s.sfx.boing(); await s.show(nohRow, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Doppelvokale: aa, ee, oo",
        say: "Nur wenige Wörter haben einen doppelten Vokal. Aa, ee und oo. Lerne sie als Merkwörter.",
        build(s) {
          const groups = [["aa", ["S{!aa}l", "H{!aa}r", "P{!aa}r", "W{!aa}ge"], "Ein Paar Socken"],
            ["ee", ["M{!ee}r", "T{!ee}", "Schn{!ee}", "B{!ee}re"], "Erdbeeren vom Markt"],
            ["oo", ["B{!oo}t", "Z{!oo}", "M{!oo}s", "M{!oo}r"], "Boot fahren auf dem See"]];
          const cards = groups.map(([v, ws, life]) => {
            const t1 = s.h("span", { class: "u4tile", style: { color: C, borderColor: C } }, v[0]);
            const t2 = s.h("span", { class: "u4tile", style: { color: C, borderColor: C } }, v[1]);
            const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" } },
              s.h("div", { class: "row", style: { gap: "6px" } }, t1, t2),
              s.h("div", { class: "cols", style: { gap: "10px", width: "100%" } }, ...ws.map(w => sayBtn(s, w, { mk: true, cls: "sm" }))),
              P(s, "small green", "Im Alltag: " + life));
            return { c, t1, t2 };
          });
          const um = s.h("div", { class: "card soft later", style: { flex: "1" } }, P(s, "t", s.h("b", null, "Mit Umlaut nur ein Buchstabe:")),
            P(s, "t", "S", s.h("b", null, "aa"), "l → S", s.h("b", null, "ä"), "le · B", s.h("b", null, "oo"), "t → B", s.h("b", null, "ö"), "tchen · H", s.h("b", null, "aa"), "r → H", s.h("b", null, "ä"), "rchen"));
          const merk = s.h("div", { class: "merk later", style: { flex: "1" } }, "Nur ", s.h("b", null, "aa, ee, oo"), " – nie ii oder uu. Achtung: ", s.h("b", null, "Meer"), " (Wasser), ", s.h("b", null, "mehr"), " (nicht weniger).");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "24px", justifyContent: "center" } },
            s.h("div", { class: "cols3" }, ...cards.map(x => x.c)),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch" } }, um, merk)));
          cards.forEach((x, i) => s.step(async () => {
            s.say(["Saal, Haar, Paar, Waage", "Meer, Tee, Schnee, Beere", "Boot, Zoo, Moos, Moor"][i]);
            s.show(x.c, "up"); s.sfx.whoosh();
            if (!s.fast) {
              x.t1.style.transform = "translateX(-40px)"; x.t2.style.transform = "translateX(40px)";
              await s.wait(250);
              await s.tween({ from: 40, to: 0, dur: 450, ease: "back", update: v => { x.t1.style.transform = `translateX(${-v}px)`; x.t2.style.transform = `translateX(${v}px)`; } });
            }
            s.sfx.snap();
          }));
          s.step(async () => { s.sfx.pop(); s.show(um, "up"); await s.show(merk, "up", 150); s.sfx.ding(); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Meistens: gar kein Zeichen!",
        say: "Die meisten langen Vokale bekommen gar kein Extra-Zeichen. Schau, wie die Wörter sortiert werden.",
        build(s) {
          const box = s.h("div", { style: { position: "relative", width: "1100px", height: "636px" } });
          const words = [["Hose", 0], ["Zahl", 1], ["Tal", 0], ["Blume", 0], ["Meer", 2], ["Name", 0], ["Brot", 0], ["Uhr", 1], ["Ofen", 0], ["Schule", 0], ["Boot", 2], ["Nase", 0], ["Tafel", 0]];
          const bins = [{ x: 0, w: 590, t: "ohne Zeichen" }, { x: 615, w: 230, t: "mit h" }, { x: 870, w: 230, t: "aa, ee, oo" }];
          const BY = 250, BH = 330;
          bins.forEach((b, i) => box.append(s.h("div", { class: "u4bin", style: { left: b.x + "px", top: BY + "px", width: b.w + "px", height: BH + "px", borderColor: i === 0 ? C : "" } }, s.h("b", { style: { color: i === 0 ? C : "var(--pencil)" } }, b.t))));
          const counters = [0, 0, 0];
          const tiles = words.map(([w, bin], i) => {
            const x0 = 30 + (i % 7) * 150, y0 = 60 + Math.floor(i / 7) * 74;
            const k = counters[bin]++;
            const x1 = bin === 0 ? bins[0].x + 24 + (k % 4) * 140 : bins[bin].x + 49;
            const y1 = BY + 60 + (bin === 0 ? Math.floor(k / 4) : k) * 66;
            const el = s.h("div", { class: "u4fly", style: { left: "0px", top: "0px", transform: `translate(${x0}px,${y0}px)` } }, w);
            box.append(el);
            return { el, x0, y0, x1, y1, w };
          });
          const intro = P(s, "t", "Schau zu: Wie zeigen diese Wörter den langen Vokal?");
          intro.style.position = "absolute"; intro.style.left = "0"; intro.style.top = "0";
          const merk = s.h("div", { class: "merk later", style: { position: "absolute", left: "0", top: "50px", width: "1100px" } },
            "Die meisten langen Vokale haben ", s.h("b", null, "kein Zeichen"), ". h und aa, ee, oo sind ", s.h("b", null, "Ausnahmen"), " – nur beim i ist ", s.h("b", null, "ie"), " die Regel.");
          box.append(intro, merk);
          s.add(box);
          s.step(async () => {
            s.say("Hose, Tal, Blume, Name, Brot, Ofen. Ganz ohne Zeichen!");
            const order = [...tiles].sort((a, b) => (a.x1 + a.y1 * 3) - (b.x1 + b.y1 * 3));
            order.forEach((t, i) => {
              s.tween({ from: 0, to: 1, dur: 650, delay: i * 140, ease: "out", update: v => { t.el.style.transform = `translate(${s.lerp(t.x0, t.x1, v)}px,${s.lerp(t.y0, t.y1, v)}px)`; } });
              if (!s.fast) setTimeout(() => { if (s.alive) s.sfx.snap(); }, i * 140 + 600);
            });
            await s.wait(order.length * 140 + 700);
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "down"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Verlängern und ableiten",
        say: "Zwei Tricks. Verlängere das Wort, dann hörst du den langen Vokal besser. Und such die Wortfamilie.",
        build(s) {
          const rows = [["Z{a}<h>l", "Z{a}<h> | len"], ["T{!ie}r", "T{!ie} | re"], ["T{a}l", "T{ä} | ler"]].map(([a, b]) => {
            const B = sayBtn(s, b.replace(" | ", "·"), { mk: true, cls: "sm later", speak: plain(b.replace(" | ", "")) });
            const ar = s.h("span", { class: "u4vs later" }, "→");
            return { r: s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, sayBtn(s, a, { mk: true, cls: "sm" }), ar, B), B, ar };
          });
          const left = s.h("div", { class: "card stack", style: { gap: "14px" } }, P(s, "h2", "1. Verlängern"), P(s, "small pencil", "Mach aus einer Silbe zwei – dann klingt der Vokal deutlich."), ...rows.map(x => x.r));
          const sv = s.svg(500, 340);
          const root = { x: 250, y: 170 };
          const fam = [["Fahrrad", 110, 52], ["Fahrkarte", 390, 52], ["Abfahrt", 82, 290], ["er fährt", 418, 290], ["Fahrer", 250, 318]];
          const lines = fam.map(([, x, y]) => s.el("line", { x1: root.x, y1: root.y, x2: x, y2: y - 10, stroke: C, "stroke-width": 4, "stroke-linecap": "round", class: "later" }));
          sv.append(...lines);
          sv.append(s.el("rect", { x: 160, y: 140, width: 180, height: 60, rx: 30, fill: C }), s.el("text", { x: 250, y: 180, "text-anchor": "middle", "font-size": 32, "font-weight": 800, fill: "#fff", text: "fahren" }));
          const labs = fam.map(([t, x, y]) => {
            const g = s.el("g", { class: "later" }, s.el("rect", { x: x - 78, y: y - 30, width: 156, height: 42, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 2 }),
              s.el("text", { x, y: y - 1, "text-anchor": "middle", "font-size": 25, "font-weight": 700, fill: "#1b2740", text: t }));
            sv.append(g); return g;
          });
          const right = s.h("div", { class: "card stack later", style: { gap: "6px", alignItems: "center" } }, P(s, "h2", "2. Ableiten: die Wortfamilie"), sv);
          const merk = s.h("div", { class: "merk later" }, "Das ", s.h("b", null, "h"), " bleibt in der ganzen Wortfamilie: fahren – Fahrrad – er fährt. Genauso: wohnen – Wohnung.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.05fr", alignItems: "start" } }, left, right), merk));
          s.show(left, "left"); s.sfx.whoosh();
          s.step(async () => {
            s.say("Zahl wird Zahlen. Tier wird Tiere. Tal wird Täler.");
            for (const x of rows) { s.show(x.ar, "left"); s.sfx.swoosh(); await s.wait(200); s.show(x.B, "pop"); s.sfx.pop(); await s.wait(300); }
          });
          s.step(async () => {
            s.say("Fahrrad, Fahrkarte, Abfahrt, er fährt, Fahrer. Alle mit h.");
            s.show(right, "zoom"); s.sfx.whoosh(); await s.wait(400);
            for (let i = 0; i < fam.length; i++) { s.show(lines[i], "draw"); s.sfx.zap(); await s.wait(250); s.show(labs[i], "pop"); s.sfx.count(i * 2); await s.wait(200); }
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Musik",
        say: "In der Instrumentalklasse stecken überall lange Vokale. Tippe auf eine Note.",
        build(s) {
          const items = [["Mus{!i}k", "i", -3, "Musik"], ["Klav{!ie}r", "ie", 0, "Klavier"], ["Viol{!i}ne", "i", 4, "Violine"], ["Melod{!ie}", "ie", 7, "Melodie"],
            ["L{!ie}d", "ie", 5, "Lied"], ["Fl{ö}te", "ohne", 2, "Flöte"], ["N{o}ten", "ohne", 0, "Noten"], ["Pr{o}be", "ohne", -1, "Probe"]];
          const SW = 1080, colW = (SW - 60) / 8;
          const sv = s.svg(SW, 200);
          for (let i = 0; i < 5; i++) sv.append(s.el("line", { x1: 10, y1: 70 + i * 22, x2: SW - 10, y2: 70 + i * 22, stroke: "#5d6678", "stroke-width": 2 }));
          sv.append(s.el("line", { x1: 10, y1: 70, x2: 10, y2: 158, stroke: "#1b2740", "stroke-width": 3 }), s.el("line", { x1: SW - 18, y1: 70, x2: SW - 18, y2: 158, stroke: "#1b2740", "stroke-width": 3 }), s.el("line", { x1: SW - 10, y1: 70, x2: SW - 10, y2: 158, stroke: "#1b2740", "stroke-width": 7 }));
          const wordEls = [], tagEls = [], notes = [];
          items.forEach(([w, kind, semi, sp], i) => {
            const cx = 60 + colW * i + colW / 2, cy = 172 - (semi + 3) * 10;
            const g = s.el("g", { class: "u4note later" },
              s.el("rect", { x: cx - 50, y: 0, width: 100, height: 200, fill: "transparent" }),
              s.el("ellipse", { cx, cy, rx: 15, ry: 11, fill: C, transform: `rotate(-20 ${cx} ${cy})` }),
              s.el("line", { x1: cx + 14, y1: cy, x2: cx + 14, y2: cy - 62, stroke: C, "stroke-width": 3 }));
            sv.append(g); notes.push(g);
            const we = s.h("div", { class: "later", style: { textAlign: "center", font: "700 30px/1.1 var(--f-display)", cursor: "pointer" } }, W(s, w, "mk"));
            const tg = s.h("div", { class: "later", style: { textAlign: "center" } }, s.h("span", { class: "u4tag" + (kind === "i" ? " b" : kind === "ohne" ? " g" : "") }, kind));
            wordEls.push(we); tagEls.push(tg);
            const play = () => { s.sfx.note(semi, 0.35); bump(we); speak(sp, 0.7); };
            g.addEventListener("click", play); we.addEventListener("click", play); we.style.cursor = "pointer";
          });
          const grid = cls => s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", width: SW + "px", paddingLeft: "60px", columnGap: "4px" } });
          const g1 = grid(); g1.append(...wordEls);
          const g2 = grid(); g2.append(...tagEls);
          const geige = s.h("div", { class: "life later", style: { flex: "1" } }, s.h("span", { class: "exlabel" }, "Achtung"),
            P(s, "t", s.h("b", null, "Geige"), ": ", s.h("b", null, "ei"), " ist ein Doppellaut – kein langes i!"));
          const merk = s.h("div", { class: "merk later", style: { flex: "1.3" } }, "Musik, Violine: Fremdwörter mit i. Klavier, Lied: ie. Flöte, Noten, Probe: ganz ohne Zeichen.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } }, sv, g1, g2,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch", marginTop: "18px" } }, geige, merk)));
          s.step(async () => {
            s.say("Musik, Klavier, Violine, Melodie, Lied, Flöte, Noten, Probe");
            for (let i = 0; i < items.length; i++) { s.show(notes[i], "pop"); s.show(wordEls[i], "up"); s.sfx.note(items[i][2], 0.3); await s.wait(260); }
          });
          s.step(async () => { for (let i = 0; i < tagEls.length; i++) { s.show(tagEls[i], "pop"); s.sfx.tick(); await s.wait(90); } s.sfx.ding(); });
          s.step(async () => { s.sfx.boing(); s.show(geige, "up"); await s.show(merk, "up", 150); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: U-Bahn und Essen",
        say: "Lange Vokale findest du überall. In der U-Bahn, auf der Speisekarte und auf dem Einkaufszettel.",
        build(s) {
          const ub = ["B{a}<h>nh{o}f", "F{a}<h>rkarte", "Abf{a}<h>rt", "{U}<h>r", "Z{!ie}l"];
          const sk = ["T{!ee}", "Sp{!ie}gelei", "N{u}deln", "K{o}<h>lsuppe", "Erdb{!ee}ren"];
          const ez = ["Zw{!ie}beln", "K{!i}wis", "M{e}<h>l", "S{a}<h>ne", "Apfels{!i}nen"];
          const mkList = arr => arr.map(w => sayBtn(s, w, {}));
          const b1 = mkList(ub), b2 = mkList(sk), b3 = mkList(ez);
          const uSign = s.h("span", { style: { display: "inline-grid", placeItems: "center", width: "48px", height: "48px", borderRadius: "8px", background: "#fff", color: "#1d5bd0", font: "800 34px/1 var(--f-display)" } }, "U");
          const c1 = s.h("div", { class: "u4ub later", style: { padding: "16px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("div", { class: "row", style: { gap: "12px" } }, uSign, s.h("span", { class: "h2" }, "U-Bahn")), ...b1);
          const c2 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "10px", background: "#fffaf3", borderColor: "#e3c9a8" } },
            s.h("span", { class: "h2", style: { fontFamily: "var(--f-hand)", fontSize: "36px", color: "#8a4b12" } }, "Speisekarte"), ...b2);
          const c3 = s.h("div", { class: "u4paper later", style: { padding: "16px", display: "flex", flexDirection: "column", gap: "10px" } },
            s.h("span", { class: "u4hand" }, "Einkaufszettel"), ...b3);
          const cards = [[c1, b1], [c2, b2], [c3, b3]];
          const legend = s.h("div", { class: "row later", style: { gap: "18px", justifyContent: "center" } },
            s.h("span", { class: "u4tag" }, "Strich = langer Vokal"), s.h("span", { class: "u4tag" }, "farbig = Zeichen ie, h, ee"), s.h("span", { class: "u4tag b" }, "Kiwis, Apfelsinen: Fremdwörter mit i"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "22px", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, c1, c2, c3), legend));
          cards.forEach(([c, b], i) => s.step(async () => {
            s.show(c, ["left", "up", "right"][i]); s.sfx.whoosh(); await s.wait(450);
            for (const x of b) { mark(x); s.sfx.tick(); await s.wait(120); }
          }));
          s.step(async () => { s.sfx.ding(); await s.show(legend, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "So lernst du Merkwörter",
        say: "Merkwörter lernst du am besten mit einer Lernkartei. Jeden Tag ein bisschen.",
        build(s) {
          const sv = s.svg(440, 330);
          const fx = [20, 160, 300];
          fx.forEach((x, i) => sv.append(
            s.el("rect", { x, y: 150, width: 120, height: 150, rx: 10, fill: i === 2 ? "#e6f6ee" : "#fff", stroke: "#8a4b12", "stroke-width": 4 }),
            s.el("text", { x: x + 60, y: 325, "text-anchor": "middle", class: "lbl", text: "Fach " + (i + 1) })));
          const card = s.el("g", null, s.el("rect", { x: 0, y: 0, width: 110, height: 70, rx: 8, fill: "#fff7c2", stroke: C, "stroke-width": 3 }),
            s.el("text", { x: 55, y: 44, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#1b2740", text: "Maschine" }));
          card.setAttribute("transform", "translate(25,110)");
          sv.append(card);
          const cap = s.el("text", { x: 220, y: 40, "text-anchor": "middle", class: "hlbl", text: "gewusst? → ein Fach weiter" });
          sv.append(cap);
          const moveTo = async i => { const from = fx[i - 1] + 5, to = fx[i] + 5; await s.tween({ from: 0, to: 1, dur: 700, ease: "inOut", update: v => card.setAttribute("transform", `translate(${s.lerp(from, to, v)},${110 - Math.sin(v * Math.PI) * 60})`) }); s.sfx.ding(); };
          const tips = [["Merkwörter-Liste", "Spalten: ie · i · ih · ieh · h · aa/ee/oo"], ["Wörterbuch", "Unsicher? Schlag nach!"], ["Silben schwingen", "Sprich deutlich und klatsche mit."], ["Abschreiben in 5 Schritten", "lesen – merken – abdecken – schreiben – vergleichen"]]
            .map(([h, t], i) => s.h("div", { class: "card later", style: { padding: "12px 18px" } }, P(s, "t", s.h("b", { class: "u4c" }, (i + 1) + ". " + h)), P(s, "small", t)));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.15fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { alignItems: "center" } }, P(s, "h2", "Die Lernkartei"), sv), s.h("div", { class: "stack", style: { gap: "14px" } }, ...tips)));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(tips[0], "right"); await moveTo(1); });
          s.step(async () => { s.sfx.pop(); s.show(tips[1], "right"); await moveTo(2); s.sfx.success(); });
          s.step(async () => { s.sfx.pop(); await s.show(tips[2], "right"); });
          s.step(async () => { s.sfx.pop(); await s.show(tips[3], "right"); s.say("Lesen, merken, abdecken, schreiben, vergleichen. Super gemacht!"); s.sfx.fanfare(); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
