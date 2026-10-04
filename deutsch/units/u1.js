/* Kapitel 1 – Wortarten. Farben je Wortart bleiben im ganzen Kapitel gleich. */
(() => {
  "use strict";
  const CSS = `
.d1w{display:inline-flex;align-items:center;justify-content:center;padding:5px 13px;border-radius:12px;border:3px solid #a3adbb;background:#fff;font:700 28px/1.15 var(--f-display);color:var(--ink);white-space:nowrap;position:relative}
.d1w.s{font-size:23px;padding:3px 10px;border-width:2px;border-radius:10px}
.d1w.l{font-size:38px;padding:7px 18px;border-radius:16px}
.d1end{color:var(--red)}
.d1chg{color:var(--orange)}
.d1row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.d1p{font:700 28px/1.15 var(--f-display);margin-left:-6px;position:relative;z-index:1}
.d1tag{display:inline-block;font:700 20px/1 var(--f-display);color:#fff;border-radius:999px;padding:6px 13px;white-space:nowrap}
.d1bin{border:3px dashed var(--line);border-radius:18px;background:#fff;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.d1bub{background:#fff;border:2px solid var(--line);border-radius:20px 20px 20px 6px;padding:10px 16px;font-size:24px;line-height:1.35;align-self:flex-start;max-width:100%}
.d1bub.me{background:#dcf7d6;border-color:#a8dca0;border-radius:20px 20px 6px 20px;align-self:flex-end}
.d1word{display:inline-block}
.d1grid{display:grid;gap:0;border:2px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
.d1grid > div{padding:10px 12px;font-size:23px;line-height:1.25;border-top:1px solid var(--line)}
.d1grid > div.hd{font:700 19px/1.2 var(--f-display);color:var(--pencil);border-top:0;background:#f4f6f9}
.d1grid > div.on{background:#fff3b8}
.d1slot{display:inline-flex;min-width:110px;min-height:46px;border:3px dashed #9fd8bd;border-radius:12px;align-items:center;justify-content:center;vertical-align:middle}
.d1slot.full{border-color:transparent;min-width:0}
.d1q{font:700 30px/1.1 var(--f-hand);color:var(--red)}
.d1btn2{flex-direction:column;gap:4px;padding:8px 14px}
.d1btn2 small{font:600 19px/1 var(--f-body)}
.d1emo{font-size:52px;line-height:1}
`;
  if (!document.getElementById("d1css")) { const st = document.createElement("style"); st.id = "d1css"; st.textContent = CSS; document.head.appendChild(st); }

  /* ---------- Farben der Wortarten ---------- */
  const WT = {
    n: { name: "Nomen", c: "#1d5bd0", b: "#e3ecfc" },
    art: { name: "Artikel", c: "#5b7db5", b: "#eef2f9" },
    v: { name: "Verb", c: "#dc3b2a", b: "#fde4e1" },
    adj: { name: "Adjektiv", c: "#138a5a", b: "#dcf2e7" },
    pr: { name: "Pronomen", c: "#d9650b", b: "#fdecd9" },
    pp: { name: "Präposition", c: "#7b4fd6", b: "#ece5fb" },
    k: { name: "Konjunktion", c: "#8a5a2b", b: "#f2e8dc" },
    adv: { name: "Adverb", c: "#0e7c8c", b: "#d9f1f4" },
    x: { name: "", c: "#a3adbb", b: "#ffffff" },
  };
  const paint = (e, k) => { e.style.borderColor = WT[k].c; e.style.background = WT[k].b; e.dataset.k = k; return e; };
  const chip = (s, text, k = "x", cls = "") => paint(s.h("span", { class: "d1w " + cls }, text), k);
  const tag = (s, k, text) => s.h("span", { class: "d1tag", style: { background: WT[k].c } }, text || WT[k].name);

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
  async function fly(s, el, parent, { before = null, arc = 70, dur = 700 } = {}) {
    noAnim(el);
    const sc = SC(), f = el.getBoundingClientRect();
    el.style.transform = "";
    el.classList.remove("later");
    parent.insertBefore(el, before);
    if (s.fast || !s.alive) return;
    const l = el.getBoundingClientRect();
    const dx = (f.left - l.left) / sc, dy = (f.top - l.top) / sc;
    el.style.position = "relative"; el.style.zIndex = 6;
    el.style.transform = `translate(${dx}px,${dy}px)`;
    await s.tween({ dur, ease: "inOut", update: (v, t) => { el.style.transform = `translate(${dx * (1 - v)}px,${dy * (1 - v) - arc * Math.sin(Math.PI * t)}px)`; } });
    el.style.transform = ""; el.style.zIndex = "";
  }
  /** rearrange tokens of a row: state = [id | [id, newText]]; tokens not listed disappear, new ones pop in */
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
    data.forEach(d => { d.e.style.position = "relative"; if (d.isNew) { d.e.style.opacity = 0; d.e.style.transform = "scale(.3)"; } else d.e.style.transform = `translate(${d.dx}px,${d.dy}px)`; });
    await s.tween({ dur, ease: "inOut", update: (v, t) => data.forEach(d => {
      if (d.isNew) { const p = Math.max(0, (t - 0.4) / 0.6); d.e.style.opacity = Math.min(1, p * 2); d.e.style.transform = `scale(${0.3 + 0.7 * s.ease.back(p)})`; return; }
      const mv = Math.abs(d.dx) + Math.abs(d.dy) > 4;
      const lift = mv ? (d.dx < 0 ? -1 : 1) * arc * Math.sin(Math.PI * t) : 0;
      d.e.style.transform = `translate(${d.dx * (1 - v)}px,${d.dy * (1 - v) + lift}px)`;
    }) });
    data.forEach(d => { d.e.style.transform = ""; d.e.style.opacity = ""; });
  }
  const P = (s, t) => s.h("span", { class: "d1p" }, t);
  const life = (s, label, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex" }, s.h("span", { class: "exlabel" }, label), ...kids);
  /** word with coloured part(s): parts = [["Hund"],["e",1]] – 1 = Endung (rot), 2 = Stammänderung (orange) */
  const parts = (s, arr) => arr.map(([t, m]) => (m ? s.h("span", { class: m === 2 ? "d1chg" : "d1end" }, t) : t));

  Deck.unit({
    id: "u1", num: 1, title: "Wortarten", color: "#1d5bd0", soft: "#e4ecfb",
    subtitle: "Jedes Wort hat seine Familie",
    blurb: "Nomen, Verben, Adjektive & Co. – in Farbe erklärt.",
    goals: [
      "Die acht Wortarten an ihren Farben erkennen",
      "Nomen: Artikel, Genus, Plural und die vier Fälle",
      "Verben konjugieren und Befehle geben",
      "Adjektive steigern – bis hoch zum Fernsehturm",
      "Pronomen, Präpositionen, Konjunktionen, Adverbien",
    ],
    icon(svg, el) {
      [["#1d5bd0", 8, 10, 38], ["#dc3b2a", 24, 30, 40], ["#138a5a", 10, 50, 30]].forEach(([c, x, y, w]) =>
        svg.append(el("rect", { x, y, width: w, height: 14, rx: 5, fill: c, opacity: 0.85 })));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Wörter haben Familien",
        say: "Jedes Wort gehört zu einer Wortart, so wie zu einer Familie. Wir malen einen Satz aus einem Fußballspiel bunt an.",
        build(s) {
          const W = [["Heute", "adv"], ["schießt", "v"], ["der", "art"], ["schnelle", "adj"], ["Stürmer", "n"], ["den", "art"], ["Ball", "n"], ["über", "pp"], ["das", "art"], ["Tor", "n"], [",", null], ["aber", "k"], ["er", "pr"], ["lacht", "v"], [".", null]];
          const els = W.map(([t, k]) => (k ? chip(s, t, "x", "later") : s.h("span", { class: "d1p later" }, t)));
          els.forEach((e, i) => { e.dataset.k = W[i][1] || ""; });
          const row = s.h("div", { class: "d1row", style: { justifyContent: "center", minHeight: "120px" } }, els);
          const top = ex(s, "Aus einem Spielbericht", row);
          const groups = [["n", "art"], ["v"], ["adj"], ["pr"], ["pp", "k", "adv"]];
          const desc = { n: "Lebewesen, Dinge, Gefühle – groß!", art: "Begleiter: der, die, das, ein", v: "Was tut jemand? Was passiert?", adj: "Wie ist etwas?", pr: "Stellvertreter: ich, du, er …", pp: "Verhältniswort: auf, unter …", k: "Bindewort: und, aber, weil …", adv: "Umstandswort: heute, hier, gern" };
          const cards = {};
          const grid = s.h("div", { class: "cols4", style: { gap: "12px" } }, Object.keys(desc).map(k => (cards[k] = s.h("div", { class: "card later", style: { padding: "12px 14px", borderColor: WT[k].c, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" } }, tag(s, k), s.h("p", { class: "small" }, desc[k])))));
          const merk = s.h("div", { class: "merk later" }, "Es gibt viele Wortarten. Diese ", s.h("b", null, "acht"), " lernst du hier kennen. Ihre Farben bleiben im ganzen Kapitel gleich.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, top, grid, merk));
          s.show(els, "up");
          els.forEach((_, i) => setTimeout(() => s.alive && !s.fast && s.sfx.count(i % 12), i * 120));
          groups.forEach((g, gi) => s.step(async () => {
            s.sfx.pop();
            const hits = els.filter(e => g.includes(e.dataset.k));
            hits.forEach(e => { paint(e, e.dataset.k); bump(s, e, 0.25); });
            await s.show(g.map(k => cards[k]), "pop");
            s.say(gi === 0 ? "Blau sind die Nomen, ihre Begleiter sind die Artikel." : gi === 1 ? "Rot sind die Verben." : gi === 2 ? "Grün ist das Adjektiv. Es sagt, wie etwas ist." : gi === 3 ? "Orange ist das Pronomen. Er steht für den Stürmer." : "Dazu kommen Präposition, Konjunktion und Adverb.");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Nomen schreibt man groß",
        say: "Nomen sind Namen für Lebewesen, Dinge, Orte und sogar für Gefühle. Man schreibt sie immer groß.",
        build(s) {
          const cat = [
            ["🐕", "Lebewesen", ["der Hund", "die Lehrerin", "der Torwart"]],
            ["⚽", "Dinge", ["der Ball", "das Heft", "die U-Bahn"]],
            ["🏙️", "Orte", ["Berlin", "die Schule", "der Park"]],
            ["💭", "Gefühle, Ideen", ["die Freude", "der Mut", "die Angst"]],
          ];
          const cards = cat.map(([e, t, ws], i) => s.h("div", { class: "card" + (i > 1 ? " later" : ""), style: { padding: "16px 16px", display: "flex", flexDirection: "column", gap: "12px" } },
            s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { style: { fontSize: "40px", lineHeight: "1" } }, e), s.h("span", { class: "h2", style: { fontSize: "27px" } }, t)),
            s.h("div", { class: "d1row", style: { gap: "10px" } }, ws.map(w => chip(s, w, "n")))));
          const left = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "14px", height: "100%" } }, cards);
          // message in lower case
          const msg = [["ich", "Ich", "start"], ["habe"], ["meine"], ["schultasche", "Schultasche", "n"], ["im"], ["bus", "Bus", "n"], ["vergessen!"]];
          const msgEls = msg.map(([t]) => s.h("span", { class: "d1word" }, t));
          const bub = s.h("div", { class: "d1bub me", style: { fontSize: "28px" } }, msgEls.flatMap((e, i) => (i ? [" ", e] : [e])));
          const note = s.h("div", { class: "row later", style: { gap: "10px" } }, tag(s, "n", "Nomen → groß"), s.h("span", { class: "d1tag", style: { background: "var(--pencil)" } }, "Satzanfang → groß"));
          const chat = life(s, "Im Alltag: Nachricht an Tim", s.h("div", { class: "stack", style: { gap: "12px" } }, bub, note));
          const menu = ex(s, "Im Alltag: Speisekarte", s.h("p", { class: "t" }, ["Pizza", "Salat", "Apfelschorle"].map((w, i) => [i ? " · " : "", s.h("b", { style: { color: WT.n.c } }, w)]), " – alles Nomen, alles groß!"));
          menu.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Artikelprobe: "), "Passt ", s.h("b", null, "der, die"), " oder ", s.h("b", null, "das"), " davor? Dann ist es ein Nomen – und du schreibst es groß: ", s.h("b", null, "die Freude"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "24px", height: "100%", alignItems: "start" } }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, chat, menu, merk)));
          s.show(cards.slice(0, 2), "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards.slice(2), "up"); s.say("Auch was man nicht anfassen kann, ist ein Nomen. Zum Beispiel die Freude."); });
          s.step(async () => {
            s.sfx.scribble();
            for (let i = 0; i < msg.length; i++) {
              const [, up, k] = msg[i];
              if (!up) continue;
              await flipText(s, msgEls[i], up);
              msgEls[i].style.color = k === "n" ? WT.n.c : "var(--pencil)";
              msgEls[i].style.fontWeight = "700";
              s.sfx.pop();
            }
            await s.show(note, "up");
            s.say("Schultasche und Bus sind Nomen. Und am Satzanfang schreibt man sowieso groß.");
            s.sfx.pop(); await s.show(menu, "up");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Artikel: bestimmt, unbestimmt",
        say: "Der Artikel ist der Begleiter des Nomens. Ein und eine sagen, etwas ist neu. Der, die und das sagen, wir kennen es schon.",
        build(s) {
          const spot = (lit) => {
            const svg = s.svg(330, 120);
            if (lit) svg.append(s.el("polygon", { points: "165,0 120,112 210,112", fill: "#ffd94a", opacity: 0.55, class: "later" }));
            [75, 165, 255].forEach((x, i) => {
              const on = lit && i === 1;
              svg.append(s.el("circle", { cx: x, cy: 82, r: 28, fill: on ? "#fff" : "#e8ebf0", stroke: on ? "#1b2740" : "#a3adbb", "stroke-width": 4 }));
              svg.append(s.el("circle", { cx: x, cy: 82, r: 9, fill: on ? "#1b2740" : "#a3adbb" }));
              if (!lit) svg.append(s.el("text", { x, y: 38, "text-anchor": "middle", "font-size": 30, "font-weight": 700, fill: "#5d6678", text: "?" }));
            });
            return svg;
          };
          const sBest = spot(true), sUn = spot(false);
          const c1 = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" } },
            s.h("div", { class: "row", style: { gap: "8px" } }, ["der", "die", "das"].map(a => chip(s, a, "art"))),
            s.h("p", { class: "h2", style: { fontSize: "25px" } }, "bestimmter Artikel"), sBest, s.h("p", { class: "small pencil" }, "genau dieser – den kennen wir schon"));
          const c2 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" } },
            s.h("div", { class: "row", style: { gap: "8px" } }, ["ein", "eine", "ein"].map(a => chip(s, a, "art"))),
            s.h("p", { class: "h2", style: { fontSize: "25px" } }, "unbestimmter Artikel"), sUn, s.h("p", { class: "small pencil" }, "irgendeiner – er ist neu für uns"));
          const exs = [
            ["Fußball", ["Ein", " Spieler läuft los."], ["Der", " Spieler schießt."]],
            ["Schultasche", ["Da ist ", "ein", " Heft."], ["Das", " Heft ist blau."]],
            ["Restaurant", ["Ich bestelle ", "eine", " Pizza."], ["Die", " Pizza ist heiß."]],
          ];
          const exEls = exs.map(([lab, a, b]) => {
            const mk = arr => s.h("p", { class: "t", style: { fontSize: "25px" } }, arr.map(t => (/^(ein|eine|Ein|Der|Das|Die)$/.test(t) ? chip(s, t, "art", "s") : t)));
            const second = mk(b); second.classList.add("later");
            return { box: ex(s, lab, s.h("div", { class: "row", style: { gap: "12px" } }, mk(a), s.h("b", { class: "later", style: { fontSize: "26px", color: "var(--pencil)" } }, "→"), second)), second };
          });
          exEls.forEach(e => e.box.classList.add("later"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Neu oder unbekannt → ", s.h("b", null, "ein, eine"), ". Schon bekannt → ", s.h("b", null, "der, die, das"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, c1, c2),
            s.h("div", { class: "stack", style: { gap: "12px" } }, exEls.map(e => e.box), merk)));
          s.show(c1, "up"); s.sfx.pop();
          s.wait(500).then(() => { const cone = sBest.querySelector("polygon"); s.show(cone, "fade"); s.sfx.zap(); });
          s.step(async () => { s.sfx.boing(); await s.show(c2, "up"); s.say("Ein, eine. Irgendeiner, der noch neu ist."); });
          exEls.forEach((e, i) => s.step(async () => {
            s.sfx.pop(); await s.show(e.box, "left");
            s.sfx.whoosh(); await s.show([e.box.querySelector("b"), e.second], "right");
            s.say(["Erst ein Spieler, dann der Spieler.", "Erst ein Heft, dann das Heft.", "Erst eine Pizza, dann die Pizza."][i]);
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Genus: der, die oder das?",
        say: "Jedes Nomen hat ein Genus, also ein grammatisches Geschlecht. Ziehe oder tippe die Wörter, dann fahren sie in ihre Garage.",
        build(s) {
          const items = [
            ["Ball", "der", "der Ball – Maskulinum."], ["Mannschaft", "die", "Wörter auf -schaft sind immer Femininum."], ["Tor", "das", "das Tor – Neutrum."],
            ["Löffel", "der", "der Löffel, die Gabel, das Messer – das Besteck hat alle drei!"], ["Gabel", "die", "der Löffel, die Gabel, das Messer – das Besteck hat alle drei!"], ["Messer", "das", "der Löffel, die Gabel, das Messer – das Besteck hat alle drei!"],
            ["Mädchen", "das", "das Mädchen: Wörter auf -chen sind immer Neutrum."], ["Rucksack", "der", "der Rucksack – Maskulinum."], ["U-Bahn", "die", "die U-Bahn – Femininum."],
            ["Ticket", "das", "das Ticket – Neutrum."], ["Bus", "der", "der Bus – Maskulinum."], ["Pizza", "die", "die Pizza – Femininum."],
          ];
          const bins = [["der", "Maskulinum", "#4062a8", "#e9eef8"], ["die", "Femininum", "#b23a6e", "#f9e6ee"], ["das", "Neutrum", "#3f7f3a", "#e7f2e4"]];
          const areas = {};
          const binEls = bins.map(([a, n, c, b]) => {
            areas[a] = s.h("div", { class: "d1row", style: { gap: "8px" } });
            return s.h("div", { class: "d1bin", style: { borderColor: c, background: b, minHeight: "196px" } },
              s.h("div", { class: "row", style: { gap: "12px" } }, s.h("span", { class: "big", style: { color: c } }, a), s.h("span", { class: "t", style: { color: c, fontWeight: 700 } }, n)), areas[a]);
          });
          const chips = items.map(([w]) => chip(s, w, "n", "s"));
          const pool = s.h("div", { class: "d1row", style: { justifyContent: "center", minHeight: "96px", alignContent: "center", gap: "10px" } }, chips);
          const info = s.h("p", { class: "t", style: { minHeight: "34px", textAlign: "center" } }, "Ziehe oder tippe ein Wort – es fährt in seine Garage.");
          const done = new Set();
          const place = async i => {
            if (done.has(i)) return;
            done.add(i);
            const [w, a, note] = items[i];
            chips[i].textContent = a + " " + w;
            s.sfx.whoosh();
            await fly(s, chips[i], areas[a]);
            s.sfx.snap(); bump(s, chips[i]);
            info.textContent = note;
            s.say(note);
          };
          chips.forEach((c, i) => {
            let st = null;
            s.drag(c, {
              space: s.root,
              onStart: p => { if (done.has(i)) return; st = p; noAnim(c); c.style.position = "relative"; c.style.zIndex = 9; s.sfx.click(); },
              onMove: p => { if (st) c.style.transform = `translate(${p.x - st.x}px,${p.y - st.y}px)`; },
              onEnd: () => { if (!st) return; st = null; place(i); },
            });
          });
          const all = s.h("button", { class: "btn solid", onclick: async () => { for (let i = 0; i < items.length; i++) { if (!s.alive) return; if (!done.has(i)) { place(i); await s.wait(260); } } } }, "Alle einsortieren");
          const reset = s.h("button", { class: "btn", onclick: async () => { s.sfx.swoosh(); for (const i of [...done]) { chips[i].textContent = items[i][0]; fly(s, chips[i], pool, { arc: 30, dur: 500 }); } done.clear(); info.textContent = "Ziehe oder tippe ein Wort – es fährt in seine Garage."; } }, "Nochmal");
          const merk = s.h("div", { class: "merk later", style: { flex: "1", fontSize: "22px", padding: "10px 18px 12px" } }, "Das Genus sieht man dem Ding nicht an. Lerne jedes Nomen ", s.h("b", null, "mit Artikel"), ": der Ball, die Gabel, das Messer.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { class: "card", style: { padding: "10px 14px" } }, pool),
            s.h("div", { class: "cols3", style: { gap: "14px" } }, binEls),
            info,
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center", gap: "14px" } }, merk, s.h("div", { class: "stack", style: { gap: "8px" } }, all, reset))));
          s.show(chips, "pop"); s.sfx.pop();
          s.step(async () => { for (const i of [3, 4, 5]) { await place(i); await s.wait(500); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Das Genus sieht man dem Ding nicht an. Lerne jedes Nomen mit Artikel."); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Singular und Plural",
        say: "Ein Nomen kann im Singular stehen, dann ist es eins. Oder im Plural, dann sind es viele. Der Plural hat verschiedene Endungen.",
        build(s) {
          const P5 = [
            ["🐕", "-e", "Im Park", ["der", [["Hund"]]], [["Hund"], ["e", 1]]],
            ["🧒", "-er", "Auf dem Schulhof", ["das", [["Kind"]]], [["Kind"], ["er", 1]]],
            ["🍌", "-n / -en", "Im Supermarkt", ["die", [["Banane"]]], [["Banane"], ["n", 1]]],
            ["🚗", "-s", "Auf der Straße", ["das", [["Auto"]]], [["Auto"], ["s", 1]]],
            ["🍎", "Umlaut", "Am Obststand", ["der", [["Apfel"]]], [["Ä", 2], ["pfel"]]],
          ];
          const sgEmo = s.h("div", { class: "d1emo", style: { height: "150px", fontSize: "70px", display: "grid", placeItems: "center" } });
          const plEmo = s.h("div", { class: "d1emo", style: { height: "150px", fontSize: "60px", display: "grid", gridTemplateColumns: "1fr 1fr", placeItems: "center", width: "160px", margin: "0 auto" } });
          const sgW = chip(s, "", "n", "l"), plW = chip(s, "", "n", "l");
          const half = (lab, emo, w) => s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" } }, s.h("p", { class: "h2", style: { fontSize: "26px", color: "var(--pencil)" } }, lab), emo, w);
          const stageCard = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "8px", padding: "30px 16px" } },
            half("Singular – eins", sgEmo, sgW), s.h("span", { class: "big", style: { color: "var(--pencil)" } }, "→"), half("Plural – viele", plEmo, plW));
          const where = s.h("p", { class: "t", style: { textAlign: "center" } }, "");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "23px" } }, "Im Plural heißt der Artikel immer ", s.h("b", null, "die"), ": die Hunde, die Kinder, die Autos.");
          const btns = P5.map((p, i) => s.h("button", { class: "btn", style: { justifyContent: "space-between", width: "100%", fontSize: "25px", minHeight: "76px" }, onclick: () => { s.sfx.click(); pick(i); } },
            s.h("span", null, p[3][0] + " " + p[3][1][0][0], "  →  die ", parts(s, p[4])), s.h("span", { class: "d1tag", style: { background: "var(--red)" } }, p[1])));
          let cur = -1;
          async function pick(i) {
            cur = i;
            btns.forEach((b, j) => b.classList.toggle("solid", j === i));
            const p = P5[i];
            sgEmo.textContent = p[0];
            sgW.replaceChildren(p[3][0] + "\u00a0", ...parts(s, p[3][1]));
            plW.replaceChildren("die\u00a0", ...parts(s, p[4]));
            where.replaceChildren("Im Alltag: ", s.h("b", null, p[2]), " siehst du gleich mehrere.");
            plEmo.replaceChildren(...[0, 1, 2, 3].map(() => s.h("span", { class: "later" }, p[0])));
            s.show(sgEmo, "zoom"); s.show(sgW, "pop");
            s.sfx.pop();
            const kids = [...plEmo.children];
            for (let k = 0; k < kids.length; k++) { if (!s.alive || cur !== i) return; s.show(kids[k], "pop"); s.sfx.count(k + 2); await s.wait(140); }
            await s.show(plW, "pop"); bump(s, plW);
          }
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, stageCard, where, merk),
            s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "26px" } }, "Fünf Plural-Muster – tippe an:"), btns)));
          pick(0);
          [1, 2, 3, 4].forEach(i => s.step(async () => { await pick(i); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Die vier Fälle (Kasus)",
        say: "Ein Nomen kann in vier Fällen stehen. Du findest den Fall mit einer Frage. Schau, wie sich der Artikel beim Torwart verändert.",
        build(s) {
          const K = [
            ["Nominativ", "Wer oder was?", "Wer oder was jubelt?", [["der", " Torwart"]], ["", " jubelt."], 0],
            ["Genitiv", "Wessen?", "Wessen Trikot ist grün?", [["des", " Torwart", "s"]], ["Das Trikot ", " ist grün."], 1],
            ["Dativ", "Wem?", "Wem gibt der Trainer Tipps?", [["dem", " Torwart"]], ["Der Trainer gibt ", " Tipps."], 2],
            ["Akkusativ", "Wen oder was?", "Wen oder was feiern die Fans?", [["den", " Torwart"]], ["Die Fans feiern ", "."], 3],
          ];
          const btns = K.map((k, i) => s.h("button", { class: "btn d1btn2", onclick: () => { s.sfx.click(); pick(i); } }, s.h("span", null, (i + 1) + ". " + k[0]), s.h("small", null, k[1])));
          const q = s.h("p", { class: "d1q" }, "");
          const sent = s.h("p", { class: "big", style: { fontSize: "36px" } });
          const card = ex(s, "Aus dem Spielbericht", s.h("div", { class: "stack", style: { gap: "10px", minHeight: "110px" } }, q, sent));
          const rows = [["Nominativ", "Wer oder was?", "der Torwart", "die Mannschaft", "das Tor"], ["Genitiv", "Wessen?", "des Torwarts", "der Mannschaft", "des Tores"], ["Dativ", "Wem?", "dem Torwart", "der Mannschaft", "dem Tor"], ["Akkusativ", "Wen oder was?", "den Torwart", "die Mannschaft", "das Tor"]];
          const head = ["Fall", "Frage", "maskulin", "feminin", "neutral"].map(t => s.h("div", { class: "hd" }, t));
          const cells = rows.map(r => r.map((t, j) => {
            if (j < 2) return s.h("div", { style: { fontWeight: j === 0 ? 700 : 400 } }, t);
            const [a, ...rest] = t.split(" ");
            return s.h("div", null, s.h("b", { style: { color: WT.art.c } }, a), " " + rest.join(" "));
          }));
          const grid = s.h("div", { class: "d1grid", style: { gridTemplateColumns: "150px 200px 1fr 1fr 1fr" } }, head, cells.flat());
          async function pick(i) {
            btns.forEach((b, j) => b.classList.toggle("solid", j === i));
            cells.forEach((r, j) => r.forEach(c => c.classList.toggle("on", j === i)));
            const k = K[i];
            const [art, n, end] = k[3][0];
            const artEl = s.h("span", { class: "d1word", style: { color: "var(--red)" } }, art);
            const phrase = chip(s, "", "n");
            phrase.style.background = "#fff3b8"; phrase.style.borderColor = "var(--yellow)"; phrase.style.fontSize = "36px";
            phrase.append(artEl, n.replace(" ", "\u00a0"), end ? s.h("span", { class: "d1end" }, end) : "");
            const pre = k[4][0], post = k[4][1];
            sent.replaceChildren(...(pre ? [pre] : []), phrase, post);
            if (!pre) { /* Satzanfang: Großbuchstabe */ artEl.textContent = art[0].toUpperCase() + art.slice(1); }
            q.textContent = "";
            s.sfx.whoosh();
            await s.show(sent, "fade");
            s.sfx.scribble();
            q.textContent = k[2];
            await s.show(q, "left");
            bump(s, phrase, 0.12); s.sfx.ding();
            s.say(k[2] + " " + art + " Torwart" + (end || "") + ". Das ist der " + k[0] + ".");
          }
          const tip = s.h("p", { class: "small pencil later" }, "Tipp: Stelle die Frage – die Antwort steht in genau diesem Fall. Am Artikel siehst du ihn: der, des, dem, den.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%" } },
            s.h("div", { class: "cols4", style: { gap: "12px" } }, btns), card, grid, tip));
          pick(0);
          [1, 2, 3].forEach(i => s.step(async () => { await pick(i); }));
          s.step(async () => { s.sfx.pop(); await s.show(tip, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "Verben: Was tut jemand?",
        say: "Verben sagen, was jemand tut oder was passiert. Die Grundform heißt Infinitiv. Sie endet auf e n oder n.",
        build(s) {
          const sets = [
            ["⚽", "Fußball", [["lauf", "en"], ["schieß", "en"], ["jubel", "n"]]],
            ["🍳", "Küche", [["schneid", "en"], ["rühr", "en"], ["back", "en"]]],
            ["🚇", "U-Bahn", [["einsteig", "en"], ["fahr", "en"], ["umsteig", "en"]]],
          ];
          const ends = [];
          const cards = sets.map(([e, t, vs], i) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", padding: "16px" } },
            s.h("div", { class: "row", style: { gap: "10px" } }, s.h("span", { style: { fontSize: "38px", lineHeight: "1" } }, e), s.h("span", { class: "h2" }, t)),
            vs.map(([st, en]) => { const end = s.h("span", { class: "d1word" }, en); ends.push(end); const c = chip(s, "", "v", "l"); c.append(st, end); c.style.width = "250px"; return c; })));
          const top = s.h("p", { class: "t" }, "Verben schreibt man klein – außer am Satzanfang. Frag: ", s.h("b", null, "Was tut jemand? Was passiert?"));
          const merk = s.h("div", { class: "merk later" }, "Die Grundform heißt ", s.h("b", null, "Infinitiv"), ". Sie besteht aus ", s.h("b", null, "Stamm + Endung"), " und endet auf ", s.h("b", { class: "red" }, "-en"), " oder ", s.h("b", { class: "red" }, "-n"), " (jubel", s.h("b", { class: "red" }, "n"), ").");
          const lf = life(s, "Im Alltag", s.h("p", { class: "t" }, "Auf Schildern und in Rezepten steht oft der Infinitiv: ", s.h("b", { class: "red" }, "„Bitte nicht rauchen“"), ", ", s.h("b", { class: "red" }, "„Teig gut verrühren“"), "."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "18px" } }, cards), merk, lf));
          s.show(cards, "up"); [0, 1, 2].forEach(i => setTimeout(() => s.alive && s.sfx.pop(), i * 120));
          s.step(async () => {
            s.say("Jetzt trennen wir den Stamm von der Endung.");
            for (let i = 0; i < ends.length; i++) {
              const e = ends[i];
              e.style.color = "var(--red)";
              s.tween({ dur: 400, ease: "back", update: v => { e.style.marginLeft = 10 * v + "px"; e.style.transform = `translateY(${-6 * Math.sin(Math.PI * v)}px)`; } });
              s.sfx.snap(); await s.wait(110);
            }
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Konjugation: ich, du, er …",
        say: "Das Verb passt sich der Person an. Der Stamm bleibt, die Endung wechselt. Das nennt man konjugieren.",
        build(s) {
          const PR = ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"];
          const V = {
            spielen: [[["spiel"]], [["spiel"]], [["spiel"]], [["spiel"]], [["spiel"]], [["spiel"]]],
            fahren: [[["fahr"]], [["f"], ["ä", 2], ["hr"]], [["f"], ["ä", 2], ["hr"]], [["fahr"]], [["fahr"]], [["fahr"]]],
            lesen: [[["les"]], [["l"], ["ie", 2], ["s"]], [["l"], ["ie", 2], ["s"]], [["les"]], [["les"]], [["les"]]],
          };
          const E = { spielen: ["e", "st", "t", "en", "t", "en"], fahren: ["e", "st", "t", "en", "t", "en"], lesen: ["e", "t", "t", "en", "t", "en"] };
          const stems = PR.map(() => s.h("span", { class: "d1word" }));
          const endEls = PR.map(() => s.h("span", { class: "d1w s later", style: { borderColor: "var(--red)", background: "#fde4e1", color: "var(--red)", minWidth: "54px" } }, ""));
          const rows = PR.map((p, i) => s.h("div", { style: { display: "grid", gridTemplateColumns: "150px auto auto", alignItems: "center", justifyContent: "start", gap: "6px", height: "62px", borderTop: i ? "1px solid var(--line)" : "0" } },
            s.h("span", { style: { color: WT.pr.c, fontWeight: 700, fontSize: "25px" } }, p), s.h("span", { style: { fontSize: "30px", fontWeight: 700, fontFamily: "var(--f-display)" } }, stems[i]), endEls[i]));
          let curV = "spielen";
          const vbtns = Object.keys(V).map(v => s.h("button", { class: "btn" + (v === curV ? " solid" : ""), onclick: () => { s.sfx.click(); setVerb(v); } }, v));
          const table = s.h("div", { class: "card", style: { padding: "14px 20px" } }, s.h("div", { class: "row", style: { gap: "10px", marginBottom: "8px" } }, vbtns), rows);
          async function drop(v) {
            for (let i = 0; i < 6; i++) { if (!s.alive || curV !== v) return; endEls[i].textContent = E[v][i]; s.show(endEls[i], "bounce"); s.sfx.count(i + 1); await s.wait(130); }
          }
          async function setVerb(v) {
            curV = v; vbtns.forEach(b => b.classList.toggle("solid", b.textContent === v));
            s.hide(endEls);
            stems.forEach((st, i) => { st.replaceChildren(...parts(s, V[v][i])); s.show(st, "fade"); });
            await s.wait(200); await drop(v);
          }
          stems.forEach((st, i) => st.replaceChildren(...parts(s, V.spielen[i])));
          const bubbles = s.h("div", { class: "stack later", style: { gap: "10px" } },
            s.h("div", { class: "d1bub" }, s.h("b", { class: "red" }, "Fährst"), " du morgen mit der U-Bahn?"),
            s.h("div", { class: "d1bub me" }, "Ja, ich ", s.h("b", { class: "red" }, "fahre"), " mit der U8. Und du?"),
            s.h("div", { class: "d1bub" }, "Ich ", s.h("b", { class: "red" }, "lese"), " lieber im Bus. Mein Bruder ", s.h("b", { class: "red" }, "liest"), " Comics."));
          const chat = life(s, "Im Alltag: Chat", bubbles);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Die Endung zeigt die Person: ich spiel", s.h("b", { class: "red" }, "e"), ", du spiel", s.h("b", { class: "red" }, "st"), ", er spiel", s.h("b", { class: "red" }, "t"), ". Manche Verben ändern auch den Stamm: du f", s.h("b", { class: "orange" }, "ä"), "hrst, du l", s.h("b", { class: "orange" }, "ie"), "st.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%" } }, s.h("div", null, table), s.h("div", { class: "stack", style: { gap: "14px" } }, chat, merk)));
          s.sfx.pop();
          s.step(async () => { s.say("Ich spiele, du spielst, er spielt, wir spielen, ihr spielt, sie spielen."); await drop("spielen"); });
          s.step(async () => { s.say("Bei fahren ändert sich bei du und er der Stamm. Du fährst."); await setVerb("fahren"); });
          s.step(async () => { s.sfx.pop(); await s.show(chat, "up"); await s.show(bubbles, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "Imperativ: die Befehlsform",
        say: "Mit dem Imperativ gibst du Befehle oder Tipps. Es gibt eine Form für du, eine für ihr und eine höfliche Form mit Sie.",
        build(s) {
          const mkRow = (lab, a, b, punct) => {
            const toks = { p: chip(s, a[0], "pr"), v: chip(s, a[1], "v"), z: s.h("span", { class: "d1p", style: { fontSize: "34px" } }, ".") };
            const row = s.h("div", { class: "d1row", style: { flexWrap: "nowrap", gap: "10px" } }, toks.p, toks.v, toks.z);
            return { el: s.h("div", { style: { display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "center", minHeight: "84px" } }, s.h("div", { class: "stack", style: { gap: "2px" } }, s.h("span", { class: "h2", style: { fontSize: "27px" } }, lab), s.h("span", { class: "small pencil" }, "aus: " + a.join(" "))), row), row, toks, b, punct };
          };
          const R = [
            mkRow("du-Form", ["du", "nimmst"], [["v", "Nimm"], ["z", "!"]]),
            mkRow("ihr-Form", ["ihr", "nehmt"], [["v", "Nehmt"], ["z", "!"]]),
            mkRow("Sie-Form", ["Sie", "nehmen"], [["v", "Nehmen"], "p", ["z", "!"]]),
          ];
          const top = s.h("div", { class: "card", style: { padding: "12px 22px" } }, R.map(r => r.el));
          const cardsData = [
            ["Rezept", [["Nimm", " drei Eier!"], ["Gib", " Milch dazu!"], ["Rühr", " den Teig um!"]]],
            ["Training", [["Lauft", " los!"], ["Passt", " auf!"], ["Spiel", " ab!"]]],
            ["U-Bahn", [["Steigen", " Sie bitte ein!"], ["Halten", " Sie sich fest!"]]],
          ];
          const lifeCards = cardsData.map(([lab, ls]) => { const c = life(s, "Im Alltag: " + lab, ls.map(([v, r]) => s.h("p", { class: "t", style: { fontSize: "23px" } }, s.h("b", { class: "red" }, v), r))); c.classList.add("later"); return c; });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Am Ende steht oft ein ", s.h("b", null, "!"), ". Bei ", s.h("i", null, "nehmen, geben, lesen"), " wird aus e ein i: ", s.h("b", null, "nimm, gib, lies!"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, top, s.h("div", { class: "cols3", style: { gap: "14px" } }, lifeCards), merk));
          s.sfx.pop();
          R.forEach((r, i) => s.step(async () => {
            s.sfx.whoosh();
            await morph(s, r.row, r.toks, r.b, { arc: 30 });
            r.toks.z.style.color = "var(--red)"; bump(s, r.toks.v, 0.2); s.sfx.ding();
            s.say(["Du nimmst wird zu Nimm!", "Ihr nehmt wird zu Nehmt!", "Sie nehmen wird zu Nehmen Sie!"][i]);
          }));
          s.step(async () => { for (const c of lifeCards) { s.sfx.pop(); s.show(c, "up"); await s.wait(180); } await s.wait(300); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Adjektive: Wie ist etwas?",
        say: "Adjektive sagen, wie etwas ist. Stehen sie vor einem Nomen, bekommen sie eine Endung.",
        build(s) {
          const L = [["eine", "Tomatensuppe", "heiß", "e"], ["ein", "Salat", "frisch", "er"], ["", "Pommes", "knusprig", "e"]];
          const pool = s.h("div", { class: "d1row", style: { gap: "14px", minHeight: "56px" } });
          const adj = L.map(([, , a]) => { const c = chip(s, a, "adj"); pool.append(c); return c; });
          const slots = L.map(() => s.h("span", { class: "d1slot" }));
          const lines = L.map(([art, n], i) => s.h("div", { class: "row", style: { gap: "10px", fontSize: "32px", fontWeight: 700, fontFamily: "var(--f-display)", minHeight: "72px", borderBottom: "2px dotted var(--line)", paddingBottom: "6px" } },
            art ? s.h("span", null, art) : null, slots[i], s.h("span", { style: { color: WT.n.c } }, n)));
          const menu = s.h("div", { class: "card", style: { padding: "16px 22px", display: "flex", flexDirection: "column", gap: "12px" } },
            s.h("p", { class: "hand", style: { margin: 0, color: "var(--red)", fontSize: "38px", textAlign: "center" } }, "Speisekarte"), lines);
          const two = ex(s, "Zwei Plätze für ein Adjektiv",
            s.h("p", { class: "t" }, "Die Suppe ist ", chip(s, "heiß", "adj", "s"), ".", s.h("span", { class: "pencil small" }, "  – keine Endung")),
            s.h("p", { class: "t", style: { marginTop: "8px" } }, "die ", (() => { const c = chip(s, "heiß", "adj", "s"); c.append(s.h("span", { class: "d1end" }, "e")); return c; })(), " Suppe", s.h("span", { class: "pencil small" }, "  – Attribut, mit Endung")));
          two.classList.add("later");
          const lf = life(s, "Im Alltag", s.h("p", { class: "t" }, "ein ", s.h("b", { class: "green" }, "spannendes"), " Spiel · die ", s.h("b", { class: "green" }, "volle"), " U-Bahn · ein ", s.h("b", { class: "green" }, "neues"), " Heft"));
          lf.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Adjektive schreibt man klein. Frag: ", s.h("b", null, "Wie ist etwas?"), " – heiß, frisch, knusprig.");
          menu.append(s.h("div", { style: { borderTop: "3px solid var(--line)", paddingTop: "12px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" } }, s.h("p", { class: "h2", style: { fontSize: "26px" } }, "Wie ist das Essen?"), pool));
          menu.style.height = "100%";
          ["lecker", "scharf", "süß"].forEach(w => {
            const c = chip(s, w, "adj");
            c.style.cursor = "pointer"; c.classList.add("nosw");
            c.addEventListener("click", async () => {
              if (!slots[0].contains(adj[0])) { bump(s, c); s.sfx.boing(); return; }
              s.sfx.zap();
              await flipText(s, adj[0], w);
              adj[0].append(s.h("span", { class: "d1end" }, "e"));
              slots[0].classList.add("full"); bump(s, adj[0]); s.sfx.pop();
              s.say("eine " + w + "e Tomatensuppe");
            });
            pool.append(c);
          });
          const hint = s.h("p", { class: "small pencil" }, "Tippe auf lecker, scharf oder süß – es wandert in die Suppe.");
          pool.after(hint);
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "100%", alignItems: "start" } },
            menu,
            s.h("div", { class: "stack", style: { gap: "14px" } }, two, lf, merk)));
          s.show(adj, "pop"); s.sfx.pop();
          L.forEach(([, n, a, end], i) => s.step(async () => {
            s.sfx.whoosh();
            await fly(s, adj[i], slots[i]);
            slots[i].classList.add("full");
            const e = s.h("span", { class: "d1end" }, end);
            adj[i].append(e); s.sfx.snap(); bump(s, adj[i]);
            s.say((L[i][0] ? L[i][0] + " " : "") + a + end + " " + n);
          }));
          s.step(async () => { s.sfx.pop(); await s.show(two, "up"); s.say("Die Suppe ist heiß. Aber vor dem Nomen sagt man die heiße Suppe."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "Steigerung: hoch, höher …",
        say: "Adjektive kann man steigern. Wir vergleichen drei Bauwerke in Berlin. Hoch, höher, am höchsten.",
        build(s) {
          const svg = s.svg(460, 600);
          const G = 520, k = 1.18;
          svg.append(s.el("line", { x1: 10, y1: G, x2: 450, y2: G, stroke: "#8a96a8", "stroke-width": 4, "stroke-linecap": "round" }));
          const B = [
            { x: 90, h: 26, name: "Brandenburger Tor", word: "hoch", col: "#c9a24a" },
            { x: 240, h: 67, name: "Siegessäule", word: "höher", col: "#d6b23e" },
            { x: 380, h: 368, name: "Fernsehturm", word: "am höchsten", col: "#9aa5b4" },
          ];
          B.forEach(b => {
            const H = b.h * k, g = s.el("g", { class: "later" });
            if (b.name === "Brandenburger Tor") {
              g.append(s.el("rect", { x: b.x - 40, y: G - H, width: 80, height: H, fill: b.col, stroke: "#7a5a17", "stroke-width": 2 }));
              [-27, -9, 9, 27].forEach(o => g.append(s.el("rect", { x: b.x + o - 4, y: G - H + 9, width: 8, height: H - 9, fill: "#fff", opacity: 0.55 })));
            } else if (b.name === "Siegessäule") {
              g.append(s.el("rect", { x: b.x - 14, y: G - 14, width: 28, height: 14, fill: "#b9aa8a" }));
              g.append(s.el("rect", { x: b.x - 6, y: G - H + 12, width: 12, height: H - 26, fill: "#c9b48a" }));
              g.append(s.el("circle", { cx: b.x, cy: G - H + 7, r: 7, fill: b.col }));
            } else {
              g.append(s.el("polygon", { points: `${b.x - 14},${G} ${b.x + 14},${G} ${b.x + 6},${G - H * 0.62} ${b.x - 6},${G - H * 0.62}`, fill: "#b6bfcc" }));
              g.append(s.el("circle", { cx: b.x, cy: G - H * 0.6, r: 24, fill: b.col, stroke: "#6b778a", "stroke-width": 2 }));
              g.append(s.el("rect", { x: b.x - 4, y: G - H, width: 8, height: H * 0.4 - 22, fill: "#dc3b2a" }));
              g.append(s.el("rect", { x: b.x - 6, y: G - H * 0.6 - 30, width: 12, height: 10, fill: "#6b778a" }));
            }
            b.g = g;
            b.num = s.el("text", { x: b.x, y: G - H - 14, "text-anchor": "middle", class: "lbl later", text: "0 m" });
            b.lab = s.el("text", { x: b.x, y: G + 30, "text-anchor": "middle", class: "lbl later", style: { fontSize: "19px" }, text: b.name });
            b.wd = s.el("text", { x: b.x, y: G + 66, "text-anchor": "middle", class: "hlbl later", style: { fill: "var(--green)" }, text: b.word });
            svg.append(g, b.num, b.lab, b.wd);
          });
          const T = [["hoch", [["höh", 2], ["er", 1]], [["am höch", 2], ["sten", 1]], "Berlin"], ["schnell", [["schnell"], ["er", 1]], [["am schnell"], ["sten", 1]], "Sportfest"], ["gut", [["besser", 2]], [["am besten", 2]], "Essen"], ["viel", [["mehr", 2]], [["am meisten", 2]], "Pausenhof"]];
          const head = ["Positiv", "Komparativ", "Superlativ"].map(t => s.h("div", { class: "hd" }, t));
          const cells = T.map(([p, c, su]) => [s.h("div", null, p), s.h("div", null, parts(s, c)), s.h("div", null, parts(s, su))]);
          const grid = s.h("div", { class: "d1grid later", style: { gridTemplateColumns: "1fr 1fr 1.3fr" } }, head, cells.flat());
          grid.querySelectorAll("div:not(.hd)").forEach(c => { c.style.fontSize = "25px"; c.style.fontWeight = "700"; c.style.color = WT.adj.c; });
          const sents = life(s, "Im Alltag",
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Die Siegessäule ist ", s.h("b", { class: "green" }, "höher als"), " das Brandenburger Tor."),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Beim Sportfest läuft Mia ", s.h("b", { class: "green" }, "am schnellsten"), "."),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Pizza schmeckt mir ", s.h("b", { class: "green" }, "besser"), " als Spinat."));
          sents.classList.add("later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Beim Vergleich steht ", s.h("b", null, "als"), ". Vor dem Nomen: ", s.h("b", null, "der höchste Turm"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "460px 1fr", gap: "26px", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, grid, sents, merk)));
          const grow = async b => {
            b.g.classList.remove("later"); s.show([b.num, b.lab], "fade");
            s.sfx.whoosh();
            await s.tween({ dur: 900, ease: "out", update: v => { b.g.setAttribute("transform", `translate(0 ${G}) scale(1 ${Math.max(0.001, v)}) translate(0 ${-G})`); b.num.textContent = Math.round(b.h * v) + " m"; } });
            b.g.removeAttribute("transform");
            s.sfx.ding(); await s.show(b.wd, "pop");
          };
          B.forEach((b, i) => s.step(async () => {
            await grow(b);
            s.say(["Das Brandenburger Tor ist 26 Meter hoch.", "Die Siegessäule ist mit 67 Metern höher.", "Der Fernsehturm ist mit 368 Metern am höchsten."][i]);
            if (i === 2) s.confetti(420, 120, 50);
          }));
          s.step(async () => { s.sfx.pop(); await s.show(grid, "up"); s.say("Positiv, Komparativ, Superlativ. Gut, besser, am besten ist unregelmäßig."); });
          s.step(async () => { s.sfx.pop(); await s.show(sents, "up"); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Pronomen: die Stellvertreter",
        say: "Pronomen stehen für ein Nomen. So musst du nicht immer denselben Namen wiederholen.",
        build(s) {
          const n1 = s.h("span", { class: "d1word", style: { color: WT.n.c, fontWeight: 700 } }, "Julian");
          const n2 = s.h("span", { class: "d1word", style: { color: WT.n.c, fontWeight: 700 } }, "Julians");
          const chat = life(s, "Im Alltag: Chat",
            s.h("div", { class: "stack", style: { gap: "14px" } },
              s.h("div", { class: "d1bub" }, s.h("b", { style: { color: WT.n.c } }, "Julian"), " kommt heute später."),
              s.h("div", { class: "d1bub" }, n1, " hat noch Training."),
              s.h("div", { class: "d1bub" }, n2, " Trainer ist streng."),
              s.h("div", { class: "d1bub me" }, "Okay! Ich warte auf ", s.h("b", { style: { color: WT.pr.c } }, "euch"), ".")));
          const pp = [["ich", "mein"], ["du", "dein"], ["er", "sein"], ["sie", "ihr"], ["es", "sein"], ["wir", "unser"], ["ihr", "euer"], ["sie / Sie", "ihr / Ihr"]];
          const pers = s.h("div", { class: "card later", style: { padding: "12px 16px" } },
            s.h("p", { class: "h2", style: { fontSize: "25px", marginBottom: "8px" } }, "Personalpronomen: Wer?"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "8px 14px", alignItems: "center" } },
              s.h("span", null), s.h("b", { class: "small pencil" }, "Singular"), s.h("b", { class: "small pencil" }, "Plural"),
              [["1. Person", ["ich"], ["wir"]], ["2. Person", ["du"], ["ihr"]], ["3. Person", ["er", "sie", "es"], ["sie"]]].map(([l, a, b]) => [s.h("span", { class: "small pencil" }, l), s.h("div", { class: "d1row", style: { gap: "6px" } }, a.map(x => chip(s, x, "pr", "s"))), s.h("div", { class: "d1row", style: { gap: "6px" } }, b.map(x => chip(s, x, "pr", "s")))])),
            s.h("p", { class: "small", style: { marginTop: "8px" } }, "Höflich zu Erwachsenen: ", s.h("b", { style: { color: WT.pr.c } }, "Sie"), " – „Können ", s.h("b", { style: { color: WT.pr.c } }, "Sie"), " mir helfen?“"));
          const poss = s.h("div", { class: "card later", style: { padding: "12px 16px" } },
            s.h("p", { class: "h2", style: { fontSize: "25px", marginBottom: "8px" } }, "Possessivpronomen: Wem gehört es?"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 10px", fontSize: "22px" } }, pp.map(([a, b]) => s.h("span", null, a, " → ", s.h("b", { style: { color: WT.pr.c } }, b)))),
            s.h("p", { class: "t", style: { fontSize: "22px", marginTop: "10px" } }, s.h("b", { style: { color: WT.pr.c } }, "Mein"), " Ball? Nein, das ist ", s.h("b", { style: { color: WT.pr.c } }, "deine"), " Trinkflasche. ", s.h("b", { style: { color: WT.pr.c } }, "Unser"), " Team gewinnt!"));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "24px", height: "100%", alignItems: "start" } }, chat, s.h("div", { class: "stack", style: { gap: "14px" } }, pers, poss)));
          s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await flipText(s, n1, "Er"); n1.style.color = WT.pr.c; bump(s, n1, 0.3); s.say("Statt Julian sagen wir er."); });
          s.step(async () => { s.sfx.zap(); await flipText(s, n2, "Sein"); n2.style.color = WT.pr.c; bump(s, n2, 0.3); s.say("Statt Julians Trainer sagen wir sein Trainer."); });
          s.step(async () => { s.sfx.pop(); await s.show(pers, "left"); s.say("Ich, du, er, sie, es, wir, ihr, sie."); });
          s.step(async () => { s.sfx.pop(); await s.show(poss, "left"); s.sfx.ding(); s.say("Mein, dein, sein, ihr, unser, euer. Sie sagen, wem etwas gehört."); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Präpositionen: Wo ist der Ball?",
        say: "Präpositionen zeigen, wie Dinge zueinander stehen. Tippe auf ein Wort und schau, wo der Ball landet.",
        build(s) {
          const svg = s.svg(540, 420); svg.setAttribute("width", 560); svg.setAttribute("height", 436);
          svg.append(s.el("line", { x1: 20, y1: 384, x2: 520, y2: 384, stroke: "#c8b79a", "stroke-width": 4, "stroke-linecap": "round" }));
          const back = s.el("g"), boxG = s.el("g"), mid = s.el("g"), frontFace = s.el("g"), top = s.el("g");
          const R = (x, y, w, h, f) => s.el("rect", { x, y, width: w, height: h, fill: f, stroke: "#7a4f22", "stroke-width": 3 });
          boxG.append(R(165, 320, 40, 64, "#b98a55"), R(355, 320, 40, 64, "#b98a55"),
            s.el("polygon", { points: "400,170 440,140 440,290 400,320", fill: "#b07a3f", stroke: "#7a4f22", "stroke-width": 3, "stroke-linejoin": "round" }),
            s.el("polygon", { points: "160,170 400,170 440,140 200,140", fill: "#e3b87c", stroke: "#7a4f22", "stroke-width": 3, "stroke-linejoin": "round" }));
          frontFace.append(R(160, 170, 240, 150, "#d9a566"), ...[208, 246, 284].map(y => s.el("line", { x1: 160, y1: y, x2: 400, y2: y, stroke: "#a87638", "stroke-width": 3 })),
            s.el("text", { x: 280, y: 308, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#7a4f22", text: "Kiste" }));
          const ball = s.el("g");
          ball.append(s.el("circle", { cx: 0, cy: 0, r: 26, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }),
            s.el("polygon", { points: "0,-9 8.6,-2.8 5.3,7.3 -5.3,7.3 -8.6,-2.8", fill: "#1b2740" }),
            ...[[0, -9, 0, -26], [8.6, -2.8, 24, -8], [5.3, 7.3, 15, 21], [-5.3, 7.3, -15, 21], [-8.6, -2.8, -24, -8]].map(([a, b, c, d]) => s.el("line", { x1: a, y1: b, x2: c, y2: d, stroke: "#1b2740", "stroke-width": 2 })));
          svg.append(back, boxG, mid, frontFace, top);
          const POS = {
            auf: { x: 290, y: 129, r: 1, layer: top },
            unter: { x: 280, y: 357, r: 1, layer: top },
            neben: { x: 95, y: 357, r: 1, layer: top },
            in: { x: 280, y: 262, r: 1, layer: mid, see: true },
            hinter: { x: 444, y: 232, r: 0.82, layer: back },
            vor: { x: 300, y: 370, r: 1.3, layer: top },
          };
          const bp = { x: 95, y: 357, r: 1 };
          const setBall = () => ball.setAttribute("transform", `translate(${bp.x} ${bp.y}) scale(${bp.r})`);
          top.append(ball); setBall();
          const prepEl = chip(s, "neben", "pp");
          const sent = s.h("p", { class: "big", style: { fontSize: "34px", lineHeight: "1.5" } }, "Der Ball liegt ", prepEl, " der Kiste.");
          let busy = 0;
          async function go(p) {
            const id = ++busy;
            btns.forEach(b => b.classList.toggle("solid", b.textContent === p));
            const T = POS[p], from = { ...bp };
            s.sfx.whoosh();
            flipText(s, prepEl, p);
            if (s.fast) { Object.assign(bp, T); T.layer.append(ball); frontFace.setAttribute("opacity", T.see ? 0.35 : 1); setBall(); return; }
            top.append(ball);
            await s.tween({ dur: 750, ease: "inOut", update: (v, t) => { if (id !== busy) return; bp.x = s.lerp(from.x, T.x, v); bp.y = s.lerp(from.y, T.y, v) - 120 * Math.sin(Math.PI * t); bp.r = s.lerp(from.r, T.r, v); setBall(); } });
            if (id !== busy) return;
            T.layer.append(ball);
            frontFace.setAttribute("opacity", T.see ? 0.35 : 1);
            s.sfx.boing();
            s.say("Der Ball liegt " + p + " der Kiste.");
          }
          const btns = Object.keys(POS).map(p => s.h("button", { class: "btn", style: { fontSize: "24px" }, onclick: () => { s.sfx.click(); go(p); } }, p));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Frage ", s.h("b", null, "Wo?"), " → nach der Präposition steht der Dativ: auf ", s.h("b", null, "der"), " Kiste, unter ", s.h("b", null, "dem"), " Tisch.");
          const lf = life(s, "Im Alltag",
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Die U-Bahn fährt ", s.h("b", { style: { color: WT.pp.c } }, "unter"), " der Stadt."),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Das Handy liegt ", s.h("b", { style: { color: WT.pp.c } }, "neben"), " dem Teller."),
            s.h("p", { class: "t", style: { fontSize: "22px" } }, "Der Ball landet ", s.h("b", { style: { color: WT.pp.c } }, "hinter"), " dem Tor."));
          lf.classList.add("later");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "22px", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, svg, sent),
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "cols3", style: { gap: "10px" } }, btns), merk, lf)));
          s.show(svg, "zoom"); s.sfx.pop();
          ["auf", "unter", "in", "hinter", "vor"].forEach(p => s.step(async () => { await go(p); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Konjunktionen: Satz-Kleber",
        say: "Konjunktionen verbinden Wörter und Sätze, wie Kleber. Nach weil und dass rutscht das Verb ans Ende.",
        build(s) {
          const ROWS = [
            ["und", "Musik", "Lea spielt Gitarre . Tom spielt Schlagzeug .", [1, 5], "0 1 2 K 4 5 6 7"],
            ["oder", "Schulweg", "Nimmst du die U-Bahn ? Fährst du mit dem Rad ?", [0, 5], "0 1 2 3 K 5:fährst 6 7 8 9 10"],
            ["aber", "Fußball", "Das Spiel war spannend . Wir haben verloren .", [2, 6, 7], "0 1 2 3 C K 5:wir 6 7 8"],
            ["weil", "Chat", "Ich komme später . Die U-Bahn hat Verspätung .", [1, 6], "0 1 2 C K 4:die 5 7 6 8"],
            ["dass", "Chat", "Ich hoffe es . Du kommst morgen .", [1, 5], "0 1 C K 4:du 6 5 7"],
          ];
          const rows = ROWS.map(([k, lab, txt, verbs, fin]) => {
            const words = txt.split(" ");
            const toks = {};
            words.forEach((w, i) => { toks[i] = /^[.?!,]$/.test(w) ? s.h("span", { class: "d1p", style: { fontSize: "29px" } }, w) : s.h("span", { class: "d1word", style: { fontSize: "29px", fontWeight: verbs.includes(i) ? 700 : 400, color: verbs.includes(i) ? WT.v.c : "" } }, w); });
            toks.K = chip(s, k, "k", "s"); toks.K.classList.add("later");
            toks.C = s.h("span", { class: "d1p later", style: { fontSize: "29px" } }, ",");
            const row = s.h("div", { class: "d1row", style: { gap: "8px", flexWrap: "nowrap" } }, words.map((_, i) => toks[i]));
            const state = fin.split(" ").map(x => { const [id, t] = x.split(":"); return t ? [id, t] : id; });
            const el = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", padding: "10px 16px", minHeight: "88px" } },
              s.h("div", { class: "stack", style: { gap: "4px", alignItems: "flex-start" } }, tag(s, "k", k), s.h("span", { class: "small pencil" }, lab)), row);
            return { el, row, toks, state, k };
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Nach ", s.h("b", null, "weil"), " und ", s.h("b", null, "dass"), " rutscht das Verb ans Ende. Vor ", s.h("b", null, "aber, weil, dass"), " steht ein Komma.");
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%" } }, rows.map(r => r.el), merk));
          s.show(rows.map(r => r.el), "left"); s.sfx.whoosh();
          rows.forEach((r, i) => s.step(async () => {
            s.sfx.whoosh();
            await morph(s, r.row, r.toks, r.state, { arc: 36, dur: 800 });
            s.sfx.snap(); bump(s, r.toks.K, 0.25);
            s.say(["Lea spielt Gitarre und Tom spielt Schlagzeug.", "Nimmst du die U-Bahn oder fährst du mit dem Rad?", "Das Spiel war spannend, aber wir haben verloren.", "Ich komme später, weil die U-Bahn Verspätung hat. Schau, das Verb rutscht ans Ende.", "Ich hoffe, dass du morgen kommst. Auch hier steht das Verb am Ende."][i]);
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------------- */
      {
        title: "Adverbien: wann, wo, wie?",
        say: "Adverbien sagen, wann, wo oder wie etwas passiert. Sie bekommen keine Endungen.",
        build(s) {
          const C = [
            ["Wann?", ["heute", "morgen", "jetzt", "oft"], ["Die U-Bahn kommt ", "gleich", "."]],
            ["Wo?", ["hier", "dort", "oben", "draußen"], ["Wir spielen ", "draußen", " Fußball."]],
            ["Wie?", ["gern", "leider", "sehr", "so"], ["Ich esse ", "gern", " Pizza."]],
          ];
          const cards = C.map(([q, ws, sent]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px" } },
            s.h("p", { class: "d1q", style: { color: WT.adv.c, fontSize: "44px", margin: 0 } }, q),
            s.h("div", { class: "d1row", style: { gap: "8px" } }, ws.map(w => chip(s, w, "adv"))),
            s.h("p", { class: "t", style: { fontSize: "25px", marginTop: "auto" } }, sent[0], s.h("b", { style: { color: WT.adv.c } }, sent[1]), sent[2])));
          const adjW = chip(s, "schöner", "adj"); const artS = s.h("span", { class: "d1word" }, "ein"), nounS = s.h("span", { class: "d1word" }, "Tag");
          const advW = chip(s, "heute", "adv");
          const cmp = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "18px 22px" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "small pencil" }, "Adjektiv – verändert sich:"), s.h("p", { class: "t", style: { fontSize: "28px" } }, artS, " ", adjW, " ", nounS)),
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "small pencil" }, "Adverb – bleibt immer gleich:"), s.h("p", { class: "t", style: { fontSize: "28px" } }, advW, " Abend")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "Adverbien bekommen ", s.h("b", null, "keine Endung"), " und keinen Artikel. Frag: ", s.h("b", null, "Wann? Wo? Wie?"));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards), cmp, merk));
          s.sfx.pop();
          cards.forEach((c, i) => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); s.say(["Wann? Heute, morgen, gleich.", "Wo? Hier, dort, draußen.", "Wie? Gern, leider, sehr."][i]); }));
          s.step(async () => {
            s.sfx.pop(); await s.show(cmp, "up");
            const forms = [["der", "schöne", "Tag"], ["am", "schönen", "Tag"], ["ein", "schönes", "Spiel"]];
            for (const [a, b, c] of forms) { if (!s.alive) return; flipText(s, artS, a); flipText(s, adjW, b); flipText(s, nounS, c); s.sfx.tick(); bump(s, advW, 0.08); await s.wait(700); }
            s.sfx.ding(); await s.show(merk, "up");
          });
        },
      },
      /* 16 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: die Wortarten-Brille",
        say: "Setz die Wortarten-Brille auf! Tippe auf eine Wortart und sie leuchtet im Text auf.",
        build(s) {
          const TXT = "Am:pp Samstag:n fahren:v wir:pr mit:pp der:art U-Bahn:n zum:pp Spiel:n .  Mein:pr Bruder:n trägt:v sein:pr neues:adj Trikot:n .  Die:art Bahn:n ist:v voll:adj , aber:k wir:pr finden:v sofort:adv einen:art Platz:n .  Dort:adv jubeln:v wir:pr , weil:k unser:pr Team:n heute:adv gewinnt:v .";
          const toks = TXT.split(/\s+/).filter(Boolean).map(w => { const i = w.lastIndexOf(":"); return i > 0 ? [w.slice(0, i), w.slice(i + 1)] : [w, null]; });
          const els = toks.map(([w, k]) => (k ? s.h("span", { class: "d1w s", style: { borderColor: "transparent", background: "transparent", padding: "2px 7px", fontSize: "26px" } }, w) : s.h("span", { class: "d1p", style: { fontSize: "26px", marginLeft: "-1px" } }, w)));
          const textBox = life(s, "Mein Tag: Mit der U-Bahn zum Fußball", s.h("div", { class: "d1row", style: { gap: "4px 2px", lineHeight: "1.2" } }, els));
          const on = new Set();
          const order = ["n", "art", "v", "adj", "pr", "pp", "k", "adv"];
          const count = k => toks.filter(t => t[1] === k).length;
          const btns = order.map(k => {
            const b = s.h("button", { class: "btn", style: { borderColor: WT[k].c, color: WT[k].c, fontSize: "20px", padding: "0 12px" }, onclick: () => { s.sfx.click(); toggle(k); } }, WT[k].name, s.h("span", { class: "d1tag", style: { background: WT[k].c, fontSize: "19px", padding: "4px 9px" } }, String(count(k))));
            b.dataset.k = k; return b;
          });
          function render() {
            btns.forEach(b => { const k = b.dataset.k, a = on.has(k); b.style.background = a ? WT[k].b : "#fff"; });
          }
          async function toggle(k, force) {
            const want = force != null ? force : !on.has(k);
            if (want) on.add(k); else on.delete(k);
            render();
            const hit = els.filter((e, i) => toks[i][1] === k);
            hit.forEach((e, j) => {
              if (want) { e.style.borderColor = WT[k].c; e.style.background = WT[k].b; setTimeout(() => s.alive && bump(s, e, 0.2), j * 60); }
              else { e.style.borderColor = "transparent"; e.style.background = "transparent"; }
            });
            if (want) { s.sfx.chord([0, 4, 7]); s.say(count(k) + " mal " + WT[k].name); } else s.sfx.swoosh();
          }
          const allBtn = s.h("button", { class: "btn solid", onclick: async () => { for (const k of order) { if (!s.alive) return; await toggle(k, true); await s.wait(250); } } }, "Alle an");
          const offBtn = s.h("button", { class: "btn", onclick: () => order.forEach(k => toggle(k, false)) }, "Alle aus");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px", padding: "10px 18px 12px" } }, "In jedem Text stecken alle Familien. Am häufigsten: ", s.h("b", { style: { color: WT.n.c } }, "Nomen"), ", ", s.h("b", { style: { color: WT.v.c } }, "Verben"), " und ", s.h("b", { style: { color: WT.pr.c } }, "Pronomen"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%" } }, textBox,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" } }, btns),
            s.h("div", { class: "row", style: { gap: "12px" } }, allBtn, offBtn), merk));
          s.show(textBox, "up"); s.sfx.pop();
          s.step(async () => { await toggle("n", true); });
          s.step(async () => { await toggle("v", true); });
          s.step(async () => { for (const k of ["art", "adj", "pr", "pp", "k", "adv"]) { await toggle(k, true); await s.wait(300); } s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
    ],
  });
})();
