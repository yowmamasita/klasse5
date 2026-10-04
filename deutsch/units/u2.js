/* Kapitel 2 – Satzglieder und Sätze (inkl. Relativsätze, das/dass). Jede Satzglied-Art hat im ganzen Kapitel genau eine Farbe. */
(() => {
  "use strict";
  const CSS = `
.d2b{display:inline-flex;align-items:center;gap:.28em;padding:5px 13px;border-radius:12px;border:3px solid #a3adbb;background:#fff;font:700 27px/1.15 var(--f-display);color:var(--ink);white-space:nowrap}
.d2b.l{font-size:36px;padding:7px 18px;border-radius:16px}
.d2b.s{font-size:22px;padding:3px 10px;border-width:2px;border-radius:10px}
.d2tok{display:inline-flex;flex-direction:column;align-items:center;gap:4px;position:relative}
.d2lab{font:700 19px/1 var(--f-display);white-space:nowrap}
.d2num{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:700 19px/1 var(--f-display);color:#fff;background:#8a96a8}
.d2row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;position:relative}
.d2p{font:700 30px/1.15 var(--f-display);margin-left:-6px;position:relative;z-index:1;align-self:flex-end;padding-bottom:6px}
.d2q{font:700 30px/1.1 var(--f-hand);color:var(--red)}
.d2att{text-decoration:underline dotted #5d6678 3px;text-underline-offset:6px}
.d2loose .d2b{border-color:transparent!important;background:transparent!important;padding:0;gap:10px}
.d2loose .d2b > span{border:2px solid #a3adbb;background:#fff;border-radius:10px;padding:3px 10px}
.d2tag{display:inline-block;font:700 19px/1 var(--f-display);color:#fff;border-radius:999px;padding:6px 12px;white-space:nowrap}
.d2bar{position:absolute;height:14px;border:4px solid;border-top:0;border-radius:0 0 10px 10px;transform-origin:left center}
.d2car{position:relative;display:inline-flex;align-items:center;gap:.28em;padding:12px 20px;border-radius:12px;font:700 25px/1.2 var(--f-display);white-space:nowrap;margin-bottom:18px}
.d2car::after{content:"";position:absolute;left:12px;right:12px;bottom:-15px;height:18px;background:radial-gradient(circle at 9px 9px,#1b2740 7px,#8a96a8 8px,transparent 9px) left / 46px 18px space no-repeat}
.d2lok{background:#0f766e;color:#fff;border-radius:12px 26px 12px 12px}
.d2lok::before{content:"";position:absolute;left:18px;top:-14px;width:16px;height:14px;background:#0b5c56;border-radius:3px 3px 0 0}
.d2wag{background:#fde7c7;color:var(--ink);border:3px solid #b45309}
.d2cpl{display:inline-flex;align-items:center;margin-bottom:18px}
.d2cpl::before,.d2cpl::after{content:"";width:12px;height:4px;background:#1b2740}
.d2opt{min-height:56px;border-radius:12px;border:3px solid;font:700 20px/1.1 var(--f-display);color:var(--ink);cursor:pointer;padding:4px 8px;width:100%}
`;
  if (!document.getElementById("d2css")) { const st = document.createElement("style"); st.id = "d2css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------- eine Farbe pro Satzglied ---------- */
  const SG = {
    S: { name: "Subjekt", q: "Wer oder was?", c: "#1d5bd0", b: "#e3ecfc" },
    P: { name: "Prädikat", q: "Was tut …?", c: "#dc3b2a", b: "#fde4e1" },
    AO: { name: "Akkusativobjekt", q: "Wen oder was?", c: "#138a5a", b: "#dcf2e7" },
    DO: { name: "Dativobjekt", q: "Wem?", c: "#7b4fd6", b: "#ece5fb" },
    Z: { name: "Adverbiale der Zeit", q: "Wann?", c: "#d9650b", b: "#fdecd9" },
    O: { name: "Adverbiale des Ortes", q: "Wo? Wohin?", c: "#0e7c8c", b: "#d9f1f4" },
    AW: { name: "Adverbiale der Art und Weise", q: "Wie?", c: "#c0267a", b: "#fbe1ee" },
    G: { name: "Adverbiale des Grundes", q: "Warum?", c: "#8a5a2b", b: "#f2e8dc" },
    x: { name: "", q: "", c: "#a3adbb", b: "#ffffff" },
  };
  const KONJ = { c: "#5d6678", b: "#eef0f3" };
  const short = { S: "Subjekt", P: "Prädikat", AO: "Akk.-Objekt", DO: "Dativobjekt", Z: "Zeit", O: "Ort", AW: "Art und Weise", G: "Grund" };

  /* ---------- Bewegungs-Helfer ---------- */
  const SC = () => { const st = document.getElementById("stage"); return st ? st.getBoundingClientRect().width / 1180 || 1 : 1; };
  const noAnim = el => { [...el.classList].forEach(c => { if (/^a-/.test(c)) el.classList.remove(c); }); };
  function bump(s, el, k = 0.18) {
    noAnim(el);
    return s.tween({ dur: 420, ease: "out", update: (v, t) => { el.style.transform = `scale(${1 + k * Math.sin(Math.PI * t)})`; } }).then(() => { el.style.transform = ""; });
  }
  async function flipText(s, el, txt) {
    if (s.fast || !s.alive) { el.textContent = txt; return; }
    noAnim(el);
    await s.tween({ dur: 150, ease: "in", update: v => { el.style.transform = `scaleY(${1 - v})`; } });
    el.textContent = txt;
    await s.tween({ dur: 240, ease: "back", update: v => { el.style.transform = `scaleY(${v})`; } });
    el.style.transform = "";
  }
  async function type(s, el, txt, ms = 26) {
    if (s.fast) { el.textContent = txt; return; }
    el.textContent = "";
    for (let i = 1; i <= txt.length; i++) { if (!s.alive) return; el.textContent = txt.slice(0, i); if (i % 3 === 0) s.sfx.tick(); await s.wait(ms); }
  }
  /** rearrange tokens of a row: state = [id | [id, newFirstWord]]; tokens not listed disappear, new ones pop in */
  async function morph(s, row, toks, state, { arc = 40, dur = 700 } = {}) {
    const sc = SC();
    const idOf = new Map(Object.entries(toks).map(([k, v]) => [v, k]));
    const ids = state.map(x => (Array.isArray(x) ? x[0] : x));
    const vis = e => e.style.display !== "none" && !e.classList.contains("later");
    const first = new Map();
    Object.values(toks).forEach(e => { noAnim(e); if (vis(e)) first.set(e, e.getBoundingClientRect()); });
    const leaving = [...first.keys()].filter(e => !ids.includes(idOf.get(e)));
    if (leaving.length && !s.fast) await s.tween({ dur: 220, update: v => leaving.forEach(e => { e.style.opacity = 1 - v; e.style.transform = `scale(${1 - 0.5 * v})`; }) });
    leaving.forEach(e => { e.style.display = "none"; e.style.opacity = ""; e.style.transform = ""; });
    const moving = [];
    state.forEach(x => {
      const [id, txt] = Array.isArray(x) ? x : [x];
      const e = toks[id];
      e.style.display = ""; e.classList.remove("later");
      const tx = e.querySelector(".tx") || e;
      if (txt != null) tx.textContent = txt;
      row.appendChild(e); moving.push(e);
    });
    if (s.fast || !s.alive) return;
    const data = moving.map(e => {
      const l = e.getBoundingClientRect(), f = first.get(e);
      return f ? { e, dx: (f.left - l.left) / sc, dy: (f.top - l.top) / sc } : { e, isNew: true };
    });
    data.forEach(d => { d.e.style.position = "relative"; d.e.style.zIndex = 3; if (d.isNew) { d.e.style.opacity = 0; d.e.style.transform = "scale(.3)"; } else d.e.style.transform = `translate(${d.dx}px,${d.dy}px)`; });
    await s.tween({ dur, ease: "inOut", update: (v, t) => data.forEach(d => {
      if (d.isNew) { const p = Math.max(0, (t - 0.4) / 0.6); d.e.style.opacity = Math.min(1, p * 2); d.e.style.transform = `scale(${0.3 + 0.7 * s.ease.back(p)})`; return; }
      const mv = Math.abs(d.dx) + Math.abs(d.dy) > 4;
      const lift = mv ? (d.dx < 0 ? -1 : 1) * arc * Math.sin(Math.PI * t) : 0;
      d.e.style.transform = `translate(${d.dx * (1 - v)}px,${d.dy * (1 - v) + lift}px)`;
    }) });
    data.forEach(d => { d.e.style.transform = ""; d.e.style.opacity = ""; d.e.style.zIndex = ""; });
  }
  const phrase = t => [...t.chip.children].map(c => c.textContent).join(" ");
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const life = (s, label, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const P = (s, t) => s.h("span", { class: "d2p" }, t);

  /** Satzglied-Baustein. text: "am Samstag" or [["der"],["kleine","att"],["Bruder"]] */
  function blk(s, k, text, { label, num, size } = {}) {
    const words = Array.isArray(text) ? text : text.split(" ").map(w => [w]);
    const chipEl = s.h("span", { class: "d2b" + (size ? " " + size : "") }, words.map(([w, a], i) => s.h("span", { class: (i === 0 ? "tx" : "") + (a ? " d2att" : "") }, w)));
    const kids = [];
    let numEl = null, labEl = null;
    if (num) { numEl = s.h("span", { class: "d2num" }, ""); kids.push(numEl); }
    kids.push(chipEl);
    if (label != null) { labEl = s.h("span", { class: "d2lab" }, label); kids.push(labEl); }
    const t = s.h("div", { class: "d2tok" }, kids);
    t.chip = chipEl; t.num = numEl; t.lab = labEl;
    t.first = words[0][0];
    paint(t, k);
    return t;
  }
  function paint(t, k) {
    const c = t.chip || t;
    c.style.borderColor = SG[k].c; c.style.background = SG[k].b; t.dataset.k = k;
    if (t.lab) t.lab.style.color = k === "x" ? "var(--pencil)" : SG[k].c;
    if (t.num) t.num.style.background = k === "P" ? SG.P.c : "#8a96a8";
    return t;
  }
  const tag = (s, k, text) => s.h("span", { class: "d2tag", style: { background: SG[k].c } }, text || short[k]);
  const legend = (s, keys) => s.h("div", { class: "row", style: { gap: "8px" } }, keys.map(k => tag(s, k)));
  /** state from an order of block ids: first word of the first block gets a capital letter */
  const ordered = (blocks, order, punct = ".") => [...order.map((id, i) => [id, i === 0 ? cap(blocks[id].first) : blocks[id].first]), ["pt", punct]];
  const numbers = (blocks, order) => order.forEach((id, i) => { if (blocks[id].num) blocks[id].num.textContent = String(i + 1); });

  /** example card with a question that finds one Satzglied */
  function qcard(s, label, spec, q, ansIdx, ansK, ansText, fig, snd) {
    const toks = spec.map(([k, t]) => blk(s, k, t));
    const row = s.h("div", { class: "d2row" }, toks, P(s, "."));
    const qEl = s.h("span", { class: "d2q" }, "");
    const ans = blk(s, ansK, ansText, { size: "s" });
    ans.classList.add("later");
    const arrow = s.h("b", { class: "later", style: { fontSize: "26px", color: "var(--pencil)" } }, "→");
    const qline = s.h("div", { class: "row", style: { gap: "12px", minHeight: "40px", marginTop: "4px", flexWrap: "nowrap" } }, qEl, arrow, ans);
    const el = fig ? ex(s, label, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center" } }, s.h("div", null, row, qline), fig)) : ex(s, label, row, qline);
    el.style.padding = "10px 20px";
    async function run() {
      if (snd) s.sound(...snd); else s.sfx.scribble();
      await type(s, qEl, q);
      await s.wait(250);
      paint(toks[ansIdx], ansK); s.sfx.ding(); bump(s, toks[ansIdx], 0.22);
      await s.show([arrow, ans], "left");
    }
    return { el, run, toks };
  }

  Deck.unit({
    id: "u2", num: 2, title: "Satzglieder und Sätze", color: "#0f766e", soft: "#dcf3ef",
    subtitle: "Bausteine, die man umstellen kann",
    blurb: "Umstellprobe, Satzglieder, Neben- und Relativsätze.",
    goals: [
      "Mit der Umstellprobe Satzglieder finden",
      "Prädikat, Subjekt und Objekte erfragen",
      "Wann? Wo? Wie? Warum? – die Adverbialen",
      "Aussage-, Frage- und Aufforderungssatz",
      "Hauptsatz, Nebensatz, Satzgefüge, Relativsatz",
    ],
    icon(svg, el) {
      [["#1d5bd0", 6, 14, 22], ["#dc3b2a", 32, 14, 30], ["#138a5a", 14, 40, 40]].forEach(([c, x, y, w]) =>
        svg.append(el("rect", { x, y, width: w, height: 18, rx: 5, fill: c, opacity: 0.85 })));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Die Umstellprobe",
        say: "Wir stellen einen Satz um, wie Bausteine. Achte darauf, welche Wörter immer zusammenbleiben.",
        build(s) {
          const B = {
            S: blk(s, "x", "Leon", { label: "", size: "l" }),
            P: blk(s, "x", "spielt", { label: "", size: "l" }),
            Z: blk(s, "x", "am Samstag", { label: "", size: "l" }),
            AO: blk(s, "x", "Fußball", { label: "", size: "l" }),
            pt: P(s, "."),
          };
          B.pt.style.paddingBottom = "34px"; B.pt.style.fontSize = "38px";
          const hist = s.h("div", { class: "stack", style: { gap: "4px" } });
          const sentence = () => orders[oi].map(k => phrase(B[k])).join(" ") + ".";
          const addHist = () => { const line = s.h("p", { class: "t", style: { fontSize: "23px" } }, s.h("b", { class: "pencil" }, (hist.children.length + 1) + ". "), sentence()); if (hist.children.length >= 4) hist.firstChild.remove(); hist.append(line); s.show(line, "left"); };
          const keys = ["S", "P", "Z", "AO"];
          keys.forEach(k => { B[k].lab.textContent = short[k]; B[k].lab.classList.add("later"); });
          const row = s.h("div", { class: "d2row d2loose", style: { justifyContent: "center", minHeight: "120px", alignContent: "center", gap: "14px" } }, keys.map(k => B[k]), B.pt);
          const orders = [["S", "P", "Z", "AO"], ["Z", "P", "S", "AO"], ["AO", "P", "S", "Z"], ["S", "P", "AO", "Z"]];
          let oi = 0;
          const info = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "34px" } }, "Vier Bausteine – wie kann man sie umstellen?");
          const go = async i => {
            oi = i % orders.length;
            s.sfx.whoosh();
            await morph(s, row, B, ordered(B, orders[oi]), { arc: 50, dur: 850 });
            s.sfx.snap(); addHist();
          };
          const btn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); go(oi + 1); } }, "Umstellen!");
          const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "14px 22px" } }, row, info, btn);
          const merk = s.h("div", { class: "merk later" }, "Wörter, die beim Umstellen immer ", s.h("b", null, "zusammenbleiben"), ", bilden ein ", s.h("b", null, "Satzglied"), ". Dieser Satz hat vier Satzglieder.");
          const histCard = s.h("div", { class: "card soft", style: { padding: "12px 20px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "18px", alignItems: "center" } },
            s.h("div", null, s.h("span", { class: "exlabel" }, "Alle Sätze bedeuten dasselbe"), hist), s.photo("fussball", { w: 280, h: 150, caption: "Fußball am Samstag" }));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, card, histCard, merk));
          s.show(card, "up"); s.sound("ball-kick", { vol: 0.7 }); addHist();
          s.step(async () => { await go(1); info.textContent = "„am“ und „Samstag“ sind zusammen umgezogen!"; s.say("Schau, am und Samstag sind zusammen umgezogen."); });
          s.step(async () => { await go(2); info.textContent = "Der Satz klingt anders – aber er bedeutet dasselbe."; s.say("Der Satz klingt anders, aber er bedeutet dasselbe."); });
          s.step(async () => {
            row.classList.remove("d2loose");
            s.sfx.chord([0, 4, 7]);
            for (const k of keys) { paint(B[k], k); bump(s, B[k], 0.2); await s.show(B[k].lab, "pop"); s.sfx.pop(); }
            info.textContent = "Jeder Baustein bekommt eine Farbe: ein Satzglied.";
            await s.show(merk, "up");
            s.say("Wörter, die zusammenbleiben, bilden ein Satzglied.");
          });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Umstellen im Alltag",
        say: "Bei jedem Umstellen bleibt ein Baustein an Platz zwei. Das ist das Prädikat, das Verb.",
        build(s) {
          const SET = [
            ["U-Bahn", [["S", "die U2"], ["P", "fährt"], ["Z", "heute"], ["O", "zum Alexanderplatz"]], [["S", "P", "Z", "O"], ["Z", "P", "S", "O"], ["O", "P", "S", "Z"]]],
            ["Küche", [["S", "Oma"], ["P", "backt"], ["Z", "am Sonntag"], ["AO", "einen Apfelkuchen"]], [["S", "P", "Z", "AO"], ["Z", "P", "S", "AO"], ["AO", "P", "S", "Z"]]],
            ["Musik", [["S", "die Klasse 5a"], ["P", "probt"], ["Z", "heute"], ["O", "in der Aula"]], [["S", "P", "Z", "O"], ["Z", "P", "S", "O"], ["O", "P", "S", "Z"]]],
          ];
          const FIG = [s.photo("alexanderplatz-u2", { w: 150, h: 104 }), s.photo("apfelkuchen", { w: 150, h: 104 }), s.photo("orchesterprobe", { w: 150, h: 104 })];
          s.preload("ubahn-train"); s.preload("ofen-ping"); s.preload("orchester-stimmen");
          const SND = [["ubahn-train", { vol: 0.45, dur: 2.5, fade: 0.6 }], ["ofen-ping", { vol: 0.6 }], ["orchester-stimmen", { vol: 0.5, dur: 3, fade: 0.8 }]];
          const cards = SET.map(([lab, spec, orders], ci) => {
            const B = {};
            spec.forEach(([k, t]) => { B[k] = blk(s, k, t, { num: true }); });
            B.pt = P(s, ".");
            const row = s.h("div", { class: "d2row" }, orders[0].map(k => B[k]), B.pt);
            let oi = 0;
            morph(s, row, B, ordered(B, orders[0]));
            numbers(B, orders[0]);
            const go = async () => {
              oi = (oi + 1) % orders.length;
              s.sound(...SND[ci]);
              await morph(s, row, B, ordered(B, orders[oi]), { arc: 34, dur: 800 });
              numbers(B, orders[oi]); s.sfx.snap(); bump(s, B.P.num, 0.4);
            };
            const btn = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); go(); } }, "Umstellen");
            const el = s.h("div", { class: "ex", style: { display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: "12px", padding: "12px 20px" } },
              s.h("div", null, s.h("span", { class: "exlabel" }, lab), row), FIG[ci], btn);
            return { el, go };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, "Im Aussagesatz steht das ", s.h("b", { style: { color: SG.P.c } }, "Prädikat"), " (das Verb) immer an ", s.h("b", null, "Platz 2"), ". Die anderen Satzglieder dürfen wandern.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, cards.map(c => c.el), merk));
          s.show(cards.map(c => c.el), "left"); s.sfx.whoosh();
          cards.forEach((c, i) => s.step(async () => { await c.go(); s.say(["Heute fährt die U2 zum Alexanderplatz.", "Am Sonntag backt Oma einen Apfelkuchen.", "Heute probt die Klasse 5a in der Aula."][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Die Farben der Satzglieder",
        say: "Jedes Satzglied hat eine eigene Farbe und eine eigene Frage. Diese Farben bleiben im ganzen Kapitel gleich.",
        build(s) {
          const L = [
            ["P", "spielt", "Was tut …? Was geschieht?"],
            ["S", "Leon", "Wer oder was?"],
            ["AO", "den Ball", "Wen oder was?"],
            ["DO", "dem Trainer", "Wem?"],
            ["Z", "am Samstag", "Wann? Wie lange?"],
            ["O", "im Park", "Wo? Wohin? Woher?"],
            ["AW", "mit Freude", "Wie? Auf welche Weise?"],
            ["G", "wegen des Regens", "Warum? Weshalb?"],
          ];
          const names = { P: "Prädikat", S: "Subjekt", AO: "Akkusativobjekt", DO: "Dativobjekt", Z: "Adverbiale der Zeit", O: "Adverbiale des Ortes", AW: "Adverbiale der Art und Weise", G: "Adverbiale des Grundes" };
          const cards = L.map(([k, ex1, q]) => s.h("div", { class: "card later", style: { borderColor: SG[k].c, borderWidth: "3px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" } },
            s.h("span", { class: "h2", style: { fontSize: "21px", color: SG[k].c } }, names[k]),
            s.h("span", { class: "d2q", style: { fontSize: "28px" } }, q),
            blk(s, k, ex1, { size: "s" })));
          const grid = s.h("div", { class: "cols4", style: { gap: "12px" } }, cards);
          const steps = ["1. Prädikat suchen", "2. Subjekt erfragen", "3. Objekte erfragen", "4. Adverbiale erfragen"];
          const way = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 14px" } },
            s.h("div", { class: "row", style: { gap: "10px" } }, steps.map((t, i) => [i ? s.h("b", { class: "pencil" }, "→") : null, s.h("span", { class: "chip", style: { fontSize: "20px", background: "#fff" } }, t)])));
          const exRow = s.h("div", { class: "d2row", style: { justifyContent: "center" } }, [["Z", "Am Samstag"], ["P", "gibt"], ["S", "Leon"], ["DO", "seinem Freund"], ["O", "im Park"], ["AO", "den Ball"]].map(([k, t]) => blk(s, k, t)), P(s, "."));
          const exCard = ex(s, "Ein Satz – sechs Farben", exRow); exCard.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, grid, exCard, way));
          s.sfx.pop();
          s.step(async () => { for (const c of cards.slice(0, 4)) { s.sfx.pop(); s.show(c, "pop"); await s.wait(160); } s.say("Prädikat, Subjekt, Akkusativobjekt und Dativobjekt."); });
          s.step(async () => { for (const c of cards.slice(4)) { s.sfx.pop(); s.show(c, "pop"); await s.wait(160); } s.say("Und vier Adverbiale. Sie antworten auf wann, wo, wie und warum."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(exCard, "up"); const bs = [...exRow.querySelectorAll(".d2tok")]; for (const b of bs) { bump(s, b, 0.2); s.sfx.count(bs.indexOf(b) + 2); await s.wait(150); } s.say("Am Samstag gibt Leon seinem Freund im Park den Ball."); });
          s.step(async () => { s.sfx.ding(); await s.show(way, "up"); s.say("Fang immer mit dem Prädikat an."); });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Das Prädikat: der Motor",
        say: "Das Prädikat ist der Motor des Satzes. Es ist das Verb. Frag, was tut jemand, oder was geschieht.",
        build(s) {
          s.preload("chor-singt"); s.preload("ubahn-tueren");
          const C = [
            qcard(s, "Fußball", [["x", "Der Torwart"], ["x", "hält"], ["x", "den Elfmeter"]], "Was tut der Torwart?", 1, "P", "hält", s.photo("torwart", { w: 210, h: 110 }), ["whistle", { vol: 0.6 }]),
            qcard(s, "Musik", [["x", "Die Klasse"], ["x", "singt"], ["x", "ein Lied"]], "Was tut die Klasse?", 1, "P", "singt", s.photo("kinderchor", { w: 210, h: 110 }), ["chor-singt", { vol: 0.5, dur: 3.5, fade: 0.8 }]),
            qcard(s, "U-Bahn", [["x", "Jetzt"], ["x", "schließen"], ["x", "die Türen"]], "Was geschieht jetzt?", 1, "P", "schließen", s.photo("ubahn-bahnsteig", { w: 210, h: 110 }), ["ubahn-tueren", { vol: 0.6 }]),
          ];
          // Singular / Plural toggle
          const T = { S: blk(s, "S", "Das Kind"), P: blk(s, "P", "singt"), pt: P(s, ".") };
          const trow = s.h("div", { class: "d2row", style: { minHeight: "56px" } }, T.S, T.P, T.pt);
          let pl = false;
          const tog = async () => {
            pl = !pl; s.sfx.boing();
            const [a, b] = pl ? ["Die Kinder", "singen"] : ["Das Kind", "singt"];
            T.S.chip.replaceChildren(...a.split(" ").map((w, i) => s.h("span", { class: i ? "" : "tx" }, w)));
            bump(s, T.S); await flipText(s, T.P.chip, b); bump(s, T.P, 0.25);
          };
          const tbtn = s.h("button", { class: "btn", onclick: tog }, "eins ↔ viele");
          const tcard = s.h("div", { class: "card later", style: { display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("span", { class: "small pencil" }, "Es passt sich dem Subjekt an:"), trow), tbtn);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Suche immer zuerst das ", s.h("b", { style: { color: SG.P.c } }, "Prädikat"), ". Es ist das Verb – ohne Prädikat kein Satz!");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, C.map(c => c.el), s.h("div", { style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "14px" } }, tcard, merk)));
          s.show(C.map(c => c.el), "up"); s.sfx.pop();
          C.forEach((c, i) => s.step(async () => { await c.run(); s.say(["Was tut der Torwart? Er hält.", "Was tut die Klasse? Sie singt.", "Was geschieht? Die Türen schließen."][i]); }));
          s.step(async () => { s.sfx.pop(); await s.show(tcard, "up"); await tog(); s.say("Das Kind singt. Die Kinder singen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Zweiteilige Prädikate",
        say: "Manchmal hat das Prädikat zwei Teile. Der zweite Teil wandert ans Satzende. So entsteht eine Klammer um den Satz.",
        build(s) {
          const R = [
            ["Perfekt", "Fußball", [["S", "Leon"], ["P1", "hat"], ["P2", "geschossen"], ["AO", "ein Tor"]], ["S", "P1", "AO", "P2"]],
            ["trennbares Verb", "Telefon", [["S", "Lea"], ["P1", "ruft"], ["P2", "an"], ["AO", "ihre Oma"]], ["S", "P1", "AO", "P2"]],
            ["mit Modalverb", "Essen", [["S", "wir"], ["P1", "wollen"], ["P2", "essen"], ["Z", "heute"], ["AO", "Pizza"]], ["S", "P1", "Z", "AO", "P2"]],
          ];
          s.preload("telefon-klingelt"); s.preload("besteck");
          const RSND = [["ball-kick", { vol: 0.7 }], ["telefon-klingelt", { vol: 0.5, dur: 2.2, fade: 0.4 }], ["besteck", { vol: 0.7 }]];
          const rows = R.map(([lab, set, spec, fin], ri) => {
            const B = {};
            spec.forEach(([k, t]) => { B[k] = blk(s, k.startsWith("P") ? "P" : k, t); });
            B.pt = P(s, ".");
            const start = spec.map(([k]) => k);
            const row = s.h("div", { class: "d2row", style: { paddingBottom: "24px", flexWrap: "nowrap" } }, start.map(k => B[k]), B.pt);
            morph(s, row, B, ordered(B, start));
            const bar = s.h("div", { class: "d2bar later", style: { borderColor: SG.P.c } });
            row.append(bar);
            const el = s.h("div", { class: "ex", style: { display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "center", padding: "12px 20px" } },
              s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("span", { class: "h2", style: { fontSize: "25px" } }, lab), s.h("span", { class: "exlabel", style: { margin: 0 } }, set)), row);
            const run = async () => {
              s.sound(...RSND[ri]);
              await morph(s, row, B, ordered(B, fin), { arc: 46, dur: 900 });
              const a = B.P1, b = B.P2;
              const x1 = a.offsetLeft + a.offsetWidth / 2, x2 = b.offsetLeft + b.offsetWidth / 2;
              const y = Math.max(a.offsetTop + a.offsetHeight, b.offsetTop + b.offsetHeight) + 2;
              Object.assign(bar.style, { left: x1 + "px", width: x2 - x1 + "px", top: y + "px" });
              bar.classList.remove("later");
              s.sfx.zap();
              await s.tween({ dur: 600, ease: "out", update: v => { bar.style.transform = `scaleX(${v})`; } });
              bar.style.transform = "";
            };
            return { el, run };
          });
          const lf = life(s, "Im Alltag: Durchsage", s.h("div", { style: { display: "grid", gridTemplateColumns: "230px 1fr", gap: "18px", alignItems: "center" } },
            s.photo("hauptbahnhof", { w: 230, h: 120 }),
            s.h("p", { class: "t" }, "„Der Zug ", s.h("b", { class: "red" }, "fährt"), " in Kürze ", s.h("b", { class: "red" }, "ab"), ".“ – abfahren hat zwei Teile.")));
          lf.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Ein zweiteiliges Prädikat bildet eine ", s.h("b", null, "Klammer"), ": Teil 1 an Platz 2, Teil 2 am Ende.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, rows.map(r => r.el), lf, merk));
          s.show(rows.map(r => r.el), "left"); s.sfx.whoosh();
          rows.forEach((r, i) => s.step(async () => { await r.run(); s.say(["Leon hat ein Tor geschossen.", "Lea ruft ihre Oma an.", "Wir wollen heute Pizza essen."][i]); }));
          s.step(async () => { s.sound("ubahn-announce", { vol: 0.5, dur: 4, fade: 0.8 }); await s.show(lf, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Das Subjekt: Wer oder was?",
        say: "Das Subjekt findest du mit der Frage: Wer oder was? Dazu nimmst du das Prädikat mit in die Frage.",
        build(s) {
          const C = [
            qcard(s, "U-Bahn", [["x", "Die U-Bahn"], ["P", "kommt"], ["x", "zu spät"]], "Wer oder was kommt zu spät?", 0, "S", "die U-Bahn", s.photo("u8", { w: 210, h: 110 }), ["ubahn-train", { vol: 0.45, dur: 2.5, fade: 0.6 }]),
            qcard(s, "Zu Hause", [["x", "Meine Schwester"], ["P", "liest"], ["x", "einen Comic"]], "Wer oder was liest einen Comic?", 0, "S", "meine Schwester", s.photo("maedchen-liest", { w: 210, h: 110 }), ["page-turn-2", { vol: 0.8 }]),
            qcard(s, "Fußball", [["x", "Heute"], ["P", "spielt"], ["x", "unsere Mannschaft"], ["x", "im Stadion"]], "Wer oder was spielt heute?", 2, "S", "unsere Mannschaft", s.photo("olympiastadion", { w: 210, h: 110 }), ["crowd-cheer", { vol: 0.45, dur: 2.5, fade: 0.6 }]),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Das ", s.h("b", { style: { color: SG.S.c } }, "Subjekt"), " steht im Nominativ – und nicht immer vorne! Subjekt und Prädikat passen zusammen: ich spiel", s.h("b", null, "e"), ", wir spiel", s.h("b", null, "en"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, C.map(c => c.el), merk));
          s.show(C.map(c => c.el), "up"); s.sfx.pop();
          C.forEach((c, i) => s.step(async () => { await c.run(); s.say(["Wer oder was kommt zu spät? Die U-Bahn.", "Wer oder was liest? Meine Schwester.", "Wer oder was spielt? Unsere Mannschaft. Das Subjekt steht hier in der Mitte."][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "Akkusativobjekt: Wen oder was?",
        say: "Das Akkusativobjekt findest du mit der Frage: Wen oder was?",
        build(s) {
          const C = [
            qcard(s, "Fußball", [["S", "Leon"], ["P", "schießt"], ["x", "den Ball"], ["x", "ins Tor"]], "Wen oder was schießt Leon?", 2, "AO", "den Ball", s.photo("fussball-zweikampf", { w: 210, h: 110 }), ["ball-kick", { vol: 0.7 }]),
            qcard(s, "Einkaufen", [["S", "Mama"], ["P", "kauft"], ["x", "einen Kürbis"]], "Wen oder was kauft Mama?", 2, "AO", "einen Kürbis", s.photo("kuerbisse", { w: 210, h: 110 }), ["cash-register", { vol: 0.5 }]),
            qcard(s, "U-Bahn", [["S", "Der Kontrolleur"], ["P", "prüft"], ["x", "die Fahrkarte"]], "Wen oder was prüft der Kontrolleur?", 2, "AO", "die Fahrkarte", s.photo("fahrkartenautomat", { w: 210, h: 110 })),
          ];
          const art = s.h("span", { style: { display: "inline-block", color: "var(--red)" } }, "der");
          const flip = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", padding: "10px 20px" } },
            s.h("span", { class: "t" }, "Wer oder was? ", s.h("b", null, "der Ball")),
            s.h("span", { class: "t" }, "Wen oder was? ", s.h("b", null, art, " Ball"), s.h("b", { class: "pencil" }, "  ← Akkusativ")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Bei maskulinen Nomen siehst du den Akkusativ am Artikel: ", s.h("b", null, "der → den"), ", ", s.h("b", null, "ein → einen"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, C.map(c => c.el), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, flip, merk)));
          s.show(C.map(c => c.el), "up"); s.sfx.pop();
          C.forEach((c, i) => s.step(async () => { await c.run(); s.say(["Wen oder was schießt Leon? Den Ball.", "Wen oder was kauft Mama? Einen Kürbis.", "Wen oder was prüft der Kontrolleur? Die Fahrkarte."][i]); }));
          s.step(async () => { s.sfx.pop(); await s.show(flip, "up"); await flipText(s, art, "den"); s.sfx.zap(); s.sfx.ding(); await s.show(merk, "up"); s.say("Aus der Ball wird den Ball."); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Dativobjekt: Wem?",
        say: "Das Dativobjekt findest du mit der Frage: Wem? Oft bekommt jemand etwas.",
        build(s) {
          const C = [
            qcard(s, "Fußball", [["S", "Leon"], ["P", "gibt"], ["x", "dem Trainer"], ["AO", "den Ball"]], "Wem gibt Leon den Ball?", 2, "DO", "dem Trainer", s.photo("fussball", { w: 210, h: 100 }), ["whistle", { vol: 0.6 }]),
            qcard(s, "Chat", [["S", "Ich"], ["P", "schreibe"], ["x", "meiner Freundin"], ["AO", "eine Nachricht"]], "Wem schreibe ich eine Nachricht?", 2, "DO", "meiner Freundin", s.photo("handy-tippen", { w: 210, h: 100 })),
            qcard(s, "Restaurant", [["S", "Die Kellnerin"], ["P", "bringt"], ["x", "dem Gast"], ["AO", "die Suppe"]], "Wem bringt die Kellnerin die Suppe?", 2, "DO", "dem Gast", s.photo("tomatensuppe", { w: 210, h: 100 }), ["besteck", { vol: 0.7 }]),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Nach ", s.h("b", null, "helfen, danken, gehören, gefallen"), " steht ein Dativobjekt: Ich helfe ", s.h("b", { style: { color: SG.DO.c } }, "meiner Oma"), ". Das Trikot gehört ", s.h("b", { style: { color: SG.DO.c } }, "mir"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, C.map(c => c.el), merk, legend(s, ["P", "S", "AO", "DO"])));
          s.show(C.map(c => c.el), "up"); s.sfx.pop();
          C.forEach((c, i) => s.step(async () => { await c.run(); s.say(["Wem gibt Leon den Ball? Dem Trainer.", "Wem schreibe ich? Meiner Freundin.", "Wem bringt die Kellnerin die Suppe? Dem Gast."][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "Wann? Wo? Wie? Warum?",
        say: "Adverbiale Bestimmungen erzählen mehr: wann, wo, wie und warum etwas passiert. Schau, wie der Satz wächst.",
        build(s) {
          const B = {
            S: blk(s, "S", "Leon", { label: "Wer?" }),
            P: blk(s, "P", "spielt", { label: "Was tut er?" }),
            AO: blk(s, "AO", "Fußball", { label: "Was?" }),
            Z: blk(s, "Z", "am Samstag", { label: "Wann?" }),
            G: blk(s, "G", "wegen des schönen Wetters", { label: "Warum?" }),
            AW: blk(s, "AW", "begeistert", { label: "Wie?" }),
            O: blk(s, "O", "im Park", { label: "Wo?" }),
            pt: P(s, "."),
          };
          B.pt.style.paddingBottom = "28px";
          const row = s.h("div", { class: "d2row", style: { justifyContent: "center", minHeight: "150px", alignContent: "center", rowGap: "14px" } }, B.S, B.P, B.AO, B.pt);
          const sentCard = s.h("div", { class: "card", style: { padding: "16px" } }, row);
          const Q = [["Z", "Wann?", "Zeit", "auch: um acht Uhr, gestern"], ["G", "Warum?", "Grund", "auch: wegen der Hitze"], ["AW", "Wie?", "Art und Weise", "auch: schnell, mit Mühe"], ["O", "Wo?", "Ort", "auch: im Bus, zu Hause"]];
          const hints = {};
          const qcards = Q.map(([k, q, n, h]) => { hints[k] = s.h("p", { class: "small later", style: { gridArea: "1 / 1", textAlign: "center", color: SG[k].c } }, h); B[k].style.gridArea = "1 / 1"; return s.h("div", { class: "card", style: { borderColor: SG[k].c, borderWidth: "3px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px" } },
            s.h("span", { class: "d2q", style: { color: SG[k].c, fontSize: "38px" } }, q), s.h("span", { class: "small", style: { fontWeight: 700 } }, "Adverbiale: " + n),
            s.h("div", { style: { minHeight: "82px", display: "grid", placeItems: "center", width: "100%" } }, B[k], hints[k])); });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Adverbiale Bestimmungen sagen ", s.h("b", null, "wann, wo, wie"), " und ", s.h("b", null, "warum"), ". Tipp für die Reihenfolge: ", s.h("b", null, "te – ka – mo – lo"), " (Zeit, Grund, Art, Ort).");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, sentCard, s.h("div", { class: "cols4", style: { gap: "12px" } }, qcards), merk));
          s.show(sentCard, "up"); s.show(qcards, "up"); s.sfx.pop();
          const states = [["S", "P", "Z", "AO"], ["S", "P", "Z", "G", "AO"], ["S", "P", "Z", "G", "AW", "AO"], ["S", "P", "Z", "G", "AW", "O", "AO"]];
          const QSND = [["clock-tick", { vol: 0.6, dur: 2, fade: 0.4 }], ["birds", { vol: 0.45, dur: 3, fade: 0.8 }], ["kids-cheer", { vol: 0.5, dur: 2.5, fade: 0.6 }], ["playground", { vol: 0.45, dur: 3, fade: 0.8 }]];
          s.preload("clock-tick"); s.preload("birds"); s.preload("kids-cheer"); s.preload("playground");
          states.forEach((st, i) => s.step(async () => {
            s.sound(...QSND[i]);
            await morph(s, row, B, [...st, "pt"], { arc: 70, dur: 900 });
            s.sfx.snap(); bump(s, B[Q[i][0]], 0.2); s.show(hints[Q[i][0]], "fade");
            s.say(["Wann? Am Samstag.", "Warum? Wegen des schönen Wetters.", "Wie? Begeistert.", "Wo? Im Park."][i]);
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Leon spielt am Samstag wegen des schönen Wetters begeistert im Park Fußball."); });
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: Frage-Scheinwerfer",
        say: "Tippe auf eine Frage. Der Scheinwerfer zeigt dir in jedem Satz die passende Antwort.",
        build(s) {
          const SENT = [
            ["U-Bahn", [["Z", "Heute"], ["P", "fährt"], ["S", "die U-Bahn"], ["G", "wegen einer Baustelle"], ["AW", "langsam"], ["O", "durch den Tunnel"]]],
            ["Küche", [["Z", "Am Abend"], ["P", "rührt"], ["S", "Papa"], ["AO", "die Soße"], ["AW", "vorsichtig"], ["O", "im Topf"]]],
            ["Fußball", [["Z", "Nach dem Spiel"], ["P", "feiern"], ["S", "die Fans"], ["G", "wegen des Sieges"], ["AW", "laut"], ["O", "vor dem Stadion"]]],
          ];
          const all = [];
          const cards = SENT.map(([lab, spec]) => {
            const toks = spec.map(([k, t]) => { const b = blk(s, "x", t); b.dataset.real = k; all.push(b); return b; });
            const el = ex(s, lab, s.h("div", { class: "d2row" }, toks, P(s, ".")));
            el.style.padding = "12px 20px";
            return el;
          });
          const QB = [["Z", "Wann?"], ["O", "Wo?"], ["AW", "Wie?"], ["G", "Warum?"]];
          async function light(k) {
            btns.forEach(b => { const bk = b.dataset.k; if (SG[bk]) b.style.background = bk === k || k === "all" ? SG[bk].b : "#fff"; });
            s.sfx.zap();
            all.forEach(b => {
              const r = b.dataset.real, hit = k === "all" || r === k, known = ["S", "P", "AO"].includes(r);
              paint(b, hit || known ? r : "x");
              b.style.opacity = hit ? "1" : "0.4";
              if (hit) bump(s, b, 0.15);
            });
            if (k !== "all") s.say(QB.find(q => q[0] === k)[1]);
          }
          const btns = QB.map(([k, q]) => { const b = s.h("button", { class: "btn", style: { borderColor: SG[k].c, color: SG[k].c, fontSize: "26px", fontFamily: "var(--f-hand)" }, onclick: () => { s.sfx.click(); light(k); } }, q); b.dataset.k = k; return b; });
          const allB = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); light("all"); } }, "Alle Farben");
          allB.dataset.k = "all";
          btns.push(allB);
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" } }, btns), cards, legend(s, ["P", "S", "AO", "Z", "O", "AW", "G"])));
          s.show(cards, "up"); s.sfx.pop();
          ["Z", "O", "AW", "G"].forEach(k => s.step(async () => { await light(k); }));
          s.step(async () => { await light("all"); s.sound("crowd-cheer", { vol: 0.45, dur: 2.5, fade: 0.6 }); s.say("Alle Satzglieder in Farbe."); });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "Attribute: Beifügungen",
        say: "Attribute beschreiben ein Nomen genauer. Sie sind kein eigenes Satzglied, sondern wandern immer mit ihrem Nomen mit.",
        build(s) {
          const B = {
            S: blk(s, "S", [["der"], ["kleine", 1], ["Bruder"], ["von", 1], ["Lea", 1]]),
            P: blk(s, "P", "isst"),
            AO: blk(s, "AO", [["ein"], ["großes", 1], ["Eis"]]),
            pt: P(s, "."),
          };
          const row = s.h("div", { class: "d2row", style: { justifyContent: "center", minHeight: "70px" } }, B.S, B.P, B.AO, B.pt);
          const orders = [["S", "P", "AO"], ["AO", "P", "S"]];
          let oi = 0;
          morph(s, row, B, ordered(B, orders[0]));
          const go = async () => { oi = 1 - oi; s.sfx.whoosh(); await morph(s, row, B, ordered(B, orders[oi]), { arc: 50, dur: 850 }); s.sfx.snap(); };
          const btn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); go(); } }, "Umstellen!");
          const top = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "18px" } }, row,
            s.h("p", { class: "small pencil" }, "Gepunktet unterstrichen = Attribut. Es zieht mit seinem Nomen um."), btn);
          const T = [
            ["Adjektivattribut", "U-Bahn", [["die "], ["volle", 1], [" U-Bahn"]], "Welche U-Bahn?"],
            ["Präpositionalattribut", "Eisdiele", [["ein Eis "], ["mit Sahne", 1]], "Was für ein Eis?"],
            ["Genitivattribut", "Fußball", [["das Trikot "], ["des Torwarts", 1]], "Wessen Trikot?"],
          ];
          const FIG = [s.photo("volle-bahn", { w: "100%", h: 120, pos: "50% 60%" }), s.photo("eisbecher", { w: "100%", h: 120, pos: "50% 40%" }), s.photo("torwart", { w: "100%", h: 120 })];
          const cards = T.map(([n, lab, parts, q], i) => { const c = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 16px" } },
            FIG[i], s.h("span", { class: "exlabel", style: { margin: 0 } }, lab), s.h("span", { class: "h2", style: { fontSize: "22px" } }, n),
            s.h("p", { class: "t", style: { fontSize: "27px", fontWeight: 700 } }, parts.map(([t, a]) => (a ? s.h("span", { class: "d2att", style: { color: "var(--violet)" } }, t) : t))),
            s.h("span", { class: "d2q", style: { fontSize: "27px" } }, q)); return c; });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Ein ", s.h("b", null, "Attribut"), " ist eine Beifügung zu einem Nomen. Es ist ", s.h("b", null, "Teil eines Satzglieds"), ", kein eigenes Satzglied.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "14px" } }, cards), merk));
          s.show(top, "up"); s.sfx.pop();
          s.step(async () => { await go(); s.say("Ein großes Eis isst der kleine Bruder von Lea. Die Attribute ziehen mit um."); });
          const CSND = [["ubahn-train", { vol: 0.45, dur: 2.5, fade: 0.6 }], ["glass-clink", { vol: 0.7 }], ["whistle", { vol: 0.6 }]];
          cards.forEach((c, i) => s.step(async () => { s.sound(...CSND[i]); await s.show(c, "up"); s.say(["Welche U-Bahn? Die volle.", "Was für ein Eis? Mit Sahne.", "Wessen Trikot? Des Torwarts."][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Satzarten: . ? !",
        say: "Es gibt drei Satzarten: den Aussagesatz, den Fragesatz und den Aufforderungssatz. Das Verb wandert, und das Satzzeichen wechselt.",
        build(s) {
          const B = { S: blk(s, "S", "du", { size: "l" }), P1: blk(s, "P", "kommst", { size: "l" }), Z: blk(s, "Z", "heute", { size: "l" }), P2: blk(s, "P", "mit", { size: "l" }), pt: s.h("span", { class: "d2p", style: { fontSize: "72px", color: "var(--red)", paddingBottom: "0", lineHeight: "1" } }, ".") };
          const row = s.h("div", { class: "d2row", style: { justifyContent: "center", alignItems: "flex-end", minHeight: "90px", gap: "14px" } }, B.S, B.P1, B.Z, B.P2, B.pt);
          const ST = {
            A: [["S", "Du"], ["P1", "kommst"], "Z", "P2", ["pt", "."]],
            F: [["P1", "Kommst"], ["S", "du"], "Z", "P2", ["pt", "?"]],
            B: [["P1", "Komm"], "Z", "P2", ["pt", "!"]],
          };
          const names = { A: ["Aussagesatz", "Verb an Platz 2 – Punkt am Ende."], F: ["Fragesatz", "Verb an Platz 1 – Fragezeichen am Ende."], B: ["Aufforderungssatz", "Verb an Platz 1, oft ohne Subjekt – Ausrufezeichen."] };
          const nm = s.h("p", { class: "big", style: { textAlign: "center", color: "var(--unit)" } }, "");
          const ds = s.h("p", { class: "t", style: { textAlign: "center" } }, "");
          async function set(k) {
            btns.forEach(b => b.classList.toggle("solid", b.dataset.k === k));
            s.sfx.whoosh();
            morph(s, row, B, ST[k], { arc: 40, dur: 800 }).then(() => { s.sfx.pop(); bump(s, B.pt, 0.5); });
            await flipText(s, nm, names[k][0]); ds.textContent = names[k][1];
            s.say({ A: "Du kommst heute mit.", F: "Kommst du heute mit?", B: "Komm heute mit!" }[k]);
          }
          const btns = Object.keys(names).map(k => { const b = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); set(k); } }, names[k][0]); b.dataset.k = k; return b; });
          const top = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "14px 18px" } },
            s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, btns), row, nm, ds);
          const L = [
            ["Im Alltag: Spielbericht", "Unsere Mannschaft hat 2:1 gewonnen", "."],
            ["Im Alltag: Chat", "Kommst du heute zum Training", "?"],
            ["Im Alltag: Klassenzimmer", "Pack bitte dein Heft ein", "!"],
          ];
          const lifes = L.map(([lab, t, p]) => { const c = life(s, lab, s.h("p", { class: "t" }, t, s.h("b", { class: "red", style: { fontSize: "32px" } }, p))); c.classList.add("later"); return c; });
          const w = s.h("p", { class: "small pencil later", style: { textAlign: "center" } }, "Auch mit Fragewort: „Wann kommst du mit?“ – dann steht das Verb an Platz 2.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Am Satzzeichen erkennst du die Satzart: ", s.h("b", { class: "red" }, " .  "), "Aussage, ", s.h("b", { class: "red" }, " ?  "), "Frage, ", s.h("b", { class: "red" }, " !  "), "Aufforderung.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "14px" } }, lifes), w, merk));
          morph(s, row, B, ST.A); nm.textContent = names.A[0]; ds.textContent = names.A[1]; btns[0].classList.add("solid");
          s.show(top, "up"); s.sfx.pop();
          s.step(async () => { await set("F"); });
          s.step(async () => { await set("B"); });
          const LSND = [["crowd-cheer", { vol: 0.45, dur: 2.5, fade: 0.6 }], ["keyboard", { vol: 0.5, dur: 1.5, fade: 0.3 }], ["school-bell", { vol: 0.45, dur: 2.5, fade: 0.6 }]];
          s.preload("crowd-cheer"); s.preload("keyboard"); s.preload("school-bell");
          lifes.forEach((c, i) => s.step(async () => { s.sound(...LSND[i]); await s.show(c, "up"); }));
          s.step(async () => { s.sfx.pop(); await s.show(w, "fade"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Hauptsatz und Nebensatz",
        say: "Ein Hauptsatz kann allein stehen. Ein Nebensatz nicht. Er beginnt mit weil, dass oder wenn, und sein Verb rutscht ans Ende.",
        build(s) {
          const ROWS = [
            ["weil", "Schule", "Ich bleibe zu Hause . Ich bin krank .", [1, 6], "0 1 2 3 C K 5:ich 7 6 8"],
            ["dass", "Chat", "Ich weiß es . Du gewinnst heute .", [1, 5], "0 1 C K 4:du 6 5 7"],
            ["wenn", "Fußball", "Wir spielen draußen . Es regnet nicht .", [1, 5], "0 1 2 C K 4:es 6 5 7"],
          ];
          const HS = "#0f766e", NS = "#b45309";
          const rows = ROWS.map(([k, lab, txt, verbs, fin]) => {
            const words = txt.split(" ");
            const toks = {};
            words.forEach((w, i) => { toks[i] = /^[.?!,]$/.test(w) ? s.h("span", { class: "d2p", style: { fontSize: "29px", paddingBottom: "0" } }, w) : s.h("span", { class: "tx", style: { display: "inline-block", fontSize: "29px", fontWeight: verbs.includes(i) ? 700 : 400, color: verbs.includes(i) ? SG.P.c : "" } }, w); });
            toks.K = s.h("span", { class: "d2b s later", style: { borderColor: KONJ.c, background: KONJ.b } }, k);
            toks.C = s.h("span", { class: "d2p later", style: { fontSize: "29px", paddingBottom: "0" } }, ",");
            const row = s.h("div", { class: "d2row", style: { gap: "8px", alignItems: "baseline", flexWrap: "nowrap", paddingBottom: "40px" } }, words.map((_, i) => toks[i]));
            const state = fin.split(" ").map(x => { const [id, t] = x.split(":"); return t ? [id, t] : id; });
            const barH = s.h("div", { class: "d2bar later", style: { borderColor: HS } }), barN = s.h("div", { class: "d2bar later", style: { borderColor: NS } });
            const labH = s.h("span", { class: "d2lab later", style: { position: "absolute", color: HS } }, "Hauptsatz");
            const labN = s.h("span", { class: "d2lab later", style: { position: "absolute", color: NS } }, "Nebensatz – Verb am Ende");
            row.append(barH, barN, labH, labN);
            const el = s.h("div", { class: "ex", style: { display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", padding: "12px 18px 4px" } },
              s.h("div", { class: "stack", style: { gap: "4px", alignItems: "flex-start" } }, s.h("span", { class: "d2tag", style: { background: KONJ.c } }, k), s.h("span", { class: "small pencil" }, lab)), row);
            const run = async () => {
              if (k === "weil") s.sound("husten", { vol: 0.7 }); else if (k === "wenn") s.sound("rain", { vol: 0.4, dur: 3, fade: 0.8 }); else s.sfx.whoosh();
              await morph(s, row, toks, state, { arc: 40, dur: 900 });
              s.sfx.snap();
              const seq = state.map(x => toks[Array.isArray(x) ? x[0] : x]);
              const ci = seq.indexOf(toks.C);
              const span = (a, b) => { const l = a.offsetLeft, r = b.offsetLeft + b.offsetWidth; return [l, r]; };
              const [h1, h2] = span(seq[0], seq[ci - 1]);
              const [n1, n2] = span(seq[ci + 1], seq[seq.length - 2]);
              const y = seq[0].offsetTop + seq[0].offsetHeight + 4;
              Object.assign(barH.style, { left: h1 + "px", width: h2 - h1 + "px", top: y + "px" });
              Object.assign(barN.style, { left: n1 + "px", width: n2 - n1 + "px", top: y + "px" });
              Object.assign(labH.style, { left: h1 + "px", top: y + 18 + "px" });
              Object.assign(labN.style, { left: n1 + "px", top: y + 18 + "px" });
              await s.show([barH, labH], "fade"); s.sfx.pop();
              await s.show([barN, labN], "fade"); s.sfx.pop();
            };
            return { el, run };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Der ", s.h("b", { style: { color: NS } }, "Nebensatz"), " kann nicht allein stehen. Er beginnt mit ", s.h("b", null, "weil, dass, wenn"), " … – das Verb steht am Ende. Dazwischen steht ein ", s.h("b", null, "Komma"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, rows.map(r => r.el), merk));
          s.show(rows.map(r => r.el), "left"); s.sfx.whoosh();
          rows.forEach((r, i) => s.step(async () => { await r.run(); s.say(["Ich bleibe zu Hause, weil ich krank bin.", "Ich weiß, dass du heute gewinnst.", "Wir spielen draußen, wenn es nicht regnet."][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Satzreihe und Satzgefüge",
        say: "Zwei Hauptsätze zusammen sind eine Satzreihe. Ein Hauptsatz mit einem Nebensatz ist ein Satzgefüge. Stell dir Züge vor.",
        build(s) {
          const car = (cls, parts) => s.h("span", { class: "d2car " + cls }, parts.map(([t, v]) => s.h("span", { style: v ? { color: cls === "d2lok" ? "#ffd94a" : SG.P.c, textDecoration: "underline", textUnderlineOffset: "5px" } : null }, t)));
          const cpl = t => s.h("span", { class: "d2cpl" }, s.h("span", { class: "d2b s", style: { borderColor: KONJ.c, background: KONJ.b } }, t));
          const train1 = s.h("div", { class: "row", style: { gap: "0", flexWrap: "nowrap" } },
            car("d2lok", [["Ich"], ["nehme", 1], ["die U-Bahn,"]]), cpl("denn"), car("d2lok", [["es"], ["regnet", 1], ["heute."]]));
          const train2 = s.h("div", { class: "row", style: { gap: "0", flexWrap: "nowrap" } },
            car("d2lok", [["Ich"], ["nehme", 1], ["die U-Bahn,"]]), cpl("weil"), car("d2wag", [["es"], ["heute"], ["regnet.", 1]]));
          const block = (title, formula, train, exs) => {
            const tr = s.h("div", { style: { overflow: "visible" } }, train);
            const exEls = s.h("div", { class: "stack later", style: { gap: "4px" } }, exs.map(e => s.h("p", { class: "t", style: { fontSize: "23px" } }, e)));
            const el = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "14px 20px" } },
              s.h("div", { class: "row", style: { gap: "14px" } }, s.h("span", { class: "h2" }, title), s.h("span", { class: "small pencil" }, formula)), tr, exEls);
            return { el, tr, train, exEls };
          };
          const b1 = block("Satzreihe", "Hauptsatz + Hauptsatz", train1, ["Lea spielt Geige, aber Tom spielt Klavier.", "Wir gehen ins Kino oder wir spielen Fußball."]);
          const b2 = block("Satzgefüge", "Hauptsatz + Nebensatz", train2, ["Wir gehen raus, wenn die Sonne scheint.", "Mama sagt, dass das Essen fertig ist."]);
          [b1, b2].forEach(b => b.train.classList.add("later"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Ein Hauptsatz ist eine ", s.h("b", null, "Lok"), " – er fährt allein. Ein Nebensatz ist ein ", s.h("b", null, "Wagen"), " – er braucht eine Lok. Das Verb steht im Wagen ganz hinten.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, b1.el, b2.el, merk));
          s.sfx.pop();
          const drive = async b => {
            b.train.classList.remove("later");
            if (s.fast) return;
            s.sound("ubahn-train", { vol: 0.45, dur: 2.5, fade: 0.7 });
            await s.tween({ dur: 1000, ease: "out", update: v => { b.train.style.transform = `translateX(${(1 - v) * -1100}px)`; } });
            b.train.style.transform = "";
          };
          s.step(async () => { await drive(b1); s.sfx.ding(); s.say("Ich nehme die U-Bahn, denn es regnet heute. Zwei Loks, also zwei Hauptsätze."); });
          s.step(async () => { s.sound("geige", { vol: 0.5, dur: 2.5, fade: 0.6 }); await s.show(b1.exEls, "up"); });
          s.step(async () => { await drive(b2); s.sfx.ding(); s.say("Ich nehme die U-Bahn, weil es heute regnet. Der Nebensatz ist ein Wagen. Sein Verb steht hinten."); });
          s.step(async () => { s.sound("birds", { vol: 0.4, dur: 2.5, fade: 0.6 }); await s.show(b2.exEls, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------------- */
      {
        title: "Komma bei Aufzählungen",
        say: "Zählst du mehrere Dinge auf, trennst du sie mit einem Komma. Vor und und oder steht kein Komma.",
        build(s) {
          const RED = "var(--red)";
          const items = ["Eis", "Käse", "Olivenöl", "Toast"];
          const word = t => s.h("span", { class: "d2b", style: { borderColor: SG.AO.c, background: SG.AO.b, fontSize: "25px" } }, t);
          const comma = () => s.h("b", { class: "later", style: { font: "700 44px/1 var(--f-display)", color: RED, alignSelf: "flex-end", marginLeft: "-8px" } }, ",");
          const W = items.map(word), C = [comma(), comma(), comma()];
          const und = s.h("span", { class: "d2b later", style: { borderColor: KONJ.c, background: KONJ.b } }, "und");
          const no = s.h("span", { class: "later", "data-overlap-ok": "", style: { position: "relative", display: "inline-block", alignSelf: "flex-end" } },
            s.h("b", { style: { font: "700 44px/1 var(--f-display)", color: "#a3adbb" } }, ","),
            s.h("b", { style: { position: "absolute", left: "-6px", top: "-4px", font: "700 34px/1 var(--f-display)", color: RED } }, "✕"));
          const row = s.h("div", { class: "row", style: { gap: "9px", alignItems: "flex-end", flexWrap: "nowrap" } },
            s.h("span", { class: "d2b", style: { borderColor: "#a3adbb", fontSize: "25px" } }, "Ich kaufe"), W[0], C[0], W[1], C[1], W[2], no, und, W[3], P(s, "."));
          W.forEach(w => w.classList.add("later"));
          const pic = s.photo("einkaufszettel", { w: 300, h: 300, pos: "50% 30%", caption: "Ein echter Einkaufszettel" });
          const top = s.h("div", { style: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "22px", alignItems: "center" } }, pic,
            s.h("div", { class: "stack", style: { gap: "14px" } },
              s.h("p", { class: "t" }, "Auf dem Zettel steht alles untereinander. Im Satz brauchst du dafür ", s.h("b", { style: { color: RED } }, "Kommas"), "."),
              s.h("div", { class: "card", style: { padding: "16px 18px" } }, row)));
          const L = [
            ["Im Alltag: Klassenfahrt", "Ich packe Schlafsack", ", ", "Taschenlampe", ", ", "Zahnbürste", " und ", "Badehose ein."],
            ["Im Alltag: Pizzeria", "Möchtest du Salami", ", ", "Pilze", ", ", "Schinken", " oder ", "Tomaten?"],
            ["Im Alltag: Wetter", "Heute ist es kalt", ", ", "nass", ", ", "windig", " und ", "grau."],
          ];
          const lifes = L.map(([lab, ...parts]) => { const c = life(s, lab, s.h("p", { class: "t", style: { fontSize: "22px" } }, parts.map(p => p.trim() === "," ? [s.h("b", { style: { color: RED, fontSize: "30px" } }, ","), " "] : /^ (und|oder) $/.test(p) ? s.h("b", { style: { color: KONJ.c } }, p) : p))); c.classList.add("later"); return c; });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Bei Aufzählungen trennt ein ", s.h("b", { style: { color: RED } }, "Komma"), " die Teile. Vor ", s.h("b", null, "und"), " und ", s.h("b", null, "oder"), " steht ", s.h("b", null, "kein"), " Komma – die Wörter übernehmen seine Arbeit.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "12px" } }, lifes), merk));
          s.show(pic, "zoom"); s.sfx.pop();
          s.step(async () => { s.sound("pencil-write", { vol: 0.5, dur: 1.6 }); for (let i = 0; i < 3; i++) { await s.show(W[i], "pop"); s.sfx.pop(); if (i < 2) { await s.show(C[i], "bounce"); s.sfx.tick(); } } s.say("Ich kaufe Eis, Käse, Olivenöl …"); });
          s.step(async () => { await s.show(no, "pop"); s.sfx.error(); await s.show(und, "zoom"); s.sfx.snap(); await s.show(W[3], "pop"); s.sfx.ding(); s.say("Ich kaufe Eis, Käse, Olivenöl und Toast. Vor und steht kein Komma."); });
          s.step(async () => { s.sound("zipper", { vol: 0.5, dur: 1.2 }); await s.show(lifes[0], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lifes[1], "up"); s.say("Auch vor oder steht kein Komma."); });
          s.step(async () => { s.sound("wind", { vol: 0.35, dur: 2.5, fade: 0.6 }); await s.show(lifes[2], "up"); s.say("Auch Adjektive kann man aufzählen."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16 ----------------------------------------------------------------- */
      {
        title: "Komma vor aber, weil, dass …",
        say: "Vor aber, sondern und denn steht ein Komma. Und zwischen Hauptsatz und Nebensatz steht immer ein Komma.",
        build(s) {
          const HS = "#0f766e", NS = "#b45309", RED = "var(--red)";
          const MSG = [
            [0, "Ich will mit", "aber", "ich muss erst Hausaufgaben machen.", "HS"],
            [1, "Wir fahren nicht mit dem Bus", "sondern", "mit dem Fahrrad.", "HS"],
            [0, "Nimm eine Jacke mit", "denn", "es wird kalt.", "HS"],
            [1, "Ich bin spät dran", "weil", "die U8 Verspätung hat.", "NS"],
            [0, "Ich komme", "obwohl", "es regnet.", "NS"],
            [1, "", "Wenn", "ich da bin, rufe ich dich an.", "NS"],
          ];
          const bub = ([me, a, k, b, typ]) => {
            const kEl = s.h("b", { style: { color: typ === "HS" ? HS : NS } }, k);
            const cm = s.h("b", { style: { color: RED, fontSize: "28px" } }, ",");
            let kids;
            if (!a) { const [x, ...rest] = b.split(", "); kids = [kEl, " " + x, cm, " " + rest.join(", ")]; }
            else kids = [a, cm, " ", kEl, " " + b];
            const el = s.h("div", { class: "later", style: { alignSelf: me ? "flex-end" : "flex-start", maxWidth: "88%", background: me ? "#d9fdd3" : "#fff", border: "2px solid " + (me ? "#a6e3a0" : "#d5dde6"), borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "6px 12px", font: "400 20px/1.3 var(--f-body)", color: "var(--ink)" } }, ...kids);
            el.cm = cm; return el;
          };
          const bubs = MSG.map(bub);
          const phone = s.h("div", { style: { width: "470px", height: "100%", boxSizing: "border-box", background: "#1b2740", borderRadius: "34px", padding: "12px" } },
            s.h("div", { style: { height: "100%", boxSizing: "border-box", background: "#ece5dd", borderRadius: "24px", display: "flex", flexDirection: "column", overflow: "hidden" } },
              s.h("div", { style: { background: "#0f766e", color: "#fff", font: "700 20px/1 var(--f-display)", padding: "12px 16px" } }, "Lea"),
              s.h("div", { style: { flex: "1", display: "flex", flexDirection: "column", gap: "8px", padding: "10px 12px", justifyContent: "flex-start" } }, bubs)));
          const card = (title, color, words, note) => s.h("div", { class: "card later", style: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("p", { class: "small", style: { fontWeight: 700, color } }, title),
            s.h("div", { class: "row", style: { gap: "8px" } }, words.map(w => s.h("span", { class: "d2b s", style: { borderColor: color, background: "#fff", fontSize: "21px" } }, w))),
            s.h("p", { class: "small" }, note));
          const c1 = card("Hauptsatz + Hauptsatz", HS, [", aber", ", sondern", ", denn"], "Gegensatz oder Grund: Komma davor.");
          const c2 = card("Hauptsatz + Nebensatz", NS, [", weil", ", dass", ", wenn", ", als", ", obwohl"], "Der Nebensatz wird immer mit Komma abgetrennt – auch wenn er vorne steht.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 16px 12px" } }, "Vor ", s.h("b", null, "aber, sondern, denn"), " und zwischen ", s.h("b", { style: { color: HS } }, "Hauptsatz"), " und ", s.h("b", { style: { color: NS } }, "Nebensatz"), " steht ein ", s.h("b", { style: { color: RED } }, "Komma"), ".");
          const pic = s.photo("handy-tippen", { w: "100%", h: 170, pos: "50% 50%", caption: "Auch im Chat zählt das Komma.", cls: "later" });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "22px", height: "100%" } }, phone, s.h("div", { class: "stack", style: { gap: "14px" } }, c1, c2, merk, pic)));
          s.sfx.pop();
          const post = async i => { s.sound("keyboard", { vol: 0.4, dur: 0.8 }); await s.show(bubs[i], i % 2 ? "left" : "right"); bubs[i].cm.classList.add("a-bounce"); s.sfx.tick(); s.say(MSG[i].slice(1, 4).filter(Boolean).join(" ")); };
          s.step(async () => { await post(0); });
          s.step(async () => { await post(1); });
          s.step(async () => { await post(2); s.sfx.ding(); await s.show(c1, "up"); });
          s.step(async () => { await post(3); });
          s.step(async () => { await post(4); });
          s.step(async () => { await post(5); s.sfx.ding(); await s.show(c2, "up"); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); s.show(pic, "zoom"); });
        },
      },
      /* 16a ---------------------------------------------------------------- */
      {
        title: "Der Relativsatz",
        say: "Ein Relativsatz erklärt ein Nomen genauer. Er beginnt mit der, die oder das. Und wie in jedem Nebensatz steht das Verb am Ende.",
        build(s) {
          const NS = "#b45309", RED = "var(--red)";
          const GEN = { der: "#1d5bd0", die: "#dc3b2a", das: "#138a5a" };
          const wd = (t, st) => s.h("span", { class: "tx", style: Object.assign({ display: "inline-block", fontSize: "40px" }, st || {}) }, t);
          const toks = {
            a: wd("Der"), n: s.h("span", { class: "tx hl", style: { display: "inline-block", fontSize: "40px", fontWeight: 700 } }, "Hund"),
            c1: s.h("span", { class: "d2p", style: { fontSize: "40px", color: RED, display: "none" } }, ","),
            r: s.h("span", { class: "d2b", style: { borderColor: NS, background: "#fdecd9", fontSize: "36px", display: "none" } }, "der"),
            o: wd("im Park", { display: "none" }), v: wd("bellt", { display: "none", fontWeight: 700, color: SG.P.c }),
            c2: s.h("span", { class: "d2p", style: { fontSize: "40px", color: RED, display: "none" } }, ","),
            p: wd("gehört"), l: wd("Lea"), pt: s.h("span", { class: "d2p", style: { fontSize: "40px" } }, "."),
          };
          const row = s.h("div", { class: "d2row", style: { gap: "10px", alignItems: "baseline", flexWrap: "nowrap", padding: "76px 10px 44px", justifyContent: "center" } }, Object.values(toks));
          const arc = s.svg(100, 100); Object.assign(arc.style, { position: "absolute", left: "0", top: "0", pointerEvents: "none", overflow: "visible" });
          const path = s.el("path", { class: "later", d: "M0 0", fill: "none", stroke: NS, "stroke-width": 4, "stroke-linecap": "round" });
          const head = s.el("path", { class: "later", d: "M0 0", fill: NS });
          arc.append(path, head);
          const labR = s.h("span", { class: "d2lab later", style: { position: "absolute", color: NS } }, "Relativpronomen");
          const labV = s.h("span", { class: "d2lab later", style: { position: "absolute", color: SG.P.c } }, "Verb am Ende");
          const labN = s.h("span", { class: "d2lab later", style: { position: "absolute", color: "var(--ink)" } }, "Nomen");
          row.append(arc, labR, labV, labN);
          const place = () => {
            const W = row.offsetWidth, H = row.offsetHeight;
            arc.setAttribute("viewBox", `0 0 ${W} ${H}`); arc.style.width = W + "px"; arc.style.height = H + "px";
            const cx = e => e.offsetLeft + e.offsetWidth / 2;
            const x1 = cx(toks.r), x2 = cx(toks.n), y1 = toks.r.offsetTop - 4, y2 = toks.n.offsetTop - 2;
            path.setAttribute("d", `M${x1} ${y1} C${x1} ${y1 - 54} ${x2} ${y2 - 54} ${x2} ${y2 - 10}`);
            head.setAttribute("d", `M${x2 - 10} ${y2 - 18} L${x2} ${y2 - 2} L${x2 + 10} ${y2 - 18} Z`);
            const yb = toks.v.offsetTop + toks.v.offsetHeight + 6;
            Object.assign(labR.style, { left: toks.r.offsetLeft + "px", top: yb + "px" });
            Object.assign(labV.style, { left: toks.v.offsetLeft + "px", top: yb + "px" });
            Object.assign(labN.style, { left: toks.n.offsetLeft + toks.n.offsetWidth / 2 - labN.offsetWidth / 2 + "px", top: yb + "px" });
          };
          const top = s.h("div", { class: "card", style: { padding: "4px 18px" } }, row);
          const ex3 = [
            ["der", "Bus", "Der ", "Bus", ", ", "der", " zum Alexanderplatz ", "fährt", ", ist voll.", () => s.sound("ubahn-train", { vol: .35, dur: 1.6, fade: .5 })],
            ["die", "Pizza", "Die ", "Pizza", ", ", "die", " im Ofen ", "backt", ", duftet.", () => s.sound("sizzle", { vol: .4, dur: 1.4 })],
            ["das", "Eis", "Das ", "Eis", ", ", "das", " in der Sonne ", "schmilzt", ", tropft.", () => s.sound("water-pour", { vol: .4, dur: 1.4 })],
          ].map(([g, n, a, nn, c, rp, mid, vb, rest, snd]) => {
            const col = GEN[g];
            const el = s.h("div", { class: "card later", style: { padding: "16px 18px", borderTop: "6px solid " + col, display: "flex", flexDirection: "column", gap: "6px" } },
              s.h("p", { class: "small", style: { fontWeight: 700, color: col, fontSize: "21px" } }, g + " " + n + " → " + rp),
              s.h("p", { class: "t", style: { fontSize: "26px", lineHeight: 1.35 } }, a, s.h("b", { style: { color: col } }, nn), s.h("b", { style: { color: RED } }, c.trim()), " ", s.h("b", { style: { color: col, textDecoration: "underline", textUnderlineOffset: "5px" } }, rp), mid, s.h("b", { style: { color: SG.P.c } }, vb), s.h("b", { style: { color: RED } }, ","), rest.slice(1)));
            el.snd = snd; return el;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "24px", padding: "12px 20px 14px" } }, "Ein ", s.h("b", { style: { color: NS } }, "Relativsatz"), " erklärt ein Nomen genauer. Er beginnt mit ", s.h("b", null, "der, die, das"), " – passend zum Nomen. Das ", s.h("b", { style: { color: SG.P.c } }, "Verb"), " steht am Ende, und ein ", s.h("b", { style: { color: RED } }, "Komma"), " trennt ihn ab.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "16px" } }, ex3), merk));
          s.show(top, "up"); s.sfx.pop();
          s.step(async () => {
            s.sound("hund-bellt", { vol: .5, dur: 1.2 });
            await morph(s, row, toks, ["a", "n", "c1", "r", "o", "v", "c2", "p", "l", "pt"], { arc: 40, dur: 900 });
            s.sfx.snap(); place(); s.say("Der Hund, der im Park bellt, gehört Lea.");
          });
          s.step(async () => { place(); s.sfx.swoosh(); s.show(path, "draw"); await s.wait(s.fast ? 0 : 700); s.show(head, "pop"); s.sfx.ding(); await s.show([labR, labN], "fade"); s.say("Das Wort der zeigt zurück auf den Hund."); });
          s.step(async () => { place(); s.sfx.pop(); bump(s, toks.v, 0.3); await s.show(labV, "fade"); s.say("Bellt steht ganz am Ende."); });
          ex3.forEach((e, i) => s.step(async () => { e.snd(); await s.show(e, "up"); s.say(["der Bus, der", "die Pizza, die", "das Eis, das"][i]); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16b ---------------------------------------------------------------- */
      {
        title: "Relativsatz: Komma davor und danach",
        say: "Steht der Relativsatz mitten im Satz, braucht er zwei Kommas: eins davor und eins danach. Steht er am Ende, reicht eins.",
        build(s) {
          const NS = "#b45309", RED = "var(--red)";
          const wd = (t, st) => s.h("span", { class: "tx", style: Object.assign({ display: "inline-block", fontSize: "26px", whiteSpace: "nowrap" }, st || {}) }, t);
          const cm = () => s.h("span", { class: "tx", style: { fontSize: "32px", fontWeight: 700, color: RED, display: "none", marginLeft: "-6px" } }, ",");
          const rel = (t, st) => s.h("span", { class: "tx", style: Object.assign({ display: "none", fontSize: "26px", whiteSpace: "nowrap", color: NS, fontWeight: 700 }, st || {}) }, t);
          const dot = () => s.h("span", { class: "tx", style: { fontSize: "27px", fontWeight: 700, marginLeft: "-6px" } }, ".");
          /* A: eingeschoben */
          const A = { a: wd("Meine"), b: wd("Oma"), c1: cm(), r: rel("die"), m: rel("in Hamburg"), v: rel("wohnt", { color: SG.P.c }), c2: cm(), p: wd("kommt"), z: wd("morgen"), pt: dot() };
          const rowA = s.h("div", { class: "d2row", style: { gap: "8px", alignItems: "baseline", flexWrap: "nowrap", minHeight: "48px" } }, Object.values(A));
          /* B: am Ende */
          const Bt = { z: wd("Morgen"), p: wd("kommt"), a: wd("meine"), b: wd("Oma"), c1: cm(), r: rel("die"), m: rel("in Hamburg"), v: rel("wohnt", { color: SG.P.c }), pt: dot() };
          const rowB = s.h("div", { class: "d2row", style: { gap: "8px", alignItems: "baseline", flexWrap: "nowrap", minHeight: "48px" } }, Object.values(Bt));
          const fullA = ["a", "b", "c1", "r", "m", "v", "c2", "p", "z", "pt"], baseA = ["a", "b", "p", "z", "pt"];
          let inA = false;
          const toggleA = async () => { inA = !inA; s.sfx.whoosh(); await morph(s, rowA, A, inA ? fullA : baseA, { arc: 36, dur: 800 }); if (inA) { s.sfx.snap(); bump(s, A.c1, .5); bump(s, A.c2, .5); } else s.sfx.pop(); };
          const bA = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); toggleA(); } }, "Relativsatz rein / raus");
          const tagA = s.h("span", { class: "d2tag later", style: { background: NS } }, "in der Mitte: 2 Kommas");
          const tagB = s.h("span", { class: "d2tag later", style: { background: NS } }, "am Ende: 1 Komma");
          const cardA = s.h("div", { class: "card", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "10px" } }, s.h("div", { class: "row", style: { gap: "12px" } }, s.h("span", { class: "h2", style: { fontSize: "25px" } }, "Eingeschoben"), tagA), rowA, s.h("div", null, bA));
          const cardB = s.h("div", { class: "card later", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "10px" } }, s.h("div", { class: "row", style: { gap: "12px" } }, s.h("span", { class: "h2", style: { fontSize: "25px" } }, "Am Satzende"), tagB), rowB);
          /* welcher */
          const pr = s.h("b", { style: { color: NS, display: "inline-block" } }, "der");
          let wel = false;
          const flipW = async () => { wel = !wel; s.sfx.click(); await flipText(s, pr, wel ? "welcher" : "der"); s.sfx.pop(); };
          const bW = s.h("button", { class: "btn", onclick: () => flipW() }, "der ↔ welcher");
          const cardW = s.h("div", { class: "card soft later", style: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" } },
            s.h("p", { class: "t", style: { fontSize: "23px" } }, "Der Bus", s.h("b", { style: { color: RED } }, ","), " ", pr, " zum Zoo fährt", s.h("b", { style: { color: RED } }, ","), " ist voll."),
            s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, bW, s.h("p", { class: "small pencil" }, "welcher, welche, welches gehen auch – klingen aber eher altmodisch.")));
          const L = [
            ["Im Alltag: Schule", "Die Lehrerin", "die Musik unterrichtet", "spielt Geige."],
            ["Im Alltag: Lesen", "Das Buch", "das ich gerade lese", "ist spannend."],
          ].map(([lab, a, r, b]) => { const c = life(s, lab, s.h("p", { class: "t", style: { fontSize: "22px" } }, a, s.h("b", { style: { color: RED } }, ","), " ", s.h("span", { style: { color: NS } }, r), s.h("b", { style: { color: RED } }, ","), " " + b)); c.classList.add("later"); c.style.padding = "10px 16px"; return c; });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px", padding: "12px 18px 14px" } }, "Der Relativsatz ist ein Nebensatz. Er wird ", s.h("b", null, "immer"), " mit ", s.h("b", { style: { color: RED } }, "Komma"), " abgetrennt – in der Mitte ", s.h("b", null, "davor und danach"), ".");
          [A.c1, A.r, A.m, A.v, A.c2].forEach(e => (e.style.display = "none"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "700px 1fr", gap: "16px", height: "100%", alignContent: "start" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, cardA, cardB, merk), s.h("div", { class: "stack", style: { gap: "14px" } }, cardW, ...L)));
          s.show(cardA, "up"); s.sfx.pop();
          s.step(async () => { await toggleA(); s.show(tagA, "pop"); s.say("Meine Oma, die in Hamburg wohnt, kommt morgen. Zwei Kommas."); });
          s.step(async () => { await toggleA(); s.say("Ohne Relativsatz klappt der Satz auch. Der Relativsatz ist nur eine Zusatz-Info."); });
          s.step(async () => { await toggleA(); s.sfx.whoosh(); await s.show(cardB, "up"); await morph(s, rowB, Bt, ["z", "p", "a", "b", "c1", "r", "m", "v", "pt"], { arc: 30, dur: 700 }); s.sfx.snap(); s.show(tagB, "pop"); s.say("Morgen kommt meine Oma, die in Hamburg wohnt. Nur ein Komma."); });
          s.step(async () => { s.sound("ubahn-announce", { vol: .35, dur: 2, fade: .5 }); await s.show(cardW, "up"); await flipW(); s.say("Der Bus, welcher zum Zoo fährt, ist voll."); });
          s.step(async () => { s.sound("geige", { vol: .4, dur: 2, fade: .6 }); await s.show(L[0], "up"); s.sound("page-turn-2", { vol: .7 }); await s.show(L[1], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16c ---------------------------------------------------------------- */
      {
        title: "das oder dass?",
        say: "Das Relativpronomen das schreibt man mit einem s. Die Probe: Kannst du es durch welches ersetzen? Dann ist es das. Wenn nicht, schreibst du dass.",
        build(s) {
          const NS = "#b45309", RED = "var(--red)", GR = "#138a5a";
          const ROWS = [
            ["Das Fahrrad, ", "das", " im Hof steht, gehört mir.", true, () => s.sound("bike-bell", { vol: .5 })],
            ["Ich hoffe, ", "dass", " es morgen nicht regnet.", false, () => s.sound("rain", { vol: .35, dur: 2, fade: .6 })],
            ["Das Lied, ", "das", " wir im Orchester spielen, ist schwer.", true, () => s.sound("orchester-stimmen", { vol: .35, dur: 2, fade: .6 })],
            ["Mama sagt, ", "dass", " das Essen fertig ist.", false, () => s.sound("ofen-ping", { vol: .5 })],
          ];
          const rows = ROWS.map(([a, w, b, rel, snd]) => {
            const word = s.h("b", { style: { display: "inline-block", color: rel ? NS : "#5d6678", textDecoration: "underline", textUnderlineOffset: "6px" } }, w);
            const res = s.h("span", { class: "d2tag later", style: { background: rel ? GR : RED, justifySelf: "start" } }, rel ? "welches passt → das" : "welches passt nicht → dass");
            let busy = false, done = false;
            const probe = async () => {
              if (busy) return; busy = true; snd(); s.sfx.whoosh();
              await flipText(s, word, "welches"); word.style.color = rel ? GR : RED;
              if (rel) s.sfx.ding(); else s.sfx.error();
              await s.wait(s.fast ? 0 : 900);
              await flipText(s, word, w); word.style.color = rel ? NS : "#5d6678";
              if (!done) { done = true; await s.show(res, "pop"); }
              busy = false;
            };
            const btn = s.h("button", { class: "btn", style: { minWidth: "150px" }, onclick: () => { s.sfx.click(); probe(); } }, "Probe");
            const el = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "1fr 150px", gap: "6px 16px", alignItems: "center", padding: "10px 18px" } },
              s.h("p", { class: "t", style: { fontSize: "25px" } }, a, word, b), btn, res);
            return { el, probe };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, s.h("b", { style: { color: NS } }, "das"), " zeigt auf ein Nomen zurück und lässt sich durch ", s.h("b", null, "welches"), " ersetzen. ", s.h("b", { style: { color: RED } }, "dass"), " verbindet zwei Sätze – dort passt ", s.h("b", null, "welches"), " nie.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } }, rows.map(r => r.el), merk));
          s.show(rows.map(r => r.el), "left"); s.sfx.pop();
          rows.forEach((r, i) => s.step(async () => { await r.probe(); s.say(["Das Fahrrad, welches im Hof steht. Passt! Also das.", "Ich hoffe, welches es morgen nicht regnet? Passt nicht. Also dass.", "Das Lied, welches wir spielen. Passt! Also das.", "Mama sagt, welches das Essen fertig ist? Passt nicht. Also dass."][i]); }));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 17 ----------------------------------------------------------------- */
      {
        title: "Komma bei Anrede und Ausruf",
        say: "Sprichst du jemanden an, trennst du den Namen mit einem Komma ab. Ein Komma kann sogar Leben retten!",
        build(s) {
          const RED = "var(--red)";
          const v = s.svg(420, 300); v.style.width = "420px"; v.style.height = "300px";
          // Tisch, Teller, Kochtopf
          v.append(
            s.el("rect", { x: 20, y: 200, width: 380, height: 16, rx: 6, fill: "#b07a4a" }),
            s.el("rect", { x: 40, y: 216, width: 14, height: 76, fill: "#8a5a2b" }), s.el("rect", { x: 366, y: 216, width: 14, height: 76, fill: "#8a5a2b" }),
            s.el("ellipse", { cx: 120, cy: 196, rx: 52, ry: 9, fill: "#fff", stroke: "#a3adbb", "stroke-width": 3 }),
            s.el("rect", { x: 250, y: 140, width: 120, height: 58, rx: 10, fill: "#8a96a8", stroke: "#5d6678", "stroke-width": 3 }),
            s.el("rect", { x: 240, y: 132, width: 140, height: 14, rx: 6, fill: "#5d6678" }));
          const steam = s.el("path", { d: "M280 120 q-10 -16 0 -32 q10 -16 0 -32 M310 120 q-10 -16 0 -32 q10 -16 0 -32 M340 120 q-10 -16 0 -32 q10 -16 0 -32", fill: "none", stroke: "#a3adbb", "stroke-width": 4, "stroke-linecap": "round", opacity: 0 });
          const opa = s.el("g", null,
            s.el("circle", { cx: 0, cy: 0, r: 34, fill: "#f6d2b4", stroke: "#b07a4a", "stroke-width": 3 }),
            s.el("path", { d: "M-30 6 Q0 52 30 6 Q16 20 0 18 Q-16 20 -30 6 Z", fill: "#e9edf2", stroke: "#a3adbb", "stroke-width": 2 }),
            s.el("path", { d: "M-34 -8 Q-36 -36 -12 -36 M34 -8 Q36 -36 12 -36", fill: "none", stroke: "#e9edf2", "stroke-width": 6, "stroke-linecap": "round" }),
            s.el("circle", { cx: -12, cy: -6, r: 4, fill: "#1b2740" }), s.el("circle", { cx: 12, cy: -6, r: 4, fill: "#1b2740" }),
            s.el("circle", { cx: -12, cy: -6, r: 10, fill: "none", stroke: "#5d6678", "stroke-width": 2 }), s.el("circle", { cx: 12, cy: -6, r: 10, fill: "none", stroke: "#5d6678", "stroke-width": 2 }));
          const mouth = s.el("path", { d: "M-8 10 Q0 16 8 10", fill: "none", stroke: "#8a2e1e", "stroke-width": 3, "stroke-linecap": "round" });
          opa.append(mouth);
          v.append(steam, opa);
          const place = (x, y, sc) => opa.setAttribute("transform", `translate(${x} ${y}) scale(${sc})`);
          place(120, 140, 1);
          const cm = s.h("b", { style: { color: RED } }, ",");
          const sent = s.h("p", { style: { margin: 0, font: "700 40px/1.1 var(--f-display)", color: "var(--ink)", textAlign: "center", whiteSpace: "nowrap" } }, "Komm", s.h("b", { style: { color: RED } }, ","), " wir essen", cm, " Opa!");
          const meaning = s.h("p", { class: "t", style: { textAlign: "center", minHeight: "34px" } }, "Opa wird zum Essen gerufen.");
          let on = true;
          const toggle = async () => {
            on = !on; s.sfx.click();
            cm.textContent = on ? "," : "";
            flipText(s, meaning, on ? "Opa wird zum Essen gerufen." : "Oh nein! Opa ist das Essen!");
            if (on) { s.sfx.boing(); steam.setAttribute("opacity", 0); mouth.setAttribute("d", "M-8 10 Q0 16 8 10"); }
            else { s.sfx.error(); s.sound("sizzle", { vol: 0.4, dur: 1.5 }); steam.setAttribute("opacity", 1); mouth.setAttribute("d", "M-8 14 Q0 6 8 14"); }
            const [x0, y0, x1, y1] = on ? [310, 112, 120, 140] : [120, 140, 310, 112];
            await s.tween({ dur: s.fast ? 1 : 700, ease: "inOut", update: (k, t) => place(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k - 60 * Math.sin(Math.PI * t), 1) });
          };
          const tBtn = s.h("button", { class: "btn later", onclick: () => toggle() }, "Komma weg / zurück");
          const left = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 16px" } }, sent, v, meaning, tBtn);
          const ex1 = ex(s, "Anrede", s.h("p", { class: "t", style: { fontSize: "22px" } }, "Leon", s.h("b", { style: { color: RED } }, ","), " kommst du?"), s.h("p", { class: "t", style: { fontSize: "22px" } }, "Kommst du", s.h("b", { style: { color: RED } }, ","), " Leon?"), s.h("p", { class: "t", style: { fontSize: "22px" } }, "Hör mal", s.h("b", { style: { color: RED } }, ","), " Oma", s.h("b", { style: { color: RED } }, ","), " das ist lecker!"));
          const ex2 = ex(s, "Ausruf", s.h("p", { class: "t", style: { fontSize: "22px" } }, "Oh", s.h("b", { style: { color: RED } }, ","), " ein Eichhörnchen!"), s.h("p", { class: "t", style: { fontSize: "22px" } }, "Ja", s.h("b", { style: { color: RED } }, ","), " ich komme mit."), s.h("p", { class: "t", style: { fontSize: "22px" } }, "Aua", s.h("b", { style: { color: RED } }, ","), " das tut weh!"));
          [ex1, ex2].forEach(e => { e.classList.add("later"); e.style.padding = "12px 18px"; });
          const lf = life(s, "Im Alltag: Brief", s.h("p", { class: "t", style: { fontSize: "22px" } }, "Liebe Oma", s.h("b", { style: { color: RED } }, ","), s.h("br"), "danke für das Paket!"));
          lf.classList.add("later"); lf.style.padding = "12px 18px";
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 16px 12px" } }, s.h("b", null, "Anreden"), " und ", s.h("b", null, "Ausrufe"), " trennst du mit ", s.h("b", { style: { color: RED } }, "Komma"), " vom Satz ab.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "470px 1fr", gap: "20px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "12px" } }, ex1, ex2, lf, merk)));
          s.show(left, "up"); s.sfx.pop();
          s.step(async () => { s.show(tBtn, "pop"); await toggle(); s.say("Komm, wir essen Opa! Ohne Komma ist Opa das Essen."); });
          s.step(async () => { await toggle(); s.sfx.ding(); s.say("Mit Komma wird Opa nur gerufen. Puh!"); });
          s.step(async () => { s.sound("knock", { vol: 0.5, dur: 1.2 }); await s.show(ex1, "up"); s.say("Leon, kommst du?"); });
          s.step(async () => { s.sound("kids-wow", { vol: 0.5, dur: 1.5 }); await s.show(ex2, "up"); s.say("Oh, ein Eichhörnchen!"); });
          s.step(async () => { s.sound("pencil-write", { vol: 0.5, dur: 1.5 }); await s.show(lf, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 18 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: der Satz-Baukasten",
        say: "Bau dir eigene Sätze! Tippe auf die Bausteine. Mit Umstellen wandern sie, und das Prädikat bleibt an Platz zwei.",
        build(s) {
          const OPT = {
            S: ["Leon", "meine Oma", "der Trainer", "die Katze"],
            P: ["kauft", "sucht", "findet", "malt"],
            Z: ["heute", "am Montag", "nach der Schule"],
            AO: ["einen Kuchen", "den Ball", "eine Pizza", "das Ticket"],
            O: ["im Park", "in der U-Bahn", "am Alexanderplatz"],
          };
          const keys = ["S", "P", "Z", "AO", "O"];
          const B = {};
          const pick = { S: 0, P: 0, Z: 0, AO: 0, O: 0 };
          keys.forEach(k => { B[k] = blk(s, k, OPT[k][0], { num: true }); });
          B.pt = P(s, ".");
          const orders = [["S", "P", "Z", "AO", "O"], ["Z", "P", "S", "AO", "O"], ["O", "P", "S", "Z", "AO"], ["AO", "P", "S", "Z", "O"]];
          let oi = 0;
          const row = s.h("div", { class: "d2row", style: { justifyContent: "center", minHeight: "128px", alignContent: "center" } }, keys.map(k => B[k]), B.pt);
          const setWords = () => keys.forEach(k => { const t = OPT[k][pick[k]]; B[k].chip.replaceChildren(...t.split(" ").map((w, i) => s.h("span", { class: i ? "" : "tx" }, w))); B[k].first = t.split(" ")[0]; });
          const apply = async (anim = true) => { await morph(s, row, B, ordered(B, orders[oi]), anim ? { arc: 44, dur: 800 } : {}); numbers(B, orders[oi]); };
          setWords(); apply(false);
          const say = () => s.say(orders[oi].map(k => phrase(B[k])).join(" ") + ".");
          const choose = async (k, i) => {
            pick[k] = i; s.sfx.pop();
            setWords(); await apply(false); bump(s, B[k], 0.25);
            optBtns[k].forEach((b, j) => { b.style.boxShadow = j === i ? `0 0 0 3px ${SG[k].c} inset` : "none"; });
          };
          const umstellen = async () => { oi = (oi + 1) % orders.length; s.sfx.whoosh(); await apply(true); s.sfx.snap(); bump(s, B.P.num, 0.4); };
          const zufall = async () => { s.sfx.zap(); for (const k of keys) { await choose(k, Math.floor(Math.random() * OPT[k].length)); await s.wait(120); } };
          const optBtns = {};
          const cols = keys.map(k => {
            optBtns[k] = OPT[k].map((t, i) => s.h("button", { class: "d2opt", style: { borderColor: SG[k].c, background: SG[k].b }, onclick: () => { choose(k, i); } }, t));
            return s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("div", { style: { textAlign: "center" } }, tag(s, k)), s.h("p", { class: "d2q", style: { textAlign: "center", fontSize: "26px", margin: 0, color: SG[k].c } }, SG[k].q), optBtns[k]);
          });
          optBtns.S[0].style.boxShadow = `0 0 0 3px ${SG.S.c} inset`;
          keys.forEach(k => { optBtns[k][0].style.boxShadow = `0 0 0 3px ${SG[k].c} inset`; });
          const bU = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); umstellen(); } }, "Umstellen");
          const bZ = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); zufall(); } }, "Zufall");
          const bS = s.h("button", { class: "btn", onclick: () => { s.sfx.click(); say(); } }, "Vorlesen");
          const top = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "12px 16px" } }, row, s.h("div", { class: "row", style: { gap: "12px" } }, bU, bZ, bS));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, top, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" } }, cols)));
          s.show(top, "up"); s.show(cols, "up"); s.sfx.pop();
          s.step(async () => { await choose("S", 1); await choose("AO", 0); await choose("O", 2); s.say("Meine Oma kauft heute einen Kuchen am Alexanderplatz."); });
          s.step(async () => { await umstellen(); s.say("Umgestellt. Das Prädikat bleibt an Platz zwei."); });
          s.step(async () => { await umstellen(); s.sfx.success(); });
        },
      },
    ],
  });
})();
