/* Kapitel 4 – Teiler und Vielfache */
(() => {
  const UC = "#c2410c", SOFT = "#fde9dc";
  const INK = "#1b2740", PEN = "#5d6678", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a",
    VIOLET = "#7b4fd6", ORANGE = "#ee7a1a", YEL = "#ffd94a", LINE = "#c8d3de";
  if (!document.getElementById("u4css")) {
    const st = document.createElement("style"); st.id = "u4css";
    st.textContent = `.fb4{transform-box:fill-box;transform-origin:center}
.u4dig{width:92px;height:96px;display:grid;place-items:center;font:800 64px/1 var(--f-display);background:#fff;border:3px solid var(--line);border-radius:16px;font-variant-numeric:tabular-nums}
.u4lamp{display:grid;grid-template-columns:44px 132px 1fr;align-items:center;gap:12px;background:#fff;border:2px solid var(--line);border-radius:14px;padding:6px 14px;min-height:62px}
.u4lamp.on{border-color:#9fd8bd;background:#eefaf3}
.u4chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.u4chip{display:inline-grid;place-items:center;min-width:46px;height:38px;padding:0 10px;border-radius:10px;background:#fff;border:2px solid var(--line);font:700 21px/1 var(--f-display);font-variant-numeric:tabular-nums}
.u4chip.hit{background:#fff3b0;border-color:#e0b400}
.u4lbl{font:700 20px/1 var(--f-display);min-width:74px}`;
    document.head.appendChild(st);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const divisors = n => { const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r; };
  const pfac = n => { const r = []; let m = n; for (let d = 2; m > 1; d++) while (m % d === 0) { r.push(d); m /= d; } return r; };
  const L = el => { el.classList.add("later", "fb4"); return el; };
  const T = (s, x, y, text, o = {}) => s.el("text", Object.assign({
    x, y, "text-anchor": o.a || "middle", "dominant-baseline": "central", "font-size": o.size || 22,
    "font-weight": o.w || 700, fill: o.fill || INK, text: String(text),
  }, o.font ? { style: { fontFamily: "var(--f-display)" } } : {}));
  const nb = t => String(t).replace(/ ([=:·+−×→]) /g, "\u00a0$1\u00a0").replace(/(\d) (cm|m|€|ct|g|kg|min|l|Tüten|Teams|Zimmer|Kartons)(?=[\s.,)!]|$)/g, "$1\u00a0$2");
  const P = (s, cls, ...kids) => s.h("p", { class: cls }, ...kids.map(k => (typeof k === "string" ? nb(k) : k)));
  const life = (s, ...kids) => s.h("div", { class: "life" }, s.h("span", { class: "exlabel" }, "Im Alltag"), ...kids);
  const supPow = (s, list) => { // [2,2,3,5] -> "2² · 3 · 5" as nodes
    const cnt = {}; list.forEach(p => (cnt[p] = (cnt[p] || 0) + 1));
    const out = []; Object.keys(cnt).map(Number).sort((a, b) => a - b).forEach((p, i) => {
      if (i) out.push(" · "); out.push(String(p)); if (cnt[p] > 1) out.push(s.h("sup", null, String(cnt[p])));
    });
    return out;
  };

  /* small drawings */
  function face(s, g) {
    g.append(s.el("circle", { r: 20, fill: "#ffd9b8", stroke: "#c98b5a", "stroke-width": 2.5 }),
      s.el("circle", { cx: -7, cy: -4, r: 2.6, fill: INK }), s.el("circle", { cx: 7, cy: -4, r: 2.6, fill: INK }),
      s.el("path", { d: "M-8 6 Q0 13 8 6", fill: "none", stroke: INK, "stroke-width": 2.4, "stroke-linecap": "round" }));
  }
  function sweet(s, color) {
    const g = s.el("g");
    g.append(s.el("polygon", { points: "-10,0 -18,-8 -18,8", fill: color, opacity: .8 }), s.el("polygon", { points: "10,0 18,-8 18,8", fill: color, opacity: .8 }),
      s.el("ellipse", { rx: 12, ry: 10, fill: color, stroke: "rgba(0,0,0,.25)", "stroke-width": 1.5 }),
      s.el("path", { d: "M-5 -4 Q0 -8 5 -4", stroke: "#fff", "stroke-width": 2, fill: "none", opacity: .7 }));
    return g;
  }
  function chair(s, color) {
    const g = s.el("g");
    g.append(s.el("rect", { x: -14, y: -12, width: 28, height: 26, rx: 6, fill: color }),
      s.el("rect", { x: -14, y: -16, width: 28, height: 8, rx: 3, fill: "rgba(0,0,0,.35)" }));
    return g;
  }
  function bus(s, color) {
    const g = s.el("g");
    g.append(s.el("rect", { x: -26, y: -15, width: 52, height: 28, rx: 7, fill: color }),
      ...[-17, -5, 7].map(x => s.el("rect", { x, y: -10, width: 9, height: 9, rx: 2, fill: "#dff1ff" })),
      s.el("rect", { x: 18, y: -10, width: 5, height: 18, rx: 1, fill: "#dff1ff" }),
      s.el("circle", { cx: -14, cy: 14, r: 5, fill: INK }), s.el("circle", { cx: 14, cy: 14, r: 5, fill: INK }));
    return g;
  }
  /* grid positions for count dots in `rows` rows; leftovers are returned separately */
  function gridPos(count, rows, cx, cy, sp) {
    const cols = Math.floor(count / rows), extra = count - rows * cols;
    const w = (cols - 1) * sp, h = (rows - 1) * sp, x0 = cx - w / 2 - (extra ? sp * 0.8 : 0), y0 = cy - h / 2;
    const pts = [];
    for (let k = 0; k < rows * cols; k++) pts.push({ x: x0 + (k % cols) * sp, y: y0 + Math.floor(k / cols) * sp, extra: false });
    for (let j = 0; j < extra; j++) pts.push({ x: x0 + w + sp * 1.6, y: y0 + j * sp, extra: true });
    return pts;
  }

  Deck.unit({
    id: "u4", num: 4, title: "Teiler und Vielfache", color: UC, soft: SOFT,
    subtitle: "Gerecht teilen, Muster finden, Primzahlen jagen",
    blurb: "Teilbarkeitsregeln, Primzahlen, ggT und kgV – mit Bussen und Rhythmen.",
    goals: ["Teiler und Vielfache finden (T(12), V(4))", "Teilbarkeitsregeln für 2, 3, 4, 5, 6, 9, 10 verstehen", "Primzahlen mit dem Sieb entdecken", "Zahlen in Primfaktoren zerlegen", "ggT und kgV im Alltag benutzen"],
    icon(svg, el) {
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) svg.append(el("circle", { cx: 14 + c * 14, cy: 21 + r * 14, r: 5.5, fill: (r + c) % 2 ? "#c2410c" : "#f59e6b" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Gerecht teilen",
        say: "Zwölf Bonbons sollen gerecht verteilt werden. Wenn nichts übrig bleibt, ist die Zahl der Kinder ein Teiler von zwölf.",
        build(s) {
          const svg = s.svg(540, 560);
          const cols = ["#e8453c", "#f2a33a", "#3aa76d", "#3b82f6", "#a855f7", "#ec4899"];
          const heads = s.el("g");
          svg.append(s.el("rect", { x: 4, y: 470, width: 532, height: 72, rx: 16, fill: "#fff", stroke: LINE, "stroke-width": 2, "stroke-dasharray": "8 6" }),
            T(s, 44, 506, "Rest", { size: 20, fill: PEN }), heads);
          const sw = [];
          for (let k = 0; k < 12; k++) { const g = sweet(s, cols[k % 6]); svg.append(g); sw.push({ g, x: 100 + k * 36, y: 40 }); g.setAttribute("transform", `translate(${100 + k * 36} 40)`); }
          const who = P(s, "h2", "1 Kind"), res = P(s, "t", "Ein Kind bekommt alle 12 Bonbons."), note = s.h("p", { class: "huge mono", style: { color: UC } }, "");
          const setNote = (n, ok) => {
            note.innerHTML = ""; note.style.color = ok ? GREEN : RED;
            const bar = s.h("span", { style: { position: "relative", display: "inline-block", margin: "0 .18em" } }, "|");
            if (!ok) bar.append(s.h("span", { style: { position: "absolute", left: "-0.18em", top: "45%", width: "0.6em", height: "0.09em", background: RED, transform: "rotate(-35deg)", borderRadius: "4px" } }));
            note.append(String(n) + " ", bar, " 12");
          };
          let gen = 0;
          const place = n => {
            const my = ++gen;
            const q = Math.floor(12 / n), r = 12 % n, rowH = Math.min(84, 440 / n), sc = Math.min(1.25, (rowH / 2 - 2) / 20);
            heads.innerHTML = "";
            for (let i = 0; i < n; i++) { const g = s.el("g", { transform: `translate(34 ${10 + rowH * i + rowH / 2}) scale(${sc})` }); face(s, g); heads.append(g); }
            sw.forEach((o, k) => {
              let tx, ty;
              if (k < q * n) { tx = 100 + Math.floor(k / n) * 36; ty = 10 + rowH * (k % n) + rowH / 2; } else { tx = 100 + (k - q * n) * 36; ty = 506; }
              const fx = o.x, fy = o.y; o.x = tx; o.y = ty;
              s.tween({ dur: 450, delay: k * 40, ease: "out", update: (v, t) => { if (my !== gen) return; o.g.setAttribute("transform", `translate(${lerp(fx, tx, v)} ${lerp(fy, ty, v) - Math.sin(Math.PI * t) * 26})`); } })
                .then(() => { if (my === gen && s.alive) s.sfx.tone(700 + k * 40, 0.05, "triangle", 0.12); });
            });
            who.textContent = n === 1 ? "1 Kind" : n + " Kinder";
            if (r === 0) {
              res.textContent = `Jedes Kind bekommt ${q}. Nichts bleibt übrig – ${n} ist ein Teiler von 12.`;
              setNote(n, true);
            } else {
              res.textContent = `Jedes Kind bekommt ${q}, aber ${r} ${r === 1 ? "bleibt" : "bleiben"} übrig – ${n} ist kein Teiler von 12.`;
              setNote(n, false);
            }
          };
          place(1);
          const sl = s.slider({ label: "Anzahl Kinder", min: 1, max: 12, value: 1, onInput: v => place(v) });
          sl.classList.add("later");
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "t ist ein Teiler von n"), ", wenn n : t ohne Rest aufgeht. Man schreibt ", s.h("b", null, "3 | 12"), " (lies: „3 teilt 12“).");
          const right = s.h("div", { class: "stack" }, P(s, "big", "12 Bonbons für …"),
            s.h("div", { class: "card stack", style: { gap: "8px" } }, who, res, note), merk, sl);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%" } }, svg, right));
          s.show(svg, "zoom"); s.sound("bonbonpapier", { vol: .5 });
          s.step(async () => { sl.set(3); s.sfx.whoosh(); await s.wait(900); s.sfx.ding(); s.say("Drei Kinder bekommen je vier. Drei ist ein Teiler von zwölf."); });
          s.step(async () => { sl.set(5); s.sfx.whoosh(); await s.wait(900); s.sfx.error(); s.say("Bei fünf Kindern bleiben zwei übrig. Fünf ist kein Teiler von zwölf."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(sl, "up"); s.say("Probiere jetzt selbst mit dem Regler."); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Stühle in Reihen",
        say: "Zwölf Stühle sollen in gleich langen Reihen stehen. Jedes Rechteck zeigt uns zwei Teiler.",
        build(s) {
          const svg = s.svg(600, 560);
          const scatter = [[60, 60], [150, 120], [250, 40], [345, 100], [455, 50], [540, 130], [90, 210], [200, 250], [300, 180], [405, 235], [510, 255], [150, 40]];
          const chs = scatter.map(([x, y]) => { const g = chair(s, UC); g.setAttribute("transform", `translate(${x} ${y})`); svg.append(g); return { g, x, y }; });
          const label = T(s, 300, 322, "12 Stühle – wie stellen wir sie auf?", { size: 24 });
          svg.append(label);
          const nums = [1, 2, 3, 4, 6, 12], nx = i => 60 + i * 96;
          const pairs = [[1, 12], [2, 6], [3, 4]];
          const arcs = {}, circ = {};
          pairs.forEach(([a, b], i) => {
            const x1 = nx(nums.indexOf(a)), x2 = nx(nums.indexOf(b)), sp = x2 - x1;
            const p = s.el("path", { d: `M${x1} 478 Q${(x1 + x2) / 2} ${478 - sp * 0.5} ${x2} 478`, fill: "none", stroke: [VIOLET, BLUE, GREEN][i], "stroke-width": 5, "stroke-linecap": "round", class: "later" });
            svg.append(p); arcs[a] = p;
          });
          nums.forEach((v, i) => {
            const g = L(s.el("g"));
            g.append(s.el("circle", { cx: nx(i), cy: 502, r: 24, fill: SOFT, stroke: UC, "stroke-width": 3 }), T(s, nx(i), 503, v, { size: 24, font: 1 }));
            svg.append(g); circ[v] = g;
          });
          const cap = L(T(s, 300, 546, "Teiler-Paare: 1 · 12, 2 · 6, 3 · 4", { size: 20, fill: PEN }));
          svg.append(cap);
          const arrange = async (rows, txt, bad) => {
            const pts = gridPos(12, rows, 300, 160, 46);
            s.sound("stuhl-ruecken", { vol: .6 });
            label.textContent = txt;
            await Promise.all(chs.map((c, k) => {
              const fx = c.x, fy = c.y, t = pts[k]; c.x = t.x; c.y = t.y;
              c.g.firstChild.setAttribute("fill", t.extra ? RED : UC);
              return s.tween({ dur: 650, delay: k * 25, update: v => c.g.setAttribute("transform", `translate(${lerp(fx, t.x, v)} ${lerp(fy, t.y, v)})`) });
            }));
            if (bad) s.sfx.error(); else s.sfx.snap();
          };
          const chips = nums.map(v => s.h("span", { class: "u4chip later" }, String(v)));
          const found = async (a, b) => {
            s.sfx.ding(); s.show([chips[nums.indexOf(a)], chips[nums.indexOf(b)]], "pop");
            s.show([circ[a], circ[b]], "pop"); await s.show(arcs[a], "draw");
          };
          const merk = s.h("div", { class: "merk later" }, "Alle Teiler zusammen: ", s.h("b", null, "T(12) = {1, 2, 3, 4, 6, 12}"), ". Teiler kommen immer als ", s.h("b", null, "Paare"), ".");
          const lf = life(s, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } },
            s.photo("eierkarton-10", { w: 170, h: 128, style: { flex: "none" } }),
            P(s, "small", "Eierkarton: 2 · 5 = 10 Eier. Muffinblech: 3 · 4 = 12 Mulden. Klassenfoto: 24 Kinder in 3 Reihen zu je 8.")));
          lf.classList.add("later");
          const right = s.h("div", { class: "stack" },
            P(s, "t", "Für das Konzert der Instrumentalklasse sollen 12 Stühle in gleich langen Reihen stehen."),
            s.h("div", { class: "card stack", style: { gap: "10px" } }, P(s, "t", s.h("b", null, "Teiler von 12:")), s.h("div", { class: "u4chips" }, chips)),
            merk, lf);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center", height: "100%" } }, svg, right));
          s.sfx.pop();
          s.step(async () => { await arrange(2, "2 Reihen mit je 6 Stühlen: 2 · 6 = 12"); await found(2, 6); });
          s.step(async () => { await arrange(3, "3 Reihen mit je 4 Stühlen: 3 · 4 = 12"); await found(3, 4); });
          s.step(async () => { await arrange(1, "1 Reihe mit 12 Stühlen: 1 · 12 = 12"); await found(1, 12); });
          s.step(async () => { await arrange(5, "5 Reihen? 2 Stühle bleiben übrig!", true); s.say("Fünf Reihen gehen nicht. Fünf ist kein Teiler von zwölf."); });
          s.step(async () => { await arrange(4, "4 · 3 und 6 · 2: nur gedreht!"); s.show(cap, "fade"); s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Teiler-Entdecker",
        say: "Schiebe den Regler. Für jede Zahl siehst du alle Rechtecke aus Punkten – und damit alle Teiler.",
        build(s) {
          const CW = 690, CH = 600;
          const { canvas, g } = s.canvas(CW, CH);
          const pal = [UC, BLUE, GREEN, VIOLET, ORANGE, "#db2777", "#0891b2", "#65a30d", "#9333ea"];
          let n = 12, prog = 1, gen = 0;
          const draw = () => {
            g.clearRect(0, 0, CW, CH);
            const ds = divisors(n), pairs = ds.filter(d => d * d <= n).map(a => [a, n / a]);
            const sumA = pairs.reduce((t, p) => t + p[0], 0), gap = 22;
            const d = Math.min(32, 540 / n, (CH - 30 - gap * (pairs.length - 1)) / sumA);
            let y = (CH - (sumA * d + gap * (pairs.length - 1))) / 2;
            pairs.forEach(([a, b], i) => {
              const tot = a * b, show = Math.round(prog * tot);
              g.fillStyle = INK; g.font = "700 22px 'Bricolage Grotesque', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
              g.fillText(`${a} × ${b}`, 62, y + (a * d) / 2);
              g.fillStyle = pal[i % pal.length];
              for (let k = 0; k < show; k++) {
                const r = Math.floor(k / b), c = k % b;
                g.beginPath(); g.arc(130 + c * d + d / 2, y + r * d + d / 2, Math.max(2, d * 0.38), 0, Math.PI * 2); g.fill();
              }
              y += a * d + gap;
            });
          };
          const big = s.h("p", { class: "huge mono", style: { color: UC } }, "12");
          const set = s.h("p", { class: "h2" }, "");
          const info = P(s, "t", "");
          const upd = v => {
            n = v; const my = ++gen; const ds = divisors(n);
            big.textContent = String(n);
            set.textContent = `T(${n}) = {${ds.join(", ")}}`;
            const sq = Math.round(Math.sqrt(n));
            if (n === 1) info.textContent = "Die 1 hat nur einen einzigen Teiler.";
            else if (isPrime(n)) info.textContent = `Nur 1 Reihe möglich! ${n} hat genau 2 Teiler: 1 und ${n}.`;
            else if (sq * sq === n) info.textContent = `${sq} × ${sq} ist ein Quadrat – darum ist die Anzahl der Teiler ungerade (${ds.length}).`;
            else info.textContent = `${ds.length / 2} Rechtecke → ${ds.length} Teiler.`;
            s.tween({ dur: 500, update: x => { if (my !== gen) return; prog = x; draw(); } });
            if (isPrime(n)) s.sfx.boing(); else s.sfx.pop();
          };
          upd(12);
          const sl = s.slider({ label: "Zahl n", min: 1, max: 36, value: 12, onInput: upd });
          const right = s.h("div", { class: "stack", style: { gap: "18px" } }, P(s, "t", "Punkte zum Rechteck legen:"), big, set,
            s.h("div", { class: "card soft", style: { minHeight: "140px" } }, info), sl);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: `${CW}px 1fr`, alignItems: "center", height: "100%" } }, canvas, right));
          s.step(async () => { sl.set(7); s.say("Sieben Punkte passen nur in eine einzige Reihe."); });
          s.step(async () => { sl.set(36); s.say("Sechsunddreißig hat viele Rechtecke, eins davon ist ein Quadrat."); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Vielfache: immer weiter hüpfen",
        say: "Der Frosch hüpft immer vier Felder weit. Wo er landet, sind die Vielfachen von vier.",
        build(s) {
          const svg = s.svg(1100, 236);
          const X = v => 40 + v * 25.5, Y = 150;
          svg.append(s.el("line", { x1: 30, y1: Y, x2: 1072, y2: Y, stroke: INK, "stroke-width": 3 }));
          for (let v = 0; v <= 40; v++) svg.append(s.el("line", { x1: X(v), y1: Y - (v % 4 ? 6 : 11), x2: X(v), y2: Y + (v % 4 ? 6 : 11), stroke: INK, "stroke-width": v % 4 ? 1.5 : 3 }));
          svg.append(T(s, X(0), 180, "0", { size: 20 }));
          const labels = [], hops = [];
          for (let k = 1; k <= 10; k++) {
            labels.push(L(T(s, X(4 * k), 180, 4 * k, { size: 21, fill: UC })));
            hops.push(s.el("path", { d: `M${X(4 * k - 4)} ${Y - 14} Q${X(4 * k - 2)} ${Y - 110} ${X(4 * k)} ${Y - 14}`, fill: "none", stroke: UC, "stroke-width": 2.5, "stroke-dasharray": "6 6", class: "later", opacity: .6 }));
          }
          svg.append(...hops, ...labels);
          const frog = s.el("g", { transform: `translate(${X(0)} ${Y - 18})` });
          frog.append(s.el("ellipse", { rx: 22, ry: 15, fill: "#4caf50", stroke: "#2e7d32", "stroke-width": 2 }),
            s.el("circle", { cx: -9, cy: -13, r: 7, fill: "#fff", stroke: "#2e7d32", "stroke-width": 2 }), s.el("circle", { cx: 9, cy: -13, r: 7, fill: "#fff", stroke: "#2e7d32", "stroke-width": 2 }),
            s.el("circle", { cx: -9, cy: -13, r: 3, fill: INK }), s.el("circle", { cx: 9, cy: -13, r: 3, fill: INK }),
            s.el("path", { d: "M-9 3 Q0 9 9 3", stroke: "#1b5e20", "stroke-width": 2.5, fill: "none", "stroke-linecap": "round" }));
          svg.append(frog);
          const vtxt = L(T(s, 550, 216, "V(4) = {4, 8, 12, 16, 20, 24, 28, 32, 36, 40, …}", { size: 25, fill: UC, font: 1 }));
          svg.append(vtxt);
          const PC = { w: 140, h: 132, style: { flex: "none" } };
          const egg = s.photo("eierkarton-6", Object.assign({ pos: "50% 55%" }, PC));
          const clock = s.photo("uhr-rohrdamm", Object.assign({ pos: "50% 38%", }, PC));
          const team = s.photo("fussballteam", Object.assign({ pos: "50% 45%" }, PC));
          const card = (svgE, txt) => { const c = life(s, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "12px", alignItems: "center" } }, svgE, P(s, "small", txt))); c.classList.add("later"); c.style.minWidth = "0"; return c; };
          const cards = [card(egg, "6 Eier pro Karton: 6, 12, 18, 24, … – Vielfache von 6."),
            card(clock, "Der Minutenzeiger zeigt auf eine Zahl alle 5 Minuten: 5, 10, 15, … – V(5)."),
            card(team, "Ein Fußballteam hat 11 Spieler: 11, 22, 33, … Spieler – V(11).")];
          const merk = s.h("div", { class: "merk later" }, "4 ist Teiler von 12 ", s.h("b", null, "⇔"), " 12 ist ein Vielfaches von 4. Jede Zahl hat ", s.h("b", null, "unendlich viele"), " Vielfache, aber nur endlich viele Teiler.");
          s.add(s.h("div", { class: "stack" }, svg, s.h("div", { class: "cols3" }, cards), merk));
          s.sfx.pop();
          s.step(async () => {
            for (let k = 1; k <= 10; k++) {
              if (!s.alive) return;
              s.show(hops[k - 1], "draw");
              const x1 = X(4 * k - 4), x2 = X(4 * k);
              if (k === 1 || k === 10) s.sound("frosch", { vol: .6 }); else s.sfx.boing();
              await s.tween({ dur: 330, ease: "linear", update: v => frog.setAttribute("transform", `translate(${lerp(x1, x2, v)} ${Y - 18 - Math.sin(Math.PI * v) * 92})`) });
              s.sfx.count(k - 1); s.show(labels[k - 1], "pop");
            }
          });
          s.step(async () => { s.sfx.ding(); await s.show(vtxt, "up"); s.say("Die Vielfachen von vier: vier, acht, zwölf und immer so weiter."); });
          s.step(async () => { s.sound("clock-tick", { vol: .45, dur: 2 }); await s.show(cards, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Endstellen: durch 2, 5 und 10",
        say: "Jeder Zehner lässt sich durch 2, 5 und 10 teilen. Darum entscheidet nur die letzte Ziffer.",
        build(s) {
          const svg = s.svg(520, 560);
          const dx = i => 40 + i * 44;
          svg.append(T(s, 236, 34, "1 Zehner = 10 Einer", { size: 24, font: 1 }));
          for (let i = 0; i < 10; i++) svg.append(s.el("circle", { cx: dx(i), cy: 82, r: 15, fill: BLUE }));
          const br = (a, b, y, col) => s.el("path", { d: `M${dx(a) - 15} ${y - 8} v8 H${dx(b) + 15} v-8`, fill: "none", stroke: col, "stroke-width": 3.5, "stroke-linejoin": "round", class: "later" });
          const b2 = [0, 1, 2, 3, 4].map(k => br(2 * k, 2 * k + 1, 116, ORANGE)), l2 = L(T(s, 466, 116, "5 · 2", { size: 22, fill: ORANGE, a: "start" }));
          const b5 = [br(0, 4, 158, GREEN), br(5, 9, 158, GREEN)], l5 = L(T(s, 466, 158, "2 · 5", { size: 22, fill: GREEN, a: "start" }));
          const b10 = [br(0, 9, 200, VIOLET)], l10 = L(T(s, 462, 200, "1 · 10", { size: 22, fill: VIOLET, a: "start" }));
          const sum = L(T(s, 260, 246, "Jeder Zehner geht durch 2, 5 und 10 auf!", { size: 22, fill: INK }));
          svg.append(...b2, l2, ...b5, l5, ...b10, l10, sum);
          const num = L(s.el("g"));
          [["3", 40], ["4", 120], ["7", 200], ["5", 330]].forEach(([d, x], i) => num.append(s.el("rect", { x, y: 296, width: 70, height: 82, rx: 12, fill: i === 3 ? "#fff3b0" : "#fff", stroke: i === 3 ? "#e0b400" : LINE, "stroke-width": 3 }), T(s, x + 35, 338, d, { size: 50, font: 1 })));
          num.append(s.el("path", { d: "M40 392 v8 H270 v-8", fill: "none", stroke: PEN, "stroke-width": 3 }));
          num.append(T(s, 155, 422, "347 Zehner: gehen auf", { size: 20, fill: PEN }), T(s, 365, 460, "5 Einer: entscheiden!", { size: 20, fill: RED }));
          const verdict = L(T(s, 260, 522, "3475: durch 5 ja – durch 2 und 10 nein.", { size: 22, fill: UC }));
          svg.append(num, verdict);
          const rule = (n, txt) => s.h("p", { class: "t" }, s.h("b", { style: { color: UC } }, `durch ${n}: `), txt);
          const merk = s.h("div", { class: "merk later stack", style: { gap: "6px" } }, rule(2, "letzte Ziffer 0, 2, 4, 6 oder 8"), rule(5, "letzte Ziffer 0 oder 5"), rule(10, "letzte Ziffer 0"));
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            P(s, "small", "Bezahlen nur mit 5-Cent-Münzen: 85 ct geht, 72 ct geht nicht."),
            P(s, "small", "Partnerübung im Sport: 27 Kinder → einer bleibt ohne Partner (7 ist ungerade)."),
            P(s, "small", "Nur mit 10-€-Scheinen: 340 € geht genau, 345 € nicht.")));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { for (let k = 0; k < 5; k++) { s.sfx.count(k); s.show(b2[k], "draw"); await s.wait(230); } await s.wait(600); s.show(l2, "pop"); });
          s.step(async () => { s.sfx.count(4); await s.show(b5, "draw"); s.sfx.count(6); s.show(l5, "pop"); });
          s.step(async () => { s.sfx.count(7); await s.show(b10, "draw"); s.show(l10, "pop"); s.sfx.ding(); await s.show(sum, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(num, "up"); s.sfx.ding(); await s.show(verdict, "pop"); s.say("Bei 3475 entscheidet nur die 5 am Ende."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("coins", { vol: .6 }); await s.show(lf, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Durch 4 – und Schaltjahre",
        say: "Hundert ist fünfundzwanzig mal vier. Darum zählen bei der Vierer-Regel nur die letzten zwei Ziffern.",
        build(s) {
          const svg = s.svg(420, 560);
          svg.append(T(s, 210, 24, "100 Einer", { size: 24, font: 1 }));
          const dots = [];
          for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) { const d = s.el("circle", { cx: 39 + c * 38, cy: 62 + r * 38, r: 13, fill: "#d9dee5" }); dots.push({ d, gi: Math.floor(r / 2) * 5 + Math.floor(c / 2), par: (Math.floor(r / 2) + Math.floor(c / 2)) % 2 }); svg.append(d); }
          const t1 = L(T(s, 210, 470, "100 = 25 · 4", { size: 34, fill: UC, font: 1 }));
          const t2 = L(T(s, 210, 516, "Hunderter gehen immer durch 4 auf.", { size: 21 }));
          svg.append(t1, t2);
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Durch 4 teilbar"), ", wenn die Zahl aus den ", s.h("b", null, "letzten zwei Ziffern"), " durch 4 teilbar ist. 2028 → 28 : 4 = 7, also ja!");
          const yr = s.h("span", { class: "huge mono" }, "20", s.h("span", { class: "hl" }, "28"));
          const verdict = P(s, "t", "");
          const cal = s.svg(220, 166);
          const cells = [];
          for (let i = 0; i < 29; i++) { const r = s.el("rect", { x: 4 + (i % 7) * 30, y: 4 + Math.floor(i / 7) * 32, width: 26, height: 28, rx: 5, fill: "#fff", stroke: LINE, "stroke-width": 2 }); cal.append(r); cells.push(r); }
          const t29 = T(s, 4 + 13, 4 + 4 * 32 + 14, "29", { size: 19, fill: "#fff" });
          cal.append(t29);
          const updY = y => {
            const lt = y % 100, leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
            yr.innerHTML = ""; yr.append(String(Math.floor(y / 100)), s.h("span", { class: "hl" }, String(lt).padStart(2, "0")));
            verdict.textContent = leap ? `${lt} : 4 = ${lt / 4} → Schaltjahr! Der Februar hat 29 Tage.` : `${lt} : 4 geht nicht auf → kein Schaltjahr, nur 28 Tage.`;
            cells.forEach((c, i) => c.setAttribute("fill", i === 28 ? (leap ? UC : "none") : "#fff"));
            cells[28].setAttribute("stroke", leap ? UC : "none");
            t29.style.visibility = leap ? "visible" : "hidden";
            if (leap) s.sfx.ding();
          };
          updY(2028);
          const sl = s.slider({ label: "Jahr", min: 2020, max: 2040, value: 2028, fmt: v => String(v), onInput: updY });
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "10px" } }, P(s, "t", s.h("b", null, "Schaltjahre"), " sind die Jahre, die durch 4 teilbar sind."), sl,
            s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px", alignItems: "center" } }, s.h("div", { class: "stack", style: { gap: "6px" } }, yr, verdict), cal),
            P(s, "small", "Ausnahme: volle Hunderter nur, wenn durch 400 teilbar. 2000 war ein Schaltjahr, 2100 wird keins.")));
          lf.classList.add("later");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "420px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, merk, lf)));
          s.sfx.pop();
          s.step(async () => {
            for (let gi = 0; gi < 25; gi++) {
              dots.filter(o => o.gi === gi).forEach(o => o.d.setAttribute("fill", o.par ? "#f59e6b" : UC));
              s.sfx.tick(); await s.wait(45);
            }
            s.sfx.ding(); await s.show(t1, "pop"); await s.show(t2, "fade");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(lf, "up"); s.say("Schiebe durch die Jahre. Wann hat der Februar 29 Tage?"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Quersumme: durch 3 und 9",
        say: "Die Quersumme ist die Summe aller Ziffern. Ist sie durch drei oder neun teilbar, dann auch die Zahl.",
        build(s) {
          const top = s.svg(1100, 150);
          const digs = ["4", "5", "1", "8"];
          digs.forEach((d, i) => top.append(s.el("rect", { x: 40 + i * 80, y: 22, width: 70, height: 82, rx: 12, fill: "#fff", stroke: UC, "stroke-width": 3 }), T(s, 75 + i * 80, 64, d, { size: 50, font: 1 })));
          const tx = [470, 560, 650, 740], movers = digs.map((d, i) => { const t = T(s, 75 + i * 80, 64, d, { size: 50, fill: UC, font: 1 }); t.classList.add("later"); top.append(t); return t; });
          const pluses = [515, 605, 695].map(x => L(T(s, x, 64, "+", { size: 44, fill: PEN })));
          const eq = L(T(s, 800, 64, "=", { size: 44, fill: PEN })), res = L(T(s, 870, 64, "18", { size: 54, fill: UC, font: 1 }));
          top.append(...pluses, eq, res);
          const concl = L(T(s, 690, 132, "18 ist durch 9 teilbar → 4518 auch! (4518 : 9 = 502)", { size: 23, fill: GREEN }));
          top.append(concl);
          const mid = s.svg(1100, 300);
          mid.append(T(s, 10, 18, "Warum? Beispiel 234", { size: 24, a: "start", font: 1 }));
          const extras = [];
          const blk = L(s.el("g"));
          [20, 160].forEach(ox => { for (let k = 0; k < 100; k++) { const last = k === 99; const c = s.el("circle", { cx: ox + 6 + (k % 10) * 12, cy: 56 + Math.floor(k / 10) * 12, r: last ? 5.5 : 4.5, fill: "#9db7e8" }); blk.append(c); if (last) extras.push(c); } });
          [300, 325, 350].forEach(ox => { for (let k = 0; k < 10; k++) { const last = k === 9; const c = s.el("circle", { cx: ox, cy: 56 + k * 12, r: last ? 5.5 : 4.5, fill: "#9db7e8" }); blk.append(c); if (last) extras.push(c); } });
          [0, 1, 2, 3].forEach(k => { const c = s.el("circle", { cx: 450, cy: 74 + k * 18, r: 5.5, fill: "#9db7e8" }); blk.append(c); extras.push(c); });
          blk.append(T(s, 150, 196, "2 Hunderter", { size: 21 }), T(s, 325, 196, "3 Zehner", { size: 21 }), T(s, 450, 196, "4 Einer", { size: 21 }));
          const sub = L(s.el("g"));
          sub.append(T(s, 150, 228, "je 99 + 1", { size: 20, fill: BLUE }), T(s, 325, 228, "je 9 + 1", { size: 20, fill: BLUE }), T(s, 450, 228, "4", { size: 20, fill: ORANGE }));
          mid.append(blk, sub);
          const pileT = L(T(s, 640, 40, "Übrig, wenn man Neuner wegnimmt:", { size: 21, a: "start" }));
          const flyers = extras.map(c => { const f = s.el("circle", { cx: c.getAttribute("cx"), cy: c.getAttribute("cy"), r: 11, fill: ORANGE, class: "later" }); return f; });
          const p1 = L(T(s, 850, 160, "2 + 3 + 4 = 9 – genau die Quersumme!", { size: 24, fill: ORANGE }));
          const p2 = L(T(s, 850, 204, "99 und 9 sind sowieso durch 9 teilbar.", { size: 20, fill: PEN }));
          const p3 = L(T(s, 850, 248, "9 ist durch 9 teilbar → 234 auch (234 : 9 = 26).", { size: 20, fill: GREEN }));
          mid.append(pileT, ...flyers, p1, p2, p3);
          const merk = s.h("div", { class: "merk later" }, "Eine Zahl ist ", s.h("b", null, "durch 3 teilbar"), ", wenn ihre Quersumme durch 3 teilbar ist. Genauso für ", s.h("b", null, "9"), ".");
          s.add(s.h("div", { class: "stack" }, top, mid, merk));
          s.sfx.pop();
          s.step(async () => {
            for (let i = 0; i < 4; i++) {
              const t = movers[i], fx = 75 + i * 80; t.classList.remove("later");
              s.sfx.zap();
              await s.tween({ dur: 450, update: v => t.setAttribute("x", lerp(fx, tx[i], v)) });
              s.sfx.count(i * 2);
              if (i < 3) s.show(pluses[i], "pop");
            }
            await s.show(eq, "pop");
            for (let v = 0; v <= 18; v += 3) { res.textContent = String(v); if (v === 0) res.classList.remove("later"); s.sfx.tick(); await s.wait(60); }
            res.textContent = "18"; s.sfx.ding();
          });
          s.step(async () => { s.sfx.success(); await s.show(concl, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(blk, "fade"); await s.show(sub, "up"); s.say("Jeder Hunderter ist 99 plus 1. Jeder Zehner ist 9 plus 1."); });
          s.step(async () => {
            extras.forEach(c => c.setAttribute("fill", ORANGE));
            s.sfx.pop(); await s.show(pileT, "fade");
            for (let i = 0; i < flyers.length; i++) {
              const f = flyers[i], fx = +f.getAttribute("cx"), fy = +f.getAttribute("cy"), txx = 668 + i * 44, tyy = 100;
              f.classList.remove("later"); s.sfx.count(i);
              await s.tween({ dur: 260, update: v => { f.setAttribute("cx", lerp(fx, txx, v)); f.setAttribute("cy", lerp(fy, tyy, v) - Math.sin(Math.PI * v) * 40); } });
            }
            s.sfx.ding(); await s.show(p1, "up"); await s.show(p2, "up"); await s.show(p3, "up");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Durch 6: zwei Türsteher",
        say: "Durch sechs teilbar heißt: durch zwei und durch drei teilbar. Die Zahl muss an beiden Türstehern vorbei.",
        build(s) {
          const svg = s.svg(1100, 232);
          svg.append(s.el("rect", { x: 0, y: 150, width: 1100, height: 10, rx: 5, fill: "#e5e7eb" }));
          const gate = (x, txt) => {
            const g = s.el("g");
            g.append(s.el("rect", { x: x - 78, y: 54, width: 14, height: 106, rx: 4, fill: PEN }), s.el("rect", { x: x + 64, y: 54, width: 14, height: 106, rx: 4, fill: PEN }),
              s.el("rect", { x: x - 84, y: 16, width: 168, height: 40, rx: 10, fill: YEL, stroke: "#c9a400", "stroke-width": 2 }), T(s, x, 37, txt, { size: 23 }));
            return g;
          };
          svg.append(gate(380, "durch 2?"), gate(720, "durch 3?"));
          const c1 = L(T(s, 380, 200, "letzte Ziffer 4 → ja", { size: 21, fill: GREEN }));
          const c2 = L(T(s, 720, 200, "4 + 7 + 4 = 15 → ja", { size: 21, fill: GREEN }));
          const fin = L(T(s, 990, 40, "durch 6 teilbar!", { size: 24, fill: GREEN, font: 1 }));
          svg.append(c1, c2, fin);
          const tok = s.el("g", { transform: "translate(90 120)" });
          const tokR = s.el("rect", { x: -58, y: -26, width: 116, height: 52, rx: 14, fill: UC });
          tok.append(tokR, T(s, 0, 1, "474", { size: 32, fill: "#fff", font: 1 }));
          svg.append(tok);
          let tx = 90;
          const move = async to => { const f = tx; tx = to; s.sfx.whoosh(); await s.tween({ dur: 800, update: v => tok.setAttribute("transform", `translate(${lerp(f, to, v)} ${120 - Math.abs(Math.sin(v * Math.PI * 3)) * 8})`) }); };
          const merk = s.h("div", { class: "merk later" }, "Eine Zahl ist ", s.h("b", null, "durch 6 teilbar"), ", wenn sie durch 2 ", s.h("b", null, "und"), " durch 3 teilbar ist (6 = 2 · 3).");
          const card = (title, txt) => { const c = life(s, P(s, "t", s.h("b", null, title)), P(s, "small", txt)); c.classList.add("later"); return c; };
          const cards = [card("Eierkartons (6er)", "474 Eier sind gerade und haben die Quersumme 15. Also passen sie genau: 474 : 6 = 79 Kartons."),
            card("Sportfest (9er-Teams)", "135 Kinder: Quersumme 1 + 3 + 5 = 9. Also klappt es: 135 : 9 = 15 Teams."),
            card("Klassenfahrt (4er-Zimmer)", "84 Kinder: 84 ist durch 4 teilbar. 84 : 4 = 21 Zimmer – niemand schläft allein.")];
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, svg, merk, s.h("div", { class: "cols3" }, cards)));
          s.sfx.pop();
          s.step(async () => { await move(380); s.sfx.ding(); await s.show(c1, "up"); });
          s.step(async () => { await move(720); s.sfx.ding(); await s.show(c2, "up"); });
          s.step(async () => { await move(990); tokR.setAttribute("fill", GREEN); s.sfx.success(); await s.show(fin, "pop"); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("kids-cheer", { vol: .4, dur: 2.5 }); await s.show(cards, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Teilbarkeits-Detektiv",
        say: "Stell mit den Pfeilen eine Zahl ein. Die Lämpchen zeigen, durch welche Zahlen sie teilbar ist und warum.",
        build(s) {
          const digits = [1, 2, 3, 4];
          const boxes = digits.map(() => s.h("div", { class: "u4dig" }, "0"));
          const qs = P(s, "t", ""), l2 = P(s, "t", "");
          const rules = [2, 3, 4, 5, 6, 9, 10];
          const lamps = rules.map(r => {
            const sv = s.svg(36, 36); const c = s.el("circle", { cx: 18, cy: 18, r: 15, fill: "#d9dee5", stroke: "#aab3c0", "stroke-width": 2 }); sv.append(c);
            const why = P(s, "small", "");
            const row = s.h("div", { class: "u4lamp" }, sv, s.h("b", { class: "h2", style: { fontSize: "26px" } }, `durch ${r}`), why);
            return { r, c, why, row, on: false };
          });
          const update = (sound = true) => {
            const n = digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
            digits.forEach((d, i) => (boxes[i].textContent = String(d)));
            const q = digits.reduce((a, b) => a + b, 0), last = digits[3], two = digits[2] * 10 + digits[3];
            qs.innerHTML = ""; qs.append("Quersumme: ", s.h("b", null, `${digits.join(" + ")} = ${q}`));
            l2.innerHTML = ""; l2.append("Letzte Ziffer: ", s.h("b", null, String(last)), " · letzte zwei: ", s.h("b", null, String(two)));
            let k = 0;
            lamps.forEach(L2 => {
              const ok = n % L2.r === 0, r = L2.r;
              let w;
              if (r === 2) w = ok ? `letzte Ziffer ${last} ist gerade` : `letzte Ziffer ${last} ist ungerade`;
              if (r === 5) w = ok ? `letzte Ziffer ist ${last}` : `letzte Ziffer ${last} ist nicht 0 oder 5`;
              if (r === 10) w = ok ? "letzte Ziffer ist 0" : "letzte Ziffer ist keine 0";
              if (r === 3) w = ok ? `Quersumme ${q} ist durch 3 teilbar` : `Quersumme ${q} ist nicht durch 3 teilbar`;
              if (r === 9) w = ok ? `Quersumme ${q} ist durch 9 teilbar` : `Quersumme ${q} ist nicht durch 9 teilbar`;
              if (r === 4) w = ok ? `${two} ist durch 4 teilbar` : `${two} ist nicht durch 4 teilbar`;
              if (r === 6) { const a = n % 2 === 0, b = n % 3 === 0; w = a && b ? "durch 2 und durch 3" : a ? "durch 2, aber nicht durch 3" : b ? "durch 3, aber nicht durch 2" : "weder durch 2 noch durch 3"; }
              L2.why.textContent = w;
              if (ok && !L2.on && sound) { const kk = k++; s.wait(kk * 90).then(() => s.alive && s.sfx.count(kk + 2)); }
              L2.on = ok; L2.row.classList.toggle("on", ok);
              L2.c.setAttribute("fill", ok ? "#22c55e" : "#d9dee5"); L2.c.setAttribute("stroke", ok ? GREEN : "#aab3c0");
            });
          };
          const colsEl = digits.map((_, i) => s.h("div", { class: "stack", style: { gap: "8px", alignItems: "center" } },
            s.h("button", { class: "btn", style: { width: "92px" }, "aria-label": "plus", onclick: () => { digits[i] = (digits[i] + 1) % 10; s.sfx.click(); update(); } }, "▲"),
            boxes[i],
            s.h("button", { class: "btn", style: { width: "92px" }, "aria-label": "minus", onclick: () => { digits[i] = (digits[i] + 9) % 10; s.sfx.click(); update(); } }, "▼")));
          update(false);
          const fact = life(s, P(s, "small", "2520 ist die kleinste Zahl, die durch alle Zahlen von 1 bis 10 teilbar ist. Damit kann man fast alles gerecht aufteilen!"));
          fact.classList.add("later");
          const left = s.h("div", { class: "stack" }, P(s, "t", "Stell eine Zahl ein:"), s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, colsEl), qs, l2, fact);
          const right = s.h("div", { class: "stack", style: { gap: "10px" } }, lamps.map(l => l.row));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "440px 1fr", alignItems: "center", height: "100%" } }, left, right));
          s.show(right, "left"); s.sfx.pop();
          s.step(async () => {
            const target = [2, 5, 2, 0];
            for (let i = 0; i < 4; i++) { digits[i] = target[i]; update(false); s.sfx.count(i * 2); await s.wait(160); }
            update(false); s.sfx.fanfare(); await s.show(fact, "up");
            s.say("2520 ist durch alle Zahlen von 1 bis 10 teilbar.");
          });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Primzahlen: nur eine Reihe",
        say: "Manche Zahlen kann man nur in eine einzige Reihe legen. Das sind die Primzahlen.",
        build(s) {
          const panel = (n) => {
            const sv = s.svg(300, 210);
            const ds = [];
            const pts = gridPos(n, 1, 150, 105, 42);
            for (let k = 0; k < n; k++) { const c = s.el("circle", { cx: pts[k].x, cy: pts[k].y, r: 16, fill: UC }); sv.append(c); ds.push({ c, x: pts[k].x, y: pts[k].y }); }
            const cap = P(s, "t", `${n} Punkte in 1 Reihe`);
            const card = s.h("div", { class: "card stack", style: { gap: "4px", alignItems: "center" } }, s.h("p", { class: "big", style: { color: UC } }, String(n)), sv, cap);
            const arr = async rows => {
              const tp = gridPos(n, rows, 150, 105, 42);
              await Promise.all(ds.map((o, k) => { const fx = o.x, fy = o.y; o.x = tp[k].x; o.y = tp[k].y; o.c.setAttribute("fill", tp[k].extra ? RED : UC); return s.tween({ dur: 500, update: v => { o.c.setAttribute("cx", lerp(fx, tp[k].x, v)); o.c.setAttribute("cy", lerp(fy, tp[k].y, v)); } }); }));
              return tp.some(p => p.extra);
            };
            return { card, arr, cap, sv };
          };
          const A = panel(6), B = panel(7), C = panel(9);
          const merk = s.h("div", { class: "merk later" }, "Eine ", s.h("b", null, "Primzahl"), " hat genau zwei Teiler: 1 und sich selbst. Die ", s.h("b", null, "1"), " ist keine Primzahl.");
          const lf = life(s, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } },
            s.photo("zikade", { w: 150, h: 120, style: { flex: "none" } }),
            P(s, "small", "Zikaden in Nordamerika schlüpfen alle 13 oder 17 Jahre – beides Primzahlen! Und beim Online-Banking schützen riesige Primzahlen deine Daten.")));
          lf.classList.add("later");
          const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
          const chips = primes.map(p => s.h("span", { class: "u4chip later", style: { borderColor: UC, color: UC } }, String(p)));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "space-evenly" } }, s.h("div", { class: "cols3" }, A.card, B.card, C.card),
            s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "18px" } }, merk, lf),
            s.h("div", { class: "u4chips" }, chips, s.h("span", { class: "u4chip later", style: { border: 0 } }, "…"))));
          s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await A.arr(2); s.sfx.ding(); A.cap.textContent = "6 = 2 · 3 → ein Rechteck!"; });
          s.step(async () => {
            s.sfx.whoosh(); await B.arr(2); s.sfx.error(); B.cap.textContent = "2 Reihen? 1 bleibt übrig."; B.sv.classList.add("a-shake"); await s.wait(700); B.sv.classList.remove("a-shake");
            s.sfx.whoosh(); await B.arr(3); s.sfx.error(); B.cap.textContent = "3 Reihen? 1 bleibt übrig."; await s.wait(700);
            await B.arr(1); s.sfx.boing(); B.cap.textContent = "7 = 1 · 7 – nur eine Reihe!";
          });
          s.step(async () => { s.sfx.whoosh(); await C.arr(3); s.sfx.ding(); C.cap.textContent = "9 = 3 · 3 → ein Quadrat!"; s.say("Neun ist ungerade, aber trotzdem keine Primzahl."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
          s.step(async () => { for (let i = 0; i < chips.length; i++) { s.sfx.count(i); s.show(chips[i], "pop"); await s.wait(90); } s.show(chips.length ? s.root.querySelector(".u4chips > span:last-child") : null, "fade"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Das Sieb des Eratosthenes",
        say: "Wir streichen alle Vielfachen weg. Was übrig bleibt, sind die Primzahlen bis hundert.",
        build(s) {
          const svg = s.svg(532, 532);
          const cell = {};
          for (let v = 1; v <= 100; v++) {
            const x = 6 + ((v - 1) % 10) * 52, y = 6 + Math.floor((v - 1) / 10) * 52;
            const bg = s.el("rect", { x: x + 1, y: y + 1, width: 50, height: 50, rx: 8, fill: "#fff", stroke: LINE, "stroke-width": 1.5 });
            const t = T(s, x + 26, y + 27, v, { size: v === 100 ? 19 : 22 });
            const cr = s.el("line", { x1: x + 8, y1: y + 44, x2: x + 44, y2: y + 8, stroke: PEN, "stroke-width": 4, "stroke-linecap": "round", class: "later" });
            const ci = s.el("circle", { cx: x + 26, cy: y + 27, r: 21, fill: "none", stroke: UC, "stroke-width": 3.5, class: "later" });
            svg.append(bg, t, cr, ci);
            cell[v] = { bg, t, cr, ci, gone: false };
          }
          const cross = (v, col) => { const c = cell[v]; c.gone = true; c.cr.setAttribute("stroke", col); c.bg.setAttribute("fill", "#f1f3f6"); c.t.setAttribute("fill", "#9aa3b2"); s.show(c.cr, "draw"); };
          const ring = (v, col) => { const c = cell[v]; c.ci.setAttribute("stroke", col); c.bg.setAttribute("fill", "#fff6e5"); return s.show(c.ci, "pop"); };
          const item = (col, txt) => s.h("div", { class: "row later", style: { gap: "12px", flexWrap: "nowrap" } }, s.h("span", { style: { width: "18px", height: "18px", borderRadius: "50%", background: col, flex: "none" } }, ""), P(s, "t", txt));
          const items = [item(PEN, "1 streichen – sie ist keine Primzahl."), item(BLUE, "2 einkreisen, alle Vielfachen von 2 streichen."), item(GREEN, "3 einkreisen, Vielfache von 3 streichen."),
            item(VIOLET, "5 und 7 genauso."), item(UC, "Alles, was übrig bleibt, ist eine Primzahl!")];
          const merk = s.h("div", { class: "merk later" }, "Bis 100 gibt es ", s.h("b", null, "25 Primzahlen"), ". Nach der 7 ist schon alles gesiebt, denn 11 · 11 = 121 ist größer als 100.");
          const right = s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } }, s.photo("eratosthenes", { w: 104, h: 140, pos: "50% 35%", style: { flex: "none" } }), P(s, "t", "Der Grieche Eratosthenes fand so vor über 2000 Jahren alle Primzahlen:")), items, merk);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "532px 1fr", alignItems: "center", height: "100%" } }, svg, right));
          s.show(svg, "zoom"); s.sfx.pop();
          const sieve = async (p, col, i0) => {
            await ring(p, col); s.sfx.ding();
            let i = 0;
            for (let m = 2 * p; m <= 100; m += p) {
              if (cell[m].gone) continue;
              cross(m, col); s.sfx.tone(300 + i * 18 + i0, 0.04, "square", 0.05); i++;
              await s.wait(28);
            }
          };
          s.step(async () => { await s.show(items[0], "left"); cross(1, PEN); s.sfx.snap(); await s.wait(300); await s.show(items[1], "left"); await sieve(2, BLUE, 0); });
          s.step(async () => { await s.show(items[2], "left"); await sieve(3, GREEN, 100); });
          s.step(async () => { await s.show(items[3], "left"); await sieve(5, VIOLET, 200); await sieve(7, ORANGE, 300); });
          s.step(async () => {
            await s.show(items[4], "left");
            let k = 0;
            for (let v = 2; v <= 100; v++) if (!cell[v].gone && ![2, 3, 5, 7].includes(v)) { ring(v, UC); s.sfx.count(k % 15); k++; await s.wait(50); }
            s.sfx.success(); await s.show(merk, "up");
          });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Primfaktorzerlegung",
        say: "Wir zerlegen eine Zahl so lange, bis nur noch Primzahlen übrig sind. Egal wie man anfängt, es kommen dieselben Primzahlen heraus.",
        build(s) {
          const SW = 500, SH = 380;
          const mk = (n, mode) => {
            if (isPrime(n)) return { v: n };
            let a;
            if (mode === "bal") { a = 1; for (let d = 2; d * d <= n; d++) if (n % d === 0) a = d; } else a = pfac(n)[0];
            return { v: n, kids: [mk(a, mode), mk(n / a, mode)] };
          };
          const layout = root => {
            const leaves = [], depth = (t, d) => { t.d = d; if (t.kids) t.kids.forEach(k => depth(k, d + 1)); else leaves.push(t); };
            depth(root, 0);
            const maxD = Math.max(...leaves.map(l => l.d)), lh = Math.min(84, (SH - 64) / Math.max(1, maxD));
            leaves.forEach((l, i) => (l.x = 30 + (i + 0.5) * ((SW - 60) / leaves.length)));
            const setX = t => { if (t.kids) { t.kids.forEach(setX); t.x = (t.kids[0].x + t.kids[1].x) / 2; } };
            setX(root);
            const all = [], walk = t => { t.y = 34 + t.d * lh; all.push(t); if (t.kids) t.kids.forEach(walk); };
            walk(root);
            return { all, maxD };
          };
          const draw = (svg, root) => {
            svg.innerHTML = "";
            const { all, maxD } = layout(root);
            const edges = s.el("g"), nodes = s.el("g"); svg.append(edges, nodes);
            all.forEach(t => {
              if (t.kids) t.kids.forEach(k => { const l = s.el("line", { x1: t.x, y1: t.y + 26, x2: k.x, y2: k.y - 26, stroke: PEN, "stroke-width": 3, "stroke-linecap": "round" }); edges.append(l); (k.edges = k.edges || []).push(l); k.edge = l; });
              const pr = !t.kids;
              const g = s.el("g", { class: "fb4" });
              g.append(s.el("circle", { cx: t.x, cy: t.y, r: 26, fill: pr ? SOFT : "#fff", stroke: pr ? UC : LINE, "stroke-width": pr ? 4 : 2.5 }), T(s, t.x, t.y + 1, t.v, { size: t.v >= 100 ? 21 : 24, fill: pr ? UC : INK, font: 1 }));
              nodes.append(g); t.g = g;
            });
            return { all, maxD };
          };
          const grow = async (tr, instant) => {
            for (const t of tr.all) if (t.d > 0) { t.g.classList.add("later"); t.edge.classList.add("later"); }
            if (instant) { for (const t of tr.all) if (t.d > 0) { t.g.classList.remove("later"); t.edge.classList.remove("later"); } return; }
            for (let d = 1; d <= tr.maxD; d++) {
              const lvl = tr.all.filter(t => t.d === d);
              s.sfx.scribble();
              await s.show(lvl.map(t => t.edge), "draw");
              lvl.forEach((t, i) => { s.wait(i * 80).then(() => s.alive && (t.kids ? s.sfx.pop() : s.sfx.note(7 + i * 2, 0.25))); });
              await s.show(lvl.map(t => t.g), "pop");
            }
          };
          const svA = s.svg(SW, SH), svB = s.svg(SW, SH);
          const hA = P(s, "t", ""), hB = P(s, "t", "");
          const res = s.h("p", { class: "h2" }, ""), resSub = P(s, "small", "Beide Wege – dieselben Primfaktoren! Jede Zahl hat genau eine Primfaktorzerlegung.");
          const resCard = s.h("div", { class: "merk later", style: { flex: "1", padding: "10px 20px 12px" } }, res, resSub);
          let trA, trB, cur = 60;
          const setup = n => {
            cur = n;
            const a = mk(n, "bal"), b = mk(n, "low");
            trA = draw(svA, a); trB = draw(svB, b);
            hA.innerHTML = ""; hA.append(s.h("b", null, "Weg 1: "), `${n} = ${a.kids[0].v} · ${a.kids[1].v}`);
            hB.innerHTML = ""; hB.append(s.h("b", null, "Weg 2: "), `${n} = ${b.kids[0].v} · ${b.kids[1].v}`);
            const pf = pfac(n);
            res.innerHTML = ""; res.append(`${n} = ${pf.join(" · ")} = `, ...supPow(s, pf));
          };
          setup(60); trA.all.forEach(t => t.d > 0 && (t.g.classList.add("later"), t.edge.classList.add("later")));
          trB.all.forEach(t => t.d > 0 && (t.g.classList.add("later"), t.edge.classList.add("later")));
          const btns = [60, 84, 90, 360].map(n => s.h("button", { class: "btn", onclick: async () => { s.sfx.click(); setup(n); await Promise.all([grow(trA), grow(trB)]); s.sfx.success(); } }, String(n)));
          const btnRow = s.h("div", { class: "row later", style: { flexWrap: "nowrap", gap: "10px" } }, btns);
          const card = (h, sv) => s.h("div", { class: "card stack", style: { gap: "4px", padding: "10px 16px" } }, h, sv);
          s.add(s.h("div", { class: "stack" }, s.h("div", { class: "cols", style: { gap: "20px" } }, card(hA, svA), card(hB, svB)),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch" } }, resCard, btnRow)));
          s.sfx.pop();
          s.step(async () => { await grow(trA); s.say("Sechzig ist sechs mal zehn. Sechs ist zwei mal drei, zehn ist zwei mal fünf."); });
          s.step(async () => { await grow(trB); });
          s.step(async () => { s.sfx.success(); await s.show(resCard, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(btnRow, "left"); s.say("Probiere andere Zahlen aus."); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "ggT: die größten gleichen Stücke",
        say: "Zwei Bänder, zwölf und achtzehn Meter lang, sollen in möglichst lange, gleich lange Stücke geschnitten werden.",
        build(s) {
          const svg = s.svg(1100, 200), S = 50, X0 = 110;
          const band = (y, len, col) => { svg.append(s.el("rect", { x: X0, y, width: len * S, height: 46, rx: 8, fill: col })); svg.append(T(s, 52, y + 23, `${len} m`, { size: 24, font: 1 })); };
          band(30, 12, "#f59e6b"); band(118, 18, "#93b4f0");
          const cuts = s.el("g"); svg.append(cuts);
          const st1 = P(s, "t", ""), st2 = P(s, "t", "");
          let Lc = 1;
          const setL = Lv => {
            Lc = Lv; cuts.innerHTML = "";
            let all = true;
            [[30, 12, st1], [118, 18, st2]].forEach(([y, len, st]) => {
              const k = Math.floor(len / Lv), rest = len - k * Lv;
              for (let i = 1; i <= k; i++) if (i * Lv < len) cuts.append(s.el("line", { x1: X0 + i * Lv * S, y1: y - 6, x2: X0 + i * Lv * S, y2: y + 52, stroke: INK, "stroke-width": 3, "stroke-dasharray": "6 4" }));
              if (rest) { all = false; cuts.append(s.el("rect", { x: X0 + k * Lv * S, y, width: rest * S, height: 46, rx: 8, fill: "url(#u4hatch)", stroke: RED, "stroke-width": 3 })); }
              st.innerHTML = ""; st.append(s.h("b", null, `${len} m: `), rest ? `${k} Stücke, Rest ${rest} m` : `${k} Stücke – passt genau!`);
              st.style.color = rest ? RED : GREEN;
            });
            return all;
          };
          const defs = s.el("defs"); const pat = s.el("pattern", { id: "u4hatch", width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
          pat.append(s.el("rect", { width: 10, height: 10, fill: "#fde2e0" }), s.el("line", { x1: 0, y1: 0, x2: 0, y2: 10, stroke: RED, "stroke-width": 3 })); defs.append(pat); svg.prepend(defs);
          setL(1);
          const sl = s.slider({ label: "Stücklänge", min: 1, max: 12, value: 1, fmt: v => v + " m", onInput: v => { if (setL(v)) s.sfx.ding(); else s.sfx.error(); } });
          const lists = s.h("div", { class: "card stack later", style: { gap: "6px" } },
            P(s, "t", s.h("b", null, "T(12)"), " = {", s.h("span", { class: "hl" }, "1, 2, 3"), ", 4, ", s.h("span", { class: "hl" }, "6"), ", 12}"),
            P(s, "t", s.h("b", null, "T(18)"), " = {", s.h("span", { class: "hl" }, "1, 2, 3, 6"), ", 9, 18}"),
            P(s, "t", "gemeinsam: 1, 2, 3, 6 → der größte:"),
            s.h("p", { class: "big", style: { color: UC } }, "ggT(12, 18) = 6"));
          const lf = life(s, s.h("div", { class: "stack", style: { gap: "8px" } },
            P(s, "small", s.h("b", null, "Fliesen: "), "Eine Wand ist 240 cm breit und 180 cm hoch. Die größten quadratischen Fliesen ohne Schneiden: ggT = 60 cm."),
            P(s, "small", s.h("b", null, "Obsttüten: "), "24 Äpfel und 36 Birnen gerecht auf möglichst viele Tüten: ggT = 12 Tüten (je 2 Äpfel, 3 Birnen)."),
            P(s, "small", s.h("b", null, "Basteln: "), "Pappe 30 cm × 42 cm in gleiche Quadrate: ggT = 6 cm.")));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack" }, svg, s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" } }, sl, s.h("div", { class: "stack", style: { gap: "2px" } }, st1, st2)),
            s.h("div", { class: "cols", style: { gap: "20px" } }, lists, lf)));
          s.show(svg, "left"); s.sfx.whoosh();
          s.step(async () => { sl.set(4); s.say("Vier Meter: beim langen Band bleiben zwei Meter übrig."); });
          s.step(async () => { sl.set(6); s.sound("scissors", { vol: .6 }); s.say("Sechs Meter passen bei beiden genau. Das ist der größte gemeinsame Teiler."); });
          s.step(async () => { s.sfx.pop(); await s.show(lists, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "kgV: Wann treffen sich die Busse?",
        say: "Bus A fährt alle sechs Minuten, Bus B alle acht Minuten. Um acht Uhr fahren beide zusammen ab. Wann wieder?",
        build(s) {
          const svg = s.svg(1100, 236), X = m => 70 + m * 20, Y = 124;
          svg.append(s.el("line", { x1: 50, y1: Y, x2: 1060, y2: Y, stroke: INK, "stroke-width": 3 }));
          for (let m = 0; m <= 48; m++) svg.append(s.el("line", { x1: X(m), y1: Y - 4, x2: X(m), y2: Y + 4, stroke: PEN, "stroke-width": 1.5 }));
          const bands = [24, 48].map(m => L(s.el("rect", { x: X(m) - 16, y: 26, width: 32, height: 186, rx: 10, fill: YEL, opacity: .5 })));
          svg.prepend(...bands);
          const tm = m => `8:${String(m).padStart(2, "0")}`;
          const mk = (step, col, ly, my) => {
            const out = [];
            for (let m = 0; m <= 48; m += step) {
              const g = L(s.el("g"));
              g.append(s.el("circle", { cx: X(m), cy: my, r: 8, fill: col }), T(s, X(m), ly, tm(m), { size: 19, fill: col }));
              svg.append(g); out.push({ m, g });
            }
            return out;
          };
          const A = mk(6, BLUE, 44, Y - 14), B = mk(8, ORANGE, 206, Y + 14);
          const meet = [24, 48].map(m => L(T(s, X(m), 12, "zusammen!", { size: 19, fill: RED })));
          svg.append(...meet);
          const busA = bus(s, BLUE), busB = bus(s, ORANGE);
          busA.setAttribute("transform", `translate(${X(0)} ${Y - 42})`); busB.setAttribute("transform", `translate(${X(0)} ${Y + 44})`);
          svg.append(busA, busB);
          const drive = async (bb, list, yy, col) => {
            let i = 0; s.sound("traffic", { vol: .35, dur: 3 });
            await s.tween({ dur: 3000, ease: "linear", update: v => {
              const m = v * 48; bb.setAttribute("transform", `translate(${X(m)} ${yy})`);
              while (i < list.length && list[i].m <= m + 1e-6) { s.show(list[i].g, "pop"); s.sfx.note(col === BLUE ? 0 + i : 7 + i, 0.15); i++; }
            } });
            while (i < list.length) s.show(list[i++].g, "pop");
          };
          const chipRow = (lbl, step, col) => s.h("div", { class: "u4chips" }, s.h("span", { class: "u4lbl", style: { color: col } }, lbl),
            [1, 2, 3, 4, 5, 6, 7, 8].map(k => k * step).filter(v => v <= 48).map(v => s.h("span", { class: "u4chip", "data-v": v }, String(v))), s.h("span", { class: "u4chip", style: { border: 0 } }, "…"));
          const lists = s.h("div", { class: "card stack later", style: { gap: "10px", padding: "12px 18px" } }, chipRow("V(6):", 6, BLUE), chipRow("V(8):", 8, ORANGE));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "kgV(6, 8) = 24"), " – das kleinste gemeinsame Vielfache. Um 8:24 Uhr fahren beide wieder zusammen.");
          const lf = life(s, P(s, "small", "Würstchen gibt es im 10er-Pack, Brötchen im 6er-Pack. Damit nichts übrig bleibt: kgV(10, 6) = 30 – also 3 Pack Würstchen und 5 Tüten Brötchen."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack" },
            s.h("div", { class: "row" }, s.h("span", { class: "chip", style: { background: "#dbe6fb" } }, "Bus A: alle 6 Minuten"), s.h("span", { class: "chip", style: { background: "#fde4cc" } }, "Bus B: alle 8 Minuten"), P(s, "t", "Start: beide um 8:00 Uhr")),
            svg, lists, s.h("div", { class: "cols", style: { gap: "20px" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { await drive(busA, A, Y - 42, BLUE); });
          s.step(async () => { await drive(busB, B, Y + 44, ORANGE); });
          s.step(async () => {
            s.sfx.ding(); await s.show(bands, "fade"); s.show(meet, "pop"); s.sfx.success();
            await s.show(lists, "up");
            lists.querySelectorAll("[data-v]").forEach(c => { if (+c.dataset.v % 24 === 0) c.classList.add("hit"); });
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Rhythmus: 3 gegen 4",
        say: "Eine Gruppe klatscht jeden dritten Schlag, die andere jeden vierten. Nach zwölf Schlägen treffen sie sich wieder.",
        build(s) {
          const svg = s.svg(1100, 262), CX = i => 160 + i * 70;
          const rows = [{ y: 40, step: 3, col: UC, lbl: "3er: klatschen" }, { y: 128, step: 4, col: BLUE, lbl: "4er: Holzblock" }];
          const hits = [[], []];
          const meetCols = [0, 12].map(i => L(s.el("rect", { x: CX(i) - 3, y: 30, width: 70, height: 184, rx: 12, fill: YEL, opacity: .55 })));
          svg.append(...meetCols);
          rows.forEach((r, ri) => {
            svg.append(T(s, 75, r.y + 32, r.lbl, { size: 22, fill: r.col }));
            for (let i = 0; i <= 12; i++) {
              svg.append(s.el("rect", { x: CX(i), y: r.y, width: 64, height: 64, rx: 10, fill: "#fff", stroke: LINE, "stroke-width": 2 }));
              if (i % r.step === 0) { const c = L(s.el("circle", { cx: CX(i) + 32, cy: r.y + 32, r: 22, fill: r.col })); svg.append(c); hits[ri].push(c); }
            }
          });
          for (let i = 0; i <= 12; i++) svg.append(T(s, CX(i) + 32, 236, i === 12 ? "1" : i + 1, { size: 21, fill: i === 12 ? RED : PEN }));
          const head = s.el("rect", { x: CX(0) - 4, y: 32, width: 72, height: 168, rx: 12, fill: "none", stroke: "#e0b400", "stroke-width": 5, opacity: 0 });
          svg.append(head);
          let tok = 0;
          const play = async mode => {
            const my = ++tok; head.setAttribute("opacity", 1);
            for (let i = 0; i <= 12; i++) {
              if (!s.alive || my !== tok) return;
              head.setAttribute("x", CX(i) - 4);
              const a = (mode !== "4") && i % 3 === 0, b = (mode !== "3") && i % 4 === 0;
              if (a && b) { s.sound("klatschen"); s.sound("holzblock"); s.sfx.chord([0, 4, 7, 12]); }
              else if (a) s.sound("klatschen");
              else if (b) s.sound("holzblock");
              else s.sfx.tick();
              await s.wait(340);
            }
            if (my === tok) head.setAttribute("opacity", 0);
          };
          const btns = [["▶ 3er", "3"], ["▶ 4er", "4"], ["▶ beide zusammen", "b"]].map(([t, m]) => s.h("button", { class: "btn" + (m === "b" ? " solid" : ""), onclick: () => { s.sfx.click(); play(m); } }, t));
          const btnRow = s.h("div", { class: "row later" }, btns);
          const merk = s.h("div", { class: "merk later" }, "Beide Rhythmen landen nach ", s.h("b", null, "12 Schlägen"), " wieder gemeinsam auf der Eins: ", s.h("b", null, "kgV(3, 4) = 12"), ".");
          const lf = life(s, P(s, "small", "In der Instrumentalklasse: Spielt eine Gruppe im 3er- und eine im 4er-Muster, klingt es erst wild – und alle 12 Schläge wieder zusammen. So entsteht ein Polyrhythmus."));
          lf.classList.add("later");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } }, svg, btnRow, s.h("div", { class: "cols", style: { gap: "20px" } }, merk, lf)));
          s.sfx.pop();
          s.step(async () => { for (const c of hits[0]) { s.sound("klatschen"); await s.show(c, "pop"); } await play("3"); });
          s.step(async () => { for (const c of hits[1]) { s.sound("holzblock"); await s.show(c, "pop"); } await play("4"); });
          s.step(async () => { await s.show(meetCols, "fade"); await play("b"); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); await s.show(btnRow, "up"); s.say("Drück auf die Knöpfe und hör genau hin."); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "ggT und kgV mit Primfaktoren",
        say: "Wir legen die Primfaktoren beider Zahlen in zwei Kreise. Die Mitte ist der ggT, alles zusammen ist das kgV.",
        build(s) {
          const svg = s.svg(600, 470), R = 175, cy = 255, c1 = 205, c2 = 395;
          const h = Math.sqrt(R * R - ((c2 - c1) / 2) ** 2), mx = (c1 + c2) / 2;
          const fillA = s.el("circle", { cx: c1, cy, r: R, fill: "#f59e6b", opacity: 0 }), fillB = s.el("circle", { cx: c2, cy, r: R, fill: "#93b4f0", opacity: 0 });
          const lens = s.el("path", { d: `M${mx} ${cy - h} A${R} ${R} 0 0 0 ${mx} ${cy + h} A${R} ${R} 0 0 0 ${mx} ${cy - h}Z`, fill: YEL, opacity: 0 });
          svg.append(fillA, fillB, lens, s.el("circle", { cx: c1, cy, r: R, fill: "none", stroke: UC, "stroke-width": 4 }), s.el("circle", { cx: c2, cy, r: R, fill: "none", stroke: BLUE, "stroke-width": 4 }));
          const nA = T(s, 120, 40, "12", { size: 32, fill: UC, font: 1 }), nB = T(s, 480, 40, "18", { size: 32, fill: BLUE, font: 1 });
          svg.append(nA, nB);
          const tokG = s.el("g"); svg.append(tokG);
          const dA = s.h("p", { class: "h2" }), dB = s.h("p", { class: "h2" });
          const gg = s.h("p", { class: "h2 later" }), kg = s.h("p", { class: "h2 later" });
          let toks = [];
          const cnt = l => l.reduce((o, p) => ((o[p] = (o[p] || 0) + 1), o), {});
          const setup = (a, b) => {
            const fa = pfac(a), fb = pfac(b), ca = cnt(fa), cb = cnt(fb);
            const shared = [], la = [], rb = [];
            new Set([...fa, ...fb]).forEach(p => { const m = Math.min(ca[p] || 0, cb[p] || 0); for (let i = 0; i < m; i++) shared.push(p); for (let i = m; i < (ca[p] || 0); i++) la.push(p); for (let i = m; i < (cb[p] || 0); i++) rb.push(p); });
            [shared, la, rb].forEach(x => x.sort((p, q) => p - q));
            nA.textContent = String(a); nB.textContent = String(b);
            dA.innerHTML = ""; dA.append(s.h("span", { style: { color: UC } }, `${a} = ${fa.join(" · ")}`));
            dB.innerHTML = ""; dB.append(s.h("span", { style: { color: BLUE } }, `${b} = ${fb.join(" · ")}`));
            const g = shared.reduce((x, y) => x * y, 1), all = [...la, ...shared, ...rb].sort((p, q) => p - q), k = all.reduce((x, y) => x * y, 1);
            gg.innerHTML = ""; gg.append("ggT = ", shared.length ? shared.join(" · ") + " = " : "", s.h("b", { style: { color: "#a16207" } }, String(g)), s.h("span", { class: "small pencil" }, " (die Mitte)"));
            kg.innerHTML = ""; kg.append("kgV = ", all.join(" · "), " = ", s.h("b", { style: { color: GREEN } }, String(k)), s.h("span", { class: "small pencil" }, " (alles)"));
            tokG.innerHTML = ""; toks = [];
            [[la, 112], [shared, mx], [rb, 488]].forEach(([list, x]) => list.forEach((p, i) => {
              const y = cy + (i - (list.length - 1) / 2) * 64;
              const t = L(s.el("g")); t.append(s.el("circle", { cx: x, cy: y, r: 27, fill: "#fff", stroke: INK, "stroke-width": 2.5 }), T(s, x, y + 1, p, { size: 26, font: 1 }));
              tokG.append(t); toks.push(t);
            }));
          };
          setup(12, 18);
          const lf = life(s, P(s, "small", s.h("b", null, "ggT"), ": größte gleiche Stücke (Band, Fliesen, Tüten). ", s.h("b", null, "kgV"), ": Wann trifft es sich wieder? (Busse, Rhythmus, Würstchen)"));
          lf.classList.add("later");
          const pairs = [[12, 18], [6, 8], [20, 30], [24, 36]];
          const btnRow = s.h("div", { class: "row later", style: { gap: "10px" } }, pairs.map(([a, b]) => s.h("button", { class: "btn", style: { padding: "0 14px" }, onclick: async () => {
            s.sfx.click(); setup(a, b); s.show(toks, "pop"); lens.setAttribute("opacity", .7); fillA.setAttribute("opacity", .18); fillB.setAttribute("opacity", .18); s.sfx.success();
          } }, `${a} & ${b}`)));
          const right = s.h("div", { class: "stack", style: { gap: "12px" } }, dA, dB, gg, kg, lf, btnRow);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center", height: "100%" } }, svg, right));
          s.sfx.pop();
          s.step(async () => { for (const t of toks) { s.sfx.pop(); await s.show(t, "pop"); } });
          s.step(async () => { s.sfx.ding(); await s.tween({ dur: 500, update: v => lens.setAttribute("opacity", v * .7) }); await s.show(gg, "left"); s.say("In der Mitte liegen die gemeinsamen Primfaktoren. Ihr Produkt ist der ggT."); });
          s.step(async () => { s.sfx.chord([0, 4, 7]); await s.tween({ dur: 500, update: v => { fillA.setAttribute("opacity", v * .18); fillB.setAttribute("opacity", v * .18); } }); await s.show(kg, "left"); s.say("Alle Primfaktoren zusammen, jeden nur einmal aus der Mitte, ergeben das kgV."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); await s.show(btnRow, "up"); });
        },
      },
    ],
  });
})();
