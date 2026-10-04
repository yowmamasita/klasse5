/* Kapitel 6 – Dezimalzahlen (Berlin RLP Niveau D) */
(() => {
  const UC = "#2f7d32";
  const INK = "#1b2740";
  const DISP = "font-family:var(--f-display)";
  const MONO = "font-family:ui-monospace,Menlo,Consolas,monospace";

  /* ---------- small helpers ---------- */
  const fc = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const L = el => { el.classList.add("later"); return el; };
  const tx = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 600, fill: INK, text: t }, o));
  const frac = (s, n, d) => s.h("span", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", lineHeight: "1", margin: "0 4px", fontSize: ".8em" } },
    s.h("span", { style: { borderBottom: "3px solid currentColor", padding: "0 4px 3px" } }, String(n)), s.h("span", { style: { padding: "3px 4px 0" } }, String(d)));
  const exbox = (s, label, kids, cls = "ex", style = {}) => s.h("div", { class: cls, style }, s.h("span", { class: "exlabel" }, label), ...kids);
  const trim = (str) => (str.includes(",") ? str.replace(/0+$/, "").replace(/,$/, "") : str);
  const head = (x, y, ang, size = 13) => `M${x + size * Math.cos(ang + 2.6)} ${y + size * Math.sin(ang + 2.6)} L${x} ${y} L${x + size * Math.cos(ang - 2.6)} ${y + size * Math.sin(ang - 2.6)}`;
  const countTo = (s, el, from, to, dec = 0, suf = "", dur = 900, sound = true) => {
    let last = null, n = 0;
    return s.tween({ from, to, dur, ease: "out", update: v => { const t = s.fmt(v, dec) + suf; if (t !== last) { el.textContent = t; last = t; if (sound && n++ % 4 === 0) s.sfx.tick(); } } });
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  /* number line drawn into an svg group; integer steps avoid float noise */
  function nline(s, g, y, x0, x1, v0, n, minor, every, dec) {
    const base = s.el("line", { x1: x0 - 14, y1: y, x2: x1 + 14, y2: y, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" });
    const ticks = s.el("g", { stroke: INK, "stroke-linecap": "round" });
    const labels = [];
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n;
      const major = i % every === 0, mid = !major && every % 2 === 0 && i % (every / 2) === 0;
      const hh = major ? 13 : mid ? 9 : 5;
      ticks.append(s.el("line", { x1: x, y1: y - hh, x2: x, y2: y + hh, "stroke-width": major ? 3 : 1.6 }));
      if (major) {
        const v = v0 + (i * minor);
        const lab = fc(tx(s, x, y + 38, trim(s.fmt(v, dec)), { "font-size": 21, "font-weight": 700 }));
        labels.push(lab);
      }
    }
    g.append(base, ticks, ...labels);
    return { base, ticks, labels, x: v => x0 + (x1 - x0) * (v - v0) / (n * minor) };
  }

  Deck.unit({
    id: "u6", num: 6, title: "Dezimalzahlen", color: UC, soft: "#e3f2e4",
    subtitle: "Zahlen mit Komma – vom Preisschild bis zum Weltrekord",
    blurb: "Komma, Zehntel, Prozent – runden, ordnen, rechnen.",
    goals: [
      "Zehntel, Hundertstel und Tausendstel verstehen",
      "Dezimalzahlen am Zahlenstrahl finden",
      "Brüche, Dezimalzahlen und Prozent umwandeln",
      "Dezimalzahlen vergleichen, ordnen und runden",
      "Plus und minus: Komma unter Komma!",
    ],
    icon(svg, el) {
      svg.append(
        el("rect", { x: 6, y: 14, width: 58, height: 42, rx: 10, fill: "#e3f2e4", stroke: UC, "stroke-width": 3 }),
        el("text", { x: 35, y: 45, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: UC, text: "0,5" }));
    },
    slides: [
      /* 1 ------------------------------------------------------------------ */
      {
        title: "Zahlen mit Komma im Alltag",
        say: "Zahlen mit Komma siehst du jeden Tag. Zum Beispiel auf einem Preisschild: 2 Euro 49.",
        build(s) {
          const svg = s.svg(500, 320);
          svg.append(
            s.el("path", { d: "M80 30 H446 a18 18 0 0 1 18 18 V192 a18 18 0 0 1 -18 18 H80 L24 120 Z", fill: "#fff6c9", stroke: "#c9a227", "stroke-width": 5, "stroke-linejoin": "round" }),
            s.el("circle", { cx: 68, cy: 120, r: 10, fill: "#fbfcf7", stroke: "#c9a227", "stroke-width": 4 }),
            s.el("path", { d: "M58 120 C 30 60, 10 40, 4 20", fill: "none", stroke: "#8a6d1a", "stroke-width": 3 }),
            ...[["2", 150], [",", 198], ["49", 276], ["€", 400]].map(([t, x]) => tx(s, x, 162, t, { "font-size": 108, "font-weight": 800, style: DISP })));
          const ring = L(s.el("circle", { cx: 198, cy: 158, r: 30, fill: "none", stroke: "var(--red)", "stroke-width": 5 }));
          const a1 = L(s.el("path", { d: "M150 216 V258 " + head(150, 260, Math.PI / 2), fill: "none", stroke: "var(--blue)", "stroke-width": 4, "stroke-linecap": "round" }));
          const a2 = L(s.el("path", { d: "M276 216 V258 " + head(276, 260, Math.PI / 2), fill: "none", stroke: "var(--blue)", "stroke-width": 4, "stroke-linecap": "round" }));
          const l1 = L(fc(s.el("text", { x: 150, y: 298, "text-anchor": "middle", class: "hlbl", text: "2 ganze Euro" })));
          const l2 = L(fc(s.el("text", { x: 290, y: 298, "text-anchor": "middle", class: "hlbl", text: "49 Cent" })));
          svg.append(ring, a1, a2, l1, l2);

          const r1 = s.h("p", { class: "t later" }, "Links vom Komma: die ", s.h("b", null, "Ganzen"), " – hier 2 Euro.");
          const r2 = s.h("p", { class: "t later" }, "Rechts vom Komma: die ", s.h("b", null, "Teile"), " – hier 49 Cent.");
          const merk = s.h("div", { class: "merk later" }, "Das Komma trennt die ", s.h("b", null, "Ganzen"), " von den ", s.h("b", null, "Teilen"), " eines Ganzen.");
          const right = s.h("div", { class: "stack" }, s.h("p", { class: "h2" }, "Was bedeutet das Komma?"), r1, r2, merk);

          const mk = (lab, emo, val, dec, suf, desc, snd) => {
            const v = s.h("span", { class: "big mono" }, s.fmt(0, dec) + suf);
            const c = exbox(s, lab, [s.h("div", { class: "row", style: { gap: "12px" } }, s.h("span", { style: { fontSize: "40px" } }, emo), v), s.h("p", { class: "small" }, desc)], "ex later");
            return { c, run: async () => { if (snd) s.sound(snd, { vol: .6, dur: 1.2 }); else s.sfx.whoosh(); s.show(c, "up"); await countTo(s, v, 0, val, dec, suf, 1100); s.sfx.ding(); } };
          };
          const cards = [
            mk("Sport", "⏱️", 9.58, 2, " s", "Weltrekord über 100 m: Usain Bolt, Berlin 2009.", "stopwatch"),
            mk("Körper", "📏", 1.42, 2, " m", "So groß ist ein Kind: 1 Meter und 42 Zentimeter."),
            mk("Wetter", "🌡️", 21.5, 1, " °C", "Im Klassenzimmer: 21 Grad und noch ein halbes."),
          ];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "26px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "30px", alignItems: "center" } }, svg, right),
            s.h("div", { class: "cols3" }, cards.map(c => c.c))));
          s.show(svg, "zoom"); s.sfx.pop();

          s.step(async () => {
            s.sound("cash-register", { vol: .5 }); await s.show(ring, "draw");
            s.sfx.whoosh(); s.show([a1, a2], "draw"); await s.wait(500);
            s.sfx.pop(); s.show([l1, l2], "pop"); s.show(r1, "left", 200); await s.show(r2, "left", 500);
            s.say("Links vom Komma stehen die ganzen Euro, rechts die Cent.");
          });
          cards.forEach(c => s.step(c.run));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 1b ----------------------------------------------------------------- */
      {
        title: "Kommazahlen in echt",
        say: "Im Stadion, auf dem Markt und beim Fiebermessen: Überall stehen Zahlen mit Komma.",
        build(s) {
          const ph = (caption, pos = "50% 50%") => ({ w: 340, h: 420, pos, caption, cls: "later" });
          const figs = [
            s.photo("bolt-peking", ph("Usain Bolt, Olympia Peking 2008: 100\u00a0m in 9,69\u00a0s", "50% 30%")),
            s.photo("preis-pflaumen", ph("Wochenmarkt: Pflaumen für 2,50\u00a0€ das Kilo", "42% 50%")),
            s.photo("fieberthermometer", ph("Fieberthermometer: 38,0 °C", "50% 50%")),
          ];
          const mk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Links vom Komma stehen die ", s.h("b", null, "Ganzen"), ", rechts die ", s.h("b", null, "Teile"), ": Hundertstelsekunden, Cent, Zehntelgrad.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "20px" } },
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "40px", justifyContent: "center" } }, figs), mk));
          s.step(async () => { s.sound("stopwatch", { vol: .6, dur: 1.5 }); await s.show(figs[0], "zoom"); s.say("Usain Bolt lief 2008 in Peking 9 Komma 69 Sekunden."); });
          s.step(async () => { s.sound("coins", { vol: .7 }); await s.show(figs[1], "zoom"); s.say("2 Euro 50 für ein Kilo Pflaumen."); });
          s.step(async () => { s.sfx.note(12, 0.15, "square"); await s.show(figs[2], "zoom"); s.say("38 Komma 0 Grad: Das ist Fieber."); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 2 ------------------------------------------------------------------ */
      {
        title: "Die Stellenwerttafel wächst",
        say: "Die Stellenwerttafel kennst du schon. Nach dem Komma geht sie weiter: Zehntel, Hundertstel, Tausendstel.",
        build(s) {
          const COLS = [
            { k: "H", n: "Hunderter", x: 20, w: 120 }, { k: "Z", n: "Zehner", x: 140, w: 120 }, { k: "E", n: "Einer", x: 260, w: 120 },
            { k: ",", n: "", x: 380, w: 40 },
            { k: "z", n: "Zehntel", x: 420, w: 120 }, { k: "h", n: "Hundertstel", x: 540, w: 120 }, { k: "t", n: "Tausendstel", x: 660, w: 120 },
          ];
          const svg = s.svg(800, 232);
          const dig = {}, colG = {};
          COLS.forEach((c, i) => {
            const after = i > 3, comma = c.k === ",";
            const g = s.el("g");
            g.append(
              s.el("rect", { x: c.x, y: 2, width: c.w, height: 68, fill: comma ? "#fff" : after ? "#e3f2e4" : "#e4ecfb", stroke: "#9aa9bb", "stroke-width": 2 }),
              s.el("rect", { x: c.x, y: 70, width: c.w, height: 90, fill: "#fff", stroke: "#9aa9bb", "stroke-width": 2 }));
            if (!comma) {
              g.append(tx(s, c.x + c.w / 2, 32, c.k, { "font-size": 28, "font-weight": 800, fill: after ? UC : "var(--blue)", style: DISP }),
                tx(s, c.x + c.w / 2, 58, c.n, { "font-size": 19, "font-weight": 600, fill: "#5d6678" }));
              dig[c.k] = fc(tx(s, c.x + c.w / 2, 136, "", { "font-size": 56, "font-weight": 800, style: DISP }));
              g.append(dig[c.k]);
            } else g.append(tx(s, c.x + c.w / 2, 136, ",", { "font-size": 60, "font-weight": 800, fill: "var(--red)", style: DISP }));
            if (i >= 3) { L(g); fc(g); }
            colG[c.k] = g; svg.append(g);
          });
          const ctr = k => { const c = COLS.find(q => q.k === k); return c.x + c.w / 2; };
          const arcs = [["H", "Z"], ["Z", "E"], ["E", "z"], ["z", "h"], ["h", "t"]].map(([a, b], i) => {
            const x1 = ctr(a) + 8, x2 = ctr(b) - 8, m = (x1 + x2) / 2;
            const ang = Math.atan2(168 - 214, x2 - m);
            const p = s.el("path", { d: `M${x1} 168 Q${m} 214 ${x2} 168`, fill: "none", stroke: i < 2 ? "var(--blue)" : UC, "stroke-width": 3 });
            const hd = s.el("path", { d: head(x2, 168, ang, 12), fill: "none", stroke: i < 2 ? "var(--blue)" : UC, "stroke-width": 3, "stroke-linecap": "round" });
            const lb = fc(tx(s, m, 220, ": 10", { "font-size": 21, "font-weight": 700, fill: i < 2 ? "var(--blue)" : UC }));
            if (i >= 2) [p, hd, lb].forEach(L);
            svg.append(p, hd, lb);
            return { p, hd, lb };
          });

          const EX = [
            { label: "3,752", d: { E: "3", z: "7", h: "5", t: "2" }, life: "3 Ganze, 7 Zehntel, 5 Hundertstel und 2 Tausendstel." },
            { label: "12,35", unit: " €", d: { Z: "1", E: "2", z: "3", h: "5" }, life: "12 Euro 35 Cent: 1 Zehner, 2 Euro, 3 Zehn-Cent- und 5 Ein-Cent-Münzen." },
            { label: "1,425", unit: " km", d: { E: "1", z: "4", h: "2", t: "5" }, life: "Radtour: 1 Kilometer und 425 Meter." },
          ];
          const line1 = s.h("p", { class: "later mono", style: { fontSize: "30px", fontWeight: 700, margin: 0 } });
          const line2 = s.h("p", { class: "later mono", style: { fontSize: "30px", fontWeight: 700, margin: 0 } });
          const life = s.h("p", { class: "small later", style: { color: "var(--green)" } });
          const val = { H: 100, Z: 10, E: 1, z: 10, h: 100, t: 1000 };
          const setEx = async (i, animate = true) => {
            const e = EX[i];
            Object.values(dig).forEach(t => { t.textContent = ""; });
            const keys = ["H", "Z", "E", "z", "h", "t"].filter(k => e.d[k] != null);
            line1.textContent = "";
            line1.append(e.label + (e.unit || "") + " = ", ...keys.flatMap((k, j) => [j ? " + " : "", s.h("span", { style: { color: "zht".includes(k) ? UC : "var(--blue)" } }, e.d[k] + " " + k)]));
            line2.textContent = "";
            line2.append("= ", ...keys.flatMap((k, j) => {
              const dd = Number(e.d[k]);
              const part = "zht".includes(k) ? frac(s, dd, val[k]) : String(dd * val[k]);
              return [j ? " + " : "", part];
            }));
            life.textContent = e.life;
            for (let j = 0; j < keys.length; j++) {
              const t = dig[keys[j]]; t.textContent = e.d[keys[j]];
              if (animate) { s.sfx.count(j * 2); s.show(t, "pop"); await s.wait(260); }
            }
          };
          const btns = EX.map((e, i) => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); setEx(i); } }, e.label + (e.unit || "")));
          const btnRow = s.h("div", { class: "row later" }, s.h("span", { class: "t" }, "Andere Zahl:"), ...btns);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Nach dem Komma: ", s.h("b", null, "Zehntel, Hundertstel, Tausendstel"), " – jede Stelle ist 10-mal kleiner als ihr linker Nachbar.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px", justifyContent: "center" } },
            s.h("div", { class: "center" }, svg),
            s.h("div", { class: "card soft stack", style: { gap: "8px", padding: "14px 22px" } }, line1, line2, life),
            btnRow, merk));
          s.show(svg, "fade"); s.sfx.pop();

          s.step(async () => {
            s.say("Rechts vom Einer kommt das Komma. Dann Zehntel, Hundertstel, Tausendstel.");
            s.sfx.snap(); s.show(colG[","], "pop"); await s.wait(300);
            for (const [i, k] of ["z", "h", "t"].entries()) {
              s.sfx.note(i * 3 + 4, 0.25); s.show(colG[k], "pop"); s.show([arcs[i + 2].p], "draw"); s.show([arcs[i + 2].hd, arcs[i + 2].lb], "fade", 300); await s.wait(380);
            }
          });
          s.step(async () => { await setEx(0); s.sfx.pop(); await s.show(line1, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(line2, "up"); s.say("7 Zehntel, 5 Hundertstel, 2 Tausendstel."); });
          s.step(async () => { s.sfx.pop(); s.show(life, "fade"); s.show(btnRow, "up"); await s.wait(200); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ------------------------------------------------------------------ */
      {
        title: "Zehntel, Hundertstel, Tausendstel",
        say: "Das ist ein Ganzes. Wir teilen es immer wieder in zehn gleiche Teile.",
        build(s) {
          const svg = s.svg(440, 500);
          const X = 20, Y = 20, S = 400;
          svg.append(s.el("rect", { x: X, y: Y, width: S, height: S, fill: "#fff", stroke: INK, "stroke-width": 4 }));
          const strip = L(s.el("rect", { x: X, y: Y, width: 40, height: S, fill: UC, "fill-opacity": .35 }));
          const cell = L(fc(s.el("rect", { x: X, y: Y + 360, width: 40, height: 40, fill: "#1f5e22" })));
          const vlines = [], hlines = [];
          for (let i = 1; i < 10; i++) {
            vlines.push(L(s.el("line", { x1: X + 40 * i, y1: Y, x2: X + 40 * i, y2: Y + S, stroke: UC, "stroke-width": 2.5 })));
            hlines.push(L(s.el("line", { x1: X, y1: Y + 40 * i, x2: X + S, y2: Y + 40 * i, stroke: "#7aa27c", "stroke-width": 1.5 })));
          }
          svg.append(strip, ...vlines, ...hlines, cell);
          // magnifier for the thousandths
          const zoom = L(s.el("g"));
          zoom.append(
            s.el("line", { x1: X + 40, y1: Y + 360, x2: 200, y2: 140, stroke: "#5d6678", "stroke-width": 2, "stroke-dasharray": "6 5" }),
            s.el("line", { x1: X + 40, y1: Y + 400, x2: 200, y2: 380, stroke: "#5d6678", "stroke-width": 2, "stroke-dasharray": "6 5" }),
            s.el("rect", { x: 200, y: 140, width: 240 - 20, height: 240, fill: "#fff", stroke: UC, "stroke-width": 5, rx: 6 }),
            s.el("rect", { x: 200, y: 140, width: 22, height: 240, fill: "var(--orange)", "fill-opacity": .85 }));
          for (let i = 1; i < 10; i++) zoom.append(s.el("line", { x1: 200 + 22 * i, y1: 140, x2: 200 + 22 * i, y2: 380, stroke: UC, "stroke-width": 2 }));
          svg.append(zoom);
          const cap = fc(s.el("text", { x: 220, y: 470, "text-anchor": "middle", class: "hlbl", style: "font-size:34px", text: "1 Ganzes" }));
          svg.append(cap);

          const card = (num, f1, f2, col, desc) => s.h("div", { class: "card later", style: { padding: "12px 20px" } },
            s.h("div", { class: "row", style: { gap: "14px" } }, s.h("span", { class: "big mono", style: { color: col } }, num), s.h("span", { class: "t", style: { fontSize: "30px" } }, "= ", frac(s, f1, f2))),
            s.h("p", { class: "small" }, desc));
          const c1 = card("0,1", 1, 10, UC, "1 Streifen von 10 · 10 Cent von 1 € · 1 dm von 1 m");
          const c2 = card("0,01", 1, 100, "#1f5e22", "1 Kästchen von 100 · 1 Cent von 1 € · 1 cm von 1 m");
          const c3 = card("0,001", 1, 1000, "var(--orange)", "1 Scheibchen von 1000 · 1 mm von 1 m · 1 g von 1 kg");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "1 → 0,1 → 0,01 → 0,001: Jede Stelle nach rechts ist ", s.h("b", null, "10-mal kleiner"), ".");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "36px", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack", style: { gap: "14px" } }, c1, c2, c3, merk)));
          s.show(svg, "zoom"); s.sfx.pop();

          const relabel = async t => { cap.textContent = t; s.show(cap, "pop"); };
          s.step(async () => {
            s.say("Zehn Streifen. Ein Streifen ist ein Zehntel, also null Komma eins.");
            for (let i = 0; i < 9; i++) { s.sfx.count(i); s.show(vlines[i], "draw"); await s.wait(70); }
            await s.wait(300); s.sfx.pop(); s.show(strip, "fade"); relabel("10 Zehntel = 1 Ganzes"); await s.show(c1, "left");
          });
          s.step(async () => {
            s.say("Jetzt hundert Kästchen. Ein Kästchen ist ein Hundertstel, null Komma null eins.");
            s.sound("pencil-write"); s.show(hlines, "draw"); await s.wait(700);
            s.sfx.pop(); s.show(cell, "pop"); relabel("100 Hundertstel = 1 Ganzes"); await s.show(c2, "left");
          });
          s.step(async () => {
            s.say("Mit der Lupe teilen wir ein Kästchen noch einmal in zehn. Das sind Tausendstel.");
            s.sfx.whoosh(); await s.show(zoom, "zoom"); s.sfx.ding(); relabel("1000 Tausendstel = 1 Ganzes"); await s.show(c3, "left");
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 4 ------------------------------------------------------------------ */
      {
        title: "Zahlenstrahl mit Lupe",
        say: "Auf dem Zahlenstrahl liegt zwischen 2 und 3 noch ganz viel Platz. Wir holen die Lupe!",
        build(s) {
          const svg = s.svg(1100, 478);
          const g1 = s.el("g"), g2 = L(s.el("g")), g3 = L(s.el("g"));
          const band1 = L(s.el("rect", { x: 450, y: 38, width: 200, height: 24, rx: 6, fill: UC, "fill-opacity": .3 }));
          const f1 = L(s.el("polygon", { points: "450,98 650,98 1050,206 50,206", fill: "#e3f2e4", stroke: UC, "stroke-width": 2, "stroke-dasharray": "6 6" }));
          const band2 = L(s.el("rect", { x: 350, y: 223, width: 100, height: 24, rx: 6, fill: UC, "fill-opacity": .3 }));
          const f2 = L(s.el("polygon", { points: "350,283 450,283 1050,392 50,392", fill: "#e3f2e4", stroke: UC, "stroke-width": 2, "stroke-dasharray": "6 6" }));
          svg.append(band1, f1, band2, f2, g1, g2, g3);
          const n1 = nline(s, g1, 50, 50, 1050, 0, 50, 0.1, 10, 0);
          const n2 = nline(s, g2, 235, 50, 1050, 2, 100, 0.01, 10, 1);
          const n3 = nline(s, g3, 420, 50, 1050, 2.3, 100, 0.001, 10, 2);
          const dot2 = L(fc(s.el("circle", { cx: n2.x(2.35), cy: 235, r: 9, fill: "var(--red)" })));
          const dot3 = L(fc(s.el("circle", { cx: n3.x(2.35), cy: 420, r: 13, fill: "var(--red)", stroke: "#fff", "stroke-width": 3 })));
          svg.append(dot2, dot3);
          const lens = L(s.el("g"));
          lens.append(s.el("circle", { cx: 1000, cy: 128, r: 26, fill: "#fff", "fill-opacity": .6, stroke: INK, "stroke-width": 5 }), s.el("line", { x1: 1019, y1: 147, x2: 1046, y2: 174, stroke: INK, "stroke-width": 9, "stroke-linecap": "round" }));
          svg.append(lens);

          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Zwischen zwei Zahlen passen immer noch weitere Zahlen – mit der Lupe siehst du sie.");
          const life = exbox(s, "Im Alltag", [s.h("p", { class: "small" }, "Fieberthermometer: 37,5 °C liegt genau in der Mitte zwischen 37 °C und 38 °C.")], "life later", { padding: "10px 18px" });
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, svg, s.h("div", { class: "cols", style: { gap: "20px" } }, merk, life)));
          s.sfx.whoosh(); s.show(n1.base, "draw"); s.show(n1.labels, "pop", 300);

          s.step(async () => {
            s.say("Zwischen 2 und 3 liegen 2 Komma 1, 2 Komma 2 und so weiter.");
            s.sfx.pop(); s.show(lens, "pop"); s.show(band1, "fade"); s.sfx.whoosh(); await s.show(f1, "fade");
            s.show(g2, "fade"); s.show(n2.base, "draw");
            for (let i = 0; i < n2.labels.length; i++) { s.sfx.note(i, 0.15); s.show(n2.labels[i], "pop"); await s.wait(110); }
          });
          s.step(async () => {
            s.say("Und zwischen 2 Komma 3 und 2 Komma 4 liegen 2 Komma 31, 2 Komma 32 und so weiter.");
            s.show(band2, "fade"); s.sfx.whoosh(); await s.show(f2, "fade");
            s.show(g3, "fade"); s.show(n3.base, "draw");
            for (let i = 0; i < n3.labels.length; i++) { s.sfx.note(i + 7, 0.15); s.show(n3.labels[i], "pop"); await s.wait(110); }
          });
          s.step(async () => {
            s.say("2 Komma 35 liegt genau in der Mitte zwischen 2 Komma 3 und 2 Komma 4.");
            s.sfx.boing(); s.show(dot3, "bounce"); s.show(dot2, "pop", 300);
            const lab = n3.labels[5]; lab.setAttribute("fill", "var(--red)"); lab.setAttribute("font-size", 26); s.show(lab, "pop", 200);
          });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(life, "up", 200); });
        },
      },
      /* 5 ------------------------------------------------------------------ */
      {
        title: "Messen mit dem Lineal",
        say: "Mit dem Lineal misst du Zentimeter und Millimeter. Das schreibt man mit Komma.",
        build(s) {
          const X0 = 50, PX = 64;
          const svg = s.svg(1100, 232);
          const ruler = s.el("g");
          ruler.append(s.el("rect", { x: 26, y: 112, width: 1010, height: 104, rx: 8, fill: "#fff7d6", stroke: "#b8962a", "stroke-width": 3 }));
          for (let mm = 0; mm <= 150; mm++) {
            const x = X0 + mm * PX / 10, big = mm % 10 === 0, half = mm % 5 === 0;
            ruler.append(s.el("line", { x1: x, y1: 112, x2: x, y2: 112 + (big ? 32 : half ? 22 : 13), stroke: INK, "stroke-width": big ? 2.5 : 1.3 }));
            if (big) ruler.append(tx(s, x, 172, String(mm / 10), { "font-size": 21, "font-weight": 700 }));
          }
          ruler.append(tx(s, 980, 204, "cm", { "font-size": 19, fill: "#5d6678" }));
          const hl = L(s.el("rect", { x: X0, y: 112, width: 0, height: 32, fill: "var(--yellow)", "fill-opacity": .8 }));
          svg.append(ruler, hl);
          const obj = L(s.el("g"));
          const bar = s.el("rect", { x: X0, y: 36, width: 10, height: 56, rx: 12, fill: UC });
          const nm = s.el("text", { x: X0, y: 72, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#fff", text: "Bleistift" });
          const guide = s.el("line", { x1: X0, y1: 92, x2: X0, y2: 150, stroke: "var(--red)", "stroke-width": 3, "stroke-dasharray": "5 4" });
          const handle = s.el("g");
          const hc = s.el("circle", { cx: 0, cy: 64, r: 27, fill: "#fff", stroke: "var(--red)", "stroke-width": 5 });
          const hd = s.el("circle", { cx: 0, cy: 64, r: 8, fill: "var(--red)" });
          handle.append(hc, hd);
          obj.append(bar, guide, nm, handle);
          svg.append(obj);

          const big = s.h("p", { class: "huge mono later", style: { color: UC } }, "0 cm");
          const lifeL = exbox(s, "Im Alltag", [s.h("p", { class: "small" }, "Auch in Metern: 1,42 m = 1 m und 42 cm. Mit Komma braucht man nur eine Einheit.")], "life later", { marginTop: "12px", padding: "10px 18px" });
          const sub = s.h("p", { class: "t later" }, "");
          let len = 0, cur = { n: "Bleistift", c: UC };
          const setLen = v => {
            len = Math.max(2.5, Math.min(15, Math.round(v * 10) / 10));
            const w = len * PX, xe = X0 + w;
            bar.setAttribute("width", w); bar.setAttribute("fill", cur.c);
            nm.setAttribute("x", X0 + (w - 30) / 2); nm.textContent = cur.n;
            guide.setAttribute("x1", xe); guide.setAttribute("x2", xe);
            hc.setAttribute("cx", xe); hd.setAttribute("cx", xe);
            hl.setAttribute("x", X0 + Math.floor(len) * PX); hl.setAttribute("width", (len - Math.floor(len)) * PX);
            const mm = Math.round(len * 10);
            big.textContent = s.fmt(len, 1) + " cm";
            sub.textContent = mm % 10 ? `= ${Math.floor(mm / 10)} cm und ${mm % 10} mm = ${mm} mm` : `= ${mm / 10} cm = ${mm} mm`;
          };
          setLen(2.5);
          let lastMm = 0;
          s.drag(handle, { space: svg, onMove: p => { setLen((p.x - X0) / PX); const m = Math.round(len * 10); if (m !== lastMm) { lastMm = m; s.sfx.tick(); } }, onEnd: () => s.sfx.pop() });
          const ITEMS = [{ n: "Bleistift", L: 7.4, c: UC }, { n: "Radiergummi", L: 4.5, c: "#1d5bd0" }, { n: "Buntstift", L: 13.6, c: "#dc3b2a" }, { n: "Büroklammer", L: 3.2, c: "#7b4fd6" }];
          const glide = async it => { cur = it; s.sfx.whoosh(); await s.tween({ from: len, to: it.L, dur: 700, ease: "out", update: v => setLen(v) }); setLen(it.L); s.sfx.snap(); };
          const btns = s.h("div", { class: "row later", style: { gap: "12px" } }, ITEMS.map(it => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); glide(it); } }, it.n)));
          const hint = s.h("p", { class: "small later pencil" }, "Oder ziehe am roten Kreis – auf den Millimeter genau.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "1 cm = 10 mm, also ist 1 mm = 0,1 cm. ", s.h("br"), "7 cm und 4 mm = ", s.h("b", null, "7,4 cm"), ".");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "430px 1fr", gap: "28px", alignItems: "start" } },
              s.h("div", { class: "stack", style: { gap: "6px" } }, big, sub, lifeL),
              s.h("div", { class: "stack", style: { gap: "12px" } }, btns, hint, merk))));
          s.sfx.whoosh(); s.show(ruler, "left");

          s.step(async () => {
            s.say("Der Bleistift ist 7 Komma 4 Zentimeter lang.");
            s.show(obj, "fade"); s.show(big, "pop"); await glide(ITEMS[0]);
          });
          s.step(async () => { s.say("Das sind 7 Zentimeter und 4 Millimeter."); s.sound("pencil-write"); s.show(hl, "fade"); await s.show(sub, "up"); });
          s.step(async () => { s.sfx.pop(); s.show(btns, "up"); await s.show(hint, "fade", 200); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(lifeL, "up", 200); });
        },
      },
      /* 6 ------------------------------------------------------------------ */
      {
        title: "Brüche als Dezimalzahlen",
        say: "Ein Bruch kann auch als Dezimalzahl geschrieben werden. Das 10-mal-10-Quadrat hilft uns.",
        build(s) {
          const svg = s.svg(440, 440);
          const cells = [];
          for (let c = 0; c < 10; c++) for (let r = 0; r < 10; r++) {
            const rc = s.el("rect", { x: 20 + c * 40, y: 20 + r * 40, width: 40, height: 40, fill: "#fff", stroke: "#9fc2a1", "stroke-width": 1.5 });
            cells.push(rc); svg.append(rc);
          }
          svg.append(s.el("rect", { x: 20, y: 20, width: 400, height: 400, fill: "none", stroke: INK, "stroke-width": 4 }));
          const DATA = [
            { n: 1, d: 10, h: 10, dec: "0,1", life: "1/10 von 1 € = 0,10 € = 10 Cent" },
            { n: 1, d: 2, h: 50, dec: "0,5", life: "½ Liter Milch = 0,5 l" },
            { n: 1, d: 4, h: 25, dec: "0,25", life: "¼ Stunde = 0,25 h = 15 Minuten" },
            { n: 3, d: 4, h: 75, dec: "0,75", life: "¾ kg Mehl = 0,75 kg = 750 g" },
            { n: 1, d: 5, h: 20, dec: "0,2", life: "Ein Fünftel Meter = 0,2 m = 20 cm" },
          ];
          const eq = s.h("div", { class: "big mono", style: { fontSize: "52px", display: "flex", alignItems: "center", gap: "10px", minHeight: "120px" } });
          const life = exbox(s, "Im Alltag", [s.h("p", { class: "t" }, "")], "life");
          const lifeP = life.lastChild;
          let filled = 0;
          const paint = n => cells.forEach((c, i) => c.setAttribute("fill", i < n ? UC : "#fff"));
          const setF = async (k) => {
            const D = DATA[k];
            eq.textContent = "";
            const decEl = s.h("span", { style: { color: UC } }, D.dec);
            eq.append(frac(s, D.n, D.d), "=", frac(s, D.h, 100), "=", decEl);
            lifeP.textContent = D.life;
            s.show(eq, "pop"); s.show(life, "fade");
            let lastN = filled;
            s.sfx.whoosh();
            await s.tween({ from: filled, to: D.h, dur: 300 + Math.abs(D.h - filled) * 12, ease: "linear", update: v => { const n = Math.round(v); if (n !== lastN) { lastN = n; paint(n); if (n % 5 === 0) s.sfx.tick(); } } });
            filled = D.h; paint(filled); s.sfx.ding();
          };
          const btns = s.h("div", { class: "row", style: { gap: "10px" } }, DATA.map((D, k) => s.h("button", { class: "btn", style: { minWidth: "84px" }, onclick: () => { s.sfx.click(); setF(k); } }, `${D.n}/${D.d}`)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Erweitere den Bruch auf Zehntel oder Hundertstel – dann kannst du die Dezimalzahl ablesen.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "440px 1fr", gap: "36px", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack", style: { gap: "18px" } }, eq, life, btns, merk)));
          s.show(svg, "zoom"); s.sfx.pop();
          setF(0);
          [1, 2, 3, 4].forEach(k => s.step(async () => { s.say(DATA[k].life.replace("½", "ein halber").replace("¼", "eine Viertel").replace("¾", "drei viertel")); await setF(k); }));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 7 ------------------------------------------------------------------ */
      {
        title: "Prozent heißt „von Hundert“",
        say: "Prozent ist noch eine Schreibweise für Brüche. Prozent heißt: von hundert.",
        build(s) {
          const svg = s.svg(1100, 150);
          svg.append(s.el("rect", { x: 50, y: 24, width: 1000, height: 76, rx: 10, fill: "#fff", stroke: INK, "stroke-width": 3 }));
          const fill = s.el("rect", { x: 50, y: 24, width: 0, height: 76, rx: 10, fill: UC });
          svg.append(fill);
          for (let i = 1; i < 100; i++) svg.append(s.el("line", { x1: 50 + i * 10, y1: 24, x2: 50 + i * 10, y2: 100, stroke: i % 10 ? "#c8d3de" : "#7d8a9c", "stroke-width": i % 10 ? 1 : 2, opacity: .8 }));
          svg.append(s.el("rect", { x: 50, y: 24, width: 1000, height: 76, rx: 10, fill: "none", stroke: INK, "stroke-width": 4 }));
          [0, 10, 25, 50, 75, 100].forEach(p => {
            svg.append(s.el("line", { x1: 50 + p * 10, y1: 100, x2: 50 + p * 10, y2: 112, stroke: INK, "stroke-width": 3 }));
            svg.append(tx(s, 50 + p * 10, 138, p + " %", { "font-size": 20, "font-weight": 700 }));
          });
          const inLbl = s.el("text", { x: 60, y: 74, "font-size": 30, "font-weight": 800, fill: "#fff", "text-anchor": "end", style: DISP, text: "" });
          svg.append(inLbl);

          const valBox = (cap) => {
            const v = s.h("div", { class: "mono", style: { fontSize: "56px", fontWeight: 800, fontFamily: "var(--f-display)", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center" } }, "0");
            const c = s.h("div", { class: "card soft", style: { textAlign: "center", padding: "10px 18px", minWidth: "230px" } }, v, s.h("p", { class: "small pencil" }, cap));
            return { c, v };
          };
          const P = valBox("Prozent"), B = valBox("Bruch"), D = valBox("Dezimalzahl");
          const eqs = () => s.h("span", { class: "huge" }, "=");
          const row = s.h("div", { class: "row", style: { justifyContent: "center", gap: "22px", flexWrap: "nowrap" } }, P.c, eqs(), B.c, eqs(), D.c);
          let p = 0;
          const render = v => {
            p = v;
            fill.setAttribute("width", v * 10);
            inLbl.textContent = v >= 12 ? v + " %" : ""; inLbl.setAttribute("x", 40 + v * 10);
            P.v.textContent = v + " %";
            B.v.textContent = "";
            if (v === 0) B.v.textContent = "0"; else if (v === 100) B.v.textContent = "1"; else { const g = gcd(v, 100); B.v.append(frac(s, v / g, 100 / g)); }
            D.v.textContent = v === 100 ? "1" : v === 0 ? "0" : s.fmt(v / 100, v % 10 === 0 ? 1 : 2);
          };
          render(0);
          const go = async to => {
            let last = p;
            s.sfx.whoosh();
            await s.tween({ from: p, to, dur: 900, ease: "out", update: x => { const n = Math.round(x); if (n !== last) { last = n; render(n); if (n % 5 === 0) s.sfx.tick(); } } });
            render(to); s.sfx.ding(); s.show(row, "pop");
          };
          const sl = s.slider({ label: "Selbst ausprobieren", min: 0, max: 100, value: 100, fmt: v => v + " %", onInput: v => render(v) });
          const slw = s.h("div", { class: "card later", style: { padding: "12px 22px" } }, sl);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "1 % = 1/100 = 0,01"), ". 50 % ist die Hälfte, 100 % ist das Ganze.");
          s.add(s.h("div", { class: "stack", style: { gap: "20px", height: "100%", justifyContent: "center" } }, svg, row, s.h("div", { class: "cols", style: { alignItems: "center" } }, slw, merk)));
          s.show(svg, "left"); s.sfx.pop();

          s.step(async () => { s.say("50 Prozent sind 50 von 100. Das ist die Hälfte: ein halb, oder 0 Komma 5."); await go(50); });
          s.step(async () => { s.say("25 Prozent sind ein Viertel: 0 Komma 25."); await go(25); });
          s.step(async () => { s.say("10 Prozent sind ein Zehntel: 0 Komma 1."); await go(10); });
          s.step(async () => { s.say("100 Prozent sind alles – das Ganze."); await go(100); s.sfx.fanfare(); });
          s.step(async () => { s.sfx.pop(); s.show(slw, "up"); await s.show(merk, "up", 200); });
        },
      },
      /* 8 ------------------------------------------------------------------ */
      {
        title: "Prozent im Alltag",
        say: "Prozent findest du auf dem Handy, im Laden und sogar auf der Schokolade.",
        build(s) {
          // battery
          const b = s.svg(300, 170);
          b.append(s.el("rect", { x: 30, y: 36, width: 220, height: 104, rx: 18, fill: "#fff", stroke: INK, "stroke-width": 6 }),
            s.el("rect", { x: 252, y: 66, width: 18, height: 44, rx: 5, fill: INK }));
          const bf = s.el("rect", { x: 40, y: 46, width: 0, height: 84, rx: 10, fill: "#2fb34a" });
          const bt = s.el("text", { x: 140, y: 102, "text-anchor": "middle", "font-size": 40, "font-weight": 800, fill: INK, style: DISP, text: "0 %" });
          b.append(bf, bt);
          const c1 = exbox(s, "Handy-Akku", [b, s.h("p", { class: "t" }, s.h("b", null, "73 % = 0,73")), s.h("p", { class: "small" }, "73 von 100 Teilen sind noch voll geladen.")], "ex later");
          // sale
          const sv = s.svg(300, 170);
          const star = [];
          for (let i = 0; i < 24; i++) { const r = i % 2 ? 56 : 74, a = i * Math.PI / 12; star.push(`${84 + r * Math.cos(a)},${86 + r * Math.sin(a)}`); }
          const starG = fc(s.el("g"));
          starG.append(s.el("polygon", { points: star.join(" "), fill: "var(--red)" }), tx(s, 84, 98, "−25 %", { "font-size": 30, "font-weight": 800, fill: "#fff", style: DISP }));
          const old = tx(s, 232, 70, "40,00 €", { "font-size": 30, "font-weight": 700, fill: "#5d6678" });
          const strike = L(s.el("line", { x1: 180, y1: 60, x2: 292, y2: 60, stroke: "var(--red)", "stroke-width": 5, "stroke-linecap": "round" }));
          const neu = L(fc(tx(s, 230, 132, "30,00 €", { "font-size": 32, "font-weight": 800, fill: UC, style: DISP })));
          sv.append(starG, old, strike, neu);
          const c2 = exbox(s, "Angebot", [sv, s.h("p", { class: "t" }, s.h("b", null, "25 % = ¼")), s.h("p", { class: "small" }, "Ein Viertel von 40 € sind 10 € – du zahlst nur noch 30 €.")], "ex later");
          // chocolate
          const cv = s.svg(300, 170);
          cv.append(s.el("rect", { x: 20, y: 20, width: 260, height: 130, rx: 8, fill: "#e9d8c4", stroke: "#5a3a1e", "stroke-width": 4 }));
          const pieces = [];
          for (let i = 0; i < 10; i++) {
            const c = i % 5, r = Math.floor(i / 5);
            const pc = s.el("rect", { x: 30 + c * 50, y: 30 + r * 58, width: 42, height: 50, rx: 5, fill: "#d9b48f", stroke: "#5a3a1e", "stroke-width": 2 });
            pieces.push(pc); cv.append(pc);
          }
          const c3 = exbox(s, "Schokolade", [cv, s.h("p", { class: "t" }, s.h("b", null, "70 % Kakao = 0,7")), s.h("p", { class: "small" }, "In 100 g dieser Schokolade stecken 70 g Kakao.")], "ex later");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Prozent = Hundertstel. ", s.h("b", null, "73 % = 73/100 = 0,73"), ". So kann man Anteile leicht vergleichen.");
          s.add(s.h("div", { class: "stack", style: { gap: "18px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols3" }, c1, c2, c3), merk));
          s.sfx.whoosh();

          s.step(async () => {
            s.say("Dein Handy zeigt 73 Prozent. Das sind 73 von 100 Teilen.");
            s.show(c1, "up"); s.sfx.zap();
            await s.tween({ from: 0, to: 73, dur: 1400, ease: "out", update: v => { bf.setAttribute("width", 200 * v / 100); bt.textContent = Math.round(v) + " %"; } });
            s.sfx.ding();
          });
          s.step(async () => {
            s.say("Minus 25 Prozent: Ein Viertel vom Preis fällt weg.");
            s.sfx.pop(); await s.show(c2, "up"); s.show(starG, "pop"); s.sfx.boing(); await s.wait(400);
            s.sfx.scribble(); await s.show(strike, "draw"); s.sound("cash-register", { vol: .6 }); await s.show(neu, "pop");
          });
          s.step(async () => {
            s.say("70 Prozent Kakao: 7 von 10 Stücken sind Kakao.");
            s.sfx.pop(); await s.show(c3, "up");
            for (let i = 0; i < 7; i++) { pieces[i].setAttribute("fill", "#5a3a1e"); s.sfx.count(i); s.show(fc(pieces[i]), "pop"); await s.wait(140); }
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 9 ------------------------------------------------------------------ */
      {
        title: "0,5 oder 0,45 – was ist mehr?",
        say: "Tim sagt: 0 Komma 45 ist mehr als 0 Komma 5, weil 45 größer ist als 5. Stimmt das?",
        build(s) {
          const stamp = s.h("span", { class: "later", style: { display: "inline-block", border: "4px solid var(--red)", color: "var(--red)", font: "800 26px/1 var(--f-display)", padding: "8px 14px", borderRadius: "10px", transform: "rotate(-6deg)", whiteSpace: "nowrap" } }, "Falle!");
          const bubble = s.h("div", { class: "card", style: { display: "flex", alignItems: "center", gap: "18px", padding: "14px 22px" } },
            s.h("span", { style: { fontSize: "44px" } }, "🧒"),
            s.h("p", { class: "t", style: { flex: 1 } }, "Tim: „", s.h("b", null, "0,45"), " ist mehr als ", s.h("b", null, "0,5"), " – denn 45 ist größer als 5!“"), stamp);
          // grids
          const gs = s.svg(460, 262);
          const mkGrid = (ox) => { const arr = []; for (let c = 0; c < 10; c++) for (let r = 0; r < 10; r++) { const q = s.el("rect", { x: ox + c * 18, y: 10 + r * 18, width: 18, height: 18, fill: "#fff", stroke: "#9fc2a1", "stroke-width": 1 }); arr.push(q); gs.append(q); } gs.append(s.el("rect", { x: ox, y: 10, width: 180, height: 180, fill: "none", stroke: INK, "stroke-width": 3 })); return arr; };
          const gA = mkGrid(20), gB = mkGrid(260);
          const la = L(fc(tx(s, 110, 226, "0,5", { "font-size": 32, "font-weight": 800, fill: UC, style: DISP })));
          const la2 = L(fc(tx(s, 110, 252, "50 Hundertstel", { "font-size": 20 })));
          const lb = L(fc(tx(s, 350, 226, "0,45", { "font-size": 32, "font-weight": 800, fill: "var(--orange)", style: DISP })));
          const lb2 = L(fc(tx(s, 350, 252, "45 Hundertstel", { "font-size": 20 })));
          gs.append(la, la2, lb, lb2);
          // place-value comparison
          const cs = s.svg(420, 262);
          const COL = [{ k: "E", x: 40 }, { k: ",", x: 100 }, { k: "z", x: 140 }, { k: "h", x: 200 }];
          const zHl = L(s.el("rect", { x: 140, y: 54, width: 60, height: 120, fill: "var(--yellow)", "fill-opacity": .7 }));
          cs.append(zHl);
          COL.forEach(c => { if (c.k !== ",") cs.append(tx(s, c.x + 30, 40, c.k, { "font-size": 26, "font-weight": 800, fill: c.k === "E" ? "var(--blue)" : UC })); });
          cs.append(s.el("line", { x1: 30, y1: 52, x2: 270, y2: 52, stroke: INK, "stroke-width": 3 }));
          const row = (y, dgs, col) => dgs.map((d, i) => d == null ? null : tx(s, [70, 112, 170, 230][i], y, d, { "font-size": 44, "font-weight": 800, fill: col, style: DISP }));
          const r1 = row(104, ["0", ",", "5", null], UC), r2 = row(162, ["0", ",", "4", "5"], "var(--orange)");
          [...r1, ...r2].filter(Boolean).forEach(t => cs.append(t));
          const zero = L(fc(tx(s, 230, 104, "0", { "font-size": 44, "font-weight": 800, fill: "var(--red)", style: DISP })));
          cs.append(zero);
          const gt = L(fc(tx(s, 340, 140, "5 > 4", { "font-size": 34, "font-weight": 800, fill: "var(--red)", style: DISP })));
          const gtl = L(fc(tx(s, 340, 176, "Zehntel", { "font-size": 22 })));
          const res = L(fc(tx(s, 150, 230, "0,50 > 0,45", { "font-size": 34, "font-weight": 800, fill: UC, style: DISP })));
          cs.append(gt, gtl, res);
          const csWrap = s.h("div", { class: "later" }, cs);
          const life = exbox(s, "Im Alltag", [s.h("p", { class: "small" }, "0,50 € = 50 Cent ist mehr als 0,45 € = 45 Cent.")], "life later", { padding: "10px 18px" });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px", padding: "10px 18px 12px" } }, "Vergleiche Stelle für Stelle von links. Hänge Nullen an: 0,5 = 0,50.");
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, bubble,
            s.h("div", { class: "row", style: { justifyContent: "space-around", flexWrap: "nowrap" } }, gs, csWrap),
            s.h("div", { class: "cols", style: { gap: "20px" } }, life, merk)));
          s.show(bubble, "left"); s.sfx.pop();

          const fillG = async (arr, n) => { for (let i = 0; i < n; i++) { arr[i].setAttribute("fill", arr === gA ? UC : "var(--orange)"); if (i % 5 === 4) { s.sfx.tick(); await s.wait(25); } } };
          s.step(async () => {
            s.say("Wir malen beide Zahlen in ein Hunderter-Quadrat.");
            await fillG(gA, 50); s.sfx.pop(); s.show([la, la2], "pop");
            await fillG(gB, 45); s.sfx.pop(); await s.show([lb, lb2], "pop");
          });
          s.step(async () => { s.say("Das grüne Quadrat ist voller. Also ist 0 Komma 5 mehr!"); s.sfx.error(); s.show(stamp, "zoom"); bubble.classList.remove("a-shake"); void bubble.offsetWidth; bubble.classList.add("a-shake"); await s.wait(500); });
          s.step(async () => {
            s.say("Trick: Hänge eine Null an. 0 Komma 5 ist dasselbe wie 0 Komma 50.");
            s.sfx.whoosh(); await s.show(csWrap, "fade"); s.sfx.pop(); await s.show(zero, "pop");
            s.sfx.snap(); s.show(zHl, "fade"); s.show([gt, gtl], "pop", 200); await s.wait(400); s.sfx.ding(); await s.show(res, "pop");
          });
          s.step(async () => { s.sound("coins", { vol: .7 }); s.show(life, "up"); await s.show(merk, "up", 200); });
        },
      },
      /* 10 ----------------------------------------------------------------- */
      {
        title: "Ordnen: Wer ist am schnellsten?",
        say: "WM 2009 in Berlin, 100-Meter-Finale. Wer gewinnt? Die kleinste Zeit!",
        build(s) {
          const RUN = [{ n: "Usain Bolt", t: 9.58, c: "#e0b000" }, { n: "Tyson Gay", t: 9.71, c: "#1d5bd0" }, { n: "Asafa Powell", t: 9.84, c: "#138a5a" }];
          const { canvas, g } = s.canvas(1100, 204);
          const X0 = 170, X1 = 990;
          const done = [false, false, false];
          const draw = t => {
            g.clearRect(0, 0, 1100, 204);
            g.fillStyle = "#c9573a"; g.fillRect(150, 6, 950, 192);
            g.strokeStyle = "#fff"; g.lineWidth = 3;
            for (let i = 0; i <= 3; i++) { g.beginPath(); g.moveTo(150, 6 + i * 64); g.lineTo(1100, 6 + i * 64); g.stroke(); }
            g.lineWidth = 4; g.beginPath(); g.moveTo(X0, 6); g.lineTo(X0, 198); g.stroke();
            for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? "#fff" : "#1b2740"; g.fillRect(X1, 6 + k * 16, 8, 16); }
            RUN.forEach((r, i) => {
              const cy = 38 + i * 64;
              g.fillStyle = "#1b2740"; g.font = "700 19px Atkinson Hyperlegible, sans-serif"; g.textAlign = "left"; g.textBaseline = "middle";
              g.fillText(r.n, 4, cy);
              const u = Math.min(1, t / r.t), x = X0 + (X1 - X0) * Math.pow(u, 1.12);
              const ph = u < 1 ? Math.sin(t * 22 + i) : 0;
              g.strokeStyle = r.c; g.lineWidth = 6; g.lineCap = "round";
              g.beginPath(); g.moveTo(x, cy + 2); g.lineTo(x - 10 + ph * 8, cy + 22); g.moveTo(x, cy + 2); g.lineTo(x + 8 - ph * 8, cy + 22); g.stroke();
              g.fillStyle = r.c; g.beginPath(); g.arc(x, cy - 10, 14, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#fff"; g.lineWidth = 3; g.stroke();
              if (u >= 1) { g.fillStyle = "#fff"; g.font = "800 22px Bricolage Grotesque, sans-serif"; g.textAlign = "left"; g.fillText(s.fmt(r.t, 2) + " s", X1 + 16, cy); }
            });
          };
          draw(0);
          const clock = s.h("span", { class: "big mono" }, "0,00 s");
          let running = false;
          const race = () => new Promise(res => {
            if (s.fast) { draw(99); clock.textContent = "9,84 s"; return res(); }
            if (running) return res();
            running = true; done.fill(false); s.sound("startschuss", { vol: .6 });
            s.loop(t => {
              draw(t); clock.textContent = s.fmt(Math.min(t, 9.84), 2) + " s";
              RUN.forEach((r, i) => { if (!done[i] && t >= r.t) { done[i] = true; s.sfx.count(7 - i * 2); } });
              if (t > 10.1) { running = false; s.sound("crowd-cheer", { vol: .55, dur: 3 }); res(); return false; }
            });
          });
          const startBtn = s.h("button", { class: "btn solid later", onclick: () => { s.sfx.click(); race(); } }, "Startschuss! 🏁");
          const ctrl = s.h("div", { class: "row", style: { gap: "24px" } }, s.h("span", { class: "t" }, "Stoppuhr:"), clock, startBtn);
          const rank = exbox(s, "WM-Finale Berlin 2009 · 100 m", [
            s.h("p", { class: "t mono" }, "🥇 9,58 s  ", s.h("b", null, "Bolt")), s.h("p", { class: "t mono" }, "🥈 9,71 s  ", s.h("b", null, "Gay")), s.h("p", { class: "t mono" }, "🥉 9,84 s  ", s.h("b", null, "Powell")),
            s.h("p", { class: "small", style: { color: "var(--red)", marginTop: "4px" } }, "9,58 < 9,71 < 9,84 – die kleinste Zeit gewinnt!")], "ex later");
          const sp1 = s.h("p", { class: "t mono" }, "Lena 8,4 s · Tim 8,04 s · Ali 8,45 s");
          const sp2 = s.h("p", { class: "t mono later" }, "Mit Nullen: 8,", s.h("b", { class: "red" }, "40"), " · 8,04 · 8,45");
          const sp3 = s.h("p", { class: "t later" }, s.h("b", null, "8,04 < 8,40 < 8,45"), " → Tim gewinnt!");
          const sport = exbox(s, "Sportfest Klasse 5 · 50 m", [sp1, sp2, sp3, s.h("p", { class: "small later", style: { color: "var(--green)" } }, "Gleich lang machen, dann Stelle für Stelle vergleichen.")], "ex later");
          const merkR = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Beim Laufen gewinnt die ", s.h("b", null, "kleinste"), " Zeit. Beim Weitsprung gewinnt die ", s.h("b", null, "größte"), " Weite (z. B. 3,85 m vor 3,8 m).");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, canvas, ctrl, s.h("div", { class: "cols", style: { gap: "22px" } }, rank, sport), merkR));
          s.sfx.whoosh();

          s.step(async () => { s.say("Auf die Plätze, fertig, los!"); await race(); s.show(startBtn, "pop"); s.sfx.pop(); await s.show(rank, "up"); });
          s.step(async () => { s.say("Beim Sportfest: Lena 8 Komma 4, Tim 8 Komma 0 4, Ali 8 Komma 45 Sekunden."); s.sfx.pop(); await s.show(sport, "up"); });
          s.step(async () => {
            s.say("Mit Nullen auffüllen, dann vergleichen. Tim ist am schnellsten.");
            s.sound("pencil-write"); await s.show(sp2, "left"); s.sfx.ding(); await s.show(sp3, "left"); s.show(sport.lastChild, "fade"); s.confetti(840, 600, 60); await s.show(merkR, "up", 300);
          });
        },
      },
      /* 11 ----------------------------------------------------------------- */
      {
        title: "Runden: Auf oder ab?",
        say: "Runden heißt: Wir suchen die nächste einfache Zahl. Schau, wohin die Zahl rollt.",
        build(s) {
          const X0 = 60, X1 = 1040;
          const xOf = h => X0 + (X1 - X0) * (h - 200) / 100; // h = hundredths
          const svg = s.svg(1100, 200);
          svg.append(s.el("line", { x1: 40, y1: 110, x2: 1060, y2: 110, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }));
          for (let h = 200; h <= 300; h++) {
            const x = xOf(h), maj = h % 10 === 0;
            svg.append(s.el("line", { x1: x, y1: 110 - (maj ? 14 : 6), x2: x, y2: 110 + (maj ? 14 : 6), stroke: INK, "stroke-width": maj ? 3 : 1.4 }));
            if (maj) svg.append(tx(s, x, 148, trim(s.fmt(h / 100, 1)), { "font-size": 21, "font-weight": 700, fill: h % 100 ? INK : "var(--orange)" }));
          }
          const arT = L(s.el("path", { d: "", fill: "none", stroke: UC, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }));
          const arG = L(s.el("path", { d: "", fill: "none", stroke: "var(--orange)", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }));
          const dotT = L(s.el("circle", { cx: 0, cy: 110, r: 11, fill: UC, stroke: "#fff", "stroke-width": 3 }));
          const dotG = L(s.el("circle", { cx: 0, cy: 182, r: 11, fill: "var(--orange)", stroke: "#fff", "stroke-width": 3 }));
          const flagW = s.el("g"), flag = s.el("g");
          flagW.append(flag);
          const fRect = s.el("rect", { x: -52, y: 8, width: 104, height: 46, rx: 10, fill: "var(--red)" });
          const fTxt = tx(s, 0, 42, "", { "font-size": 30, "font-weight": 800, fill: "#fff", style: DISP });
          const fLine = s.el("line", { x1: 0, y1: 54, x2: 0, y2: 104, stroke: "var(--red)", "stroke-width": 4 });
          const ball = s.el("circle", { cx: 0, cy: 110, r: 10, fill: "var(--red)" });
          flag.append(fLine, fRect, fTxt, ball);
          svg.append(arT, arG, dotT, dotG, flagW);

          const rT = s.h("p", { class: "t later" }), rG = s.h("p", { class: "t later" });
          let v = 246;
          const render = () => {
            const x = xOf(v);
            flag.setAttribute("transform", `translate(${Math.max(56, Math.min(1044, x))} 0)`);
            fLine.setAttribute("x1", x - Math.max(56, Math.min(1044, x))); fLine.setAttribute("x2", x - Math.max(56, Math.min(1044, x)));
            ball.setAttribute("cx", x - Math.max(56, Math.min(1044, x)));
            const str = s.fmt(v / 100, 2); fTxt.textContent = str;
            const t10 = Math.round(v / 10) * 10, t1 = Math.round(v / 100) * 100;
            const xt = xOf(t10), xg = xOf(t1);
            arT.setAttribute("d", `M${x} 110 L${xt} 110` + (Math.abs(xt - x) > 4 ? " " + head(xt, 110, xt > x ? 0 : Math.PI, 12) : ""));
            dotT.setAttribute("cx", xt); dotG.setAttribute("cx", xg);
            arG.setAttribute("d", `M${x} 120 L${x} 182 L${xg} 182`);
            const d1 = str[str.length - 1], d0 = str[str.length - 2];
            rT.textContent = ""; rT.append("Auf Zehntel: ", str.slice(0, -1), s.h("b", { class: "red" }, d1), " ≈ ", s.h("b", { style: { color: UC } }, s.fmt(t10 / 100, 1)), Number(d1) >= 5 ? "  (aufrunden)" : "  (abrunden)");
            rG.textContent = ""; rG.append("Auf Ganze: ", str.slice(0, 2), s.h("b", { class: "red" }, d0), d1, " ≈ ", s.h("b", { class: "orange" }, String(t1 / 100)), Number(d0) >= 5 ? "  (aufrunden)" : "  (abrunden)");
          };
          render();
          const sl = s.slider({ label: "Zahl verschieben", min: 200, max: 300, value: 246, fmt: x => s.fmt(x / 100, 2), onInput: x => { v = x; render(); } });
          const slw = s.h("div", { class: "card later", style: { padding: "10px 22px" } }, sl);
          const rule = s.h("div", { class: "merk later", style: { fontSize: "21px", padding: "10px 18px 12px" } }, "Schau auf die Ziffer ", s.h("b", null, "danach"), ": 0, 1, 2, 3, 4 → abrunden. 5, 6, 7, 8, 9 → aufrunden.");
          const chips = s.h("div", { class: "row later", style: { gap: "12px", justifyContent: "center" } },
            ["⏱️ 9,58 s ≈ 9,6 s", "📏 1,42 m ≈ 1,4 m", "🏷️ 2,49 € ≈ 2,50 €", "🌡️ 18,7 °C ≈ 19 °C"].map(t => s.h("span", { class: "chip", style: { fontSize: "21px", padding: "10px 16px" } }, t)));
          s.add(s.h("div", { class: "stack", style: { gap: "14px", height: "100%", justifyContent: "center" } }, svg,
            s.h("div", { class: "cols", style: { gap: "22px", alignItems: "start" } }, s.h("div", { class: "card stack", style: { gap: "8px", padding: "12px 20px" } }, rT, rG), s.h("div", { class: "stack", style: { gap: "12px" } }, rule, slw)),
            chips));
          s.sfx.whoosh(); s.show(flagW, "down");

          s.step(async () => { s.say("Auf Zehntel runden: Die 6 ist 5 oder mehr – also aufrunden auf 2 Komma 5."); s.sfx.whoosh(); s.show(arT, "draw"); await s.wait(400); s.sfx.ding(); s.show(dotT, "pop"); await s.show(rT, "left"); });
          s.step(async () => { s.say("Auf Ganze runden: Die 4 ist kleiner als 5 – also abrunden auf 2."); s.sfx.whoosh(); s.show(arG, "draw"); await s.wait(400); s.sfx.ding(); s.show(dotG, "pop"); await s.show(rG, "left"); });
          s.step(async () => { s.sfx.pop(); s.show(rule, "up"); await s.show(slw, "up", 200); s.say("Verschiebe die Zahl und schau, wohin sie rollt."); });
          s.step(async () => { s.say("Runden brauchst du überall: bei Zeiten, Größen, Preisen und Temperaturen."); s.sfx.success(); await s.show(chips, "up"); });
        },
      },
      /* 12 ----------------------------------------------------------------- */
      {
        title: "Addieren: Komma unter Komma!",
        say: "Beim Addieren mit Komma gibt es eine wichtige Regel. Schau, was hier falsch läuft.",
        build(s) {
          const CW = 58, OX = 30;
          const cx = c => OX + c * CW + CW / 2; // columns: 0 sign | 1 Z | 2 E | 3 , | 4 z | 5 h
          const svg = s.svg(420, 380);
          for (let c = 1; c <= 5; c++) for (let r = 0; r < 4; r++) svg.append(s.el("rect", { x: OX + c * CW, y: 30 + r * CW, width: CW, height: CW, fill: "#fff", stroke: "#d5e4ee", "stroke-width": 1.5 }));
          const band = L(s.el("rect", { x: OX + 3 * CW + 8, y: 24, width: CW - 16, height: 246, rx: 12, fill: UC, "fill-opacity": .22 }));
          svg.append(band);
          const D = (c, y, t, o = {}) => tx(s, cx(c), y, t, Object.assign({ "font-size": 42, "font-weight": 700, style: MONO }, o));
          const row1 = s.el("g", { transform: `translate(${CW} 0)` });
          const r1 = [D(1, 74, "1"), D(2, 74, "2"), D(3, 74, ","), D(4, 74, "5")];
          const zero = L(fc(D(5, 74, "0", { fill: "var(--red)" })));
          row1.append(...r1, zero);
          const row2 = [D(0, 132, "+"), D(2, 132, "3"), D(3, 132, ","), D(4, 132, "7"), D(5, 132, "5")];
          svg.append(row1, ...row2);
          svg.append(s.el("line", { x1: OX + 6, y1: 150 + 10, x2: OX + 6 * CW, y2: 150 + 10, stroke: INK, "stroke-width": 4 }));
          const carry = L(fc(tx(s, cx(2) + 16, 154, "1", { "font-size": 22, "font-weight": 700, fill: "var(--red)" })));
          svg.append(carry);
          const res = [D(1, 210, "1", { fill: UC }), D(2, 210, "6", { fill: UC }), D(3, 210, ",", { fill: UC }), D(4, 210, "2", { fill: UC }), D(5, 210, "5", { fill: UC })].map(t => L(fc(t)));
          svg.append(...res);
          const bad1 = L(s.el("circle", { cx: cx(4), cy: 66, r: 20, fill: "none", stroke: "var(--red)", "stroke-width": 4 }));
          const bad2 = L(s.el("circle", { cx: cx(3), cy: 124, r: 20, fill: "none", stroke: "var(--red)", "stroke-width": 4 }));
          svg.append(bad1, bad2);
          const euro = L(fc(tx(s, 210, 330, "16,25 €", { "font-size": 40, "font-weight": 800, fill: UC, style: DISP })));
          svg.append(euro);

          const intro = s.h("p", { class: "t" }, "Pizza ", s.h("b", null, "12,5 €"), " + Getränk ", s.h("b", null, "3,75 €"), " – zusammen?");
          const warn = s.h("p", { class: "t later red" }, "✗ So nicht! Die Kommas stehen nicht untereinander.");
          const rules = [
            s.h("p", { class: "t later" }, s.h("b", { class: "chip" }, "1"), "  Komma unter Komma schreiben."),
            s.h("p", { class: "t later" }, s.h("b", { class: "chip" }, "2"), "  Leere Stellen mit 0 auffüllen."),
            s.h("p", { class: "t later" }, s.h("b", { class: "chip" }, "3"), "  Rechnen wie immer – das Komma rutscht nach unten."),
          ];
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Komma unter Komma! Dann stehen Einer unter Einern, Zehntel unter Zehnteln.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "420px 1fr", gap: "36px", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack", style: { gap: "14px" } }, intro, warn, ...rules, merk)));
          s.show(svg, "fade"); s.sound("pencil-write");

          s.step(async () => { s.say("Die Zahlen sind rechtsbündig geschrieben. Die Kommas stehen nicht untereinander!"); s.sfx.error(); s.show([bad1, bad2], "draw"); await s.show(warn, "left"); });
          s.step(async () => {
            s.say("Also: Komma unter Komma.");
            s.hide([bad1, bad2]); s.sfx.whoosh();
            await s.tween({ from: CW, to: 0, dur: 700, ease: "back", update: x => row1.setAttribute("transform", `translate(${x} 0)`) });
            s.sfx.snap(); s.show(band, "fade"); warn.textContent = "✓ Jetzt stehen die Kommas untereinander."; warn.classList.replace("red", "green"); s.show(warn, "pop"); await s.show(rules[0], "left");
          });
          s.step(async () => { s.say("Die leere Stelle füllen wir mit einer Null: 12 Komma 50."); s.sfx.pop(); await s.show(zero, "pop"); await s.show(rules[1], "left"); });
          s.step(async () => {
            s.say("Jetzt rechnen wir von rechts: 0 plus 5 ist 5. 5 plus 7 ist 12 – schreibe 2, merke 1. Komma runter. 2 plus 3 plus 1 ist 6. Dann die 1.");
            const order = [4, 3, 2, 1, 0];
            for (const [j, i] of order.entries()) {
              if (i === 1) { s.sfx.pop(); s.show(carry, "pop"); await s.wait(250); }
              s.sfx.count(j * 2); await s.show(res[i], i === 2 ? "down" : "pop"); await s.wait(150);
            }
            s.sound("cash-register", { vol: .6 }); s.show(euro, "pop"); await s.show(rules[2], "left");
          });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 13 ----------------------------------------------------------------- */
      {
        title: "Subtrahieren: Nullen auffüllen",
        say: "Du hast 5 Euro Taschengeld. Ein Comic kostet 2 Euro 35. Wie viel bleibt übrig?",
        build(s) {
          const CW = 58, OX = 40;
          const cx = c => OX + c * CW + CW / 2; // 0 sign | 1 E | 2 , | 3 z | 4 h
          const svg = s.svg(380, 330);
          for (let c = 1; c <= 4; c++) for (let r = 0; r < 4; r++) svg.append(s.el("rect", { x: OX + c * CW, y: 30 + r * CW, width: CW, height: CW, fill: "#fff", stroke: "#d5e4ee", "stroke-width": 1.5 }));
          const D = (c, y, t, o = {}) => tx(s, cx(c), y, t, Object.assign({ "font-size": 42, "font-weight": 700, style: MONO }, o));
          const add = [D(2, 74, ",", { fill: "var(--red)" }), D(3, 74, "0", { fill: "var(--red)" }), D(4, 74, "0", { fill: "var(--red)" })].map(t => L(fc(t)));
          svg.append(D(1, 74, "5"), ...add, D(0, 132, "−"), D(1, 132, "2"), D(2, 132, ","), D(3, 132, "3"), D(4, 132, "5"));
          svg.append(s.el("line", { x1: OX + 6, y1: 160, x2: OX + 5 * CW, y2: 160, stroke: INK, "stroke-width": 4 }));
          const c1 = L(fc(tx(s, cx(3) + 16, 154, "1", { "font-size": 22, "font-weight": 700, fill: "var(--red)" })));
          const c2 = L(fc(tx(s, cx(1) + 16, 154, "1", { "font-size": 22, "font-weight": 700, fill: "var(--red)" })));
          svg.append(c1, c2);
          const res = [D(1, 210, "2", { fill: UC }), D(2, 210, ",", { fill: UC }), D(3, 210, "6", { fill: UC }), D(4, 210, "5", { fill: UC })].map(t => L(fc(t)));
          svg.append(...res);
          const euro = L(fc(tx(s, 190, 300, "2,65 € bleiben", { "font-size": 34, "font-weight": 800, fill: UC, style: DISP })));
          svg.append(euro);

          const intro = s.h("p", { class: "t" }, "Taschengeld ", s.h("b", null, "5 €"), " − Comic ", s.h("b", null, "2,35 €"));
          const tip = s.h("p", { class: "t later" }, "5 € ist dasselbe wie ", s.h("b", { class: "red" }, "5,00 €"), " – jetzt passt Komma unter Komma.");
          const ex1 = exbox(s, "Fahrradtour", [s.h("p", { class: "t mono" }, "23,5 km − 17,8 km = ", s.h("b", null, "5,7 km")), s.h("p", { class: "small" }, "So weit ist es noch bis zum Ziel.")], "ex later", { padding: "10px 18px" });
          const ex2 = exbox(s, "Wachsen", [s.h("p", { class: "t mono" }, "1,42 m − 1,36 m = ", s.h("b", null, "0,06 m")), s.h("p", { class: "small" }, "In einem Jahr 6 cm gewachsen!")], "ex later", { padding: "10px 18px" });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "40px", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack", style: { gap: "14px" } }, intro, tip, ex1, ex2)));
          s.show(svg, "fade"); s.sound("pencil-write");

          s.step(async () => { s.say("5 Euro schreiben wir als 5 Komma 00. Dann steht Komma unter Komma."); for (const t of add) { s.sfx.pop(); await s.show(t, "pop"); } await s.show(tip, "left"); });
          s.step(async () => {
            s.say("Jetzt rechnen wie gewohnt, von rechts nach links, mit Übertrag.");
            const seq = [[3, c1], [2, null], [1, null], [0, c2]];
            for (const [j, [i, cc]] of seq.entries()) { s.sfx.count(j * 2); await s.show(res[i], i === 1 ? "down" : "pop"); if (cc) { s.sfx.tick(); await s.show(cc, "pop"); } }
            s.sound("coins", { vol: .7 }); await s.show(euro, "pop");
          });
          s.step(async () => { s.say("Auf der Fahrradtour: noch 5 Komma 7 Kilometer."); s.sound("bike-bell", { vol: .6 }); await s.show(ex1, "up"); });
          s.step(async () => { s.say("Du bist 6 Zentimeter gewachsen!"); s.sfx.boing(); await s.show(ex2, "up"); });
        },
      },
      /* 14 ----------------------------------------------------------------- */
      {
        title: "Der Kassenzettel",
        say: "Nach dem Einkauf bekommst du einen Kassenzettel. Da stehen lauter Dezimalzahlen – Komma unter Komma!",
        build(s) {
          const svg = s.svg(380, 540);
          let zz = "M20 14 H360 V506";
          for (let x = 360; x > 20; x -= 20) zz += ` L${x - 10} 520 L${x - 20} 506`;
          svg.append(s.el("path", { d: zz + " Z", fill: "#fff", stroke: "#b9c4d0", "stroke-width": 2 }));
          const T = (x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "font-size": 22, fill: INK, style: MONO, text: t }, o));
          svg.append(T(190, 50, "SUPERMARKT", { "text-anchor": "middle", "font-weight": 800, "font-size": 24 }), T(190, 78, "04.10.2026  10:42", { "text-anchor": "middle", "font-size": 19, fill: "#5d6678" }),
            s.el("line", { x1: 36, y1: 96, x2: 344, y2: 96, stroke: "#9aa9bb", "stroke-width": 2, "stroke-dasharray": "6 5" }));
          const ITEMS = [["Milch", "1,19"], ["Brot", "2,49"], ["Äpfel", "2,99"], ["Bananen", "1,85"], ["Schokolade", "0,99"]];
          const lines = ITEMS.map(([n, p], i) => { const g = L(s.el("g")); g.append(T(40, 132 + i * 36, n), T(340, 132 + i * 36, p + " €", { "text-anchor": "end" })); svg.append(g); return g; });
          const sumG = L(s.el("g"));
          sumG.append(s.el("line", { x1: 36, y1: 310, x2: 344, y2: 310, stroke: INK, "stroke-width": 2 }), T(40, 344, "SUMME", { "font-weight": 800 }), T(340, 344, "9,51 €", { "text-anchor": "end", "font-weight": 800, fill: UC }));
          const payG = L(s.el("g"));
          payG.append(T(40, 392, "Gegeben"), T(340, 392, "10,00 €", { "text-anchor": "end" }), T(40, 428, "Rückgeld"), T(340, 428, "0,49 €", { "text-anchor": "end", "font-weight": 800, fill: "var(--red)" }));
          const bye = L(fc(T(190, 480, "Danke schön!", { "text-anchor": "middle", "font-size": 19, fill: "#5d6678" })));
          const band = L(s.el("rect", { x: 270, y: 108, width: 24, height: 330, rx: 8, fill: "var(--yellow)", "fill-opacity": .45 }));
          svg.insertBefore(band, svg.children[1]); svg.append(sumG, payG, bye);

          const e1 = exbox(s, "1. Überschlagen", [s.h("p", { class: "t mono" }, "1 + 2,5 + 3 + 2 + 1 ≈ ", s.h("b", null, "9,5 €")), s.h("p", { class: "small" }, "Erst runden – dann geht's im Kopf.")], "ex later", { padding: "10px 18px" });
          const e2 = exbox(s, "2. Genau rechnen", [s.h("p", { class: "t mono" }, "Summe: ", s.h("b", { style: { color: UC } }, "9,51 €")), s.h("p", { class: "small" }, "Passt zum Überschlag – super!")], "ex later", { padding: "10px 18px" });
          const e3 = exbox(s, "3. Rückgeld", [s.h("p", { class: "t mono" }, "10,00 € − 9,51 € = ", s.h("b", { class: "red" }, "0,49 €")), s.h("p", { class: "small" }, "10 € als 10,00 € schreiben!")], "ex later", { padding: "10px 18px" });
          const life = exbox(s, "Im Alltag", [s.h("p", { class: "small" }, "So prüfst du an der Kasse, ob dein Rückgeld stimmt. Auf dem Zettel stehen die Kommas schon untereinander (gelb).")], "life later", { padding: "10px 18px" });
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "40px", alignItems: "center", height: "100%" } },
            svg, s.h("div", { class: "stack", style: { gap: "14px" } }, e1, e2, e3, life)));
          s.show(svg, "down"); s.sfx.whoosh();

          s.step(async () => { s.say("Die Kasse druckt: Milch, Brot, Äpfel, Bananen, Schokolade."); s.sound("bon-drucker", { vol: .6 }); for (const g of lines) { await s.show(g, "down"); await s.wait(180); } });
          s.step(async () => { s.say("Erst überschlagen: ungefähr 9 Euro 50."); s.sfx.pop(); await s.show(e1, "left"); });
          s.step(async () => { s.say("Genau: 9 Euro 51."); s.show(band, "fade"); s.sound("cash-register", { vol: .6 }); s.show(sumG, "down"); await s.show(e2, "left"); });
          s.step(async () => { s.say("Du gibst 10 Euro. Rückgeld: 49 Cent."); s.sound("coins", { vol: .7 }); s.show(payG, "down"); s.show(bye, "pop", 300); await s.show(e3, "left"); });
          s.step(async () => { s.sfx.success(); await s.show(life, "up"); });
        },
      },
      /* 15 ----------------------------------------------------------------- */
      {
        title: "Im Alltag: Kommas überall",
        say: "Dezimalzahlen sind überall: auf der Waage, am Thermometer, beim Radfahren und in der U-Bahn.",
        build(s) {
          const card = (lab, svg, val, desc) => exbox(s, lab, [svg, s.h("p", { class: "h2 mono", style: { marginTop: "4px" } }, val), s.h("p", { class: "small" }, desc)], "ex later", { padding: "12px 18px" });
          // 1 scale
          const s1 = s.svg(300, 112);
          s1.append(tx(s, 40, 108, "0", { "font-size": 19, fill: "#5d6678" }), tx(s, 268, 108, "5 kg", { "font-size": 19, fill: "#5d6678" }));
          s1.append(s.el("path", { d: "M60 104 A90 90 0 0 1 240 104", fill: "#fff", stroke: INK, "stroke-width": 5 }));
          for (let i = 0; i <= 10; i++) { const a = Math.PI + i * Math.PI / 10; s1.append(s.el("line", { x1: 150 + 78 * Math.cos(a), y1: 104 + 78 * Math.sin(a), x2: 150 + (i % 2 ? 70 : 64) * Math.cos(a), y2: 104 + (i % 2 ? 70 : 64) * Math.sin(a), stroke: INK, "stroke-width": i % 2 ? 2 : 3 })); }
          const needle = s.el("g", { transform: "rotate(-90 150 104)" });
          needle.append(s.el("line", { x1: 150, y1: 104, x2: 150, y2: 36, stroke: "var(--red)", "stroke-width": 5, "stroke-linecap": "round" }), s.el("circle", { cx: 150, cy: 104, r: 8, fill: INK }));
          s1.append(needle);
          // 2 thermometer
          const s2 = s.svg(300, 112);
          const tX = t => 58 + (t + 10) * 4.5; // −10..40 °C
          s2.append(s.el("rect", { x: 40, y: 26, width: 250, height: 30, rx: 15, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 40, cy: 41, r: 22, fill: "var(--red)", stroke: INK, "stroke-width": 3 }));
          const merc = s.el("rect", { x: 48, y: 34, width: tX(-10) - 48, height: 14, rx: 7, fill: "var(--red)" });
          s2.append(merc);
          [-10, 0, 10, 20, 30, 40].forEach(t => { s2.append(s.el("line", { x1: tX(t), y1: 58, x2: tX(t), y2: 70, stroke: INK, "stroke-width": 2 }), tx(s, tX(t), 96, String(t), { "font-size": 19, fill: "#5d6678" })); });
          // 3 bike trip
          const s3 = s.svg(300, 112);
          const road = s.el("path", { d: "M16 92 C 70 92, 80 26, 140 40 S 220 96, 284 22", fill: "none", stroke: "#9aa9bb", "stroke-width": 8, "stroke-linecap": "round" });
          const trail = s.el("path", { d: "M16 92 C 70 92, 80 26, 140 40 S 220 96, 284 22", fill: "none", stroke: UC, "stroke-width": 8, "stroke-linecap": "round", "stroke-dasharray": "0 2000" });
          const bike = s.el("circle", { cx: 16, cy: 92, r: 11, fill: "var(--orange)", stroke: "#fff", "stroke-width": 3 });
          s3.append(road, trail, bike);
          // 4 U-Bahn
          const s4 = s.svg(300, 112);
          s4.append(s.el("line", { x1: 0, y1: 100, x2: 300, y2: 100, stroke: INK, "stroke-width": 4 }));
          const train = s.el("g", { transform: "translate(-260 0)" });
          train.append(s.el("rect", { x: 20, y: 30, width: 240, height: 62, rx: 14, fill: "#f6c800", stroke: INK, "stroke-width": 3 }));
          for (let i = 0; i < 5; i++) train.append(s.el("rect", { x: 36 + i * 44, y: 42, width: 32, height: 24, rx: 4, fill: "#cfe3f5", stroke: INK, "stroke-width": 2 }));
          train.append(s.el("circle", { cx: 60, cy: 96, r: 7, fill: INK }), s.el("circle", { cx: 220, cy: 96, r: 7, fill: INK }));
          s4.append(train);
          // 5 height
          const s5 = s.svg(300, 112);
          const yH = m => 108 - m * 64;
          s5.append(s.el("rect", { x: 120, y: 4, width: 26, height: 104, fill: "#fff7d6", stroke: "#b8962a", "stroke-width": 2 }));
          for (let c = 0; c <= 15; c++) s5.append(s.el("line", { x1: 120, y1: yH(c / 10), x2: 120 + (c % 5 ? 8 : 16), y2: yH(c / 10), stroke: INK, "stroke-width": 1.5 }));
          const kid = s.el("g", { transform: "translate(0 90)" });
          kid.append(s.el("circle", { cx: 200, cy: yH(1.42) + 11, r: 11, fill: "#f1c27d", stroke: INK, "stroke-width": 2 }), s.el("rect", { x: 186, y: yH(1.42) + 23, width: 28, height: 40, rx: 10, fill: UC }), s.el("rect", { x: 189, y: yH(1.42) + 62, width: 9, height: 108 - (yH(1.42) + 62), fill: "#1d5bd0" }), s.el("rect", { x: 202, y: yH(1.42) + 62, width: 9, height: 108 - (yH(1.42) + 62), fill: "#1d5bd0" }));
          const mark = L(s.el("line", { x1: 120, y1: yH(1.42), x2: 214, y2: yH(1.42), stroke: "var(--red)", "stroke-width": 3, "stroke-dasharray": "5 4" }));
          s5.append(kid, mark);
          // 6 bottle
          const s6 = s.svg(300, 112);
          const clip = s.el("clipPath", { id: "u6bottle" });
          const bpath = "M136 6 H164 V18 C 164 26, 178 30, 178 44 V102 a6 6 0 0 1 -6 6 H128 a6 6 0 0 1 -6 -6 V44 C 122 30, 136 26, 136 18 Z";
          clip.append(s.el("path", { d: bpath }));
          const water = s.el("rect", { x: 110, y: 108, width: 80, height: 0, fill: "#5aa9e6", "clip-path": "url(#u6bottle)" });
          s6.append(s.el("defs", null, clip), water, s.el("path", { d: bpath, fill: "none", stroke: INK, "stroke-width": 3 }));

          const cards = [
            [card("Waage", s1, "1,25 kg", "Kartoffeln: 1 kg und 250 g."), async () => { await s.tween({ from: -90, to: -90 + 180 * 1.25 / 5, dur: 1200, ease: "elastic", update: a => needle.setAttribute("transform", `rotate(${a} 150 104)`) }); }],
            [card("Freibad", s2, "23,5 °C", "Wassertemperatur: 23 Grad und ein halbes."), async () => { await s.tween({ from: -10, to: 23.5, dur: 1200, ease: "out", update: t => merc.setAttribute("width", tX(t) - 48) }); }],
            [card("Radtour am Mauerweg", s3, "12,6 km", "12 Kilometer und 600 Meter."), async () => { const Ltot = road.getTotalLength(); await s.tween({ from: 0, to: 1, dur: 1400, ease: "inOut", update: u => { const p = road.getPointAtLength(u * Ltot); bike.setAttribute("cx", p.x); bike.setAttribute("cy", p.y); trail.setAttribute("stroke-dasharray", `${u * Ltot} 2000`); } }); }],
            [card("BVG", s4, "4,00 €", "Einzelfahrschein Berlin AB (Preis 2026)."), async () => { await s.tween({ from: -260, to: 20, dur: 1100, ease: "out", update: x => train.setAttribute("transform", `translate(${x} 0)`) }); }],
            [card("Körpergröße", s5, "1,42 m", "1 Meter und 42 Zentimeter groß."), async () => { await s.tween({ from: 90, to: 0, dur: 900, ease: "back", update: y => kid.setAttribute("transform", `translate(0 ${y})`) }); s.show(mark, "draw"); }],
            [card("Getränk", s6, "1,5 l", "Eine große Flasche: 1 Liter und ein halber."), async () => { await s.tween({ from: 0, to: 1, dur: 1200, ease: "out", update: u => { const hgt = 92 * u; water.setAttribute("y", 108 - hgt); water.setAttribute("height", hgt); } }); }],
          ];
          s.add(s.h("div", { class: "cols3", style: { height: "100%", alignContent: "center", gap: "22px 22px" } }, cards.map(c => c[0])));
          const SND = [null, () => s.sound("splash", { vol: .5 }), () => s.sound("bike-bell", { vol: .6 }), () => s.sound("ubahn-train", { vol: .45, dur: 3 }), null, () => s.sound("water-pour", { vol: .55, dur: 1.4 })];
          const reveal = async (k) => { const [c, anim] = cards[k]; s.sfx.pop(); s.show(c, "up"); await s.wait(200); if (SND[k]) SND[k](); else s.sfx.whoosh(); await anim(); s.sfx.ding(); };
          reveal(0);
          [1, 2, 3, 4, 5].forEach(k => s.step(() => reveal(k)));
        },
      },
    ],
  });
})();
