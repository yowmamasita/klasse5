/* Kapitel 1 – Zeit und Quellen (Geschichte, Zeitstrahl, v. Chr./n. Chr., Jahrhunderte, Quellen, Archäologie, Museen, Familiengeschichte)
   Alle Fakten geprüft (siehe Abschlussbericht): u. a. de.wikipedia.org – Jahr null, Jahrhundert, Büste der Nofretete,
   Museum für Vor- und Frühgeschichte (Berlin), Museumsinsel (Berlin), Geschichte Berlins, Berliner Mauer, Ötzi,
   Radiokohlenstoffdatierung, Dendrochronologie, Stolpersteine, Karl-Marx-Straße (Berlin), Berlin-Neukölln, Dionysius Exiguus. */
(() => {
  const P = { unit: "#1d5bd0", soft: "#e4ecfb", blue: "#1d5bd0", red: "#dc3b2a", green: "#138a5a", violet: "#7b4fd6", orange: "#ee7a1a", ink: "#1b2740", pencil: "#5d6678", yellow: "#ffd94a", line: "#c8d3de", skin: "#c98b5a", gold: "#d9a520", soil1: "#8a6a4a", soil2: "#a7825a", soil3: "#7b5b3c", soil4: "#b39470", sand: "#e3cc93" };
  const later = el => { el.classList.add("later"); return el; };
  const T = (s, x, y, text, a) => s.el("text", Object.assign({ x, y, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: P.ink, text }, a || {}));
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const life = (s, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const ex = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const b = (s, t) => s.h("b", null, t);
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };

  /* ---------- small drawings used several times ---------- */
  function clockFace(s, cx, cy, R) {
    const g = s.el("g");
    g.append(s.el("circle", { cx, cy, r: R + 10, fill: P.unit, opacity: .12 }));
    g.append(s.el("circle", { cx, cy, r: R, fill: "#fff", stroke: P.ink, "stroke-width": 6 }));
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, r1 = i % 3 ? R - 16 : R - 28;
      g.append(s.el("line", { x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1, x2: cx + Math.cos(a) * (R - 6), y2: cy + Math.sin(a) * (R - 6), stroke: P.ink, "stroke-width": i % 3 ? 3 : 6, "stroke-linecap": "round" }));
    }
    const hour = s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - R * 0.5, stroke: P.ink, "stroke-width": 10, "stroke-linecap": "round" });
    const min = s.el("line", { x1: cx, y1: cy, x2: cx, y2: cy - R * 0.8, stroke: P.red, "stroke-width": 6, "stroke-linecap": "round" });
    g.append(hour, min, s.el("circle", { cx, cy, r: 10, fill: P.ink }));
    // backwards arrow around the clock
    g.append(s.el("path", { d: `M${cx + R + 24} ${cy - 30} A ${R + 24} ${R + 24} 0 0 0 ${cx + 30} ${cy - R - 24}`, fill: "none", stroke: P.orange, "stroke-width": 6, "stroke-linecap": "round" }));
    g.append(s.el("path", { d: `M${cx + 30} ${cy - R - 24} l 16 -10 l -2 20 z`, fill: P.orange, stroke: P.orange, "stroke-width": 4, "stroke-linejoin": "round" }));
    g.set = (a) => {
      min.setAttribute("transform", `rotate(${a} ${cx} ${cy})`);
      hour.setAttribute("transform", `rotate(${a / 12} ${cx} ${cy})`);
    };
    return g;
  }

  /* source-type icons, 200 x 130 */
  function srcIcon(s, kind) {
    const svg = s.svg(200, 130);
    const k = (tag, a) => { const e = s.el(tag, a); svg.append(e); return e; };
    if (kind === "sach") {
      k("path", { d: "M70 20 Q60 30 64 44 Q40 60 44 92 Q50 120 80 122 Q110 120 116 92 Q120 60 96 44 Q100 30 90 20 Z", fill: "#c8794a", stroke: "#7a4220", "stroke-width": 3 });
      k("path", { d: "M50 70 Q80 80 110 70", stroke: "#7a4220", "stroke-width": 3, fill: "none" });
      k("path", { d: "M50 84 Q80 94 110 84", stroke: "#7a4220", "stroke-width": 3, fill: "none" });
      k("rect", { x: 140, y: 30, width: 8, height: 90, rx: 3, fill: "#8a5a2b" });
      k("path", { d: "M148 34 L176 26 Q184 44 176 62 L148 56 Z", fill: "#c98a3a", stroke: "#7a4a14", "stroke-width": 3 });
    } else if (kind === "bild") {
      k("rect", { x: 34, y: 14, width: 132, height: 104, rx: 6, fill: "#fff", stroke: P.ink, "stroke-width": 4 });
      k("rect", { x: 46, y: 26, width: 108, height: 80, fill: "#cfe3f7" });
      k("path", { d: "M46 106 L84 62 L108 88 L124 72 L154 106 Z", fill: "#6d8f4e" });
      k("circle", { cx: 132, cy: 44, r: 10, fill: P.yellow });
    } else if (kind === "schrift") {
      k("path", { d: "M50 16 L150 16 L150 112 Q100 124 50 112 Z", fill: "#f4e7c3", stroke: "#a0864a", "stroke-width": 3 });
      for (let i = 0; i < 6; i++) k("line", { x1: 64, y1: 34 + i * 13, x2: i % 2 ? 128 : 138, y2: 34 + i * 13, stroke: "#6b5a3a", "stroke-width": 3, "stroke-linecap": "round" });
      k("circle", { cx: 128, cy: 100, r: 10, fill: P.red });
    } else {
      k("circle", { cx: 58, cy: 74, r: 22, fill: P.skin });
      k("path", { d: "M26 126 Q58 92 90 126 Z", fill: P.violet });
      k("circle", { cx: 150, cy: 82, r: 18, fill: "#e0b48a" });
      k("path", { d: "M124 126 Q150 98 176 126 Z", fill: P.green });
      k("path", { d: "M86 14 L176 14 Q186 14 186 24 L186 44 Q186 54 176 54 L120 54 L104 68 L106 54 L86 54 Q76 54 76 44 L76 24 Q76 14 86 14 Z", fill: "#fff", stroke: P.ink, "stroke-width": 3 });
      [100, 128, 156].forEach(x => k("circle", { cx: x, cy: 34, r: 5, fill: P.ink }));
    }
    return svg;
  }

  Deck.unit({
    id: "u1", num: 1, title: "Zeit und Quellen", color: P.unit, soft: P.soft,
    subtitle: "Wie wir wissen, was früher war",
    blurb: "Zeitstrahl, v. Chr. und n. Chr., Quellen, Archäologie.",
    goals: ["Einen Zeitstrahl lesen und zoomen", "v. Chr. und n. Chr. verstehen – ohne Jahr 0", "Jahrhunderte richtig zählen", "Quellen und Darstellungen unterscheiden", "Wie Archäologen graben und datieren"],
    icon(svg, el) {
      svg.append(el("line", { x1: 8, y1: 46, x2: 62, y2: 46, stroke: "#1d5bd0", "stroke-width": 5, "stroke-linecap": "round" }));
      svg.append(el("path", { d: "M56 38 L66 46 L56 54", fill: "none", stroke: "#1d5bd0", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      [18, 34, 50].forEach((x, i) => svg.append(el("circle", { cx: x, cy: 46, r: 5, fill: ["#dc3b2a", "#ee7a1a", "#138a5a"][i] })));
      svg.append(el("path", { d: "M22 32 Q20 14 34 10 Q46 14 44 32 Z", fill: "#c8794a" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Was ist Geschichte?",
        say: "Geschichte ist alles, was früher passiert ist. Und die Frage: Woher wissen wir das eigentlich?",
        build(s) {
          const svg = s.svg(440, 520);
          const clock = clockFace(s, 210, 230, 160);
          const year = T(s, 210, 480, "heute", { "font-size": 44, "font-weight": 800, fill: P.unit });
          svg.append(clock, year);
          let ang = 0, speed = -40;
          s.loop((t, dt) => { ang += speed * dt; speed += (-40 - speed) * Math.min(1, dt * 1.5); clock.set(ang); });
          const cards = [
            ex(s, "Gestern", { class: "ex later" }, s.h("p", { class: "t" }, "Dein Frühstück von gestern ist schon ", b(s, "Vergangenheit"), ".")),
            ex(s, "9. November 1989", { class: "ex later" }, s.h("p", { class: "t" }, "In Berlin wird die ", b(s, "Mauer"), " geöffnet. Viele Menschen feiern auf der Straße.")),
            ex(s, "Vor über 5.000 Jahren", { class: "ex later" }, s.h("p", { class: "t" }, b(s, "Ötzi"), " wandert durch die Alpen. 1991 findet man ihn im Eis.")),
          ];
          const merk = s.h("div", { class: "merk later" }, b(s, "Geschichte"), " erzählt, was Menschen früher erlebt haben – und ", b(s, "woher wir das wissen"), ".");
          const right = s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("p", { class: "big a-up" }, "Geschichte = alles, was früher war"),
            ...cards, merk);
          const abs = { position: "absolute", left: 0, top: 0 };
          const ph1 = s.photo("mauerfall-1989", { w: 440, h: 520, pos: "50% 35%", caption: "Auf der Mauer am Brandenburger Tor, November 1989", cls: "later", style: abs });
          const ph2 = s.photo("oetzi-fundstelle", { w: 440, h: 520, pos: "50% 50%", caption: "Denkmal an Ötzis Fundstelle in den Alpen", cls: "later", style: abs });
          const stage = s.h("div", { style: { position: "relative", width: "440px", height: "520px" } }, svg, ph1, ph2);
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "440px 1fr", gap: "30px", alignItems: "center" }, stage, right));
          s.show(svg, "zoom"); s.sound("clock-tick", { vol: .5, dur: 2.5 });
          const jump = async (txt, i) => { speed = -900; s.sfx.whoosh(); year.textContent = txt; s.show(year, "pop"); await s.show(cards[i], "left"); };
          s.step(async () => { await jump("gestern", 0); s.sfx.pop(); s.say("Schon gestern ist Vergangenheit."); });
          s.step(async () => { svg.style.display = "none"; s.show(ph1, "zoom"); s.sound("crowd-cheer", { vol: .5 }); await jump("1989", 1); s.say("1989 wurde in Berlin die Mauer geöffnet."); });
          s.step(async () => { ph1.style.display = "none"; s.show(ph2, "zoom"); s.sound("wind", { vol: .4, dur: 4 }); await jump("vor 5.000 J.", 2); s.say("Ötzi lebte vor über fünftausend Jahren."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der Zeitstrahl",
        say: "Auf einem Zeitstrahl steht früher links und später rechts. Hier ist dein eigenes Leben.",
        build(s) {
          const svg = s.svg(1100, 300);
          const X = y => 70 + (y - 2015) * 80;
          const axis = later(s.el("line", { x1: 40, y1: 160, x2: 1060, y2: 160, stroke: P.ink, "stroke-width": 6, "stroke-linecap": "round" }));
          const head = later(s.el("path", { d: "M1056 146 L1084 160 L1056 174 Z", fill: P.ink }));
          svg.append(axis, head);
          const ticks = [];
          for (let y = 2015; y <= 2027; y++) {
            const g = later(s.el("g"));
            g.append(s.el("line", { x1: X(y), y1: 148, x2: X(y), y2: 172, stroke: P.ink, "stroke-width": 3 }));
            g.append(T(s, X(y), 200, String(y), { "font-size": 19, "font-weight": 600, fill: P.pencil }));
            svg.append(g); ticks.push(g);
          }
          const flag = (x, col, l1, l2, anchor, dx) => {
            const g = later(s.el("g"));
            const top = dx ? 40 : 104;
            g.append(s.el("line", { x1: x, y1: 160, x2: x, y2: top, stroke: col, "stroke-width": 4 }));
            g.append(s.el("circle", { cx: x, cy: 160, r: 11, fill: col }));
            g.append(s.el("path", dx ? { d: `M${x} 40 L${x + 26 * dx} 48 L${x} 56 Z`, fill: col } : { d: `M${x - 12} 100 L${x + 12} 100 L${x} 114 Z`, fill: col }));
            g.append(T(s, x + 34 * dx, 54, l1, { "text-anchor": anchor, fill: col, "font-size": 22 }));
            g.append(T(s, x + 34 * dx, 82, l2, { "text-anchor": anchor, "font-size": 19, "font-weight": 600, fill: P.ink }));
            svg.append(g); return g;
          };
          const f1 = flag(X(2016), P.orange, "um 2016", "Du wirst geboren", "start", 1);
          const f2 = flag(X(2022.6), P.green, "2022", "Einschulung, Klasse 1", "middle", 0);
          const f3 = flag(X(2026.6), P.unit, "2026", "Klasse 5 am ADO", "end", -1);
          const now = later(s.el("g"));
          now.append(s.el("path", { d: `M${X(2026.75)} 214 l -10 18 l 20 0 z`, fill: P.red }));
          now.append(T(s, X(2026.75), 258, "heute", { fill: P.red, "font-size": 22 }));
          svg.append(now);
          const c1 = s.h("div", { class: "card later" }, s.h("p", { class: "h2 blue" }, "← früher · später →"), s.h("p", { class: "small" }, "Links steht, was zuerst war. Rechts, was danach kam."));
          const c2 = s.h("div", { class: "card later" }, s.h("p", { class: "h2 blue" }, "Gleiche Abstände"), s.h("p", { class: "small" }, "Jeder Strich ist ein Jahr – wie die Zentimeter auf dem Lineal."));
          const c3 = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Dein ", b(s, "Stundenplan"), " ist auch ein Zeitstrahl: 1. Stunde, 2. Stunde, große Pause …"));
          s.add(root(s, "stack", { gap: "18px", justifyContent: "center" }, svg, s.h("div", { class: "cols3" }, c1, c2, c3)));
          s.show(axis, "draw"); s.show(head, "fade", 700); s.sound("pencil-write");
          (async () => { for (let i = 0; i < ticks.length; i++) { if (!s.alive) return; s.show(ticks[i], "pop"); s.sfx.count(i); await s.wait(70); } })();
          s.step(async () => { s.sfx.pop(); await s.show(f1, "down"); s.say("Ungefähr 2016 wirst du geboren."); });
          s.step(async () => { s.sound("school-bell", { vol: .4, dur: 2.2 }); await s.show(f2, "down"); s.say("2022 kommst du in die erste Klasse."); });
          s.step(async () => { s.sfx.pop(); await s.show(f3, "down"); s.sfx.ding(); s.show(now, "bounce"); s.say("Und 2026 beginnst du am Albrecht-Dürer-Gymnasium."); });
          s.step(async () => { s.sfx.whoosh(); await s.show([c1, c2, c3], "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Zoom durch die Zeit",
        say: "Wir zoomen heraus: von deinem Leben bis zur Steinzeit. Tippe auf die Knöpfe.",
        build(s) {
          const CW = 1100, CH = 350, AX = 290, L = 50, R = 1050;
          const { canvas, g } = s.canvas(CW, CH);
          const levels = [
            { span: 12, btn: "Dein Leben", cap: "Dein Leben: ungefähr 10 Jahre – das ist ein Jahrzehnt." },
            { span: 120, btn: "100 Jahre", cap: "Gut 100 Jahre: Das haben deine Urgroßeltern zum Teil noch erlebt." },
            { span: 2100, btn: "2.000 Jahre", cap: "Rund 2.000 Jahre: von Christi Geburt bis heute. Berlin ist noch keine 800 Jahre alt." },
            { span: 8000, btn: "8.000 Jahre", cap: "8.000 Jahre: Steinzeit-Bauern, Ötzi und Nofretete. Dein Leben ist nur noch ein Punkt ganz rechts." },
            { span: 3000000, btn: "3 Mio. Jahre", cap: "Vor 2,6 Millionen Jahren: die ersten Steinwerkzeuge. Alles andere quetscht sich rechts zusammen!" },
          ];
          const ev = [
            { age: 10, t: "um 2016", sub: "du wirst geboren", lvl: 0, row: 0, c: P.orange },
            { age: 4, t: "2022", sub: "Einschulung", lvl: 0, row: 1, c: P.green },
            { age: 0.4, t: "2026", sub: "Klasse 5 am ADO", lvl: 0, row: 2, c: P.unit },
            { age: 114, t: "1912", sub: "Rixdorf heißt jetzt Neukölln", lvl: 1, row: 1, c: P.violet },
            { age: 65, t: "1961", sub: "Bau der Berliner Mauer", lvl: 1, row: 2, c: P.red },
            { age: 57, t: "1969", sub: "Fernsehturm fertig", lvl: 1, row: 0, c: P.unit },
            { age: 37, t: "1989", sub: "die Mauer wird geöffnet", lvl: 1, row: 1, c: P.green },
            { age: 2025, t: "Jahr 1 n. Chr.", sub: "Start unserer Zählung", lvl: 2, row: 0, c: P.violet },
            { age: 1501, t: "525", sub: "Idee: ab Christi Geburt zählen", lvl: 2, row: 2, c: P.orange },
            { age: 789, t: "1237", sub: "Cölln erstmals erwähnt", lvl: 2, row: 1, c: P.red },
            { age: 3370, t: "um 1340 v. Chr.", sub: "Büste der Nofretete", lvl: 3, row: 1, c: P.unit },
            { age: 5200, t: "vor über 5.000 J.", sub: "Ötzi stirbt in den Alpen", lvl: 3, row: 0, c: P.green },
            { age: 7525, t: "ab 5500 v. Chr.", sub: "erste Bauern bei uns", lvl: 3, row: 2, c: P.orange },
            { age: 2600000, t: "vor 2,6 Mio. J.", sub: "erste Steinwerkzeuge", lvl: 4, row: 1, c: P.pencil },
          ];
          let span = 12, lvl = 0, fade = 1;
          const xOf = age => R - (age / span) * (R - L);
          const font = (w, px) => `${w} ${px}px "Atkinson Hyperlegible", system-ui, sans-serif`;
          const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
          const draw = () => {
            g.clearRect(0, 0, CW, CH);
            // ticks
            const steps = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
            const st = steps.find(v => span / v <= 6) || 1000000;
            g.strokeStyle = P.ink; g.fillStyle = P.pencil; g.lineWidth = 3; g.font = font(600, 19); g.textAlign = "center";
            for (let a = st; a <= span * 1.0001; a += st) {
              const x = xOf(a); if (x < L - 1) break;
              g.beginPath(); g.moveTo(x, AX - 10); g.lineTo(x, AX + 10); g.stroke();
              g.fillText("vor " + Deck.fmt(a) + " J.", Math.max(L + 50, x), AX + 38);
            }
            g.lineWidth = 6; g.beginPath(); g.moveTo(L - 20, AX); g.lineTo(R + 10, AX); g.stroke();
            g.fillStyle = P.ink; g.beginPath(); g.moveTo(R + 34, AX); g.lineTo(R + 8, AX - 14); g.lineTo(R + 8, AX + 14); g.fill();
            g.fillStyle = P.red; g.font = font(700, 20); g.textAlign = "right"; g.fillText("heute", R + 40, AX + 38);
            // dots
            for (const e of ev) {
              const x = xOf(e.age); if (x < L - 5) continue;
              g.fillStyle = e.c; g.globalAlpha = 0.9; g.beginPath(); g.arc(x, AX, 7, 0, 7); g.fill(); g.globalAlpha = 1;
            }
            // labels of the current level
            for (const e of ev) {
              if (e.lvl !== lvl) continue;
              const x = xOf(e.age); if (x < L - 5) continue;
              g.globalAlpha = fade;
              g.font = font(700, 21); const w1 = g.measureText(e.t).width;
              g.font = font(400, 19); const w2 = g.measureText(e.sub).width;
              const w = Math.max(w1, w2) + 24, hh = 58, y = 14 + e.row * 74;
              const bx = Math.max(8, Math.min(CW - 8 - w, x - w / 2));
              g.strokeStyle = e.c; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y + hh); g.lineTo(x, AX - 8); g.stroke();
              rr(bx, y, w, hh, 10); g.fillStyle = "#fff"; g.fill(); g.lineWidth = 3; g.stroke();
              g.textAlign = "left"; g.fillStyle = e.c; g.font = font(700, 21); g.fillText(e.t, bx + 12, y + 25);
              g.fillStyle = P.ink; g.font = font(400, 19); g.fillText(e.sub, bx + 12, y + 49);
              g.globalAlpha = 1;
            }
          };
          const cap = s.h("p", { class: "t", style: { minHeight: "68px" } }, levels[0].cap);
          const btns = levels.map((L0, i) => s.h("button", { class: "btn" + (i === 0 ? " solid" : ""), onclick: () => go(i) }, L0.btn));
          let busy = Promise.resolve();
          const go = async (i) => {
            if (i === lvl && span === levels[i].span) return;
            s.sfx.whoosh(); btns.forEach((x, j) => x.classList.toggle("solid", j === i));
            const from = Math.log(span), to = Math.log(levels[i].span);
            lvl = i; fade = 0; cap.textContent = levels[i].cap; s.show(cap, "fade");
            await s.tween({ from, to, dur: 1300, ease: "inOut", update: v => { span = Math.exp(v); draw(); } });
            await s.tween({ from: 0, to: 1, dur: 350, update: v => { fade = v; draw(); } });
            s.sfx.pop(); s.say(levels[i].cap);
          };
          draw();
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, canvas, s.h("div", { class: "row", style: { justifyContent: "center", gap: "12px" } }, btns), cap));
          s.show(canvas, "fade"); s.sfx.whoosh();
          [1, 2, 3, 4].forEach(i => s.step(async () => { await go(i); }));
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Jahrzehnt, Jahrhundert …",
        say: "Zehn Jahre sind ein Jahrzehnt, hundert Jahre ein Jahrhundert und tausend Jahre ein Jahrtausend.",
        build(s) {
          const rowSvg = (h) => s.svg(560, h);
          const sq = (svg, x, y, w, col) => { const r = s.el("rect", { x, y, width: w, height: w, rx: Math.min(4, w / 4), fill: col }); svg.append(r); return r; };
          // row 1
          const s1 = rowSvg(50); sq(s1, 4, 5, 40, P.orange);
          // row 2
          const s2 = rowSvg(50); for (let i = 0; i < 10; i++) sq(s2, 4 + i * 46, 5, 40, i === 9 ? P.red : P.orange);
          // row 3: 10 x 10
          const s3 = rowSvg(132); const cells3 = [];
          for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) cells3.push(sq(s3, 4 + c * 13, 2 + r * 13, 11, r === 0 ? P.red : P.green));
          s3.append(T(s, 300, 60, "rot = dein Leben", { "text-anchor": "start", fill: P.red, "font-size": 20 }));
          s3.append(T(s, 300, 88, "bis jetzt", { "text-anchor": "start", fill: P.red, "font-size": 20 }));
          // row 4: 10 blocks of 100
          const s4 = rowSvg(56); const blocks = [];
          for (let k = 0; k < 10; k++) {
            const gg = s.el("g"); fb(gg);
            for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) gg.append(s.el("rect", { x: 4 + k * 55 + c * 5, y: 3 + r * 5, width: 4.2, height: 4.2, fill: P.violet }));
            s4.append(gg); blocks.push(gg);
          }
          const txt = (a, c) => s.h("div", null, s.h("p", { class: "t" }, a), s.h("p", { class: "small pencil" }, c));
          const rows = [
            [s1, txt(s.h("span", null, b(s, "1 Jahr")), "Von einem Geburtstag bis zum nächsten.")],
            [s2, txt(s.h("span", null, b(s, "10 Jahre"), " = 1 ", s.h("span", { class: "hl" }, "Jahrzehnt")), "So alt bist du jetzt! Die 2010er-Jahre sind ein Jahrzehnt.")],
            [s3, txt(s.h("span", null, b(s, "100 Jahre"), " = 1 ", s.h("span", { class: "hl" }, "Jahrhundert")), "Ein 100. Geburtstag ist ganz selten – das ist ein ganzes Jahrhundert.")],
            [s4, txt(s.h("span", null, b(s, "1.000 Jahre"), " = 1 ", s.h("span", { class: "hl" }, "Jahrtausend")), "So alt ist nicht einmal Berlin: Cölln wird 1237 zum ersten Mal erwähnt.")],
          ].map(([g1, t1]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center" } }, g1, t1));
          s.add(root(s, "stack", { gap: "22px", justifyContent: "center" }, ...rows));
          s.show(rows[0], "left"); s.sfx.pop();
          s.step(async () => { s.show(rows[1], "left"); for (let i = 0; i < 10; i++) { s.sfx.count(i); await s.wait(60); } });
          s.step(async () => { s.show(rows[2], "left"); s.sfx.whoosh(); cells3.forEach((c, i) => { c.style.opacity = 0; s.tween({ from: 0, to: 1, dur: 200, delay: i * 8, update: v => c.style.opacity = v }); }); await s.wait(1000); s.sfx.ding(); s.say("Die roten Kästchen: so viel von einem Jahrhundert hast du schon erlebt."); });
          s.step(async () => { s.show(rows[3], "left"); for (let i = 0; i < 10; i++) { s.show(blocks[i], "pop", i * 90); } for (let i = 0; i < 10; i++) { s.sfx.count(i + 2); await s.wait(90); } s.sfx.success(); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Vor und nach Christi Geburt",
        say: "Unsere Jahre zählen ab Christi Geburt. Davor zählen wir rückwärts: vor Christus.",
        build(s) {
          const svg = s.svg(1100, 330);
          const X = y => 550 + y * 0.135, AY = 170;
          const axis = s.el("line", { x1: 30, y1: AY, x2: 1060, y2: AY, stroke: P.ink, "stroke-width": 6, "stroke-linecap": "round" });
          const head = s.el("path", { d: `M1056 ${AY - 14} L1084 ${AY} L1056 ${AY + 14} Z`, fill: P.ink });
          svg.append(axis, head);
          [-3000, -2000, -1000, 1000, 2000].forEach(y => {
            svg.append(s.el("line", { x1: X(y), y1: AY - 10, x2: X(y), y2: AY + 10, stroke: P.ink, "stroke-width": 3 }));
            svg.append(T(s, X(y), AY + 36, y < 0 ? `${Deck.fmt(-y)} v. Chr.` : `${Deck.fmt(y)} n. Chr.`, { "font-size": 19, "font-weight": 600, fill: P.pencil }));
          });
          const star = s.el("path", { d: "M0 -22 L6 -7 L22 -7 L9 3 L14 19 L0 9 L-14 19 L-9 3 L-22 -7 L-6 -7 Z", fill: P.yellow, stroke: P.orange, "stroke-width": 3, transform: `translate(550 ${AY})` });
          svg.append(star, T(s, 550, AY + 36, "Christi Geburt", { fill: P.orange, "font-size": 20 }));
          // count arrows
          const arR = later(s.el("path", { d: `M570 ${AY + 72} L1040 ${AY + 72}`, stroke: P.green, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
          const arRh = later(s.el("path", { d: `M1036 ${AY + 60} L1058 ${AY + 72} L1036 ${AY + 84} Z`, fill: P.green }));
          const arRt = later(T(s, 800, AY + 110, "n. Chr.: 1, 2, 3 … vorwärts", { fill: P.green, "font-size": 21 }));
          const arL = later(s.el("path", { d: `M530 ${AY + 72} L60 ${AY + 72}`, stroke: P.red, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
          const arLh = later(s.el("path", { d: `M64 ${AY + 60} L42 ${AY + 72} L64 ${AY + 84} Z`, fill: P.red }));
          const arLt = later(T(s, 300, AY + 110, "v. Chr.: 1, 2, 3 … rückwärts", { fill: P.red, "font-size": 21 }));
          svg.append(arR, arRh, arRt, arL, arLh, arLt);
          const pin = (y, row, col, t1, t2) => {
            const g = later(s.el("g")); const ty = row === 0 ? 30 : 88;
            g.append(s.el("line", { x1: X(y), y1: ty + 34, x2: X(y), y2: AY - 8, stroke: col, "stroke-width": 3 }));
            g.append(s.el("circle", { cx: X(y), cy: AY, r: 9, fill: col }));
            g.append(T(s, X(y), ty, t1, { fill: col, "font-size": 20 }));
            g.append(T(s, X(y), ty + 24, t2, { "font-size": 19, "font-weight": 600 }));
            svg.append(g); return g;
          };
          const pins = [pin(-3200, 1, P.green, "um 3200 v. Chr.", "Ötzi"), pin(-1340, 0, P.unit, "um 1340 v. Chr.", "Nofretete-Büste"), pin(1237, 1, P.red, "1237 n. Chr.", "Cölln erwähnt"), pin(2026, 0, P.violet, "2026", "heute")];
          const exA = ex(s, "Rückwärts zählen", { class: "ex later" }, s.h("p", { class: "t" }, b(s, "3200 v. Chr."), " ist ", b(s, "älter"), " als ", b(s, "1340 v. Chr."), " – vor Christus gilt: Je größer die Zahl, desto länger her."));
          const exB = s.h("div", { class: "merk later" }, "Die Zählung ab Christi Geburt hat ein Mönch namens ", b(s, "Dionysius"), " im Jahr ", b(s, "525"), " vorgeschlagen.");
          s.add(root(s, "stack", { gap: "16px", justifyContent: "center" }, svg, s.h("div", { class: "cols" }, exA, exB)));
          s.show(svg, "fade"); s.show(star, "pop"); s.sfx.chord([0, 4, 7]);
          s.step(async () => { s.sfx.zap(); s.show(arR, "draw"); await s.wait(700); s.show([arRh, arRt], "pop"); for (let i = 0; i < 3; i++) { s.sfx.count(i + 4); await s.wait(160); } s.say("Nach Christus zählen wir vorwärts."); });
          s.step(async () => { s.sfx.zap(); s.show(arL, "draw"); await s.wait(700); s.show([arLh, arLt], "pop"); for (let i = 0; i < 3; i++) { s.sfx.count(i + 4); await s.wait(160); } s.say("Vor Christus zählen wir rückwärts."); });
          s.step(async () => { for (const p of pins) { s.sfx.pop(); s.show(p, "down"); await s.wait(260); } });
          s.step(async () => { s.sfx.ding(); s.show(exA, "up"); await s.wait(300); await s.show(exB, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Es gibt kein Jahr 0",
        say: "Achtung, Falle: Ein Jahr null gibt es nicht. Auf das Jahr 1 vor Christus folgt sofort das Jahr 1 nach Christus.",
        build(s) {
          const svg = s.svg(1100, 200);
          const names = ["3 v. Chr.", "2 v. Chr.", "1 v. Chr.", "Jahr 0?", "1 n. Chr.", "2 n. Chr.", "3 n. Chr."];
          const W0 = 138, G = 12, x0 = (1100 - 7 * W0 - 6 * G) / 2;
          const boxes = names.map((n, i) => {
            const g = s.el("g");
            const zero = i === 3;
            g.append(s.el("rect", { x: x0 + i * (W0 + G), y: 50, width: W0, height: 90, rx: 14, fill: zero ? "#fff" : i < 3 ? "#fde3df" : "#dff3e8", stroke: zero ? P.pencil : i < 3 ? P.red : P.green, "stroke-width": 3, "stroke-dasharray": zero ? "8 6" : null }));
            g.append(T(s, x0 + i * (W0 + G) + W0 / 2, 103, n, { fill: zero ? P.pencil : i < 3 ? P.red : P.green, "font-size": 22 }));
            svg.append(g); return g;
          });
          const cross = later(s.el("g"));
          const cx = x0 + 3 * (W0 + G) + W0 / 2;
          cross.append(s.el("path", { d: `M${cx - 50} 56 L${cx + 50} 134 M${cx + 50} 56 L${cx - 50} 134`, stroke: P.red, "stroke-width": 10, "stroke-linecap": "round" }));
          svg.append(cross);
          const sil = later(s.el("g"));
          svg.append(sil);
          const pod = s.svg(240, 150);
          [[80, 40, 70, 110, "1"], [10, 70, 70, 80, "2"], [150, 90, 70, 60, "3"]].forEach(([x, y, w, h, t]) => { pod.append(s.el("rect", { x, y, width: w, height: h, fill: t === "1" ? P.yellow : "#dfe6ee", stroke: P.ink, "stroke-width": 3 })); pod.append(T(s, x + w / 2, y + 36, t + ".", { "font-size": 26, "font-weight": 800 })); });
          const exA = ex(s, "Wie bei der Siegerehrung", { class: "ex later", style: { display: "grid", gridTemplateColumns: "240px 1fr", gap: "14px", alignItems: "center" } }, pod, s.h("p", { class: "t" }, "Platz 1, Platz 2, Platz 3 – einen ", b(s, "Platz 0"), " gibt es nicht. Jahre werden genauso gezählt."));
          exA.firstChild.style.gridColumn = "1 / -1";
          const cnt = s.h("span", { class: "mono", style: { font: "800 40px var(--f-display)", color: "var(--unit)" } }, "0");
          const exB = ex(s, "Nachgezählt", { class: "ex later" }, s.h("p", { class: "t" }, "Ein Kind wird am 1.1. im Jahr ", b(s, "5 v. Chr."), " geboren. Am 1.1. im Jahr ", b(s, "5 n. Chr."), " wird es …"), s.h("p", { class: "t" }, cnt, " Jahre alt – nicht 10!"));
          const merk = s.h("div", { class: "merk later" }, "Es gibt ", b(s, "kein Jahr 0"), ". Nach dem 31.12. im Jahr 1 v. Chr. kam gleich der 1.1. im Jahr 1 n. Chr.");
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, svg, s.h("div", { class: "cols" }, exA, exB), merk));
          s.show(boxes, "pop"); s.sfx.pop();
          s.step(async () => { s.sfx.error(); await s.show(cross, "pop"); s.say("Ein Jahr null gibt es nicht!"); });
          s.step(async () => {
            s.sfx.boing();
            await s.tween({ from: 1, to: 0, dur: 400, update: v => { boxes[3].style.opacity = v; cross.style.opacity = v; } });
            boxes[3].style.display = "none"; cross.style.display = "none";
            s.sfx.snap();
            await s.tween({ from: 0, to: 1, dur: 600, ease: "back", update: v => { boxes.forEach((bx, i) => { if (i < 3) bx.setAttribute("transform", `translate(${v * (W0 + G) / 2} 0)`); if (i > 3) bx.setAttribute("transform", `translate(${-v * (W0 + G) / 2} 0)`); }); } });
            sil.innerHTML = "";
            sil.append(s.el("path", { d: `M${cx} 146 l -9 14 l 18 0 z`, fill: P.orange }));
            sil.append(T(s, cx, 194, "31.12. → 1.1.", { fill: P.orange, "font-size": 21 }));
            s.show(sil, "pop"); s.sfx.fanfare(); s.confetti(590, 200, 60);
          });
          s.step(async () => { s.sound("applause", { vol: .4, dur: 3 }); await s.show(exA, "up"); });
          s.step(async () => { s.show(exB, "up"); await s.wait(300); for (let i = 1; i <= 9; i++) { cnt.textContent = i; s.sfx.count(i); await s.wait(170); } s.say("Es wird neun Jahre alt, nicht zehn."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Welches Jahrhundert?",
        say: "2026 liegt im 21. Jahrhundert. Schiebe den Regler und finde das Jahrhundert für jedes Jahr.",
        build(s) {
          const yearEl = s.h("span", { class: "huge mono blue" }, "2026");
          const cenEl = s.h("p", { class: "big" }, "21. Jahrhundert");
          const formula = s.h("p", { class: "t" }, "");
          const rangeEl = s.h("p", { class: "t pencil" }, "");
          const strip = s.svg(1100, 96);
          const BW = 48, BG = 3, sx0 = (1100 - 21 * BW - 20 * BG) / 2;
          const cells = [];
          for (let c = 1; c <= 21; c++) {
            const x = sx0 + (c - 1) * (BW + BG);
            const r = s.el("rect", { x, y: 8, width: BW, height: 54, rx: 8, fill: "#fff", stroke: P.line, "stroke-width": 2 });
            const t = T(s, x + BW / 2, 42, c + ".", { "font-size": 19 });
            strip.append(r, t); cells.push({ r, t, x });
          }
          const marker = s.el("path", { d: "M0 0 l -10 16 l 20 0 z", fill: P.red });
          strip.append(marker);
          const set = (y) => {
            const c = Math.ceil(y / 100);
            yearEl.textContent = y; cenEl.textContent = c + ". Jahrhundert";
            const h = Math.floor(y / 100);
            formula.innerHTML = y % 100 === 0 ? `<b>${y}</b> ist das <b>letzte</b> Jahr vom ${c}. Jahrhundert.` : `Hunderter <b>${h}</b> + 1 = <b>${c}.</b> Jahrhundert`;
            rangeEl.textContent = `Das ${c}. Jahrhundert: ${(c - 1) * 100 + 1} bis ${c * 100}`;
            cells.forEach((k, i) => { const on = i === c - 1; k.r.setAttribute("fill", on ? P.unit : "#fff"); k.r.setAttribute("stroke", on ? P.unit : P.line); k.t.setAttribute("fill", on ? "#fff" : P.ink); });
            const x = cells[c - 1].x + (((y - 1) % 100) + 0.5) / 100 * BW;
            marker.setAttribute("transform", `translate(${x} 70)`);
          };
          const sl = s.slider({ label: "Jahr (n. Chr.)", min: 1, max: 2100, value: 2026, fmt: v => String(v), onInput: v => set(v) });
          set(2026);
          const exs = [
            ex(s, "1989", { class: "ex later" }, s.h("p", { class: "t" }, "Mauer offen → 19 + 1 = ", b(s, "20.\u00a0Jh."))),
            ex(s, "1237", { class: "ex later" }, s.h("p", { class: "t" }, "Cölln erwähnt → 12 + 1 = ", b(s, "13.\u00a0Jh."))),
            ex(s, "2000", { class: "ex later" }, s.h("p", { class: "t" }, "Falle! Noch das ", b(s, "20.\u00a0Jh."), " – das letzte Jahr.")),
          ];
          const merk = s.h("div", { class: "merk later" }, "Hunderter + 1 = Jahrhundert. ", b(s, "2026"), " gehört zum ", b(s, "21. Jahrhundert"), " (2001 bis 2100).");
          const top = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, yearEl, cenEl),
            s.h("div", { class: "stack", style: { gap: "8px" } }, formula, rangeEl, sl));
          s.add(root(s, "stack", { gap: "12px", justifyContent: "center" }, top, strip, s.h("div", { class: "cols3" }, ...exs), merk));
          s.show(yearEl, "pop"); s.sfx.pop();
          const demo = async (y, i) => {
            const from = Number(sl.input.value);
            await s.tween({ from, to: y, dur: 900, update: v => { const r = Math.round(v); sl.input.value = r; sl.querySelector(".mono").textContent = r; set(r); } });
            s.sfx.ding(); await s.show(exs[i], "up");
          };
          s.step(async () => { await demo(1989, 0); s.say("1989 gehört zum 20. Jahrhundert."); });
          s.step(async () => { await demo(1237, 1); s.say("1237 gehört zum 13. Jahrhundert."); });
          s.step(async () => { await demo(2000, 2); s.sfx.boing(); s.say("Das Jahr 2000 ist das letzte Jahr des 20. Jahrhunderts."); });
          s.step(async () => { await s.tween({ from: 2000, to: 2026, dur: 600, update: v => { const r = Math.round(v); sl.input.value = r; sl.querySelector(".mono").textContent = r; set(r); } }); s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Quellen: Spuren von früher",
        say: "Quellen sind Spuren aus der Vergangenheit. Es gibt Sachquellen, Bildquellen, Schriftquellen und mündliche Quellen.",
        build(s) {
          const data = [
            ["sach", "Sachquellen", "Gegenstände", ["Ötzis Kupferbeil", "eine alte Münze", "Omas Kaffeemühle"]],
            ["bild", "Bildquellen", "Bilder und Fotos", ["Foto vom Mauerfall 1989", "ein altes Gemälde", "Opas Klassenfoto"]],
            ["schrift", "Schriftquellen", "alles Geschriebene", ["die Urkunde von 1237 über Cölln", "ein Tagebuch", "ein altes Zeugnis"]],
            ["muend", "Mündliche Quellen", "Erzähltes", ["Oma erzählt von früher", "Interview mit Zeitzeugen", "Lieder, die man weitersingt"]],
          ];
          const po = (pos, caption) => ({ w: "100%", h: 170, pos, caption });
          const pics = { sach: () => s.photo("muenze-roemisch", po("50% 50%", "Römische Münze")), bild: () => s.photo("mauerfall-tor", po("50% 40%", "Foto vom Mauerfall")), schrift: () => s.photo("urkunde-siegel", po("50% 80%", "Urkunde mit Siegel")) };
          const cards = data.map(([k, t, sub, list]) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "14px 14px 16px" } },
            pics[k] ? pics[k]() : s.h("div", { style: { height: "170px", display: "flex", alignItems: "center" } }, srcIcon(s, k)), s.h("p", { class: "h2", style: { color: "var(--unit)", fontSize: "26px", textAlign: "center" } }, t), s.h("p", { class: "small pencil", style: { textAlign: "center" } }, sub),
            s.h("ul", { class: "small", style: { margin: "4px 0 0", paddingLeft: "22px", alignSelf: "stretch" } }, list.map(x => s.h("li", null, x)))));
          const merk = s.h("div", { class: "merk later" }, "Eine ", b(s, "Quelle"), " stammt aus der Zeit, um die es geht. Sie ist eine Spur, die Menschen hinterlassen haben.");
          s.add(root(s, "stack", { gap: "18px", justifyContent: "center" }, s.h("div", { class: "cols4" }, cards), merk));
          s.show(cards[0], "up"); s.sound("coins", { vol: .6 });
          s.step(async () => { s.sound("camera-shutter"); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("pencil-write"); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[3], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Quelle oder Darstellung?",
        say: "Eine Quelle stammt aus der Zeit selbst. Eine Darstellung wurde später darüber gemacht, zum Beispiel ein Schulbuch oder ein Film.",
        build(s) {
          const items = [
            ["Ötzis Kupferbeil", true], ["ein Kinofilm über Ötzi", false], ["Foto vom Mauerfall 1989", true],
            ["dein GeWi-Schulbuch", false], ["Uromas Brief aus dem Jahr 1950", true], ["Zeichnung: So sah Ötzi vielleicht aus", false],
          ];
          const binQ = s.h("div", { class: "stack", style: { gap: "10px" } });
          const binD = s.h("div", { class: "stack", style: { gap: "10px" } });
          const mid = s.h("div", { class: "stack", style: { gap: "10px" } });
          const chips = items.map(([t]) => { const c = s.h("div", { class: "card", style: { padding: "10px 16px", fontSize: "21px", textAlign: "center", fontWeight: 700 } }, t); mid.append(c); return c; });
          const bin = (title, sub, col, body) => s.h("div", { class: "card", style: { borderColor: col, borderWidth: "3px", background: col === P.green ? "#e6f6ee" : "#f1ebfd", display: "flex", flexDirection: "column", gap: "10px", height: "100%" } },
            s.h("p", { class: "h2", style: { color: col } }, title), s.h("p", { class: "small" }, sub), body);
          const merk = s.h("div", { class: "merk later" }, "Darstellungen erklären uns die Vergangenheit – aber jemand hat sie ", b(s, "später"), " gemacht. Frag immer: Woher stammt das Wissen?");
          s.add(root(s, "stack", { gap: "16px" },
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 330px 1fr", gap: "20px", height: "460px" } },
              bin("Quelle", "aus der Zeit selbst", P.green, binQ), mid, bin("Darstellung", "später darüber gemacht", P.violet, binD)),
            merk));
          s.show(chips, "pop"); s.sfx.pop();
          items.forEach(([t, isQ], i) => s.step(async () => {
            const c = chips[i];
            (isQ ? binQ : binD).append(c);
            c.style.background = isQ ? "#fff" : "#fff";
            s.sfx.whoosh(); await s.show(c, isQ ? "right" : "left"); s.sfx.snap();
            s.say(t + (isQ ? " ist eine Quelle." : " ist eine Darstellung."));
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Fragen an eine Quelle",
        say: "Mit W-Fragen bringst du eine Quelle zum Sprechen. Wir fragen die Büste der Nofretete.",
        build(s) {
          const svg = s.photo("nofretete", { w: 360, h: 530, pos: "50% 45%", caption: "Neues Museum, Berlin" });
          const qs = [
            ["Was?", "Eine Büste der Königin Nofretete aus Kalkstein, bemalt, etwa 50\u00a0cm hoch."],
            ["Wann?", "Zwischen 1353 und 1336 v. Chr. gemacht – über 3.300 Jahre alt."],
            ["Wer?", "Gefunden in der Werkstatt des Bildhauers Thutmosis."],
            ["Wo?", "Ausgegraben am 6. Dezember 1912 in Amarna in Ägypten. Heute im Neuen Museum in Berlin."],
            ["Warum?", "Warum fehlt das linke Auge? Das weiß niemand sicher. Auch offene Fragen gehören zur Geschichte!"],
          ];
          const cols = [P.unit, P.green, P.orange, P.violet, P.red];
          const rows = qs.map(([q, a], i) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "14px", alignItems: "center" } },
            s.h("span", { style: { font: "800 30px var(--f-display)", color: cols[i] } }, q), s.h("p", { class: "t", style: { fontSize: "22px" } }, a)));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "360px 1fr", gap: "32px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, ...rows)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          rows.forEach((r, i) => s.step(async () => { s.sfx.count(i + 2); await s.show(r, "left"); s.say(qs[i][1]); }));
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Archäologen graben",
        say: "Im Boden liegen Schichten übereinander. Was tiefer liegt, ist älter.",
        build(s) {
          const svg = s.svg(600, 560);
          const layers = [
            { y: 380, h: 110, c: P.soil3, n: "Steinzeit", yr: "vor 6.000 Jahren" },
            { y: 270, h: 110, c: P.soil4, n: "Mittelalter", yr: "vor 700 Jahren" },
            { y: 180, h: 90, c: P.soil2, n: "Urgroßeltern", yr: "vor 100 Jahren" },
            { y: 100, h: 80, c: P.soil1, n: "heute", yr: "jetzt" },
          ];
          svg.append(s.el("rect", { x: 0, y: 490, width: 400, height: 70, fill: P.sand }));
          svg.append(T(s, 200, 532, "Sand ohne Spuren", { "font-size": 19, "font-weight": 600, fill: "#8a7440" }));
          const counter = T(s, 8, 44, "", { "font-size": 26, fill: P.unit, "text-anchor": "start" });
          svg.append(counter);
          const lg = layers.map(L => {
            const g = s.el("g");
            const r = s.el("rect", { x: 0, y: L.y, width: 400, height: L.h, fill: L.c, stroke: "#5c4630", "stroke-width": 2 });
            g.append(r);
            const t1 = T(s, 420, L.y + L.h / 2 - 2, L.n, { "text-anchor": "start", "font-size": 21 });
            const t2 = T(s, 420, L.y + L.h / 2 + 24, L.yr, { "text-anchor": "start", "font-size": 19, "font-weight": 600, fill: P.pencil });
            g.append(t1, t2);
            g.style.opacity = 0; svg.append(g); return g;
          });
          // grass + house on top
          const top = s.el("g"); top.style.opacity = 0;
          top.append(s.el("rect", { x: 0, y: 92, width: 400, height: 10, fill: "#5aa75a" }));
          top.append(s.el("rect", { x: 320, y: 50, width: 70, height: 44, fill: "#e6d2b0", stroke: P.ink, "stroke-width": 2 }), s.el("path", { d: "M312 52 L355 22 L398 52 Z", fill: P.red }));
          svg.append(top);
          // finds
          const finds = [];
          const find = (g) => { g.classList.add("later"); fb(g); svg.append(g); finds.push(g); return g; };
          find(s.el("g", null, s.el("circle", { cx: 120, cy: 140, r: 13, fill: "#c0c6cc", stroke: "#666", "stroke-width": 3 }), s.el("circle", { cx: 120, cy: 140, r: 4, fill: "#666" })));
          find(s.el("g", null, s.el("rect", { x: 104, y: 202, width: 22, height: 48, rx: 6, fill: "#3f8f5f" }), s.el("rect", { x: 110, y: 192, width: 10, height: 14, fill: "#3f8f5f" })));
          find(s.el("path", { d: "M96 330 Q120 300 156 318 L150 338 Q124 326 104 346 Z", fill: "#b5582f", stroke: "#6e2f14", "stroke-width": 3 }));
          find(s.el("path", { d: "M110 420 L150 432 L138 466 Q120 470 104 446 Z", fill: "#4a4f5a", stroke: "#22262e", "stroke-width": 3 }));
          const pit = later(s.el("rect", { x: 70, y: 100, width: 120, height: 390, fill: "none", stroke: P.yellow, "stroke-width": 5, "stroke-dasharray": "12 8" }));
          const arrow = later(s.el("g"));
          arrow.append(s.el("line", { x1: 225, y1: 130, x2: 225, y2: 450, stroke: "#fff", "stroke-width": 8, "stroke-linecap": "round" }));
          arrow.append(s.el("path", { d: "M207 440 L225 474 L243 440 Z", fill: "#fff" }));
          svg.append(pit, arrow);
          const steps = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "So wird gegraben"),
            s.h("ol", { class: "t", style: { margin: 0, paddingLeft: "28px", fontSize: "22px" } },
              s.h("li", null, "Schicht für Schicht abtragen – ganz vorsichtig."),
              s.h("li", null, "Jeden Fund messen, zeichnen, fotografieren und aufschreiben."),
              s.h("li", null, "Erst dann den Fund herausnehmen.")));
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Bevor ein neues Haus gebaut wird, graben Archäologen manchmal schnell vorher: eine ", b(s, "Notgrabung"), "."));
          const merk = s.h("div", { class: "merk later" }, b(s, "Je tiefer, desto älter."), " Die unterste Schicht ist zuerst entstanden.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, steps, lf, merk)));
          counter.textContent = "Was liegt unter uns?";
          s.step(async () => {
            s.sfx.whoosh();
            for (let i = 0; i < 4; i++) {
              counter.textContent = layers[i].yr === "jetzt" ? "heute" : layers[i].yr;
              const g = lg[i];
              await s.tween({ from: 0, to: 1, dur: 450, ease: "out", update: v => { g.style.opacity = v; g.setAttribute("transform", `translate(0 ${(1 - v) * -60})`); } });
              s.sfx.drum();
            }
            top.style.opacity = 1; s.sfx.pop();
            s.say("Jede Zeit legt eine neue Schicht oben drauf.");
          });
          s.step(async () => { s.sound("kelle-graben"); await s.show(pit, "draw"); s.show(steps, "up"); });
          s.step(async () => { for (const f of finds) { s.sfx.coin(); s.show(f, "pop"); await s.wait(350); } s.show(arrow, "fade"); s.show(lf, "up"); s.say("Oben ein Kronkorken, ganz unten ein Steinwerkzeug."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11b -------------------------------------------------------------- */
      {
        title: "So sieht eine Grabung aus",
        say: "Auch mitten in Berlin wird gegraben. Hier siehst du echte Ausgrabungen und ein Lager für Funde.",
        build(s) {
          const items = [
            [s.photo("grabung-petriplatz", { w: "100%", h: 300, caption: "Petriplatz, Berlin-Mitte" }), "Hier lag das alte Cölln. Man fand Mauern einer Kirche und einer Schule – und über 3.000 Gräber."],
            [s.photo("grabung-molkenmarkt", { w: "100%", h: 300, caption: "Molkenmarkt, Berlin-Mitte" }), "2,5 m unter der Straße lag ein Weg aus Holzbohlen. Die Jahresringe verraten: Das Holz wurde um 1238 gefällt."],
            [s.photo("fund-depot", { w: "100%", h: 300, caption: "Im Depot des Museums" }), "Jeder Fund bekommt eine Nummer und eine Kiste. Auf dem Zettel steht, wo er gefunden wurde."],
          ];
          const cols = items.map(([fig, txt]) => s.h("div", { class: "stack later", style: { gap: "12px" } }, fig, s.h("p", { class: "small" }, txt)));
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Siehst du in Berlin einen Bauzaun mit Zelten und Sandhaufen? Vielleicht graben dort gerade Archäologen!"));
          s.add(root(s, "stack", { gap: "18px", justifyContent: "center" }, s.h("div", { class: "cols3" }, cols), lf));
          s.show(cols[0], "up"); s.sound("kelle-graben");
          s.step(async () => { s.sound("kelle-graben", { rate: .9 }); await s.show(cols[1], "up"); s.say("Dieser Holzweg ist vielleicht die älteste Straße Berlins."); });
          s.step(async () => { s.sfx.snap(); await s.show(cols[2], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Wie alt ist ein Fund?",
        say: "Archäologen haben Tricks, um das Alter eines Fundes herauszufinden: Schichten, Jahresringe und die Kohlenstoff-Uhr.",
        build(s) {
          // card 1: layers
          const s1 = s.svg(280, 200);
          [[P.soil1, 20], [P.soil4, 80], [P.soil3, 140]].forEach(([c, y], i) => { s1.append(s.el("rect", { x: 20, y, width: 190, height: 58, fill: c })); s1.append(T(s, 115, y + 37, ["jung", "mittel", "alt"][i], { fill: "#fff", "font-size": 21 })); });
          s1.append(s.el("path", { d: "M240 26 L240 176 M226 160 L240 186 L254 160", stroke: P.red, "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
          // card 2: tree rings
          const { canvas: tc, g } = s.canvas(280, 200);
          const widths = [6, 4, 7, 3, 5, 8, 2, 6, 5, 3, 7, 4, 6, 2, 5, 7, 3, 6, 4, 5];
          let years = 20;
          const drawTree = (n) => {
            g.clearRect(0, 0, 280, 200);
            const cx = 140, cy = 100; let r = 4;
            const rs = [];
            for (let i = 0; i < Math.round(n); i++) { r += widths[i % widths.length] * 0.9; rs.push(r); }
            g.fillStyle = "#7a5230"; g.beginPath(); g.arc(cx, cy, r + 6, 0, 7); g.fill();
            for (let i = rs.length - 1; i >= 0; i--) { g.fillStyle = i % 2 ? "#e9c896" : "#dcb57f"; g.beginPath(); g.arc(cx, cy, rs[i], 0, 7); g.fill(); g.strokeStyle = "#a07444"; g.lineWidth = 1.5; g.stroke(); }
            g.fillStyle = "#b5874f"; g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill();
          };
          drawTree(years);
          const sl = s.slider({ label: "Jahre", min: 1, max: 20, value: 20, onInput: v => drawTree(v) }); sl.style.alignSelf = "stretch";
          // card 3: hourglass
          const s3 = s.svg(280, 200);
          s3.append(s.el("path", { d: "M90 14 L190 14 L146 100 L190 186 L90 186 L134 100 Z", fill: "#eef4fb", stroke: P.ink, "stroke-width": 5, "stroke-linejoin": "round" }));
          const sandTop = s.el("path", { fill: P.yellow }), sandBot = s.el("path", { fill: P.yellow }), stream = s.el("line", { x1: 140, y1: 100, x2: 140, y2: 180, stroke: P.orange, "stroke-width": 3 });
          s3.append(sandTop, sandBot, stream);
          s3.append(T(s, 45, 108, "C14", { "font-size": 24, "font-weight": 800, fill: P.unit }));
          s.loop(t => {
            const p = (t % 6) / 6;
            const ht = 70 * (1 - p), hb = 70 * p;
            sandTop.setAttribute("d", `M${140 - ht * 0.6} ${96 - ht} L${140 + ht * 0.6} ${96 - ht} L140 96 Z`);
            sandBot.setAttribute("d", `M98 182 L182 182 L${140 + 42 * (1 - Math.pow(1 - p, 2) * 0.6)} ${182 - hb * 0.9} L${140 - 42 * (1 - Math.pow(1 - p, 2) * 0.6)} ${182 - hb * 0.9} Z`);
          });
          const card = (title, art, ...txt) => s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", padding: "14px 16px" } },
            s.h("p", { class: "h2", style: { color: "var(--unit)", fontSize: "26px" } }, title), art, ...txt);
          const c1 = card("1. Schichten", s1, s.h("p", { class: "small" }, "Was tiefer liegt, ist älter. So kennt man die ", b(s, "Reihenfolge"), "."));
          const c2 = card("2. Jahresringe", tc, sl, s.h("p", { class: "small" }, "Jedes Jahr wächst ein Ring. Breiter Ring = gutes Jahr für den Baum."));
          const c3 = card("3. Kohlenstoff-Uhr", s3, s.h("p", { class: "small" }, "Alles, was gelebt hat (Holz, Knochen), hat eine eingebaute „Uhr“: die ", b(s, "C14-Methode"), "."));
          const otzi = ex(s, "Beispiel Ötzi", { class: "ex later" }, s.h("p", { class: "t" }, "Gefunden am 19. September 1991 im Eis der Ötztaler Alpen. Die C14-Methode zeigt: Er starb zwischen ", b(s, "3368 und 3108 v. Chr."), ""));
          s.add(root(s, "stack", { gap: "14px", justifyContent: "center" }, s.h("div", { class: "cols3", style: { gap: "18px" } }, c1, c2, c3), otzi));
          s.show(c1, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); s.show(c2, "up"); for (let i = 1; i <= 20; i++) { drawTree(i); sl.input.value = i; sl.querySelector(".mono").textContent = i; if (i % 2) s.sfx.tick(); await s.wait(50); } s.say("Zähl die Ringe: So alt war der Baum."); });
          s.step(async () => { s.sfx.pop(); await s.show(c3, "up"); s.say("Die Kohlenstoff-Uhr funktioniert für Dinge, die einmal gelebt haben."); });
          s.step(async () => { s.sfx.ding(); await s.show(otzi, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Museen in Berlin",
        say: "Auf der Museumsinsel in Berlin stehen fünf Museen. Im Neuen Museum kannst du Nofretete und Funde aus der Steinzeit sehen.",
        build(s) {
          const svg = s.svg(470, 560);
          // water: Spree (east) and Kupfergraben (west)
          svg.append(s.el("path", { d: "M40 20 Q60 140 90 260 Q120 400 150 560 L0 560 L0 20 Z", fill: "#cfe6f7" }));
          svg.append(s.el("path", { d: "M300 0 Q330 140 380 260 Q420 380 470 470 L470 0 Z", fill: "#cfe6f7" }));
          svg.append(T(s, 4, 548, "Kupfergraben", { "text-anchor": "start", "font-size": 19, "font-weight": 600, fill: "#2a6aa0" }));
          svg.append(T(s, 455, 40, "Spree", { "text-anchor": "end", "font-size": 22, fill: "#2a6aa0" }));
          // island
          const island = s.el("path", { d: "M70 30 Q180 0 290 10 Q320 150 370 260 Q410 360 440 470 L460 560 L160 560 Q120 400 95 270 Q75 150 70 30 Z", fill: "#eadfc4", stroke: "#b49d6c", "stroke-width": 3 });
          svg.append(island);
          const mus = [
            { x: 120, y: 40, w: 150, h: 60, n: "Bode-Museum", c: "#c9b28a" },
            { x: 115, y: 130, w: 120, h: 110, n: "Pergamon-", n2: "museum", c: "#c9b28a" },
            { x: 130, y: 268, w: 110, h: 90, n: "Neues", c: P.unit },
            { x: 262, y: 262, w: 110, h: 90, n: "Alte Natio-", n2: "nalgalerie", c: "#c9b28a" },
            { x: 165, y: 400, w: 200, h: 80, n: "Altes Museum", c: "#c9b28a" },
          ];
          const mg = mus.map(m => {
            const g = later(s.el("g")); fb(g);
            g.append(s.el("rect", { x: m.x, y: m.y, width: m.w, height: m.h, rx: 6, fill: m.c, stroke: P.ink, "stroke-width": 2 }));
            g.append(T(s, m.x + m.w / 2, m.y + m.h / 2 + (m.n2 ? -4 : 7), m.n, { "font-size": 19, fill: m.c === P.unit ? "#fff" : P.ink }));
            if (m.n2) g.append(T(s, m.x + m.w / 2, m.y + m.h / 2 + 18, m.n2, { "font-size": 19, fill: P.ink }));
            if (m.n === "Neues") g.append(T(s, m.x + m.w / 2, m.y + m.h / 2 + 30, "Museum", { "font-size": 19, fill: "#fff" }));
            svg.append(g); return g;
          });
          const north = s.el("g", { transform: "translate(420 120)" }, s.el("path", { d: "M0 -30 L12 6 L0 0 L-12 6 Z", fill: P.ink }), T(s, 0, 30, "N", { "font-size": 22 }));
          svg.append(north);
          const ring = later(s.el("rect", { x: 122, y: 260, width: 126, height: 106, rx: 10, fill: "none", stroke: P.red, "stroke-width": 5 }));
          svg.append(ring);
          const c1 = ex(s, "Ägyptisches Museum", { class: "ex later" }, s.h("p", { class: "t" }, "Im ", b(s, "Neuen Museum"), " steht seit 2009 wieder die Büste der ", b(s, "Nofretete"), "."));
          const c2 = ex(s, "Museum für Vor- und Frühgeschichte", { class: "ex later" }, s.h("p", { class: "t" }, "Auch im Neuen Museum: Funde aus der Steinzeit und Schätze aus ", b(s, "Troja"), ", die Heinrich Schliemann geschenkt hat."));
          const c3 = s.h("div", { class: "merk later" }, "Die ", b(s, "Museumsinsel"), " mit 5 Museen ist seit 1999 ", b(s, "Weltkulturerbe"), ". Auf derselben Insel lag früher die Stadt Cölln.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "470px 1fr", gap: "30px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, c1, c2, c3)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { for (const g of mg) { s.sfx.pop(); s.show(g, "pop"); await s.wait(180); } s.say("Fünf Museen auf einer Insel."); });
          s.step(async () => { s.sfx.ding(); s.show(ring, "draw"); await s.show(c1, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "left"); });
          s.step(async () => { s.sfx.success(); await s.show(c3, "up"); });
        },
      },
      /* 13b -------------------------------------------------------------- */
      {
        title: "Die Museumsinsel in echt",
        say: "So sieht die Museumsinsel in echt aus. Mit der U5 fährst du bis zum Bahnhof Museumsinsel.",
        build(s) {
          const figs = [
            s.photo("bode-museum", { w: 1100, h: 300, pos: "50% 60%", caption: "Bode-Museum an der Spitze der Insel", cls: "later" }),
            s.photo("neues-museum", { w: 541, h: 300, caption: "Neues Museum", cls: "later" }),
            s.photo("nofretete-saal", { w: 541, h: 300, caption: "Der Saal der Nofretete", cls: "later" }),
          ];
          s.add(root(s, "stack", { gap: "18px", justifyContent: "center" }, figs[0], s.h("div", { class: "row", style: { gap: "18px", flexWrap: "nowrap" } }, figs[1], figs[2])));
          s.show(figs[0], "zoom"); s.sound("waves", { vol: .3, dur: 4 });
          s.step(async () => { s.sfx.pop(); await s.show(figs[1], "left"); s.say("Im Neuen Museum stehen Nofretete und die Funde aus der Steinzeit."); });
          s.step(async () => { s.sound("footsteps", { vol: .6 }); await s.show(figs[2], "right"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Berlin erzählt",
        say: "Auch Straßen, Namen und Steine im Gehweg sind Quellen. Du läufst jeden Tag an Geschichte vorbei.",
        build(s) {
          const po = { w: 230, h: 230 };
          const pics = { schild: () => s.photo("karl-marx-str-1910", Object.assign({ pos: "50% 60%" }, po)), rix: () => s.photo("rixdorf-1857", Object.assign({ pos: "45% 45%" }, po)), mauer: () => s.photo("mauer-markierung", po), stolper: () => s.photo("stolpersteine", po) };
          const card = (kind, title, ...txt) => s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "230px 1fr", gap: "16px", alignItems: "center", padding: "12px 16px" } },
            pics[kind](), s.h("div", null, s.h("p", { class: "h2", style: { fontSize: "24px", color: "var(--unit)" } }, title), s.h("p", { class: "small" }, ...txt)));
          const cards = [
            card("schild", "Straßennamen", "Die Karl-Marx-Straße heißt erst seit ", b(s, "1947"), " so. Das Foto von 1910 zeigt sie noch als Berliner Straße."),
            card("rix", "Ortsnamen", "Neukölln hieß bis ", b(s, "1912"), " Rixdorf – so steht es auf dieser Karte von 1857. Den Namen findest du noch am Richardplatz."),
            card("mauer", "Pflastersteine", "Eine doppelte Steinreihe im Boden zeigt, wo von ", b(s, "1961 bis 1989"), " die Berliner Mauer stand."),
            card("stolper", "Stolpersteine", "Kleine Messingtafeln im Gehweg erinnern an Menschen, die in der NS-Zeit verfolgt wurden. Das Projekt begann ", b(s, "1992"), "."),
          ];
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", alignContent: "center" }, ...cards));
          s.show(cards[0], "up"); s.sound("tram-bell", { vol: .4, dur: 2.5 });
          s.step(async () => { s.sfx.swoosh(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sound("footsteps", { vol: .6 }); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.chord([0, 3, 7]); await s.show(cards[3], "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Familiengeschichte",
        say: "Auch deine Familie hat eine Geschichte. Fotos, Briefe, alte Dinge und Erzählungen sind deine eigenen Quellen.",
        build(s) {
          const svg = s.svg(560, 440);
          const album = s.el("g");
          album.append(s.el("rect", { x: 20, y: 30, width: 520, height: 380, rx: 16, fill: "#7a4b2a" }));
          album.append(s.el("rect", { x: 36, y: 44, width: 240, height: 352, rx: 6, fill: "#fbf6ea" }));
          album.append(s.el("rect", { x: 284, y: 44, width: 240, height: 352, rx: 6, fill: "#fbf6ea" }));
          album.append(s.el("line", { x1: 280, y1: 44, x2: 280, y2: 396, stroke: "#5c3519", "stroke-width": 6 }));
          svg.append(album);
          const items = [];
          const it = (g) => { g.classList.add("later"); fb(g); svg.append(g); items.push(g); return g; };
          // photo (Bildquelle)
          it(s.el("g", null, s.el("rect", { x: 60, y: 64, width: 190, height: 150, fill: "#fff", stroke: "#bbb", "stroke-width": 2, transform: "rotate(-4 155 139)" }),
            s.el("rect", { x: 72, y: 76, width: 166, height: 110, fill: "#c9b79c", transform: "rotate(-4 155 139)" }),
            s.el("circle", { cx: 140, cy: 120, r: 18, fill: "#8a7558" }), s.el("path", { d: "M112 184 Q140 140 168 184 Z", fill: "#8a7558" }),
            T(s, 160, 232, "Bildquelle", { "font-size": 20, fill: P.unit })));
          // story bubble (mündlich)
          it(s.el("g", null, s.el("path", { d: "M60 270 L250 270 Q262 270 262 282 L262 330 Q262 342 250 342 L120 342 L96 366 L100 342 L72 342 Q60 342 60 330 L60 282 Q60 270 72 270 Z", fill: "#fff", stroke: P.ink, "stroke-width": 3 }),
            T(s, 161, 300, "„Als ich klein", { "font-size": 19 }), T(s, 161, 326, "war …“", { "font-size": 19 }),
            T(s, 160, 390, "mündliche Quelle", { "font-size": 20, fill: P.violet })));
          // letter (Schrift)
          it(s.el("g", null, s.el("rect", { x: 304, y: 64, width: 200, height: 140, fill: "#f4e7c3", stroke: "#a0864a", "stroke-width": 2, transform: "rotate(3 404 134)" }),
            ...[0, 1, 2, 3].map(i => s.el("line", { x1: 322, y1: 92 + i * 24, x2: 486 - (i % 2) * 30, y2: 96 + i * 24, stroke: "#6b5a3a", "stroke-width": 3 })),
            T(s, 404, 232, "Schriftquelle", { "font-size": 20, fill: P.green })));
          // watch (Sach)
          it(s.el("g", null, s.el("rect", { x: 390, y: 262, width: 30, height: 110, rx: 8, fill: "#6b4a2a" }), s.el("circle", { cx: 405, cy: 316, r: 34, fill: "#fff", stroke: P.gold, "stroke-width": 7 }),
            s.el("line", { x1: 405, y1: 316, x2: 405, y2: 294, stroke: P.ink, "stroke-width": 4 }), s.el("line", { x1: 405, y1: 316, x2: 420, y2: 324, stroke: P.ink, "stroke-width": 4 }),
            T(s, 404, 392, "Sachquelle", { "font-size": 20, fill: P.orange })));
          const qs = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Frag doch mal Oma und Opa"),
            s.h("ul", { class: "t", style: { margin: 0, paddingLeft: "26px", fontSize: "22px" } }, s.h("li", null, "Wie sah deine Schule aus?"), s.h("li", null, "Womit hast du gespielt?"), s.h("li", null, "Wo hast du als Kind gewohnt?")));
          const merk = s.h("div", { class: "merk later" }, "Deine Familie ist ein Stück ", b(s, "Geschichte"), ". Die Erinnerungen deiner Großeltern sind echte Quellen!");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "28px", alignItems: "center" }, svg, s.h("div", { class: "stack" }, qs, merk)));
          s.show(album, "zoom"); s.sfx.whoosh();
          s.step(async () => {
            const fx = [() => s.sound("camera-shutter"), () => s.sfx.pop(), () => s.sound("pencil-write", { dur: .8 }), () => s.sound("clock-tick", { dur: 1.2, vol: .6 })];
            for (let i = 0; i < items.length; i++) { fx[i](); s.show(items[i], "pop"); await s.wait(650); }
            s.say("Foto, Erzählung, Brief und Uhr: vier Arten von Quellen.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(qs, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Dein Ranzen",
        say: "Stell dir vor, dein Schulranzen wird in fünfhundert Jahren ausgegraben. Was erzählt er über uns?",
        build(s) {
          const svg = s.svg(520, 560);
          const bag = s.el("g");
          bag.append(s.el("rect", { x: 170, y: 160, width: 180, height: 200, rx: 26, fill: P.unit, stroke: P.ink, "stroke-width": 4 }));
          bag.append(s.el("rect", { x: 186, y: 176, width: 148, height: 80, rx: 16, fill: "#3f7ae0", stroke: P.ink, "stroke-width": 3 }));
          bag.append(s.el("path", { d: "M220 160 Q260 110 300 160", fill: "none", stroke: P.ink, "stroke-width": 8 }));
          bag.append(s.el("rect", { x: 245, y: 250, width: 30, height: 18, rx: 4, fill: P.yellow, stroke: P.ink, "stroke-width": 2 }));
          svg.append(bag);
          const ground = s.el("g", { opacity: 0.86 }); svg.append(ground);
          const layerRects = [0, 1, 2].map(i => { const r = s.el("rect", { x: 0, y: 560, width: 520, height: 0, fill: [P.soil3, P.soil2, P.soil1][i] }); ground.append(r); return r; });
          const setGround = v => { const H = 300 * v; layerRects.forEach((r, i) => { const hh = Math.max(0, Math.min(100, H - i * 100)); r.setAttribute("height", hh); r.setAttribute("y", 560 - i * 100 - hh); }); };
          const yr = T(s, 260, 50, "2026", { "font-size": 40, "font-weight": 800, fill: P.unit });
          svg.append(yr);
          const things = [
            ["Füller", "Kinder schrieben mit Tinte!"], ["Daltonplaner", "Sie planten ihre Woche selbst."], ["Trinkflasche", "Sie brauchten Wasser – wie wir."], ["Brotdose", "Pausenbrot gab es schon damals."],
          ];
          const rows = things.map(([a, c]) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "190px 1fr", gap: "12px", alignItems: "center" } },
            s.h("span", { class: "chip", style: { fontSize: "21px", justifyContent: "center" } }, a), s.h("p", { class: "t", style: { fontSize: "22px" } }, "„", c, "“")));
          const head = s.h("p", { class: "h2 later" }, "Eine Archäologin im Jahr 2526 denkt:");
          const lf = life(s, { class: "life later" }, s.h("p", { class: "small" }, "Auch dein ", b(s, "Geburtstag"), " ist ein Datum auf dem Zeitstrahl. In 100 Jahren ist dein Leben schon Geschichte für andere Kinder!"));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "28px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, head, ...rows, lf)));
          s.show(bag, "bounce"); s.sound("zipper");
          s.step(async () => {
            s.sound("kelle-graben", { rate: .8 });
            await s.tween({ from: 0, to: 1, dur: 2200, ease: "inOut", update: v => {
              yr.textContent = String(Math.round(2026 + v * 500));
              bag.setAttribute("transform", `translate(0 ${v * 150})`);
              setGround(v);
            } });
            s.sfx.drum(); s.say("Fünfhundert Jahre später liegt der Ranzen tief in der Erde.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(head, "up"); for (const r of rows) { s.sfx.coin(); s.show(r, "left"); await s.wait(260); } });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
    ],
  });
})();
