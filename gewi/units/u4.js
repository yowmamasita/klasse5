/* Kapitel 4 – Vom Feld auf den Teller (Jungsteinzeit + Landwirtschaft heute). Fakten geprüft 2026-10-04, Quellen im Bericht. */
(() => {
  const C = "#c2410c", INK = "#1b2740", PEN = "#5d6678";

  const tx = (s, x, y, t, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.a || "middle", "font-size": o.fs || 20, "font-weight": o.fw || 600, fill: o.fill || INK }, o.cls ? { class: o.cls } : {}), t);
  function tl(s, x, y, lines, o = {}) {
    const fs = o.fs || 20;
    const t = s.el("text", Object.assign({ x, y, "text-anchor": o.a || "middle", "font-size": fs, "font-weight": o.fw || 600, fill: o.fill || INK }, o.cls ? { class: o.cls } : {}));
    lines.forEach((L, i) => { const sp = s.el("tspan", { x, dy: i ? fs * 1.2 : 0 }, L); if (i === 0 && o.bold) sp.setAttribute("font-weight", 800); t.append(sp); });
    return t;
  }
  const box = (s, cls, label, ...kids) => s.h("div", { class: cls }, label ? s.h("span", { class: "exlabel" }, label) : null, ...kids);
  const P = (s, txt, cls = "small") => s.h("p", { class: cls }, txt);
  const g = (s, attrs, ...k) => s.el("g", attrs || {}, ...k);

  /* Schaf in lokalen Koordinaten 0..210 × 0..100 */
  function sheepFig(s) {
    const c = "#f3efe6", legs = "#5a4a3a", gg = g(s, {});
    [50, 70, 118, 138].forEach(x => gg.append(s.el("rect", { x, y: 66, width: 11, height: 32, rx: 4, fill: legs })));
    gg.append(s.el("path", { d: "M34 50 q-14 6 -12 22", stroke: legs, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }));
    gg.append(s.el("ellipse", { cx: 94, cy: 52, rx: 62, ry: 26, fill: c }));
    [48, 70, 92, 114, 136].forEach((x, i) => gg.append(s.el("circle", { cx: x, cy: 34 + (i % 2) * 4, r: 15, fill: c })));
    gg.append(s.el("path", { d: "M140 42 L158 22 L172 30 L156 62 Z", fill: c }), s.el("ellipse", { cx: 172, cy: 32, rx: 22, ry: 12, fill: "#3b3028", transform: "rotate(25 172 32)" }), s.el("circle", { cx: 168, cy: 27, r: 3, fill: "#1b1b1b" }));
    return gg;
  }

  Deck.unit({
    id: "u4", num: 4, title: "Vom Feld auf den Teller", color: C, soft: "#fde9dc",
    subtitle: "Von den ersten Bauern bis zu deinem Frühstück",
    blurb: "Sesshaft werden, Ötzi, Spargel aus Beelitz und der Weg der Schrippe.",
    goals: ["Wie die Menschen sesshaft wurden (Jungsteinzeit)", "Woher Getreide und Haustiere kommen", "Was Ötzi bei sich trug", "Wie Essen heute vom Feld auf deinen Teller kommt"],
    icon(svg, el) {
      svg.append(el("path", { d: "M35 64 L35 14", stroke: "#c2410c", "stroke-width": 4, "stroke-linecap": "round" }));
      [18, 28, 38].forEach(y => svg.append(el("ellipse", { cx: 28, cy: y, rx: 6, ry: 9, fill: "#e0a43a", transform: `rotate(-30 28 ${y})` }), el("ellipse", { cx: 42, cy: y, rx: 6, ry: 9, fill: "#e0a43a", transform: `rotate(30 42 ${y})` })));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Vom Jagen zum Säen",
        say: "Vor etwa 11.500 Jahren begann etwas Neues: Menschen legten Felder an, hielten Tiere und blieben an einem Ort. Sie wurden sesshaft.",
        build(s) {
          const svg = s.svg(580, 460);
          svg.append(s.el("rect", { x: 0, y: 0, width: 580, height: 300, rx: 18, fill: "#e6f2fb" }), s.el("rect", { x: 0, y: 290, width: 580, height: 170, rx: 18, fill: "#cdb27e" }), s.el("rect", { x: 0, y: 290, width: 580, height: 18, fill: "#8cbf62" }));
          const tag = tx(s, 290, 50, "Vorher: umherziehen", { fs: 28, fw: 800, fill: C });
          const before = g(s, {},
            s.el("path", { d: "M100 300 L160 200 L220 300 Z", fill: "#8a5a3c" }), s.el("path", { d: "M148 300 L160 262 L172 300 Z", fill: "#3b2416" }),
            s.el("path", { d: "M240 360 Q360 330 540 360", stroke: PEN, "stroke-width": 4, "stroke-dasharray": "4 12", fill: "none", "stroke-linecap": "round" }),
            ...[300, 360, 420].map((x, i) => g(s, {}, s.el("circle", { cx: x, cy: 330 - 6 * i, r: 9, fill: "#8a5a3c" }), s.el("rect", { x: x - 8, y: 340 - 6 * i, width: 16, height: 24, rx: 6, fill: "#a0743f" }))),
            s.el("path", { d: "M530 350 l14 10 l-16 6", stroke: PEN, "stroke-width": 4, fill: "none" }));
          const house = g(s, { class: "later" },
            s.el("rect", { x: 50, y: 220, width: 230, height: 80, fill: "#b08a5a", stroke: "#6b4a22", "stroke-width": 3 }),
            s.el("path", { d: "M36 224 L165 150 L294 224 Z", fill: "#d9b45a", stroke: "#8a6a2a", "stroke-width": 3 }),
            s.el("rect", { x: 150, y: 250, width: 30, height: 50, fill: "#3b2416" }),
            s.el("path", { d: "M70 240 l20 30 M95 240 l20 30 M200 240 l20 30 M225 240 l20 30", stroke: "#8a6a3a", "stroke-width": 3 }));
          const rows = [];
          for (let i = 0; i < 5; i++) { const y = 330 + i * 24; const r = g(s, { class: "later" }); for (let x = 320; x < 560; x += 22) r.append(s.el("path", { d: `M${x} ${y} l0 -18 m-5 6 l5 -8 l5 8`, stroke: "#5f9e45", "stroke-width": 3, fill: "none" })); svg.append(r); rows.push(r); }
          const sheep = g(s, { class: "later" }, ...[[90, 380], [160, 400]].map(([x, y]) => g(s, { transform: `translate(${x} ${y}) scale(.45)` }, sheepFig(s))));
          svg.append(tag, before, house, sheep);
          const right = s.h("div", { class: "stack" },
            box(s, "ex", "Vorher", P(s, "Jagen, sammeln, weiterziehen – wie in der Altsteinzeit.")),
            box(s, "ex later", "Nachher", P(s, "Felder anlegen, Tiere halten, Häuser bauen. Ein Feld braucht Pflege – also bleibt man da: Die Menschen werden sesshaft.")),
            s.h("div", { class: "merk later" }, s.h("b", null, "Neolithische Revolution:"), " der Wechsel zu Ackerbau und Viehzucht. Er begann im Fruchtbaren Halbmond, ca. 9500 bis 7000 v. Chr. – also ganz langsam, über viele Generationen."));
          const [, e2, merk] = right.children;
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "580px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, svg, right));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => {
            s.sfx.swoosh(); await s.tween({ from: 1, to: 0, dur: 500, update: v => before.setAttribute("opacity", v) });
            tag.textContent = "Nachher: sesshaft"; s.sfx.pop(); s.show(house, "pop"); s.show(e2, "left");
            for (let i = 0; i < rows.length; i++) { s.sfx.count(i); s.show(rows[i], "up"); await s.wait(140); }
            s.sound("schaf", { vol: .7 }); await s.show(sheep, "bounce");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Das nennt man Neolithische Revolution. Sie begann im Fruchtbaren Halbmond."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der Fruchtbare Halbmond",
        say: "Der Ackerbau begann im Fruchtbaren Halbmond. Das ist ein Bogen aus fruchtbarem Land in Vorderasien, geformt wie eine Mondsichel.",
        build(s) {
          const W = 640, H = 420;
          const p = (lon, lat) => [lon * 10.67, (55 - lat) * 12.7];
          const poly = a => a.map(([x, y]) => p(x, y).map(v => v.toFixed(1)).join(",")).join(" ");
          const path = a => "M" + a.map(([x, y]) => p(x, y).map(v => v.toFixed(1)).join(" ")).join(" L");
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#efe2c4" }));
          const sea = "#bcd9ee";
          const med = [[0, 35.8], [5, 36.8], [10, 37.2], [11, 35], [10.5, 34], [11.5, 33.2], [15, 32.4], [19, 30.4], [20, 31], [20, 32.5], [23, 32.6], [25, 31.6], [29, 30.9], [32, 31.2], [34.3, 31.3], [35, 32.8], [35.6, 34.5], [36, 35.8], [36.2, 36.6], [34.5, 36.8], [32.5, 36.1], [30.6, 36.8], [29, 36.6], [27.5, 37], [27.2, 38.3], [26.3, 38.5], [26.8, 39.5], [26.2, 40.1], [25, 40.9], [23.7, 40.7], [22.9, 40.6], [23.4, 39.9], [22.8, 39.3], [23.2, 38.5], [24, 38.1], [23, 37.4], [22.8, 36.5], [22.1, 37], [21.6, 36.8], [21.1, 37.8], [21.3, 38.3], [20.7, 39], [20, 39.7], [19.4, 40.9], [19.5, 41.8], [18.5, 42.5], [16.5, 43.5], [15, 44.5], [14, 45.2], [13.6, 45.7], [12.3, 45.3], [12.3, 44.3], [13.5, 43.6], [14.2, 42.4], [15.8, 41.9], [16.2, 41.3], [17.9, 40.6], [18.5, 40.1], [17.2, 40.4], [16.5, 39.6], [17.1, 38.9], [16.1, 37.9], [15.6, 38.2], [15.8, 39.5], [15.2, 40.2], [14.5, 40.6], [12.6, 41.4], [11.5, 42.4], [10.5, 43], [10.2, 43.9], [8.8, 44.4], [7.5, 43.8], [6, 43.1], [4.6, 43.4], [3.2, 43.1], [3.1, 41.9], [2.2, 41.3], [0.9, 41], [0, 39.8]];
          const black = [[28, 41.2], [28.5, 43.5], [29.6, 45.3], [30.7, 46.5], [33.5, 44.6], [36.5, 45.2], [38, 47], [39.5, 46.8], [37.6, 44.7], [41.6, 41.6], [36.2, 41.6], [31.5, 41.2]];
          const casp = [[47, 44.5], [49.5, 46.5], [53, 47], [53, 45], [51, 44.5], [51.5, 41], [53, 40], [53.8, 37.3], [50, 37.4], [49, 38.5], [49.5, 40.5], [48.5, 41.8]];
          const gulf = [[48, 30], [50.5, 29], [51.5, 27.5], [54, 24.2], [56.4, 26.4], [56.2, 27], [54, 26.7], [52, 27.8], [50.3, 29.5], [48.8, 30.4]];
          const red = [[32.5, 29.9], [34.6, 28], [36, 26], [38.5, 22], [37, 22], [35, 24], [33.5, 27]];
          [med, black, casp, gulf, red].forEach(a => svg.append(s.el("polygon", { points: poly(a), fill: sea, stroke: "#8db6d6", "stroke-width": 2 })));
          [[[12.4, 38.1], [15.6, 38.3], [15.1, 36.7], [12.5, 37.6]], [[8.4, 41.2], [9.6, 41], [9.7, 39.2], [8.5, 38.9]], [[8.6, 43], [9.5, 42.9], [9.3, 41.4], [8.6, 41.8]], [[23.5, 35.6], [26.3, 35.3], [26.2, 35], [23.6, 35.2]], [[32.3, 35.1], [34.6, 35.6], [33.9, 34.7], [32.5, 34.7]]].forEach(a => svg.append(s.el("polygon", { points: poly(a), fill: "#efe2c4", stroke: "#8db6d6", "stroke-width": 1.5 })));
          [[[31, 30.5], [31.2, 27], [32.6, 25], [32.9, 22]], [[38.5, 38.7], [38, 36.5], [40.5, 34.5], [44, 32], [47, 30.5]], [[40.5, 38], [42.5, 37], [43.2, 36], [44.4, 33.3], [46, 31.5], [47.5, 30.5]]].forEach(r => svg.append(s.el("path", { d: path(r), stroke: "#3a86c8", "stroke-width": 4, fill: "none", "stroke-linejoin": "round" })));
          svg.append(tx(s, ...p(17, 34.6), "Mittelmeer", { fs: 22, fw: 700, fill: "#3a6f9a" }), tx(s, ...p(34.5, 43.4), "Schwarzes Meer", { fs: 19, fw: 700, fill: "#3a6f9a" }),
            tx(s, ...p(38.6, 33.4), "Euphrat", { fs: 19, fw: 700, fill: "#2a6aa8" }), tx(s, ...p(47.8, 34.4), "Tigris", { fs: 19, fw: 700, fill: "#2a6aa8" }), tx(s, ...p(29, 25.5), "Nil", { fs: 19, fw: 700, fill: "#2a6aa8" }));
          const crescent = s.el("path", { d: path([[34.8, 30.5], [35.8, 33.5], [36.6, 36.2], [39, 37.3], [42.5, 37.2], [45.3, 35.3], [47, 32.8], [48, 30.6]]), stroke: "#4c9a2a", "stroke-width": 34, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none", opacity: .55, class: "later" });
          svg.insertBefore(crescent, svg.children[11]);
          const [cx0, cy0] = p(32.8, 37.67);
          const cat = g(s, { class: "later" }, s.el("circle", { cx: cx0, cy: cy0, r: 9, fill: C, stroke: "#fff", "stroke-width": 3 }), tx(s, cx0 - 16, cy0 + 7, "Çatalhöyük", { a: "end", fs: 20, fw: 800, fill: C }));
          const spread = s.el("path", { d: path([[27, 41.3], [22, 43.8], [15, 47.6], [9, 50.5]]), stroke: C, "stroke-width": 7, fill: "none", "stroke-linecap": "round", "stroke-dasharray": "2 14", class: "later" });
          const arrowHead = s.el("path", { d: `M${p(9, 50.5)[0]} ${p(9, 50.5)[1]} l22 -2 m-22 2 l10 18`, stroke: C, "stroke-width": 6, fill: "none", "stroke-linecap": "round", class: "later" });
          const me = tl(s, ...p(10.5, 53), ["Mitteleuropa: um 5700 v. Chr."], { a: "start", fs: 20, fw: 800, fill: C, cls: "later" });
          svg.append(cat, spread, arrowHead, me);
          const b1 = box(s, "ex later", "Wo ist das?", P(s, "Ein Bogen aus fruchtbarem Land, geformt wie eine Mondsichel. Heute liegen dort Irak, Syrien, Libanon, Israel, Palästina und Jordanien. Den Namen erfand 1916 der Forscher James H. Breasted."));
          const b2 = box(s, "ex later", "Warum gerade hier?", P(s, "Hier wuchsen wilde Getreide-Gräser. Und hier lebten wilde Schafe, Ziegen, Rinder und Schweine – die Vorfahren unserer Haustiere."));
          const b3 = box(s, "life later", "Ganz langsam", P(s, "Der Ackerbau breitete sich Schritt für Schritt aus. Nach Mitteleuropa kam er erst um 5700 v. Chr. – mit den Bandkeramikern."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "640px 1fr", height: "100%", alignItems: "center", gap: "22px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, b1, b2, b3)));
          s.show(svg, "fade"); s.sfx.whoosh();
          s.step(async () => { s.sfx.scribble(); s.show(b1, "left"); await s.show(crescent, "draw"); s.sfx.ding(); });
          s.step(async () => { s.sfx.pop(); s.show(b2, "left"); await s.show(cat, "pop"); });
          s.step(async () => { s.sfx.whoosh(); s.show(b3, "left"); await s.show(spread, "draw"); s.show(arrowHead, "pop"); s.sfx.pop(); await s.show(me, "fade"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Aus Gras wird Getreide",
        say: "Bei wildem Getreide fällt die reife Ähre auseinander. Die Bauern säten immer wieder die Körner, die an der Ähre blieben. So entstand unser Getreide.",
        build(s) {
          const svg = s.svg(480, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 480, height: 420, rx: 18, fill: "#fdf3e6" }), s.el("rect", { x: 0, y: 405, width: 480, height: 25, rx: 8, fill: "#b48a5a" }));
          const mkEar = (x) => {
            const stalk = g(s, {});
            stalk.append(s.el("path", { d: `M${x} 410 Q${x - 6} 260 ${x} 120`, stroke: "#9a8a3a", "stroke-width": 5, fill: "none" }));
            const grains = [];
            for (let i = 0; i < 8; i++) { const y = 135 + i * 16, side = i % 2 ? 1 : -1; const gr = s.el("ellipse", { cx: x + side * 11, cy: y, rx: 8, ry: 13, fill: "#e0a43a", stroke: "#a56c1a", "stroke-width": 2, transform: `rotate(${side * 25} ${x + side * 11} ${y})` }); grains.push(gr); stalk.append(gr); }
            stalk.append(s.el("path", { d: `M${x - 6} 135 l-6 -40 M${x + 6} 135 l6 -40 M${x} 125 l0 -44`, stroke: "#c9a64a", "stroke-width": 2 }));
            svg.append(stalk); return { stalk, grains, x };
          };
          const wild = mkEar(140), cult = mkEar(340);
          svg.append(tx(s, 140, 455, "wildes Einkorn", { fs: 22, fw: 800 }), tx(s, 340, 455, "Kultur-Einkorn", { fs: 22, fw: 800, fill: C }));
          const res1 = tx(s, 140, 70, "Körner fallen ab!", { fs: 21, fw: 800, fill: "#dc3b2a", cls: "later" }), res2 = tx(s, 340, 70, "Körner bleiben dran", { fs: 21, fw: 800, fill: "#138a5a", cls: "later" });
          svg.append(res1, res2);
          const fall = wild.grains.map((gr, i) => ({ gr, dx: (i % 2 ? 1 : -1) * (20 + (i * 13) % 50), dy: 400 - (135 + i * 16) - 6 }));
          let busy = false;
          async function wind() {
            if (busy) return; busy = true; s.sfx.whoosh();
            fall.forEach(f => f.gr.setAttribute("transform", f.gr.getAttribute("transform").split(" translate")[0]));
            s.hide([res1, res2]);
            await s.tween({ from: 0, to: 1, dur: 1200, ease: "linear", update: v => { const a = 8 * Math.sin(v * Math.PI * 4) * (1 - v); [wild, cult].forEach(e => e.stalk.setAttribute("transform", `rotate(${a} ${e.x} 410)`)); } });
            s.sfx.scribble();
            await s.tween({ from: 0, to: 1, dur: 800, ease: "in", update: v => fall.forEach(f => { const base = f.gr.getAttribute("transform").split(" translate")[0]; f.gr.setAttribute("transform", `${base} translate(${f.dx * v} ${f.dy * v})`); }) });
            s.show(res1, "pop"); s.show(res2, "pop", 200); s.sfx.ding(); busy = false;
          }
          const btn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); wind(); } }, "Wind!");
          const grainCards = [["Einkorn", "wohl zuerst gezähmt in der Südost-Türkei"], ["Emmer", "seit mindestens 10.000 Jahren angebaut"], ["Gerste", "eine der ersten Getreidearten"]].map(([n, t]) => s.h("div", { class: "card later", style: { padding: "10px 14px" } }, s.h("p", { class: "h2", style: { color: C, fontSize: "24px" } }, n), P(s, t)));
          const right = s.h("div", { class: "stack" },
            box(s, "ex", "Was passiert?", P(s, "Bei wildem Getreide zerfällt die reife Ähre – die Körner fallen auf den Boden. Die ersten Bauern ernteten und säten vor allem Körner, die an der Ähre blieben. So entstand nach vielen Jahren Getreide, das man gut ernten kann.")),
            s.photo("einkorn", { w: "100%", h: 150, pos: "50% 45%", caption: "Echte Einkorn-Ähren", cls: "later" }),
            s.h("div", { class: "cols3", style: { gap: "10px" } }, grainCards),
            box(s, "life later", "Im Alltag", P(s, "Getreide steckt in Brot, Brötchen, Nudeln und Müsli. Und Ötzis letzte Mahlzeit enthielt Einkorn!")));
          const life = right.children[3], ek = right.children[1];
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "480px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, s.h("div", { class: "stack", style: { alignItems: "center", gap: "10px" } }, svg, btn), right));
          s.show(svg, "fade"); s.sfx.pop();
          s.step(async () => { await wind(); s.say("Beim wilden Einkorn fallen die Körner ab. Beim Kultur-Einkorn bleiben sie dran."); });
          s.step(async () => { s.sound("korn-schuetten", { vol: .5, dur: 2 }); s.show(ek, "zoom"); for (let i = 0; i < 3; i++) { s.show(grainCards[i], "pop"); await s.wait(180); } });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Aus Wildtieren werden Haustiere",
        say: "Vor rund 10.000 bis 11.000 Jahren zähmten die Menschen im Vorderen Orient die ersten Nutztiere: Schaf, Ziege, Rind und Schwein.",
        build(s) {
          const rows = [
            [() => s.photo("mufflon", { w: "100%", h: 128, caption: "Mufflon" }), () => s.photo("schafe", { w: "100%", h: 128, caption: "Schaf" }), "Schaf", "Wolle, Milch, Fleisch", "schaf"],
            [() => s.photo("bezoarziege", { w: "100%", h: 128, pos: "40% 50%", caption: "Bezoarziege" }), () => s.photo("hausziege", { w: "100%", h: 128, caption: "Ziege" }), "Ziege", "Milch, Fleisch, Fell", "ziege-meckern"],
            [() => s.photo("auerochse", { w: "100%", h: 128, pos: "30% 50%", caption: "Auerochse (Skelett)" }), () => s.photo("rind", { w: "100%", h: 128, caption: "Rind" }), "Rind", "Milch, Fleisch, Leder – später zieht es Pflug und Wagen", "kuh-muhen"],
            [() => s.photo("wildschwein", { w: "100%", h: 128, caption: "Wildschwein" }), () => s.photo("hausschwein", { w: "100%", h: 128, caption: "Schwein" }), "Schwein", "Fleisch, Leder – frisst auch Reste", "schwein-grunzen"],
          ];
          const cols = rows.map(([wild, home, hn, use, snd]) => {
            const arr = s.h("p", { class: "later", style: { textAlign: "center", font: "800 30px/1 var(--f-display)", color: C } }, "↓");
            const hb = s.h("div", { class: "later" }, home());
            const text = s.h("div", { class: "later" }, s.h("p", { class: "t", style: { fontWeight: 800, color: C } }, hn), P(s, use));
            const el = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 12px" } }, wild(), arr, hb, text);
            el._p = { arr, hb, text, snd }; return el;
          });
          const head = P(s, "Vor rund 10.000 bis 11.000 Jahren wurden im Vorderen Orient die ersten Nutztiere gezähmt. Oben Wildtier, unten Haustier.");
          const foot = box(s, "life later", "Übrigens", P(s, "Der Hund war schon viel früher da: Ihn zähmten schon Jäger und Sammler."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "10px" } }, head, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" } }, cols), foot));
          const reveal = async i => { const c = cols[i]; s.sfx.pop(); await s.show(c, "up"); await s.show(c._p.arr, "down"); s.sound(c._p.snd, { vol: .7 }); s.show(c._p.hb, "zoom"); await s.show(c._p.text, "fade"); };
          reveal(0);
          s.step(async () => { await reveal(1); });
          s.step(async () => { await reveal(2); s.say("Aus dem großen Auerochsen wurde das Hausrind."); });
          s.step(async () => { await reveal(3); });
          s.step(async () => { s.sfx.ding(); await s.show(foot, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Vorrat, Überschuss, Berufe",
        say: "Bauern konnten Vorräte in Töpfen aus Ton lagern. Wenn es mehr Essen gab als nötig, mussten nicht mehr alle aufs Feld. So entstanden Berufe.",
        build(s) {
          const svg = s.svg(380, 460);
          const coils = [];
          const widths = [70, 100, 122, 132, 128, 112, 90, 78];
          widths.forEach((w, i) => { const y = 400 - i * 34; const e = s.el("ellipse", { cx: 190, cy: y, rx: w, ry: 18, fill: "#c97a4a", stroke: "#8a4a22", "stroke-width": 3, class: "later" }); coils.push(e); svg.append(e); });
          const potD = "M120 412 Q100 400 70 340 Q50 280 80 200 Q100 160 112 150 L268 150 Q280 160 300 200 Q330 280 310 340 Q280 400 260 412 Z";
          const pot = s.el("path", { d: potD, fill: "#c97a4a", stroke: "#8a4a22", "stroke-width": 4, class: "later" });
          const bands = [[230, 0], [280, 1]].map(([y, k]) => s.el("path", { d: `M78 ${y} q19 -22 38 0 t38 0 t38 0 t38 0 t38 0 t38 0`, stroke: "#5a2a10", "stroke-width": 5, fill: "none", class: "later" }));
          const grain = s.el("ellipse", { cx: 190, cy: 152, rx: 76, ry: 14, fill: "#e0a43a", stroke: "#a56c1a", "stroke-width": 3, class: "later" });
          const lbl = tx(s, 190, 450, "Ton-Wülste aufeinander", { fs: 21, fw: 800, fill: C });
          svg.append(pot, ...bands, grain, lbl);
          const chain = [
            ["Ernte", "Getreide für viele Monate"],
            ["Vorrat", "in Töpfen aus Ton – sicher vor Mäusen und Nässe"],
            ["Überschuss", "mehr Essen, als man gerade braucht"],
            ["Berufe", "nicht alle müssen aufs Feld: Töpferin, Weber, Werkzeugmacher, Hirtin …"],
            ["Eigentum", "„mein Feld, mein Haus, meine Herde“ – mit Grenzen und manchmal Streit"],
          ].map(([a, b], i) => s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "178px 1fr", gap: "12px", alignItems: "center", background: i % 2 ? "var(--unit-soft)" : "var(--card)", border: "2px solid var(--line)", borderRadius: "14px", padding: "8px 14px" } },
            s.h("b", { style: { font: "800 22px/1.1 var(--f-display)", color: C } }, (i ? "→ " : "") + a), P(s, b)));
          const life = box(s, "life later", "Im Alltag", P(s, "Vorratsschrank, Einmachgläser, Kühlschrank – und heute gibt es Tausende Berufe."));
          svg.style.width = "300px"; svg.style.height = "363px";
          const realPot = s.photo("bandkeramik-topf", { w: 300, h: 230, pos: "50% 45%", caption: "Echter Topf der Bandkeramik", cls: "later" });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "300px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, svg, realPot), s.h("div", { class: "stack", style: { gap: "10px" } }, ...chain, life)));
          (async () => { for (let i = 0; i < coils.length; i++) { s.sfx.count(i); s.show(coils[i], "down"); await s.wait(120); } })();
          s.show(chain[0], "left");
          s.step(async () => { lbl.textContent = "glatt streichen"; s.sfx.scribble(); await s.show(pot, "fade"); s.hide(coils); lbl.textContent = "verzieren: Bänder!"; s.show(bands[0], "draw"); await s.show(bands[1], "draw", 200); s.show(chain[1], "left"); s.sfx.ding(); s.show(realPot, "zoom"); s.say("Wegen dieser Bandmuster heißen die ersten Bauern in Mitteleuropa Bandkeramiker."); });
          s.step(async () => { lbl.textContent = "Vorrat für den Winter"; s.sound("korn-schuetten", { vol: .6 }); await s.show(grain, "pop"); await s.show(chain[2], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(chain[3], "left"); });
          s.step(async () => { s.sfx.pop(); await s.show(chain[4], "left"); s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Die ersten Dörfer",
        say: "In Mitteleuropa bauten die ersten Bauern lange Holzhäuser. In Çatalhöyük in der Türkei standen die Häuser so dicht, dass man über die Dächer ging.",
        build(s) {
          // Langhaus
          const s1 = s.svg(500, 250); s1.style.height = "170px";
          s1.append(s.el("rect", { x: 0, y: 200, width: 500, height: 50, fill: "#cdb27e" }));
          const posts = g(s, {}, ...[40, 90, 140, 190, 240, 290, 340, 390, 440].map(x => s.el("rect", { x: x - 4, y: 110, width: 8, height: 92, fill: "#6b4a22" })));
          const walls = g(s, { class: "later" }, s.el("rect", { x: 36, y: 128, width: 412, height: 74, fill: "#c9a46a", stroke: "#8a6a3a", "stroke-width": 3 }));
          for (let x = 46; x < 446; x += 14) walls.append(s.el("path", { d: `M${x} 132 l8 66`, stroke: "#a8844a", "stroke-width": 2 }));
          walls.append(s.el("rect", { x: 220, y: 150, width: 34, height: 52, fill: "#3b2416" }));
          const roof = s.el("path", { d: "M18 132 L242 36 L466 132 Z", fill: "#d9b45a", stroke: "#8a6a2a", "stroke-width": 3, class: "later" });
          const man = g(s, { class: "later" }, s.el("circle", { cx: 482, cy: 172, r: 5, fill: "#8a5a3c" }), s.el("rect", { x: 478, y: 178, width: 9, height: 24, rx: 3, fill: "#a0743f" }));
          const scale = g(s, { class: "later" }, s.el("path", { d: "M36 222 L448 222 M36 214 L36 230 M448 214 L448 230", stroke: INK, "stroke-width": 3 }), tx(s, 242, 244, "ca. 20 m", { fs: 20, fw: 800 }));
          s1.append(posts, walls, roof, man, scale);
          // Çatalhöyük
          const s2 = s.svg(500, 250); s2.style.height = "170px";
          s2.append(s.el("rect", { x: 0, y: 200, width: 500, height: 50, fill: "#cdb27e" }));
          const blocks = [[20, 120, 90], [110, 100, 80], [190, 130, 100], [290, 110, 90], [380, 125, 100]];
          const houses = blocks.map(([x, y, w]) => s.el("rect", { x, y, width: w, height: 200 - y, fill: "#d9b48a", stroke: "#8a6a3a", "stroke-width": 3, class: "later" }));
          houses.forEach(hh => s2.append(hh));
          const hole = s.el("rect", { x: 225, y: 126, width: 30, height: 8, fill: "#3b2416", class: "later" });
          const ladder = g(s, { class: "later" }, s.el("path", { d: "M228 60 L228 180 M252 60 L252 180", stroke: "#6b4a22", "stroke-width": 5 }), ...[75, 95, 115, 135, 155, 175].map(y => s.el("path", { d: `M228 ${y} L252 ${y}`, stroke: "#6b4a22", "stroke-width": 4 })));
          const climber = g(s, { class: "later" }, s.el("circle", { cx: 0, cy: -30, r: 8, fill: "#8a5a3c" }), s.el("rect", { x: -8, y: -22, width: 16, height: 28, rx: 5, fill: "#a0743f" }));
          climber.setAttribute("transform", "translate(240 90)");
          const roofWalk = tx(s, 400, 60, "Eingang übers Dach!", { fs: 21, fw: 800, fill: C, cls: "later" });
          s2.append(hole, ladder, climber, roofWalk);
          const c1 = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" } }, s.photo("langhaus", { w: "100%", h: 190, pos: "50% 55%", caption: "Nachbau im Freilichtmuseum Oerlinghausen" }), s1, s.h("p", { class: "h2", style: { color: C, fontSize: "26px" } }, "Langhaus (Mitteleuropa)"),
            P(s, "Bandkeramiker, ca. 5700–4900 v. Chr. Meist ca. 20 m lang (12 bis 40 m) und ca. 7 m breit. Holzpfosten, Wände aus Flechtwerk und Lehm. Platz für 20 bis 30 Menschen."));
          const c2 = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" } }, s.photo("catalhoeyuek", { w: "100%", h: 190, caption: "Ausgrabung in Çatalhöyük" }), s2, s.h("p", { class: "h2", style: { color: C, fontSize: "26px" } }, "Çatalhöyük (Türkei)"),
            P(s, "Ca. 7500–5700 v. Chr., bei Konya. 3.500 bis 8.000 Menschen. Keine Straßen: Man ging über die Dächer und stieg durch eine Luke ins Haus. UNESCO-Welterbe seit 2012."));
          s.add(s.h("div", { class: "cols", style: { height: "100%", alignItems: "center", gap: "22px" } }, c1, c2));
          s.sound("stoeckchen", { vol: .6 });
          s.step(async () => { s.sfx.scribble(); await s.show(walls, "fade"); s.sfx.whoosh(); await s.show(roof, "down"); s.show(man, "pop"); await s.show(scale, "fade"); s.say("Ein Langhaus war meistens etwa 20 Meter lang."); });
          s.step(async () => { s.sfx.pop(); await s.show(c2, "up"); for (let i = 0; i < houses.length; i++) { s.sfx.count(i); s.show(houses[i], "up"); await s.wait(110); } });
          s.step(async () => { s.show(hole, "fade"); s.sfx.pop(); await s.show(ladder, "up"); s.show(climber, "pop"); s.show(roofWalk, "pop"); await s.tween({ from: 90, to: 160, dur: 1200, update: v => climber.setAttribute("transform", `translate(240 ${v})`) }); s.sfx.ding(); });
          if (s.fast) climber.setAttribute("transform", "translate(240 90)");
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Ötzi – der Mann aus dem Eis",
        say: "1991 fand ein Ehepaar beim Wandern in den Alpen eine Leiche im Eis. Es war Ötzi. Er lebte vor über 5.000 Jahren.",
        build(s) {
          const svg = s.svg(520, 470);
          const sky = s.el("rect", { x: 0, y: 0, width: 520, height: 470, rx: 18, fill: "#cfe6f7" });
          svg.append(sky,
            s.el("path", { d: "M0 330 L120 140 L200 250 L300 90 L420 260 L520 170 L520 470 L0 470 Z", fill: "#8a94a6" }),
            s.el("path", { d: "M90 188 L120 140 L150 183 L130 176 L118 192 Z M260 155 L300 90 L340 150 L318 142 L300 160 L282 146 Z M490 190 L520 170 L520 200 Z", fill: "#fff" }),
            s.el("path", { d: "M60 400 Q260 330 470 390 L520 470 L0 470 Z", fill: "#e9f4fb" }));
          const iceman = g(s, { class: "later" }, s.el("ellipse", { cx: 260, cy: 392, rx: 46, ry: 12, fill: "#a7c7dc", opacity: .8 }), s.el("path", { d: "M222 392 L292 386", stroke: "#7a5a3a", "stroke-width": 10, "stroke-linecap": "round" }), s.el("circle", { cx: 300, cy: 385, r: 8, fill: "#7a5a3a" }));
          const hikers = g(s, { class: "later" }, ...[[120, 0], [150, 1]].map(([x, i]) => g(s, {}, s.el("circle", { cx: x, cy: 352 + i * 4, r: 9, fill: i ? "#c2410c" : "#1d5bd0" }), s.el("rect", { x: x - 9, y: 362 + i * 4, width: 18, height: 30, rx: 6, fill: i ? "#c2410c" : "#1d5bd0" }), s.el("path", { d: `M${x + 12} ${366 + i * 4} l8 30`, stroke: "#5d6678", "stroke-width": 3 }))));
          const alt = g(s, { class: "later" }, s.el("rect", { x: 330, y: 300, width: 170, height: 40, rx: 10, fill: "#fff", stroke: C, "stroke-width": 3 }), tx(s, 415, 327, "über 3.000 m", { fs: 22, fw: 800, fill: C }));
          const tl0 = g(s, { class: "later" }, s.el("rect", { x: 20, y: 20, width: 480, height: 64, rx: 12, fill: "#fff", opacity: .92 }),
            s.el("line", { x1: 50, y1: 50, x2: 470, y2: 50, stroke: C, "stroke-width": 5, "stroke-linecap": "round" }),
            s.el("circle", { cx: 70, cy: 50, r: 8, fill: C }), tx(s, 70, 78, "Ötzi: um 3300 v. Chr.", { a: "start", fs: 19, fw: 800 }),
            s.el("circle", { cx: 460, cy: 50, r: 8, fill: "#1d5bd0" }), tx(s, 460, 78, "Fund: 1991", { a: "end", fs: 19, fw: 800, fill: "#1d5bd0" }));
          svg.append(iceman, hikers, alt, tl0);
          const b1 = box(s, "ex later", "Der Fund", P(s, "Am 19. September 1991 entdecken Erika und Helmut Simon beim Wandern in den Ötztaler Alpen (Südtirol) einen Toten im Eis."));
          const b2 = box(s, "ex later", "Wer war er?", P(s, "Er starb zwischen 3368 und 3108 v. Chr. – vor über 5.000 Jahren. Er war ca. 45 Jahre alt, ca. 1,60 m groß und wog ca. 50 kg."));
          const b3 = box(s, "ex later", "Was geschah?", P(s, "Ein Pfeil traf ihn in die linke Schulter. Kurz vorher hatte er gegessen: Steinbock-Fleisch und Einkorn."));
          const life = box(s, "life later", "Heute", P(s, "Ötzi liegt im Südtiroler Archäologiemuseum in Bozen – in einer Kühlzelle bei −6,5 °C."));
          const site = s.photo("oetzi-fundstelle", { w: 520, h: 300, pos: "50% 60%", caption: "Denkmal nahe der Fundstelle am Tisenjoch", cls: "later" });
          svg.style.height = "300px"; svg.style.width = "332px";
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", height: "100%", alignItems: "center", gap: "24px" } }, s.h("div", { class: "stack", style: { gap: "12px", alignItems: "center" } }, svg, site), s.h("div", { class: "stack", style: { gap: "11px" } }, b1, b2, b3, life)));
          s.show(svg, "fade"); s.sound("wind", { vol: .4, dur: 4 });
          s.step(async () => { s.sfx.pop(); s.show(hikers, "left"); s.show(b1, "left"); await s.wait(400); s.sfx.zap(); await s.show(iceman, "zoom"); await s.show(alt, "pop"); });
          s.step(async () => { s.sfx.whoosh(); s.show(tl0, "down"); s.show(site, "zoom"); await s.show(b2, "left"); s.say("Ötzi lebte vor über 5.000 Jahren."); });
          s.step(async () => { s.sfx.drum(); await s.show(b3, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Ötzis Ausrüstung",
        say: "Tippe auf die Knöpfe und entdecke, was Ötzi bei sich trug.",
        build(s) {
          const svg = s.svg(460, 540);
          svg.append(s.el("rect", { x: 0, y: 0, width: 460, height: 540, rx: 18, fill: "#f6efe6" }), tx(s, 230, 56, "Ötzi – vereinfacht gezeichnet", { fs: 22, fw: 800, fill: C }), tx(s, 230, 86, "Er war ca. 1,60 m groß.", { fs: 20, fill: PEN }));
          const fx = 220, foot = 505;
          // Rückentrage hinter dem Körper
          const trage = g(s, {}, s.el("path", { d: `M${fx - 62} 420 L${fx - 62} 228 Q${fx} 190 ${fx + 62} 228 L${fx + 62} 420`, stroke: "#9a7a4a", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }), s.el("path", { d: `M${fx - 62} 300 L${fx + 62} 300 M${fx - 62} 380 L${fx + 62} 380`, stroke: "#9a7a4a", "stroke-width": 5 }));
          const koecher = g(s, {}, s.el("rect", { x: fx + 40, y: 180, width: 26, height: 170, rx: 8, fill: "#7a4a2a", transform: `rotate(18 ${fx + 53} 265)` }), ...[0, 8, 16].map(d => s.el("line", { x1: fx + 72 + d, y1: 160 + d / 2, x2: fx + 66 + d, y2: 196, stroke: "#c9a64a", "stroke-width": 3, transform: `rotate(18 ${fx + 53} 265)` })));
          // Körper
          const body = g(s, {},
            s.el("rect", { x: fx - 22, y: 400, width: 18, height: 92, rx: 7, fill: "#8a6a4a" }), s.el("rect", { x: fx + 4, y: 400, width: 18, height: 92, rx: 7, fill: "#8a6a4a" }),
            s.el("path", { d: `M${fx - 50} 238 Q${fx} 222 ${fx + 50} 238 L${fx + 58} 420 L${fx - 58} 420 Z`, fill: "#a07a50" }),
            ...[0, 1, 2, 3, 4, 5].map(i => s.el("line", { x1: fx - 40 + i * 16, y1: 240, x2: fx - 46 + i * 18, y2: 418, stroke: "#e8dcc8", "stroke-width": 4, opacity: .6 })),
            s.el("line", { x1: fx - 48, y1: 250, x2: fx - 80, y2: 360, stroke: "#c08a6a", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("line", { x1: fx + 48, y1: 250, x2: fx + 82, y2: 350, stroke: "#c08a6a", "stroke-width": 14, "stroke-linecap": "round" }),
            s.el("circle", { cx: fx, cy: 200, r: 30, fill: "#c08a6a" }), s.el("path", { d: `M${fx - 16} 216 Q${fx} 228 ${fx + 16} 216`, stroke: "#5a3a2a", "stroke-width": 7, fill: "none" }),
            s.el("rect", { x: fx - 58, y: 392, width: 116, height: 12, fill: "#5a3a20" }));
          const muetze = g(s, {}, s.el("path", { d: `M${fx - 32} 194 Q${fx - 30} 150 ${fx} 148 Q${fx + 30} 150 ${fx + 32} 194 Z`, fill: "#5a3a20" }), s.el("path", { d: `M${fx - 20} 160 l-4 -8 M${fx + 6} 152 l2 -9 M${fx + 22} 162 l6 -7`, stroke: "#3b2412", "stroke-width": 3 }));
          const schuhe = g(s, {}, s.el("ellipse", { cx: fx - 16, cy: foot - 6, rx: 22, ry: 12, fill: "#4a3020" }), s.el("ellipse", { cx: fx + 16, cy: foot - 6, rx: 22, ry: 12, fill: "#4a3020" }));
          const beil = g(s, {}, s.el("line", { x1: fx - 80, y1: 360, x2: fx - 92, y2: 290, stroke: "#9a6a3a", "stroke-width": 7, "stroke-linecap": "round" }), s.el("path", { d: `M${fx - 94} 292 l-20 -6 l2 22 z`, fill: "#c8742a", stroke: "#8a4a1a", "stroke-width": 2 }));
          const bogen = g(s, {}, s.el("path", { d: `M${fx + 150} 168 Q${fx + 170} 340 ${fx + 150} 505`, stroke: "#8a5a2a", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }));
          const dolch = g(s, {}, s.el("rect", { x: fx + 26, y: 392, width: 9, height: 22, fill: "#9a7a4a" }), s.el("path", { d: `M${fx + 26} 414 l4.5 26 l4.5 -26 z`, fill: "#8d93a3" }));
          const tasche = g(s, {}, s.el("rect", { x: fx - 34, y: 404, width: 30, height: 24, rx: 6, fill: "#6b4a2a" }));
          const dose = g(s, {}, s.el("rect", { x: 40, y: 446, width: 54, height: 56, rx: 8, fill: "#f2ecdc", stroke: "#3b3028", "stroke-width": 2 }), ...[460, 474, 488].map(y => s.el("line", { x1: 44, y1: y, x2: 90, y2: y, stroke: "#3b3028", "stroke-width": 2 })), s.el("ellipse", { cx: 67, cy: 446, rx: 27, ry: 6, fill: "#e0742a" }));
          svg.append(trage, koecher, body, muetze, schuhe, beil, bogen, dolch, tasche, dose);
          const ring = s.el("circle", { r: 40, fill: "none", stroke: C, "stroke-width": 5, "stroke-dasharray": "10 6", class: "later" });
          svg.append(ring);
          const items = [
            ["Beil", fx - 100, 300, 44, "Kupferbeil", "Klinge zu 99,7 % aus Kupfer, Griff aus Eibenholz, ca. 60 cm lang. Das Foto zeigt einen Nachbau."],
            ["Bogen", fx + 162, 340, 56, "Bogen", "Aus Eibenholz, ca. 1,80 m lang – länger, als Ötzi groß war. Er war noch nicht fertig geschnitzt."],
            ["Köcher", fx + 58, 250, 50, "Köcher mit Pfeilen", "Im Köcher steckten 14 Pfeile – aber nur 2 waren fertig, mit Feuersteinspitze und Federn."],
            ["Dolch", fx + 31, 418, 30, "Dolch", "Eine Klinge aus Feuerstein mit einem Griff aus Eschenholz."],
            ["Trage", fx - 62, 300, 34, "Rückentrage", "Ein Gestell aus Haselholz – so etwas wie ein Rucksack."],
            ["Glut-Dose", 67, 474, 44, "Gefäße aus Birkenrinde", "In einem Gefäß trug er Glut, eingewickelt in Ahornblätter. So hatte er schnell wieder Feuer."],
            ["Feuerzeug", fx - 19, 416, 28, "Feuerzeug & Pilze", "Zunderschwamm und Pyrit zum Feuermachen. Dazu ein Birkenporling – wohl als Heilmittel."],
            ["Mütze", fx, 168, 40, "Mütze", "Aus dem Fell eines Braunbären – schön warm im Hochgebirge."],
            ["Schuhe", fx, foot - 8, 44, "Schuhe", "Oben Rindsleder, die Sohle aus Bärenfell, innen ein Netz aus Grasschnüren."],
          ];
          const iT = s.h("p", { class: "h2", style: { color: C } }, "Tippe auf einen Knopf!"), iB = s.h("p", { class: "small" }, "Ötzi hatte alles dabei, was man für ein paar Tage in den Bergen braucht.");
          const axePh = s.photo("oetzi-beil", { w: 110, h: 160, fit: "contain", style: { display: "none" } });
          const info = s.h("div", { class: "card", style: { height: "190px", display: "flex", gap: "14px", alignItems: "center" } }, axePh, s.h("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, iT, iB));
          const btns = items.map((it, i) => s.h("button", { class: "btn", style: { width: "100%", padding: "0 8px" }, onclick: () => { s.sfx.pop(); pick(i); } }, it[0]));
          function pick(i) {
            const it = items[i];
            ring.setAttribute("cx", it[1]); ring.setAttribute("cy", it[2]); ring.setAttribute("r", it[3]);
            axePh.style.display = i === 0 ? "" : "none";
            s.show(ring, "pop"); iT.textContent = it[4]; iB.textContent = it[5]; s.show(info, "fade");
            btns.forEach((b, j) => b.classList.toggle("solid", j === i));
          }
          const life = box(s, "life later", "Im Alltag", P(s, "Was packst du für eine Wanderung ein? Rucksack, Taschenmesser, Mütze, feste Schuhe – fast wie Ötzi!"));
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" } }, btns);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, svg, s.h("div", { class: "stack", style: { gap: "14px" } }, grid, info, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { pick(0); s.sfx.ding(); await s.wait(400); });
          s.step(async () => { pick(5); s.say("In einem Gefäß aus Birkenrinde trug Ötzi Glut mit sich."); await s.wait(400); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Felder in Brandenburg",
        say: "Auch heute gibt es Ackerbau und Viehhaltung. In Brandenburg wachsen vor allem Mais, Weizen, Roggen, Gerste und Raps.",
        build(s) {
          const svg = s.svg(600, 440);
          const data = [["Mais", 190.0, "#e0b33a", 155.5], ["Weizen", 164.7, "#d9a441"], ["Roggen", 130.6, "#a8743a"], ["Gerste", 102.3, "#c9b45a"], ["Raps", 92.4, "#e5d23a"]];
          svg.append(tx(s, 10, 30, "Anbaufläche in Brandenburg 2025", { a: "start", fs: 24, fw: 800 }), tx(s, 10, 58, "in Hektar (1 ha = 100 m × 100 m)", { a: "start", fs: 19, fill: PEN }));
          const k = 330 / 200;
          const bars = data.map(([n, v, col, sil], i) => {
            const y = 90 + i * 66;
            const bar = s.el("rect", { x: 110, y, width: 0, height: 44, rx: 8, fill: col });
            const silo = sil ? s.el("rect", { x: 110, y, width: 0, height: 44, rx: 8, fill: "#9ab84a", class: "later" }) : null;
            const val = tx(s, 120, y + 30, s.fmt(v * 1000) + " ha", { a: "start", fs: 20, fw: 800, cls: "later" });
            svg.append(tx(s, 100, y + 30, n, { a: "end", fs: 22, fw: 800 }), bar);
            if (silo) svg.append(silo);
            svg.append(val);
            return { bar, val, v, silo, sil, y };
          });
          const siloLbl = tx(s, 115, 90 + 30, "davon Silomais = Tierfutter", { a: "start", fs: 19, fw: 800, fill: "#fff", cls: "later" });
          svg.append(siloLbl);
          const legend = tx(s, 10, 425, "Quelle: Agrarbericht Brandenburg", { a: "start", fs: 19, fill: PEN });
          svg.append(legend);
          const b1 = box(s, "ex", "Ackerbau und Viehhaltung", P(s, "Ackerbau = Pflanzen anbauen (Getreide, Raps, Kartoffeln). Viehhaltung = Tiere halten (Kühe, Schweine, Hühner). Beides hängt zusammen: Mais und Getreide sind oft Tierfutter."));
          const b2 = box(s, "ex later", "Sand und wenig Regen", s.photo("roggenfeld", { w: "100%", h: 130, caption: "Roggenfeld" }), P(s, "Brandenburg hat oft sandige Böden und wenig Regen (2022: 434 mm, Deutschland: 669 mm). Roggen kommt damit gut klar."));
          const b3 = box(s, "life later", "Wusstest du?", P(s, "Deutschland erntet mehr Roggen als jedes andere Land der Welt: 2023 ein Viertel der Welternte."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", height: "100%", alignItems: "center", gap: "24px" } }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, b1, b2, b3)));
          s.step(async () => {
            s.sound("traktor", { vol: .5, dur: 3.5 });
            for (let i = 0; i < bars.length; i++) { const b = bars[i]; s.tween({ from: 0, to: b.v * k, dur: 700, ease: "out", update: w => b.bar.setAttribute("width", w) }).then(() => { b.val.setAttribute("x", 110 + b.v * k + 10); s.show(b.val, "fade"); }); await s.wait(200); }
            await s.wait(700); s.say("Mais wächst auf der größten Fläche. Ein großer Teil davon ist Futter für Rinder.");
          });
          s.step(async () => { const b = bars[0]; s.sfx.pop(); s.show(b.silo, "fade"); await s.tween({ from: 0, to: b.sil * k, dur: 600, update: w => b.silo.setAttribute("width", w) }); s.show(siloLbl, "fade"); s.show(b2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(b3, "up"); });
          if (s.fast) bars.forEach(b => b.val.setAttribute("x", 110 + b.v * k + 10));
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Spargel aus Beelitz",
        say: "In Beelitz bei Berlin wächst seit 1861 Spargel. Weißer Spargel wächst im Dunkeln unter einem Erdwall.",
        build(s) {
          const svg = s.svg(480, 470);
          svg.append(s.el("rect", { x: 0, y: 0, width: 480, height: 470, rx: 18, fill: "#e6f2fb" }),
            s.el("path", { d: "M0 300 Q120 160 240 160 Q360 160 480 300 L480 470 L0 470 Z", fill: "#e3c48c" }),
            s.el("path", { d: "M0 300 Q120 160 240 160 Q360 160 480 300", stroke: "#b8955a", "stroke-width": 4, fill: "none" }),
            ...Array.from({ length: 40 }, (_, i) => s.el("circle", { cx: 30 + (i * 53) % 430, cy: 230 + (i * 37) % 220, r: 2.5, fill: "#b8955a" })));
          svg.append(tl(s, 240, 230, ["Erdwall aus", "Sand – dunkel!"], { fs: 20, fw: 800, fill: "#8a6a3a" }));
          const spear = s.el("path", { d: "", fill: "#f7f3e6", stroke: "#cfc6a8", "stroke-width": 3 });
          svg.append(spear, s.el("ellipse", { cx: 330, cy: 430, rx: 70, ry: 16, fill: "#c9a46a" }), tx(s, 410, 452, "Wurzel", { fs: 19, fw: 700, fill: "#6b4a22" }));
          let top = 420;
          const drawSpear = (t, lift = 0) => spear.setAttribute("d", `M318 ${425 - lift} L318 ${t + 18 - lift} Q330 ${t - 6 - lift} 342 ${t + 18 - lift} L342 ${425 - lift} Z`);
          drawSpear(top);
          const knife = g(s, { class: "later" }, s.el("line", { x1: 400, y1: 140, x2: 350, y2: 360, stroke: "#9a6a3a", "stroke-width": 8, "stroke-linecap": "round" }), s.el("path", { d: "M350 360 l-8 40 l14 -36 z", fill: "#8d93a3" }));
          const lbl = tx(s, 240, 60, "Der Spargel wächst …", { fs: 24, fw: 800, fill: C });
          svg.append(knife, lbl);
          const grow = async () => { s.sfx.boing(); await s.tween({ from: 420, to: 190, dur: 1500, ease: "out", update: v => { top = v; drawSpear(v); } }); lbl.textContent = "Spitze erreicht die Oberfläche"; };
          const cut = async () => { s.show(knife, "down"); s.sound("kelle-graben", { rate: 1.2 }); await s.wait(500); s.sfx.snap(); lbl.textContent = "Gestochen! Ganz weiß."; await s.tween({ from: 0, to: 60, dur: 700, ease: "back", update: v => drawSpear(top, v) }); };
          const b1 = box(s, "ex later", "Beelitz", s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center" } }, s.photo("beelitz-spargelfeld", { w: 170, h: 120 }), P(s, "Seit 1861 wird in Beelitz Spargel angebaut – ca. 40 km südwestlich von Berlin, auf sandigem Boden. Auf dem Foto: die Erdwälle.")));
          const b2 = box(s, "ex later", "Warum weiß?", P(s, "Der Spargel wächst in einem Erdwall, also im Dunkeln. Ohne Licht bleibt er weiß. Man sticht ihn, bevor die Spitze ans Licht kommt."));
          const b3 = box(s, "ex later", "Saison", P(s, "Gestochen wird ab dem Frühling bis zum 24. Juni (Johannistag). Bauernregel: „Kirschen rot, Spargel tot.“"));
          const life = box(s, "life later", "Im Alltag", s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 1fr", gap: "12px", alignItems: "center" } }, s.photo("spargelstand", { w: 170, h: 110 }), P(s, "Im Frühling stehen in Berlin überall Spargelstände. Und in Beelitz gibt es am ersten Juniwochenende ein Spargelfest.")));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "480px 1fr", height: "100%", alignItems: "center", gap: "24px" } }, svg, s.h("div", { class: "stack", style: { gap: "11px" } }, b1, b2, b3, life)));
          s.show(svg, "fade"); s.sfx.pop(); s.show(b1, "left");
          s.step(async () => { await grow(); s.show(b2, "left"); s.say("Der Spargel wächst im dunklen Erdwall nach oben."); });
          s.step(async () => { await cut(); s.show(b3, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
          if (s.fast) { top = 190; }
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Vom Feld zur Schrippe",
        say: "Bis ein Brötchen auf deinem Frühstückstisch liegt, arbeiten viele Menschen zusammen: Bauern, Müller, Bäcker und Verkäufer.",
        build(s) {
          const svg = s.svg(1100, 300);
          svg.append(s.el("path", { d: "M60 230 L1040 230", stroke: "#c8d3de", "stroke-width": 14, "stroke-linecap": "round" }), s.el("path", { d: "M60 230 L1040 230", stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "14 12" }));
          const X = [110, 330, 550, 770, 990];
          const st = [];
          // 1 Feld
          st.push(g(s, {}, s.el("rect", { x: 40, y: 140, width: 140, height: 60, rx: 10, fill: "#e8c86a" }), ...Array.from({ length: 6 }, (_, i) => s.el("path", { d: `M${55 + i * 22} 190 l0 -60 m-6 10 l6 -12 l6 12 m-12 6 l6 -12 l6 12`, stroke: "#b8902a", "stroke-width": 3, fill: "none" })), tl(s, 110, 268, ["1 · Feld:", "Weizen wächst"], { fs: 20, bold: true })));
          // 2 Mähdrescher
          st.push(g(s, { class: "later" }, s.el("rect", { x: 270, y: 120, width: 110, height: 70, rx: 10, fill: "#3f8a3a" }), s.el("rect", { x: 350, y: 96, width: 40, height: 36, rx: 6, fill: "#cfe6f7", stroke: "#3f8a3a", "stroke-width": 4 }), s.el("rect", { x: 250, y: 170, width: 30, height: 30, fill: "#7a8a6a" }), s.el("circle", { cx: 300, cy: 200, r: 18, fill: "#2a2a2a" }), s.el("circle", { cx: 360, cy: 202, r: 14, fill: "#2a2a2a" }), tl(s, 330, 268, ["2 · Ernte:", "Mähdrescher"], { fs: 20, bold: true })));
          // 3 Mühle
          const blades = g(s, {}, ...[0, 90, 180, 270].map(a => s.el("rect", { x: -6, y: -70, width: 12, height: 64, fill: "#e8e0d0", stroke: "#8a7a5a", "stroke-width": 2, transform: `rotate(${a})` })));
          blades.setAttribute("transform", "translate(550 100)");
          st.push(g(s, { class: "later" }, s.el("path", { d: "M520 205 L530 110 L570 110 L580 205 Z", fill: "#c9b48a", stroke: "#8a7a5a", "stroke-width": 3 }), blades, s.el("circle", { cx: 550, cy: 100, r: 8, fill: "#5a4a3a" }), tl(s, 550, 268, ["3 · Mühle:", "Körner → Mehl"], { fs: 20, bold: true })));
          // 4 Bäckerei
          st.push(g(s, { class: "later" }, s.el("rect", { x: 700, y: 120, width: 140, height: 85, rx: 8, fill: "#f2e0c8", stroke: "#a0743f", "stroke-width": 3 }), s.el("path", { d: "M720 205 L720 160 Q770 120 820 160 L820 205 Z", fill: "#5a3a2a" }), s.el("ellipse", { cx: 770, cy: 182, rx: 34, ry: 10, fill: "#f59a23" }), s.el("path", { d: "M690 124 L770 92 L850 124 Z", fill: "#c2410c" }), tl(s, 770, 268, ["4 · Bäckerei:", "Teig wird gebacken"], { fs: 20, bold: true })));
          // 5 Frühstück
          st.push(g(s, { class: "later" }, s.el("ellipse", { cx: 990, cy: 186, rx: 70, ry: 20, fill: "#fff", stroke: "#c8d3de", "stroke-width": 3 }), s.el("path", { d: "M950 182 Q955 140 990 138 Q1025 140 1030 182 Z", fill: "#d9963a", stroke: "#a0601a", "stroke-width": 3 }), s.el("path", { d: "M990 142 L990 178", stroke: "#a0601a", "stroke-width": 3 }), tl(s, 990, 268, ["5 · Laden &", "Frühstück"], { fs: 20, bold: true })));
          st.forEach(x => svg.append(x));
          const truck = g(s, {}, s.el("rect", { x: -26, y: -24, width: 40, height: 26, rx: 4, fill: C }), s.el("rect", { x: 14, y: -16, width: 16, height: 18, rx: 3, fill: "#f2a07a" }), s.el("circle", { cx: -14, cy: 4, r: 6, fill: "#222" }), s.el("circle", { cx: 18, cy: 4, r: 6, fill: "#222" }));
          truck.setAttribute("transform", `translate(${X[0]} 238)`);
          svg.append(truck);
          let tx0 = X[0];
          const drive = async i => { s.sfx.whoosh(); const a = tx0; await s.tween({ from: a, to: X[i], dur: 900, update: v => { tx0 = v; truck.setAttribute("transform", `translate(${v} 238)`); } }); s.sfx.pop(); };
          const b1 = box(s, "ex later", "Zutaten", P(s, "Für Brötchen braucht man vor allem Mehl, Wasser, Hefe und Salz."));
          const b2 = box(s, "life later", "Berlinerisch", P(s, "In Berlin heißt das Brötchen „Schrippe“. In Bayern sagt man „Semmel“."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Viele Menschen arbeiten zusammen: ", s.h("b", null, "Arbeitsteilung"), " – wie in der Jungsteinzeit, nur viel größer.");
          const pM = s.photo("maehdrescher", { w: 220, h: 150, caption: "Mähdrescher", cls: "later" }), pS = s.photo("schrippen", { w: 220, h: 150, caption: "Schrippen", cls: "later" });
          svg.style.height = "260px"; svg.style.width = "953px";
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px", alignItems: "center" } }, svg,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "220px 1fr 220px 1fr", gap: "16px", alignItems: "center", width: "100%" } }, pM, b1, pS, b2), merk));
          s.sfx.pop();
          s.step(async () => { await drive(1); s.sound("traktor", { vol: .5, dur: 3 }); s.show(pM, "zoom"); await s.show(st[1], "pop"); });
          s.step(async () => { await drive(2); s.show(st[2], "pop"); s.loop(t => blades.setAttribute("transform", `translate(550 100) rotate(${t * 60})`)); s.say("In der Mühle werden die Körner zu Mehl gemahlen."); });
          s.step(async () => { await drive(3); await s.show(st[3], "pop"); s.show(b1, "up"); });
          s.step(async () => { await drive(4); await s.show(st[4], "bounce"); s.sfx.success(); s.show(pS, "zoom"); s.show(b2, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Die Banane reist um die Welt",
        say: "Bananen wachsen nicht in Deutschland. Sie kommen zum Beispiel aus Ecuador und reisen grün auf einem Kühlschiff zu uns.",
        build(s) {
          const W = 620, H = 350;
          const p = (lon, lat) => [(lon + 95) * 5.39, (60 - lat) * 5.0];
          const poly = a => a.map(q => p(...q).map(v => v.toFixed(1)).join(",")).join(" ");
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 18, fill: "#cfe4f3" }));
          const land = { fill: "#e9dcb8", stroke: "#c9b48a", "stroke-width": 2 };
          [
            [[-95, 60], [-95, 18], [-90, 16], [-84, 10], [-80, 8], [-77, 8], [-75, 11], [-80, 20], [-81, 25], [-80, 31], [-76, 35], [-70, 42], [-66, 45], [-60, 47], [-55, 52], [-60, 56], [-64, 60]],
            [[-80, 8], [-77, 8], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-40, -3], [-35, -8], [-35, -12], [-80, -12], [-81, -5], [-80, -2], [-79, 1]],
            [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [0, 50], [5, 53], [8, 57], [5, 60], [20, 60], [20, 36], [10, 37], [0, 36]],
            [[-17, 15], [-16, 24], [-10, 30], [-5, 36], [10, 37], [20, 32], [20, -12], [9, -12], [9, 0], [-8, 5]],
          ].forEach(a => svg.append(s.el("polygon", Object.assign({ points: poly(a) }, land))));
          const route = s.el("path", { d: "M" + [[-80.5, -2.4], [-82, 3], [-79.6, 9.2], [-76, 14], [-66, 19], [-50, 30], [-30, 40], [-10, 46], [0, 50], [5, 53]].map(q => p(...q).map(v => v.toFixed(1)).join(" ")).join(" L"), stroke: C, "stroke-width": 5, fill: "none", "stroke-dasharray": "3 10", "stroke-linecap": "round", class: "later" });
          const [ex, ey] = p(-79.9, -2.2), [bx, by] = p(13.4, 52.5);
          svg.append(route, s.el("circle", { cx: ex, cy: ey, r: 9, fill: "#3f8a3a", stroke: "#fff", "stroke-width": 3 }), tx(s, ex + 16, ey + 2, "Ecuador", { a: "start", fs: 21, fw: 800, fill: "#2a6a2a" }),
            s.el("circle", { cx: bx - 40, cy: by, r: 9, fill: INK, stroke: "#fff", "stroke-width": 3 }), tx(s, bx - 40, by + 34, "Deutschland", { fs: 21, fw: 800 }), tx(s, 370, 300, "Atlantik", { fs: 22, fw: 700, fill: "#3a6f9a" }));
          const ship = g(s, { class: "later" }, s.el("path", { d: "M-22 0 L22 0 L16 10 L-16 10 Z", fill: "#fff", stroke: INK, "stroke-width": 2 }), s.el("rect", { x: -12, y: -12, width: 20, height: 12, fill: "#e5d23a", stroke: INK, "stroke-width": 2 }));
          svg.append(ship);
          const steps = [
            ["1 · Ernte", "Grün geerntet, z. B. in Ecuador – dem größten Bananen-Exporteur (2023: 4,0 Mio. t)."],
            ["2 · Kühlschiff", "Bei etwa 13 °C. Unter 13,2 °C hört die Banane auf zu reifen – so bleibt sie unterwegs grün."],
            ["3 · Reifekammer", "In Europa reift sie 4 bis 8 Tage mit dem Reifegas Ethylen – dann ist sie gelb."],
          ].map(([a, b], i) => i ? box(s, "ex later", a, P(s, b)) : box(s, "ex later", a, s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "10px", alignItems: "center" } }, s.photo("bananenplantage", { w: 150, h: 112 }), P(s, b))));
          const bars = s.svg(1100, 120);
          const bLen = 1040;
          const r1 = s.el("rect", { x: 30, y: 30, width: 0, height: 24, rx: 6, fill: "#3f8a3a" }), r2 = s.el("rect", { x: 30, y: 84, width: 0, height: 24, rx: 6, fill: C });
          bars.append(tx(s, 30, 20, "Spargel aus Beelitz → Berlin: ca. 40 km", { a: "start", fs: 20, fw: 800, fill: "#2a6a2a" }), r1, tx(s, 30, 76, "Banane aus Ecuador → Berlin: ca. 10.400 km Luftlinie – über 250-mal so weit!", { a: "start", fs: 20, fw: 800, fill: C }), r2);
          bars.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "10px" } },
            s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", gap: "20px", alignItems: "center" } }, svg, s.h("div", { class: "stack", style: { gap: "10px" } }, steps)), bars));
          s.show(svg, "fade"); s.sfx.whoosh(); s.show(steps[0], "left");
          s.step(async () => {
            s.show(route, "draw"); s.show(steps[1], "left"); s.show(ship, "pop"); s.sound("schiffshorn", { vol: .5 });
            let L = 600; try { L = route.getTotalLength(); } catch (e) {}
            await s.tween({ from: 0, to: 1, dur: 2200, ease: "inOut", update: v => { try { const q = route.getPointAtLength(L * v); ship.setAttribute("transform", `translate(${q.x} ${q.y - 6})`); } catch (e) {} } });
            s.sfx.ding();
          });
          s.step(async () => { s.sfx.pop(); await s.show(steps[2], "left"); s.say("In der Reifekammer wird die Banane gelb."); });
          s.step(async () => { s.show(bars, "up"); s.sfx.pop(); await s.tween({ from: 0, to: bLen * 40 / 10400, dur: 300, update: v => r1.setAttribute("width", Math.max(4, v)) }); s.sfx.whoosh(); await s.tween({ from: 0, to: bLen, dur: 1600, ease: "out", update: v => r2.setAttribute("width", v) }); s.say("Regional heißt: kurze Wege. Die Banane reist über 10.000 Kilometer."); });
          if (s.fast) { try { const q = route.getPointAtLength(route.getTotalLength()); ship.setAttribute("transform", `translate(${q.x} ${q.y - 6})`); } catch (e) {} }
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Was wächst wann?",
        say: "Schieb den Regler durch das Jahr. Du siehst, welches Obst und Gemüse gerade bei uns geerntet wird.",
        build(s) {
          const M = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
          const MF = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
          const rows = [
            ["Spargel", [4, 5, 6], "#a8b86a", "bis 24. Juni"],
            ["Erdbeeren", [5, 6, 7], "#dc3b2a"],
            ["Kirschen", [6, 7], "#9a1a3a"],
            ["Äpfel", [7, 8, 9, 10], "#5f9e45", "frisch vom Baum"],
            ["Grünkohl", [11, 12, 1, 2], "#2f6a3a"],
            ["Bananen", [], "#e5d23a", "wachsen nicht bei uns – immer importiert"],
          ];
          const svg = s.svg(1100, 330);
          const x0 = 170, cw = 75, y0 = 46, rh = 44;
          M.forEach((m, i) => svg.append(tx(s, x0 + i * cw + cw / 2, 30, m, { fs: 19, fw: 800, fill: PEN })));
          const hl = s.el("rect", { x: x0, y: 8, width: cw, height: y0 + rows.length * rh, rx: 10, fill: C, opacity: .14 });
          svg.append(hl);
          const rowG = rows.map(([n, ms, col, note], r) => {
            const y = y0 + r * rh;
            const gg = g(s, { class: r ? "later" : "" });
            gg.append(s.el("line", { x1: 0, y1: y + rh, x2: 1100, y2: y + rh, stroke: "#e4e9ef", "stroke-width": 2 }), tx(s, 10, y + 29, n, { a: "start", fs: 22, fw: 800 }));
            ms.forEach(m => gg.append(s.el("rect", { x: x0 + (m - 1) * cw + 3, y: y + 8, width: cw - 6, height: rh - 16, rx: 8, fill: col })));
            if (note) { const nx = ms.length ? x0 + (Math.max(...ms.filter(m => m > 3)) ) * cw + 10 : x0 + 10; gg.append(tx(s, nx, y + 29, note, { a: "start", fs: 19, fw: 700, fill: PEN })); }
            svg.append(gg); return gg;
          });
          const out = s.h("p", { class: "t", style: { minHeight: "68px" } });
          const update = m => {
            hl.setAttribute("x", x0 + (m - 1) * cw);
            const now = rows.filter(r => r[1].includes(m)).map(r => r[0]);
            out.innerHTML = "";
            out.append(s.h("b", { style: { color: C } }, MF[m - 1] + ": "), now.length ? now.join(", ") + " – frisch aus Deutschland." : "kaum frische Ernte – jetzt gibt es viel aus dem Lager.");
          };
          const sl = s.slider({ label: "Monat", min: 1, max: 12, value: 10, fmt: v => MF[v - 1], onInput: v => { update(v); s.sfx.pop(); } });
          update(10);
          const life = box(s, "life later", "Im Alltag", P(s, "Saisonal heißt: Es ist gerade bei uns reif. Äpfel aus dem Lager gibt es das ganze Jahr. Erdbeeren im Dezember kommen von weit her oder aus dem Gewächshaus."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "12px" } }, svg, s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, sl, out), life)));
          s.sfx.pop();
          s.step(async () => { for (let i = 1; i < rowG.length; i++) { s.sfx.count(i); s.show(rowG[i], "left"); await s.wait(150); } });
          s.step(async () => { for (const m of [4, 5, 6, 7, 10]) { sl.set(m); s.sfx.tick(); await s.wait(350); } s.say("Im Oktober gibt es frische Äpfel."); });
          s.step(async () => { s.sfx.ding(); await s.show(life, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Bio oder konventionell?",
        say: "Bio und konventionell sind zwei Arten, Landwirtschaft zu betreiben. Für Bio gelten zusätzliche Regeln.",
        build(s) {
          const leaf = s.svg(80, 80);
          leaf.append(s.el("rect", { x: 4, y: 4, width: 72, height: 72, rx: 14, fill: "#e6f6ee", stroke: "#138a5a", "stroke-width": 3 }), s.el("path", { d: "M20 58 Q22 22 58 20 Q56 56 20 58 Z", fill: "#5fae55" }), s.el("path", { d: "M22 56 L50 28", stroke: "#e6f6ee", "stroke-width": 3 }));
          const tractor = s.svg(80, 80);
          tractor.append(s.el("rect", { x: 4, y: 4, width: 72, height: 72, rx: 14, fill: "#fdf0e6", stroke: C, "stroke-width": 3 }), s.el("rect", { x: 18, y: 30, width: 34, height: 18, rx: 3, fill: C }), s.el("rect", { x: 40, y: 18, width: 14, height: 14, fill: "#f2a07a" }), s.el("circle", { cx: 26, cy: 54, r: 10, fill: "#333" }), s.el("circle", { cx: 54, cy: 56, r: 7, fill: "#333" }));
          const card = (icon, title, items, cls) => s.h("div", { class: "card " + cls, style: { display: "flex", flexDirection: "column", gap: "8px" } }, s.h("div", { class: "row" }, icon, s.h("p", { class: "h2" }, title)), ...items.map(t => s.h("p", { class: "small" }, "• ", t)));
          const bio = card(leaf, "Bio (ökologisch)", ["keine chemisch-synthetischen Pflanzenschutzmittel", "Tiere: mehr Platz und Bio-Futter", "keine Gentechnik", "Bio-Siegel: in Deutschland seit 2001, EU-Bio-Logo seit 2010"], "");
          const kon = card(tractor, "Konventionell", ["darf chemische Pflanzenschutzmittel und Mineraldünger nutzen – aber nur zugelassene Mittel", "in Brandenburg: über 80 % der Agrarfläche (2024)"], "later");
          const pie = s.svg(240, 240);
          const R = 100, cx = 120, cy = 120;
          pie.append(s.el("circle", { cx, cy, r: R, fill: "#f2d6c2" }));
          const slice = s.el("path", { fill: "#5fae55" });
          pie.append(slice, tx(s, cx, cy + 8, "17,7 %", { fs: 30, fw: 800 }));
          const setSlice = f => { const a = -Math.PI / 2 + f * 2 * Math.PI; slice.setAttribute("d", f <= 0 ? "" : `M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 ${f > .5 ? 1 : 0} 1 ${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)} Z`); };
          setSlice(0);
          const pieBox = s.h("div", { class: "card later", style: { display: "flex", alignItems: "center", gap: "18px" } }, pie, s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "h2", style: { color: "#138a5a" } }, "Brandenburg 2024"), P(s, "17,7 % der Agrarfläche werden ökologisch (Bio) bewirtschaftet – der Rest konventionell.")));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Beides ist erlaubt und hat Vor- und Nachteile. Wichtig: Siegel lesen, nachfragen, selbst entscheiden.");
          const life = box(s, "life later", "Im Supermarkt", P(s, "Bio-Äpfel und andere Äpfel liegen oft nebeneinander. Achte auf das Bio-Siegel und das Herkunftsland!"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } },
            s.h("div", { class: "cols", style: { gap: "20px" } }, bio, kon),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1.25fr 1fr", gap: "20px", alignItems: "stretch" } }, pieBox, s.h("div", { class: "stack", style: { gap: "12px" } }, merk, life))));
          s.show(bio, "left"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(kon, "right"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(pieBox, "up"); await s.tween({ from: 0, to: .177, dur: 1000, ease: "out", update: setSlice }); s.sfx.ding(); s.say("In Brandenburg wird fast ein Fünftel der Fläche ökologisch bewirtschaftet."); });
          s.step(async () => { s.sfx.ding(); s.show(merk, "up"); await s.show(life, "up", 200); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Zu schade für die Tonne",
        say: "In Deutschland landen jedes Jahr fast elf Millionen Tonnen Lebensmittel im Müll. Mehr als die Hälfte davon in Privathaushalten.",
        build(s) {
          const svg = s.svg(400, 470);
          const bin = g(s, {}, s.el("path", { d: "M80 120 L320 120 L296 440 L104 440 Z", fill: "#e9eef3", stroke: "#5d6678", "stroke-width": 5, "stroke-linejoin": "round" }), s.el("rect", { x: 66, y: 96, width: 268, height: 26, rx: 8, fill: "#5d6678" }), s.el("rect", { x: 170, y: 80, width: 60, height: 18, rx: 6, fill: "#5d6678" }));
          const clip = s.el("clipPath", { id: "u4binclip" }, s.el("path", { d: "M84 124 L316 124 L293 436 L107 436 Z" }));
          const fillAll = s.el("rect", { x: 80, y: 440, width: 240, height: 0, fill: "#9ab84a", "clip-path": "url(#u4binclip)" });
          const fillHH = s.el("rect", { x: 80, y: 440, width: 240, height: 0, fill: C, "clip-path": "url(#u4binclip)" });
          const lAll = tx(s, 200, 60, "10,8 Mio. Tonnen pro Jahr", { fs: 24, fw: 800, cls: "later" });
          const lHH = tl(s, 200, 360, ["58 %", "aus Haushalten"], { fs: 24, fw: 800, fill: "#fff", cls: "later" });
          svg.append(s.el("defs", {}, clip), bin, fillAll, fillHH, lAll, lHH);
          const right = s.h("div", { class: "stack", style: { gap: "12px" } });
          const kg = s.h("p", { class: "huge", style: { color: C } }, "0 kg");
          const kgBox = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "4px" } }, P(s, "So viel wirft jede Person im Haushalt pro Jahr weg:", "t"), kg, P(s, "So schwer wie 300 Päckchen Butter (je 250 g)!"));
          const butter = s.svg(560, 64); const bG = g(s, {}); butter.append(bG);
          for (let i = 0; i < 300; i++) bG.append(s.el("rect", { x: (i % 50) * 11, y: Math.floor(i / 50) * 10 + 2, width: 9, height: 7, rx: 1.5, fill: "#f2d45a", opacity: 0 }));
          kgBox.append(butter);
          const tips = box(s, "life later", "Im Alltag: so geht's besser", P(s, "• Einkaufszettel schreiben und nur kaufen, was du brauchst"), P(s, "• Mindesthaltbarkeitsdatum ist kein Wegwerf-Datum: anschauen, riechen, probieren"), P(s, "• Reste am nächsten Tag essen"));
          right.append(s.h("p", { class: "t" }, "Daten von 2022 für ganz Deutschland:"), kgBox, tips);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "400px 1fr", height: "100%", alignItems: "center", gap: "26px" } }, svg, right));
          s.show(svg, "up"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 312, dur: 1200, ease: "out", update: v => { fillAll.setAttribute("y", 440 - v); fillAll.setAttribute("height", v); } }); s.sound("paper-crumple", { vol: .7 }); await s.show(lAll, "pop"); });
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 312 * .58, dur: 900, update: v => { fillHH.setAttribute("y", 440 - v); fillHH.setAttribute("height", v); } }); await s.show(lHH, "pop"); s.say("58 Prozent davon kommen aus privaten Haushalten."); });
          s.step(async () => {
            s.show(kgBox, "left");
            const rects = [...bG.children];
            await s.tween({ from: 0, to: 75, dur: 1600, ease: "out", update: v => { kg.textContent = Math.round(v) + " kg"; const n = Math.round(v * 4); rects.forEach((r, i) => r.setAttribute("opacity", i < n ? 1 : 0)); } });
            kg.textContent = "ca. 75 kg"; s.sfx.success();
          });
          s.step(async () => { s.sfx.ding(); await s.show(tips, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Essen im Alltag",
        say: "Wochenmarkt, Erntedank, Etiketten im Supermarkt und dein Schulessen: Überall begegnet dir der Weg vom Feld auf den Teller.",
        build(s) {
          const items = [
            [() => s.photo("wochenmarkt", { w: 190, h: 190 }), "Wochenmarkt", "Auf dem Wochenmarkt verkaufen oft Bauern aus der Region direkt: Obst, Gemüse, Eier, Käse. Frag doch mal, woher etwas kommt!"],
            [() => s.photo("erntekrone", { w: 190, h: 190 }), "Erntedank", "Erntedank ist am ersten Sonntag im Oktober – 2026 fällt er auf den 4. Oktober. In Kirchen steht dann oft eine Erntekrone aus Getreide."],
            [() => s.h("div", { style: { width: "190px", height: "120px", fontSize: "80px", display: "flex", alignItems: "center", justifyContent: "center" } }, "🏷️"), "Etiketten lesen", "Auf Packungen und Schildern stehen Herkunftsland, Bio-Siegel, Zutaten und Mindesthaltbarkeitsdatum. Wer liest, weiß mehr!"],
            [() => s.h("div", { style: { width: "190px", height: "120px", fontSize: "80px", display: "flex", alignItems: "center", justifyContent: "center" } }, "🍽️"), "Schulessen", "Woher kommen die Kartoffeln, das Brot und die Äpfel in deiner Mensa? Regional oder von weit her? Frag nach!"],
          ];
          const cards = items.map(([e, t, b]) => s.h("div", { class: "life later", style: { display: "grid", gridTemplateColumns: "190px 1fr", gap: "14px", alignItems: "center" } },
            e(), s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "h2", style: { fontSize: "26px" } }, t), P(s, b))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", height: "100%", alignContent: "center" } }, cards));
          s.show(cards[0], "pop"); s.sound("traffic", { vol: .35, dur: 3 });
          s.step(async () => { s.sound("church-bells", { vol: .4, dur: 4 }); await s.show(cards[1], "pop"); s.say("Erntedank feiern wir am ersten Sonntag im Oktober."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "pop"); });
          s.step(async () => { s.sfx.success(); await s.show(cards[3], "pop"); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
