/* Kapitel 10 – Mal und geteilt mit Brüchen und Dezimalzahlen (Ausblick auf Klasse 6):
   Bruch · Zahl, Bruch von einem Bruch, Bruch · Bruch, Kehrwert, durch einen Bruch teilen,
   Dezimalzahl · / : 10, 100, 1000, Dezimalzahl · Dezimalzahl, Dezimalzahlen teilen, Alltag (Einkauf, Tanken, Sport, Rezept) */
(() => {
  const U = "#be185d", SOFT = "#fce7f1";
  const INK = "#1b2740", PEN = "#5d6678", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a", VIOLET = "#7b4fd6", ORANGE = "#ee7a1a", LINE = "#c8d3de";
  if (!document.getElementById("u10css")) {
    const st = document.createElement("style"); st.id = "u10css";
    st.textContent = `.u10f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.02;margin:0 .08em;font-variant-numeric:tabular-nums}
.u10f>span:first-child{border-bottom:.075em solid currentColor;padding:0 .14em .05em}
.u10f>span:last-child{padding:.05em .14em 0}
.u10m{white-space:nowrap;display:inline-flex;align-items:center;gap:.04em;vertical-align:middle}
.u10nw{white-space:nowrap}
.u10eq{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font:700 34px/1.1 var(--f-display)}`;
    document.head.appendChild(st);
  }
  const LBL = { font: "700 14px/1 var(--f-display)", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "8px", color: "var(--green)", gridColumn: "1 / -1" };
  const lerp = (a, b, t) => a + (b - a) * t;
  const fb = el => { el.style.transformBox = "fill-box"; el.style.transformOrigin = "center"; return el; };
  const later = el => { el.classList.add("later"); return el; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({ x, y, "text-anchor": o.a || "middle", "dominant-baseline": "central", "font-size": o.size || 22, "font-weight": o.w || 700, fill: o.fill || INK, text: String(text) }, o.attrs || {}));
  /* HTML fraction, mixed number, no-wrap group */
  const F = (s, z, n, style) => s.h("span", { class: "u10f", style: style || null }, s.h("span", null, String(z)), s.h("span", null, String(n)));
  const M = (s, w, z, n, style) => s.h("span", { class: "u10m", style: style || null }, String(w), F(s, z, n));
  const NW = (s, ...kids) => s.h("span", { class: "u10nw" }, ...kids);
  const EQ = (s, cls, style, ...kids) => s.h("div", { class: "u10eq" + (cls ? " " + cls : ""), style: style || null }, ...kids);
  const PF = (s, cls, ...kids) => s.h("p", { class: cls, style: { lineHeight: /small/.test(cls) ? "2.5" : "1.7" } }, ...kids);
  /* SVG fraction centred on (x,y) = the fraction bar */
  const SF = (s, x, y, z, n, size = 24, fill = INK) => {
    const g = s.el("g"), w = Math.max(String(z).length, String(n).length) * size * 0.62 + 8;
    g.append(T(s, x, y - size * 0.6, z, { size, fill }), s.el("line", { x1: x - w / 2, y1: y, x2: x + w / 2, y2: y, stroke: fill, "stroke-width": Math.max(2, size / 10), "stroke-linecap": "round" }), T(s, x, y + size * 0.64, n, { size, fill }));
    return g;
  };
  const life = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "life" }, attrs || {}), s.h("span", { style: LBL }, label || "Im Alltag"), ...kids);
  const exb = (s, label, attrs, ...kids) => s.h("div", Object.assign({ class: "ex" }, attrs || {}), s.h("span", { class: "exlabel" }, label), ...kids);
  const merk = (s, style, ...kids) => s.h("div", { class: "merk later", style: Object.assign({ fontSize: "21px" }, style || {}) }, ...kids);
  const root = (s, cls, style, ...kids) => s.h("div", { class: cls, style: Object.assign({ height: "100%" }, style || {}) }, ...kids);
  const num = (n, d) => { const t = n.toFixed(d === undefined ? 2 : d).replace(".", ","); return t; };

  /* rectangle model "z1/n1 von z2/n2": columns = n2, rows = n1 */
  function gridModel(s, x, y, W, H, z1, n1, z2, n2) {
    const g = s.el("g"), cw = W / n2, rh = H / n1;
    const col = later(s.el("rect", { x, y, width: cw * z2, height: H, fill: BLUE, opacity: .28 }));
    const over = later(fb(s.el("rect", { x, y, width: cw * z2, height: rh * z1, fill: U, opacity: .6 })));
    const vl = [], hl = [];
    for (let i = 1; i < n2; i++) vl.push(later(s.el("line", { x1: x + i * cw, y1: y, x2: x + i * cw, y2: y + H, stroke: INK, "stroke-width": 2.5 })));
    for (let i = 1; i < n1; i++) hl.push(later(s.el("line", { x1: x, y1: y + i * rh, x2: x + W, y2: y + i * rh, stroke: INK, "stroke-width": 2.5, "stroke-dasharray": "8 6" })));
    g.append(s.el("rect", { x, y, width: W, height: H, fill: "#fff", stroke: INK, "stroke-width": 3 }), col, over, ...vl, ...hl, s.el("rect", { x, y, width: W, height: H, fill: "none", stroke: INK, "stroke-width": 3.5 }));
    return { g, col, over, vl, hl };
  }
  async function playGrid(s, m) {
    for (const l of m.vl) { s.sfx.scribble(); s.show(l, "draw"); await s.wait(120); }
    await s.wait(250); s.sfx.pop(); await s.show(m.col, "fade");
    for (const l of m.hl) { s.sfx.scribble(); s.show(l, "draw"); await s.wait(120); }
    await s.wait(250); s.sfx.ding(); await s.show(m.over, "pop");
  }

  /* a row of digit boxes with a comma that hops: cfg = {chars, pos, ghost:[idx], fade:[idx], col} */
  function hopRow(s, cfg) {
    const CW = 50, n = cfg.chars.length, W = n * CW + 24, svg = s.svg(W, 88);
    const ds = cfg.chars.split("").map((c, i) => { const t = T(s, 12 + i * CW + CW / 2, 36, c, { size: 44, fill: cfg.col || INK, attrs: { "font-family": "var(--f-display)" } }); if ((cfg.ghost || []).includes(i)) t.setAttribute("opacity", 0); svg.append(t); return t; });
    for (let i = 0; i <= n; i++) svg.append(s.el("line", { x1: 12 + i * CW, y1: 76, x2: 12 + i * CW, y2: 84, stroke: LINE, "stroke-width": 2 }));
    const cm = T(s, 0, 52, ",", { size: 52, fill: RED });
    svg.append(cm);
    let pos = cfg.pos;
    const place = (p, lift) => { cm.setAttribute("x", 12 + p * CW); cm.setAttribute("y", 52 - (lift || 0)); cm.setAttribute("opacity", p >= n - 0.001 ? 0 : 1); };
    place(pos);
    return {
      svg, get pos() { return pos; },
      async hop(k) {
        const dir = Math.sign(k);
        for (let i = 0; i < Math.abs(k); i++) {
          const a = pos, b = pos + dir;
          cm.setAttribute("opacity", 1);
          await s.tween({ dur: 420, ease: "inOut", update: v => { cm.setAttribute("x", 12 + lerp(a, b, v) * CW); cm.setAttribute("y", 52 - Math.sin(Math.PI * v) * 30); } });
          pos = b; place(pos); s.sfx.count(i * 2 + 2);
        }
        (cfg.ghost || []).forEach(i => { ds[i].setAttribute("opacity", 1); ds[i].setAttribute("fill", PEN); });
        (cfg.fade || []).forEach(i => ds[i].setAttribute("opacity", .25));
      },
      reset() { pos = cfg.pos; place(pos); ds.forEach((d, i) => { d.setAttribute("opacity", (cfg.ghost || []).includes(i) ? 0 : 1); d.setAttribute("fill", cfg.col || INK); }); },
    };
  }

  Deck.unit({
    id: "u10", num: 10, title: "Mal und geteilt mit Brüchen und Dezimalzahlen", color: U, soft: SOFT,
    subtitle: "Ausblick auf Klasse 6: Malnehmen und Teilen",
    blurb: "Brüche und Kommazahlen malnehmen und teilen – Ausblick auf Klasse 6.",
    goals: ["Brüche mit Zahlen und mit Brüchen malnehmen", "„Bruch von einem Bruch“ im Rechteck sehen", "Mit dem Kehrwert durch einen Bruch teilen", "Das Komma bei · und : 10, 100, 1000 verschieben", "Dezimalzahlen malnehmen und teilen – im Alltag"],
    icon(svg, el) {
      svg.append(el("rect", { x: 8, y: 10, width: 54, height: 50, rx: 6, fill: "#fff", stroke: U, "stroke-width": 3 }),
        el("rect", { x: 8, y: 10, width: 40.5, height: 50, fill: "#1d5bd0", opacity: .25 }),
        el("rect", { x: 8, y: 10, width: 40.5, height: 25, fill: U, opacity: .7 }),
        el("line", { x1: 8, y1: 35, x2: 62, y2: 35, stroke: "#1b2740", "stroke-width": 2, "stroke-dasharray": "4 3" }),
        el("line", { x1: 48.5, y1: 10, x2: 48.5, y2: 60, stroke: "#1b2740", "stroke-width": 2 }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Bruch mal natürliche Zahl",
        say: "Drei mal zwei Fünftel heißt: dreimal zwei Fünftel zusammenzählen. Das sind sechs Fünftel.",
        build(s) {
          const svg = s.svg(520, 420), X0 = 70, BW = 400, PW = BW / 5, BH = 46;
          const bars = [], movers = [], ys = [14, 84, 154], ty = [296, 362];
          const outline = (y, cls) => { const g = s.el("g"); for (let i = 0; i < 5; i++) g.append(s.el("rect", { x: X0 + i * PW, y, width: PW, height: BH, fill: "#fff", stroke: INK, "stroke-width": 2.5 })); if (cls) later(g); return g; };
          ys.forEach((y, b) => {
            const g = later(fb(s.el("g")));
            g.append(outline(y), SF(s, 32, y + BH / 2, 2, 5, 20, U));
            svg.append(g); bars.push(g);
          });
          const tgt = [later(outline(ty[0])), later(outline(ty[1]))];
          svg.append(...tgt, s.el("line", { x1: 30, y1: 236, x2: 490, y2: 236, stroke: LINE, "stroke-width": 3, "stroke-dasharray": "6 6" }));
          ys.forEach((y, b) => [0, 1].forEach(i => { const r = later(s.el("rect", { x: X0 + i * PW + 3, y: y + 3, width: PW - 6, height: BH - 6, rx: 6, fill: U })); r.home = [X0 + i * PW + 3, y + 3]; r.bar = b; svg.append(r); movers.push(r); }));
          const lab1 = later(fb(T(s, X0 + BW / 2, ty[0] - 22, "1 Ganzes = 5 Fünftel", { size: 20, fill: GREEN })));
          const lab2 = later(fb(SF(s, 500, ty[1] + BH / 2, 1, 5, 20, GREEN)));
          svg.append(lab1, lab2);
          const e0 = EQ(s, "", null, "3 · ", F(s, 2, 5, { color: U }));
          const e1 = EQ(s, "later", { fontSize: "30px" }, "= ", F(s, 2, 5), " + ", F(s, 2, 5), " + ", F(s, 2, 5));
          const e2 = EQ(s, "later", { fontSize: "30px" }, "= ", F(s, "3 · 2", 5), " = ", F(s, 6, 5, { color: U }), " = ", M(s, 1, 1, 5, { color: GREEN }));
          const mk = merk(s, null, s.h("b", null, "Bruch mal Zahl: "), "den ", s.h("b", null, "Zähler"), " mit der Zahl malnehmen. Der ", s.h("b", null, "Nenner bleibt"), " – die Stücke bleiben ja gleich groß.");
          const lf = life(s, null, { class: "life later", style: { padding: "10px 16px" } }, PF(s, "small", "4 Gläser mit je ", F(s, 1, 4), " l Saft: 4 · ", F(s, 1, 4), " l = ", F(s, 4, 4), " l = 1 l"));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "24px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "12px" } }, e0, e1, e2, mk, lf)));
          s.sfx.whoosh();
          s.step(async () => {
            s.say("Dreimal zwei Fünftel.");
            for (let b = 0; b < 3; b++) { s.sfx.pop(); s.show(bars[b], "left"); await s.wait(200); movers.filter(m => m.bar === b).forEach(m => s.show(m, "pop")); s.sfx.count(b * 2); await s.wait(300); }
            await s.show(e1, "up");
          });
          s.step(async () => {
            s.say("Wir legen alle gefärbten Stücke zusammen. Sechs Fünftel – das ist ein Ganzes und ein Fünftel.");
            s.show(tgt, "fade");
            for (let k = 0; k < 6; k++) {
              const m = movers[k], tx = X0 + (k % 5) * PW + 3, tyy = ty[k < 5 ? 0 : 1] + 3, [hx, hy] = m.home;
              s.sfx.whoosh();
              await s.tween({ dur: 420, ease: "inOut", update: v => { m.setAttribute("x", lerp(hx, tx, v)); m.setAttribute("y", lerp(hy, tyy, v) - Math.sin(Math.PI * v) * 30); } });
              s.sfx.count(k);
            }
            s.sfx.ding(); s.show([lab1, lab2], "pop"); await s.show(e2, "up");
          });
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
          s.step(async () => { s.sound("water-pour", { vol: .5, dur: 1.2 }); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: Bruch mal Zahl",
        say: "Bruch mal Zahl brauchst du beim Kochen, beim Pizzaessen und beim Laufen.",
        build(s) {
          // Milch: 6 Portionen je 1/8 l
          const v1 = s.svg(300, 170), fill = s.el("rect", { x: 62, y: 150, width: 76, height: 0, fill: "#e8eef7" });
          v1.append(fill, s.el("path", { d: "M60 14 V152 H140 V14", fill: "none", stroke: INK, "stroke-width": 4 }));
          for (let i = 1; i <= 8; i++) { const y = 152 - i * 17; v1.append(s.el("line", { x1: 60, y1: y, x2: i % 2 ? 72 : 82, y2: y, stroke: INK, "stroke-width": 2 })); }
          v1.append(T(s, 152, 16, "1 l", { size: 19, fill: PEN, a: "start" }), T(s, 222, 150, "Messbecher", { size: 19, fill: PEN }));
          const lvl = later(fb(T(s, 222, 80, "", { size: 26, fill: BLUE })));
          v1.append(lvl);
          // Pizza: 4 Kinder je 3/8
          const v2 = s.svg(300, 170), sl = [];
          [[80, 85], [220, 85]].forEach(([cx, cy], p) => {
            v2.append(s.el("circle", { cx, cy, r: 66, fill: "#f3f4f6", stroke: LINE, "stroke-width": 3 }));
            for (let j = 0; j < 8; j++) { const a0 = (-90 + j * 45) * Math.PI / 180, a1 = (-90 + (j + 1) * 45) * Math.PI / 180, r = 62; const w = later(fb(s.el("path", { d: `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`, fill: "#f6c35b", stroke: "#b7791f", "stroke-width": 2.5 }))); v2.append(w); sl.push(w); }
          });
          // Laufen: 5 Runden je 3/4 km
          const v3 = s.svg(300, 170), X = 30, KM = 60;
          v3.append(s.el("line", { x1: X, y1: 120, x2: X + 4 * KM + 8, y2: 120, stroke: INK, "stroke-width": 3 }));
          for (let i = 0; i <= 16; i++) v3.append(s.el("line", { x1: X + i * KM / 4, y1: 120 - (i % 4 ? 6 : 12), x2: X + i * KM / 4, y2: 120 + (i % 4 ? 6 : 12), stroke: INK, "stroke-width": i % 4 ? 1.5 : 3 }));
          for (let k = 0; k <= 4; k++) v3.append(T(s, X + k * KM, 150, k + " km", { size: 19 }));
          const jumps = [];
          for (let r = 0; r < 5; r++) { const a = X + r * 0.75 * KM, b = X + (r + 1) * 0.75 * KM; const p = later(s.el("path", { d: `M${a} 112 Q${(a + b) / 2} ${50} ${b} 112`, fill: "none", stroke: U, "stroke-width": 3.5 })); v3.append(p); jumps.push(p); }
          const card = (title, svg, line, extra) => {
            const res = later(s.h("div", { class: "stack", style: { gap: "2px" } }, PF(s, "t mono", ...line), extra ? s.h("p", { class: "small" }, extra) : ""));
            const c = life(s, title, { class: "life later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "12px 16px" } }, svg, res);
            c.res = res; return c;
          };
          const cards = [
            card("Kochen · Pfannkuchen", v1, ["6 · ", F(s, 1, 8), " l = ", F(s, 6, 8), " l = ", F(s, 3, 4), " l"], "Pro Portion 1/8 l Milch – für 6 Portionen."),
            card("Pizza · 4 Kinder", v2, ["4 · ", F(s, 3, 8), " = ", F(s, 12, 8), " = ", M(s, 1, 1, 2)], "Jedes Kind isst 3 Achtel Pizza."),
            card("Laufen · 5 Runden", v3, ["5 · ", F(s, 3, 4), " km = ", F(s, 15, 4), " km = ", M(s, 3, 3, 4), " km"], "Eine Runde im Park ist 3/4 km lang."),
          ];
          s.add(root(s, "cols3", { gap: "18px", alignItems: "center" }, ...cards));
          const run = [
            async () => { for (let i = 1; i <= 6; i++) { s.sound("water-pour", { vol: .35, dur: .4 }); lvl.textContent = i + "/8 l"; lvl.classList.remove("later"); await s.tween({ dur: 260, update: v => { const h = (i - 1 + v) * 17; fill.setAttribute("y", 152 - h); fill.setAttribute("height", h); } }); s.sfx.count(i); } },
            async () => { for (let k = 0; k < 4; k++) { for (let j = 0; j < 3; j++) { const idx = k * 3 + j; s.show(sl[idx], "pop"); } s.sound("pizza-schneiden", { vol: .4 }); s.sfx.count(k * 2); await s.wait(380); } },
            async () => { for (let r = 0; r < 5; r++) { s.sound("footsteps", { vol: .35, dur: .5 }); await s.show(jumps[r], "draw"); s.sfx.count(r * 2); } },
          ];
          cards.forEach((c, i) => s.step(async () => { s.sfx.pop(); await s.show(c, "up"); await run[i](); s.sfx.ding(); await s.show(c.res, "up"); s.say(["Sechs Achtel Liter, gekürzt drei Viertel Liter.", "Zwölf Achtel – das sind eineinhalb Pizzen.", "Fünfzehn Viertel Kilometer, also drei dreiviertel Kilometer."][i]); }));
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Bruch von einem Bruch",
        say: "Auf dem Blech liegt noch drei Viertel Kuchen. Leon isst die Hälfte davon. Wie viel vom ganzen Blech ist das?",
        build(s) {
          const svg = s.svg(500, 400), m = gridModel(s, 30, 30, 440, 320, 1, 2, 3, 4);
          svg.append(m.g);
          const l34 = later(fb(T(s, 30 + 165, 375, "3/4 Kuchen", { size: 22, fill: BLUE })));
          const lab = later(fb(T(s, 30 + 165, 110, "3/8", { size: 46, fill: "#fff" })));
          svg.append(l34, lab);
          const story = exb(s, "Die Geschichte", { class: "ex a-right", style: { padding: "12px 18px" } }, PF(s, "t", "Auf dem Blech liegt noch ", F(s, 3, 4), " Kuchen. Leon isst ", s.h("b", null, "die Hälfte davon"), "."));
          const lines = [
            PF(s, "t later", s.h("b", null, "1. "), "Das Blech in Viertel teilen, ", F(s, 3, 4), " färben."),
            PF(s, "t later", s.h("b", null, "2. "), "Quer halbieren: Jetzt hat das Blech 2 · 4 = ", s.h("b", null, "8"), " Stücke."),
            PF(s, "t later", s.h("b", null, "3. "), "Die Hälfte vom blauen Teil sind ", s.h("b", { style: { color: U } }, "3 von 8"), " Stücken."),
          ];
          const res = EQ(s, "later", { color: U }, F(s, 1, 2), " von ", F(s, 3, 4), " = ", F(s, 3, 8));
          const mk = merk(s, null, "„von“ heißt ", s.h("b", null, "mal"), ": ", NW(s, F(s, 1, 2), " · ", F(s, 3, 4), " = ", F(s, "1 · 3", "2 · 4"), " = ", F(s, 3, 8)));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "24px", alignItems: "center" }, svg, s.h("div", { class: "stack", style: { gap: "10px" } }, story, ...lines, res, mk)));
          s.sound("schoko-knack", { vol: .3 });
          s.step(async () => { s.show(lines[0], "left"); for (const l of m.vl) { s.sfx.scribble(); await s.show(l, "draw"); } s.sfx.pop(); await s.show(m.col, "fade"); s.show(l34, "pop"); s.say("Drei Viertel sind blau."); });
          s.step(async () => { s.show(lines[1], "left"); for (const l of m.hl) { s.sfx.scribble(); await s.show(l, "draw"); } s.sfx.ding(); s.say("Quer halbiert: Das ganze Blech hat jetzt acht gleiche Stücke."); });
          s.step(async () => { s.show(lines[2], "left"); s.sfx.pop(); await s.show(m.over, "pop"); await s.show(lab, "zoom"); s.sfx.success(); await s.show(res, "up"); s.say("Die Hälfte von drei Vierteln sind drei Achtel."); });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Bruch mal Bruch",
        say: "Bruch mal Bruch: Zähler mal Zähler, Nenner mal Nenner. Das Rechteck zeigt, warum.",
        build(s) {
          const svg = s.svg(480, 400), holder = s.el("g"); svg.append(holder);
          const eq = s.h("div", { class: "u10eq", style: { minHeight: "90px", fontSize: "38px" } });
          const why = s.h("p", { class: "t", style: { minHeight: "70px" } });
          let busy = false;
          const PRE = [[2, 3, 3, 4], [1, 2, 1, 2], [3, 5, 2, 3], [1, 4, 2, 3]];
          async function show(i) {
            if (busy) return; busy = true;
            const [z1, n1, z2, n2] = PRE[i]; btns.forEach((b, j) => b.classList.toggle("solid", j === i));
            holder.textContent = ""; const m = gridModel(s, 20, 20, 440, 360, z1, n1, z2, n2); holder.append(m.g);
            eq.innerHTML = ""; why.innerHTML = "";
            eq.append(F(s, z1, n1, { color: U }), " · ", F(s, z2, n2, { color: BLUE }));
            await playGrid(s, m);
            const z = z1 * z2, n = n1 * n2, g = gcd(z, n);
            eq.append(" = ", F(s, `${z1} · ${z2}`, `${n1} · ${n2}`), " = ", F(s, z, n));
            if (g > 1) eq.append(" = ", F(s, z / g, n / g, { color: GREEN }));
            why.append(`${z} Kästchen gehören zu beiden Farben. Insgesamt hat das Rechteck ${n1} · ${n2} = ${n} Kästchen.`);
            s.sfx.success(); busy = false;
          }
          const btns = PRE.map((p, i) => s.h("button", { class: "btn", style: { fontSize: "24px", minHeight: "64px" }, onclick: () => { s.sfx.click(); show(i); } }, F(s, p[0], p[1]), "·", F(s, p[2], p[3])));
          const mk = merk(s, null, s.h("b", null, "Bruch mal Bruch: Zähler mal Zähler, Nenner mal Nenner."), " Tipp: Vorher kürzen spart Arbeit.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "480px 1fr", gap: "24px", alignItems: "center" }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { gap: "10px" } }, btns), eq, why, mk)));
          s.sfx.whoosh();
          s.step(async () => { s.say("Zwei Drittel von drei Vierteln. Blau sind drei Viertel, davon nehmen wir zwei Drittel."); await show(0); });
          s.step(async () => { s.say("Sechs Zwölftel – gekürzt ein Halb."); s.sfx.ding(); await s.show(mk, "up"); });
          s.step(async () => { s.say("Die Hälfte von einem Halb ist ein Viertel."); await show(1); });
          s.step(async () => { s.say("Drei Fünftel von zwei Dritteln sind sechs Fünfzehntel, also zwei Fünftel."); await show(2); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: Teil von einem Teil",
        say: "Ein Teil von einem Teil begegnet dir bei Schokolade, im Garten und in deiner Klasse.",
        build(s) {
          const mini = (z1, n1, z2, n2) => { const svg = s.svg(220, 150), m = gridModel(s, 10, 10, 200, 130, z1, n1, z2, n2); svg.append(m.g); return { svg, m }; };
          const D = [
            { lab: "Schokolade", txt: ["Von der Tafel sind noch ", F(s, 3, 4), " übrig. Du verschenkst ", F(s, 1, 3), " davon."], res: [F(s, 1, 3), " · ", F(s, 3, 4), " = ", F(s, 3, 12), " = ", F(s, 1, 4), " Tafel"], g: [1, 3, 3, 4], snd: () => s.sound("schoko-knack", { vol: .5 }) },
            { lab: "Garten", txt: ["Im Kleingarten ist ", F(s, 1, 2), " der Fläche Beet. Auf ", F(s, 2, 5), " vom Beet wachsen Erdbeeren."], res: [F(s, 2, 5), " · ", F(s, 1, 2), " = ", F(s, 2, 10), " = ", F(s, 1, 5), " vom Garten"], g: [2, 5, 1, 2], snd: () => s.sound("birds", { vol: .35, dur: 2 }) },
            { lab: "Klasse", txt: [F(s, 2, 3), " der Klasse kommen mit dem Rad. ", F(s, 3, 4), " davon tragen einen Helm mit Licht."], res: [F(s, 3, 4), " · ", F(s, 2, 3), " = ", F(s, 6, 12), " = ", F(s, 1, 2), " der Klasse"], g: [3, 4, 2, 3], snd: () => s.sound("bike-bell", { vol: .45 }) },
          ];
          const cards = D.map(d => {
            const { svg, m } = mini(...d.g);
            const res = later(PF(s, "t mono", ...d.res));
            const c = life(s, "Im Alltag · " + d.lab, { class: "life later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 16px", alignItems: "center" } }, PF(s, "small", ...d.txt), svg, res);
            return { c, m, res, d };
          });
          const mk = merk(s, null, "Steht im Text „", s.h("b", null, "… davon"), "“ oder „", s.h("b", null, "… von"), "“, dann nimmst du die Brüche ", s.h("b", null, "mal"), ".");
          s.add(root(s, "stack", { justifyContent: "center", gap: "16px" }, s.h("div", { class: "cols3", style: { gap: "18px" } }, cards.map(c => c.c)), mk));
          cards.forEach((k, i) => s.step(async () => { k.d.snd(); await s.show(k.c, "up"); await playGrid(s, k.m); await s.show(k.res, "up"); s.say(["Ein Drittel von drei Vierteln ist ein Viertel.", "Zwei Fünftel von einem Halb ist ein Fünftel.", "Drei Viertel von zwei Dritteln ist ein Halb."][i]); }));
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Der Kehrwert",
        say: "Den Kehrwert bekommst du, wenn du einen Bruch auf den Kopf stellst: Zähler und Nenner tauschen den Platz.",
        build(s) {
          const PAIRS = [[3, 4], [2, 5], [5, 1], [1, 8]];
          const big = s.h("span", { style: { display: "inline-block", font: "800 110px/1 var(--f-display)", color: U } });
          const flipCap = s.h("p", { class: "h2", style: { minHeight: "40px", color: PEN } });
          let cur = 0, flipped = false, busy = false;
          const render = () => { const [a, b] = PAIRS[cur]; big.innerHTML = ""; big.append(flipped ? F(s, b, a) : F(s, a, b)); flipCap.textContent = flipped ? "Kehrwert" : "Bruch"; };
          const flip = async () => {
            if (busy) return; busy = true; s.sfx.whoosh();
            await s.tween({ dur: 260, update: v => { big.style.transform = `scaleY(${1 - v})`; } });
            flipped = !flipped; render(); s.sfx.pop();
            await s.tween({ dur: 260, ease: "back", update: v => { big.style.transform = `scaleY(${v})`; } });
            big.style.transform = ""; busy = false;
          };
          const pick = async i => { if (busy) return; s.sfx.click(); cur = i; flipped = false; render(); btns.forEach((b, j) => b.classList.toggle("solid", j === i)); await s.wait(250); await flip(); };
          const btns = PAIRS.map(([a, b], i) => s.h("button", { class: "btn", style: { fontSize: "24px", minHeight: "70px" }, onclick: () => pick(i) }, b === 1 ? String(a) : F(s, a, b)));
          const flipBtn = s.h("button", { class: "btn solid", onclick: () => { s.sfx.click(); flip(); } }, "Umdrehen");
          render();
          const left = exb(s, "Auf den Kopf stellen", { class: "ex a-left", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "16px" } },
            s.h("div", { style: { height: "250px", display: "grid", placeItems: "center" } }, big), flipCap, s.h("div", { class: "row", style: { gap: "10px", justifyContent: "center" } }, ...btns, flipBtn));
          const gap = () => s.h("span", { style: { display: "inline-block", width: "48px" } });
          const ex1 = PF(s, "t later", F(s, 3, 4), " → ", F(s, 4, 3), gap(), F(s, 2, 5), " → ", F(s, 5, 2));
          const ex2 = PF(s, "t later", "5 = ", F(s, 5, 1), " → ", F(s, 1, 5), gap(), F(s, 1, 8), " → ", F(s, 8, 1), " = 8");
          const prod = EQ(s, "later", { fontSize: "30px" }, F(s, 3, 4), " · ", F(s, 4, 3), " = ", F(s, 12, 12), " = ", s.h("span", { style: { color: U } }, "1"));
          const mk = merk(s, null, "Beim ", s.h("b", null, "Kehrwert"), " tauschen Zähler und Nenner ihre Plätze. Eine Zahl mal ihr Kehrwert ergibt immer ", s.h("b", null, "1"), ".");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "520px 1fr", gap: "26px", alignItems: "center" }, left, s.h("div", { class: "stack", style: { gap: "14px" } }, ex1, ex2, prod, mk)));
          s.step(async () => { s.say("Aus drei Vierteln wird vier Drittel."); btns[0].classList.add("solid"); await flip(); await s.show(ex1, "left"); });
          s.step(async () => { s.say("Eine ganze Zahl schreibst du als Bruch mit Nenner eins. Fünf wird zu einem Fünftel."); await pick(2); await s.show(ex2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(prod, "zoom"); s.say("Drei Viertel mal vier Drittel ist genau eins."); });
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Wie oft passt ¾ in 3?",
        say: "Drei geteilt durch drei Viertel fragt: Wie oft passt drei Viertel in drei? Wir springen auf dem Zahlenstrahl.",
        build(s) {
          const svg = s.svg(1000, 190), X = 40, UW = 300;
          svg.append(s.el("line", { x1: X - 10, y1: 130, x2: X + 3 * UW + 20, y2: 130, stroke: INK, "stroke-width": 3.5 }));
          for (let i = 0; i <= 12; i++) svg.append(s.el("line", { x1: X + i * UW / 4, y1: 130 - (i % 4 ? 9 : 16), x2: X + i * UW / 4, y2: 130 + (i % 4 ? 9 : 16), stroke: INK, "stroke-width": i % 4 ? 2 : 3.5 }));
          for (let k = 0; k <= 3; k++) svg.append(T(s, X + k * UW, 168, String(k), { size: 26 }));
          const jumps = [], jl = [];
          for (let j = 0; j < 4; j++) {
            const a = X + j * 0.75 * UW, b = X + (j + 1) * 0.75 * UW;
            const p = later(s.el("path", { d: `M${a} 118 Q${(a + b) / 2} 10 ${b} 118`, fill: "none", stroke: U, "stroke-width": 4.5 }));
            const t = later(fb(T(s, (a + b) / 2, 44, String(j + 1), { size: 26, fill: "#fff" })));
            const c = later(fb(s.el("circle", { cx: (a + b) / 2, cy: 44, r: 19, fill: U })));
            svg.append(p, c, t); jumps.push(p); jl.push([c, t]);
          }
          const frog = s.el("circle", { cx: X, cy: 118, r: 11, fill: GREEN, stroke: "#fff", "stroke-width": 3 });
          svg.append(frog);
          const r1 = EQ(s, "later", null, "3 : ", F(s, 3, 4), " = ", s.h("span", { style: { color: U } }, "4"));
          const r1b = PF(s, "t later", "Rechnen mit dem Kehrwert: 3 · ", F(s, 4, 3), " = ", F(s, 12, 3), " = 4 ✓");
          // pizza halves
          const pz = s.svg(300, 150), halves = [], pzNums = [];
          [75, 225].forEach(cx => [1, 0].forEach(h => {
            const g = s.el("g"), cy = 75; g.append(s.el("path", { d: `M${cx} ${cy - 58} A58 58 0 0 ${h ? 0 : 1} ${cx} ${cy + 58} Z`, fill: "#f6c35b", stroke: "#b7791f", "stroke-width": 3 }));
            g.dx = h ? -8 : 8; pz.append(g); halves.push(g);
            const tt = later(fb(T(s, cx + (h ? -28 : 28) + g.dx, cy, String(halves.length), { size: 26, fill: "#7a3e00" }))); pzNums.push(tt);
          }));
          pz.append(...pzNums);
          const lf = life(s, "Im Alltag · Pizza", { class: "life later", style: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "16px", alignItems: "center", padding: "10px 16px" } }, pz,
            s.h("div", { class: "stack", style: { gap: "6px" } }, PF(s, "t", "2 Pizzen, jedes Kind bekommt eine halbe:"), PF(s, "t mono", s.h("b", null, "2 : ", F(s, 1, 2), " = 2 · 2 = 4"), " Kinder")));
          const mk = merk(s, { flex: "1" }, "Teilen durch ", F(s, 3, 4), " ist dasselbe wie ", s.h("b", null, "malnehmen mit dem Kehrwert"), " ", F(s, 4, 3), ".");
          s.add(root(s, "stack", { justifyContent: "center", gap: "14px" }, svg, s.h("div", { class: "row", style: { gap: "20px", flexWrap: "nowrap", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, r1, r1b), mk), lf));
          s.sfx.whoosh();
          s.step(async () => {
            s.say("Ein Sprung ist drei Viertel lang. Wir zählen die Sprünge bis drei.");
            for (let j = 0; j < 4; j++) {
              const a = X + j * 0.75 * UW, b = X + (j + 1) * 0.75 * UW;
              s.show(jumps[j], "draw"); s.sfx.boing();
              await s.tween({ dur: 520, ease: "inOut", update: v => { frog.setAttribute("cx", lerp(a, b, v)); frog.setAttribute("cy", 118 - Math.sin(Math.PI * v) * 100); } });
              s.show(jl[j], "pop"); s.sfx.count(j * 2);
            }
            s.sfx.ding(); await s.show(r1, "up");
          });
          s.step(async () => { s.sfx.pop(); await s.show(r1b, "left"); s.say("Mit dem Kehrwert: drei mal vier Drittel ist vier."); });
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
          s.step(async () => {
            s.sound("pizza-schneiden", { vol: .5 }); await s.show(lf, "up");
            await s.tween({ dur: 500, ease: "back", update: v => halves.forEach(g => g.setAttribute("transform", `translate(${g.dx * v} 0)`)) });
            for (const t of pzNums) { s.sfx.count(2); await s.show(t, "pop"); }
            s.say("In zwei Pizzen passen vier Hälften. Vier Kinder werden satt.");
          });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Durch einen Bruch teilen",
        say: "Durch einen Bruch teilst du, indem du mit seinem Kehrwert malnimmst.",
        build(s) {
          const glasses = s.svg(460, 162), gl = [];
          for (let i = 0; i < 6; i++) { const x = 14 + i * 74, g = later(fb(s.el("g"))); g.append(s.el("rect", { x: x + 6, y: 70, width: 48, height: 52, fill: "#fdba74" }), s.el("path", { d: `M${x} 40 L${x + 6} 128 H${x + 54} L${x + 60} 40`, fill: "none", stroke: INK, "stroke-width": 3 }), T(s, x + 30, 142, String(i + 1), { size: 19 })); glasses.append(g); gl.push(g); }
          glasses.append(T(s, 230, 16, "6 Gläser zu je 1/8 l", { size: 20, fill: ORANGE }));
          const ROWS = [
            { lab: "Beispiel 1: Saft", story: ["Wie viele Gläser zu ", F(s, 1, 8), " l füllst du mit ", F(s, 3, 4), " l Saft?"], calc: [F(s, 3, 4), " : ", F(s, 1, 8), " = ", F(s, 3, 4), " · ", F(s, 8, 1), " = ", F(s, 24, 4), " = ", s.h("b", { style: { color: U } }, "6")] },
            { lab: "Beispiel 2: durch eine Zahl", story: [F(s, 2, 3), " einer Torte teilen sich 2 Kinder."], calc: [F(s, 2, 3), " : 2 = ", F(s, 2, 3), " · ", F(s, 1, 2), " = ", F(s, 2, 6), " = ", s.h("b", { style: { color: U } }, F(s, 1, 3))] },
            { lab: "Beispiel 3: Pizzastücke", story: ["5 Pizzen werden in Viertel geschnitten. Wie viele Stücke?"], calc: ["5 : ", F(s, 1, 4), " = 5 · 4 = ", s.h("b", { style: { color: U } }, "20"), " Stücke"] },
          ];
          const cards = ROWS.map(r => { const c = later(PF(s, "t mono", ...r.calc)); const card = exb(s, r.lab, { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "2px", padding: "8px 16px" } }, PF(s, "small", ...r.story), c); card.calc = c; return card; });
          const top = s.h("div", { class: "merk a-up", style: { fontSize: "21px", padding: "10px 20px 12px" } }, s.h("b", null, "Durch einen Bruch teilen = mit dem Kehrwert malnehmen."), s.h("br"), NW(s, "a : ", F(s, "b", "c"), " = a · ", F(s, "c", "b")));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "1fr 470px", gap: "22px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "8px" } }, top, ...cards),
            life(s, "Im Alltag · Gläser füllen", { class: "life", style: { padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center" } }, glasses)));
          s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(cards[0], "left"); for (const g of gl) { s.sound("water-pour", { vol: .3, dur: .35 }); await s.show(g, "bounce"); } s.sfx.ding(); await s.show(cards[0].calc, "up"); s.say("Drei Viertel geteilt durch ein Achtel: drei Viertel mal acht. Das sind sechs Gläser."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "left"); await s.wait(300); s.sfx.ding(); await s.show(cards[1].calc, "up"); s.say("Durch zwei teilen heißt: mal ein Halb. Jedes Kind bekommt ein Drittel."); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[2], "left"); await s.wait(300); s.sound("pizza-schneiden", { vol: .5 }); await s.show(cards[2].calc, "up"); s.say("Fünf geteilt durch ein Viertel: fünf mal vier, zwanzig Stücke."); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Mal 10, 100, 1000",
        say: "Beim Malnehmen mit zehn rutschen alle Ziffern eine Stelle nach links. Das Komma bleibt stehen.",
        build(s) {
          const COLS = ["T", "H", "Z", "E", "z", "h", "t"], CW = 82, X0 = 10, svg = s.svg(COLS.length * CW + 20, 190);
          COLS.forEach((c, i) => { svg.append(s.el("rect", { x: X0 + i * CW, y: 10, width: CW, height: 46, fill: i < 4 ? "#e4ecfb" : SOFT, stroke: LINE, "stroke-width": 2 }), T(s, X0 + i * CW + CW / 2, 33, c, { size: 24, fill: i < 4 ? BLUE : U }), s.el("rect", { x: X0 + i * CW, y: 56, width: CW, height: 110, fill: "#fff", stroke: LINE, "stroke-width": 2 })); });
          svg.append(s.el("line", { x1: X0 + 4 * CW, y1: 8, x2: X0 + 4 * CW, y2: 170, stroke: RED, "stroke-width": 4 }), T(s, X0 + 4 * CW, 140, ",", { size: 70, fill: RED }));
          const dg = s.el("g"); svg.append(dg);
          let N = 2450; // in Tausendsteln: 2,45
          const fmtN = n => { let t = (n / 1000).toFixed(3).replace(/0+$/, "").replace(/\.$/, ""); const [a, b] = t.split("."); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (b ? "," + b : ""); };
          const digits = () => {
            const out = []; let lastDec = 1;
            for (let p = -3; p <= -1; p++) if (Math.floor(N / Math.pow(10, p + 3)) % 10) { lastDec = p; break; }
            for (let c = 0; c < 7; c++) { const p = 3 - c, d = Math.floor(N / Math.pow(10, p + 3)) % 10; if ((p >= 0 && (N >= Math.pow(10, p + 3) || p === 0)) || (p < 0 && p >= lastDec)) out.push([c, d]); }
            return out;
          };
          const render = () => { dg.textContent = ""; digits().forEach(([c, d]) => { const t = T(s, X0 + c * CW + CW / 2, 112, String(d), { size: 56, attrs: { "font-family": "var(--f-display)" } }); t.c = c; dg.append(t); }); };
          render();
          const eq = s.h("p", { class: "big mono", style: { minHeight: "50px" } }, fmtN(N));
          let busy = false;
          async function op(mul, k) {
            if (busy) return; const f = Math.pow(10, k), nn = mul ? N * f : N / f;
            if (!Number.isInteger(nn) || nn >= 1e7) { s.sfx.error(); eq.classList.remove("a-shake"); void eq.offsetWidth; eq.classList.add("a-shake"); return; }
            busy = true; s.sfx.whoosh();
            const before = fmtN(N), els = [...dg.children];
            await s.tween({ dur: 420 + k * 180, ease: "inOut", update: v => els.forEach(t => t.setAttribute("x", X0 + (t.c + (mul ? -k : k) * v) * CW + CW / 2)) });
            N = nn; render(); s.sfx.snap();
            eq.innerHTML = ""; eq.append(before + (mul ? " · " : " : ") + f.toLocaleString("de-DE") + " = ", s.h("span", { style: { color: U } }, fmtN(N)));
            busy = false;
          }
          const B = (txt, mul, k) => s.h("button", { class: "btn" + (mul ? " solid" : ""), onclick: () => { s.sfx.click(); op(mul, k); } }, txt);
          const reset = s.h("button", { class: "btn", style: { borderColor: PEN, color: PEN }, onclick: () => { if (busy) return; s.sfx.click(); N = 2450; render(); eq.textContent = fmtN(N); } }, "↺ 2,45");
          const bar = s.h("div", { class: "row", style: { gap: "10px" } }, B("· 10", true, 1), B("· 100", true, 2), B("· 1000", true, 3), B(": 10", false, 1), B(": 100", false, 2), reset);
          const mk = merk(s, null, s.h("b", null, "· 10, · 100, · 1000:"), " Das Komma rückt um ", s.h("b", null, "1, 2 oder 3 Stellen nach rechts"), " (die Ziffern wandern nach links). Bei ", s.h("b", null, ":"), " geht es nach links.");
          const lf = life(s, null, { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, "Eine Brezel kostet 0,85 €. 10 Brezeln: 8,50 €. 100 Brezeln für das Schulfest: 85 €."));
          s.add(root(s, "stack", { justifyContent: "center", gap: "12px", alignItems: "center" }, svg, eq, bar, s.h("div", { class: "cols", style: { gap: "18px", width: "100%" } }, mk, lf)));
          s.sfx.pop();
          s.step(async () => { s.say("Zwei Komma vier fünf mal zehn: Alle Ziffern rutschen eine Stelle nach links. Vierundzwanzig Komma fünf."); await op(true, 1); });
          s.step(async () => { s.say("Noch einmal mal hundert: zwei Stellen nach links."); await op(true, 2); });
          s.step(async () => { s.say("Und jetzt geteilt durch tausend: drei Stellen zurück nach rechts."); await op(false, 3); s.sfx.ding(); await s.show(mk, "up"); });
          s.step(async () => { s.sound("cash-register", { vol: .5 }); await s.show(lf, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Geteilt: Das Komma hüpft",
        say: "Beim Teilen durch zehn, hundert oder tausend hüpft das Komma nach links. Fehlen Stellen, füllst du mit Nullen auf.",
        build(s) {
          const R = [
            { label: "Gewicht", start: "2.450 g", op: ": 1000", res: "2,45 kg", cfg: { chars: "2450", pos: 4, fade: [3] }, k: -3, say: "Zweitausendvierhundertfünfzig Gramm sind zwei Komma vier fünf Kilogramm." },
            { label: "Länge", start: "75 cm", op: ": 100", res: "0,75 m", cfg: { chars: "075", pos: 3, ghost: [0] }, k: -2, say: "Fünfundsiebzig Zentimeter sind null Komma sieben fünf Meter. Vorne kommt eine Null dazu." },
            { label: "Geld", start: "7 ct", op: ": 100", res: "0,07 €", cfg: { chars: "007", pos: 3, ghost: [0, 1] }, k: -2, say: "Sieben Cent sind null Komma null sieben Euro. Hier brauchen wir zwei Nullen." },
          ];
          const rows = R.map(r => {
            const h = hopRow(s, r.cfg);
            const res = s.h("p", { class: "h2 later", style: { color: U, minWidth: "130px" } }, "= " + r.res);
            const card = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "150px 230px 1fr 160px", alignItems: "center", gap: "14px", padding: "8px 18px" } },
              s.h("span", { class: "chip", style: { background: SOFT, color: U, justifySelf: "start" } }, r.label), s.h("p", { class: "h2" }, r.start, " ", s.h("span", { style: { color: RED } }, r.op)), h.svg, res);
            return { card, h, res, r };
          });
          const mk = merk(s, null, s.h("b", null, ": 10 / : 100 / : 1000"), " → Komma ", s.h("b", null, "1 / 2 / 3 Stellen nach links"), ". Fehlende Stellen füllst du mit ", s.h("b", null, "Nullen"), " auf.");
          s.add(root(s, "stack", { justifyContent: "center", gap: "14px" }, ...rows.map(x => x.card), mk));
          s.sfx.pop();
          rows.forEach((x, i) => s.step(async () => { s.sfx.pop(); await s.show(x.card, "left"); await s.wait(300); await x.h.hop(x.r.k); s.sfx.ding(); await s.show(x.res, "pop"); s.say(x.r.say); }));
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Dezimalzahl mal Dezimalzahl",
        say: "Null Komma drei mal null Komma vier: Im Hunderterfeld siehst du, dass zwölf Hundertstel herauskommen.",
        build(s) {
          const C = 38, X = 20, svg = s.svg(420, 440);
          const cells = [];
          for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) { const rc = s.el("rect", { x: X + c * C, y: X + r * C, width: C, height: C, fill: "#fff", stroke: LINE, "stroke-width": 1.5 }); svg.append(rc); cells.push({ rc, r, c }); }
          svg.append(s.el("rect", { x: X, y: X, width: 10 * C, height: 10 * C, fill: "none", stroke: INK, "stroke-width": 3 }));
          const colL = later(fb(T(s, X + 1.5 * C, X + 10 * C + 24, "0,3", { size: 24, fill: BLUE })));
          svg.append(colL);
          const rowLab = later(s.h("span", { class: "chip", style: { background: "#fde2df", color: RED, fontSize: "21px", alignSelf: "flex-start" } }, "0,4 davon"));
          const l1 = PF(s, "t later", s.h("b", { class: "blue" }, "3 Spalten"), " = 0,3 vom Ganzen");
          const l2 = PF(s, "t later", s.h("b", { class: "red" }, "4 Zeilen"), " davon = 0,4");
          const res = EQ(s, "later", null, "0,3 · 0,4 = ", s.h("span", { style: { color: U } }, "0,12"));
          const l3 = PF(s, "t later", "12 von 100 Kästchen = 12 Hundertstel");
          const mk = merk(s, null, "Rechne erst ", s.h("b", null, "ohne Komma"), ": 3 · 4 = 12. Dann ", s.h("b", null, "Kommastellen zählen"), ": 1 + 1 = 2 Stellen → 0,12.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "420px 1fr", gap: "28px", alignItems: "center" }, s.h("div", { class: "a-zoom" }, svg), s.h("div", { class: "stack", style: { gap: "12px" } }, l1, l2, rowLab, res, l3, mk)));
          s.sfx.whoosh();
          s.step(async () => { s.say("Null Komma drei: drei von zehn Spalten."); s.show(l1, "left"); for (let c = 0; c < 3; c++) { cells.filter(x => x.c === c).forEach(x => x.rc.setAttribute("fill", "#c7d7f5")); s.sfx.count(c * 2); await s.wait(220); } s.show(colL, "pop"); });
          s.step(async () => { s.say("Davon null Komma vier: vier von zehn Zeilen."); s.show(l2, "left"); s.show(rowLab, "pop"); for (let r = 0; r < 4; r++) { cells.filter(x => x.r === r && x.c < 3).forEach(x => x.rc.setAttribute("fill", U)); cells.filter(x => x.r === r && x.c >= 3).forEach(x => x.rc.setAttribute("fill", "#fde2df")); s.sfx.count(r * 2 + 1); await s.wait(260); } });
          s.step(async () => { let k = 0; for (const x of cells.filter(x => x.r < 4 && x.c < 3)) { x.rc.setAttribute("stroke", "#fff"); k++; s.sfx.tick(); await s.wait(70); } s.sfx.ding(); await s.show(res, "up"); s.show(l3, "up"); s.say("Zwölf Kästchen von hundert. Null Komma drei mal null Komma vier ist null Komma eins zwei."); });
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Kommastellen zählen",
        say: "Zum Malnehmen von Kommazahlen: Rechne ohne Komma und zähle dann die Kommastellen zusammen.",
        build(s) {
          const dec = (t, col) => { const [a, b] = t.split(","); return s.h("span", { class: "u10nw" }, a, b !== undefined ? "," : "", b !== undefined ? s.h("span", { style: { borderBottom: `4px solid ${col}`, color: col } }, b) : ""); };
          const D = [
            { lab: "Beispiel 1: Teppich", story: "Ein Teppich ist 2,5 m lang und 1,2 m breit. Fläche?", a: "2,5", b: "1,2", raw: "25 · 12 = 300", n: "1 + 1 = 2", res: "3,00 m² = 3 m²", ue: "Überschlag: 3 · 1 = 3 ✓" },
            { lab: "Beispiel 2: Eis", story: "4 Kugeln Eis zu je 1,25 €.", a: "1,25", b: "4", raw: "125 · 4 = 500", n: "2 + 0 = 2", res: "5,00 €", ue: "Überschlag: 1 € · 4 = 4 € ✓" },
            { lab: "Beispiel 3: Hälfte", story: "Die Hälfte von einem halben Liter.", a: "0,5", b: "0,5", raw: "5 · 5 = 25", n: "1 + 1 = 2", res: "0,25 l", ue: "Kleiner als 0,5 – bei Zahlen unter 1 wird es kleiner!" },
          ];
          const cards = D.map(d => {
            const parts = [s.h("p", { class: "h2 mono" }, dec(d.a, RED), " · ", dec(d.b, BLUE)),
              later(s.h("p", { class: "t mono" }, "ohne Komma: ", d.raw)),
              later(s.h("p", { class: "t" }, s.h("span", { class: "chip", style: { background: SOFT, color: U, fontSize: "20px" } }, "Stellen: " + d.n))),
              later(s.h("p", { class: "h2", style: { color: U } }, "= " + d.res)),
              later(s.h("p", { class: "small pencil" }, d.ue))];
            const c = exb(s, d.lab, { class: "ex later", style: { display: "flex", flexDirection: "column", gap: "8px", padding: "12px 16px" } }, s.h("p", { class: "small", style: { minHeight: "54px" } }, d.story), ...parts);
            c.parts = parts; return c;
          });
          const mk = merk(s, null, "Beim Malnehmen steht das Komma ", s.h("b", null, "nicht"), " untereinander! Das Ergebnis hat so viele Kommastellen wie ", s.h("b", null, "beide Zahlen zusammen"), ".");
          s.add(root(s, "stack", { justifyContent: "center", gap: "16px" }, s.h("div", { class: "cols3", style: { gap: "16px" } }, ...cards), mk));
          s.sfx.pop();
          const snd = [() => s.sound("paper-crumple", { vol: .3, dur: .8 }), () => s.sound("coins", { vol: .5 }), () => s.sound("water-pour", { vol: .4, dur: 1 })];
          cards.forEach((c, i) => s.step(async () => {
            s.sfx.pop(); await s.show(c, "up");
            for (let k = 1; k < c.parts.length; k++) { await s.wait(300); s.sfx.count(k * 2); await s.show(c.parts[k], k === 3 ? "pop" : "left"); }
            snd[i]();
            s.say(["Fünfundzwanzig mal zwölf ist dreihundert. Zwei Kommastellen: drei Quadratmeter.", "Hundertfünfundzwanzig mal vier ist fünfhundert. Zwei Kommastellen: fünf Euro.", "Fünf mal fünf ist fünfundzwanzig. Zwei Kommastellen: null Komma zwei fünf Liter."][i]);
          }));
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Kommazahl geteilt durch Zahl",
        say: "Drei Freunde teilen sich sieben Euro fünfzig. Teile wie gewohnt. Wenn du über das Komma gehst, setzt du auch im Ergebnis ein Komma.",
        build(s) {
          const svg = s.svg(500, 200), X = 20, W = 460, cols = [RED, BLUE, GREEN];
          const whole = s.el("rect", { x: X, y: 30, width: W, height: 56, rx: 10, fill: "#f6c35b", stroke: "#b7791f", "stroke-width": 3 });
          svg.append(whole, T(s, X + W / 2, 58, "7,50 €", { size: 28, fill: "#7a3e00" }));
          const parts = cols.map((c, i) => { const g = later(fb(s.el("g"))); g.append(s.el("rect", { x: X + i * (W / 3) + 4, y: 114, width: W / 3 - 8, height: 56, rx: 10, fill: c, opacity: .85 }), T(s, X + i * (W / 3) + W / 6, 142, "2,50 €", { size: 24, fill: "#fff" })); svg.append(g); return g; });
          const L = [
            s.h("p", { class: "h2 mono" }, "7,5 : 3 = ", s.h("span", { class: "later", "data-r": 1, style: { color: U } }, "2"), s.h("span", { class: "later", "data-r": 2, style: { color: RED } }, ","), s.h("span", { class: "later", "data-r": 3, style: { color: U } }, "5")),
            later(s.h("p", { class: "t" }, s.h("b", null, "1. "), "7 : 3 = 2, Rest 1.")),
            later(s.h("p", { class: "t" }, s.h("b", null, "2. "), "Jetzt kommt das Komma → ", s.h("b", { class: "red" }, "Komma ins Ergebnis"), ".")),
            later(s.h("p", { class: "t" }, s.h("b", null, "3. "), "Rest 1 und die 5 sind 15. 15 : 3 = 5.")),
          ];
          const R = k => L[0].querySelector(`[data-r="${k}"]`);
          const more = exb(s, "Noch mehr Beispiele", { class: "ex later", style: { padding: "10px 16px" } }, s.h("div", { class: "row", style: { gap: "26px" } }, ...["4,8 : 4 = 1,2", "0,9 : 3 = 0,3", "12,6 : 6 = 2,1"].map(x => s.h("span", { class: "t mono" }, x))));
          const mk = merk(s, null, "Teile wie gewohnt. Überschreitest du das Komma, setze auch im Ergebnis das ", s.h("b", null, "Komma"), ". Probe: 2,5 · 3 = 7,5 ✓");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "500px 1fr", gap: "26px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, life(s, "Im Alltag · Geld teilen", { class: "life a-left", style: { padding: "10px 0 6px", display: "flex", flexDirection: "column", alignItems: "center" } }, svg), more),
            s.h("div", { class: "stack", style: { gap: "12px" } }, ...L, mk)));
          s.sound("coins", { vol: .5 });
          s.step(async () => { s.show(L[1], "left"); await s.wait(300); s.sfx.count(2); await s.show(R(1), "pop"); s.say("Sieben geteilt durch drei ist zwei, Rest eins."); });
          s.step(async () => { s.show(L[2], "left"); await s.wait(300); s.sfx.zap(); await s.show(R(2), "zoom"); s.say("Wir gehen über das Komma. Also kommt auch ins Ergebnis ein Komma."); });
          s.step(async () => {
            s.show(L[3], "left"); await s.wait(300); s.sfx.count(5); await s.show(R(3), "pop");
            s.sfx.whoosh(); for (const p of parts) { await s.show(p, "down"); s.sfx.coin(); }
            s.say("Fünfzehn geteilt durch drei ist fünf. Jeder bekommt zwei Euro fünfzig.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(mk, "up"); await s.show(more, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Geteilt durch eine Kommazahl",
        say: "Teilst du durch eine Kommazahl, verschiebst du bei beiden Zahlen das Komma gleich weit nach rechts. Dann rechnest du ganz normal.",
        build(s) {
          const mkPair = (a, b, k, op, res) => {
            const A = hopRow(s, Object.assign({ col: RED }, a)), B = hopRow(s, Object.assign({ col: BLUE }, b));
            const out = s.h("p", { class: "h2 mono later", style: { color: U } }, op + " = " + res);
            const card = s.h("div", { class: "card later", style: { display: "flex", flexDirection: "column", gap: "6px", padding: "10px 18px" } },
              s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "16px", alignItems: "center" } }, A.svg, s.h("span", { class: "big" }, ":"), B.svg), out);
            return { card, A, B, k, out };
          };
          const p1 = mkPair({ chars: "48", pos: 1 }, { chars: "06", pos: 1, fade: [0] }, 1, "48 : 6", "8");
          const p2 = mkPair({ chars: "240", pos: 1, ghost: [2] }, { chars: "008", pos: 1, fade: [0, 1] }, 2, "240 : 8", "30");
          const why = s.h("p", { class: "t later" }, "Beide Zahlen werden gleich stark vergrößert – das Ergebnis bleibt gleich. Wie bei Euro und Cent: 4,80 € : 0,60 € = 480 ct : 60 ct = 8.");
          const lf = life(s, "Im Alltag · Sticker", { class: "life later", style: { display: "grid", gridTemplateColumns: "1fr", gap: "6px", padding: "10px 16px" } }, s.h("p", { class: "small" }, "Du hast 4,80 €. Ein Sticker kostet 0,60 €. Wie viele Sticker kannst du kaufen?"), s.h("p", { class: "t mono", style: { fontWeight: 700, color: GREEN } }, "4,80 : 0,60 = 480 : 60 = 8 Sticker"));
          const mk = merk(s, null, "Verschiebe das Komma bei ", s.h("b", null, "beiden Zahlen gleich weit nach rechts"), ", bis du durch eine ", s.h("b", null, "ganze Zahl"), " teilst.");
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "560px 1fr", gap: "24px", alignItems: "center" },
            s.h("div", { class: "stack", style: { gap: "14px" } }, p1.card, p2.card), s.h("div", { class: "stack", style: { gap: "12px" } }, mk, why, lf)));
          s.sfx.pop();
          const run = async (p, txt) => { s.sfx.pop(); await s.show(p.card, "left"); await s.wait(300); s.say(txt); await Promise.all([p.A.hop(p.k), p.B.hop(p.k)]); s.sfx.ding(); await s.show(p.out, "pop"); };
          s.step(() => run(p1, "Vier Komma acht durch null Komma sechs. Beide Kommas eine Stelle nach rechts: achtundvierzig durch sechs, also acht."));
          s.step(async () => { s.sfx.success(); await s.show(mk, "up"); await s.show(why, "up"); });
          s.step(() => run(p2, "Zwei Komma vier durch null Komma null acht. Zwei Stellen nach rechts: zweihundertvierzig durch acht, also dreißig."));
          s.step(async () => { s.sound("cash-register", { vol: .5 }); await s.show(lf, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Einkaufen",
        say: "Auf dem Wochenmarkt steht der Preis pro Kilogramm. Für eineinhalb Kilo rechnest du eins Komma fünf mal den Kilopreis.",
        build(s) {
          const W = s.svg(300, 200), C = [150, 170], R = 120;
          W.append(s.el("path", { d: `M${C[0] - R} ${C[1]} A${R} ${R} 0 0 1 ${C[0] + R} ${C[1]}`, fill: "#fff", stroke: INK, "stroke-width": 4 }));
          for (let i = 0; i <= 8; i++) { const a = Math.PI - i * Math.PI / 8, big = i % 2 === 0; W.append(s.el("line", { x1: C[0] + (R - (big ? 18 : 10)) * Math.cos(a), y1: C[1] - (R - (big ? 18 : 10)) * Math.sin(a), x2: C[0] + R * Math.cos(a), y2: C[1] - R * Math.sin(a), stroke: INK, "stroke-width": big ? 3 : 1.5 })); if (big) W.append(T(s, C[0] + (R - 38) * Math.cos(a), C[1] - (R - 38) * Math.sin(a), String(i / 4).replace(".", ","), { size: 19 })); }
          W.append(T(s, C[0], C[1] - 24, "kg", { size: 19, fill: PEN }));
          const needle = s.el("line", { x1: C[0], y1: C[1], x2: C[0] - R + 14, y2: C[1], stroke: RED, "stroke-width": 4, "stroke-linecap": "round" });
          W.append(needle, s.el("circle", { cx: C[0], cy: C[1], r: 8, fill: INK }));
          const price = s.h("p", { class: "h2 mono", style: { color: U } }, "0,00 €");
          const left = s.h("div", { class: "stack", style: { gap: "10px", alignItems: "center" } }, s.photo("preis-pflaumen", { w: 330, h: 200, pos: "42% 50%", caption: "Pflaumen: 2,50 € pro kg" }), W, price);
          const card = (title, story, calc, extra) => { const c = s.h("div", { class: "life later", style: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: "4px" } }, s.h("span", { style: LBL }, "Im Alltag · " + title), s.h("p", { class: "small" }, story), s.h("p", { class: "t mono", style: { fontWeight: 700, color: GREEN } }, calc), extra ? s.h("p", { class: "small pencil" }, extra) : ""); return c; };
          const cards = [
            card("Wochenmarkt", "1,5 kg Pflaumen zu 2,50 € pro kg.", "1,5 · 2,50 € = 3,75 €", "Überschlag: 2 kg · 2,50 € = 5 € – etwas weniger passt."),
            card("Käsetheke", "200 g Käse = 0,2 kg. Das Kilo kostet 18 €.", "0,2 · 18 € = 3,60 €"),
            card("Grundpreis", "500 g Nudeln kosten 1,29 €. Was kostet 1 kg?", "2 · 1,29 € = 2,58 € pro kg"),
            card("Bäcker", "6 Brötchen kosten zusammen 2,40 €.", "2,40 € : 6 = 0,40 € pro Brötchen"),
          ];
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "340px 1fr", gap: "22px", alignItems: "center" }, left, s.h("div", { class: "stack", style: { gap: "10px" } }, ...cards)));
          s.sfx.pop();
          s.step(async () => {
            s.sound("paper-crumple", { vol: .4, dur: 1 });
            await s.tween({ dur: 1400, ease: "out", update: v => { const kg = 1.5 * v, a = Math.PI - kg / 2 * Math.PI; needle.setAttribute("x2", C[0] + (R - 14) * Math.cos(a)); needle.setAttribute("y2", C[1] - (R - 14) * Math.sin(a)); price.textContent = num(kg, 1) + " kg · 2,50 € = " + num(kg * 2.5) + " €"; } });
            s.sound("cash-register", { vol: .5 }); await s.show(cards[0], "left");
          });
          s.step(async () => { s.sfx.coin(); await s.show(cards[1], "left"); s.say("Zweihundert Gramm Käse: null Komma zwei mal achtzehn Euro sind drei Euro sechzig."); });
          s.step(async () => { s.sfx.coin(); await s.show(cards[2], "left"); s.say("Der Grundpreis zeigt, was ein Kilo kostet. So kannst du Packungen vergleichen."); });
          s.step(async () => { s.sfx.coin(); await s.show(cards[3], "left"); s.say("Zwei Euro vierzig geteilt durch sechs sind vierzig Cent."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Tanken und Sport",
        say: "Auch an der Tankstelle und im Stadion wird mit Kommazahlen malgenommen und geteilt.",
        build(s) {
          const pump = s.svg(280, 220);
          pump.append(s.el("rect", { x: 20, y: 10, width: 170, height: 200, rx: 16, fill: "#2a3550" }), s.el("rect", { x: 34, y: 26, width: 142, height: 120, rx: 8, fill: "#0f172a" }),
            s.el("path", { d: "M190 60 h30 q16 0 16 16 v90 q0 14 14 14", fill: "none", stroke: "#4c5566", "stroke-width": 8, "stroke-linecap": "round" }), s.el("rect", { x: 236, y: 172, width: 30, height: 18, rx: 4, fill: "#4c5566" }));
          const lit = T(s, 105, 60, "0,0 l", { size: 30, fill: "#4ade80", attrs: { "font-family": "var(--f-display)" } }), eur = T(s, 105, 112, "0,00 €", { size: 30, fill: "#facc15", attrs: { "font-family": "var(--f-display)" } });
          pump.append(lit, eur, T(s, 105, 180, "1,80 € / l", { size: 20, fill: "#fff" }));
          const fuel = life(s, "Im Alltag · Tanken", { class: "life a-left", style: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "14px", alignItems: "center", padding: "12px 16px" } }, pump,
            s.h("div", { class: "stack", style: { gap: "8px" } }, s.h("p", { class: "small" }, "Angenommen, ein Liter kostet 1,80 €. Es passen 32,5 l in den Tank."),
              later(s.h("p", { class: "t mono", style: { fontWeight: 700, color: GREEN } }, "32,5 · 1,80 € = 58,50 €")),
              later(s.h("p", { class: "small" }, "Das Auto braucht 6 l auf 100 km. Für 250 km: 2,5 · 6 l = 15 l."))));
          const clock = s.h("p", { class: "big mono", style: { color: U } }, "0,00 s");
          const sport = life(s, "Im Alltag · Sport", { class: "life later", style: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "14px", alignItems: "center", padding: "12px 16px" } },
            s.photo("olympiastadion", { w: 200, h: 170, pos: "50% 50%" }),
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "small" }, "Usain Bolt lief 2009 im Berliner Olympiastadion 100 m in 9,58 s – Weltrekord!"), clock,
              later(s.h("p", { class: "t mono", style: { fontWeight: 700, color: GREEN } }, "100 m : 9,58 s ≈ 10,4 m pro Sekunde")),
              later(s.h("p", { class: "small" }, "Leon läuft 50 m in 8,5 s. Vier Läufe dauern 4 · 8,5 s = 34 s."))));
          s.add(root(s, "stack", { justifyContent: "center", gap: "18px" }, fuel, sport));
          const fl = fuel.querySelectorAll(".later"), sp = sport.querySelectorAll("p.later");
          s.step(async () => {
            s.sound("water-pour", { vol: .35, dur: 2 });
            await s.tween({ dur: 2000, ease: "inOut", update: v => { lit.textContent = num(32.5 * v, 1) + " l"; eur.textContent = num(58.5 * v) + " €"; } });
            s.sfx.ding(); await s.show(fl[0], "up"); s.say("Zweiunddreißig Komma fünf mal eins Komma achtzig sind achtundfünfzig Euro fünfzig.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(fl[1], "up"); s.say("Zweihundertfünfzig Kilometer sind zweieinhalb mal hundert Kilometer."); });
          s.step(async () => {
            await s.show(sport, "up"); s.sound("startschuss", { vol: .4 });
            await s.tween({ dur: 1900, update: v => { clock.textContent = num(9.58 * v) + " s"; } });
            s.sound("crowd-cheer", { vol: .4, dur: 2.5 }); await s.show(sp[0], "up"); s.say("In jeder Sekunde schaffte er etwa zehn Komma vier Meter.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(sp[1], "up"); s.say("Vier mal acht Komma fünf Sekunden sind vierunddreißig Sekunden."); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Rezept umrechnen",
        say: "Das Rezept ist für vier Personen. Für mehr oder weniger Personen nimmst du alle Zutaten mit demselben Faktor mal.",
        build(s) {
          let p = 4;
          const facEl = s.h("p", { class: "h2", style: { color: U, minHeight: "40px" } });
          const fracStr = (z, n) => { const g = gcd(z, n); return [z / g, n / g]; };
          const row = (name, icon) => { const v = s.h("td", { class: "mono", style: { width: "230px", height: "56px", textAlign: "left", padding: "0 14px", fontSize: "26px" } }); const tr = s.h("tr", null, s.h("th", { style: { textAlign: "left", fontSize: "20px", color: INK, padding: "8px 14px" } }, icon + " " + name), v); tr.v = v; return tr; };
          const rM = row("Mehl", "🌾"), rL = row("Milch", "🥛"), rE = row("Eier", "🥚");
          const tab = s.h("table", { class: "tafel", style: { fontSize: "24px" } }, rM, rL, rE);
          const note = s.h("p", { class: "small", style: { minHeight: "54px", color: RED } });
          function render() {
            const [fz, fn] = fracStr(p, 4);
            facEl.innerHTML = ""; facEl.append("Faktor: ", fn === 1 ? String(fz) : F(s, fz, fn)); if (fn !== 1) facEl.append(" = " + num(p / 4).replace(/0+$/, ""));
            rM.v.textContent = s.fmt(250 * p / 4, (250 * p) % 4 ? 1 : 0) + " g";
            const [lz, ln] = fracStr(p, 8); rL.v.innerHTML = ""; rL.v.append(ln === 1 ? String(lz) : F(s, lz, ln), " l"); if (ln !== 1) rL.v.append(" = " + num(p / 8, 3).replace(/0+$/, "") + " l");
            const e = 3 * p / 4; rE.v.textContent = (Number.isInteger(e) ? String(e) : num(e).replace(/0+$/, "")) + (Number.isInteger(e) ? "" : "  → etwa " + Math.round(e));
            note.textContent = Number.isInteger(e) ? "" : "Halbe oder Viertel-Eier gibt es nicht – runde sinnvoll!";
          }
          const sl = s.slider({ label: "Personen", min: 1, max: 8, value: p, fmt: v => v + " Personen", onInput: v => { p = v; render(); } });
          render();
          const card = exb(s, "Pfannkuchen für 4 Personen", { class: "ex a-left", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "14px 18px" } },
            s.h("p", { class: "small" }, "250 g Mehl · ", F(s, 1, 2), " l Milch · 3 Eier · 1 Prise Salz"), sl, facEl, tab, note);
          const mk = merk(s, null, "Alle Zutaten mit ", s.h("b", null, "demselben Faktor"), " malnehmen: für 6 Personen ", NW(s, F(s, 6, 4), " = 1,5"), ", für 2 Personen ", NW(s, F(s, 2, 4), " = ", F(s, 1, 2)), ".");
          const ue = s.h("div", { class: "card later", style: { padding: "12px 18px" } }, s.h("p", { class: "t" }, s.h("b", null, "Kann das stimmen? "), "Für mehr Personen muss es mehr werden, für weniger Personen weniger. Und Eier zählt man ganz."));
          s.add(root(s, "", { display: "grid", gridTemplateColumns: "600px 1fr", gap: "26px", alignItems: "center" }, card, s.h("div", { class: "stack", style: { gap: "16px" } }, mk, ue)));
          s.sound("sizzle", { vol: .3, dur: 2 });
          const goP = async (to, txt) => { s.say(txt); const f = p; await s.tween({ from: f, to, dur: 300 + 200 * Math.abs(to - f), update: v => { const r = Math.round(v); if (r !== p) { p = r; sl.input.value = r; sl.querySelector(".sl-top .mono").textContent = r + " Personen"; render(); s.sfx.tick(); } } }); s.sfx.ding(); };
          s.step(() => goP(6, "Sechs Personen: Faktor eins Komma fünf. Dreihundertfünfundsiebzig Gramm Mehl, drei Viertel Liter Milch und viereinhalb Eier."));
          s.step(async () => { s.sfx.pop(); await s.show(mk, "up"); });
          s.step(() => goP(2, "Zwei Personen: Faktor ein Halb. Alles halbieren."));
          s.step(async () => { await goP(8, "Acht Personen: alles verdoppeln."); s.sfx.success(); await s.show(ue, "up"); });
        },
      },
    ],
  });
})();
