/* Kapitel 4 – Mischen und Trennen (RLP NaWi 5/6, Thema 3.2 „Stoffe im Alltag“) */
(() => {
  const UC = "#dc2626";

  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.anchor || "middle", class: o.cls || "lbl", text }, o.attrs || {}, o.fill ? { fill: o.fill } : {}, o.size ? { style: { fontSize: o.size + "px", fontWeight: o.weight || 700 } } : {}));
  const P = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids);
  const B = (s, txt) => s.h("b", null, txt);
  const later = el => { el.classList.add("later"); return el; };
  const beakerPath = (x, y, w, h) => `M${x},${y} V${y + h - 12} a12,12 0 0 0 12,12 H${x + w - 12} a12,12 0 0 0 12,-12 V${y}`;
  const flamePath = (cx, by, w, h) => `M${cx},${by - h} C${cx + w * .55},${by - h * .62} ${cx + w * .6},${by - h * .2} ${cx + w * .42},${by - h * .06} C${cx + w * .2},${by + h * .06} ${cx - w * .2},${by + h * .06} ${cx - w * .42},${by - h * .06} C${cx - w * .6},${by - h * .2} ${cx - w * .55},${by - h * .62} ${cx},${by - h} Z`;
  const rnd = (i, k = 1) => { const x = Math.sin(i * 12.9898 + k * 78.233 + i * k * 0.731) * 43758.5453; return x - Math.floor(x); }; // deterministic pseudo-random
  const life = (s, ...lines) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...lines.map(l => P(s, "small", l)));

  Deck.unit({
    id: "u4", num: 4, title: "Mischen und Trennen", color: UC, soft: "#fde6e3",
    subtitle: "Aus eins mach zwei – und zurück",
    blurb: "Gemische, Trennverfahren, Kläranlage, Feuer und Rost.",
    goals: [
      "Reinstoffe und Gemische unterscheiden",
      "Lösung, Suspension, Emulsion, Gemenge, Rauch, Nebel, Schaum",
      "Trennverfahren: Sieben, Filtrieren, Destillieren …",
      "wie eine Kläranlage Wasser sauber macht",
      "Kerzenflamme, Branddreieck und Rosten",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M14,12 L56,12 L40,36 L40,58 L30,62 L30,36 Z", fill: "#fde6e3", stroke: UC, "stroke-width": 3, "stroke-linejoin": "round" }));
      [[24, 20], [34, 22], [46, 19], [29, 28]].forEach(([x, y], i) => svg.append(el("circle", { cx: x, cy: y, r: 3.5, fill: i % 2 ? UC : "#8a5a2b" })));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Reinstoff oder Gemisch?",
        say: "Ein Reinstoff besteht nur aus einer Sorte Teilchen. Ein Gemisch besteht aus mehreren Stoffen.",
        build(s) {
          const W = 500, H = 270;
          const { canvas, g } = s.canvas(W, H);
          const mkP = (x0, mix) => Array.from({ length: 22 }, (_, i) => ({ x: x0 + 20 + rnd(i, mix ? 3 : 1) * 190, y: 20 + rnd(i, mix ? 4 : 2) * 190, vx: (rnd(i, 5) - .5) * 60, vy: (rnd(i, 6) - .5) * 60, c: mix && i % 2 ? "#ee7a1a" : "#1d5bd0", r: mix && i % 2 ? 8 : 10 }));
          const boxes = [{ x: 10, ps: mkP(10, false), on: false }, { x: 270, ps: mkP(270, true), on: false }];
          s.loop((t, dt) => {
            dt = Math.min(dt || .016, .033);
            g.clearRect(0, 0, W, H);
            boxes.forEach(b => {
              if (!b.on) return;
              g.fillStyle = "#fff"; g.fillRect(b.x, 0, 220, 230); g.strokeStyle = "#1b2740"; g.lineWidth = 3; g.strokeRect(b.x + 1.5, 1.5, 217, 227);
              b.ps.forEach(p => {
                p.x += p.vx * dt; p.y += p.vy * dt;
                if (p.x < b.x + p.r + 3 || p.x > b.x + 217 - p.r) p.vx *= -1;
                if (p.y < p.r + 3 || p.y > 227 - p.r) p.vy *= -1;
                p.x = Math.max(b.x + p.r + 3, Math.min(b.x + 217 - p.r, p.x)); p.y = Math.max(p.r + 3, Math.min(227 - p.r, p.y));
                g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
              });
            });
            g.font = "700 24px 'Bricolage Grotesque', sans-serif"; g.fillStyle = "#1b2740"; g.textAlign = "center";
            if (boxes[0].on) g.fillText("Reinstoff", 120, 262);
            if (boxes[1].on) g.fillText("Gemisch", 380, 262);
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "Reinstoff"), ": nur eine Teilchensorte. ", B(s, "Gemisch"), ": zwei oder mehr Stoffe zusammen.");
          const c1 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel", style: { color: "var(--blue)" } }, "Reinstoffe"), P(s, "t", "destilliertes Wasser, Zucker, Kupfer, Gold"));
          const c2 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel", style: { color: "var(--orange)" } }, "Gemische"), P(s, "t", "Limo, Müsli, Meerwasser, Milch – und die Luft!"));
          const tip = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Fast alles ist gemischt"), P(s, "small", "Die meisten Dinge um dich herum sind Gemische. Reinstoffe gibt es vor allem im Labor."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%" } },
            s.h("div", { class: "stack", style: { gap: "20px" } }, canvas, merk), s.h("div", { class: "stack" }, c1, c2, tip)));
          s.sfx.pop();
          s.step(async () => { boxes[0].on = true; s.sfx.pop(); await s.show(c1, "left"); s.say("Reinstoff: alle Teilchen sind gleich."); });
          s.step(async () => { boxes[1].on = true; s.sfx.pop(); await s.show(c2, "left"); s.say("Gemisch: verschiedene Teilchen durcheinander."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(tip, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Welche Gemische gibt es?",
        say: "Je nachdem, was gemischt ist, hat das Gemisch einen eigenen Namen.",
        build(s) {
          const types = [
            ["Lösung", "fest in flüssig, gelöst", "Salzwasser", "sol"], ["Suspension", "fest in flüssig, ungelöst", "Schlammwasser", "sus"],
            ["Emulsion", "flüssig in flüssig", "Milch", "emu"], ["Gemenge", "fest in fest", "Müsli", "gem"],
            ["Rauch", "fest in Gas", "Lagerfeuer-Rauch", "rau"], ["Nebel", "flüssig in Gas", "Morgennebel", "neb"],
            ["Schaum", "Gas in flüssig", "Seifenschaum", "sch"], ["Gasgemisch", "Gas in Gas", "Luft", "luf"]];
          const lens = kind => {
            const v = s.svg(220, 100, { width: "100%", height: 100 });
            const bg = { sol: "#bfdbfe", sus: "#bfdbfe", emu: "#bfdbfe", gem: "#fef3c7", rau: "#e5e7eb", neb: "#f1f5f9", sch: "#bfdbfe", luf: "#ffffff" }[kind];
            v.append(s.el("rect", { x: 2, y: 2, width: 216, height: 96, rx: 16, fill: bg, stroke: "#1b2740", "stroke-width": 2.5 }));
            for (let i = 0; i < 26; i++) {
              const x = 16 + rnd(i, 1) * 188, y = 14 + rnd(i, 2) * 72;
              if (kind === "sol") v.append(s.el("circle", { cx: x, cy: y, r: 3, fill: "#1d5bd0" }));
              if (kind === "sus" && i < 16) v.append(s.el("polygon", { points: `${x},${y - 6} ${x + 7},${y + 4} ${x - 6},${y + 5}`, fill: "#8a5a2b" }));
              if (kind === "emu" && i < 14) v.append(s.el("circle", { cx: x, cy: y, r: 6 + rnd(i, 3) * 5, fill: "#fde047", stroke: "#ca8a04", "stroke-width": 1.5 }));
              if (kind === "gem" && i < 18) v.append(i % 3 === 0 ? s.el("ellipse", { cx: x, cy: y, rx: 7, ry: 5, fill: "#4a1d1d" }) : i % 3 === 1 ? s.el("ellipse", { cx: x, cy: y, rx: 11, ry: 6, fill: "#d6b27a", transform: `rotate(${i * 25} ${x} ${y})` }) : s.el("circle", { cx: x, cy: y, r: 6, fill: "#b45309" }));
              if (kind === "rau") v.append(s.el("circle", { cx: x, cy: y, r: 2.5, fill: "#374151" }));
              if (kind === "neb" && i < 22) v.append(s.el("circle", { cx: x, cy: y, r: 4, fill: "#60a5fa", opacity: .8 }));
              if (kind === "sch" && i < 14) v.append(s.el("circle", { cx: x, cy: y, r: 7 + rnd(i, 4) * 6, fill: "#fff", stroke: "#60a5fa", "stroke-width": 2 }));
              if (kind === "luf" && i < 12) { const c = i % 4 === 0 ? "#dc2626" : "#1d5bd0"; v.append(s.el("circle", { cx: x - 4, cy: y, r: 5, fill: c }), s.el("circle", { cx: x + 4, cy: y, r: 5, fill: c })); }
            }
            return v;
          };
          const cards = types.map(([n, what, ex, k]) => s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" } },
            lens(k), s.h("b", { style: { fontSize: "23px", fontFamily: "var(--f-display)" } }, n), s.h("span", { class: "chip", style: { alignSelf: "flex-start", fontSize: "17px" } }, what), P(s, "small", "z. B. " + ex)));
          s.add(s.h("div", { class: "cols4", style: { gap: "14px", height: "100%", alignContent: "center", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } }, cards));
          s.sfx.whoosh();
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.count(i); await s.show(cards[i], "pop"); } s.say("Lösung, Suspension, Emulsion und Gemenge."); });
          s.step(async () => { for (let i = 4; i < 8; i++) { s.sfx.count(i); await s.show(cards[i], "pop"); } s.say("Rauch, Nebel, Schaum – und die Luft ist ein Gasgemisch."); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Lösung, Suspension, Emulsion",
        say: "Drei Gläser Wasser. In das erste kommt Salz, in das zweite Erde, in das dritte Öl.",
        build(s) {
          const mk = (title, desc, ex) => {
            const v = s.svg(260, 250, { width: "100%", height: 310 });
            v.append(s.el("rect", { x: 63, y: 70, width: 134, height: 168, fill: "#dbeafe" }));
            const water = v.lastChild;
            const layer = s.el("g"); v.append(layer, s.el("path", { d: beakerPath(60, 30, 140, 212), fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
            const verdict = T(s, 130, 22, "", { size: 21 }); v.append(verdict);
            const c = s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "4px" } },
              s.h("b", { class: "h2", style: { fontSize: "26px" } }, title), v, P(s, "small", desc), P(s, "small", s.h("b", null, "Beispiele: "), ex));
            return { v, c, layer, water, verdict };
          };
          const A = mk("Lösung", "Salz verteilt sich unsichtbar. Klar und durchsichtig.", "Salzwasser, Zuckertee, Limo");
          const Bx = mk("Suspension", "Feste Teilchen schweben – das Wasser ist trüb. Sie setzen sich langsam ab.", "Schlammwasser, Orangensaft mit Fruchtfleisch");
          const C = mk("Emulsion", "Öltröpfchen im Wasser. Ohne Schütteln trennen sie sich wieder.", "Milch, Salatsoße, Handcreme");
          // particles
          const salt = Array.from({ length: 14 }, (_, i) => { const r = s.el("rect", { x: 80 + rnd(i, 1) * 95, y: 0, width: 8, height: 8, fill: "#fff", stroke: "#94a3b8", "stroke-width": 1.5 }); A.layer.append(r); return r; });
          const mud = Array.from({ length: 24 }, (_, i) => { const p = s.el("circle", { cx: 75 + rnd(i, 2) * 110, cy: 0, r: 4 + rnd(i, 3) * 3, fill: "#8a5a2b" }); p.y0 = 85 + rnd(i, 4) * 140; p.y1 = 232 - rnd(i, 5) * 10; Bx.layer.append(p); return p; });
          const oilLayer = s.el("rect", { x: 63, y: 70, width: 134, height: 0, fill: "#fde047", opacity: .9 }); C.layer.append(oilLayer);
          const oil = Array.from({ length: 16 }, (_, i) => { const p = s.el("circle", { cx: 78 + rnd(i, 6) * 104, cy: 90 + rnd(i, 7) * 135, r: 6 + rnd(i, 8) * 5, fill: "#fde047", stroke: "#ca8a04", "stroke-width": 1.5 }); C.layer.append(p); return p; });
          const runA = async () => {
            A.verdict.textContent = "";
            salt.forEach(r => { r.setAttribute("opacity", 1); r.setAttribute("y", 0); });
            s.sound("salz-rieseln", { vol: .6, dur: 1 });
            await s.tween({ from: 0, to: 1, dur: 700, ease: "in", update: t => salt.forEach((r, i) => r.setAttribute("y", 10 + t * (150 + rnd(i, 9) * 70))) });
            s.sound("umruehren", { vol: .5, dur: 1.5 });
            await s.tween({ from: 1, to: 0, dur: 1300, update: t => salt.forEach(r => r.setAttribute("opacity", t)) });
            A.verdict.textContent = "klar"; A.verdict.setAttribute("fill", "#138a5a"); s.sfx.ding();
          };
          const runB = async () => {
            Bx.verdict.textContent = ""; Bx.water.setAttribute("fill", "#d6c3a5");
            mud.forEach(p => p.setAttribute("cy", p.y0)); s.sound("splash", { vol: .4, dur: 1.5 });
            Bx.verdict.textContent = "trüb"; Bx.verdict.setAttribute("fill", "#8a5a2b");
            await s.wait(800);
            await s.tween({ from: 0, to: 1, dur: 2200, ease: "inOut", update: t => { mud.forEach(p => p.setAttribute("cy", p.y0 + (p.y1 - p.y0) * Math.min(1, t * (1 + (p.y0 % 7) / 10)))); Bx.water.setAttribute("fill", t > .7 ? "#dbeafe" : "#d6c3a5"); } });
            Bx.verdict.textContent = "setzt sich ab"; s.sfx.drum();
          };
          const runC = async () => {
            C.verdict.textContent = "geschüttelt"; C.verdict.setAttribute("fill", "#ca8a04");
            oilLayer.setAttribute("height", 0); oil.forEach((p, i) => { p.setAttribute("opacity", 1); p.setAttribute("cy", 90 + rnd(i, 7) * 135); });
            s.sound("schuetteln", { vol: .6, dur: 1.2 });
            await s.tween({ from: 0, to: 1, dur: 700, update: t => { C.v.style.transform = `rotate(${Math.sin(t * 25) * 6 * (1 - t)}deg)`; } });
            await s.wait(700);
            await s.tween({ from: 0, to: 1, dur: 1800, ease: "inOut", update: t => { oil.forEach((p, i) => { const y0 = 90 + rnd(i, 7) * 135; p.setAttribute("cy", y0 + (82 - y0) * t); p.setAttribute("opacity", 1 - Math.max(0, t - .7) / .3); }); oilLayer.setAttribute("height", 24 * Math.max(0, t - .5) / .5); } });
            C.verdict.textContent = "Öl schwimmt oben"; s.sfx.pop();
          };
          mud.forEach(p => p.setAttribute("cy", p.y1));
          oil.forEach(p => p.setAttribute("opacity", 0)); oilLayer.setAttribute("height", 24);
          const btn = s.h("button", { class: "btn", onclick: () => { runA(); runB(); runC(); } }, "Nochmal mischen");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } },
            s.h("div", { class: "cols3", style: { gap: "16px", flex: 1, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, A.c, Bx.c, C.c),
            s.h("div", { class: "row", style: { justifyContent: "center" } }, btn)));
          s.sfx.pop();
          s.step(async () => { await s.show(A.c, "up"); await runA(); s.say("Das Salz ist noch da, du siehst es nur nicht mehr."); });
          s.step(async () => { await s.show(Bx.c, "up"); await runB(); });
          s.step(async () => { await s.show(C.c, "up"); await runC(); s.say("Öl ist leichter als Wasser und schwimmt oben."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Gemenge, Rauch, Nebel, Schaum",
        say: "Noch vier Gemische, die du jeden Tag siehst.",
        build(s) {
          const panel = (id, pos, name, chip, lines) => {
            const c = s.h("div", { class: "card later", style: { padding: "10px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" } },
              s.photo(id, { w: "100%", h: 230, pos }), s.h("b", { class: "h2", style: { fontSize: "26px" } }, name), s.h("span", { class: "chip" }, chip), ...lines.map(l => P(s, "small", l)));
            return { c };
          };
          const p1 = panel("muesli", "50% 50%", "Gemenge", "fest + fest", ["Müsli", "Sand mit Kieselsteinen", "Studentenfutter"]);
          const p2 = panel("kerze-rauch", "50% 30%", "Rauch", "fest in Gas", ["Lagerfeuer", "ausgeblasene Kerze", "Räucherstäbchen"]);
          const p3 = panel("nebel", "50% 50%", "Nebel", "flüssig in Gas", ["Morgennebel", "Wolken", "Sprühflasche"]);
          const p4 = panel("schaum", "50% 50%", "Schaum", "Gas in flüssig", ["Seifenschaum", "Milchschaum", "Schlagsahne"]);
          s.add(s.h("div", { class: "cols4", style: { gap: "14px", height: "100%", alignContent: "center", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } }, p1.c, p2.c, p3.c, p4.c));
          s.sfx.pop();
          s.step(async () => { s.sound("schuetteln", { vol: .6 }); await s.show(p1.c, "pop"); s.say("Gemenge: feste Stoffe durcheinander, wie Müsli."); });
          s.step(async () => { s.sound("auspusten", { vol: .8 }); await s.show(p2.c, "pop"); s.say("Rauch: winzige feste Teilchen in der Luft."); });
          s.step(async () => { s.sound("wind", { vol: .35, dur: 3 }); await s.show(p3.c, "pop"); s.say("Nebel: winzige Wassertröpfchen in der Luft."); });
          s.step(async () => { s.sound("bubbles", { vol: .6 }); await s.show(p4.c, "pop"); s.say("Schaum: Gasbläschen in einer Flüssigkeit."); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Wie viel Salz löst sich?",
        say: "Wir geben Löffel für Löffel Salz in 100 Milliliter Wasser. Irgendwann löst sich nichts mehr.",
        build(s) {
          const v = s.svg(320, 300);
          v.append(s.el("rect", { x: 63, y: 80, width: 194, height: 198, fill: "#dbeafe" }), s.el("path", { d: beakerPath(60, 30, 200, 252), fill: "none", stroke: "#1b2740", "stroke-width": 4 }), T(s, 160, 20, "100 ml Wasser · 20 °C", { size: 19, fill: "#5d6678" }));
          const crystals = s.el("g"); v.append(crystals);
          let grams = 0, pile = 0;
          const big = s.h("p", { class: "big mono", style: { color: UC } }, "0 g Salz");
          const status = P(s, "t", "Noch ist alles gelöst.");
          const add = async () => {
            grams += 6; big.textContent = grams + " g Salz";
            const cs = Array.from({ length: 6 }, (_, i) => { const r = s.el("rect", { x: 110 + rnd(grams + i, 1) * 100, y: 0, width: 9, height: 9, fill: "#fff", stroke: "#64748b", "stroke-width": 1.5 }); crystals.append(r); return r; });
            s.sound("salz-rieseln", { vol: .5, dur: .5 });
            const dissolve = grams <= 36;
            await s.tween({ from: 0, to: 1, dur: 450, ease: "in", update: t => cs.forEach((r, i) => r.setAttribute("y", t * (dissolve ? 150 + i * 12 : 262 - (pile % 3) * 9 - rnd(i, 2) * 6))) });
            if (dissolve) { await s.tween({ from: 1, to: 0, dur: 400, update: t => cs.forEach(r => r.setAttribute("opacity", t)) }); cs.forEach(r => r.remove()); status.textContent = grams < 36 ? "Noch ist alles gelöst." : "Genau 36 g – jetzt ist die Lösung voll!"; s.sfx.count(grams / 6); }
            else { pile++; status.textContent = "Gesättigt! Das Salz bleibt als Bodensatz liegen."; s.sfx.drum(); }
          };
          const reset = () => { grams = 0; pile = 0; crystals.innerHTML = ""; big.textContent = "0 g Salz"; status.textContent = "Noch ist alles gelöst."; s.sfx.swoosh(); };
          const b1 = s.h("button", { class: "btn solid", onclick: add }, "+ 1 Löffel (6 g)");
          const b2 = s.h("button", { class: "btn", onclick: reset }, "Neu");
          const left = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 16px" } }, v, big, status, s.h("div", { class: "row" }, b1, b2));
          // temperature chart
          const sugar = { 20: 204, 40: 238, 60: 287, 80: 362, 100: 487 }, salt = { 20: 35.9, 40: 36.5, 60: 37.2, 80: 38.0, 100: 39.1 };
          const ch = s.svg(470, 170);
          const barS = s.el("rect", { x: 100, y: 30, height: 40, rx: 6, fill: "#64748b" }), barZ = s.el("rect", { x: 100, y: 100, height: 40, rx: 6, fill: "#ee7a1a" });
          const tS = T(s, 0, 58, "", { anchor: "start", size: 21 }), tZ = T(s, 0, 128, "", { anchor: "start", size: 21 });
          ch.append(T(s, 90, 58, "Salz", { anchor: "end" }), T(s, 90, 128, "Zucker", { anchor: "end" }), barS, barZ, tS, tZ);
          const setT = c => { const k = 300 / 500; barS.setAttribute("width", salt[c] * k); barZ.setAttribute("width", sugar[c] * k); tS.setAttribute("x", 108 + salt[c] * k); tZ.setAttribute("x", 108 + sugar[c] * k); tS.textContent = s.fmt(salt[c], 1) + " g"; tZ.textContent = sugar[c] + " g"; };
          setT(20);
          const sl = s.slider({ label: "Wassertemperatur", min: 20, max: 100, step: 20, value: 20, fmt: v => v + " °C", onInput: setT });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "In 100 ml Wasser lösen sich bei 20 °C nur etwa ", B(s, "36 g Salz"), ". Dann ist die Lösung ", B(s, "gesättigt"), ".");
          const right = s.h("div", { class: "stack", style: { gap: "12px" } }, merk,
            s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "So viel löst sich in 100 g Wasser"), ch, sl,
              P(s, "small", "Warmes Wasser löst viel mehr Zucker – beim Salz ändert sich kaum etwas.")));
          const chartCard = right.children[1];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, left, right));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 6; i++) await add(); s.say("Sechs Löffel, sechsunddreißig Gramm. Alles gelöst."); });
          s.step(async () => { await add(); s.sfx.ding(); await s.show(merk, "up"); s.say("Jetzt bleibt das Salz am Boden liegen. Die Lösung ist gesättigt."); });
          s.step(async () => { await s.show(chartCard, "up"); s.sfx.whoosh(); await s.tween({ from: 20, to: 100, dur: 1600, update: x => { const v = Math.round(x / 20) * 20; if (Number(sl.input.value) !== v) sl.set(v); } }); s.sfx.ding(); s.say("In heißem Tee löst sich viel mehr Zucker als in kaltem."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Auslesen, Sieben, Magnet",
        say: "Drei einfache Trennverfahren: mit der Hand auslesen, mit einem Sieb sieben und mit einem Magneten.",
        build(s) {
          const card = (title, rule, v, ex) => s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px" } },
            s.h("b", { class: "h2", style: { fontSize: "26px" } }, title), s.h("span", { class: "chip", style: { alignSelf: "flex-start" } }, rule), v, ...ex.map(e => P(s, "small", e)));
          // Auslesen
          const v1 = s.svg(300, 220, { width: "100%", height: 220 });
          const bowl = (x, y, w) => s.el("path", { d: `M${x - w / 2},${y} Q${x},${y + w * .55} ${x + w / 2},${y} Z`, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 });
          v1.append(bowl(100, 150, 170), bowl(240, 170, 90));
          const peas = Array.from({ length: 16 }, (_, i) => { const good = i % 4 !== 0; const c = s.el("circle", { cx: 45 + rnd(i, 1) * 110, cy: 158 + rnd(i, 2) * 22, r: 8, fill: good ? "#65a30d" : "#78350f" }); c.good = good; v1.append(c); return c; });
          v1.append(T(s, 240, 215, "die schlechten", { size: 19, fill: "#5d6678" }));
          // Sieben
          const v2 = s.svg(300, 220, { width: "100%", height: 220 });
          v2.append(bowl(150, 160, 200));
          const sieve = s.el("g");
          sieve.append(s.el("path", { d: "M70,60 L230,60 L200,110 L100,110 Z", fill: "#f1f5f9", stroke: "#1b2740", "stroke-width": 3 }));
          for (let i = 0; i < 9; i++) sieve.append(s.el("line", { x1: 92 + i * 15, y1: 64, x2: 104 + i * 11, y2: 108, stroke: "#94a3b8", "stroke-width": 1.5 }));
          const stones = Array.from({ length: 5 }, (_, i) => s.el("ellipse", { cx: 112 + i * 19, cy: 92 - (i % 2) * 8, rx: 11, ry: 8, fill: "#6b7280" }));
          const sand = Array.from({ length: 34 }, (_, i) => { const c = s.el("circle", { cx: 105 + rnd(i, 3) * 90, cy: 80 + rnd(i, 4) * 24, r: 3, fill: "#d4a35a" }); c.y0 = +c.getAttribute("cy"); c.y1 = 172 + rnd(i, 5) * 22; return c; });
          sieve.append(...stones);
          v2.append(...sand, sieve);
          // Magnet
          const v3 = s.svg(300, 220, { width: "100%", height: 220 });
          v3.append(s.el("rect", { x: 30, y: 160, width: 240, height: 40, rx: 6, fill: "#fef3c7", stroke: "#1b2740", "stroke-width": 3 }));
          for (let i = 0; i < 40; i++) v3.append(s.el("circle", { cx: 42 + rnd(i, 6) * 216, cy: 168 + rnd(i, 7) * 26, r: 3, fill: "#d4a35a" }));
          const fil = Array.from({ length: 22 }, (_, i) => { const x = 44 + rnd(i, 8) * 212, y = 170 + rnd(i, 9) * 24; const l = s.el("line", { x1: x - 4, y1: y, x2: x + 4, y2: y + 2, stroke: "#1f2937", "stroke-width": 3, "stroke-linecap": "round" }); l.x = x; l.y = y; v3.append(l); return l; });
          const mag = s.el("g", { transform: "translate(-80,0)" }); mag.append(s.el("rect", { x: 0, y: 40, width: 80, height: 34, rx: 6, fill: "#dc2626" }), s.el("rect", { x: 40, y: 40, width: 40, height: 34, rx: 6, fill: "#1d5bd0" }));
          v3.append(mag);
          const c1 = card("Auslesen", "Unterschied: Aussehen", v1, ["Erbsen lesen wie bei Aschenputtel: „Die guten ins Töpfchen, die schlechten ins Kröpfchen.“", "Legosteine nach Farben sortieren"]);
          const c2 = card("Sieben", "Unterschied: Größe", v2, ["Nudeln abgießen", "Sandkasten-Sieb", "Flusensieb der Waschmaschine"]);
          const c3 = card("Magnettrennung", "Unterschied: magnetisch", v3, ["Eisenspäne aus dem Sand holen", "Müllsortierung: Dosen aus Stahlblech", "Schrottplatz: Magnetkran"]);
          s.add(s.h("div", { class: "cols3", style: { gap: "16px", height: "100%", alignContent: "center", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, c1, c2, c3));
          s.sfx.pop();
          s.step(async () => {
            await s.show(c1, "up");
            const bad = peas.filter(p => !p.good); let k = 0;
            for (const p of bad) { const x0 = +p.getAttribute("cx"), y0 = +p.getAttribute("cy"), x1 = 222 + k * 12, y1 = 180 - (k % 2) * 6; k++; s.sfx.pop(); await s.tween({ from: 0, to: 1, dur: 450, ease: "inOut", update: t => { p.setAttribute("cx", x0 + (x1 - x0) * t); p.setAttribute("cy", y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 60); } }); }
            s.sfx.ding();
          });
          s.step(async () => {
            await s.show(c2, "up"); s.sound("schuetteln", { vol: .5, dur: 1.8 });
            await s.tween({ from: 0, to: 1, dur: 1800, ease: "linear", update: t => { sieve.setAttribute("transform", `translate(${Math.sin(t * 40) * 8 * (1 - t)},0)`); sand.forEach((c, i) => { const u = Math.max(0, Math.min(1, t * 1.6 - rnd(i, 6) * .6)); c.setAttribute("cy", c.y0 + (c.y1 - c.y0) * u); }); } });
            s.sfx.ding();
          });
          s.step(async () => {
            await s.show(c3, "up"); s.sfx.whoosh();
            await s.tween({ from: -80, to: 110, dur: 1000, ease: "out", update: x => mag.setAttribute("transform", `translate(${x},0)`) });
            s.sound("magnet-klick");
            await s.tween({ from: 0, to: 1, dur: 500, ease: "in", update: t => fil.forEach((l, i) => { const tx = 120 + (i % 10) * 6, ty = 78 + Math.floor(i / 10) * 5; const x = l.x + (tx - l.x) * t, y = l.y + (ty - l.y) * t; l.setAttribute("x1", x - 4); l.setAttribute("y1", y); l.setAttribute("x2", x + 4); l.setAttribute("y2", y + 2); }) });
          });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Sedimentieren und Dekantieren",
        say: "Lässt man Schlammwasser stehen, sinkt der Schlamm nach unten. Dann gießt man das Wasser vorsichtig ab.",
        build(s) {
          const v = s.svg(560, 470);
          const A = s.el("g");
          const water = s.el("rect", { x: 143, y: 160, width: 174, height: 278, fill: "#c9a87a" });
          A.append(water);
          const mud = Array.from({ length: 40 }, (_, i) => { const c = s.el("circle", { cx: 152 + rnd(i, 1) * 156, cy: 170 + rnd(i, 2) * 255, r: 3 + rnd(i, 3) * 3, fill: "#78350f" }); c.y0 = +c.getAttribute("cy"); c.y1 = 432 - rnd(i, 4) * 22; A.append(c); return c; });
          A.append(s.el("path", { d: beakerPath(140, 110, 180, 340), fill: "none", stroke: "#1b2740", "stroke-width": 5 }));
          const Bwater = s.el("rect", { x: 403, y: 450, width: 134, height: 0, fill: "#bfdbfe" });
          v.append(A, Bwater, s.el("path", { d: beakerPath(400, 250, 140, 200), fill: "none", stroke: "#1b2740", "stroke-width": 5 }));
          const stream = s.el("path", { d: "M326,150 Q420,150 460,445", fill: "none", stroke: "#93c5fd", "stroke-width": 9, "stroke-linecap": "round", opacity: 0 });
          v.append(stream);
          const lSed = T(s, 230, 30, "", { size: 24 }); v.append(lSed);
          const lab2 = T(s, 470, 236, "klares Wasser", { size: 20, attrs: { class: "lbl later" } }); v.append(lab2);
          const c1 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "1 Sedimentieren"), P(s, "small", "Schwere Teilchen sinken nach unten und bilden den ", B(s, "Bodensatz"), " (das Sediment)."));
          const c2 = s.h("div", { class: "card later" }, s.h("span", { class: "exlabel" }, "2 Dekantieren"), P(s, "small", "Die Flüssigkeit oben wird vorsichtig ", B(s, "abgegossen"), ". Der Bodensatz bleibt im Glas."));
          const lf = life(s, "• In einer Pfütze sinkt der Schlamm nach unten.", "• Reis waschen: das trübe Wasser vorsichtig abgießen", "• Im Klärwerk setzt sich Schmutz in großen Becken ab.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, v, s.h("div", { class: "stack" }, c1, c2, lf)));
          s.sfx.pop();
          s.step(async () => {
            await s.show(c1, "left"); lSed.textContent = "warten …"; s.sound("clock-tick", { vol: .5, dur: 2.5 });
            await s.tween({ from: 0, to: 1, dur: 2600, ease: "inOut", update: t => { mud.forEach(c => c.setAttribute("cy", c.y0 + (c.y1 - c.y0) * t)); water.setAttribute("fill", t > .6 ? "#bfdbfe" : "#c9a87a"); } });
            lSed.textContent = "Bodensatz unten"; s.sfx.drum();
          });
          s.step(async () => {
            await s.show(c2, "left"); lSed.textContent = "abgießen"; s.sfx.swoosh();
            await s.tween({ from: 0, to: 1, dur: 700, update: t => A.setAttribute("transform", `rotate(${25 * t} 320 110)`) });
            stream.setAttribute("opacity", 1); s.sound("water-pour", { vol: .6 });
            await s.tween({ from: 0, to: 1, dur: 1600, update: t => { water.setAttribute("y", 160 + 230 * t); water.setAttribute("height", 278 - 230 * t); Bwater.setAttribute("y", 450 - 150 * t); Bwater.setAttribute("height", 150 * t - 2 > 0 ? 150 * t - 2 : 0); } });
            stream.setAttribute("opacity", 0);
            await s.tween({ from: 1, to: 0, dur: 600, update: t => A.setAttribute("transform", `rotate(${25 * t} 320 110)`) });
            lSed.textContent = "Bodensatz bleibt"; s.show(lab2, "pop"); s.sfx.ding();
          });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Filtrieren",
        say: "Ein Filter ist wie ein Sieb mit winzigen Löchern. Wasser kommt durch, Schmutz bleibt hängen.",
        build(s) {
          const v = s.svg(560, 580);
          // beaker below
          const fil = s.el("rect", { x: 163, y: 560, width: 174, height: 0, fill: "#bfdbfe" });
          v.append(fil, s.el("path", { d: beakerPath(160, 380, 180, 192), fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
          // funnel
          v.append(s.el("path", { d: "M120,70 L380,70 L270,230 L270,340 L230,340 L230,230 Z", fill: "#f8fafc", stroke: "#1b2740", "stroke-width": 4, "stroke-linejoin": "round" }));
          const mudTop = { y: 90 };
          const mudPoly = s.el("polygon", { points: "", fill: "#c9a87a" });
          const res = s.el("polygon", { points: "", fill: "#78350f", opacity: 0 });
          v.append(mudPoly, res);
          v.append(s.el("path", { d: "M136,78 L364,78 L254,222 L246,222 Z", fill: "none", stroke: "#94a3b8", "stroke-width": 3, "stroke-dasharray": "2 0" }));
          const setMud = y => { // fluid level inside the paper cone, y from 90 (full) to 222 (empty)
            const half = (222 - y) / 144 * 114;
            mudPoly.setAttribute("points", `${250 - half},${y} ${250 + half},${y} 254,222 246,222`);
          };
          setMud(222);
          const drops = Array.from({ length: 6 }, () => { const d = s.el("ellipse", { cx: 250, cy: 350, rx: 5, ry: 8, fill: "#60a5fa", opacity: 0 }); v.append(d); return d; });
          let dripping = false;
          s.loop(t => drops.forEach((d, i) => { if (!dripping) { d.setAttribute("opacity", 0); return; } const u = (t * 1.4 + i / 6) % 1; d.setAttribute("cy", 350 + u * (Number(fil.getAttribute("y")) - 350)); d.setAttribute("opacity", 1); }));
          // labels with leader lines
          const lbl = (x, y, lx, ly, text, anchor) => { const g = s.el("g", { class: "later" }); g.append(s.el("line", { x1: x, y1: y, x2: lx, y2: ly, stroke: "#1b2740", "stroke-width": 2 }), s.el("circle", { cx: x, cy: y, r: 4, fill: "#1b2740" }), T(s, lx + (anchor === "start" ? 6 : -6), ly + 7, text, { anchor, size: 22, fill: UC })); return g; };
          const L = [lbl(330, 92, 420, 40, "Filterpapier", "start"), lbl(252, 205, 420, 170, "Rückstand", "start"), lbl(270, 290, 420, 300, "Trichter", "start"), lbl(250, 520, 100, 520, "Filtrat", "end")];
          v.append(...L);
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Was im Filter bleibt, heißt ", B(s, "Rückstand"), ". Was durchläuft, heißt ", B(s, "Filtrat"), ". Gelöste Stoffe (z. B. Salz) laufen mit durch!");
          const lf = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 200px", gap: "14px", alignItems: "center" } },
            s.h("div", null, ...["• Kaffeefilter: Das Kaffeepulver bleibt im Filter.", "• Teebeutel: Die Blätter bleiben drin, der Tee läuft heraus.", "• Staubsaugerbeutel: Die Luft geht durch, der Staub bleibt drin."].map(l => P(s, "small", l))),
            s.photo("kaffeefilter", { w: 200, h: 170, pos: "40% 50%" })));
          const btn = s.h("button", { class: "btn", onclick: () => run() }, "Nochmal filtrieren");
          let running = false;
          const run = async () => {
            if (running) return; running = true;
            s.sfx.whoosh(); fil.setAttribute("y", 560); fil.setAttribute("height", 0); res.setAttribute("opacity", 0);
            await s.tween({ from: 222, to: 92, dur: 600, update: y => setMud(y) });
            dripping = true; s.sound("tropfen", { vol: .6 });
            await s.tween({ from: 0, to: 1, dur: 3200, ease: "linear", update: t => { setMud(92 + 118 * t); fil.setAttribute("y", 560 - 120 * t); fil.setAttribute("height", 120 * t); res.setAttribute("points", "232,198 268,198 254,222 246,222"); res.setAttribute("opacity", Math.min(1, t * 1.5)); } });
            dripping = false; setMud(222); s.sfx.ding(); running = false;
          };
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, v,
            s.h("div", { class: "stack" }, P(s, "t", "Schlammwasser wird durch Filterpapier gegossen."), s.h("div", { class: "row" }, btn), merk, lf)));
          s.sfx.pop();
          s.step(async () => { await run(); s.say("Unten tropft klares Wasser heraus."); });
          s.step(async () => { for (const l of L) { s.sfx.pop(); await s.show(l, "fade"); } await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Eindampfen: Salz aus dem Meer",
        say: "Wenn Salzwasser verdampft, bleibt das Salz zurück. So gewinnt man Meersalz.",
        build(s) {
          // evaporating dish
          const v = s.svg(440, 330, { width: "100%", height: 300 });
          v.append(s.el("rect", { x: 160, y: 250, width: 120, height: 20, fill: "#6b7280" }), s.el("path", { d: "M130,250 L310,250 L290,320 L150,320 Z", fill: "#4b5563" }));
          const fl = s.el("path", { d: flamePath(220, 248, 50, 70), fill: "#3b82f6", opacity: .85 }); v.append(fl);
          s.loop(t => fl.setAttribute("transform", `translate(220 248) scale(${1 + Math.sin(t * 10) * .05},${1 + Math.sin(t * 7) * .08}) translate(-220 -248)`));
          v.append(s.el("path", { d: "M100,140 Q220,240 340,140", fill: "#f1f5f9", stroke: "#1b2740", "stroke-width": 4 }));
          const liquid = s.el("path", { d: "", fill: "#bfdbfe" }); v.append(liquid);
          const setLevel = y => { const q = Math.max(0, 1 - 4 * (y - 140) / 200), tt = (1 - Math.sqrt(q)) / 2, half = 120 - 240 * tt; liquid.setAttribute("d", `M${220 - half},${y} Q220,${380 - y} ${220 + half},${y} Z`); };
          setLevel(150);
          const crystals = Array.from({ length: 12 }, (_, i) => { const r = s.el("rect", { x: 172 + rnd(i, 1) * 90, y: 172 + rnd(i, 2) * 10, width: 9, height: 9, fill: "#fff", stroke: "#64748b", "stroke-width": 1.5, opacity: 0, transform: `rotate(${i * 13} ${176 + rnd(i, 1) * 90} ${176 + rnd(i, 2) * 10})` }); v.append(r); return r; });
          const steam = [180, 220, 260].map(x => { const p = s.el("path", { d: `M${x},130 q-10,-18 0,-36 q10,-18 0,-36`, fill: "none", stroke: "#94a3b8", "stroke-width": 4, "stroke-linecap": "round", opacity: 0 }); v.append(p); return p; });
          let steaming = false;
          s.loop(t => steam.forEach((p, i) => { p.setAttribute("opacity", steaming ? .8 : 0); p.setAttribute("transform", `translate(0,${-((t * 30 + i * 15) % 30)})`); }));
          const vl = T(s, 220, 30, "", { size: 22 }); v.append(vl);
          const c1 = s.h("div", { class: "card", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Eindampfen im Labor"), v,
            P(s, "small later", "Das Wasser verdampft, das Salz bleibt als Kristalle zurück."));
          const g2 = s.photo("salzgarten", { w: "100%", h: 220, pos: "50% 55%", caption: "Salzgarten in Indien" });
          const c2 = s.h("div", { class: "card later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Meersalz aus dem Salzgarten"), g2,
            P(s, "small", "Sonne und Wind lassen das Meerwasser langsam ", B(s, "verdunsten"), ". 1 Liter Nordseewasser enthält etwa ", B(s, "35 g Salz"), "."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, B(s, "Eindampfen"), " = mit Hitze, schnell. ", B(s, "Verdunsten"), " = unter 100 °C, langsam. In einer ", B(s, "Saline"), " wird salziges Wasser (Sole) eingedampft.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.1fr", gap: "20px", alignItems: "center", height: "100%" } }, c1, s.h("div", { class: "stack", style: { gap: "14px" } }, c2, merk)));
          s.sfx.pop();
          s.step(async () => {
            steaming = true; vl.textContent = "Salzwasser kocht"; s.sound("kochen", { vol: .45, dur: 3 });
            await s.tween({ from: 150, to: 189, dur: 3000, ease: "linear", update: y => { setLevel(y); crystals.forEach((c, i) => c.setAttribute("opacity", Math.max(0, Math.min(1, (y - 165 - i) / 10)))); } });
            steaming = false; vl.textContent = "Salz bleibt zurück"; setLevel(190); crystals.forEach(c => c.setAttribute("opacity", 1));
            s.sfx.success(); await s.show(c1.querySelector("p"), "up");
          });
          s.step(async () => { s.sound("wind", { vol: .35, dur: 3 }); await s.show(c2, "up"); s.say("In flachen Becken verdunstet das Meerwasser. Übrig bleibt das Salz."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Destillation",
        say: "Bei der Destillation wird eine Flüssigkeit verdampft und der Dampf wieder abgekühlt. So bekommt man reines Wasser.",
        build(s) {
          const v = s.svg(680, 560);
          // heater + flask
          const fl = s.el("path", { d: flamePath(130, 520, 44, 60), fill: "#3b82f6", opacity: .9 }); v.append(fl);
          s.loop(t => fl.setAttribute("transform", `translate(130 520) scale(${1 + Math.sin(t * 11) * .05},${1 + Math.sin(t * 8) * .1}) translate(-130 -520)`));
          v.append(s.el("rect", { x: 70, y: 520, width: 120, height: 14, fill: "#4b5563" }));
          v.append(s.el("circle", { cx: 130, cy: 380, r: 85, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }));
          v.append(s.el("path", { d: "M47,400 A85,85 0 0 0 213,400 Z", fill: "#bfdbfe" }));
          v.append(s.el("rect", { x: 112, y: 200, width: 36, height: 112, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }), s.el("rect", { x: 114, y: 300, width: 32, height: 16, fill: "#fff" }));
          // salt dots
          for (let i = 0; i < 10; i++) v.append(s.el("rect", { x: 85 + rnd(i, 1) * 90, y: 410 + rnd(i, 2) * 40, width: 6, height: 6, fill: "#fff", stroke: "#64748b" }));
          // thermometer
          v.append(s.el("rect", { x: 124, y: 150, width: 12, height: 110, rx: 6, fill: "#fff", stroke: "#1b2740", "stroke-width": 2 }), s.el("rect", { x: 127, y: 190, width: 6, height: 66, fill: "#dc2626" }));
          v.append(T(s, 145, 160, "100 °C", { anchor: "start", size: 20, fill: "#dc2626" }));
          // side tube + condenser (tilted)
          const x0 = 148, y0 = 222, x1 = 560, y1 = 380;
          const ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
          const cond = s.el("g", { transform: `translate(${x0},${y0}) rotate(${ang * 180 / Math.PI})` });
          cond.append(s.el("rect", { x: 110, y: -26, width: 260, height: 52, rx: 10, fill: "#cffafe", stroke: "#0e7490", "stroke-width": 3 }));
          cond.append(s.el("line", { x1: 0, y1: 0, x2: len, y2: 0, stroke: "#1b2740", "stroke-width": 12, "stroke-linecap": "round" }), s.el("line", { x1: 0, y1: 0, x2: len, y2: 0, stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round" }));
          cond.append(s.el("rect", { x: 330, y: 26, width: 14, height: 30, fill: "#0e7490" }), s.el("rect", { x: 136, y: -56, width: 14, height: 30, fill: "#0e7490" }));
          v.append(cond);
          const P2 = (d, o) => [x0 + Math.cos(ang) * d - Math.sin(ang) * o, y0 + Math.sin(ang) * d + Math.cos(ang) * o];
          const [ix, iy] = P2(337, 70), [ox, oy] = P2(143, -70);
          v.append(T(s, ix + 6, iy + 20, "kaltes Wasser rein", { anchor: "middle", size: 19, fill: "#0e7490" }), T(s, ox, oy - 8, "warmes Wasser raus", { anchor: "middle", size: 19, fill: "#0e7490" }));
          // collector
          const coll = s.el("rect", { x: 523, y: 540, width: 104, height: 0, fill: "#bfdbfe" });
          v.append(coll, s.el("path", { d: beakerPath(520, 410, 110, 140), fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
          // moving vapour + drips
          const vap = Array.from({ length: 10 }, () => { const c = s.el("circle", { r: 5, fill: "#94a3b8", opacity: 0 }); v.append(c); return c; });
          const drip = s.el("ellipse", { cx: x1 + 4, cy: y1 + 10, rx: 4, ry: 6, fill: "#60a5fa", opacity: 0 }); v.append(drip);
          const bubbles = Array.from({ length: 8 }, (_, i) => { const c = s.el("circle", { cx: 80 + i * 13, cy: 450, r: 4, fill: "#fff", opacity: 0 }); v.append(c); return c; });
          let on = false;
          s.loop(t => {
            vap.forEach((c, i) => { const u = (t * .45 + i / 10) % 1; let x, y; if (u < .25) { x = 130; y = 300 - u / .25 * 80; } else { const d = (u - .25) / .75 * len; [x, y] = P2(d, 0); } c.setAttribute("cx", x); c.setAttribute("cy", y); const vapour = u < .6; c.setAttribute("fill", vapour ? "#94a3b8" : "#3b82f6"); c.setAttribute("r", vapour ? 5 : 3.5); c.setAttribute("opacity", on ? .9 : 0); });
            bubbles.forEach((c, i) => { const u = (t * .8 + i / 8) % 1; c.setAttribute("cy", 455 - u * 50); c.setAttribute("opacity", on ? 1 - u : 0); });
            const u = (t * 1.5) % 1; drip.setAttribute("cy", y1 + 10 + u * (Number(coll.getAttribute("y")) - y1 - 10)); drip.setAttribute("opacity", on ? 1 : 0);
          });
          const lb = (x, y, t, a = "middle") => { const e = T(s, x, y, t, { anchor: a, size: 21, fill: UC }); e.classList.add("later"); return e; };
          const vapLbl = s.el("g", { class: "later" }); vapLbl.append(T(s, 104, 236, "Wasser-", { anchor: "end", size: 21, fill: UC }), T(s, 104, 260, "dampf", { anchor: "end", size: 21, fill: UC }));
          const pureLbl = s.el("g", { class: "later" }); pureLbl.append(T(s, 575, 500, "reines", { size: 21, fill: UC }), T(s, 575, 524, "Wasser", { size: 21, fill: UC }));
          const L = [lb(130, 490, "Salzwasser"), vapLbl, lb(330, 400, "Kühler", "middle"), pureLbl];
          v.append(...L);
          const steps = ["Erhitzen: Das Wasser siedet bei 100 °C.", "Der Wasserdampf steigt ins Rohr.", "Im Kühler wird er kalt und kondensiert.", "Reines Wasser tropft heraus – das Salz bleibt im Kolben."].map((t, i) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", alignItems: "flex-start", gap: "10px" } }, s.h("span", { class: "chip", style: { flex: "none" } }, String(i + 1)), P(s, "small", t)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "20px" } }, "Destillation trennt Stoffe mit verschiedener ", B(s, "Siedetemperatur"), ": verdampfen, dann kondensieren.");
          const lf = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), P(s, "small", "Destilliertes Wasser fürs Bügeleisen, Trinkwasser aus Meerwasser, Duftöle aus Blüten."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "680px 1fr", gap: "16px", alignItems: "center", height: "100%" } }, v, s.h("div", { class: "stack", style: { gap: "10px" } }, ...steps, merk, lf)));
          s.sfx.pop();
          s.step(async () => { on = true; s.sound("kochen", { vol: .45, dur: 3 }); s.show(L[0], "fade"); s.show(L[1], "fade"); await s.show(steps[0], "left"); s.sfx.pop(); await s.show(steps[1], "left"); });
          s.step(async () => { s.sfx.swoosh(); s.show(L[2], "fade"); await s.show(steps[2], "left"); s.sfx.pop(); s.show(L[3], "fade"); await s.show(steps[3], "left"); s.sound("tropfen", { vol: .6 }); await s.tween({ from: 0, to: 70, dur: 2000, update: hh => { coll.setAttribute("y", 540 - hh); coll.setAttribute("height", hh); } }); s.sfx.ding(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Chromatografie",
        say: "Schwarze Filzstiftfarbe ist ein Gemisch. Wasser wandert im Papier nach oben und nimmt die Farben unterschiedlich weit mit.",
        build(s) {
          const v = s.svg(430, 580);
          v.append(s.el("rect", { x: 63, y: 440, width: 234, height: 126, fill: "#dbeafe" }), s.el("path", { d: beakerPath(60, 200, 240, 372), fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
          v.append(s.el("line", { x1: 40, y1: 30, x2: 320, y2: 30, stroke: "#8a5a2b", "stroke-width": 8, "stroke-linecap": "round" }));
          v.append(s.el("rect", { x: 130, y: 30, width: 100, height: 470, fill: "#fff", stroke: "#94a3b8", "stroke-width": 2 }));
          const wet = s.el("rect", { x: 131, y: 499, width: 98, height: 0, fill: "#bfdbfe", opacity: .7 }); v.append(wet);
          const start = 410;
          const bands = [["#facc15", .92], ["#ec4899", .62], ["#22d3ee", .36]].map(([c, k]) => { const e = s.el("ellipse", { cx: 180, cy: start, rx: 30, ry: 12, fill: c, opacity: 0 }); e.k = k; v.append(e); return e; });
          const dot = s.el("ellipse", { cx: 180, cy: start, rx: 30, ry: 12, fill: "#1b2740" }); v.append(dot);
          v.append(T(s, 312, start + 7, "Startpunkt", { anchor: "start", size: 19, fill: "#5d6678" }), s.el("line", { x1: 214, y1: start, x2: 306, y2: start, stroke: "#5d6678", "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
          const front = T(s, 312, 0, "", { anchor: "start", size: 19, fill: "#1d5bd0" }); v.append(front);
          let running = false;
          const run = async () => {
            if (running) return; running = true;
            s.sfx.whoosh(); bands.forEach(b => { b.setAttribute("opacity", 0); b.setAttribute("cy", start); }); dot.setAttribute("opacity", 1); front.textContent = "";
            await s.tween({ from: 0, to: 1, dur: 4500, ease: "out", update: t => {
              const fy = 499 - t * 430; wet.setAttribute("y", fy); wet.setAttribute("height", 499 - fy);
              const fr = Math.max(0, Math.min(1, (start - fy) / (start - 69)));
              bands.forEach(b => { b.setAttribute("cy", start - fr * b.k * (start - 90)); b.setAttribute("opacity", Math.min(1, fr * 3)); b.setAttribute("ry", 12 + fr * 8); });
              dot.setAttribute("opacity", Math.max(0, 1 - fr * 3));
              front.setAttribute("y", fy + 6); front.textContent = t > .2 ? "Wasser" : "";
            } });
            s.sfx.success(); running = false;
          };
          const btn = s.h("button", { class: "btn", onclick: run }, "Nochmal starten");
          const how = s.h("div", { class: "card" }, s.h("span", { class: "exlabel" }, "So geht's"), P(s, "small", "Ein schwarzer Punkt auf Filterpapier, das Papier hängt ins Wasser. Das Wasser steigt im Papier hoch und nimmt die Farbstoffe mit – jeden verschieden weit."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Schwarz ist hier ein ", B(s, "Gemisch"), " aus mehreren Farbstoffen. Die Chromatografie trennt sie.");
          const lf = life(s, "• Filzstifte: Jeder hat sein eigenes Farbmuster.", "• Bunte Schokolinsen: Welche Farbstoffe stecken im Überzug?", "• Blattgrün: Blätter enthalten auch gelbe Farbstoffe.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", gap: "20px", alignItems: "center", height: "100%" } }, v, s.h("div", { class: "stack" }, how, s.h("div", { class: "row" }, btn), merk, lf)));
          s.sfx.pop();
          s.step(async () => { await run(); s.say("Aus Schwarz werden Gelb, Pink und Blau."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Die Kläranlage",
        say: "Unser Abwasser fließt ins Klärwerk. Dort wird es in mehreren Stufen gereinigt, bevor es in den Fluss darf.",
        build(s) {
          const v = s.svg(1100, 250);
          const st = [
            ["Rechen", 0], ["Sandfang", 0], ["Vorklär-", 0, "becken"], ["Belebungs-", 1, "becken"], ["Nachklär-", 1, "becken"], ["Fluss", 2]];
          const X = i => 20 + i * 180;
          const boxes = st.map(([n, typ, n2], i) => {
            const g = s.el("g", { class: "later" });
            const x = X(i);
            g.append(s.el("rect", { x, y: 40, width: 150, height: 110, rx: 14, fill: typ === 2 ? "#dbeafe" : "#fff", stroke: typ === 0 ? "#8a5a2b" : typ === 1 ? "#138a5a" : "#1d5bd0", "stroke-width": 4 }));
            if (i === 0) for (let k = 0; k < 7; k++) g.append(s.el("line", { x1: x + 30 + k * 15, y1: 58, x2: x + 30 + k * 15, y2: 132, stroke: "#4b5563", "stroke-width": 4 }));
            if (i === 1) { g.append(s.el("rect", { x: x + 12, y: 80, width: 126, height: 56, fill: "#c9a87a" })); for (let k = 0; k < 10; k++) g.append(s.el("circle", { cx: x + 22 + k * 11, cy: 128, r: 5, fill: "#a16207" })); }
            if (i === 2) { g.append(s.el("rect", { x: x + 12, y: 70, width: 126, height: 66, fill: "#d6c3a5" }), s.el("rect", { x: x + 12, y: 122, width: 126, height: 14, fill: "#78350f" })); }
            if (i === 3) { g.append(s.el("rect", { x: x + 12, y: 70, width: 126, height: 66, fill: "#cfe8d5" })); for (let k = 0; k < 9; k++) g.append(s.el("circle", { cx: x + 24 + (k * 37) % 110, cy: 84 + (k * 23) % 44, r: 5, fill: "#fff", stroke: "#138a5a", "stroke-width": 1.5 })); for (let k = 0; k < 5; k++) g.append(s.el("ellipse", { cx: x + 30 + k * 22, cy: 112 + (k % 2) * 10, rx: 6, ry: 3.5, fill: "#15803d" })); }
            if (i === 4) { g.append(s.el("rect", { x: x + 12, y: 70, width: 126, height: 66, fill: "#dbeafe" }), s.el("rect", { x: x + 12, y: 126, width: 126, height: 10, fill: "#15803d", opacity: .6 })); }
            if (i === 5) { g.append(s.el("path", { d: `M${x},110 q37,-16 75,0 t75,0 V150 H${x} Z`, fill: "#1d5bd0", opacity: .7 })); g.append(s.el("path", { d: `M${x + 30},88 q8,-8 16,0 q-8,8 -16,0 M${x + 46},88 l8,-6 v12 z`, fill: "#f97316" })); }
            g.append(T(s, x + 75, 186, n, { size: 21 }));
            if (n2) g.append(T(s, x + 75, 210, n2, { size: 21 }));
            if (i < 5) g.append(s.el("path", { d: `M${x + 154},95 h20 m-8,-8 l8,8 l-8,8`, fill: "none", stroke: "#1b2740", "stroke-width": 4, "stroke-linecap": "round" }));
            return g;
          });
          v.append(...boxes);
          const drop = s.el("path", { d: "M0,-14 C8,-2 10,4 0,10 C-10,4 -8,-2 0,-14 Z", fill: "#8a5a2b", opacity: 0 }); v.append(drop);
          const moveDrop = async (from, to, col) => { drop.setAttribute("opacity", 1); drop.setAttribute("fill", col); await s.tween({ from: X(from) + 75, to: X(to) + 75, dur: 500 * (to - from), update: x => drop.setAttribute("transform", `translate(${x},24)`) }); };
          const card = (lab, col, ...lines) => s.h("div", { class: "card later", style: { padding: "10px 14px", borderColor: col } }, s.h("span", { class: "exlabel", style: { color: col } }, lab), ...lines.map(l => P(s, "small", l)));
          const k1 = card("1 Mechanisch", "#8a5a2b", "Rechen: hält groben Müll zurück (Sieben).", "Sandfang und Vorklärbecken: Sand und Schlamm sinken nach unten (Sedimentieren).");
          const k2 = card("2 Biologisch", "#138a5a", "Im Belebungsbecken fressen winzige Bakterien den Schmutz. Luft wird eingeblasen.", "Im Nachklärbecken sinken die Bakterien als Schlamm ab.");
          const k3 = card("3 Chemisch", "#1d5bd0", "Ein besonderer Stoff bindet Phosphat, damit im Fluss nicht zu viele Algen wachsen.", "Danach darf das saubere Wasser in den Fluss.");
          const lf = s.h("div", { class: "life later", style: { gridColumn: "1 / -1", padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), P(s, "small", "Berlin hat 6 Klärwerke. Feuchttücher, Stoffreste und Essensreste gehören nicht in die Toilette – sie verstopfen Rohre und Pumpen!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px", justifyContent: "center" } }, v, s.h("div", { class: "cols3", style: { gap: "14px" } }, k1, k2, k3, lf)));
          s.sfx.pop();
          s.step(async () => { for (let i = 0; i < 3; i++) { s.sfx.count(i); await s.show(boxes[i], "pop"); } await moveDrop(0, 2, "#8a5a2b"); await s.show(k1, "up"); s.say("Erst die mechanische Reinigung."); });
          s.step(async () => { s.sound("bubbles", { vol: .5 }); for (let i = 3; i < 5; i++) { await s.show(boxes[i], "pop"); } await moveDrop(2, 4, "#a3a36a"); await s.show(k2, "up"); s.say("Dann arbeiten die Bakterien."); });
          s.step(async () => { s.sound("splash", { vol: .4 }); await s.show(boxes[5], "pop"); await moveDrop(4, 5, "#60a5fa"); s.sfx.success(); await s.show(k3, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 12b -------------------------------------------------------------- */
      {
        title: "Trennen in echt",
        say: "So sehen Trennverfahren in echt aus: im Labor, auf dem Schrottplatz und im Klärwerk.",
        build(s) {
          const items = [
            ["destillation", "50% 45%", "Destillation im Labor"],
            ["chromatografie", "50% 60%", "Chromatografie: Filzstiftfarben"],
            ["kaffeefilter", "40% 50%", "Filtrieren: der Kaffeefilter"],
            ["magnetkran", "50% 35%", "Ein Magnet am Kran hebt Eisenschrott"],
            ["rechen", "50% 50%", "Klärwerk: der Rechen hält Müll fest"],
            ["belebungsbecken", "50% 60%", "Belebungsbecken im Klärwerk Ruhleben"],
          ];
          const cards = items.map(([id, pos, cap]) => s.photo(id, { w: 340, h: 250, pos, caption: cap, cls: "later" }));
          const btn = later(s.soundBtn("bubbles", "So blubbert das Belebungsbecken"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "16px" } },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 340px)", gap: "16px 24px", justifyContent: "center" } }, ...cards),
            s.h("div", { class: "row", style: { justifyContent: "center" } }, btn)));
          s.step(async () => { s.sound("tropfen", { vol: .5 }); for (const i of [0, 1, 2]) { s.show(cards[i], "zoom"); await s.wait(200); } s.say("Destillieren, Chromatografie und Filtrieren."); });
          s.step(async () => { s.sound("magnet-klick"); for (const i of [3, 4, 5]) { s.show(cards[i], "zoom"); await s.wait(200); } s.say("Ein Magnetkran trennt Eisen. Im Klärwerk wird gesiebt, und Bakterien reinigen das Wasser."); });
          s.step(async () => { await s.show(btn, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Die Kerzenflamme",
        say: "Was brennt bei einer Kerze eigentlich? Nicht das feste Wachs – sondern der Wachsdampf.",
        build(s) {
          const v = s.svg(540, 600);
          const cx = 170;
          v.append(s.el("rect", { x: cx - 60, y: 400, width: 120, height: 200, fill: "#fef3c7", stroke: "#b8a77f", "stroke-width": 3 }));
          v.append(s.el("ellipse", { cx, cy: 402, rx: 46, ry: 9, fill: "#fde68a", stroke: "#ca8a04", "stroke-width": 2 }));
          const outer = s.el("path", { d: flamePath(cx, 392, 120, 300), fill: "#bfdbfe", opacity: .55, stroke: "#60a5fa", "stroke-width": 2 });
          const lum = s.el("path", { d: flamePath(cx, 380, 96, 262), fill: "#facc15" });
          const lum2 = s.el("path", { d: flamePath(cx, 372, 72, 200), fill: "#fb923c", opacity: .6 });
          const core = s.el("path", { d: flamePath(cx, 384, 40, 96), fill: "#1e3a8a", opacity: .85 });
          const fg = s.el("g"); fg.append(outer, lum, lum2, core); v.append(fg);
          v.append(s.el("line", { x1: cx, y1: 402, x2: cx, y2: 352, stroke: "#1b2740", "stroke-width": 5 }));
          s.loop(t => fg.setAttribute("transform", `translate(${cx} 392) scale(${1 + Math.sin(t * 7) * .02},${1 + Math.sin(t * 5.3) * .035}) translate(${-cx} -392)`));
          // wax vapour arrows up the wick
          const dots = Array.from({ length: 5 }, () => { const c = s.el("circle", { r: 4, cx, fill: "#ca8a04", opacity: 0 }); v.append(c); return c; });
          let flow = false;
          s.loop(t => dots.forEach((c, i) => { const u = (t * .7 + i / 5) % 1; c.setAttribute("cy", 400 - u * 80); c.setAttribute("fill", u < .5 ? "#ca8a04" : "#94a3b8"); c.setAttribute("opacity", flow ? 1 - u * .6 : 0); }));
          const lbl = (x, y, lx, ly, a, b) => { const g = s.el("g", { class: "later" }); g.append(s.el("line", { x1: x, y1: y, x2: lx - 8, y2: ly - 6, stroke: "#1b2740", "stroke-width": 2 }), s.el("circle", { cx: x, cy: y, r: 4, fill: "#1b2740" }), T(s, lx, ly, a, { anchor: "start", size: 22 }), T(s, lx, ly + 24, b, { anchor: "start", size: 19, weight: 600, fill: "#5d6678" })); return g; };
          const L = [
            lbl(cx + 52, 160, 300, 110, "Flammensaum", "bis 1.400 °C"),
            lbl(cx + 34, 250, 300, 220, "leuchtende Zone", "glühender Ruß"),
            lbl(cx + 8, 330, 300, 320, "dunkle Zone", "600 bis 800 °C"),
            lbl(cx + 28, 402, 300, 420, "flüssiges Wachs", "steigt im Docht hoch"),
          ];
          v.append(...L);
          const stepsTxt = ["Die Hitze schmilzt das Wachs.", "Das flüssige Wachs steigt im Docht nach oben.", "Dort verdampft es.", "Der Wachsdampf brennt!"];
          const steps = stepsTxt.map((t, i) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px" } }, s.h("span", { class: "chip", style: { flex: "none" } }, String(i + 1)), P(s, "t", t)));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Nicht das feste Wachs brennt, sondern der ", B(s, "Wachsdampf"), ". Außen ist die Flamme am heißesten – dort gibt es den meisten Sauerstoff.");
          const real = s.photo("kerze-flamme", { w: "100%", h: 170, pos: "40% 45%", caption: "Echte Kerzenflamme: leuchtet gelb" });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", gap: "16px", alignItems: "center", height: "100%" } }, v, s.h("div", { class: "stack", style: { gap: "12px" } }, real, ...steps, merk)));
          s.sound("match-strike");
          s.step(async () => { flow = true; for (let i = 0; i < 4; i++) { s.sfx.count(i * 2); await s.show(steps[i], "left"); } s.say("Der Wachsdampf brennt."); });
          s.step(async () => { for (let i = 3; i >= 0; i--) { s.sfx.pop(); await s.show(L[i], "fade"); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Feuer braucht drei Dinge",
        say: "Ein Feuer brennt nur, wenn Brennstoff, Sauerstoff und genug Hitze da sind. Fehlt eins, geht es aus.",
        build(s) {
          const v = s.svg(600, 520, { width: 540, height: 468 });
          const A = [270, 40], Bp = [40, 440], C = [500, 440];
          const side = (p, q, col, text, tx, ty, anchor) => { const g = s.el("g"); const line = s.el("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, "stroke-width": 14, "stroke-linecap": "round" }); g.append(line, T(s, tx, ty, text, { anchor, size: 24, fill: col })); g.line = line; return g; };
          const sF = side(Bp, C, "#8a5a2b", "Brennstoff", 270, 488, "middle");
          const sO = side(A, Bp, "#1d5bd0", "Sauerstoff", 120, 210, "end");
          const sZ = side(A, C, "#dc2626", "Zündtemperatur", 400, 190, "start");
          sO.querySelector("text").setAttribute("x", 130); sO.querySelector("text").setAttribute("y", 230);
          sZ.querySelector("text").setAttribute("x", 360); sZ.querySelector("text").setAttribute("y", 190);
          // fix label positions inside the svg
          sO.querySelector("text").setAttribute("text-anchor", "end");
          sO.querySelector("text").setAttribute("x", 140);
          sZ.querySelector("text").setAttribute("text-anchor", "start");
          sZ.querySelector("text").setAttribute("x", 392); sZ.querySelector("text").setAttribute("y", 230);
          v.append(sF, sO, sZ);
          const flame = s.el("g");
          flame.append(s.el("path", { d: flamePath(270, 380, 150, 230), fill: "#f97316" }), s.el("path", { d: flamePath(270, 380, 90, 150), fill: "#facc15" }));
          v.append(flame);
          let scale = 1;
          s.loop(t => flame.setAttribute("transform", `translate(270 380) scale(${scale * (1 + Math.sin(t * 8) * .04)},${scale * (1 + Math.sin(t * 6) * .07)}) translate(-270 -380)`));
          const sides = { Z: sZ, O: sO, F: sF };
          const result = P(s, "t", "Das Feuer brennt.");
          let out = false;
          const kill = async (key, text) => {
            if (out) return; out = true;
            sides[key].setAttribute("opacity", .2); if (key === "Z") s.sound("zischen", { vol: .7 }); else s.sfx.whoosh();
            await s.tween({ from: 1, to: 0, dur: 900, ease: "in", update: v => { scale = v; } });
            s.sfx.error(); result.innerHTML = ""; result.append(B(s, "Aus! "), text);
          };
          const relight = async () => { Object.values(sides).forEach(x => x.setAttribute("opacity", 1)); s.sound("match-strike"); out = false; await s.tween({ from: 0, to: 1, dur: 600, ease: "back", update: v => { scale = v; } }); result.textContent = "Das Feuer brennt."; };
          const bW = s.h("button", { class: "btn", onclick: () => kill("Z", "Wasser kühlt unter die Zündtemperatur.") }, "Wasser drauf");
          const bD = s.h("button", { class: "btn", onclick: () => kill("O", "Decke oder Sand halten den Sauerstoff fern.") }, "Löschdecke / Sand");
          const bH = s.h("button", { class: "btn", onclick: () => kill("F", "Ohne Brennstoff kein Feuer.") }, "Holz wegnehmen");
          const bN = s.h("button", { class: "btn solid", onclick: relight }, "Neu anzünden");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Fehlt eine Seite des ", B(s, "Branddreiecks"), ", geht das Feuer aus.");
          const warn = s.h("div", { class: "life later", style: { background: "#fde6e3", borderColor: "#f5a39a" } }, s.h("span", { class: "exlabel", style: { color: "var(--red)" } }, "Achtung"),
            P(s, "small", "Brennendes Fett oder Öl nie mit Wasser löschen – Deckel drauf! Bei einem Brand: raus und die Feuerwehr unter 112 rufen."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, v,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, bW, bD, bH, bN), result, merk, warn)));
          s.sfx.pop();
          s.step(async () => { await kill("Z", "Wasser kühlt unter die Zündtemperatur."); s.say("Wasser kühlt das Feuer ab."); });
          s.step(async () => { await relight(); await kill("O", "Decke oder Sand halten den Sauerstoff fern."); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { await relight(); s.sfx.pop(); await s.show(warn, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Eisen rostet",
        say: "Wir legen drei Eisennägel in drei Reagenzgläser und warten eine Woche. Nur einer rostet.",
        build(s) {
          const v = s.svg(560, 520);
          const tubes = [["nur trockene Luft", "air"], ["nur Wasser, ohne Luft", "water"], ["Wasser und Luft", "both"]].map(([lab, k], i) => {
            const x = 40 + i * 180, g = s.el("g");
            if (k === "water") g.append(s.el("rect", { x: x + 23, y: 120, width: 74, height: 290, fill: "#bfdbfe" }), s.el("rect", { x: x + 23, y: 108, width: 74, height: 14, fill: "#fde047" }));
            if (k === "both") g.append(s.el("rect", { x: x + 23, y: 270, width: 74, height: 140, fill: "#bfdbfe" }));
            if (k === "air") { g.append(s.el("rect", { x: x + 23, y: 370, width: 74, height: 40, fill: "#e5e7eb" })); for (let q = 0; q < 8; q++) g.append(s.el("circle", { cx: x + 32 + q * 8, cy: 382 + (q % 2) * 12, r: 4, fill: "#fff", stroke: "#94a3b8" })); }
            g.append(s.el("path", { d: `M${x + 20},70 V390 a40,40 0 0 0 80,0 V70`, fill: "none", stroke: "#1b2740", "stroke-width": 4 }));
            if (k !== "both") g.append(s.el("rect", { x: x + 14, y: 48, width: 92, height: 26, rx: 4, fill: "#78716c" }));
            const nail = s.el("g"); nail.append(s.el("polygon", { points: `${x + 56},120 ${x + 64},120 ${x + 61},400 ${x + 59},400`, fill: "#6b7280" }), s.el("rect", { x: x + 46, y: 112, width: 28, height: 9, rx: 3, fill: "#4b5563" }));
            g.append(nail);
            const rust = s.el("g", { opacity: 0 });
            if (k === "both") for (let q = 0; q < 12; q++) rust.append(s.el("ellipse", { cx: x + 60 + (rnd(q, 1) - .5) * 8, cy: 180 + q * 18, rx: 5 + rnd(q, 2) * 3, ry: 4, fill: q % 2 ? "#b45309" : "#9a3412" }));
            g.append(rust, T(s, x + 60, 470, lab.split(", ")[0], { size: 19 }));
            if (lab.includes(", ")) g.append(T(s, x + 60, 494, lab.split(", ")[1], { size: 19 }));
            const verdict = T(s, x + 60, 30, "", { size: 22 }); g.append(verdict);
            v.append(g);
            return { rust, verdict, k };
          });
          const day = s.h("p", { class: "big mono", style: { color: UC } }, "Tag 0");
          const eq = s.h("div", { class: "card later", style: { textAlign: "center" } }, P(s, "t", B(s, "Eisen + Sauerstoff + Wasser"), s.h("br"), "→ ", s.h("b", { style: { color: "#9a3412" } }, "Rost")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Eisen rostet nur, wenn ", B(s, "Sauerstoff und Wasser"), " zusammen da sind. Rost ist ein neuer Stoff.");
          const lf = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 190px", gap: "14px", alignItems: "center" } },
            s.h("div", null, ...["• Fahrradkette ölen – das Öl hält Wasser fern.", "• Gartenzaun streichen schützt das Eisen.", "• Schrauben mit Zinkschicht rosten kaum."].map(l => P(s, "small", l))),
            s.photo("rost-kette", { w: 190, h: 150, caption: "Rost" })));
          const btn = s.h("button", { class: "btn", onclick: () => run() }, "Eine Woche warten");
          let running = false;
          const run = async () => {
            if (running) return; running = true;
            tubes.forEach(tb => { tb.rust.setAttribute("opacity", 0); tb.verdict.textContent = ""; });
            for (let d = 1; d <= 7; d++) { day.textContent = "Tag " + d; s.sfx.count(d); tubes[2].rust.setAttribute("opacity", d / 7); await s.wait(350); }
            tubes.forEach(tb => { tb.verdict.textContent = tb.k === "both" ? "Rost!" : "kein Rost"; tb.verdict.setAttribute("fill", tb.k === "both" ? "#9a3412" : "#138a5a"); });
            s.sfx.ding(); running = false;
          };
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, v,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row" }, day, btn), eq, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await run(); s.say("Nur der Nagel mit Wasser und Luft ist rostig."); });
          s.step(async () => { s.sfx.pop(); await s.show(eq, "zoom"); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Mischen und Trennen im Alltag",
        say: "Mischen und Trennen machst du jeden Tag – in der Küche, beim Waschen und beim Müll.",
        build(s) {
          const mk = (title, chips, txt, id, pos) => s.h("div", { class: "card later", style: { padding: "8px 12px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", textAlign: "center" } },
            s.photo(id, { w: "100%", h: 150, pos }), s.h("b", { style: { fontSize: "22px" } }, title), s.h("div", { class: "row", style: { gap: "6px", justifyContent: "center" } }, ...chips.map(ch => s.h("span", { class: "chip", style: { fontSize: "17px" } }, ch))), P(s, "small", txt));
          const cards = [
            mk("Tee kochen", ["Lösung", "Filtrieren"], "Der Geschmack löst sich, die Blätter bleiben im Beutel.", "tee", "50% 40%"),
            mk("Kaffeefilter", ["Filtrieren"], "Das Pulver ist der Rückstand, der Kaffee das Filtrat.", "kaffeefilter", "40% 50%"),
            mk("Salatsoße", ["Emulsion"], "Öl und Essig mischen sich nur beim Schütteln.", "oel-essig", "45% 50%"),
            mk("Wäschetrockner", ["Sieben"], "Das Flusensieb fängt Fusseln auf.", "flusensieb", "50% 50%"),
            mk("Mülltrennung", ["Sortieren", "Magnet"], "Zu Hause sortieren wir, in der Anlage hilft ein Magnet.", "muelltonnen", "50% 88%"),
            mk("Meersalz", ["Verdunsten"], "Sonne und Wind trocknen Meerwasser in flachen Becken.", "salzgarten", "50% 55%"),
          ];
          s.add(s.h("div", { class: "cols3", style: { gap: "16px", height: "100%", alignContent: "center", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } }, cards));
          s.sfx.whoosh();
          s.step(async () => { s.sound("water-pour", { vol: .5 }); for (let i = 0; i < 3; i++) { await s.show(cards[i], "pop"); } s.say("Tee, Kaffee und Salatsoße."); });
          s.step(async () => { for (let i = 3; i < 6; i++) { s.sfx.count(i * 2); await s.show(cards[i], "pop"); } s.sound("kids-cheer", { vol: .5 }); s.say("Wäschetrockner, Mülltrennung und Meersalz."); });
        },
      },
    ],
  });
})();
