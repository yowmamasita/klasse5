/* Kapitel 4 – Raum und Perspektive (Kunst 5/6, Berlin RLP Kunst) */
(() => {
  const UC = "#c2410c", INK = "#1b2740", PEN = "#4a4458";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let uid = 0;

  const cols = (s, left, right, lw = 560) =>
    s.h("div", { class: "cols", style: { gridTemplateColumns: lw + "px minmax(0,1fr)", alignItems: "center", height: "100%" } }, left, right);
  const merk = (s, html, hidden = true) => s.h("div", { class: "merk" + (hidden ? " later" : ""), html });
  const box = (s, cls, label, html, hidden = true) =>
    s.h("div", { class: cls + (hidden ? " later" : "") }, label ? s.h("span", { class: "exlabel" }, label) : null, s.h("p", { class: "small", html }));
  const stack = (s, gap, ...kids) => s.h("div", { class: "stack", style: { gap: gap + "px" } }, ...kids);
  const dotsD = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
  const polyD = (pts) => dotsD(pts) + "Z";
  /* central projection: x right, y down (relative to eye), z forward */
  const proj = (x, y, z, vx, vy, f) => [vx + f * x / z, vy + f * y / z];
  function clipG(s, svg, x, y, w, h) {
    const id = "clip4" + (++uid);
    svg.append(s.el("clipPath", { id }, s.el("rect", { x: 0, y: 0, width: w, height: h })));
    const g = s.el("g", { transform: `translate(${x} ${y})`, "clip-path": `url(#${id})` });
    svg.append(g); return g;
  }
  const person = (s, x, yFeet, hgt, col = "#35466b", cls = "") => {
    const hr = hgt * 0.07, g = s.el("g", { class: cls });
    g.append(s.el("circle", { cx: x, cy: yFeet - hgt + hr, r: hr, fill: col }),
      s.el("path", { d: `M${x},${yFeet - hgt + hr * 2}L${x},${yFeet - hgt * 0.45}M${x - hgt * .17},${yFeet - hgt * .75}L${x + hgt * .17},${yFeet - hgt * .75}M${x},${yFeet - hgt * .45}L${x - hgt * .1},${yFeet}M${x},${yFeet - hgt * .45}L${x + hgt * .1},${yFeet}`, stroke: col, "stroke-width": Math.max(2, hgt * 0.06), "stroke-linecap": "round", fill: "none" }));
    return g;
  };

  Deck.unit({
    id: "u4", num: 4, title: "Raum und Perspektive", color: UC, soft: "#fde9dc",
    subtitle: "Wie aus flachem Papier ein Raum wird",
    blurb: "Tiefe, Fluchtpunkt, Frosch- und Vogelperspektive, Proportionen",
    goals: [
      "Fünf Tricks für Tiefe auf flachem Papier kennen",
      "Horizont, Fluchtpunkt und Fluchtlinien benutzen",
      "Frosch-, Normal- und Vogelperspektive unterscheiden",
      "Gesicht und Körper richtig abmessen",
    ],
    icon(svg, el) {
      svg.append(el("path", { d: "M8,60 L35,28 M62,60 L35,28 M30,60 L35,28 M42,60 L35,28", stroke: UC, "stroke-width": 3.5, "stroke-linecap": "round", fill: "none" }),
        el("line", { x1: 6, y1: 28, x2: 64, y2: 28, stroke: UC, "stroke-width": 2.5, "stroke-dasharray": "5 4" }), el("circle", { cx: 35, cy: 28, r: 5, fill: UC }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Tiefe auf flachem Papier",
        say: "Papier ist flach. Mit fünf Tricks sieht dein Auge trotzdem Tiefe.",
        build(s) {
          const banner = s.h("p", { class: "big", html: "Papier ist <span class='hl'>flach</span>. Wie malt man <span class='hl'>Tiefe</span>?" });
          const mini = (title, sub, draw) => {
            const svg = s.svg(300, 105); const els = draw(svg);
            const c = s.h("div", { class: "card later", style: { padding: "10px 14px 12px" } }, svg, s.h("p", { class: "h2", style: { fontSize: "26px", margin: "2px 0 2px" } }, title), s.h("p", { class: "small", html: sub }));
            return [c, els];
          };
          const st = { stroke: INK, "stroke-width": 3, class: "later" };
          const cards = [
            mini("Überdeckung", "Was verdeckt, ist näher.", svg => { const a = s.el("rect", Object.assign({ x: 60, y: 14, width: 110, height: 70, fill: "#8fb8e8" }, st)), b = s.el("rect", Object.assign({ x: 120, y: 36, width: 110, height: 60, fill: "#f3a16a" }, st)); svg.append(a, b); return [a, b]; }),
            mini("Größenabnahme", "Weiter weg heißt kleiner.", svg => { const e = [[70, 80], [150, 52], [225, 32]].map(([x, h]) => s.el("polygon", { points: `${x},${100 - h} ${x - h * .35},100 ${x + h * .35},100`, fill: "#4aa05a", stroke: INK, "stroke-width": 3, class: "later" })); svg.append(...e); return e; }),
            mini("Höhe im Bild", "Weiter weg heißt höher im Bild.", svg => { const l = s.el("line", { x1: 10, y1: 30, x2: 290, y2: 30, stroke: "#9aa6bb", "stroke-width": 2, "stroke-dasharray": "6 5" }); svg.append(l); const e = [[70, 88], [150, 66], [230, 46]].map(([x, y]) => s.el("circle", { cx: x, cy: y, r: 14, fill: "#f3a16a", stroke: INK, "stroke-width": 3, class: "later" })); svg.append(...e); return e; }),
            mini("Luftperspektive", "Weiter weg heißt blasser und bläulicher.", svg => { const e = [["#c8d8ef", "10,80 70,22 130,80"], ["#8ea9d4", "90,90 150,36 215,90"], ["#3f6b50", "170,100 235,50 295,100"]].map(([f, p]) => s.el("polygon", { points: p, fill: f, stroke: INK, "stroke-width": 2, class: "later" })); svg.append(...e); return e; }),
            mini("Detailabnahme", "Weiter weg heißt weniger Details.", svg => {
              const e = []; [[30, 4], [120, 2], [210, 0]].forEach(([x, n]) => { const g = s.el("g", { class: "later" }, s.el("rect", { x, y: 18, width: 70, height: 70, fill: "#f4d9c6", stroke: INK, "stroke-width": 3 }));
                for (let i = 1; i <= n; i++) { const o = 70 / (n + 1) * i; g.append(s.el("line", { x1: x + o, y1: 18, x2: x + o, y2: 88, stroke: INK, "stroke-width": 2 }), s.el("line", { x1: x, y1: 18 + o, x2: x + 70, y2: 18 + o, stroke: INK, "stroke-width": 2 })); }
                svg.append(g); e.push(g); }); return e; }),
          ];
          const m = merk(s, "Das sind fünf Tricks. Dein Auge sieht Tiefe, obwohl das Blatt flach bleibt.");
          const grid = s.h("div", { class: "cols3", style: { gap: "16px", gridAutoRows: "min-content" } }, ...cards.map(c => c[0]), m);
          s.add(stack(s, 14, banner, grid));
          const run = async idx => { s.sfx.pop(); s.show(cards[idx][0], "up"); await s.wait(350); for (const e of cards[idx][1]) { s.sfx.pop(); s.show(e, "pop"); await s.wait(200); } };
          s.step(async () => { s.say("Überdeckung und Größe."); await run(0); await run(1); });
          s.step(async () => { s.say("Höhe im Bild und Luftperspektive."); await run(2); await run(3); });
          s.step(async () => { s.say("Und Details."); await run(4); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Überdeckung",
        say: "Ziehe die Dinge hin und her. Was vorne liegt, verdeckt das andere. Darum wirkt es näher.",
        build(s) {
          const svg = s.svg(600, 500);
          svg.append(s.el("rect", { x: 0, y: 0, width: 600, height: 500, rx: 16, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), s.el("line", { x1: 20, y1: 470, x2: 580, y2: 470, stroke: "#c8d3de", "stroke-width": 3, "stroke-dasharray": "8 8" }));
          const mk = (x, y, kids) => { const g = s.el("g", { transform: `translate(${x} ${y}) scale(1.35)`, class: "later" }, ...kids); g.pos = { x, y }; return g; };
          const o = { stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" };
          const mountain = mk(290, 450, [s.el("polygon", Object.assign({ points: "-140,0 -20,-190 45,-100 80,-150 150,0", fill: "#8aa0c8" }, o)), s.el("polygon", { points: "-20,-190 -50,-148 -26,-158 -4,-142 8,-160", fill: "#fff", stroke: INK, "stroke-width": 2.5 })]);
          const tree = mk(360, 465, [s.el("rect", Object.assign({ x: -10, y: -70, width: 20, height: 70, fill: "#8a5a2b" }, o)), s.el("circle", Object.assign({ cx: 0, cy: -110, r: 56, fill: "#44a152" }, o))]);
          const house = mk(215, 475, [s.el("rect", Object.assign({ x: -66, y: -100, width: 132, height: 100, fill: "#f2b36b" }, o)), s.el("polygon", Object.assign({ points: "-80,-100 0,-165 80,-100", fill: "#c0392b" }, o)), s.el("rect", Object.assign({ x: -16, y: -56, width: 30, height: 56, fill: "#7a4a2a" }, o)), s.el("rect", Object.assign({ x: 28, y: -80, width: 28, height: 28, fill: "#bfe3ff" }, o))]);
          const objs = [mountain, tree, house];
          objs.forEach(g => {
            svg.append(g); let off = { x: 0, y: 0 };
            s.drag(g, { space: svg, onStart: p => { off = { x: g.pos.x - p.x, y: g.pos.y - p.y }; svg.append(g); s.sfx.pop(); }, onMove: p => { g.pos = { x: clamp(p.x + off.x, 110, 490), y: clamp(p.y + off.y, 250, 480) }; g.setAttribute("transform", `translate(${g.pos.x} ${g.pos.y}) scale(1.35)`); }, onEnd: () => s.sfx.click() });
          });
          const reset = s.h("button", { class: "btn later", onclick: () => { s.sfx.swoosh(); const st = [[290, 450], [360, 465], [215, 475]]; objs.forEach((g, i) => { svg.append(g); const f = { ...g.pos }; s.tween({ from: 0, to: 1, dur: 400, update: v => { g.pos = { x: f.x + (st[i][0] - f.x) * v, y: f.y + (st[i][1] - f.y) * v }; g.setAttribute("transform", `translate(${g.pos.x} ${g.pos.y}) scale(1.35)`); } }); }); } }, "Zurück an den Start");
          const r1 = box(s, "ex", "Probiere es aus", "Ziehe Berg, Baum und Haus mit dem Finger. Was du anfasst, kommt nach vorne.");
          const m = merk(s, "<b>Überdeckung</b>: Was ein anderes Ding verdeckt, wirkt näher. Das verdeckte Ding wirkt weiter hinten.");
          const r3 = s.photo("berlin-ueberdeckung", { w: 470, h: 260, pos: "50% 60%", caption: "Berlin: Häuser verdecken sich, hinten der Fernsehturm", cls: "later" });
          s.add(cols(s, stack(s, 12, svg, reset), stack(s, 12, r1, m, r3), 600));
          s.step(async () => { s.sfx.pop(); s.say("Zuerst der Berg."); await s.show(mountain, "up"); });
          s.step(async () => { s.sfx.pop(); s.say("Dann der Baum, er steht vor dem Berg."); await s.show(tree, "up"); });
          s.step(async () => { s.sfx.pop(); s.say("Und das Haus ganz vorn."); await s.show(house, "up"); s.show(r1, "left"); s.show(reset, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("traffic", { vol: .35, dur: 3 }); await s.show(r3, "zoom"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Größenabnahme",
        say: "Gleich große Bäume und Menschen werden im Bild kleiner, je weiter sie weg sind.",
        build(s) {
          const VX = 320, VY = 170, F = 220, EY = 1.6, W = 640, H = 430;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { width: W, height: VY, fill: "#d9ecfb" }), s.el("rect", { y: VY, width: W, height: H - VY, fill: "#cfe8b8" }),
            s.el("polygon", { points: `${VX - 8},${VY} ${VX + 8},${VY} ${VX + 330},${H} ${VX - 330},${H}`, fill: "#e6dcc8" }), s.el("line", { x1: 0, y1: VY, x2: W, y2: VY, stroke: "#9aa6bb", "stroke-width": 2 }));
          const zs = [3.6, 5, 7, 10, 14, 20], trees = [];
          zs.forEach(z => {
            [-3.4, 3.4].forEach(x => {
              const [sx, by] = proj(x, EY, z, VX, VY, F), [, cy] = proj(x, EY - 3.0, z, VX, VY, F), r = F * 1.3 / z, [, ty] = proj(x, EY - 1.6, z, VX, VY, F);
              trees.push(s.el("g", { class: "later" }, s.el("rect", { x: sx - r * .13, y: ty, width: r * .26, height: by - ty, fill: "#8a5a2b" }), s.el("circle", { cx: sx, cy, r, fill: "#3f9a4a", stroke: "#2a6a33", "stroke-width": Math.max(1, r * .04) })));
            });
          });
          svg.append(...trees);
          const pg = s.el("g", { class: "later" }); svg.append(pg);
          const draw = z => { pg.replaceChildren(); const [x, fy] = proj(0, EY, z, VX, VY, F); const hh = F * 1.7 / z; pg.append(person(s, x, fy, hh, "#c2410c")); };
          draw(7);
          const sl = s.slider({ label: "Entfernung der Person", min: 4, max: 20, step: 1, value: 7, fmt: v => v + " m", onInput: draw });
          sl.classList.add("later");
          const r1 = box(s, "ex", "Gleich hoch, aber nicht gleich klein", "Alle Bäume sind gleich hoch. Im Bild werden sie nach hinten immer kleiner.");
          const m = merk(s, "<b>Größenabnahme</b>: Je weiter weg etwas ist, desto kleiner zeichnest du es.");
          const r3 = s.photo("allee-baeume", { w: 430, h: 220, caption: "Echte Bäume: hinten immer kleiner", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, r1, sl, m, r3), 640));
          s.step(async () => { s.say("Die Bäume stehen alle gleich weit auseinander."); for (let i = 0; i < trees.length; i += 2) { s.sfx.count(7 - i / 2); s.show([trees[i], trees[i + 1]], "pop"); await s.wait(380); } s.show(r1, "left"); });
          s.step(async () => { s.sfx.pop(); s.say("Schiebe die Person weg und her."); s.show(pg, "pop"); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sound("birds", { vol: .35, dur: 3 }); await s.show(r3, "zoom"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Höhe im Bild",
        say: "Ziehe den Ball nach oben. Je höher er im Bild steht, desto weiter weg wirkt er.",
        build(s) {
          const W = 640, H = 430, VY = 160, F = 260;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { width: W, height: VY, fill: "#d9ecfb" }), s.el("rect", { y: VY, width: W, height: H - VY, fill: "#cfe8b8" }), s.el("line", { x1: 0, y1: VY, x2: W, y2: VY, stroke: "#9aa6bb", "stroke-width": 2 }));
          for (let k = 0; k < 9; k++) { const y = VY + 260 * 1.6 / (2 + k * 2.2) * 1.0; svg.append(s.el("line", { x1: 0, y1: y, x2: W, y2: y, stroke: "#b9d6a0", "stroke-width": 2 })); }
          const ball = s.el("g", { class: "later" });
          const sh = s.el("ellipse", { fill: "rgba(40,60,30,.3)" }), bd = s.el("circle", { fill: "#e8683a", stroke: INK }), hi = s.el("circle", { fill: "#fff", opacity: .6 }), hit = s.el("circle", { fill: "transparent" });
          ball.append(sh, bd, hi, hit); svg.append(ball);
          const readout = s.h("p", { class: "big violet", style: { color: UC } });
          let bx = 320, by = 280;
          const upd = () => {
            const z = F * 1.6 / (by - VY), r = F * 0.5 / z;
            sh.setAttribute("cx", bx); sh.setAttribute("cy", by); sh.setAttribute("rx", r * 1.1); sh.setAttribute("ry", r * .28);
            bd.setAttribute("cx", bx); bd.setAttribute("cy", by - r); bd.setAttribute("r", r); bd.setAttribute("stroke-width", Math.max(1.5, r * .06));
            hi.setAttribute("cx", bx - r * .3); hi.setAttribute("cy", by - r * 1.3); hi.setAttribute("r", r * .2);
            hit.setAttribute("cx", bx); hit.setAttribute("cy", by - r); hit.setAttribute("r", Math.max(r, 32));
            readout.textContent = "Abstand etwa " + Math.round(z) + " m";
          };
          upd();
          s.drag(ball, { space: svg, onMove: p => { bx = clamp(p.x, 40, 600); by = clamp(p.y + 20, VY + 28, H - 16); upd(); s.sfx.tick(); } });
          const r1 = box(s, "ex", "Ziehe den Ball", "Nach oben: er wirkt weit weg und klein. Nach unten: er wirkt nah und groß.");
          const m = merk(s, "<b>Höhe im Bild</b>: Was auf dem Boden weiter weg ist, steht im Bild höher, näher am Horizont.");
          const r3 = s.photo("kuehe-wiese", { w: 430, h: 230, caption: "Weit weg: kleine Kühe, hoch am Horizont", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, readout, r1, m, r3), 640));
          s.step(async () => { s.sfx.boing(); s.say("Der Ball steht auf dem Boden."); await s.show(ball, "bounce"); s.show(r1, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(r3, "zoom"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Luftperspektive",
        say: "Was weit weg ist, sieht blasser und bläulicher aus. Das macht die Luft dazwischen.",
        build(s) {
          const W = 640, H = 430;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { width: W, height: H, rx: 12, fill: "#e8f2fc" }), s.el("circle", { cx: 520, cy: 70, r: 34, fill: "#ffe27a" }));
          const base = [255, 285, 315, 350, 390], amp = [70, 80, 92, 100, 110], col = ["#d4e0f3", "#b4c8e6", "#8ba7d0", "#5c8a76", "#2f5d3a"];
          const layers = [], veils = [];
          for (let i = 0; i < 5; i++) {
            const pts = [[0, H]]; for (let x = 0; x <= W; x += 20) pts.push([x, base[i] - amp[i] * (0.5 + 0.5 * Math.sin(x / (70 - i * 5) + i * 1.7)) * (0.7 + 0.3 * Math.sin(x / 31 + i))]);
            pts.push([W, H]);
            layers.push(s.el("polygon", { points: pts.map(p => p.join(",")).join(" "), fill: col[i], class: "later" }));
          }
          layers.forEach((l, i) => { svg.append(l); if (i < 4) { const v = s.el("rect", { width: W, height: H, fill: "#fff", opacity: 0, "pointer-events": "none" }); veils.push(v); svg.append(v); } });
          const sl = s.slider({ label: "Dunst in der Luft", min: 0, max: 10, step: 1, value: 0, fmt: v => v === 0 ? "klar" : v >= 8 ? "sehr dunstig" : "dunstig", onInput: v => veils.forEach(x => x.setAttribute("opacity", (v * 0.045).toFixed(3))) });
          sl.classList.add("later");
          const r1 = box(s, "ex", "Warum ist das so?", "Zwischen dir und den Bergen liegt viel Luft. Sie lässt ferne Dinge heller und bläulicher wirken.");
          const m = merk(s, "<b>Luftperspektive</b>: Je weiter weg, desto heller, bläulicher und blasser. Das beschrieb schon Leonardo da Vinci.");
          const life = s.photo("mona-lisa", { w: 430, h: 170, pos: "30% 45%", caption: "Mona Lisa (Ausschnitt): blasse, bläuliche Berge", cls: "later" });
          s.add(cols(s, svg, stack(s, 12, r1, sl, m, life), 640));
          s.step(async () => { s.say("Wir malen von hinten nach vorn."); for (let i = 0; i < 5; i++) { s.sfx.note(i * 2 - 4, 0.25); s.show(layers[i], "up"); await s.wait(520); } s.show(r1, "left"); });
          s.step(async () => { s.sfx.pop(); s.say("Mach die Luft dunstig."); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); s.sfx.whoosh(); await s.show(life, "zoom"); s.say("Auch Leonardo malte hinter der Mona Lisa blasse, bläuliche Berge."); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Detailabnahme",
        say: "Nah siehst du jeden Stein und jede Fensterscheibe. Weit weg wird alles einfach.",
        build(s) {
          const W = 640, H = 430;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { width: W, height: 200, fill: "#e8f2fc" }), s.el("rect", { y: 200, width: W, height: H - 200, fill: "#d3e9bf" }), s.el("line", { x1: 0, y1: 200, x2: W, y2: 200, stroke: "#9aa6bb", "stroke-width": 2 }));
          const st = { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" };
          const house = s.el("g", {});
          const wall = s.el("rect", Object.assign({ x: -100, y: -130, width: 200, height: 130, fill: "#f0c8a0", class: "later" }, st));
          let bd = ""; for (let r = 1; r < 10; r++) { const y = -130 + r * 13; bd += `M-100,${y}L100,${y}`; for (let x = (r % 2 ? -100 : -85); x < 100; x += 30) bd += `M${x},${y}L${x},${y + 13}`; }
          const bricks = s.el("path", { d: bd, stroke: "#b8845a", "stroke-width": 1.6, fill: "none", class: "later" });
          const roof = s.el("polygon", Object.assign({ points: "-115,-130 0,-210 115,-130", fill: "#b94a35", class: "later" }, st));
          let rt = ""; for (let y = -145; y >= -200; y -= 14) { const hw = 115 * (y + 210) / 80; rt += `M${-hw},${y}L${hw},${y}`; }
          const tiles = s.el("path", { d: rt, stroke: "#7d2a1c", "stroke-width": 1.8, fill: "none", class: "later" });
          const door = s.el("rect", Object.assign({ x: -18, y: -72, width: 36, height: 72, fill: "#7a4a2a", class: "later" }, st));
          const wins = [-80, 40].map(x => s.el("rect", Object.assign({ x, y: -100, width: 40, height: 42, fill: "#bfe3ff", class: "later" }, st)));
          const panes = s.el("path", { d: "M-60,-100V-58M-80,-79H-40M60,-100V-58M40,-79H80", stroke: INK, "stroke-width": 2.5, fill: "none", class: "later" });
          const curt = s.el("path", { d: "M-80,-100L-68,-100L-80,-70Z M80,-100L68,-100L80,-70Z", fill: "#e8644b", class: "later" });
          const knob = s.el("circle", { cx: 9, cy: -36, r: 3.5, fill: "#ffd94a", stroke: INK, "stroke-width": 1.5, class: "later" });
          house.append(wall, bricks, roof, tiles, door, ...wins, panes, curt, knob); svg.append(house);
          const word = s.h("p", { class: "big", style: { color: UC } });
          const upd = z => {
            const sc = 1.25 / z, by = 200 + 175 / z;
            house.setAttribute("transform", `translate(320 ${by.toFixed(1)}) scale(${sc.toFixed(3)})`);
            const f = (a, b) => clamp(1 - (z - a) / (b - a), 0, 1);
            bricks.style.opacity = f(2, 3.2); tiles.style.opacity = f(2.5, 3.6); curt.style.opacity = f(3, 4); knob.style.opacity = f(2.2, 3); panes.style.opacity = f(4, 5.4);
            word.textContent = z <= 2.5 ? "Viele Details" : z <= 5 ? "Einige Details" : "Kaum Details";
          };
          upd(1);
          const sl = s.slider({ label: "Entfernung zum Haus", min: 1, max: 8, step: 0.5, value: 1, fmt: v => v <= 2 ? "nah" : v >= 6 ? "weit" : "mittel", onInput: upd });
          sl.classList.add("later"); word.classList.add("later");
          const m = merk(s, "<b>Detailabnahme</b>: Nah zeichnest du viele Einzelheiten. Je weiter weg, desto mehr lässt du weg.");
          const life = box(s, "life", "Im Alltag", "Backsteinwand: nah jeder Stein, weit nur rote Fläche. Zaun: nah einzelne Latten, weit nur ein Streifen. Wiese: nah Halme, weit nur Grün.");
          s.add(cols(s, svg, stack(s, 12, word, sl, m, life), 640));
          s.step(async () => { s.say("Hier siehst du ein Haus ganz aus der Nähe."); s.sfx.snap(); await s.show([wall, roof], "pop"); s.sfx.scribble(); s.show(bricks, "draw"); await s.show(tiles, "draw", 300); s.sfx.pop(); await s.show([door, ...wins, panes, curt, knob], "pop"); });
          s.step(async () => { s.sfx.pop(); s.say("Schiebe das Haus nach hinten."); s.show(word, "up"); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); await s.show(life, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Zentralperspektive",
        say: "Bei der Zentralperspektive treffen sich alle Linien, die nach hinten laufen, in einem Punkt am Horizont. Ziehe den Punkt!",
        build(s) {
          const W = 640, H = 440, F = 330, EY = 1.6;
          const svg = s.svg(W, H);
          let vx = 320, vy = 170;
          const sky = s.el("rect", { width: W, fill: "#d9ecfb" }), gnd = s.el("rect", { width: W, fill: "#cfe8b8" });
          svg.append(sky, gnd);
          const horizon = s.el("line", { x1: 0, x2: W, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "10 7", class: "later" });
          const guides = s.el("g", { class: "later" }); const gl = [20, 150, 320, 490, 620].map(x => { const l = s.el("line", { x2: x, y2: H, stroke: "#dc3b2a", "stroke-width": 2, opacity: .75 }); guides.append(l); return l; });
          const sleepers = s.el("path", { fill: "none", stroke: "#8a5a2b", "stroke-width": 3, class: "later" });
          const railA = s.el("path", { fill: "none", stroke: "#4b5262", "stroke-width": 5, "stroke-linecap": "round", class: "later" });
          const poles = s.el("path", { fill: "none", stroke: "#5a4632", "stroke-width": 4, "stroke-linecap": "round", class: "later" });
          const vpG = s.el("g", { class: "later" }, s.el("circle", { r: 30, fill: "rgba(220,59,42,.15)", stroke: "#dc3b2a", "stroke-width": 3 }), s.el("circle", { r: 8, fill: "#dc3b2a" }));
          svg.append(horizon, sleepers, railA, poles, guides, vpG);
          const P = (x, y, z) => proj(x, y, z, vx, vy, F);
          const upd = () => {
            sky.setAttribute("height", vy); gnd.setAttribute("y", vy); gnd.setAttribute("height", H - vy);
            horizon.setAttribute("y1", vy); horizon.setAttribute("y2", vy);
            gl.forEach(l => { l.setAttribute("x1", vx); l.setAttribute("y1", vy); });
            vpG.setAttribute("transform", `translate(${vx} ${vy})`);
            let d = ""; for (let z = 1.3; z < 70; z += 0.65) { const a = P(-1.25, EY, z), b = P(1.25, EY, z); d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`; }
            sleepers.setAttribute("d", d);
            d = ""; for (const x of [-.75, .75]) { const a = P(x, EY, 1.3), b = P(x, EY, 900); d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`; }
            railA.setAttribute("d", d);
            d = ""; const tops = { l: [], r: [] };
            for (let z = 3; z < 80; z *= 1.45) for (const x of [-2.6, 2.6]) { const a = P(x, EY, z), b = P(x, EY - 4.2, z); d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`; (x < 0 ? tops.l : tops.r).push(b); }
            for (const k of ["l", "r"]) d += dotsD(tops[k]).replace(/^M/, "M");
            poles.setAttribute("d", d);
          };
          upd();
          s.drag(vpG, { space: svg, onMove: p => { vx = clamp(p.x, 120, 520); vy = clamp(p.y, 80, 300); upd(); s.sfx.tick(); } });
          const mkRow = (label, col, html) => { const e = box(s, "ex", "", html); e.insertBefore(s.h("span", { class: "exlabel", style: { color: col } }, label), e.firstChild); return e; };
          const r1 = mkRow("Horizont", "#dc3b2a", "Deine Augenhöhe: die rote Linie.");
          const r2 = mkRow("Fluchtpunkt", "#dc3b2a", "Hier treffen sich die Linien. Zieh ihn!");
          const r3 = mkRow("Fluchtlinien", "#dc3b2a", "Gleise, Schwellen und Masten führen hin.");
          const m = merk(s, "<b>Zentralperspektive</b>: Alle Linien nach hinten laufen zu einem Fluchtpunkt.");
          const life = s.photo("gleise", { w: 430, h: 164, pos: "50% 22%", caption: "Echte Gleise: sie treffen sich am Horizont", cls: "later" });
          s.add(cols(s, svg, stack(s, 10, r1, r2, r3, m, life), 640));
          s.step(async () => { s.sfx.swoosh(); s.say("Zuerst der Horizont, deine Augenhöhe."); s.show(r1, "left"); await s.show(horizon, "draw"); });
          s.step(async () => { s.sfx.boing(); s.say("Dann der Fluchtpunkt."); s.show(r2, "left"); await s.show(vpG, "bounce"); });
          s.step(async () => { s.sfx.scribble(); s.show(r3, "left"); await s.show(guides, "fade"); });
          s.step(async () => { s.sound("ubahn-train", { vol: .4, dur: 4 }); s.say("Jetzt kommen die Gleise."); s.show(railA, "draw"); await s.wait(500); s.show(sleepers, "fade"); await s.show(poles, "fade"); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); await s.show(life, "zoom"); });
        },
      },
      /* 7b --------------------------------------------------------------- */
      {
        title: "Zentralperspektive in der Kunst",
        say: "Vor über fünfhundert Jahren malte ein Künstler in Italien diese ideale Stadt. Alles läuft auf die Mitte zu.",
        build(s) {
          const W = 1100, H = 317;
          const pic = s.photo("citta-ideale", { w: W, h: H });
          const ov = s.svg(W, H); ov.style.cssText = "position:absolute;left:0;top:0;pointer-events:none";
          const vx = W * 0.5, vy = H * 0.74;
          const hz = s.el("line", { x1: 0, y1: vy, x2: W, y2: vy, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "10 7", class: "later" });
          const lines = s.el("g", { class: "later" }, ...[0, 180, 380, 720, 920, 1100].map(x => s.el("line", { x1: x, y1: H, x2: vx, y2: vy, stroke: "#dc3b2a", "stroke-width": 3, opacity: .85 })));
          const vp = s.el("circle", { cx: vx, cy: vy, r: 10, fill: "#dc3b2a", stroke: "#fff", "stroke-width": 3, class: "later" });
          ov.append(hz, lines, vp);
          const wrap = s.h("div", { style: { position: "relative", width: W + "px", height: H + "px" } }, pic, ov);
          const r1 = box(s, "ex", "Der Fluchtpunkt", "Er liegt in der Mitte, ungefähr bei der Tür des runden Gebäudes. Dort ist auch der <b>Horizont</b>.");
          const r2 = box(s, "ex", "Die ideale Stadt (um 1480–1490)", "Wer sie gemalt hat, weiß niemand genau. Das Bild hängt heute in Urbino in Italien.");
          const m = merk(s, "Im 15. Jahrhundert entdeckten Künstler in Italien die <b>Zentralperspektive</b> und probierten sie in Bildern wie diesem aus.");
          s.add(stack(s, 14, wrap, s.h("div", { class: "cols3", style: { gap: "14px", gridTemplateColumns: "1fr 1fr 1.3fr" } }, r1, r2, m)));
          s.show(pic, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.swoosh(); await s.show(hz, "draw"); s.say("Das ist der Horizont."); });
          s.step(async () => { s.sfx.scribble(); await s.show(lines, "fade"); s.sfx.boing(); await s.show(vp, "pop"); await s.show(r1, "up"); s.say("Alle Linien laufen zum Fluchtpunkt in der Mitte."); });
          s.step(async () => { s.sfx.pop(); await s.show(r2, "up"); await s.wait(150); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Flur und Straße",
        say: "Ziehe den roten Punkt. Der Raum verändert sich, weil sich deine Augenhöhe verändert.",
        build(s) {
          const W = 640, H = 440, F = 300;
          const svg = s.svg(W, H);
          let vx = 320, vy = 200, scene = "flur";
          const g = s.el("g", { class: "later" }); svg.append(g);
          const vpG = s.el("g", { class: "later" }, s.el("circle", { r: 30, fill: "rgba(220,59,42,.15)", stroke: "#dc3b2a", "stroke-width": 3 }), s.el("circle", { r: 8, fill: "#dc3b2a" }));
          svg.append(vpG);
          const P = (x, y, z) => proj(x, y, z, vx, vy, F), Q = (pts) => pts.map(p => P(p[0], p[1], p[2]));
          const add = (pts, fill, extra = {}) => g.append(s.el("path", Object.assign({ d: polyD(Q(pts)), fill }, extra)));
          const addP = (d, o) => g.append(s.el("path", Object.assign({ d, fill: "none" }, o)));
          const render = () => {
            g.replaceChildren(); vpG.setAttribute("transform", `translate(${vx} ${vy})`);
            if (scene === "flur") {
              const zn = 1.4, zb = 18, X = 1.6, Fy = 1.5, Cy = -1.3;
              add([[-X, Cy, zn], [X, Cy, zn], [X, Cy, zb], [-X, Cy, zb]], "#f7f1e8");
              add([[-X, Fy, zn], [X, Fy, zn], [X, Fy, zb], [-X, Fy, zb]], "#d9bfa0");
              add([[-X, Cy, zn], [-X, Fy, zn], [-X, Fy, zb], [-X, Cy, zb]], "#efe2d0");
              add([[X, Cy, zn], [X, Fy, zn], [X, Fy, zb], [X, Cy, zb]], "#e2d1ba");
              add([[-X, Cy, zb], [X, Cy, zb], [X, Fy, zb], [-X, Fy, zb]], "#cdbfae");
              add([[-.5, Fy - 2.1, zb], [.5, Fy - 2.1, zb], [.5, Fy, zb], [-.5, Fy, zb]], "#8a5a3c", { stroke: INK, "stroke-width": 2 });
              [[-X, 4, 5.4], [X, 8, 9.4], [-X, 11, 12.4]].forEach(([x, a, b]) => add([[x, Fy - 2.1, a], [x, Fy - 2.1, b], [x, Fy, b], [x, Fy, a]], "#a8764d", { stroke: INK, "stroke-width": 2 }));
              [3, 6, 9, 12].forEach(z => add([[-.35, Cy, z], [.35, Cy, z], [.35, Cy, z + .6], [-.35, Cy, z + .6]], "#fff3b0", { stroke: "#c9b04a", "stroke-width": 1.5 }));
              let d = ""; for (let z = zn; z <= zb; z += 1) { const a = P(-X, Fy, z), b = P(X, Fy, z); d += `M${a[0]},${a[1]}L${b[0]},${b[1]}`; }
              for (const x of [-.8, 0, .8]) { const a = P(x, Fy, zn), b = P(x, Fy, zb); d += `M${a[0]},${a[1]}L${b[0]},${b[1]}`; }
              addP(d, { stroke: "#a98a6a", "stroke-width": 1.5 });
              const outline = [[-X, Cy, zn], [-X, Cy, zb], [X, Cy, zb], [X, Cy, zn], [X, Cy, zb], [X, Fy, zb], [X, Fy, zn], [X, Fy, zb], [-X, Fy, zb], [-X, Fy, zn], [-X, Fy, zb], [-X, Cy, zb]];
              addP(dotsD(Q(outline)), { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" });
            } else {
              g.append(s.el("rect", { width: W, height: H, fill: "#d9ecfb" }));
              const zn = 2, zf = 80;
              add([[-30, 1.5, zn], [30, 1.5, zn], [30, 1.5, zf], [-30, 1.5, zf]], "#9aa0ab");
              add([[3, 1.5, zn], [4.6, 1.5, zn], [4.6, 1.5, zf], [3, 1.5, zf]], "#d6d0c4"); add([[-4.6, 1.5, zn], [-3, 1.5, zn], [-3, 1.5, zf], [-4.6, 1.5, zf]], "#d6d0c4");
              let dd = ""; for (let z = 4; z < 70; z += 6) { const p = Q([[-.1, 1.5, z], [.1, 1.5, z], [.1, 1.5, z + 2.5], [-.1, 1.5, z + 2.5]]); dd += polyD(p); }
              addP(dd, { fill: "#fff" });
              const blocks = [[3, 11, 9, "#e6a98f"], [11.3, 22, 15, "#a9bfd9"], [22.3, 40, 11, "#e8d49a"], [40.3, 80, 18, "#c4b0d6"]];
              for (const side of [-1, 1]) blocks.forEach(([a, b, h, c], k) => {
                const x = side * 4.6, hh = side < 0 ? h : [14, 8, 17, 12][k], col2 = side < 0 ? c : ["#b9d3a8", "#e9b6b0", "#9fc7c9", "#d8c8a0"][k];
                add([[x, 1.5 - hh, a], [x, 1.5 - hh, b], [x, 1.5, b], [x, 1.5, a]], col2, { stroke: INK, "stroke-width": 2 });
                let w = ""; for (let z = a + 1; z < Math.min(b - 1.2, 50); z += 2.2) for (let y = 1.5 - 2.6; y > 1.5 - hh + 1; y -= 3) w += polyD(Q([[x, y - 1.5, z], [x, y - 1.5, z + 1.1], [x, y, z + 1.1], [x, y, z]]));
                addP(w, { fill: "#fff", stroke: "#6c7a93", "stroke-width": 1 });
              });
            }
          };
          render();
          s.drag(vpG, { space: svg, onMove: p => { vx = clamp(p.x, 150, 490); vy = clamp(p.y, 90, 300); render(); s.sfx.tick(); } });
          const btns = {}; const set = n => { scene = n; s.sound(n === "str" ? "traffic" : "footsteps", { vol: .4, dur: 2.5 }); Object.entries(btns).forEach(([k, b]) => b.classList.toggle("solid", k === n)); render(); };
          btns.flur = s.h("button", { class: "btn solid later", onclick: () => set("flur") }, "Flur"); btns.str = s.h("button", { class: "btn later", onclick: () => set("str") }, "Straße");
          const r1 = box(s, "ex", "Ein Fluchtpunkt", "Alle Kanten, die nach hinten laufen, treffen sich im roten Punkt.");
          const r2 = box(s, "ex", "Zieh den Punkt", "Fluchtpunkt hoch: du schaust von oben. Tief: du bist klein. Seitlich: du stehst nicht in der Mitte.");
          const life = s.photo("karl-marx-allee", { w: 430, h: 250, caption: "Karl-Marx-Allee in Berlin: ein Fluchtpunkt", cls: "later" });
          s.add(cols(s, stack(s, 12, svg, s.h("div", { class: "row" }, btns.flur, btns.str)), stack(s, 12, r1, r2, life), 640));
          s.step(async () => { s.sfx.whoosh(); s.say("Das ist ein Flur."); s.show(r1, "left"); await s.show(g, "fade"); });
          s.step(async () => { s.sfx.boing(); s.say("Ziehe den roten Punkt."); s.show(r2, "left"); s.show(vpG, "bounce"); });
          s.step(async () => { s.sfx.pop(); s.say("Probiere auch die Straße."); s.show(btns.flur, "up"); s.show(btns.str, "up", 120); await s.show(life, "zoom", 200); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Würfel in Perspektive",
        say: "So zeichnest du einen Würfel in Perspektive, Schritt für Schritt. Du kannst den Fluchtpunkt verschieben.",
        build(s) {
          const W = 640, H = 440;
          const svg = s.svg(W, H);
          const F = { l: 170, t: 230, r: 330, b: 390 };
          let vx = 470, vy = 120, k = 0.6;
          const sty = { stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" };
          const guides = [0, 1, 2, 3].map(() => s.el("line", { stroke: "#dc3b2a", "stroke-width": 2, "stroke-dasharray": "8 6", class: "later" }));
          const back = s.el("path", Object.assign({ fill: "none", class: "later" }, sty, { "stroke-width": 3 }));
          const fT = s.el("path", Object.assign({ fill: "#fceee3", class: "later" }, sty)), fR = s.el("path", Object.assign({ fill: "#e2ac86", class: "later" }, sty)), fL = s.el("path", Object.assign({ fill: "#e9c4a6", class: "later" }, sty)), fB = s.el("path", Object.assign({ fill: "#d9b79a", class: "later" }, sty));
          const front = s.el("rect", Object.assign({ x: F.l, y: F.t, width: 160, height: 160, fill: "#f6dcc8", class: "later" }, sty));
          const vpG = s.el("g", { class: "later" }, s.el("circle", { r: 28, fill: "rgba(220,59,42,.15)", stroke: "#dc3b2a", "stroke-width": 3 }), s.el("circle", { r: 8, fill: "#dc3b2a" }));
          svg.append(s.el("rect", { width: W, height: H, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), ...guides, back, fB, fL, fR, fT, front, vpG);
          let facesOn = false;
          const upd = () => {
            const cs = [[F.l, F.t], [F.r, F.t], [F.r, F.b], [F.l, F.b]];
            const bs = cs.map(([x, y]) => [vx + (x - vx) * k, vy + (y - vy) * k]);
            guides.forEach((l, i) => { l.setAttribute("x1", cs[i][0]); l.setAttribute("y1", cs[i][1]); l.setAttribute("x2", vx); l.setAttribute("y2", vy); });
            back.setAttribute("d", polyD(bs));
            const face = (el, a, b, show) => { el.setAttribute("d", polyD([cs[a], cs[b], bs[b], bs[a]])); el.setAttribute("display", show && facesOn ? "" : "none"); };
            face(fT, 0, 1, vy < F.t); face(fB, 3, 2, vy > F.b); face(fR, 1, 2, vx > F.r); face(fL, 0, 3, vx < F.l);
            vpG.setAttribute("transform", `translate(${vx} ${vy})`);
          };
          upd();
          s.drag(vpG, { space: svg, onMove: p => { vx = clamp(p.x, 40, 600); vy = clamp(p.y, 40, 420); upd(); s.sfx.tick(); } });
          const sl = s.slider({ label: "Tiefe des Würfels", min: 0.3, max: 0.9, step: 0.05, value: 0.6, fmt: v => Math.round(v * 100) + " %", onInput: v => { k = v; upd(); } });
          sl.classList.add("later");
          const rows = [["1", "Quadrat zeichnen: die Vorderseite."], ["2", "Fluchtpunkt setzen, Ecken verbinden."], ["3", "Kleineres Quadrat: die Rückseite."], ["4", "Sichtbare Kanten nachzeichnen."]].map(([n, t]) => box(s, "ex", "Schritt " + n, t));
          const life = box(s, "life", "Im Alltag", "Schachteln, Schränke und Häuser.");
          s.add(cols(s, stack(s, 10, svg), stack(s, 10, ...rows, sl, life), 640));
          s.step(async () => { s.sfx.snap(); s.show(rows[0], "left"); await s.show(front, "draw"); });
          s.step(async () => { s.sfx.boing(); s.say("Der Fluchtpunkt kommt dazu."); s.show(rows[1], "left"); s.show(vpG, "bounce"); await s.wait(400); s.sfx.scribble(); await s.show(guides, "draw"); });
          s.step(async () => { s.sfx.snap(); s.show(rows[2], "left"); await s.show(back, "draw"); s.show(sl, "up"); });
          s.step(async () => { s.sfx.success(); s.show(rows[3], "left"); facesOn = true; guides.forEach(l => { l.style.opacity = .3; }); upd(); [fB, fL, fR, fT].forEach(f => f.classList.remove("later")); await s.show([fR, fT], "fade"); await s.show(life, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Frosch, Normal, Vogel",
        say: "Von wo schaust du? Von unten, aus Augenhöhe oder von hoch oben? Probiere alle drei Blickwinkel aus.",
        build(s) {
          const W = 640, H = 440, F = 240;
          const svg = s.svg(W, H);
          const sky = s.el("rect", { width: W, fill: "#d9ecfb" }), gnd = s.el("rect", { width: W, fill: "#cfe8b8" });
          const hor = s.el("line", { x1: 0, x2: W, stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "10 7" });
          const g = s.el("g", {}); svg.append(sky, gnd, g, hor);
          const modes = {
            frog: { E: 0.3, vy: 370, dz: 0, name: "Froschperspektive", txt: "Du schaust von ganz unten nach oben. Alles wirkt riesig und mächtig.", ex: "Ein Hochhaus von der Straße aus, ein Superhelden-Poster, ein Kind, das zu einem Erwachsenen hochschaut.", hz: "Der Horizont liegt tief im Bild." },
            normal: { E: 1.6, vy: 220, dz: 0, name: "Normalperspektive", txt: "Du schaust aus deiner Augenhöhe. So siehst du die Welt jeden Tag.", ex: "Ein Handyfoto im Stehen, ein Foto vom Schulhof, ein Selfie.", hz: "Der Horizont liegt etwa in der Mitte." },
            bird: { E: 25, vy: -150, dz: 5, name: "Vogelperspektive", txt: "Du schaust von hoch oben nach unten. Alles wirkt klein und du hast den Überblick.", ex: "Ein Drohnenfoto, eine Karte, ein Spielbrett von oben.", hz: "Der Horizont liegt oben, oder sogar außerhalb des Bildes." },
          };
          let cur = { E: 1.6, vy: 220, dz: 0 }, mode = "normal";
          const bl = [[-8, -3, 12, 16, 8, "#b9c7e3"], [-1.5, 3.5, 10, 14, 10, "#e8b9a0"], [5, 10, 11, 15, 6, "#c9dfb8"]];
          const render = () => {
            const { E, vy, dz } = cur;
            sky.setAttribute("height", clamp(vy, 0, H)); gnd.setAttribute("y", clamp(vy, 0, H)); gnd.setAttribute("height", H - clamp(vy, 0, H));
            hor.setAttribute("y1", vy); hor.setAttribute("y2", vy); hor.setAttribute("display", vy >= 0 && vy <= H ? "" : "none");
            g.replaceChildren();
            const Pt = (x, h, z) => [320 + F * x / (z + dz), vy + F * (E - h) / (z + dz)];
            const poly = (pts, fill, extra) => g.append(s.el("path", Object.assign({ d: polyD(pts.map(p => Pt(...p))), fill, stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" }, extra || {})));
            [...bl].sort((a, b) => b[2] - a[2]).forEach(([x0, x1, z0, z1, h, c]) => {
              if (x0 > 0) poly([[x0, 0, z0], [x0, h, z0], [x0, h, z1], [x0, 0, z1]], "#cfc2b8");
              poly([[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], c);
              if (x1 < 0) poly([[x1, 0, z0], [x1, h, z0], [x1, h, z1], [x1, 0, z1]], c);
              if (E > h) poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], "#f3efe6");
              let w = ""; for (let hh = 1.4; hh + 1.2 < h; hh += 2.4) for (let x = x0 + 0.6; x + 0.8 < x1; x += 1.6) w += polyD([[x, hh, z0], [x + .8, hh, z0], [x + .8, hh + 1.1, z0], [x, hh + 1.1, z0]].map(p => Pt(...p)));
              g.append(s.el("path", { d: w, fill: "#fff", stroke: "#6c7a93", "stroke-width": 1 }));
            });
            const [px, py] = Pt(0, 0, 7), [, ph] = Pt(0, 1.7, 7);
            g.append(person(s, px, py, py - ph, "#c2410c"));
          };
          render();
          const name = s.h("p", { class: "big", style: { color: UC } }), txt = s.h("p", { class: "t" }), hz = s.h("p", { class: "small pencil" });
          const pics = { frog: s.photo("fernsehturm-unten", { w: 430, h: 210, pos: "50% 35%", caption: "Fernsehturm von unten" }), normal: s.photo("karl-marx-allee", { w: 430, h: 210, caption: "Straße in Augenhöhe" }), bird: s.photo("berlin-von-oben", { w: 430, h: 210, caption: "Blick vom Fernsehturm nach unten" }) };
          const exBox = s.h("div", { style: { width: "430px", height: "210px", position: "relative" } }, ...Object.values(pics));
          const show = () => { const m = modes[mode]; name.textContent = m.name; txt.textContent = m.txt; hz.textContent = m.hz; for (const k in pics) pics[k].style.display = k === mode ? "" : "none"; };
          show();
          const btns = {};
          const go = k => { if (k === "frog") s.sound("laubfrosch-ruf", { vol: .45, dur: 1.5 }); else if (k === "bird") s.sound("birds", { vol: .4, dur: 2.5 }); else s.sfx.whoosh(); mode = k; show(); Object.entries(btns).forEach(([n, b]) => b.classList.toggle("solid", n === k)); const f = { ...cur }, t = modes[k]; s.tween({ from: 0, to: 1, dur: 800, update: v => { cur = { E: f.E + (t.E - f.E) * v, vy: f.vy + (t.vy - f.vy) * v, dz: f.dz + (t.dz - f.dz) * v }; render(); } }); };
          [["frog", "Frosch"], ["normal", "Normal"], ["bird", "Vogel"]].forEach(([k, n]) => { btns[k] = s.h("button", { class: "btn later" + (k === "normal" ? " solid" : ""), onclick: () => go(k) }, n); });
          const m = merk(s, "Der Unterschied liegt im Horizont: tief im Bild = Frosch, in der Mitte = normal, oben = Vogel.");
          const right = stack(s, 12, name, txt, hz, exBox, m);
          [name, txt, hz, exBox].forEach(e => e.classList.add("later"));
          s.add(cols(s, stack(s, 12, svg, s.h("div", { class: "row" }, ...Object.values(btns))), right, 640));
          s.step(async () => { s.sfx.whoosh(); s.say("Das ist die Normalperspektive."); s.show([name, txt, hz, exBox], "left"); s.show(btns.frog, "up"); s.show(btns.normal, "up", 100); await s.show(btns.bird, "up", 200); });
          s.step(async () => { s.say("Tippe auf Frosch oder Vogel."); go("frog"); await s.wait(1000); });
          s.step(async () => { go("bird"); await s.wait(1000); });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Parallel oder Fluchtpunkt?",
        say: "Es gibt zwei Arten, einen Würfel zu zeichnen. Bei der einen bleiben Linien parallel, bei der anderen laufen sie zusammen.",
        build(s) {
          const W = 640, H = 440;
          const svg = s.svg(W, H);
          const F = { l: 140, t: 200, r: 300, b: 360 }, C = [(F.l + F.r) / 2, (F.t + F.b) / 2], D = [70, -55];
          const sty = { stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" };
          const gl = [1, 2, 3].map(() => s.el("line", { stroke: "#dc3b2a", "stroke-width": 2, "stroke-dasharray": "8 6" }));
          const fT = s.el("path", Object.assign({ fill: "#fceee3" }, sty)), fR = s.el("path", Object.assign({ fill: "#e2ac86" }, sty));
          const front = s.el("rect", Object.assign({ x: F.l, y: F.t, width: 160, height: 160, fill: "#f6dcc8" }, sty));
          const vp = s.el("circle", { r: 9, fill: "#dc3b2a" });
          const cube = s.el("g", { class: "later" }, ...gl, fR, fT, front, vp);
          svg.append(s.el("rect", { width: W, height: H, rx: 12, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), cube);
          const word = s.h("p", { class: "big", style: { color: UC } });
          const upd = p => {
            const k = 1 - p * 0.0045, V = p === 0 ? [C[0] + D[0] * 100, C[1] + D[1] * 100] : [C[0] + D[0] / (1 - k), C[1] + D[1] / (1 - k)];
            const cs = [[F.l, F.t], [F.r, F.t], [F.r, F.b], [F.l, F.b]];
            const bs = p === 0 ? cs.map(([x, y]) => [x + D[0], y + D[1]]) : cs.map(([x, y]) => [V[0] + (x - V[0]) * k, V[1] + (y - V[1]) * k]);
            fT.setAttribute("d", polyD([cs[0], cs[1], bs[1], bs[0]])); fR.setAttribute("d", polyD([cs[1], cs[2], bs[2], bs[1]]));
            [1, 2, 0].forEach((ci, i) => { gl[i].setAttribute("x1", bs[ci][0]); gl[i].setAttribute("y1", bs[ci][1]); gl[i].setAttribute("x2", V[0]); gl[i].setAttribute("y2", V[1]); });
            const showV = p > 8;
            vp.setAttribute("cx", V[0]); vp.setAttribute("cy", V[1]); vp.setAttribute("display", showV ? "" : "none"); gl.forEach(l => l.setAttribute("display", showV ? "" : "none"));
            word.textContent = p < 8 ? "Parallelperspektive" : "Mit Fluchtpunkt";
          };
          upd(0);
          const sl = s.slider({ label: "Der Fluchtpunkt kommt näher", min: 0, max: 100, step: 5, value: 0, fmt: v => v < 8 ? "weit weg" : v < 60 ? "näher" : "ganz nah", onInput: upd });
          sl.classList.add("later");
          const r1 = box(s, "ex", "Parallel", "Alle Kanten, die nach hinten gehen, bleiben parallel. Das ist einfach zu zeichnen.");
          const r2 = box(s, "ex", "Mit Fluchtpunkt", "Die Kanten laufen zusammen. So sieht es auch ein Foto.");
          const life = s.photo("genji-emaki", { w: 430, h: 190, pos: "70% 50%", caption: "Japan, 12. Jh.: Kanten bleiben parallel", cls: "later" });
          s.add(cols(s, svg, stack(s, 10, word, sl, r1, r2, life), 640));
          s.step(async () => { s.sfx.snap(); s.say("Erst der Würfel ohne Fluchtpunkt."); s.show(r1, "left"); await s.show(cube, "pop"); });
          s.step(async () => { s.sfx.pop(); s.say("Jetzt holen wir den Fluchtpunkt heran."); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); s.show(r2, "left"); await s.show(life, "zoom"); s.say("Alte japanische Bildrollen zeigen Häuser schräg von oben, mit parallelen Kanten. Minecraft-Blöcke werden oft genauso gezeichnet."); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Proportionen: das Gesicht",
        say: "Auch ein Gesicht hat Regeln. Es ist in drei gleiche Teile geteilt und so breit wie fünf Augen.",
        build(s) {
          const svg = s.svg(520, 540);
          const red = { stroke: "#dc3b2a", "stroke-width": 2.5, "stroke-dasharray": "9 6", fill: "none" };
          const face = s.el("path", { d: "M110,280 a150,215 0 1,0 300,0 a150,215 0 1,0 -300,0", fill: "#fbe3cf", stroke: INK, "stroke-width": 4, class: "later" });
          const hair = s.el("path", { d: "M110,235 C90,-20 430,-20 410,235 C380,61 140,61 110,235Z", fill: "#6b4a2a", stroke: INK, "stroke-width": 3, class: "later" });
          const hl = [105, 235, 365, 495].map(y => s.el("path", Object.assign({ d: `M70,${y}L450,${y}`, class: "later" }, red)));
          const nums = [170, 300, 430].map((y, i) => s.el("g", { class: "later" }, s.el("circle", { cx: 40, cy: y, r: 20, fill: "#dc3b2a" }), s.el("text", { x: 40, y: y + 8, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#fff", text: String(i + 1) })));
          const bl = { stroke: "#1d5bd0", "stroke-width": 2.5, "stroke-dasharray": "9 6", fill: "none" };
          const vl = [110, 170, 230, 290, 350, 410].map(x => s.el("path", Object.assign({ d: `M${x},150L${x},470`, class: "later" }, bl)));
          const eyes = [200, 320].map(x => s.el("g", { class: "later" }, s.el("path", { d: `M${x - 30},255 Q${x},232 ${x + 30},255 Q${x},276 ${x - 30},255Z`, fill: "#fff", stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: x, cy: 255, r: 9, fill: "#2f6db5" }), s.el("circle", { cx: x, cy: 255, r: 4, fill: INK })));
          const feat = s.el("g", { class: "later" }, s.el("path", { d: "M172,232 Q200,216 228,230 M292,230 Q320,216 348,232", stroke: INK, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: "M260,262 C254,310 240,340 238,356 Q260,372 282,356 C280,340 266,310 260,262", stroke: INK, "stroke-width": 3, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: "M222,425 Q260,450 298,425 M232,420 Q260,408 288,420", stroke: "#b83a2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
            s.el("path", { d: "M110,270 Q88,270 90,305 Q94,330 112,326 M410,270 Q432,270 430,305 Q426,330 408,326", stroke: INK, "stroke-width": 3, fill: "none" }));
          svg.append(face, hair, ...hl, ...nums, ...vl, ...eyes, feat);
          const r1 = box(s, "ex", "Drei gleiche Teile", "Haaransatz bis Augenbrauen, Augenbrauen bis Nasenbasis, Nasenbasis bis Kinn.");
          const r2 = box(s, "ex", "Fünf Augen breit", "Der Kopf ist so breit wie fünf Augen. Zwischen den Augen passt genau ein Auge.");
          const r3 = box(s, "ex", "Kindergesichter", "Große Stirn, große runde Augen, Nase und Mund sitzen tiefer: das Kindchenschema.");
          const life = box(s, "life", "Im Alltag", "Porträtfotos, Emojis, Manga- und Comicfiguren: Gesichter folgen Regeln.");
          s.add(cols(s, svg, stack(s, 10, r1, r2, r3, life), 520));
          s.step(async () => { s.sfx.scribble(); s.say("Zuerst der Kopf."); await s.show(face, "draw"); s.show(hair, "fade"); });
          s.step(async () => { s.sfx.swoosh(); s.show(r1, "left"); for (const l of hl) { s.sfx.tick(); s.show(l, "draw"); await s.wait(250); } await s.show(nums, "pop"); });
          s.step(async () => { s.sfx.swoosh(); s.show(r2, "left"); for (const l of vl) { s.sfx.tick(); s.show(l, "draw"); await s.wait(180); } s.sfx.pop(); await s.show(eyes, "pop"); });
          s.step(async () => { s.sfx.pop(); s.show(r3, "left"); await s.show(feat, "fade"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Proportionen: der Körper",
        say: "Miss den Körper in Köpfen. Erwachsene sind etwa sieben bis siebeneinhalb Köpfe groß. Kinder haben einen größeren Kopf.",
        build(s) {
          const SW = 520, SH = 560, CX = 290, GY = 548;
          const svg = s.svg(SW, SH);
          svg.append(s.el("line", { x1: 8, y1: GY, x2: SW - 8, y2: GY, stroke: "#9aa6bb", "stroke-width": 3 }));
          const fig = s.el("g", { class: "later" }), bands = s.el("g", { class: "later" }), frame = s.el("rect", { fill: "none", stroke: "#dc3b2a", "stroke-width": 3, "stroke-dasharray": "10 7", class: "later" });
          svg.append(frame, bands, fig);
          let a = 1;
          const render = () => {
            const H = 340 + 100 * a, hh = 58 + 0.7 * a, top = GY - H;
            fig.replaceChildren(); bands.replaceChildren();
            const wood = "#e6b98a", st = { stroke: INK, "stroke-width": 3, fill: wood };
            const sh = top + hh * 1.25, cr = sh + 2.45 * hh, bw = (1.5 + 0.3 * a) * hh;
            const ln = (x1, y1, x2, y2, w) => s.el("line", { x1, y1, x2, y2, stroke: INK, "stroke-width": w + 6, "stroke-linecap": "round" });
            const ln2 = (x1, y1, x2, y2, w) => s.el("line", { x1, y1, x2, y2, stroke: wood, "stroke-width": w, "stroke-linecap": "round" });
            const parts = [[CX - hh * .3, cr, CX - hh * .4, GY - 6, hh * .55], [CX + hh * .3, cr, CX + hh * .4, GY - 6, hh * .55], [CX - bw / 2 + 6, sh + hh * .35, CX - H / 2 + 8, sh + hh * .35, hh * .4], [CX + bw / 2 - 6, sh + hh * .35, CX + H / 2 - 8, sh + hh * .35, hh * .4]];
            parts.forEach(p => fig.append(ln(...p), ln2(...p)));
            fig.append(s.el("rect", Object.assign({ x: CX - bw / 2, y: sh, width: bw, height: cr - sh, rx: hh * .45 }, st)), s.el("rect", Object.assign({ x: CX - hh * .12, y: top + hh * .9, width: hh * .24, height: hh * .4 }, st)), s.el("ellipse", Object.assign({ cx: CX, cy: top + hh / 2, rx: hh * .38, ry: hh / 2 }, st)));
            const n = Math.ceil(H / hh - 0.001);
            for (let i = 0; i < n; i++) { const y0 = top + i * hh, hgt = Math.min(hh, GY - y0); bands.append(s.el("rect", { x: 14, y: y0, width: 34, height: hgt, fill: i % 2 ? "#fde9dc" : "#f7c9a8", stroke: UC, "stroke-width": 2 })); if (hgt > hh * .9) bands.append(s.el("text", { x: 31, y: y0 + hh / 2 + 7, "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: INK, text: String(i + 1) })); }
            frame.setAttribute("x", CX - H / 2); frame.setAttribute("y", top); frame.setAttribute("width", H); frame.setAttribute("height", H);
          };
          render();
          const sl = s.slider({ label: "Alter", min: 0, max: 1, step: 0.05, value: 1, fmt: v => v < 0.15 ? "Kind" : v > 0.85 ? "Erwachsene" : "Jugendliche", onInput: v => { a = v; render(); } });
          sl.classList.add("later");
          const r1 = box(s, "ex", "Der Kopf als Maß", "Ein Kopf misst vom Scheitel bis zum Kinn. Damit zählst du die Körpergröße.");
          const r2 = box(s, "ex", "Erwachsene", "Etwa 7 bis 7,5 Köpfe groß. Gezeichnete Helden oft 8.");
          const r3 = s.h("div", { class: "ex later", style: { display: "flex", gap: "14px", alignItems: "center", padding: "8px 12px" } }, s.photo("vitruv-mensch", { w: 160, h: 160, pos: "50% 45%" }), s.h("div", {}, s.h("span", { class: "exlabel" }, "Arme ausgestreckt"), s.h("p", { class: "small", html: "So breit wie der Körper hoch ist: ein <b>Quadrat</b>! Leonardo da Vinci zeichnete das um 1490." })));
          const r4 = box(s, "ex", "Kinder", "Größerer Kopf im Verhältnis zum Körper. Schiebe den Regler!");
          s.add(cols(s, svg, stack(s, 8, r1, r2, r3, sl, r4), 520));
          s.step(async () => { s.sfx.pop(); s.say("Das ist unser Holzmännchen."); await s.show(fig, "up"); });
          s.step(async () => { s.sfx.tick(); s.say("Wir zählen die Köpfe."); s.show(r1, "left"); await s.show(bands, "left"); s.show(r2, "left", 200); });
          s.step(async () => { s.sfx.snap(); s.show(r3, "left"); await s.show(frame, "draw"); });
          s.step(async () => { s.sfx.pop(); s.say("Und jetzt schrumpft das Männchen zum Kind."); s.show(r4, "left"); await s.show(sl, "up"); });
          s.step(async () => { s.sfx.ding(); s.say("Manga-Figuren haben oft extra große Köpfe. Das wirkt niedlich."); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Dürer und die Perspektive",
        say: "Vor rund fünfhundert Jahren haben Künstler die Perspektive erforscht. Auch Albrecht Dürer hat darüber ein Buch geschrieben.",
        build(s) {
          const card = (year, html) => s.h("div", { class: "card later", style: { padding: "12px 18px 14px" } }, s.h("p", { class: "h2", style: { color: UC } }, year), s.h("p", { class: "small", html }));
          const c1 = card("1415–1420", "Filippo Brunelleschi zeichnet Gebäude in Florenz in richtiger Perspektive.");
          const c2 = card("um 1435", "Leon Battista Alberti schreibt „De pictura“ und erklärt die Regeln der Perspektive.");
          const c3 = card("1525", "Albrecht Dürer zeigt in seinem Buch „Underweysung der Messung“ die Perspektive mit zwei Fluchtpunkten.");
          const top = s.h("div", { class: "cols3", style: { gap: "16px" } }, c1, c2, c3);
          const scene = () => {
            const st = { fill: "none", stroke: INK, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
            return s.el("g", {},
              s.el("path", Object.assign({ d: "M30,170 L30,100 L90,60 L150,100 L150,170Z M70,170 L70,125 L110,125 L110,170 M122,100 L122,78 L136,78 L136,91" }, st)),
              s.el("path", Object.assign({ d: "M215,172 L215,118 M186,118 C170,66 262,66 244,118 C262,142 176,144 186,118Z" }, st)),
              s.el("path", Object.assign({ d: "M0,174 C90,156 210,188 320,164 M296,40 a18,18 0 1,0 -36,0 a18,18 0 1,0 36,0" }, st)));
          };
          const lines = (stroke, w) => ["M80,0V240", "M160,0V240", "M240,0V240", "M0,80H320", "M0,160H320"].map(d => s.el("path", { d, stroke, "stroke-width": w, fill: "none" }));
          const win = s.svg(320, 240); win.classList.add("later");
          win.append(s.el("rect", { width: 320, height: 240, fill: "#eaf4fd" }), scene(), ...lines("#8a5a2b", 4), s.el("rect", { x: 2, y: 2, width: 316, height: 236, fill: "none", stroke: "#8a5a2b", "stroke-width": 6 }));
          const hl = s.el("rect", { width: 80, height: 80, fill: "rgba(220,59,42,.25)", stroke: "#dc3b2a", "stroke-width": 3, display: "none" }); win.append(hl);
          const paper = s.svg(320, 240); paper.classList.add("later");
          paper.append(s.el("rect", { width: 320, height: 240, fill: "#fff" }), ...lines("#d8cfe8", 2));
          const cells = [];
          for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const g = clipG(s, paper, 0, 0, 1, 1); g.removeAttribute("transform"); g.removeAttribute("clip-path");
            const id = "cell" + (++uid); paper.append(s.el("clipPath", { id }, s.el("rect", { x: c * 80, y: r * 80, width: 80, height: 80 }))); g.setAttribute("clip-path", `url(#${id})`); g.append(scene()); g.classList.add("later"); cells.push([g, c * 80, r * 80]); }
          paper.append(s.el("rect", { x: 2, y: 2, width: 316, height: 236, fill: "none", stroke: "#c8d3de", "stroke-width": 4 }));
          const arrow = s.svg(60, 60); arrow.classList.add("later"); arrow.append(s.el("path", { d: "M8,30H46M34,16L48,30L34,44", stroke: UC, "stroke-width": 6, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
          const m = merk(s, "Schau durch das Gitter und zeichne Quadrat für Quadrat ab. Das ist ein guter Trick zum Üben.");
          const colA = stack(s, 6, win, s.h("p", { class: "small pencil later", html: "Du schaust durch ein Gitter." }));
          const colB = stack(s, 6, paper, s.h("p", { class: "small pencil later", html: "Du zeichnest Quadrat für Quadrat." }));
          const bottom = s.h("div", { style: { display: "grid", gridTemplateColumns: "320px 60px 320px minmax(0,1fr)", gap: "14px", alignItems: "center" } }, colA, s.h("div", {}, arrow), colB, m);
          s.add(stack(s, 16, top, bottom));
          s.step(async () => { s.sfx.pop(); s.show(c1, "up"); await s.wait(300); s.sfx.pop(); await s.show(c2, "up"); });
          s.step(async () => { s.sfx.ding(); s.say("Dürer schrieb 1525 ein Buch darüber."); await s.show(c3, "up"); });
          s.step(async () => { s.sfx.whoosh(); s.say("Probiere einen Trick zum Üben."); s.show(colA.lastChild, "fade"); await s.show(win, "zoom"); });
          s.step(async () => {
            s.show(arrow, "left"); s.show([paper, colB.lastChild], "fade"); await s.wait(300); hl.removeAttribute("display");
            for (const [g, x, y] of cells) { hl.setAttribute("x", x); hl.setAttribute("y", y); s.sfx.tick(); s.show(g, "fade"); await s.wait(300); }
            hl.setAttribute("display", "none"); s.sfx.success();
          });
          s.step(async () => { s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 14b --------------------------------------------------------------- */
      {
        title: "Dürers Zeichenmaschine",
        say: "Dürer hat eine Maschine erfunden, mit der man eine Laute ganz genau in Perspektive zeichnen kann.",
        build(s) {
          const pic = s.photo("duerer-laute", { w: 620, h: 441, caption: "Dürer: Der Zeichner der Laute (1525)" });
          const r1 = box(s, "ex", "1 · Der Faden", "Ein Faden führt von einem Punkt an der Wand zur Laute – wie ein Blick vom Auge.");
          const r2 = box(s, "ex", "2 · Der Rahmen", "Wo der Faden durch den Rahmen geht, wird ein Punkt auf das Blatt übertragen.");
          const r3 = box(s, "ex", "3 · Punkt für Punkt", "Viele Punkte ergeben die Laute in richtiger Perspektive.");
          const m = merk(s, "Dieser Holzschnitt steht in Dürers Buch <b>„Underweysung der Messung“</b> (1525).");
          s.add(cols(s, pic, stack(s, 10, r1, r2, r3, m), 620));
          s.show(pic, "zoom"); s.sound("pencil-write", { vol: .4 });
          s.step(async () => { s.sfx.pop(); await s.show(r1, "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(r2, "left"); });
          s.step(async () => { s.sfx.tick(); await s.show(r3, "left"); s.sfx.ding(); await s.show(m, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Perspektive überall",
        say: "Perspektive steckt in Fotos, in Computerspielen, auf Gleisen, in Minecraft-Blöcken und sogar in Straßenmalerei.",
        build(s) {
          const card = (title, sub, svg, extra) => s.h("div", { class: "card later", style: { padding: "12px 14px 14px" } }, svg, s.h("p", { class: "h2", style: { fontSize: "26px", margin: "4px 0" } }, title), s.h("p", { class: "small", html: sub }), extra);
          const L = (d, o) => s.el("path", Object.assign({ d, fill: "none", stroke: INK, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round", class: "later" }, o));
          const items = [];
          // 1 photo
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 20, y: 8, width: 260, height: 114, rx: 6, fill: "#fff", stroke: INK, "stroke-width": 4 }), s.el("rect", { x: 30, y: 16, width: 240, height: 50, fill: "#d9ecfb" }), s.el("rect", { x: 30, y: 66, width: 240, height: 48, fill: "#cfe8b8" }));
            const road = s.el("polygon", { points: "125,114 175,114 153,66 147,66", fill: "#9aa0ab", class: "later" }), hz = L("M30,66H270", { stroke: "#dc3b2a", "stroke-dasharray": "9 6" });
            svg.append(road, hz); items.push([card("Fotos", "Auf jedem Foto gibt es einen Horizont.", svg), async () => { s.show(road, "up"); await s.wait(400); s.show(hz, "draw"); }]); }
          // 2 game camera
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 10, y: 10, width: 135, height: 110, rx: 8, fill: "#cfe8b8", stroke: INK, "stroke-width": 3 }), s.el("rect", { x: 155, y: 10, width: 135, height: 110, rx: 8, fill: "#d9ecfb", stroke: INK, "stroke-width": 3 }), s.el("rect", { x: 156, y: 66, width: 133, height: 53, fill: "#cfe8b8" }));
            const a = s.el("g", { class: "later" }, s.el("circle", { cx: 50, cy: 40, r: 14, fill: "#3f9a4a" }), s.el("circle", { cx: 110, cy: 90, r: 14, fill: "#3f9a4a" }), s.el("circle", { cx: 78, cy: 66, r: 8, fill: "#c2410c" }));
            const b = s.el("g", { class: "later" }, s.el("polygon", { points: "200,119 245,119 226,66 219,66", fill: "#9aa0ab" }), s.el("circle", { cx: 222, cy: 80, r: 9, fill: "#c2410c" }), s.el("rect", { x: 213, y: 90, width: 18, height: 26, rx: 5, fill: "#c2410c" }));
            svg.append(a, b); items.push([card("Spiele-Kamera", "Mal von oben, mal hinter der Figur.", svg), async () => { s.show(a, "pop"); await s.wait(400); s.show(b, "pop"); }]); }
          // 3 rails
          { const svg = s.svg(300, 130); svg.append(s.el("rect", { x: 10, y: 8, width: 280, height: 114, rx: 8, fill: "#d9ecfb" }), s.el("rect", { x: 10, y: 50, width: 280, height: 72, fill: "#cfe8b8" }));
            const r1 = L("M110,122L148,50M190,122L152,50", { "stroke-width": 5, stroke: "#4b5262" }); let d = ""; for (let t = 0.15; t < 1; t += 0.2) { const y = 122 - 72 * t, hw = 40 * (1 - t) + 2; d += `M${150 - hw},${y}L${150 + hw},${y}`; }
            const r2 = L(d, { stroke: "#8a5a2b" }), hz = L("M10,50H290", { stroke: "#dc3b2a", "stroke-dasharray": "9 6", "stroke-width": 2 });
            svg.append(hz, r1, r2); items.push([card("Bahngleise", "Die Schienen scheinen sich am Horizont zu treffen.", svg), async () => { s.show(r1, "draw"); await s.wait(500); s.show(r2, "draw"); await s.wait(300); s.show(hz, "draw"); }]); }
          // 4 blocks
          { const svg = s.svg(300, 130); const cube = (x, y, k, V) => { const cs = [[x, y], [x + 54, y], [x + 54, y + 54], [x, y + 54]]; const bs = V ? cs.map(c => [V[0] + (c[0] - V[0]) * k, V[1] + (c[1] - V[1]) * k]) : cs.map(c => [c[0] + 22, c[1] - 18]);
              const st = { stroke: INK, "stroke-width": 3, "stroke-linejoin": "round", class: "later" };
              return s.el("g", {}, s.el("path", Object.assign({ d: polyD([cs[1], cs[2], bs[2], bs[1]]), fill: "#e2ac86" }, st)), s.el("path", Object.assign({ d: polyD([cs[0], cs[1], bs[1], bs[0]]), fill: "#fceee3" }, st)), s.el("rect", Object.assign({ x, y, width: 54, height: 54, fill: "#f6dcc8" }, st))); };
            const g1 = cube(30, 56, 1, null), g2 = cube(185, 60, 0.65, [270, 24]); svg.append(g1, g2);
            g1.querySelectorAll(".later").forEach(e => e.classList.remove("later")); g2.querySelectorAll(".later").forEach(e => e.classList.remove("later")); g1.classList.add("later"); g2.classList.add("later");
            items.push([card("Blöcke", "Parallel gezeichnet (links) oder mit Fluchtpunkt (rechts).", svg), async () => { s.show(g1, "pop"); await s.wait(400); s.show(g2, "pop"); }]); }
          // 5 chalk art
          { const svg = s.svg(300, 130); svg.append(s.el("polygon", { points: "20,126 280,126 262,100 38,100", fill: "#9aa0ab" }));
            const ch = s.el("g", { class: "later" }); const fc = (pts, fill) => s.el("polygon", { points: pts, fill, stroke: INK, "stroke-width": 2.5 });
            ch.append(fc("-25,-42 0,-55 25,-42 0,-30", "#fceee3"), fc("-25,-42 0,-30 0,0 -25,-14", "#f6dcc8"), fc("0,-30 25,-42 25,-14 0,0", "#e2ac86"));
            let sy = 2.1; const apply = () => ch.setAttribute("transform", `translate(150 124) scale(1 ${sy})`); apply(); svg.append(ch);
            let flat = false;
            const btn = s.h("button", { class: "btn later", style: { marginTop: "6px", width: "100%" }, onclick: () => { s.sfx.whoosh(); flat = !flat; const f = sy; s.tween({ from: f, to: flat ? 1 : 2.1, dur: 900, update: v => { sy = v; apply(); } }); btn.textContent = flat ? "Zurück zum Boden" : "Blickwinkel wechseln"; } }, "Blickwinkel wechseln");
            items.push([card("3D-Straßenmalerei", "Auf dem Boden ist das Bild lang gezogen. Vom richtigen Punkt aus wirkt es räumlich.", svg, btn), async () => { s.show(ch, "up"); await s.wait(500); s.show(btn, "up"); }]); }
          const m = merk(s, "Perspektive begegnet dir beim Fotografieren, Spielen und Zeichnen. Jetzt kannst du sie benutzen!");
          s.add(s.h("div", { class: "cols3", style: { gap: "14px", gridAutoRows: "min-content", alignItems: "stretch" } }, ...items.map(i => i[0]), m));
          s.step(async () => { s.sound("camera-shutter", { vol: .6 }); items.slice(0, 3).forEach(i => s.show(i[0], "up")); await Promise.all(items.slice(0, 3).map(i => i[1]())); });
          s.step(async () => { s.sfx.pop(); items.slice(3).forEach(i => s.show(i[0], "up")); await Promise.all(items.slice(3).map(i => i[1]())); });
          s.step(async () => { s.sfx.fanfare(); await s.show(m, "up"); });
        },
      },
    ],
  });
})();
