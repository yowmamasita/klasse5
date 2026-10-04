/* Kapitel 8 – Zusammen leben: Klasse und Demokratie */
(() => {
  const INK = "#1b2740", TEAL = "#0e7490", SKIN = ["#f1c7a0", "#d9a066", "#a8714a", "#7a4a2a", "#ffd9b8"];
  const SHIRT = ["#0e7490", "#dc3b2a", "#ee7a1a", "#7b4fd6", "#138a5a", "#1d5bd0", "#e0a526"];
  const T = (s, x, y, txt, o = {}) => s.el("text", { x, y, "font-size": o.fs || 20, "text-anchor": o.a || "middle", fill: o.fill || INK, "font-weight": o.fw || 700, text: txt });
  const later = el => { el.classList.add("later"); return el; };
  /* a simple child figure centred at (x,y) */
  const kid = (s, x, y, i = 0, k = 1, shirt) => s.el("g", { transform: `translate(${x} ${y}) scale(${k})` },
    s.el("path", { d: "M-15 30 L-15 6 C-15 -4 15 -4 15 6 L15 30 Z", fill: shirt || SHIRT[i % SHIRT.length] }),
    s.el("circle", { cx: 0, cy: -12, r: 12, fill: SKIN[i % SKIN.length] }),
    s.el("path", { d: "M-12 -16 C-10 -28 10 -28 12 -16 C6 -22 -6 -22 -12 -16 Z", fill: ["#3b2a1a", "#1b1b1b", "#c9862a", "#6b3a1a"][i % 4] }));
  const lifeBox = (s, label, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, label), ...kids);

  Deck.unit({
    id: "u8", num: 8, title: "Zusammen leben: Klasse und Demokratie", color: "#0e7490", soft: "#dff3f7",
    subtitle: "Mitreden, mitentscheiden, mitmachen",
    blurb: "Klassenrat, Wahlen, Kinderrechte und wie Demokratie begann.",
    goals: ["Ich weiß, wie ein Klassenrat und eine Klassensprecher-Wahl ablaufen.", "Ich kann erklären: Mehrheit, Minderheit und Kompromiss.", "Ich kenne wichtige Kinderrechte und weiß, wie man Streit schlichtet.", "Ich kann Athen damals mit Berlin heute vergleichen."],
    icon(svg, el) {
      svg.append(el("rect", { x: 14, y: 28, width: 42, height: 32, rx: 4, fill: "#0e7490", opacity: .2 }), el("rect", { x: 14, y: 28, width: 42, height: 32, rx: 4, fill: "none", stroke: "#0e7490", "stroke-width": 3 }), el("path", { d: "M26 28 L26 24 L44 24 L44 28", stroke: "#0e7490", "stroke-width": 3, fill: "none" }), el("path", { d: "M30 12 L40 12 L42 34 L28 34 Z", fill: "#fff", stroke: "#0e7490", "stroke-width": 3 }), el("path", { d: "M31 20 L34 24 L39 16", stroke: "#dc3b2a", "stroke-width": 3, fill: "none" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Die Klasse: eine Gemeinschaft",
        say: "Deine Klasse ist eine Gemeinschaft. Ihr lernt, spielt und entscheidet zusammen.",
        build(s) {
          const svg = s.svg(480, 480);
          svg.append(s.el("circle", { cx: 240, cy: 240, r: 226, fill: "#dff3f7" }), s.el("ellipse", { cx: 240, cy: 240, rx: 110, ry: 70, fill: "#c99a55", stroke: "#8a6a44", "stroke-width": 4 }), T(s, 240, 250, "Klasse 5a", { fs: 26, fill: "#fff" }));
          const N = 22, pos = [];
          for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / N; pos.push([240 + 180 * Math.cos(a), 240 + 160 * Math.sin(a)]); }
          const net = s.el("g", { class: "later" });
          for (let i = 0; i < N; i++) for (const d of [3, 7]) { const j = (i + d) % N; net.append(s.el("path", { d: `M${pos[i][0]} ${pos[i][1]} L${pos[j][0]} ${pos[j][1]}`, stroke: TEAL, "stroke-width": 1.5, opacity: .35 })); }
          svg.append(net);
          const kids = pos.map(([x, y], i) => later(kid(s, x, y, i, 1)));
          svg.append(...kids);
          const ex = [["Fußballteam", "Jeder hat eine Position – gewinnen geht nur zusammen."], ["Orchester", "In der Instrumentalklasse spielt jeder seinen Teil."], ["Familie", "Man hilft sich und findet gemeinsame Lösungen."]]
            .map(([a, b]) => later(s.h("div", { class: "ex", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, a), s.h("p", { class: "small" }, b))));
          const merk = later(s.h("div", { class: "merk" }, "Gemeinschaft heißt: ", s.h("b", null, "Jeder gehört dazu."), " Alle haben Rechte – und Pflichten."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "480px 1fr", gap: "30px", height: "100%", alignItems: "center" } }, svg,
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "big a-up" }, "Wir sind eine Klasse"), s.h("p", { class: "t a-up", style: { "--d": "150ms" } }, "Viele verschiedene Kinder – ein Team. Damit das klappt, braucht es Regeln und Mitbestimmung."), s.h("div", { class: "cols3", style: { gap: "12px" } }, ...ex), merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < N; i++) { s.sfx.count(i % 14); s.show(kids[i], "pop"); await s.wait(60); } s.sfx.ding(); s.say("Jedes Kind ist anders – zusammen seid ihr die Klasse."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(net, "fade"); for (let i = 0; i < 3; i++) { s.sfx.pop(); await s.show(ex[i], "up"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Klassenregeln",
        say: "Regeln helfen, dass sich alle in der Klasse wohlfühlen. Am besten macht ihr sie gemeinsam.",
        build(s) {
          const rules = ["Wir lassen andere ausreden.", "Wir hören zu, wenn jemand spricht.", "Wir lachen niemanden aus.", "Wir helfen uns gegenseitig.", "Wir gehen sorgsam mit Sachen um."];
          const items = rules.map(r => {
            const chk = s.svg(34, 34); const p = s.el("path", { d: "M6 18 L14 26 L28 8", stroke: "#138a5a", "stroke-width": 5, fill: "none", "stroke-linecap": "round", class: "later" }); chk.append(p);
            const el = later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px" } }, chk, s.h("p", { class: "hand", style: { margin: 0, fontSize: "34px" } }, r)));
            el.check = p; return el;
          });
          const sig = s.svg(520, 70);
          const sigs = [[20, "M0 40 q10 -30 20 0 t20 0 q8 -20 16 0"], [150, "M0 40 c10 -40 20 30 30 -10 s20 10 30 -10"], [290, "M0 30 q20 20 30 -10 q10 30 40 0"], [420, "M0 40 l10 -24 l10 24 q10 -20 30 -6"]]
            .map(([x, d]) => later(s.el("path", { d, transform: `translate(${x} 10)`, stroke: "#1d5bd0", "stroke-width": 3, fill: "none" })));
          sig.append(s.el("path", { d: "M0 62 L520 62", stroke: "#c8d3de", "stroke-width": 2 }), ...sigs);
          const poster = s.h("div", { class: "card", style: { padding: "20px 26px", display: "flex", flexDirection: "column", gap: "8px", background: "#fffdf3", borderColor: "#e8d9a8" } },
            s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Unsere Klassenregeln"), ...items, sig, s.h("p", { class: "small pencil" }, "Unterschrieben von allen"));
          const ex = [["Fußball", "Ohne Regeln kein Spiel – der Schiri passt auf."], ["Straßenverkehr", "Rot heißt Stopp – das schützt alle."], ["Spielplatz", "Abwechseln an der Schaukel."]]
            .map(([a, b]) => later(s.h("div", { class: "ex", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, a), s.h("p", { class: "small" }, b))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Regeln, die ", s.h("b", null, "alle gemeinsam"), " beschließen, werden besser eingehalten."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "590px 1fr", gap: "28px", height: "100%", alignItems: "center" } }, poster,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("p", { class: "h2" }, "Wozu Regeln?"), ...ex, merk)));
          s.show(poster, "zoom"); s.sfx.pop();
          s.step(async () => { for (const it of items) { s.sfx.scribble(); await s.show(it, "left"); s.sfx.tick(); s.show(it.check, "draw"); await s.wait(250); } });
          s.step(async () => { for (const p of sigs) { s.sfx.scribble(); await s.show(p, "draw"); } s.sfx.ding(); s.say("Alle unterschreiben. Jetzt gelten die Regeln für alle."); });
          s.step(async () => { for (const e of ex) { s.sfx.pop(); await s.show(e, "left"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Der Klassenrat – wer macht was?",
        say: "Im Klassenrat besprecht ihr eure Anliegen selbst. Jedes Kind kann eine Aufgabe übernehmen.",
        build(s) {
          const svg = s.svg(520, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 470, rx: 22, fill: "#dff3f7" }), s.el("ellipse", { cx: 260, cy: 250, rx: 170, ry: 100, fill: "#c99a55", stroke: "#8a6a44", "stroke-width": 4 }));
          const seats = [];
          for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; seats.push([260 + 220 * Math.cos(a), 250 + 160 * Math.sin(a)]); }
          svg.append(...seats.map(([x, y], i) => kid(s, x, y, i, .95)));
          const roleSeats = [0, 3, 6, 9];
          const badges = ["V", "P", "Z", "R"].map((b, i) => { const [x, y] = seats[roleSeats[i]]; return later(s.el("g", null, s.el("circle", { cx: x + 20, cy: y - 22, r: 15, fill: "#ffd94a", stroke: INK, "stroke-width": 2 }), T(s, x + 20, y - 15, b, { fs: 19 }))); });
          svg.append(...badges);
          const paper = later(s.el("g", null, s.el("rect", { x: 300, y: 222, width: 60, height: 50, rx: 4, fill: "#fff", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M308 236 L352 236 M308 248 L352 248 M308 260 L340 260", stroke: "#5d6678", "stroke-width": 2 })));
          const clock = later(s.el("g", null, s.el("circle", { cx: 200, cy: 248, r: 22, fill: "#fff", stroke: INK, "stroke-width": 3 })));
          const hand = s.el("path", { d: "M200 248 L200 232", stroke: "#dc3b2a", "stroke-width": 3, "stroke-linecap": "round" });
          clock.append(hand);
          svg.append(paper, clock);
          const roles = [["V", "Vorsitz", "leitet die Sitzung und ruft auf."], ["P", "Protokoll", "schreibt die Beschlüsse auf."], ["Z", "Zeitwächter*in", "achtet auf die Zeit."], ["R", "Regelwächter*in", "achtet auf die Gesprächsregeln."]]
            .map(([b, n, t]) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px" } }, s.h("span", { class: "chip", style: { background: "#ffd94a", fontSize: "22px", minWidth: "44px", justifyContent: "center" } }, b), s.h("p", { class: "t" }, s.h("b", null, n), " ", t))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Der ", s.h("b", null, "Klassenrat"), " trifft sich regelmäßig, oft jede Woche. Die Aufgaben wechseln – jeder ist mal dran."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "520px 1fr", gap: "28px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, ...roles, merk)));
          s.show(svg, "fade"); s.sfx.pop();
          s.loop(t => hand.setAttribute("transform", `rotate(${t * 60} 200 248)`));
          roles.forEach((r, i) => s.step(async () => { s.sfx.count(i * 2); s.show(badges[i], "bounce"); if (i === 1) s.show(paper, "pop"); if (i === 2) s.show(clock, "pop"); await s.show(r, "left"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "So läuft ein Klassenrat",
        say: "Ein Klassenrat hat eine feste Tagesordnung. Wir spielen eine Sitzung durch.",
        build(s) {
          const agenda = ["Begrüßung: Was war gut?", "Protokoll vom letzten Mal", "Anliegen vortragen", "Lösungen sammeln", "Abstimmen", "Beschluss aufschreiben"];
          const rows = agenda.map((a, i) => s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "10px", padding: "8px 10px", borderRadius: "12px", transition: "background .3s" } }, s.h("span", { class: "chip", style: { minWidth: "38px", justifyContent: "center", fontSize: "19px" } }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "21px" } }, a)));
          const board = s.h("div", { class: "card", style: { padding: "16px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("p", { class: "h2", style: { color: "var(--unit)", marginBottom: "6px" } }, "Tagesordnung"), ...rows);
          const mark = i => rows.forEach((r, j) => { r.style.background = j === i ? "#ffe98a" : j < i ? "#e6f6ee" : "transparent"; });
          const svg = s.svg(640, 600);
          svg.append(s.el("rect", { x: 0, y: 0, width: 640, height: 600, rx: 22, fill: "#dff3f7" }), s.el("ellipse", { cx: 320, cy: 430, rx: 230, ry: 100, fill: "#c99a55", stroke: "#8a6a44", "stroke-width": 4 }));
          const ring = [];
          for (let i = 0; i < 10; i++) { const a = Math.PI + .2 + i * (Math.PI - .4) / 9; ring.push([320 + 280 * Math.cos(a), 450 + 120 * Math.sin(a) * -1]); }
          const kids = ring.map(([x, y], i) => kid(s, x, Math.min(y, 548), i, 1.3));
          const hands = ring.map(([x, y], i) => later(s.el("path", { d: `M${x + 18} ${Math.min(y, 548) + 5} L${x + 31} ${Math.min(y, 548) - 34}`, stroke: SKIN[i % SKIN.length], "stroke-width": 9, "stroke-linecap": "round" })));
          svg.append(...hands, ...kids);
          const bubble = s.el("g", { class: "later" }, s.el("rect", { x: 30, y: 20, width: 580, height: 74, rx: 18, fill: "#fff", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M300 94 L320 116 L330 94 Z", fill: "#fff", stroke: INK, "stroke-width": 2 }));
          const btxt = T(s, 320, 66, "", { fs: 22, fw: 600 });
          bubble.append(btxt);
          svg.append(bubble);
          const notes = [["Ball-Plan", 100], ["Zwei Bälle", 320], ["Abwechseln", 540]].map(([n, x], i) => later(s.el("g", null, s.el("rect", { x: x - 85, y: 140, width: 170, height: 70, rx: 6, fill: ["#ffe98a", "#ffd0c7", "#c7f0dc"][i], stroke: "#c8b06a", "stroke-width": 1.5 }), T(s, x, 183, n, { fs: 22 }))));
          const votes = [4, 7, 15];
          const vt = notes.map((_, i) => later(T(s, [100, 320, 540][i], 246, "0 Stimmen", { fs: 20, fill: TEAL })));
          const proto = later(s.el("g", null, s.el("rect", { x: 280, y: 390, width: 80, height: 70, rx: 4, fill: "#fff", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M290 408 L350 408 M290 422 L350 422 M290 436 L336 436", stroke: "#5d6678", "stroke-width": 2 })));
          const stamp = later(s.el("g", { transform: "rotate(-4 320 290)" }, s.el("rect", { x: 150, y: 262, width: 340, height: 56, rx: 10, fill: "#fff", stroke: "#dc3b2a", "stroke-width": 5 }), T(s, 320, 299, "Beschluss: Abwechseln!", { fs: 24, fill: "#dc3b2a" })));
          svg.append(...notes, ...vt, proto, stamp);
          const say = t => { btxt.textContent = t; };
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 640px", gap: "24px", height: "100%", alignItems: "center" } }, board, svg));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { mark(0); say("Was war diese Woche gut?"); s.sfx.pop(); await s.show(bubble, "pop"); s.show(hands.slice(0, 5), "up"); s.say("Wir starten mit einer Runde: Was war gut?"); });
          s.step(async () => { mark(1); s.hide(hands); say("Letztes Mal haben wir beschlossen: …"); s.sfx.scribble(); await s.show(proto, "pop"); });
          s.step(async () => { mark(2); s.sfx.pop(); say("Der Ball ist immer bei denselben Kindern!"); s.show(bubble, "pop"); s.say("Ein Anliegen aus der Anliegen-Box."); });
          s.step(async () => { mark(3); say("Welche Ideen habt ihr?"); for (const n of notes) { s.sfx.pop(); await s.show(n, "bounce"); } });
          s.step(async () => {
            mark(4); say("Wer ist für welche Lösung? Hand hoch!"); s.sfx.drum();
            for (let o = 0; o < 3; o++) {
              s.hide(hands); await s.wait(150);
              s.show(hands.slice(0, Math.min(10, Math.round(votes[o] / 1.6))), "up"); s.show(vt[o], "fade");
              await s.tween({ dur: 600, update: v => { vt[o].textContent = Math.round(v * votes[o]) + " Stimmen"; } }); s.sfx.count(o * 3); await s.wait(250);
            }
            s.hide(hands);
          });
          s.step(async () => { mark(5); say("„Abwechseln“ hat die meisten Stimmen."); s.sfx.drum(); await s.show(stamp, "zoom"); s.sfx.success(); s.show(proto, "pop"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Klassensprecher*innen-Wahl",
        say: "Die Klasse wählt ihre Klassensprecherinnen und Klassensprecher – geheim und fair.",
        build(s) {
          const cands = [["Mia", 0, "#dc3b2a"], ["Emil", 2, "#1d5bd0"], ["Leyla", 3, "#138a5a"]];
          const cc = cands.map(([n, i, c]) => { const v = s.svg(110, 90); v.append(kid(s, 55, 50, i, 1.5, c)); return s.h("div", { class: "card", style: { padding: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" } }, v, s.h("p", { class: "h2", style: { fontSize: "24px" } }, n)); });
          const box = s.svg(460, 250);
          box.append(s.el("rect", { x: 130, y: 90, width: 200, height: 150, rx: 10, fill: TEAL }), s.el("rect", { x: 190, y: 82, width: 80, height: 14, rx: 4, fill: INK }), T(s, 230, 180, "Wahlurne", { fs: 22, fill: "#fff" }));
          const ballots = [];
          for (let i = 0; i < 6; i++) { const b = s.el("g", { class: "later" }, s.el("rect", { x: -18, y: -12, width: 36, height: 24, rx: 3, fill: "#fff", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M-8 0 L-2 6 L8 -6", stroke: "#dc3b2a", "stroke-width": 3, fill: "none" })); ballots.push(b); box.append(b); b.setAttribute("transform", `translate(${40 + i * 76} 30)`); }
          const screen = later(s.el("g", null, s.el("path", { d: "M10 240 L10 120 L80 100 L80 240 Z", fill: "#c8d3de", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M450 240 L450 120 L380 100 L380 240 Z", fill: "#c8d3de", stroke: INK, "stroke-width": 2 })));
          box.append(screen);
          const bars = s.svg(560, 330);
          const BX = 110, maxW = 400;
          const counts = [0, 0, 0];
          const rects = cands.map(([n, , c], i) => { const r = s.el("rect", { x: BX, y: 30 + i * 100, width: 0, height: 56, rx: 8, fill: c }); bars.append(T(s, 10, 68 + i * 100, n, { a: "start", fs: 24 }), r); return r; });
          const nums = cands.map((_, i) => { const t = T(s, BX + 12, 68 + i * 100, "0", { a: "start", fs: 24 }); bars.append(t); return t; });
          const setBar = i => { const w = counts[i] / 14 * maxW; rects[i].setAttribute("width", w); nums[i].setAttribute("x", BX + w + 12); nums[i].textContent = counts[i]; };
          const crown = later(s.el("path", { d: "M0 0 L8 -18 L18 -4 L28 -22 L38 -4 L48 -18 L56 0 Z", fill: "#ffd94a", stroke: INK, "stroke-width": 2 }));
          bars.append(crown);
          const result = s.h("p", { class: "t", style: { minHeight: "34px" } }, " ");
          let order = [];
          const makeVotes = (a, b, c) => { order = [...Array(a).fill(0), ...Array(b).fill(1), ...Array(c).fill(2)]; for (let i = order.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; } };
          const count = async () => {
            counts.fill(0); [0, 1, 2].forEach(setBar); s.hide(crown); result.textContent = " ";
            for (let k = 0; k < order.length; k++) { if (!s.alive) return; counts[order[k]]++; setBar(order[k]); s.sfx.count(counts[order[k]] % 14); await s.wait(110); }
            const win = counts.indexOf(Math.max(...counts));
            crown.setAttribute("transform", `translate(${BX + counts[win] / 14 * maxW + 50} ${36 + win * 100 + 30})`);
            s.show(crown, "bounce"); s.sfx.fanfare();
            result.textContent = `${cands[win][0]} hat die meisten Stimmen: ${counts[win]} von ${order.length}.`;
          };
          const again = later(s.h("button", { class: "btn", style: { alignSelf: "flex-start" }, onclick: async () => { s.sfx.click(); const a = 5 + Math.floor(Math.random() * 10), b = 3 + Math.floor(Math.random() * (24 - a - 3)); makeVotes(a, b, 27 - a - b); await count(); } }, "Neue Wahl auszählen"));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, s.h("b", null, "Geheime Wahl:"), " Niemand sieht, was du ankreuzt. So kannst du frei entscheiden."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "460px 1fr", gap: "26px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "cols3", style: { gap: "12px" } }, ...cc), box),
            s.h("div", { class: "stack", style: { gap: "10px" } }, bars, result, again, merk)));
          makeVotes(12, 9, 6);
          cc.forEach((c, i) => s.show(c, "pop", i * 120)); s.sfx.pop();
          s.step(async () => {
            s.show(screen, "fade"); s.say("Jedes Kind kreuzt hinter der Wand an. Dann kommt der Zettel in die Urne.");
            for (let i = 0; i < ballots.length; i++) { const b = ballots[i], x0 = 40 + i * 76; s.show(b, "pop"); s.sfx.swoosh(); await s.tween({ dur: 420, ease: "in", update: v => b.setAttribute("transform", `translate(${s.lerp(x0, 230, v)} ${s.lerp(30, 92, v)}) scale(${1 - .5 * v})`) }); s.hide(b); s.sfx.tick(); }
          });
          s.step(async () => { s.sfx.drum(); await count(); s.show(again, "pop"); s.say("Die meisten Stimmen gewinnen: Das ist die Mehrheit."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Mitbestimmen in der Schule",
        say: "Die Klassensprecher vertreten euch in der Schülervertretung. Und die schickt Leute in die Schulkonferenz.",
        build(s) {
          const levels = [
            ["Deine Klasse", "Alle Kinder wählen ihre Klassensprecher*innen.", 6],
            ["Schülervertretung (SV)", "Alle Klassensprecher*innen der Schule treffen sich und sprechen für die Schüler*innen.", 4],
            ["Schulkonferenz", "Lehrkräfte, Eltern und Schüler*innen entscheiden zusammen über wichtige Dinge der Schule.", 2],
          ];
          const W = [1000, 820, 640];
          const blocks = levels.map(([n, t, k], i) => {
            const fig = s.svg(150, 60); for (let j = 0; j < 3; j++) fig.append(kid(s, 30 + j * 45, 36, i * 3 + j, .9, i === 2 && j === 1 ? "#5d6678" : null));
            return later(s.h("div", { class: "card", style: { width: W[i] + "px", alignSelf: "center", display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px", alignItems: "center", padding: "12px 18px", background: ["#dff3f7", "#c4e7ef", "#a7dbe6"][i], borderColor: "transparent" } }, fig,
              s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "26px" } }, n), s.h("p", { class: "small" }, t))));
          });
          const arrows = [0, 1].map(() => { const a = s.svg(60, 34); a.append(s.el("path", { d: "M30 2 L30 22 M18 14 L30 30 L42 14", stroke: TEAL, "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" })); return later(s.h("div", { style: { alignSelf: "center", height: "34px" } }, a)); });
          const life = later(lifeBox(s, "Im Alltag", s.h("p", { class: "small" }, "Ideen der Klasse wandern so nach oben: Wünsche für den Schulhof, ein Schulfest oder neue Regeln für die Pause.")));
          s.add(s.h("div", { class: "stack", style: { gap: "6px", height: "100%", justifyContent: "center" } }, blocks[0], arrows[0], blocks[1], arrows[1], blocks[2], s.h("div", { style: { height: "10px" } }), life));
          s.sfx.whoosh();
          s.step(async () => { s.sfx.count(0); await s.show(blocks[0], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(arrows[0], "down"); s.sfx.count(4); await s.show(blocks[1], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(arrows[1], "down"); s.sfx.count(7); await s.show(blocks[2], "up"); s.say("In der Schulkonferenz sitzen Lehrkräfte, Eltern und Schüler zusammen."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Was ist eine Mehrheit?",
        say: "Schiebe den Regler. Wann haben die Ja-Stimmen die Mehrheit?",
        build(s) {
          const N = 28;
          const svg = s.svg(500, 300);
          const dots = [];
          for (let i = 0; i < N; i++) { const c = s.el("circle", { cx: 40 + (i % 7) * 70, cy: 40 + Math.floor(i / 7) * 72, r: 26, fill: "#c8d3de" }); dots.push(c); svg.append(c); }
          const score = s.h("p", { class: "huge mono", style: { textAlign: "center" } }, "14 : 14");
          const verdict = s.h("p", { class: "h2", style: { textAlign: "center", minHeight: "36px" } }, "Unentschieden");
          let last = 14;
          const upd = v => {
            dots.forEach((d, i) => d.setAttribute("fill", i < v ? "#138a5a" : "#dc3b2a"));
            score.textContent = `${v} : ${N - v}`;
            verdict.textContent = v > N - v ? "Ja hat die Mehrheit!" : v < N - v ? "Nein hat die Mehrheit!" : "Unentschieden";
            verdict.style.color = v > N - v ? "var(--green)" : v < N - v ? "var(--red)" : "var(--ink)";
            if ((v > 14) !== (last > 14) || (v < 14) !== (last < 14)) s.sfx.ding();
            last = v;
          };
          const sl = s.slider({ label: "Ja-Stimmen (grün)", min: 0, max: N, value: 14, onInput: upd });
          upd(14);
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, s.h("b", null, "Mehrheit"), " = mehr als die Hälfte. Bei 28 Kindern: ", s.h("b", null, "mindestens 15"), "."));
          const ex = ["Klassenfahrt: Wohin geht’s?", "Familie: Welcher Ausflug am Sonntag?", "Fußballteam: Wer wird Kapitän?"].map(t => later(s.h("span", { class: "chip", style: { fontSize: "19px" } }, t)));
          const life = later(lifeBox(s, "Im Alltag", s.h("div", { class: "row", style: { gap: "8px" } }, ...ex)));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "30px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("p", { class: "t" }, "Eine Klasse mit 28 Kindern stimmt ab: Ja oder Nein?"), svg, sl),
            s.h("div", { class: "stack", style: { gap: "14px" } }, score, verdict, merk, life)));
          s.sfx.pop();
          s.step(async () => { for (let v = 14; v <= 15; v++) { await s.tween({ dur: 400, update: x => { const n = Math.round(s.lerp(v - 1, v, x)); sl.set(n); } }); } s.sfx.success(); await s.show(merk, "up"); s.say("Fünfzehn ist mehr als die Hälfte. Ja gewinnt."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); for (const e of ex) { s.sfx.tick(); await s.show(e, "pop"); } });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Mehrheit und Minderheit",
        say: "Die Klasse stimmt über das Ziel der Klassenfahrt ab. Die Mehrheit entscheidet – aber die Minderheit zählt auch.",
        build(s) {
          const svg = s.svg(560, 430);
          svg.append(s.el("rect", { x: 0, y: 0, width: 270, height: 430, rx: 20, fill: "#d8eefa" }), s.el("rect", { x: 290, y: 0, width: 270, height: 430, rx: 20, fill: "#e3f2d9" }));
          svg.append(T(s, 135, 40, "Ostsee", { fs: 26, fill: "#1d5bd0" }), T(s, 425, 40, "Harz", { fs: 26, fill: "#138a5a" }));
          svg.append(s.el("path", { d: "M20 132 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0", stroke: "#3a8fd0", "stroke-width": 4, fill: "none" }), s.el("path", { d: "M310 140 L350 108 L380 126 L420 100 L470 132 L540 140", stroke: "#138a5a", "stroke-width": 4, fill: "none", "stroke-linejoin": "round" }));
          const n = 28, A = 17;
          const kids = [];
          for (let i = 0; i < n; i++) { const g = s.el("g"); g.append(kid(s, 0, 0, i, .85)); kids.push(g); svg.append(g); }
          const home = i => [70 + (i % 14) * 30, 220 + Math.floor(i / 14) * 70 + (i % 2) * 8];
          const target = i => i < A ? [40 + (i % 5) * 48, 180 + Math.floor(i / 5) * 62] : [330 + ((i - A) % 4) * 56, 180 + Math.floor((i - A) / 4) * 62];
          const place = (i, [x, y]) => kids[i].setAttribute("transform", `translate(${x} ${y})`);
          kids.forEach((_, i) => place(i, home(i)));
          const cA = later(T(s, 135, 80, "17 Stimmen", { fs: 22 })), cB = later(T(s, 425, 80, "11 Stimmen", { fs: 22 }));
          svg.append(cA, cB);
          const pts = [
            ["Mehrheit", "17 von 28 wollen an die Ostsee. Die Klasse fährt an die Ostsee."],
            ["Minderheit", "11 Kinder wollten in den Harz. Ihre Meinung zählt trotzdem: Man hört sie an und lacht sie nicht aus."],
            ["Fair bleiben", "Vielleicht gibt es an der Ostsee auch eine Kletter-Tour – das wünscht sich die Harz-Gruppe."],
          ].map(([a, b]) => later(s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("p", { class: "t" }, s.h("b", { style: { color: "var(--unit)" } }, a + ": "), b))));
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Die Mehrheit entscheidet. Die Minderheit behält ihre ", s.h("b", null, "Rechte"), " und wird ", s.h("b", null, "respektiert"), "."));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...pts, merk)));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh();
            await s.tween({ dur: 1300, ease: "inOut", update: v => kids.forEach((_, i) => { const a = home(i), b = target(i); const w = Math.max(0, Math.min(1, v * 1.6 - i * .02)); place(i, [s.lerp(a[0], b[0], w), s.lerp(a[1], b[1], w)]); }) });
            kids.forEach((_, i) => place(i, target(i)));
            s.sfx.ding(); s.show([cA, cB], "pop"); await s.show(pts[0], "left");
          });
          s.step(async () => { s.sfx.pop(); await s.show(pts[1], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(pts[2], "left"); s.sfx.ding(); s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Faire Kompromisse",
        say: "Zwei wollen Verschiedenes. Ein Kompromiss heißt: Beide geben etwas nach – und beide bekommen etwas.",
        build(s) {
          const svg = s.svg(1100, 260);
          svg.append(s.el("rect", { x: 0, y: 0, width: 1100, height: 260, rx: 22, fill: "#dff3f7" }));
          const A = s.el("g", { transform: "translate(110 160)" }, kid(s, 0, 0, 1, 2.2, "#dc3b2a"));
          const B = s.el("g", { transform: "translate(990 160)" }, kid(s, 0, 0, 3, 2.2, "#1d5bd0"));
          const bubA = s.el("g", null, s.el("rect", { x: 30, y: 24, width: 200, height: 56, rx: 16, fill: "#fff", stroke: INK, "stroke-width": 2 }), T(s, 130, 61, "Fußball! ⚽", { fs: 24 }));
          const bubB = s.el("g", null, s.el("rect", { x: 870, y: 24, width: 200, height: 56, rx: 16, fill: "#fff", stroke: INK, "stroke-width": 2 }), T(s, 970, 61, "Basketball!", { fs: 24 }));
          const mid = later(s.el("g", null, s.el("rect", { x: 330, y: 70, width: 440, height: 120, rx: 18, fill: "#ffd94a", stroke: INK, "stroke-width": 3 }), T(s, 550, 118, "Mo – Mi: Fußball", { fs: 26 }), T(s, 550, 160, "Do – Fr: Basketball", { fs: 26 })));
          svg.append(A, B, bubA, bubB, mid);
          const ex = [["Schaukel", "Jeder schaukelt 20-mal, dann ist der Nächste dran."], ["Pizza", "Halb Salami, halb Margherita – beide werden satt."], ["Fernsehabend", "Heute sucht deine Schwester aus, morgen du."]]
            .map(([a, b]) => later(s.h("div", { class: "life", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag: " + a), s.h("p", { class: "small" }, b))));
          const merk = later(s.h("div", { class: "merk" }, s.h("b", null, "Kompromiss:"), " Beide geben ein Stück nach – und beide bekommen etwas. Keiner verliert ganz."));
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, svg, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...ex), merk));
          s.sfx.pop();
          s.loop(t => { if (!mid.classList.contains("later")) return; A.setAttribute("transform", `translate(110 ${160 + Math.abs(Math.sin(t * 4)) * -6})`); B.setAttribute("transform", `translate(990 ${160 + Math.abs(Math.cos(t * 4)) * -6})`); });
          s.step(async () => {
            s.sfx.whoosh();
            await s.tween({ dur: 900, ease: "out", update: v => { A.setAttribute("transform", `translate(${110 + 150 * v} 160)`); B.setAttribute("transform", `translate(${990 - 150 * v} 160)`); } });
            s.sfx.success(); await s.show(mid, "zoom"); s.say("Montag bis Mittwoch Fußball, Donnerstag und Freitag Basketball.");
          });
          s.step(async () => { for (const e of ex) { s.sfx.pop(); await s.show(e, "up"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Streit schlichten in 5 Schritten",
        say: "Streit gibt es überall. Streitschlichter helfen, eine Lösung zu finden, mit der beide zufrieden sind.",
        build(s) {
          const svg = s.svg(460, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 460, height: 470, rx: 22, fill: "#dff3f7" }), s.el("ellipse", { cx: 230, cy: 400, rx: 200, ry: 30, fill: "#c4e7ef" }));
          const face = (x, y) => {
            const g = s.el("g");
            const head = s.el("circle", { cx: x, cy: y, r: 52, fill: "#ffd0c7", stroke: INK, "stroke-width": 3 });
            const mouth = s.el("path", { d: `M${x - 20} ${y + 24} Q${x} ${y + 8} ${x + 20} ${y + 24}`, stroke: INK, "stroke-width": 4, fill: "none", "stroke-linecap": "round" });
            const brows = s.el("path", { d: `M${x - 26} ${y - 22} L${x - 8} ${y - 14} M${x + 26} ${y - 22} L${x + 8} ${y - 14}`, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" });
            g.append(head, s.el("circle", { cx: x - 17, cy: y - 4, r: 5, fill: INK }), s.el("circle", { cx: x + 17, cy: y - 4, r: 5, fill: INK }), brows, mouth);
            g.set = mood => { const m = Math.max(0, Math.min(1, mood)); head.setAttribute("fill", m < .5 ? "#ffd0c7" : "#c7f0dc"); const c = y + 16 + (1 - m) * -8 + m * 24; mouth.setAttribute("d", `M${x - 20} ${y + 20} Q${x} ${c} ${x + 20} ${y + 20}`); brows.setAttribute("opacity", 1 - m); };
            return g;
          };
          const fA = face(100, 290), fB = face(360, 290);
          const body = (x, c) => s.el("path", { d: `M${x - 48} 420 L${x - 48} 376 C${x - 48} 346 ${x + 48} 346 ${x + 48} 376 L${x + 48} 420 Z`, fill: c });
          svg.append(body(100, "#dc3b2a"), body(360, "#1d5bd0"), fA, fB);
          const med = s.el("g", null, kid(s, 230, 170, 4, 1.7, TEAL), s.el("circle", { cx: 230, cy: 182, r: 10, fill: "#ffd94a", stroke: INK, "stroke-width": 2 }));
          svg.append(med, T(s, 230, 70, "Streitschlichter*in", { fs: 22, fill: TEAL }));
          const moodT = T(s, 230, 455, "", { fs: 21 });
          svg.append(moodT);
          let mood = 0; fA.set(0); fB.set(0);
          const steps = [["Regeln klären", "Ausreden lassen, nicht beleidigen. Die Schlichter*in bleibt neutral."], ["Jeder erzählt", "Was ist passiert? Erst A, dann B."], ["Gefühle sagen", "Wie geht es dir? Was wünschst du dir?"], ["Lösungen sammeln", "Beide schlagen Ideen vor."], ["Vereinbarung", "Die Lösung wird aufgeschrieben und von beiden unterschrieben."]];
          const li = steps.map(([a, b], i) => later(s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "flex-start", gap: "12px" } }, s.h("span", { class: "chip", style: { background: "var(--unit)", color: "#fff", minWidth: "38px", justifyContent: "center", fontSize: "19px" } }, String(i + 1)), s.h("p", { class: "small", style: { fontSize: "21px" } }, s.h("b", null, a + ": "), b))));
          const life = later(lifeBox(s, "Im Alltag", s.h("p", { class: "small" }, "Streit um den Ball in der Pause, ein verstecktes Mäppchen, Ärger bei der Gruppenarbeit – das kann man so lösen.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "460px 1fr", gap: "28px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "10px" } }, ...li, life)));
          s.show(svg, "fade"); s.sfx.error();
          moodT.textContent = "Beide sind wütend.";
          steps.forEach((st, i) => s.step(async () => {
            s.sfx.count(i * 2); await s.show(li[i], "left");
            const to = (i + 1) / 5; await s.tween({ from: mood, to, dur: 600, update: v => { fA.set(v); fB.set(v); } }); mood = to;
            moodT.textContent = i < 2 ? "Beide hören zu." : i < 4 ? "Es wird besser." : "Beide sind zufrieden!";
            if (i === 4) { s.sfx.success(); s.show(life, "up"); }
          }));
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Kinderrechte",
        say: "Kinder haben eigene Rechte. Sie stehen in der UN-Kinderrechtskonvention von 1989.",
        build(s) {
          const n196 = s.h("b", { class: "mono" }, "0");
          const head = [s.h("span", null, s.h("b", null, "20.11.1989:"), " UN beschließen die Kinderrechtskonvention"), s.h("span", null, s.h("b", null, "54"), " Artikel"), s.h("span", null, n196, " Staaten machen mit"), s.h("span", null, "gilt für alle ", s.h("b", null, "unter 18"))]
            .map(x => later(s.h("span", { class: "chip", style: { fontSize: "20px", fontWeight: 400, fontFamily: "var(--f-body)" } }, x)));
          const rights = [["Art. 2", "Gleichheit", "Kein Kind darf benachteiligt werden.", "Alle dürfen mitspielen."], ["Art. 12", "Mitreden", "Deine Meinung zählt.", "Im Klassenrat sagst du, was du denkst."], ["Art. 16", "Privatsphäre", "Deine Geheimnisse gehören dir.", "Dein Tagebuch liest niemand heimlich."], ["Art. 17", "Medien", "Recht auf gute Informationen.", "Kindernachrichten, Bücherei, Internet."],
            ["Art. 19", "Schutz vor Gewalt", "Niemand darf dich schlagen oder quälen.", "Hilfe holen ist immer richtig."], ["Art. 24", "Gesundheit", "Recht auf ärztliche Hilfe.", "Der Kinderarzt hilft, wenn du krank bist."], ["Art. 28", "Bildung", "Recht auf Schule.", "Jeden Tag lernst du in der Schule."], ["Art. 31", "Spiel und Freizeit", "Recht auf Pause und Spiel.", "Hofpause, Spielplatz, Sportverein."]];
          const cards = rights.map(([a, n, t, l]) => {
            const lt = later(s.h("p", { class: "small", style: { color: "var(--green)", fontWeight: 700 } }, l));
            const c = later(s.h("div", { class: "card", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("span", { class: "exlabel", style: { marginBottom: 0 } }, a), s.h("p", { class: "h2", style: { fontSize: "24px" } }, n), s.h("p", { class: "small" }, t), lt));
            c.lt = lt; return c;
          });
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, ...head), s.h("div", { class: "cols4", style: { gap: "14px" } }, ...cards)));
          s.sfx.whoosh();
          s.step(async () => { for (const h of head) { s.sfx.pop(); await s.show(h, "pop"); } await s.tween({ dur: 1200, ease: "out", update: v => { n196.textContent = Math.round(v * 196); } }); s.sfx.coin(); });
          for (let p = 0; p < 4; p++) s.step(async () => { for (const c of cards.slice(p * 2, p * 2 + 2)) { s.sfx.pop(); s.show(c, "zoom"); await s.wait(200); } await s.wait(250); for (const c of cards.slice(p * 2, p * 2 + 2)) { s.sfx.tick(); await s.show(c.lt, "up"); } });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Athen: Hier begann Demokratie",
        say: "Vor rund 2.500 Jahren stimmten in Athen die Bürger selbst über ihre Stadt ab. Aber nicht alle durften mitmachen.",
        build(s) {
          const svg = s.svg(560, 500);
          svg.append(s.el("rect", { x: 0, y: 0, width: 560, height: 500, rx: 22, fill: "#e8f2f6" }), s.el("path", { d: "M0 470 C120 330 440 330 560 470 L560 500 L0 500 Z", fill: "#c9b48a" }), s.el("rect", { x: 250, y: 352, width: 60, height: 40, fill: "#e8e2d4", stroke: INK, "stroke-width": 2 }), T(s, 280, 420, "Pnyx", { fs: 21 }));
          const groups = [["Bürger", 3, "#1d5bd0"], ["Frauen", 6, "#9aa3b5"], ["Sklaven", 6, "#9aa3b5"], ["Metöken", 5, "#9aa3b5"]];
          const figs = [], gl = [];
          let gx = 30;
          groups.forEach(([n, c, col], gi) => {
            const w = 120;
            for (let i = 0; i < c; i++) { const x = gx + 22 + (i % 3) * 38 + (gi === 0 ? 0 : 0), y = 120 + Math.floor(i / 3) * 70; const f = kid(s, x, y, gi * 5 + i, 1, "#9aa3b5"); f.dataset.g = gi; figs.push(f); }
            gl.push(later(T(s, gx + w / 2 - 6, 290, n, { fs: 20, fill: gi === 0 ? "#1d5bd0" : "#5d6678" })));
            gx += w + 10;
          });
          svg.append(...figs, ...gl);
          const handsUp = later(s.el("g"));
          figs.filter(f => f.dataset.g === "0").forEach((f, i) => { const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(f.getAttribute("transform")); handsUp.append(s.el("path", { d: `M${+m[1] + 14} ${+m[2] + 4} L${+m[1] + 24} ${+m[2] - 28}`, stroke: SKIN[i], "stroke-width": 7, "stroke-linecap": "round" })); });
          svg.append(handsUp);
          const shard = later(s.el("g", null, s.el("path", { d: "M380 380 L470 360 L520 400 L500 450 L400 456 Z", fill: "#c8603a", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M405 410 l10 -14 l8 14 m10 -14 l0 14 m10 -14 q10 6 0 14 m14 -14 l10 14 m0 -14 l-10 14", stroke: "#3a1e10", "stroke-width": 2.5, fill: "none" })));
          const shardL = later(T(s, 450, 488, "Tonscherbe", { fs: 19 }));
          svg.append(shard, shardL);
          const cap = later(T(s, 280, 50, "Nur ein kleiner Teil durfte mitbestimmen.", { fs: 21 }));
          svg.append(cap);
          const pts = [
            s.h("p", { class: "t" }, s.h("b", null, "Demokratie"), " kommt aus dem Griechischen: ", s.h("b", null, "dēmos"), " = Volk, ", s.h("b", null, "kratos"), " = Herrschaft."),
            later(s.h("p", { class: "t" }, "Um ", s.h("b", null, "508/507 v. Chr."), " baute Kleisthenes die Volksversammlung aus. Sie traf sich auf dem Hügel ", s.h("b", null, "Pnyx"), ".")),
            later(s.h("p", { class: "t" }, "Mitmachen durften nur ", s.h("b", null, "Männer ab 20"), " mit Athener Eltern. ", s.h("b", null, "Frauen, Sklaven und Metöken"), " (Zugezogene) nicht.")),
            later(s.h("p", { class: "t" }, "Abgestimmt wurde per ", s.h("b", null, "Handzeichen"), ". Mit Tonscherben konnte man einen zu mächtigen Mann aus der Stadt schicken.")),
          ];
          const facts = later(s.h("div", { class: "card soft", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Athen hatte etwa 200.000–300.000 Einwohner – aber nur 30.000–50.000 Bürger mit vollen Rechten.")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "26px", height: "100%", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, ...pts, facts)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); await s.show(pts[1], "left"); });
          s.step(async () => {
            await s.show(pts[2], "left"); s.show(gl, "pop");
            figs.forEach((f, i) => { if (f.dataset.g === "0") { f.querySelector("path").setAttribute("fill", "#1d5bd0"); s.show(f, "pop"); } });
            s.sfx.ding(); s.show(cap, "fade"); await s.show(facts, "up"); s.say("Frauen, Sklaven und Zugezogene durften nicht abstimmen.");
          });
          s.step(async () => { s.sfx.drum(); await s.show(pts[3], "left"); s.sfx.pop(); await s.show(handsUp, "up"); s.sfx.snap(); s.show(shard, "bounce"); s.show(shardL, "fade"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Athen damals – Deutschland heute",
        say: "Was ist heute anders als im alten Athen? Wir vergleichen Zeile für Zeile.",
        build(s) {
          const rows = [
            ["Wer darf mitbestimmen?", "Nur Männer ab 20 mit Athener Eltern", "Alle deutschen Staatsbürger*innen – Frauen und Männer. Bundestag: ab 18"],
            ["Wie wird entschieden?", "Alle Bürger stimmen selbst ab", "Wir wählen Abgeordnete. Sie entscheiden im Parlament für uns."],
            ["Wo?", "Volksversammlung auf der Pnyx", "Bundestag im Reichstagsgebäude in Berlin"],
            ["Wie abstimmen?", "Per Handzeichen – alle sehen es", "Geheime Wahl – niemand sieht dein Kreuz"],
          ];
          const cell = (txt, st) => s.h("div", { style: Object.assign({ padding: "12px 16px", borderRadius: "12px", fontSize: "21px", lineHeight: 1.35 }, st) }, txt);
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 1fr 1fr", gap: "10px" } }, cell("", {}), cell(s.h("b", null, "Athen damals"), { background: "#e8e2d4", fontSize: "24px", fontFamily: "var(--f-display)" }), cell(s.h("b", null, "Deutschland heute"), { background: "var(--unit)", color: "#fff", fontSize: "24px", fontFamily: "var(--f-display)" }));
          const rs = rows.map(([q, a, b]) => {
            const ca = later(cell(a, { background: "#f6f2e8" })), cb = later(cell(b, { background: "#dff3f7" }));
            const r = s.h("div", { style: { display: "grid", gridTemplateColumns: "250px 1fr 1fr", gap: "10px" } }, cell(s.h("b", null, q), { background: "#fff", border: "2px solid var(--line)" }), ca, cb);
            r.ca = ca; r.cb = cb; return r;
          });
          const merk = later(s.h("div", { class: "merk", style: { fontSize: "22px" } }, "Athen erfand die Idee: ", s.h("b", null, "Das Volk herrscht."), " Heute dürfen viel mehr Menschen mitbestimmen – und die Wahl ist geheim."));
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } }, head, ...rs, merk));
          s.sfx.pop();
          rs.forEach((r, i) => s.step(async () => { s.sfx.swoosh(); await s.show(r.ca, "right"); s.sfx.pop(); await s.show(r.cb, "left"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Parlamente in Berlin",
        say: "In Berlin gibt es zwei wichtige Parlamente: den Bundestag für ganz Deutschland und das Abgeordnetenhaus für Berlin.",
        build(s) {
          const rt = s.svg(470, 230);
          rt.append(s.el("rect", { x: 0, y: 0, width: 470, height: 230, rx: 16, fill: "#e4f2fb" }), s.el("rect", { x: 40, y: 110, width: 390, height: 100, fill: "#d9cfb8", stroke: INK, "stroke-width": 2 }));
          [40, 380].forEach(x => rt.append(s.el("rect", { x: x - 10, y: 84, width: 70, height: 126, fill: "#cfc3a8", stroke: INK, "stroke-width": 2 })));
          [170, 200, 230, 260, 290].forEach(x => rt.append(s.el("rect", { x, y: 136, width: 12, height: 74, fill: "#bfb194" })));
          rt.append(s.el("path", { d: "M160 110 L235 84 L310 110 Z", fill: "#cfc3a8", stroke: INK, "stroke-width": 2 }));
          const dome = later(s.el("path", { d: "M180 84 C180 22 290 22 290 84 Z M200 84 C200 40 270 40 270 84 M235 30 L235 84 M190 60 L280 60", stroke: "#3a8fd0", "stroke-width": 3, fill: "#bfe0f5", "fill-opacity": .6 }));
          const flag = s.el("g", null, s.el("rect", { x: 30, y: 54, width: 30, height: 7, fill: "#1b1b1b" }), s.el("rect", { x: 30, y: 61, width: 30, height: 7, fill: "#dc3b2a" }), s.el("rect", { x: 30, y: 68, width: 30, height: 7, fill: "#ffd94a" }), s.el("path", { d: "M30 54 L30 84", stroke: INK, "stroke-width": 2 }));
          rt.append(dome, flag);
          const ah = s.svg(470, 230);
          ah.append(s.el("rect", { x: 0, y: 0, width: 470, height: 230, rx: 16, fill: "#e4f2fb" }), s.el("rect", { x: 50, y: 90, width: 370, height: 120, fill: "#e8e2d4", stroke: INK, "stroke-width": 2 }), s.el("path", { d: "M150 90 L235 46 L320 90 Z", fill: "#ddd5c2", stroke: INK, "stroke-width": 2 }));
          const cols = [170, 200, 230, 260, 290].map(x => later(s.el("rect", { x, y: 96, width: 14, height: 114, fill: "#f6f2e8", stroke: INK, "stroke-width": 1.5 })));
          ah.append(...cols, s.el("g", null, s.el("rect", { x: 222, y: 20, width: 26, height: 18, fill: "#fff", stroke: INK, "stroke-width": 1.5 }), s.el("rect", { x: 222, y: 26, width: 26, height: 6, fill: "#dc3b2a" }), s.el("path", { d: "M222 20 L222 46", stroke: INK, "stroke-width": 2 })));
          const n130 = s.h("b", { class: "mono" }, "0");
          const c1 = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" } }, rt, s.h("p", { class: "h2" }, "Bundestag"),
            later(s.h("p", { class: "small" }, "Das Parlament für ganz Deutschland. Seit 1999 im ", s.h("b", null, "Reichstagsgebäude"), ". Über dem Eingang steht: „Dem deutschen Volke“. In die Glaskuppel darfst du hinaufgehen!")));
          const c2 = later(s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" } }, ah, s.h("p", { class: "h2" }, "Abgeordnetenhaus"),
            s.h("p", { class: "small" }, "Das Parlament für Berlin – im früheren Preußischen Landtag. Mindestens ", n130, " Abgeordnete, alle 5 Jahre gewählt.")));
          const merk = later(s.h("div", { class: "merk", style: { gridColumn: "1 / 3", fontSize: "22px" } }, "Der ", s.h("b", null, "Bundestag"), " macht Gesetze für ganz Deutschland. Das ", s.h("b", null, "Abgeordnetenhaus"), " macht Gesetze für Berlin – zum Beispiel das Berliner Schulgesetz."));
          s.add(s.h("div", { class: "cols", style: { gap: "20px 24px", height: "100%", alignContent: "center", alignItems: "stretch" } }, c1, c2, merk));
          s.show(c1, "left"); s.sfx.whoosh();
          s.step(async () => { s.sfx.ding(); await s.show(dome, "draw"); s.sfx.pop(); await s.show(c1.lastChild, "up"); s.say("Der Bundestag sitzt im Reichstagsgebäude. Oben ist eine Glaskuppel."); });
          s.step(async () => { s.sfx.whoosh(); await s.show(c2, "right"); for (const c of cols) { s.sfx.tick(); await s.show(c, "up"); } await s.tween({ dur: 1000, ease: "out", update: v => { n130.textContent = Math.round(v * 130); } }); s.sfx.coin(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Ab wann darf ich wählen?",
        say: "Schiebe den Regler auf ein Alter. Siehst du, welche Wahlen dann möglich sind?",
        build(s) {
          const svg = s.svg(1100, 120);
          const X = a => 40 + (a - 10) / 10 * 1020;
          svg.append(s.el("path", { d: `M${X(10)} 60 L${X(20)} 60`, stroke: INK, "stroke-width": 4 }));
          for (let a = 10; a <= 20; a++) svg.append(s.el("path", { d: `M${X(a)} 50 L${X(a)} 70`, stroke: INK, "stroke-width": 3 }), T(s, X(a), 100, String(a), { fs: 20 }));
          svg.append(s.el("rect", { x: X(16) - 6, y: 20, width: 12, height: 30, rx: 4, fill: "#ee7a1a" }), s.el("rect", { x: X(18) - 6, y: 20, width: 12, height: 30, rx: 4, fill: "#7b4fd6" }));
          const me = s.el("g", null, s.el("circle", { cx: 0, cy: 60, r: 16, fill: TEAL, stroke: "#fff", "stroke-width": 4 }));
          svg.append(me);
          const elections = [
            [16, "Bezirk (BVV)", "Bezirksverordnete in deinem Bezirk"],
            [16, "Abgeordnetenhaus", "Am 20.9.2026 durften 16-Jährige zum ersten Mal mitwählen."],
            [16, "Europa", "Europawahl ab 16 – seit 2024"],
            [18, "Bundestag", "Erst ab 18 Jahren"],
          ];
          const cards = elections.map(([age, n, t]) => { const c = s.h("div", { class: "card", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px", transition: "background .3s, border-color .3s, opacity .3s" } }, s.h("span", { class: "chip", style: { fontSize: "19px", alignSelf: "flex-start", background: age === 16 ? "#fde3cc" : "#e6dcf7" } }, "ab " + age), s.h("p", { class: "h2", style: { fontSize: "24px" } }, n), s.h("p", { class: "small" }, t)); c.age = age; return c; });
          const status = s.h("p", { class: "h2", style: { textAlign: "center", minHeight: "36px" } }, "");
          let lastN = -1;
          const upd = a => {
            me.setAttribute("transform", `translate(${X(a)} 0)`);
            let n = 0;
            cards.forEach(c => { const ok = a >= c.age; if (ok) n++; c.style.background = ok ? "#e6f6ee" : "#fff"; c.style.borderColor = ok ? "#9fd8bd" : "var(--line)"; c.style.opacity = ok ? 1 : .55; });
            status.textContent = n ? `Mit ${a} darfst du bei ${n} von 4 Wahlen wählen.` : `Mit ${a}: Noch nicht wählen – aber schon mitmachen!`;
            if (n !== lastN && lastN >= 0) n > lastN ? s.sfx.success() : s.sfx.boing();
            lastN = n;
          };
          const sl = s.slider({ label: "Dein Alter", min: 10, max: 20, value: 10, fmt: v => v + " Jahre", onInput: upd });
          upd(10);
          const kjp = later(s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Schon jetzt mitmachen"), s.h("p", { class: "small" }, "Im ", s.h("b", null, "Kinder- und Jugendparlament Charlottenburg-Wilmersdorf"), " können Kinder ab Klasse 5 gewählt werden. Sie treffen sich mindestens 4-mal im Jahr im Rathaus Charlottenburg und machen Vorschläge für ihren Bezirk.")));
          s.add(s.h("div", { class: "stack", style: { gap: "12px", height: "100%", justifyContent: "center" } }, svg, sl, status, s.h("div", { class: "cols4", style: { gap: "14px" } }, ...cards), kjp));
          s.sfx.pop();
          s.step(async () => { await s.tween({ from: 10, to: 16, dur: 1400, ease: "inOut", update: v => sl.set(Math.round(v)) }); s.say("Mit sechzehn darfst du in Berlin schon das Abgeordnetenhaus wählen."); });
          s.step(async () => { await s.tween({ from: 16, to: 18, dur: 700, update: v => sl.set(Math.round(v)) }); });
          s.step(async () => { await s.tween({ from: 18, to: 10, dur: 900, update: v => sl.set(Math.round(v)) }); s.sfx.ding(); await s.show(kjp, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Medien und Meinungen",
        say: "In Zeitung, Fernsehen und Internet stehen Fakten und Meinungen. Wer mitentscheidet, muss beides auseinanderhalten.",
        build(s) {
          const items = [["Der Fernsehturm ist 368 Meter hoch.", 0], ["Der Fernsehturm ist das schönste Gebäude Berlins.", 1], ["Am 20.9.2026 wurde in Berlin gewählt.", 0], ["Pizza ist das beste Essen der Welt.", 1]];
          const binF = s.h("div", { class: "card", style: { minHeight: "250px", display: "flex", flexDirection: "column", gap: "8px", borderColor: "#1d5bd0", borderWidth: "3px" } }, s.h("p", { class: "h2", style: { color: "var(--blue)" } }, "Fakt"), s.h("p", { class: "small pencil" }, "Kann man nachprüfen."));
          const binM = s.h("div", { class: "card", style: { minHeight: "250px", display: "flex", flexDirection: "column", gap: "8px", borderColor: "#ee7a1a", borderWidth: "3px" } }, s.h("p", { class: "h2", style: { color: "var(--orange)" } }, "Meinung"), s.h("p", { class: "small pencil" }, "Was jemand denkt oder fühlt."));
          const notes = items.map(([t, k]) => { const n = later(s.h("div", { class: "chip", style: { fontSize: "20px", fontWeight: 400, fontFamily: "var(--f-body)", background: k ? "#fde3cc" : "#dbe7fb", borderRadius: "12px", padding: "8px 12px" } }, t)); (k ? binM : binF).append(n); return n; });
          const tips = [["Quelle prüfen", "Wer sagt das? Woher weiß er es?"], ["Vergleichen", "Was steht in anderen Medien?"], ["Fragen", "Eltern, Lehrkräfte – und im Klassenrat diskutieren."]]
            .map(([a, b]) => later(s.h("div", { class: "ex", style: { padding: "10px 14px" } }, s.h("span", { class: "exlabel" }, a), s.h("p", { class: "small" }, b))));
          const life = later(lifeBox(s, "Im Alltag", s.h("p", { class: "small" }, "Zeitung, Kindernachrichten, Schülerzeitung, Videos im Netz: Überall gibt es Fakten und Meinungen. Du hast ein Recht auf gute Informationen (Kinderrechte, Art. 17).")));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 330px", gap: "18px", height: "100%", alignItems: "center" } }, binF, binM, s.h("div", { class: "stack", style: { gap: "12px" } }, ...tips, life)));
          s.sfx.pop();
          items.forEach((it, i) => s.step(async () => { s.sfx.whoosh(); await s.show(notes[i], it[1] ? "right" : "left"); it[1] ? s.sfx.boing() : s.sfx.ding(); }));
          s.step(async () => { for (const t of tips) { s.sfx.pop(); await s.show(t, "up"); } s.sfx.ding(); s.show(life, "up"); s.say("Demokratie braucht Menschen, die gut informiert sind und ihre Meinung sagen."); });
        },
      },
    ],
  });
})();
