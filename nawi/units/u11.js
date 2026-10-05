/* Kapitel 11 – Körper und Gesundheit (RLP NaWi 5/6, Themenfeld 3.7).
   Nährstoffe, Pausenbrot, DGE-Ernährungskreis (2024), Weg der Nahrung, Darm, Gebiss, Zahnaufbau, Karies,
   Zähneputzen, Atmung (Lunge, Zwerchfell), Gasaustausch, Atemzüge zählen, Herz, Blutkreislauf, Puls,
   Rauchen und Sucht vorbeugen (Zigarette/E-Zigarette, Flimmerhärchen, Nein sagen, JuSchG), Schlaf/Bewegung/Bildschirm. Fakten geprüft (Quellen im Bericht): DGE, KZBV, BZgA, WHO u. a. */
(() => {
  const UC = "#db2777";
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const SKIN = "#f6d2b0", SKIND = "#c98d60", RED = "#d62839", BLUE = "#3b6fd8";

  /* ---------- helpers (as in u9) ---------- */
  const P = (s, html, cls = "t", hidden = false) => s.h("p", { class: cls + (hidden ? " later" : ""), html });
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const exb = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, html, hidden = true, size = 22) => s.h("div", { class: "merk" + (hidden ? " later" : ""), style: { fontSize: size + "px" }, html });
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const cols = (s, lw, left, right, gap = 24) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px 1fr", gap: gap + "px", alignItems: "center", height: "100%" } }, left, right);
  const lineTo = (s, x1, y1, x2, y2, col = UC, cls = "later") => s.el("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 2.5, class: cls });
  const txt = (s, x, y, t, anchor = "start", extra = {}) => s.el("text", Object.assign({ x, y, "text-anchor": anchor, class: "lbl later", style: { fontWeight: 700 }, text: t }, extra));
  const bg = (s, sv, w, h) => sv.append(s.el("rect", { x: 0, y: 0, width: w, height: h, rx: 16, fill: "#fdf0f6" }));

  const NUT = [
    ["kh", "Kohlenhydrate", "🍞", "#e0a33a"], ["fett", "Fette", "🧈", "#e8c547"], ["eiw", "Eiweiße", "🥚", "#c2410c"],
    ["vit", "Vitamine", "🍊", "#ee7a1a"], ["min", "Mineralstoffe", "🥛", "#5d6678"], ["wasser", "Wasser", "💧", "#3b6fd8"],
  ];

  Deck.unit({
    id: "u11", num: 11, title: "Körper und Gesundheit", color: UC, soft: "#fce7f3",
    subtitle: "Essen, Verdauung, Zähne, Atmung, Herz – was dir guttut und was dir schadet",
    blurb: "Nährstoffe, Verdauung, Zähne, Atmung, Herz und Puls",
    goals: [
      "Die Nährstoffe und ihre Aufgaben kennen",
      "Den Weg der Nahrung durch den Körper beschreiben",
      "Gebiss, Zahnaufbau und Karies verstehen",
      "Atmung und Blutkreislauf erklären, Puls messen",
      "Wissen, was Schlaf und Bewegung bewirken – und warum Rauchen schadet",
    ],
    icon(svg, el) {
      svg.append(
        el("path", { d: "M35 60 C10 42 6 22 20 15 C28 11 35 18 35 24 C35 18 42 11 50 15 C64 22 60 42 35 60 Z", fill: UC }),
        el("path", { d: "M12 36 L26 36 L31 26 L38 46 L43 36 L58 36", stroke: "#fff", "stroke-width": 4, fill: "none", "stroke-linejoin": "round", "stroke-linecap": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was steckt im Essen?",
        say: "Unser Essen enthält Nährstoffe. Manche geben Energie, manche bauen den Körper auf, manche halten ihn gesund.",
        build(s) {
          const INFO = {
            kh: ["Energie für Muskeln und Gehirn", "Brot, Nudeln, Reis, Kartoffeln"],
            fett: ["Viel Energie, Vorrat im Körper", "Öl, Butter, Nüsse, Käse"],
            eiw: ["Baustoff für Muskeln und Haut", "Ei, Bohnen, Linsen, Milch, Fisch"],
            vit: ["Halten gesund, schützen", "Obst und Gemüse, z. B. Paprika, Orange"],
            min: ["Calcium für Knochen und Zähne, Eisen fürs Blut", "Milch, Käse, Vollkorn, Gemüse"],
            wasser: ["Transportiert Stoffe, kühlt den Körper", "Wasser, ungesüßter Tee, Obst"],
          };
          const GRP = { kh: "Brennstoff", fett: "Brennstoff", eiw: "Baustoff", vit: "Schutzstoff", min: "Baustoff + Schutzstoff", wasser: "Lebenswichtig" };
          const cards = NUT.map(([k, n, e, c]) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "64px 1fr", gap: "10px", padding: "12px 14px", alignItems: "center", borderColor: c } },
            s.h("div", { style: { fontSize: "46px", textAlign: "center" } }, e),
            s.h("div", { class: "stack", style: { gap: "2px" } }, s.h("p", { class: "t", style: { fontWeight: 800, color: c, fontSize: "22px" } }, n),
              P(s, INFO[k][0], "small"), P(s, INFO[k][1], "small pencil"), s.h("span", { class: "chip", style: { alignSelf: "flex-start", fontSize: "19px" } }, GRP[k]))));
          const m = merk(s, "<b>Brennstoffe</b> geben Energie, <b>Baustoffe</b> bauen den Körper auf, <b>Schutzstoffe</b> halten ihn gesund. Du brauchst alle!", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } }, ...cards), m));
          s.sfx.pop();
          s.step(async () => { for (const i of [0, 1]) { s.sfx.note(i * 2, .2); await s.show(cards[i], "up"); } s.say("Kohlenhydrate und Fette sind Brennstoffe."); });
          s.step(async () => { for (const i of [2, 4]) { s.sfx.note(4 + i, .2); await s.show(cards[i], "up"); } s.say("Eiweiße und Mineralstoffe sind Baustoffe."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(cards[3], "up"); s.sound("tropfen", { vol: 0.5, dur: 1.2 }); await s.show(cards[5], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Pack dein Pausenbrot",
        say: "Tippe auf Lebensmittel und packe deine Brotdose. Welche Nährstoffe hast du dabei?",
        build(s) {
          const FOOD = [
            ["🍞", "Vollkornbrot", ["kh", "min", "eiw"]], ["🧀", "Käse", ["eiw", "fett", "min"]], ["🍎", "Apfel", ["vit", "kh", "wasser"]],
            ["🫑", "Paprika", ["vit", "wasser"]], ["🥜", "Nüsse", ["fett", "eiw", "min"]], ["🚰", "Wasser", ["wasser"]], ["🍬", "Gummibärchen", ["kh"]],
          ];
          const box = s.h("div", { style: { minHeight: "150px", border: "4px solid " + UC, borderRadius: "22px", background: "#fff", display: "flex", flexWrap: "wrap", gap: "8px", padding: "14px", alignContent: "flex-start", fontSize: "50px" } });
          const chips = NUT.map(([k, n, e, c]) => { const ch = s.h("span", { class: "chip", style: { fontSize: "19px", background: "#eee", color: "#8a93a6" } }, e + " " + n); ch.k = k; ch.col = c; return ch; });
          const have = new Set();
          const info = s.h("p", { class: "t", style: { minHeight: "34px" } }, "Tippe unten auf ein Lebensmittel.");
          const add = (i, quiet) => {
            const [e, n, ks] = FOOD[i];
            if (box.children.length >= 9) return;
            const it = s.h("span", { class: "a-pop" }, e); box.append(it);
            ks.forEach(k => have.add(k));
            chips.forEach(ch => { if (have.has(ch.k)) { ch.style.background = ch.col; ch.style.color = "#fff"; } });
            info.innerHTML = "<b>" + n + "</b>: " + ks.map(k => NUT.find(x => x[0] === k)[1]).join(", ") + (i === 6 ? " – nur Zucker." : ".");
            if (!quiet) { i === 6 ? s.sfx.boing() : s.sfx.pop(); if (have.size === 6) s.sfx.success(); }
          };
          const clear = () => { box.replaceChildren(); have.clear(); chips.forEach(ch => { ch.style.background = "#eee"; ch.style.color = "#8a93a6"; }); info.textContent = "Leer. Tippe auf ein Lebensmittel."; s.sfx.whoosh(); };
          const btns = FOOD.map(([e, n], i) => s.h("button", { class: "btn", style: { flexDirection: "column", height: "96px", gap: "2px", padding: "0 8px" }, onclick: () => add(i) }, s.h("span", { style: { fontSize: "38px" } }, e), s.h("span", { style: { fontSize: "19px" } }, n)));
          const lf = life(s, "Gut zu wissen", P(s, "Gummibärchen geben nur schnellen Zucker. Vollkorn macht lange satt, weil es <b>Ballaststoffe</b> enthält.", "small"));
          const m = merk(s, "Eine bunte Brotdose liefert alle Nährstoffe.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "start" } },
              stack(s, 10, s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Deine Brotdose"), box, info),
              stack(s, 10, s.h("div", { class: "row", style: { gap: "8px" } }, ...chips), m, lf)),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px", justifyContent: "center" } }, ...btns, s.h("button", { class: "btn", style: { height: "96px" }, onclick: clear }, "Leeren"))));
          s.sfx.pop();
          s.step(async () => { for (const i of [0, 1, 3]) { add(i); await s.wait(500); } });
          s.step(async () => { add(5); await s.wait(400); s.sfx.success(); await s.show(m, "up"); });
          s.step(async () => { add(6); await s.wait(300); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Der DGE-Ernährungskreis",
        say: "Der Ernährungskreis der Deutschen Gesellschaft für Ernährung zeigt: Je größer ein Feld, desto mehr davon darfst du essen. In der Mitte stehen die Getränke.",
        build(s) {
          const sv = s.svg(540, 540);
          const cx = 270, cy = 270, R = 250, r0 = 92;
          const SEG = [
            ["Gemüse, Hülsenfrüchte", 0.27, "#4d9a3a", "🥦"], ["Obst, Nüsse", 0.17, "#e0603a", "🍎"], ["Getreide, Kartoffeln", 0.26, "#d9a441", "🍞"],
            ["Milchprodukte", 0.13, "#7cb3e0", "🧀"], ["Fisch, Fleisch, Eier", 0.1, "#b0573a", "🐟"], ["Öle, Fette", 0.07, "#e8c547", "🫒"],
          ];
          let a0 = -Math.PI / 2;
          const segs = SEG.map(([n, f, col, e]) => {
            const a1 = a0 + f * TAU, la = f > 0.5 ? 1 : 0;
            const p = (r, a) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
            const d = `M${p(r0, a0)} L${p(R, a0)} A${R} ${R} 0 ${la} 1 ${p(R, a1)} L${p(r0, a1)} A${r0} ${r0} 0 ${la} 0 ${p(r0, a0)} Z`;
            const am = (a0 + a1) / 2, rm = (R + r0) / 2 + 10;
            const g = s.el("g", { class: "later" }, s.el("path", { d, fill: col, stroke: "#fff", "stroke-width": 5 }),
              s.el("text", { x: cx + rm * Math.cos(am), y: cy + rm * Math.sin(am) + 14, "text-anchor": "middle", "font-size": f > 0.09 ? 46 : 34, text: e }));
            a0 = a1; return { g, n, col };
          });
          const mid = s.el("g", { class: "later" }, s.el("circle", { cx, cy, r: r0 - 6, fill: "#cfe6fb", stroke: "#fff", "stroke-width": 5 }), s.el("text", { x: cx, y: cy + 2, "text-anchor": "middle", "font-size": 46, text: "💧" }),
            s.el("text", { x: cx, y: cy + 40, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "Getränke" }));
          sv.append(...segs.map(x => x.g), mid);
          const list = s.h("div", { class: "stack", style: { gap: "4px" } }, ...segs.map(x => { const r = s.h("div", { class: "row later", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "22px", height: "22px", borderRadius: "6px", background: x.col, flex: "none" } }), s.h("span", { class: "small" }, x.n)); x.row = r; return r; }));
          const m = merk(s, "Mehr als <b>drei Viertel</b> pflanzlich, knapp ein Viertel tierisch. Am meisten: <b>trinken</b> – am besten Wasser.", true, 21);
          const lf = life(s, "5 am Tag", s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } }, s.photo("gemuesestand", { w: 140, h: 96, style: { flex: "none" } }), P(s, "3 Portionen Gemüse und 2 Portionen Obst. Eine Portion ist ungefähr eine Handvoll – deine Hand!", "small")));
          s.add(cols(s, 540, sv, stack(s, 12, P(s, "Je <b>größer</b> das Feld, desto <b>mehr</b> davon. Die Felder sind hier vereinfacht gezeichnet.", "small"), list, m, lf)));
          s.sfx.pop();
          s.step(async () => { s.sound("water-pour", { vol: 0.4, dur: 1.5 }); await s.show(mid, "zoom"); });
          s.step(async () => { for (const [i, x] of segs.entries()) { s.sfx.note(i * 2, .18); s.show(x.row, "left"); await s.show(x.g, "pop"); } });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Die Reise des Essens",
        say: "Ein Bissen reist durch deinen Körper: Mund, Speiseröhre, Magen, Dünndarm und Dickdarm. Das dauert ein bis drei Tage.",
        build(s) {
          const sv = s.svg(440, 600);
          bg(s, sv, 440, 600);
          sv.append(s.el("circle", { cx: 220, cy: 62, r: 50, fill: SKIN, stroke: SKIND, "stroke-width": 3 }),
            s.el("path", { d: "M200 84 Q220 98 240 84", stroke: "#9b2c22", "stroke-width": 4, fill: "none" }),
            s.el("path", { d: "M195 110 L195 140 L95 170 L80 590 L360 590 L345 170 L245 140 L245 110 Z", fill: "#fbe3d0", stroke: SKIND, "stroke-width": 3 }));
          const SPEIS = "M220 90 L224 160 L232 232";
          const MAGEN = "M232 232 C300 212 336 252 320 296 C306 334 252 336 236 316";
          const DUENN = "M296 330 C296 362 172 352 172 380 C172 404 292 396 292 420 C292 444 172 436 172 460 C172 484 276 478 160 492";
          const DICK = "M140 492 L140 345 L325 345 L325 500 Q325 540 240 545 L240 585";
          const org = [
            s.el("path", { d: SPEIS, stroke: "#e58f8f", "stroke-width": 14, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: MAGEN + " C222 300 240 288 254 296 Z", fill: "#f4a6b8", stroke: "#b0405e", "stroke-width": 3 }),
            s.el("path", { d: DICK, stroke: "#d9a77a", "stroke-width": 26, fill: "none", "stroke-linejoin": "round" }),
            s.el("path", { d: DUENN, stroke: "#f4b6a6", "stroke-width": 16, fill: "none", "stroke-linecap": "round" }),
          ];
          sv.append(...org);
          const path = [s.el("path", { d: "M220 84 L220 90 " + SPEIS.slice(1).replace(/^220 90 /, ""), fill: "none" }), s.el("path", { d: "M232 232 C300 212 336 252 320 296 L296 330", fill: "none" }), s.el("path", { d: DUENN, fill: "none" }), s.el("path", { d: "M160 492 L140 492 " + DICK.slice(1).replace(/^140 492 /, ""), fill: "none" })];
          path.forEach(p => sv.append(p));
          const bolus = s.el("circle", { cx: 220, cy: 84, r: 11, fill: "#8a5a2a", stroke: "#fff", "stroke-width": 2.5 });
          sv.append(bolus);
          const ST = [
            ["Mund", "Zähne zerkleinern, Speichel macht den Bissen rutschig.", "Kau gut: Lange gekautes Brot schmeckt süß.", ""],
            ["Speiseröhre", "Ein Muskelschlauch schiebt den Bissen nach unten – sogar im Handstand.", "etwa 25 cm lang", "Sekunden"],
            ["Magen", "Magensaft mit Säure macht einen Brei daraus.", "2 bis 4 Stunden, fettes Essen länger", ""],
            ["Dünndarm", "Die Nährstoffe gehen hier ins Blut.", "5 bis 6 m lang · 7 bis 9 Stunden", ""],
            ["Dickdarm", "Dem Rest wird Wasser entzogen. Was übrig bleibt, verlässt den Körper.", "etwa 1,5 m · 1 bis 3 Tage", ""],
          ];
          const name = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Start: ein Bissen Brot");
          const what = P(s, "Drücke auf Weiter und folge dem Bissen.");
          const num = s.h("span", { class: "chip", style: { fontSize: "20px", alignSelf: "flex-start" } }, "Mund");
          const tl = s.h("div", { class: "row", style: { gap: "6px" } }, ...ST.map(([n]) => s.h("span", { class: "chip", style: { fontSize: "19px", background: "#eee" } }, n)));
          const go = async i => {
            tl.children[i].style.background = "var(--unit)"; tl.children[i].style.color = "#fff";
            name.textContent = ST[i][0]; what.textContent = ST[i][1]; num.textContent = ST[i][2];
            if (i === 0) { s.sfx.drum(); await s.tween({ from: 1, to: 0.6, dur: 600, update: v => bolus.setAttribute("r", 11 * v + 3) }); return; }
            const p = path[i === 1 ? 0 : i - 1]; if (i === 1) { /* speiseröhre: first part */ }
            const L = p.getTotalLength();
            const from = i === 1 ? 0 : 0, to = L;
            s.sfx.whoosh();
            await s.tween({ from, to, dur: i === 2 ? 1800 : 2200, ease: "inOut", update: v => { const q = p.getPointAtLength(v); bolus.setAttribute("cx", q.x); bolus.setAttribute("cy", q.y); } });
            if (i === 2) { s.sound("bubbles", { vol: 0.4 }); bolus.setAttribute("fill", "#c98d60"); }
            if (i === 4) bolus.setAttribute("fill", "#6b4a20");
            s.sfx.pop();
          };
          const lf = life(s, "Im Alltag", P(s, "Kauen, genug trinken und Ballaststoffe aus Vollkorn, Obst und Gemüse halten die Verdauung in Schwung.", "small"));
          s.add(cols(s, 440, sv, stack(s, 14, tl, s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "210px" } }, name, what, num), lf)));
          s.show(sv, "fade"); s.sfx.pop();
          // Mund → Speiseröhre path uses path[0]; Magen → path[1]; Dünndarm → path[2]; Dickdarm → path[3]
          s.step(async () => { await go(0); });
          s.step(async () => { tl.children[1].style.background = "var(--unit)"; tl.children[1].style.color = "#fff"; name.textContent = ST[1][0]; what.textContent = ST[1][1]; num.textContent = ST[1][2]; s.sfx.whoosh();
            const p = path[0], L = p.getTotalLength(); await s.tween({ from: 0, to: L, dur: 1400, ease: "inOut", update: v => { const q = p.getPointAtLength(v); bolus.setAttribute("cx", q.x); bolus.setAttribute("cy", q.y); } }); s.sfx.pop(); });
          [1, 2, 3].forEach(k => s.step(async () => {
            const i = k + 1; tl.children[i].style.background = "var(--unit)"; tl.children[i].style.color = "#fff"; name.textContent = ST[i][0]; what.textContent = ST[i][1]; num.textContent = ST[i][2];
            const p = path[k], L = p.getTotalLength(); s.sfx.whoosh();
            await s.tween({ from: 0, to: L, dur: k === 2 ? 3200 : 2200, ease: "inOut", update: v => { const q = p.getPointAtLength(v); bolus.setAttribute("cx", q.x); bolus.setAttribute("cy", q.y); } });
            if (k === 1) { s.sound("bubbles", { vol: 0.4 }); bolus.setAttribute("fill", "#c98d60"); } else if (k === 3) { bolus.setAttribute("fill", "#6b4a20"); s.sfx.ding(); } else s.sfx.pop();
          }));
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
          void go;
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Der Darm: lang und gefaltet",
        say: "Dein Dünndarm ist fünf bis sechs Meter lang. Ausgerollt wäre er viel länger als du groß bist. Er passt nur hinein, weil er in Schlingen liegt.",
        build(s) {
          const W = 1060, H = 300;
          const sv = s.svg(W, H);
          bg(s, sv, W, H);
          const M = 165; // px per metre
          for (let m = 0; m <= 6; m++) sv.append(s.el("line", { x1: 40 + m * M, y1: 250, x2: 40 + m * M, y2: 266, stroke: "#1b2740", "stroke-width": 2 }), s.el("text", { x: 40 + m * M, y: 290, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: m + " m" }));
          sv.append(s.el("line", { x1: 40, y1: 258, x2: 40 + 6 * M, y2: 258, stroke: "#1b2740", "stroke-width": 2 }));
          // child 1,40 m standing on the left as a bar
          const kid = s.el("g", { class: "later" }, s.el("rect", { x: 40, y: 200, width: 1.4 * M, height: 30, rx: 10, fill: "#7cb3e0" }), s.el("text", { x: 50, y: 222, class: "lbl", style: { fontWeight: 700 }, text: "Kind: 1,40 m" }));
          const gut = s.el("path", { fill: "none", stroke: "#f4a6b8", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" });
          const gutT = s.el("text", { x: 50, y: 60, class: "lbl", style: { fontWeight: 700 }, text: "" });
          sv.append(kid, gut, gutT);
          const draw = u => { // u 0 = coiled, 1 = rolled out to 5,5 m
            const len = 5.5 * M, pts = [];
            for (let i = 0; i <= 120; i++) {
              const t = i / 120, xs = 40 + t * len, ys = 120;
              const a = t * 14 * Math.PI, xc = 150 + Math.sin(a) * 70 + t * 40, yc = 70 + t * 110 + Math.cos(a) * 12;
              pts.push(`${xc + (xs - xc) * u} ${yc + (ys - yc) * u}`);
            }
            gut.setAttribute("d", "M" + pts.join(" L"));
          };
          draw(0);
          const sl = s.slider({ label: "Ausrollen", min: 0, max: 100, value: 0, fmt: v => v + " %", onInput: v => { draw(v / 100); gutT.textContent = v > 95 ? "Dünndarm: etwa 5,5 m" : ""; } });
          const z = exb(s, "Darmzotten", P(s, "Innen ist der Dünndarm voller winziger Falten und Zotten. So hat er eine riesige Oberfläche – und viel Platz, um Nährstoffe ins Blut zu geben.", "small"));
          const c = exb(s, "Zum Vergleich", P(s, "Speiseröhre etwa 25 cm, Dünndarm 5 bis 6 m, Dickdarm etwa 1,5 m.", "small"));
          const m = merk(s, "Der Darm liegt in vielen <b>Schlingen</b> im Bauch – nur so passt er hinein.", true, 21);
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, sv, sl, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" } }, c, z, m)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 100, dur: 2600, ease: "inOut", update: v => { sl.input.value = v; draw(v / 100); } }); sl.set(100); s.sfx.ding(); });
          s.step(async () => { s.sfx.pop(); await s.show(kid, "left"); s.say("Der Dünndarm ist fast viermal so lang wie ein Kind groß ist."); await s.show(c, "up"); });
          s.step(async () => { s.sfx.scribble(); await s.show(z, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 100, to: 0, dur: 2000, ease: "inOut", update: v => { sl.input.value = v; draw(v / 100); gutT.textContent = ""; } }); sl.set(0); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Milchzähne und bleibende Zähne",
        say: "Kinder haben zuerst zwanzig Milchzähne. Ab etwa sechs Jahren kommen die bleibenden Zähne: am Ende sind es zweiunddreißig.",
        build(s) {
          const sv = s.svg(560, 470);
          bg(s, sv, 560, 470);
          sv.append(s.el("path", { d: "M70 440 C60 160 160 40 280 40 C400 40 500 160 490 440", fill: "#f7b6c4", stroke: "#c2536f", "stroke-width": 4 }),
            s.el("text", { x: 280, y: 300, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fill: "#9b2c4a" }, text: "Oberkiefer (von unten)" }));
          const teethG = s.el("g"); sv.append(teethG);
          const COL = { S: "#ffffff", E: "#fff3c4", V: "#dbeafe", B: "#d6f0dc" };
          const arch = s.el("path", { d: "M112 430 C102 170 180 78 280 78 C380 78 458 170 448 430", fill: "none" });
          sv.append(arch);
          const SZ = { S: 30, E: 32, V: 36, B: 44 };
          const place = types => { // types for one half (front → back), mirrored
            teethG.replaceChildren();
            const L = arch.getTotalLength(), mid = L / 2;
            let off = 2;
            types.forEach(t => {
              const w = SZ[t], c = off + w / 2; off += w + 4;
              [-1, 1].forEach(d => {
                const at = mid + d * c, q = arch.getPointAtLength(at), q2 = arch.getPointAtLength(Math.min(L, at + 1)), q1 = arch.getPointAtLength(Math.max(0, at - 1));
                const ang = Math.atan2(q2.y - q1.y, q2.x - q1.x) * 180 / Math.PI;
                teethG.append(s.el("rect", { x: q.x - w / 2, y: q.y - 20, width: w, height: 40, rx: 12, fill: COL[t], stroke: "#8a93a6", "stroke-width": 2.5, transform: `rotate(${ang} ${q.x} ${q.y})` }));
              });
            });
            s.tween({ from: 0, to: 1, dur: 500, update: v => teethG.setAttribute("opacity", v) });
          };
          const MILK = ["S", "S", "E", "B", "B"], ADULT = ["S", "S", "E", "V", "V", "B", "B", "B"];
          const cnt = s.h("span", { class: "huge mono", style: { color: "var(--unit)", fontSize: "64px" } }, "20");
          const lab = s.h("p", { class: "h2" }, "Milchgebiss");
          const legend = s.h("div", { class: "stack", style: { gap: "4px" } },
            ...[["S", "Schneidezähne: abbeißen"], ["E", "Eckzähne: festhalten, reißen"], ["V", "vordere Backenzähne"], ["B", "Backenzähne: zermahlen"]].map(([k, t]) => s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "24px", height: "24px", borderRadius: "8px", background: COL[k], border: "2.5px solid #8a93a6", flex: "none" } }), s.h("span", { class: "small" }, t))));
          const show = async adult => { place(adult ? ADULT : MILK); lab.textContent = adult ? "Bleibendes Gebiss" : "Milchgebiss"; s.sfx.pop(); await countTo(adult ? 32 : 20); };
          let cur = 20;
          const countTo = async to => { const a = cur; let last = a; await s.tween({ from: a, to, dur: 900, update: v => { const r = Math.round(v); cnt.textContent = r; if (r !== last) { last = r; s.sfx.tick(); } } }); cur = to; };
          const bM = s.h("button", { class: "btn", onclick: () => show(false) }, "Milchgebiss");
          const bA = s.h("button", { class: "btn solid", onclick: () => show(true) }, "Bleibendes Gebiss");
          const lf = life(s, "Gut zu wissen", P(s, "Ab etwa 6 Jahren schieben die bleibenden Zähne die Milchzähne heraus. Bleibende Zähne wachsen nie nach – pass gut auf sie auf!", "small"));
          s.add(cols(s, 560, sv, stack(s, 12, s.h("div", { class: "row", style: { gap: "14px", alignItems: "baseline" } }, cnt, lab), P(s, "Zähne oben und unten zusammen. Gezeigt ist der Oberkiefer.", "small pencil"), s.h("div", { class: "row" }, bM, bA), legend, lf)));
          place(MILK); s.show(sv, "fade");
          s.step(async () => { await show(true); s.sfx.ding(); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Ein Zahn von innen",
        say: "Außen schützt der Zahnschmelz. Er ist der härteste Stoff im ganzen Körper. Innen liegt das Zahnmark mit Nerven und Blutgefäßen.",
        build(s) {
          const sv = s.svg(560, 590);
          bg(s, sv, 560, 590);
          const TOOTH = "M170 120 C170 60 220 50 245 80 C262 60 298 60 315 80 C340 50 390 60 390 120 C392 190 380 250 370 300 C360 380 350 470 330 540 C318 560 300 552 298 530 L285 380 C283 360 277 360 275 380 L262 530 C260 552 242 560 230 540 C210 470 200 380 190 300 C180 250 168 190 170 120 Z";
          const bone = s.el("rect", { x: 20, y: 320, width: 520, height: 250, rx: 16, fill: "#f1e7cf", class: "later" });
          const gum = s.el("path", { d: "M20 260 Q160 240 200 300 L200 340 L20 340 Z M540 260 Q400 240 360 300 L360 340 L540 340 Z", fill: "#f39cb3", stroke: "#c2536f", "stroke-width": 3, class: "later" });
          const enamel = s.el("path", { d: TOOTH, fill: "#ffffff", stroke: "#8a93a6", "stroke-width": 4 });
          const dentin = s.el("path", { d: TOOTH, fill: "#f5e6b8", transform: "translate(280 300) scale(0.86 0.9) translate(-280 -300)", class: "later" });
          const pulp = s.el("path", { d: "M240 140 C250 120 310 120 320 140 C322 200 312 260 300 320 L292 500 L284 500 L280 380 L276 500 L268 500 L260 320 C248 260 238 200 240 140 Z", fill: "#e8586e", class: "later" });
          const vessels = s.el("path", { d: "M272 500 L268 330 M288 500 L292 330", stroke: "#8b1e2e", "stroke-width": 3, class: "later" });
          sv.append(bone, enamel, dentin, pulp, vessels, gum);
          const L = [
            ["schmelz", "Zahnschmelz", 20, 100, 176, 110], ["bein", "Zahnbein", 20, 190, 196, 190], ["mark", "Zahnmark", 540, 170, 312, 170],
            ["fleisch", "Zahnfleisch", 20, 236, 150, 300], ["wurzel", "Wurzel", 540, 470, 330, 470], ["kiefer", "Kieferknochen", 20, 540, 130, 500],
          ].map(([k, t, x, y, px, py]) => { const w = t.length * 10.6 + 8, l = lineTo(s, x < 100 ? x + w : x - w, y - 7, px, py); const tx = txt(s, x, y, t, x < 100 ? "start" : "end"); sv.append(l, tx); return { k, l, tx }; });
          const lab = async k => { for (const x of L.filter(x => x.k === k)) { s.sfx.tick(); await s.show(x.l, "draw"); s.show(x.tx, "fade"); } };
          const info = s.h("div", { class: "card soft stack", style: { gap: "8px", minHeight: "190px" } }, s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Ein Backenzahn, aufgeschnitten"), P(s, "Von außen nach innen."));
          const set = (a, b) => { info.children[0].textContent = a; info.children[1].innerHTML = b; };
          const m = merk(s, "<b>Zahnschmelz</b> ist der härteste Stoff deines Körpers. Aber er wächst nicht nach!", true, 21);
          s.add(cols(s, 560, sv, stack(s, 16, info, m)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { await lab("schmelz"); set("Zahnschmelz", "Die harte, glänzende Schutzschicht der Zahnkrone."); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(dentin, "fade"); await lab("bein"); set("Zahnbein", "Etwas weicher. Es bildet den größten Teil des Zahns."); });
          s.step(async () => { s.sfx.pop(); s.show(pulp, "fade"); await s.show(vessels, "draw"); await lab("mark"); set("Zahnmark", "Mit Nerven und Blutgefäßen. Darum tut ein kaputter Zahn weh."); });
          s.step(async () => { s.sfx.pop(); s.show(bone, "fade"); await s.show(gum, "up"); await lab("fleisch"); await lab("wurzel"); await lab("kiefer"); set("Fest verankert", "Die Wurzel steckt im Kieferknochen, das Zahnfleisch umschließt den Zahn."); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Karies: Säure gegen Zähne",
        say: "Im Zahnbelag leben Bakterien. Sie fressen Zucker und machen daraus Säure. Die Säure greift den Zahnschmelz an: Es entsteht Karies.",
        build(s) {
          const W = 560, H = 440;
          const { canvas, g } = s.canvas(W, H);
          const bact = Array.from({ length: 14 }, (_, i) => ({ x: 120 + (i * 37) % 320, y: 170 + (i * 23) % 40, a: i }));
          const st = { sugar: [], acid: [], hole: 0, nB: 4, clean: 0 };
          s.loop((t, dt) => {
            const d = Math.min(dt || 0.016, 0.05);
            g.fillStyle = "#fdf0f6"; g.fillRect(0, 0, W, H);
            // tooth crown (big, from the side)
            g.fillStyle = "#fff"; g.strokeStyle = "#8a93a6"; g.lineWidth = 4;
            g.beginPath(); g.moveTo(80, 440); g.lineTo(90, 230); g.quadraticCurveTo(100, 190, 160, 196); g.quadraticCurveTo(220, 170, 280, 196); g.quadraticCurveTo(340, 170, 400, 196); g.quadraticCurveTo(460, 190, 470, 230); g.lineTo(480, 440); g.closePath(); g.fill(); g.stroke();
            g.fillStyle = "#f5e6b8"; g.beginPath(); g.moveTo(110, 440); g.lineTo(118, 250); g.quadraticCurveTo(280, 220, 442, 250); g.lineTo(450, 440); g.closePath(); g.fill();
            // hole
            if (st.hole > 0) { g.fillStyle = "#3a2a1a"; g.beginPath(); g.ellipse(280, 200 + st.hole * 30, 16 + st.hole * 40, 8 + st.hole * 34, 0, 0, TAU); g.fill(); }
            // bacteria
            for (let i = 0; i < Math.min(st.nB, bact.length); i++) { const b = bact[i]; const x = b.x + Math.sin(t * 2 + b.a) * 6, y = b.y - 30 + Math.cos(t * 1.7 + b.a) * 4; g.fillStyle = "#4d9a3a"; g.beginPath(); g.ellipse(x, y, 12, 7, b.a, 0, TAU); g.fill(); g.fillStyle = "#1b2740"; g.beginPath(); g.arc(x + 4, y - 1, 1.8, 0, TAU); g.fill(); }
            // sugar
            st.sugar.forEach(o => { o.y = Math.min(o.y + 220 * d, 150); g.fillStyle = "#fff"; g.strokeStyle = "#c2a060"; g.lineWidth = 2; g.fillRect(o.x - 8, o.y - 8, 16, 16); g.strokeRect(o.x - 8, o.y - 8, 16, 16); });
            st.acid.forEach(o => { o.y += 40 * d; o.l -= d; g.fillStyle = `rgba(240,160,20,${Math.max(0, o.l)})`; g.beginPath(); g.arc(o.x, o.y, 7, 0, TAU); g.fill(); });
            st.acid = st.acid.filter(o => o.l > 0);
            if (st.clean > 0) { st.clean -= d; const bx = 80 + (1 - st.clean) * 420; g.fillStyle = "#3b6fd8"; g.fillRect(bx - 60, 110, 140, 22); g.fillStyle = "#cfe6fb"; for (let k = 0; k < 12; k++) g.fillRect(bx - 56 + k * 11, 132, 7, 30); }
            g.font = "700 20px 'Atkinson Hyperlegible'"; g.fillStyle = "#1b2740"; g.textAlign = "left"; g.fillText("Zahnbelag mit Bakterien", 16, 30);
          });
          let busy = false;
          const sweet = async () => {
            if (busy) return; busy = true; s.sfx.pop(); info.innerHTML = "Zucker kommt auf die Zähne …";
            st.sugar = Array.from({ length: 6 }, (_, i) => ({ x: 150 + i * 50, y: -20 - i * 30 }));
            await s.wait(1100); st.nB = Math.min(14, st.nB + 5); s.sfx.zap(); st.sugar = [];
            info.innerHTML = "Bakterien fressen den Zucker und machen <b>Säure</b>.";
            st.acid = Array.from({ length: 12 }, (_, i) => ({ x: 200 + (i * 29) % 160, y: 150, l: 1.6 }));
            await s.tween({ from: st.hole, to: Math.min(1, st.hole + 0.4), dur: 1400, update: v => st.hole = v });
            info.innerHTML = st.hole > 0.7 ? "Ein Loch im Zahn: <b>Karies</b>. Jetzt hilft nur noch der Zahnarzt." : "Die Säure löst Stoffe aus dem Zahnschmelz.";
            s.sfx.error(); busy = false;
          };
          const brush = async () => { if (busy) return; busy = true; s.sound("zaehneputzen", { vol: 0.6 }); st.clean = 1; await s.wait(1000); st.nB = 2; st.sugar = []; info.innerHTML = "Putzen entfernt den Belag mit den Bakterien. Ein Loch geht davon aber nicht weg."; s.sfx.success(); busy = false; };
          const info = P(s, "Bakterien leben im Zahnbelag.");
          const b1 = s.h("button", { class: "btn", onclick: sweet }, "🍬 Süßes essen"), b2 = s.h("button", { class: "btn solid", onclick: brush }, "🪥 Zähne putzen");
          const m = merk(s, "<b>Zucker</b> + <b>Bakterien</b> → <b>Säure</b> → Karies. Weniger Süßes und gutes Putzen schützen.", true, 21);
          const lf = life(s, "Im Alltag", P(s, "Auch Saft, Limo und Eistee enthalten viel Zucker. Wasser ist das beste Getränk für die Zähne.", "small"));
          s.add(cols(s, 560, canvas, stack(s, 14, s.h("div", { class: "card soft", style: { minHeight: "120px" } }, info), s.h("div", { class: "row" }, b1, b2), m, lf)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { await sweet(); });
          s.step(async () => { await sweet(); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { await brush(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Richtig Zähne putzen",
        say: "Putze zweimal am Tag zwei Minuten lang: morgens und abends. Mit der KAI-Regel vergisst du keine Fläche: Kauflächen, Außenflächen, Innenflächen.",
        build(s) {
          const ring = s.svg(240, 240);
          ring.append(s.el("circle", { cx: 120, cy: 120, r: 100, fill: "none", stroke: "#fce7f3", "stroke-width": 22 }));
          const arc = s.el("circle", { cx: 120, cy: 120, r: 100, fill: "none", stroke: UC, "stroke-width": 22, "stroke-dasharray": `0 ${TAU * 100}`, transform: "rotate(-90 120 120)", "stroke-linecap": "round" });
          const tt = s.el("text", { x: 120, y: 134, "text-anchor": "middle", "font-size": 46, "font-weight": 800, fill: "#1b2740", text: "0:00" });
          ring.append(arc, tt);
          const K = [["K", "Kauflächen", "hin und her schrubben"], ["A", "Außenflächen", "kleine Kreise, vom Zahnfleisch zum Zahn"], ["I", "Innenflächen", "von Rot nach Weiß auswischen"]];
          const kai = K.map(([l, n, t]) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "60px 1fr", gap: "12px", alignItems: "center", padding: "10px 14px" } },
            s.h("span", { class: "huge", style: { color: "var(--unit)", fontSize: "52px" } }, l), s.h("div", { class: "stack", style: { gap: "2px" } }, s.h("p", { class: "t", style: { fontWeight: 800 } }, n), P(s, t, "small"))));
          const run = async () => { s.sound("zaehneputzen", { vol: 0.5, loop: false }); let last = -1; await s.tween({ from: 0, to: 120, dur: 6000, ease: "linear", update: v => { const sec = Math.floor(v); arc.setAttribute("stroke-dasharray", `${v / 120 * TAU * 100} ${TAU * 100}`); tt.textContent = Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); if (Math.floor(v / 30) !== last) { last = Math.floor(v / 30); s.sfx.tick(); } } }); s.sfx.success(); };
          const btn = s.h("button", { class: "btn solid", onclick: run }, "2 Minuten (schnell)");
          const ph = s.h("div", { class: "later" }, s.photo("zahnbuerste", { w: 300, h: 220, pos: "50% 50%" }));
          const m = merk(s, "<b>Zweimal</b> am Tag, je <b>zwei Minuten</b>. Und einmal im Halbjahr zur Kontrolle zum Zahnarzt.", true, 21);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "300px 1fr", gap: "28px", alignItems: "center", height: "100%" } },
            stack(s, 12, s.h("div", { class: "center" }, ring), s.h("div", { class: "center" }, btn), ph), stack(s, 12, ...kai, m)));
          s.show(ring, "zoom"); s.sfx.pop();
          s.step(async () => { await run(); });
          K.forEach((_, i) => s.step(async () => { s.sfx.note(i * 3, .2); await s.show(kai[i], "left"); }));
          s.step(async () => { s.sfx.ding(); s.show(m, "up"); await s.show(ph, "zoom"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Atmen: Lunge und Zwerchfell",
        say: "Beim Einatmen zieht sich das Zwerchfell nach unten. Der Brustkorb wird weiter, und Luft strömt in die Lunge. Beim Ausatmen wird alles wieder kleiner.",
        build(s) {
          const sv = s.svg(520, 590);
          bg(s, sv, 520, 590);
          sv.append(s.el("circle", { cx: 260, cy: 60, r: 46, fill: SKIN, stroke: SKIND, "stroke-width": 3 }),
            s.el("path", { d: "M235 104 L235 130 L120 160 L105 580 L415 580 L400 160 L285 130 L285 104 Z", fill: "#fbe3d0", stroke: SKIND, "stroke-width": 3 }));
          const lungs = s.el("g");
          const trachea = s.el("path", { d: "M260 70 L260 200 M260 200 L215 240 M260 200 L305 240", stroke: "#c2536f", "stroke-width": 12, fill: "none", "stroke-linecap": "round" });
          const dia = s.el("path", { fill: "none", stroke: "#b0405e", "stroke-width": 8, "stroke-linecap": "round" });
          const ribs = s.el("g", { stroke: "#d9c9a8", "stroke-width": 5, fill: "none" });
          const air = s.el("g");
          sv.append(ribs, lungs, trachea, dia, air);
          const L1 = s.el("path", { fill: "#f4a6b8", stroke: "#b0405e", "stroke-width": 3 }), L2 = s.el("path", { fill: "#f4a6b8", stroke: "#b0405e", "stroke-width": 3 });
          lungs.append(L1, L2);
          const labT = s.el("text", { x: 260, y: 560, "text-anchor": "middle", class: "lbl", style: { fontWeight: 800, fontSize: "26px", fill: UC }, text: "" });
          sv.append(labT, txt(s, 20, 470, "Zwerchfell", "start", { class: "lbl" }), txt(s, 20, 300, "Lunge", "start", { class: "lbl" }), txt(s, 330, 160, "Luftröhre", "start", { class: "lbl" }),
            lineTo(s, 130, 464, 175, 452, UC), lineTo(s, 82, 294, 160, 300, UC), lineTo(s, 328, 154, 266, 150, UC));
          const draw = b => { // b 0 = ausgeatmet, 1 = eingeatmet
            const k = 1 + b * 0.12, dy = b * 40;
            const lung = d => `M${260 + d * 18} 210 C${260 + d * 120 * k} 170 ${260 + d * 128 * k} 260 ${260 + d * 122 * k} ${380 + dy} C${260 + d * 90} ${400 + dy} ${260 + d * 40} ${390 + dy} ${260 + d * 22} ${370 + dy * 0.8} Z`;
            L1.setAttribute("d", lung(-1)); L2.setAttribute("d", lung(1));
            dia.setAttribute("d", `M130 ${430 + dy * 0.5} Q260 ${(350 + dy) - (1 - b) * 10 + b * 40} 390 ${430 + dy * 0.5}`);
            ribs.replaceChildren(...[0, 1, 2, 3].map(i => s.el("path", { d: `M140 ${230 + i * 45 - b * 6} Q260 ${200 + i * 45 - b * 14} 380 ${230 + i * 45 - b * 6}` })));
          };
          draw(0);
          let phase = 0, auto = false;
          s.loop((t, dt) => { if (!auto) return; phase += (dt || 0.016) / 4.5; const b = (1 - Math.cos(phase * TAU)) / 2; draw(b); labT.textContent = Math.sin(phase * TAU) > 0 ? "Einatmen" : "Ausatmen"; });
          const breathe = async () => { auto = false; s.sound("atemzug", { vol: 0.6 }); labT.textContent = "Einatmen"; await s.tween({ from: 0, to: 1, dur: 1500, ease: "inOut", update: draw }); labT.textContent = "Ausatmen"; await s.tween({ from: 1, to: 0, dur: 1700, ease: "inOut", update: draw }); labT.textContent = ""; };
          const btn = s.h("button", { class: "btn solid", onclick: breathe }, "Einmal tief atmen");
          const way = exb(s, "Weg der Luft", P(s, "Nase → Rachen → <b>Luftröhre</b> → Bronchien → <b>Lungenbläschen</b>. Die Nase wärmt und reinigt die Luft.", "small"));
          const m = merk(s, "Das <b>Zwerchfell</b> ist ein Muskel unter der Lunge. Es zieht sich beim Einatmen nach unten.", true, 21);
          const lf = life(s, "Mitmachen", P(s, "Lege eine Hand auf deinen Bauch und atme tief ein: Der Bauch wölbt sich, weil das Zwerchfell nach unten drückt.", "small"));
          s.add(cols(s, 520, sv, stack(s, 12, s.h("div", { class: "row" }, btn), way, m, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { for (const x of sv.querySelectorAll(".later")) { s.sfx.tick(); await s.show(x, "fade"); } await breathe(); });
          s.step(async () => { s.sfx.pop(); await s.show(way, "up"); s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); auto = true; });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Gasaustausch in der Lunge",
        say: "In den Lungenbläschen geht Sauerstoff aus der Luft ins Blut. Kohlenstoffdioxid geht aus dem Blut in die Luft und wird ausgeatmet.",
        build(s) {
          const W = 580, H = 470;
          const { canvas, g } = s.canvas(W, H);
          let on = 0;
          const O = Array.from({ length: 10 }, (_, i) => ({ p: i / 10, x: 180 + (i * 41) % 220 }));
          const C = Array.from({ length: 8 }, (_, i) => ({ p: i / 8, x: 200 + (i * 53) % 200 }));
          s.loop((t, dt) => {
            g.fillStyle = "#fdf0f6"; g.fillRect(0, 0, W, H);
            // alveolus
            g.fillStyle = "#e7f2fb"; g.strokeStyle = "#c2536f"; g.lineWidth = 6; g.beginPath(); g.arc(290, 170, 150, Math.PI * 0.95, Math.PI * 2.05); g.lineTo(440, 290); g.lineTo(140, 290); g.closePath(); g.fill(); g.stroke();
            g.fillStyle = "#e7f2fb"; g.fillRect(250, 0, 80, 40); g.strokeStyle = "#c2536f"; g.beginPath(); g.moveTo(250, 0); g.lineTo(250, 30); g.moveTo(330, 0); g.lineTo(330, 30); g.stroke();
            // capillary
            const grd = g.createLinearGradient(40, 0, 540, 0); grd.addColorStop(0, "#8f6ad0"); grd.addColorStop(1, "#e04a5a");
            g.fillStyle = grd; g.beginPath(); g.roundRect(30, 300, 520, 80, 40); g.fill();
            // blood cells flowing
            for (let i = 0; i < 9; i++) { const x = 40 + ((t * 70 + i * 60) % 520); const f = (x - 40) / 520; g.fillStyle = `rgb(${Math.round(120 + f * 100)},${Math.round(60 - f * 20)},${Math.round(180 - f * 130)})`; g.beginPath(); g.ellipse(x, 340 + (i % 2 ? 12 : -12), 16, 10, 0, 0, TAU); g.fill(); }
            if (on) {
              O.forEach(o => { o.p = (o.p + (dt || 0.016) * 0.35) % 1; const y = 120 + o.p * 220; g.fillStyle = "#1d5bd0"; g.beginPath(); g.arc(o.x, y, 8, 0, TAU); g.fill(); });
              if (on > 1) C.forEach(o => { o.p = (o.p + (dt || 0.016) * 0.3) % 1; const y = 350 - o.p * 230; g.fillStyle = "#5d6678"; g.beginPath(); g.arc(o.x + 14, y, 10, 0, TAU); g.fill(); });
            }
            g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillStyle = "#1b2740";
            g.fillText("Lungenbläschen (Luft)", 150, 80); g.fillText("Blutgefäß", 40, 420);
            g.textAlign = "right"; g.fillText("Blut fließt weiter →", 550, 420);
          });
          const kO = exb(s, "Sauerstoff (blaue Punkte)", P(s, "geht aus der Luft durch die hauchdünne Wand ins Blut. Das Blut bringt ihn in den ganzen Körper.", "small"));
          const kC = exb(s, "Kohlenstoffdioxid (graue Punkte)", P(s, "entsteht im Körper. Es geht aus dem Blut in die Lungenbläschen und wird ausgeatmet.", "small"));
          const n = exb(s, "300 bis 500 Millionen", P(s, "Lungenbläschen hat ein Erwachsener. Zusammen bilden sie eine riesige Fläche für den Austausch.", "small"));
          const m = merk(s, "Ausgeatmete Luft enthält <b>weniger Sauerstoff</b> und <b>mehr Kohlenstoffdioxid</b> als eingeatmete.", true, 21);
          s.add(cols(s, 580, canvas, stack(s, 12, kO, kC, n, m), 20));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { on = 1; s.sound("atemzug", { vol: 0.5 }); await s.show(kO, "up"); });
          s.step(async () => { on = 2; s.sfx.whoosh(); await s.show(kC, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(n, "up"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Atemzüge zählen",
        say: "Zähle deine Atemzüge eine Minute lang. In Ruhe atmen Kinder in deinem Alter etwa sechzehn bis zwanzig Mal pro Minute.",
        build(s) {
          const sv = s.svg(420, 420);
          const ball = s.el("circle", { cx: 210, cy: 200, r: 90, fill: "#fce7f3", stroke: UC, "stroke-width": 6 });
          const tt = s.el("text", { x: 210, y: 216, "text-anchor": "middle", "font-size": 46, "font-weight": 800, fill: "#1b2740", text: "60" });
          const sub = s.el("text", { x: 210, y: 380, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "Sekunden" });
          sv.append(ball, tt, sub);
          let run = false, t0 = 0, now = 0;
          s.loop(t => { now = t; const b = (1 - Math.cos(t * TAU / 3.4)) / 2; ball.setAttribute("r", 90 + b * 60); if (run) { const left = Math.max(0, 60 - (t - t0)); tt.textContent = Math.ceil(left); if (left <= 0) { run = false; s.sfx.fanfare(); sub.textContent = "Fertig! Wie viele waren es?"; } } });
          const start = () => { run = true; t0 = now; sub.textContent = "Zähle jedes Einatmen"; s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid", onclick: start }, "Minute starten");
          const t1 = exb(s, "So geht's", P(s, "Setz dich ruhig hin. Lege eine Hand auf den Bauch. Zähle jedes Einatmen, bis die Minute um ist. Der Ball zeigt ein ruhiges Tempo.", "small"));
          const t2 = exb(s, "Ruhe", P(s, "Kinder mit 10 bis 12 Jahren: etwa <b>16 bis 20</b> Atemzüge pro Minute.", "small"));
          const t3 = life(s, "Nach dem Sport", P(s, "Mach 30 Hampelmänner und zähle noch einmal: Jetzt atmest du schneller und tiefer. Die Muskeln brauchen mehr Sauerstoff.", "small"));
          s.add(cols(s, 420, stack(s, 10, sv, s.h("div", { class: "center" }, btn)), stack(s, 14, t1, t2, t3)));
          s.show(sv, "zoom"); s.sound("atemzug", { vol: 0.4 });
          s.step(async () => { s.sfx.pop(); await s.show(t1, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(t2, "up"); });
          s.step(async () => { s.sound("ball-kick", { vol: 0.4 }); await s.show(t3, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Das Herz: eine starke Pumpe",
        say: "Dein Herz ist ein Muskel, etwa so groß wie deine Faust. Es pumpt Tag und Nacht Blut durch deinen Körper.",
        build(s) {
          const sv = s.svg(500, 500);
          bg(s, sv, 500, 500);
          const heart = s.el("g");
          heart.append(
            s.el("path", { d: "M250 440 C120 360 60 260 90 170 C115 100 200 90 250 150 C300 90 385 100 410 170 C440 260 380 360 250 440 Z", fill: "#e8586e", stroke: "#8b1e2e", "stroke-width": 5 }),
            s.el("path", { d: "M250 150 L250 430", stroke: "#8b1e2e", "stroke-width": 5 }),
            s.el("path", { d: "M180 60 L180 150 M320 60 L320 150", stroke: "#8b1e2e", "stroke-width": 26, "stroke-linecap": "round" }),
            s.el("path", { d: "M180 60 L180 150", stroke: BLUE, "stroke-width": 18, "stroke-linecap": "round" }),
            s.el("path", { d: "M320 60 L320 150", stroke: RED, "stroke-width": 18, "stroke-linecap": "round" }));
          sv.append(heart,
            s.el("text", { x: 170, y: 290, "text-anchor": "middle", class: "lbl", style: { fill: "#fff", fontWeight: 800 }, text: "rechte" }), s.el("text", { x: 170, y: 316, "text-anchor": "middle", class: "lbl", style: { fill: "#fff", fontWeight: 800 }, text: "Hälfte" }),
            s.el("text", { x: 330, y: 290, "text-anchor": "middle", class: "lbl", style: { fill: "#fff", fontWeight: 800 }, text: "linke" }), s.el("text", { x: 330, y: 316, "text-anchor": "middle", class: "lbl", style: { fill: "#fff", fontWeight: 800 }, text: "Hälfte" }),
            s.el("text", { x: 250, y: 486, "text-anchor": "middle", class: "lbl", style: { fill: "#5d6678" }, text: "(von vorn gesehen: rechts und links vertauscht)" }));
          let beat = false, last = -1;
          s.loop(t => { if (!beat) return; const ph = (t * 80 / 60) % 1; const k = 1 + 0.07 * Math.max(0, Math.sin(ph * TAU * 2)) * (ph < 0.5 ? 1 : 0); heart.setAttribute("transform", `translate(250 260) scale(${k}) translate(-250 -260)`); const n = Math.floor(t * 80 / 60); if (n !== last) { last = n; } });
          const F = [["Faust", "So groß ist dein Herz – etwa wie deine Faust."], ["5 Liter", "Blut pumpt das Herz eines Erwachsenen in Ruhe – jede Minute."], ["100.000", "Mal schlägt ein Herz ungefähr an einem Tag."]];
          const cards = F.map(([b, t]) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center", padding: "12px 16px" } },
            s.h("span", { class: "huge mono", style: { color: "var(--unit)", fontSize: "44px" } }, b), P(s, t, "small")));
          const m = merk(s, "Das Herz ist ein <b>Muskel</b>. Es pumpt Blut in zwei Kreisläufen: zur Lunge und durch den Körper.", true, 21);
          s.add(cols(s, 500, sv, stack(s, 14, ...cards, m)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { beat = true; s.sound("heartbeat", { vol: 0.6, dur: 3 }); await s.show(cards[0], "up"); });
          s.step(async () => { s.sound("water-pour", { vol: 0.4, dur: 1.5 }); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "up"); const n = cards[2].firstChild; await s.tween({ from: 0, to: 100000, dur: 1400, ease: "out", update: v => n.textContent = s.fmt(Math.round(v / 1000) * 1000) }); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Der Blutkreislauf",
        say: "Das Blut fließt im Kreis: vom Herzen zur Lunge, wo es Sauerstoff holt, zurück zum Herzen und dann in den ganzen Körper. Dort gibt es den Sauerstoff ab.",
        build(s) {
          const W = 560, H = 560;
          const { canvas, g } = s.canvas(W, H);
          const cx = 280;
          // loop path: heart right side (x=240,y=280) up to lung (y=80) back to heart left (x=320,y=280) down to body (y=480) back
          const loopPt = u => { // figure-eight around (cx,180) [lung] and (cx,380) [body]; crossing at heart (cx,280)
            if (u < 0.5) { const a = u * 2 * TAU; return { x: cx - Math.sin(a) * 170, y: 180 + Math.cos(a) * 100 }; }
            const a = (u - 0.5) * 2 * TAU; return { x: cx + Math.sin(a) * 190, y: 380 - Math.cos(a) * 100 };
          };
          let on = 0;
          const cells = Array.from({ length: 36 }, (_, i) => ({ u: i / 36 }));
          s.loop((t, dt) => {
            const d = Math.min(dt || 0.016, 0.05);
            g.fillStyle = "#fdf0f6"; g.fillRect(0, 0, W, H);
            // lung box & body box
            g.fillStyle = "#cfe6fb"; g.beginPath(); g.roundRect(cx - 70, 6, 140, 56, 16); g.fill();
            g.fillStyle = "#fbe3d0"; g.beginPath(); g.roundRect(cx - 80, 496, 160, 56, 16); g.fill();
            g.font = "700 22px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillStyle = "#1b2740"; g.fillText("Lunge", cx, 42); g.fillText("Körper", cx, 532);
            // paths
            g.lineWidth = 14; g.lineCap = "round";
            for (let i = 0; i < 100; i++) { const u0 = i / 100, u1 = (i + 1) / 100, p0 = loopPt(u0), p1 = loopPt(u1);
              const red = (u0 > 0.25 && u0 < 0.75); g.strokeStyle = red ? "rgba(214,40,57,.35)" : "rgba(59,111,216,.35)"; g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.stroke(); }
            if (on) cells.forEach(c => { c.u = (c.u + d * 0.06) % 1; const p = loopPt(c.u); const red = c.u > 0.25 && c.u < 0.75; g.fillStyle = red ? RED : BLUE; g.beginPath(); g.ellipse(p.x, p.y, 9, 6, 0, 0, TAU); g.fill(); });
            // heart in the middle
            g.fillStyle = "#e8586e"; g.strokeStyle = "#8b1e2e"; g.lineWidth = 4; const k = 1 + 0.06 * Math.max(0, Math.sin(t * TAU * 1.3));
            g.save(); g.translate(cx, 280); g.scale(k, k); g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(-70, 0, -60, -50, 0, -26); g.bezierCurveTo(60, -50, 70, 0, 0, 40); g.fill(); g.stroke(); g.restore();
            g.fillStyle = "#fff"; g.font = "700 19px 'Atkinson Hyperlegible'"; g.fillText("Herz", cx, 284);
          });
          const k1 = exb(s, "Lungenkreislauf", P(s, "Das Herz pumpt sauerstoffarmes Blut (<b style='color:#3b6fd8'>blau</b> gezeichnet) zur Lunge. Dort wird es mit Sauerstoff beladen (<b style='color:#d62839'>rot</b>).", "small"));
          const k2 = exb(s, "Körperkreislauf", P(s, "Zurück im Herzen, wird es in den ganzen Körper gepumpt. Die Organe nehmen den Sauerstoff und die Nährstoffe.", "small"));
          const m = merk(s, "Echtes Blut ist immer rot – sauerstoffarmes Blut ist nur dunkler. Blau ist nur die Farbe im Bild.", true, 21);
          s.add(cols(s, 560, canvas, stack(s, 14, k1, k2, m)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { on = 1; s.sound("heartbeat", { vol: 0.5, dur: 3 }); await s.show(k1, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(k2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Puls messen",
        say: "Bei jedem Herzschlag spürst du eine Welle im Blutgefäß: den Puls. Fühle ihn am Handgelenk oder am Hals und zähle fünfzehn Sekunden. Dann mal vier.",
        build(s) {
          const sv = s.svg(520, 300);
          bg(s, sv, 520, 300);
          sv.append(s.el("path", { d: "M10 210 C120 170 260 170 520 150 L520 290 C260 300 120 300 10 290 Z", fill: SKIN, stroke: SKIND, "stroke-width": 3 }),
            s.el("path", { d: "M300 160 C330 120 380 110 420 140", stroke: SKIND, "stroke-width": 26, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: "M300 150 C340 100 400 96 440 130", stroke: SKIN, "stroke-width": 20, fill: "none", "stroke-linecap": "round" }),
            s.el("text", { x: 20, y: 40, class: "lbl", style: { fontWeight: 700 }, text: "Zwei Finger aufs Handgelenk – nicht den Daumen!" }));
          const wave = s.el("polyline", { fill: "none", stroke: RED, "stroke-width": 4 });
          const dot = s.el("circle", { cx: 300, cy: 205, r: 10, fill: RED, opacity: 0.2 });
          sv.append(wave, dot);
          let bpm = 85, hist = [], last = 0;
          const bpmT = s.h("span", { class: "huge mono", style: { color: "var(--unit)", fontSize: "60px" } }, "85");
          s.loop((t, dt) => {
            const ph = (t * bpm / 60) % 1;
            const y = 125 - (ph < 0.08 ? Math.sin(ph / 0.08 * Math.PI) * 50 : ph < 0.16 ? -Math.sin((ph - 0.08) / 0.08 * Math.PI) * 12 : 0);
            hist.push(y); if (hist.length > 220) hist.shift();
            wave.setAttribute("points", hist.map((v, i) => `${40 + i * 2},${v}`).join(" "));
            dot.setAttribute("opacity", ph < 0.12 ? 0.9 : 0.2); dot.setAttribute("r", ph < 0.12 ? 16 : 10);
            const n = Math.floor(t * bpm / 60); if (n !== last) { last = n; s.sfx.drum(); }
          });
          const ACT = [["schlafen", 70], ["sitzen", 85], ["gehen", 110], ["rennen", 160]];
          const sl = s.slider({ label: "Was machst du?", min: 0, max: 3, step: 1, value: 1, fmt: v => ACT[v][0], onInput: v => { bpm = ACT[v][1]; bpmT.textContent = bpm; } });
          const k1 = exb(s, "So zählst du", P(s, "Zähle die Schläge <b>15 Sekunden</b> lang und nimm die Zahl <b>mal 4</b>. Beispiel: 21 Schläge × 4 = 84 pro Minute.", "small"));
          const k2 = exb(s, "In Ruhe", P(s, "Kinder mit 10 bis 12 Jahren: etwa <b>60 bis 100</b> Schläge pro Minute. Beim Sport viel mehr.", "small"));
          const note = P(s, "Die Zahlen am Regler sind nur Beispiele.", "small pencil");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "24px", alignItems: "center", height: "100%" } },
            stack(s, 10, sv, sl, note), stack(s, 14, s.h("div", { class: "row", style: { gap: "12px", alignItems: "baseline" } }, bpmT, s.h("span", { class: "t" }, "Schläge pro Minute")), k1, k2)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(k1, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(k2, "up"); });
          s.step(async () => { s.sfx.whoosh(); sl.set(3); await s.wait(1500); s.say("Beim Rennen schlägt das Herz viel schneller. So bekommen die Muskeln mehr Sauerstoff."); });
        },
      },
      /* R1 – Rauchen und Sucht vorbeugen ---------------------------------- */
      {
        title: "Was steckt in einer Zigarette?",
        say: "Beim Rauchen verbrennt Tabak. Im Rauch stecken Nikotin, Teer und das giftige Gas Kohlenmonoxid.",
        build(s) {
          const sv = s.svg(520, 440);
          bg(s, sv, 520, 440);
          const smoke = s.el("g");
          const glow = s.el("circle", { cx: 432, cy: 330, r: 22, fill: "#ff9a3c", opacity: 0.35 });
          sv.append(smoke, glow,
            s.el("rect", { x: 60, y: 316, width: 92, height: 28, rx: 4, fill: "#e8a04a", stroke: "#a0632a", "stroke-width": 2 }),
            s.el("rect", { x: 150, y: 316, width: 272, height: 28, fill: "#fff", stroke: "#9ca3af", "stroke-width": 2 }),
            s.el("rect", { x: 418, y: 316, width: 20, height: 28, rx: 3, fill: "#5d6678" }),
            s.el("rect", { x: 432, y: 318, width: 10, height: 24, rx: 4, fill: "#e0322b" }),
            s.el("text", { x: 106, y: 392, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "Filter" }),
            s.el("text", { x: 290, y: 392, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "Tabak in Papier" }));
          const P0 = Array.from({ length: 26 }, (_, i) => ({ k: i / 26, dx: (i * 37) % 23 - 11 }));
          const puffs = P0.map(() => { const c = s.el("circle", { r: 10, fill: "#9aa3b2", opacity: 0 }); smoke.append(c); return c; });
          s.loop(t => {
            glow.setAttribute("opacity", 0.25 + 0.15 * Math.sin(t * 5));
            P0.forEach((p, i) => {
              const u = (t * 0.12 + p.k) % 1;
              puffs[i].setAttribute("cx", 438 + p.dx * u * 3 + Math.sin(u * 9 + i) * 14 * u);
              puffs[i].setAttribute("cy", 312 - u * 280);
              puffs[i].setAttribute("r", 6 + u * 20);
              puffs[i].setAttribute("opacity", 0.55 * (1 - u));
            });
          });
          const L = [["Nikotin: macht abhängig", 70, "#7b4fd6"], ["Teer: klebriger Dreck", 140, "#8a5a2b"], ["Kohlenmonoxid: giftiges Gas", 210, "#dc3b2a"]];
          const labs = L.map(([t, y, c]) => {
            const g = s.el("g", { class: "later" },
              s.el("text", { x: 30, y, class: "lbl", style: { fontWeight: 700, fill: c }, text: t }),
              s.el("line", { x1: 30, y1: y + 10, x2: 300, y2: y + 10, stroke: c, "stroke-width": 2.5 }),
              s.el("line", { x1: 300, y1: y + 10, x2: 405, y2: 150 + y * 0.3, stroke: c, "stroke-width": 2.5, "stroke-dasharray": "5 5" }));
            sv.append(g); return g;
          });
          const e1 = exb(s, "Tabakrauch", P(s, "Im Rauch stecken über <b>4.800</b> verschiedene Stoffe. Mindestens <b>250</b> davon sind giftig oder können Krebs auslösen.", "small"));
          const e2 = exb(s, "E-Zigarette", P(s, "Sie verbrennt nichts, sondern verdampft eine Flüssigkeit. Meist ist auch darin <b>Nikotin</b> – und das macht genauso abhängig.", "small"));
          const m = merk(s, "<b>Nikotin</b> macht schnell <b>abhängig</b>: Der Körper gewöhnt sich daran und will immer mehr davon.", true, 21);
          s.add(cols(s, 520, sv, stack(s, 14, P(s, "Eine Zigarette ist Tabak in Papier. Beim Rauchen <b>verbrennt</b> der Tabak, und man atmet den Rauch ein."), e1, e2, m)));
          s.show(sv, "fade"); s.sound("match-strike", { vol: 0.5 });
          s.step(async () => { for (const l of labs) { s.sfx.pop(); await s.show(l, "left"); } s.say("Nikotin, Teer und Kohlenmonoxid."); });
          s.step(async () => { s.sfx.error(); await s.show(e1, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(e2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* R2 ---------------------------------------------------------------- */
      {
        title: "Was Rauch in der Lunge macht",
        say: "In den Bronchien sitzen winzige Flimmerhärchen. Sie schieben Schleim mit Staub nach oben aus der Lunge. Rauch legt sie lahm.",
        build(s) {
          const W = 560, H = 440;
          const { canvas, g } = s.canvas(W, H);
          let smoke = 0, tSmoke = 0, mucusX = 0;
          const N = 26;
          const dust = Array.from({ length: 14 }, (_, i) => ({ x: (i * 41) % W, y: 40 + (i * 53) % 180, st: 0 }));
          const tar = [];
          s.loop((t, dt) => {
            dt = Math.min(dt || 0.016, 0.05);
            smoke = s.fast ? tSmoke : smoke + (tSmoke - smoke) * Math.min(1, dt * 2);
            g.fillStyle = "#fdf0f6"; g.fillRect(0, 0, W, H);
            // air
            g.fillStyle = smoke > 0.05 ? `rgba(154,163,178,${0.35 * smoke})` : "rgba(0,0,0,0)"; g.fillRect(0, 0, W, 250);
            // cells
            for (let i = 0; i < 8; i++) { g.fillStyle = "#f4a6b8"; g.strokeStyle = "#b0405e"; g.lineWidth = 2; g.beginPath(); g.roundRect(i * 70 + 2, 340, 66, 70, 10); g.fill(); g.stroke(); g.fillStyle = "#b0405e"; g.beginPath(); g.arc(i * 70 + 35, 378, 9, 0, TAU); g.fill(); }
            // cilia
            const amp = 0.55 * (1 - smoke) + 0.06;
            g.strokeStyle = "#b0405e"; g.lineWidth = 3; g.lineCap = "round";
            for (let i = 0; i < N; i++) {
              const x = 12 + i * 21, a = Math.sin(t * 9 - i * 0.6) * amp - smoke * 0.9;
              g.beginPath(); g.moveTo(x, 340); g.quadraticCurveTo(x + Math.sin(a) * 16, 322, x + Math.sin(a) * 34, 340 - Math.cos(a) * 36); g.stroke();
            }
            // mucus layer
            const thick = 26 + smoke * 26;
            mucusX = (mucusX + dt * 60 * (1 - smoke)) % 60;
            g.fillStyle = "rgba(232,197,71,0.55)"; g.fillRect(0, 300 - thick, W, thick);
            g.fillStyle = "rgba(200,160,40,0.6)";
            for (let x = -60 + mucusX; x < W; x += 60) { g.beginPath(); g.ellipse(x + 30, 300 - thick / 2, 14, thick / 3, 0, 0, TAU); g.fill(); }
            // dust: falls into the mucus and rides along
            dust.forEach(d => {
              if (d.st === 0) { d.y += dt * 40; if (d.y > 300 - thick / 2) d.st = 1; }
              else d.x += dt * 60 * (1 - smoke);
              if (d.x > W + 10) { d.x = -10; }
              if (d.st === 1 && smoke < 0.5 && Math.random() < 0.002) { d.st = 0; d.y = 30; }
              g.fillStyle = "#5d6678"; g.beginPath(); g.arc(d.x, d.y, 4, 0, TAU); g.fill();
            });
            // tar
            if (tSmoke && tar.length < 70 && Math.random() < 0.3) tar.push({ x: Math.random() * W, y: 0, ty: 290 + Math.random() * 46 });
            tar.forEach(p => { p.y = Math.min(p.ty, p.y + dt * 120); g.fillStyle = "#6b3e1f"; g.beginPath(); g.arc(p.x, p.y, 4.5, 0, TAU); g.fill(); });
            // labels
            g.font = "700 20px 'Atkinson Hyperlegible', sans-serif"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillStyle = "#1b2740";
            g.fillText("Luft in der Bronchie", 16, 30);
            g.fillText("Schleim", 16, 300 - thick - 8);
            g.fillText("Flimmerhärchen", 16, 432);
            g.textAlign = "right";
            g.fillStyle = smoke > 0.5 ? "#dc3b2a" : "#138a5a";
            g.fillText(smoke > 0.5 ? "Schleim bleibt liegen: Husten!" : "zum Rachen →", W - 14, 30);
          });
          const st = s.h("p", { class: "t", style: { fontWeight: 700, color: "var(--green)", minHeight: "36px" } }, "Ohne Rauch: Die Härchen arbeiten.");
          const setSmoke = on => { tSmoke = on ? 1 : 0; if (!on) tar.length = 0; st.textContent = on ? "Mit Rauch: Die Härchen werden lahm." : "Ohne Rauch: Die Härchen arbeiten."; st.style.color = on ? "var(--red)" : "var(--green)"; on ? s.sfx.error() : s.sfx.success(); };
          const b1 = s.h("button", { class: "btn", onclick: () => setSmoke(false) }, "Ohne Rauch");
          const b2 = s.h("button", { class: "btn solid", onclick: () => setSmoke(true) }, "Mit Rauch");
          const e1 = exb(s, "Gesund", P(s, "Die <b>Flimmerhärchen</b> schlagen ständig und schieben den Schleim mit Staub und Keimen aus der Lunge heraus.", "small"));
          const e2 = exb(s, "Mit Rauch", P(s, "<b>Teer</b> verklebt die Härchen. Der Schleim bleibt liegen – Raucher müssen oft husten.", "small"));
          const e3 = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Weißt du noch? Gasaustausch"),
            P(s, "<b>Kohlenmonoxid</b> verdrängt im Blut den <b>Sauerstoff</b>. Die Muskeln bekommen weniger davon – beim Sport geht schneller die Puste aus.", "small"));
          s.add(cols(s, 560, canvas, stack(s, 10, s.h("div", { class: "row", style: { gap: "12px" } }, b1, b2), st, e1, e2, e3), 20));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(e1, "up"); s.say("Die Härchen schieben den Schleim wie auf einem Förderband."); });
          s.step(async () => { setSmoke(true); await s.wait(600); await s.show(e2, "up"); s.say("Rauch macht die Härchen lahm."); });
          s.step(async () => { s.sound("atemzug", { vol: 0.5 }); await s.show(e3, "up"); });
        },
      },
      /* R3 ---------------------------------------------------------------- */
      {
        title: "Sucht – und wie du Nein sagst",
        say: "Sucht heißt: Man kann nicht mehr aufhören, obwohl man es möchte. Am besten fängst du gar nicht erst an. Nein sagen ist stark.",
        build(s) {
          const sv = s.svg(440, 440);
          bg(s, sv, 440, 440);
          const C = [220, 225], R = 132;
          const N = [["Nikotin", "rein"], ["kurz ein", "gutes Gefühl"], ["Körper will", "mehr davon"], ["ohne: unruhig", "und gereizt"]];
          const pos = N.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; return [C[0] + Math.cos(a) * R, C[1] + Math.sin(a) * R]; });
          const ring = s.el("circle", { cx: C[0], cy: C[1], r: R, fill: "none", stroke: UC, "stroke-width": 5, "stroke-dasharray": "14 10", class: "later" });
          sv.append(ring, s.el("text", { x: C[0], y: C[1] + 12, "text-anchor": "middle", class: "lbl", style: { fontWeight: 800, fontSize: "34px", fill: UC }, text: "Sucht" }));
          const dot = s.el("circle", { r: 11, fill: UC, opacity: 0 });
          sv.append(dot);
          const nodes = N.map(([a, b], i) => {
            const [x, y] = pos[i];
            const g = s.el("g", { class: "later" }, s.el("rect", { x: x - 76, y: y - 34, width: 152, height: 68, rx: 14, fill: "#fff", stroke: UC, "stroke-width": 3 }),
              s.el("text", { x, y: y - 6, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fontSize: "19px" }, text: a }),
              s.el("text", { x, y: y + 19, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700, fontSize: "19px" }, text: b }));
            sv.append(g); return g;
          });
          let run = false;
          s.loop(t => { if (!run) return; const a = -Math.PI / 2 + t * 0.9; dot.setAttribute("cx", C[0] + Math.cos(a) * R); dot.setAttribute("cy", C[1] + Math.sin(a) * R); dot.setAttribute("opacity", 1); ring.setAttribute("stroke-dashoffset", -t * 30); });
          const e1 = exb(s, "Was ist Sucht?", P(s, "Man kann nicht mehr aufhören, obwohl man will. Das geht auch ohne Stoffe: <b>Handy</b> und <b>Computerspiele</b> können so fesseln, dass man kaum loskommt. Die WHO zählt Computerspielsucht zu den Krankheiten.", "small"));
          const bub = (who, txt, right) => s.h("div", { class: "later", style: { alignSelf: right ? "flex-end" : "flex-start", maxWidth: "88%", background: right ? "#fce7f3" : "#eef2f7", border: "2px solid " + (right ? UC : "#c8d3de"), borderRadius: "16px", padding: "6px 14px", fontSize: "19px" }, html: `<b>${who}:</b> ${txt}` });
          const q = bub("Emre", "Komm, probier mal! Alle machen das.", false);
          const A = [bub("Mila", "Nein danke, ich hab keine Lust.", true), bub("Mila", "Ich will fit bleiben – ich spiele Fußball.", true), bub("Mila", "Echte Freunde akzeptieren ein Nein.", true)];
          const chat = s.h("div", { class: "card later stack", style: { gap: "6px", padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, "Nein sagen"), q, ...A);
          const m = merk(s, "<b>Jugendschutzgesetz:</b> Zigaretten und E-Zigaretten – auch ohne Nikotin – dürfen nicht an Kinder und Jugendliche unter <b>18</b> verkauft werden.", true, 20);
          s.add(cols(s, 440, sv, stack(s, 10, e1, chat, m), 20));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { for (const n of nodes) { s.sfx.pop(); await s.show(n, "pop"); } await s.show(ring, "fade"); run = true; s.sfx.whoosh(); s.say("Ein Kreislauf: Ohne Nikotin wird man unruhig, also raucht man wieder."); });
          s.step(async () => { s.sfx.pop(); await s.show(e1, "up"); });
          s.step(async () => { s.show(chat, "up"); await s.wait(250); s.sound("gespraech", { vol: 0.3, dur: 2 }); await s.show(q, "left"); });
          s.step(async () => { for (const a of A) { s.sfx.ding(); await s.show(a, "right"); await s.wait(250); } s.say("Du darfst immer Nein sagen. Wer dich drängt, ist kein guter Freund."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.show(m, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Schlaf und Bewegung",
        say: "Kinder in deinem Alter brauchen neun bis zwölf Stunden Schlaf und jeden Tag mindestens eine Stunde Bewegung. Probiere aus, wann du ins Bett gehen solltest.",
        build(s) {
          const sv = s.svg(440, 440);
          const cx = 220, cy = 220, R = 170;
          sv.append(s.el("circle", { cx, cy, r: R, fill: "#fff", stroke: "#c8d3de", "stroke-width": 4 }));
          for (let h = 0; h < 24; h++) { const a = h / 24 * TAU - Math.PI / 2; sv.append(s.el("line", { x1: cx + Math.cos(a) * (R - 12), y1: cy + Math.sin(a) * (R - 12), x2: cx + Math.cos(a) * R, y2: cy + Math.sin(a) * R, stroke: "#8a93a6", "stroke-width": 2 })); if (h % 6 === 0) sv.append(s.el("text", { x: cx + Math.cos(a) * (R + 22), y: cy + Math.sin(a) * (R + 22) + 7, "text-anchor": "middle", class: "lbl", style: { fontSize: "19px" }, text: h + " Uhr" })); }
          const sleepArc = s.el("path", { fill: "#3b3f8f", opacity: 0.85 });
          const wakeT = s.el("text", { x: cx, y: cy - 10, "text-anchor": "middle", "font-size": 40, "font-weight": 800, fill: "#1b2740", text: "" });
          const sub = s.el("text", { x: cx, y: cy + 28, "text-anchor": "middle", class: "lbl", style: { fontWeight: 700 }, text: "" });
          sv.append(sleepArc, s.el("circle", { cx, cy, r: 90, fill: "#fff" }), wakeT, sub);
          const WAKE = 6.75; // 6:45 Uhr
          const pt = (h, r) => { const a = h / 24 * TAU - Math.PI / 2; return `${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`; };
          const hm = h => { h = (h + 24) % 24; const H = Math.floor(h), M = Math.round((h - H) * 60); return H + ":" + String(M).padStart(2, "0"); };
          const upd = bed => {
            const dur = (WAKE + 24 - bed) % 24;
            const large = dur > 12 ? 1 : 0;
            sleepArc.setAttribute("d", `M${pt(bed, 92)} L${pt(bed, R - 14)} A${R - 14} ${R - 14} 0 ${large} 1 ${pt(WAKE, R - 14)} L${pt(WAKE, 92)} A92 92 0 ${large} 0 ${pt(bed, 92)} Z`);
            wakeT.textContent = s.fmt(dur, dur % 1 ? 2 : 0).replace(",25", "¼").replace(",50", "½").replace(",75", "¾") + " h";
            const ok = dur >= 9;
            sub.textContent = ok ? "genug Schlaf ✓" : "zu wenig Schlaf"; sub.style.fill = ok ? "#138a5a" : "#dc3b2a";
          };
          const sl = s.slider({ label: "Ins Bett um", min: 19.5, max: 23.5, step: 0.25, value: 22, fmt: v => hm(v) + " Uhr", onInput: upd });
          upd(22);
          const k1 = exb(s, "Schlaf", P(s, "Kinder von 6 bis 12 Jahren brauchen etwa <b>9 bis 12 Stunden</b>. Im Schlaf wächst du und dein Gehirn sortiert, was du gelernt hast. Wecker hier: 6:45 Uhr.", "small"));
          const k2 = exb(s, "Bewegung", P(s, "Die WHO empfiehlt Kindern <b>mindestens 60 Minuten</b> Bewegung am Tag – Radfahren zur Schule, Fußball, Toben zählen mit.", "small"));
          const k3 = exb(s, "Bildschirm", P(s, "Für 9- bis 11-Jährige empfehlen Fachleute etwa <b>45 bis 60 Minuten</b> Bildschirm-Freizeit am Tag. Eine Stunde vor dem Schlafen am besten aus.", "small"));
          s.add(cols(s, 440, stack(s, 6, sv, sl), stack(s, 12, k1, k2, k3)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(k1, "up"); await s.tween({ from: 22, to: 20.5, dur: 1600, ease: "inOut", update: v => { const q = Math.round(v * 4) / 4; sl.input.value = q; upd(q); } }); sl.set(20.5); s.sfx.ding(); });
          s.step(async () => { s.sound("bike-bell", { vol: 0.5 }); await s.show(k2, "up"); });
          s.step(async () => { s.sfx.click(); await s.show(k3, "up"); });
        },
      },
    ],
  });
})();
