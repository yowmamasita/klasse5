/* Kapitel 7 – Erde, Mond und Sterne (RLP NaWi 5/6, Themenfeld 3.4 „Sehr groß – sehr klein“: Himmelskörper).
   Alle Zahlen geprüft (Quellen im Bericht): NASA Fact Sheets, timeanddate.de (Berlin), IAU/DLR, Wikipedia. */
(() => {
  const TAU = Math.PI * 2, RAD = Math.PI / 180;
  const BERLIN_LAT = 52.52;

  /* ---------- helpers ---------- */
  // moon/planet phase as seen by the viewer: k = lit fraction 0..1, litRight = lit side on the right
  function phase(g, x, y, r, k, litRight, lit = "#f4f1e3", dark = "#2b3350") {
    g.save();
    g.fillStyle = dark; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.fillStyle = lit; g.beginPath();
    if (litRight) g.arc(x, y, r, -Math.PI / 2, Math.PI / 2); else g.arc(x, y, r, Math.PI / 2, Math.PI * 1.5);
    g.closePath(); g.fill();
    const rx = Math.abs(1 - 2 * k) * r;
    g.fillStyle = k < 0.5 ? dark : lit;
    g.beginPath(); g.ellipse(x, y, Math.max(rx, 0.01), r + 0.4, 0, 0, TAU); g.fill();
    g.restore();
  }
  function moonName(day) {
    const p = ((day % 29.53) + 29.53) % 29.53 / 29.53;
    const names = ["Neumond", "zunehmende Sichel", "zunehmender Halbmond", "zunehmender Mond", "Vollmond", "abnehmender Mond", "abnehmender Halbmond", "abnehmende Sichel"];
    return names[Math.round(p * 8) % 8];
  }
  // solar declination + Berlin day length / noon altitude (standard formula incl. refraction −0,833°)
  function berlinSun(doy) {
    const dec = 23.44 * Math.sin(TAU * (doy - 80) / 365.25);
    const phi = BERLIN_LAT * RAD, d = dec * RAD;
    const cosH = (Math.sin(-0.833 * RAD) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d));
    const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / RAD;
    return { dec, len: (2 * H) / 15, alt: 90 - BERLIN_LAT + dec };
  }
  const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function dateOf(doy) { let d = Math.round(doy); for (let m = 0; m < 12; m++) { if (d < MDAYS[m]) return { d: d + 1, m }; d -= MDAYS[m]; } return { d: 31, m: 11 }; }
  const hm = h => { const t = Math.round(h * 60); return `${Math.floor(t / 60)} Std. ${String(t % 60).padStart(2, "0")} Min.`; };
  function starBg(g, w, h, n = 70, seed = 7) {
    let r = seed; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    g.fillStyle = "#0e1633"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.5})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, 0.6 + rnd() * 1.2, 0, TAU); g.fill(); }
  }
  function sunGlow(g, x, y, r) {
    const gr = g.createRadialGradient(x, y, r * 0.2, x, y, r * 1.9);
    gr.addColorStop(0, "rgba(255,214,80,.95)"); gr.addColorStop(0.5, "rgba(255,190,60,.35)"); gr.addColorStop(1, "rgba(255,190,60,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 1.9, 0, TAU); g.fill();
    g.fillStyle = "#ffcf3f"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  const life = (s, label, ...kids) => s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, label), ...kids);
  const ex = (s, label, ...kids) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, label), ...kids);

  Deck.unit({
    id: "u7", num: 7, title: "Erde, Mond und Sterne", color: "#1d5bd0", soft: "#e4ecfb",
    subtitle: "Tag, Jahr, Mondphasen und unser Sonnensystem",
    blurb: "Warum es Tag, Nacht und Jahreszeiten gibt – und wie groß das All ist.",
    goals: ["Tag und Nacht: die Erde dreht sich", "Jahr und Jahreszeiten: die schiefe Erdachse", "Mondphasen und Finsternisse verstehen", "Die 8 Planeten, Sterne und Sternbilder kennen"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 26, cy: 30, r: 17, fill: "#ffcf3f" }),
        el("circle", { cx: 49, cy: 44, r: 12, fill: "#1d5bd0" }),
        el("path", { d: "M49 32 a12 12 0 0 1 0 24 a7 12 0 0 0 0 -24z", fill: "#0e1633", opacity: .55 }),
        el("circle", { cx: 60, cy: 18, r: 2.5, fill: "#1d5bd0" }), el("circle", { cx: 12, cy: 58, r: 2, fill: "#1d5bd0" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Tag und Nacht",
        say: "Die Sonne scheint immer nur auf eine Hälfte der Erde. Weil sich die Erde dreht, wird es bei uns abwechselnd Tag und Nacht.",
        build(s) {
          const W = 520, H = 520, cx = 280, cy = 262, R = 190;
          const { canvas, g } = s.canvas(W, H);
          let hour = 12, night = 0, showNY = false;
          const draw = () => {
            starBg(g, W, H, 60);
            // sunlight from the left
            const gr = g.createLinearGradient(0, 0, 90, 0); gr.addColorStop(0, "rgba(255,210,70,.9)"); gr.addColorStop(1, "rgba(255,210,70,0)");
            g.fillStyle = gr; g.fillRect(0, 0, 90, H);
            g.strokeStyle = "rgba(255,210,70,.55)"; g.lineWidth = 3;
            for (let y = 70; y < H; y += 76) { g.beginPath(); g.moveTo(14, y); g.lineTo(70, y); g.stroke(); }
            g.fillStyle = "#ffd94a"; g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillText("Sonnenlicht", 12, 30);
            // earth seen from above the North Pole
            g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
            const rot = (hour - 12) / 24 * TAU; // counter-clockwise
            g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip();
            g.fillStyle = "#4fae6a";
            [[0.2, 0.62, 0.9], [1.4, 0.55, 0.7], [2.6, 0.7, 0.8], [3.7, 0.5, 1.0], [5.0, 0.66, 0.6]].forEach(([a, rr, w]) => {
              g.beginPath(); g.ellipse(cx + Math.cos(Math.PI + a + rot) * R * rr, cy - Math.sin(Math.PI + a + rot) * R * rr, R * 0.22 * w, R * 0.14, -(Math.PI + a + rot), 0, TAU); g.fill();
            });
            g.fillStyle = "#eef6fb"; g.beginPath(); g.arc(cx, cy, R * 0.18, 0, TAU); g.fill();
            // night side (right half)
            g.fillStyle = `rgba(8,12,40,${0.72 * night})`; g.fillRect(cx, cy - R, R, 2 * R);
            g.restore();
            g.strokeStyle = "#0e1633"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
            if (night > 0.5) { g.fillStyle = "#cfd8ff"; g.font = "700 22px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillText("Nacht", cx + R * 0.62, cy + R + 0); }
            g.fillStyle = "#ffe58a"; g.font = "700 22px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillText("Tag", cx - R * 0.62, cy + R - 10);
            // north pole marker
            g.fillStyle = "#1b2740"; g.beginPath(); g.arc(cx, cy, 5, 0, TAU); g.fill();
            // cities
            const city = (lonOff, rr, col, name) => {
              const a = Math.PI + rot + lonOff;
              const x = cx + Math.cos(a) * R * rr, y = cy - Math.sin(a) * R * rr;
              g.fillStyle = col; g.strokeStyle = "#fff"; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 10, 0, TAU); g.fill(); g.stroke();
              g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "center";
              g.lineWidth = 5; g.strokeStyle = "rgba(14,22,51,.85)"; g.strokeText(name, x, y - 16); g.fillStyle = "#fff"; g.fillText(name, x, y - 16);
            };
            if (showNY) city(-87 * RAD, 0.55, "#ee7a1a", "New York");
            city(0, 0.42, "#dc3b2a", "Berlin");
          };
          draw();
          const state = s.h("p", { class: "h2" }, "12 Uhr in Berlin: Tag");
          const update = () => {
            const hh = ((hour % 24) + 24) % 24;
            const day = hh >= 6 && hh < 18;
            state.textContent = `${s.fmt(Math.floor(hh))}:${hh % 1 ? "30" : "00"} Uhr in Berlin: ${day ? "Tag" : "Nacht"}`;
            draw();
          };
          const sl = s.slider({ label: "Uhrzeit in Berlin", min: 0, max: 24, step: 0.5, value: 12, fmt: v => `${Math.floor(v)}:${v % 1 ? "30" : "00"} Uhr`, onInput: v => { hour = v; update(); } });
          const spin = async () => { s.sfx.whoosh(); await s.tween({ from: hour, to: hour + 24, dur: 4200, ease: "inOut", update: v => { hour = v; update(); } }); hour = hour % 24; sl.set(hour); s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid later", onclick: spin }, "Erde einmal drehen");
          const merk = s.h("div", { class: "merk later" }, "Die Erde dreht sich in etwa ", s.h("b", null, "24 Stunden"), " einmal um sich selbst. Die Seite zur Sonne hat ", s.h("b", null, "Tag"), ", die andere ", s.h("b", null, "Nacht"), ".");
          const lf = life(s, "Im Alltag",
            s.h("p", { class: "small" }, "Frühstück in Berlin um 7 Uhr – in New York ist es erst 1 Uhr nachts. Dort ist es 6 Stunden früher, weil sich die Erde noch nicht so weit gedreht hat."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Blick von oben auf den Nordpol. Die Sonne strahlt von links."), state, sl, s.h("div", { class: "row" }, btn), merk, lf)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.swoosh(); await s.tween({ from: 0, to: 1, dur: 900, update: v => { night = v; draw(); } }); s.say("Die Hälfte, die von der Sonne weg zeigt, hat Nacht."); });
          s.step(async () => { s.show(btn, "pop"); await spin(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { showNY = true; draw(); s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "Der Weg der Sonne am Himmel",
        say: "Morgens geht die Sonne im Osten auf, mittags steht sie im Süden, abends geht sie im Westen unter.",
        build(s) {
          const W = 620, H = 400, gy = 320;
          const { canvas, g } = s.canvas(W, H);
          let t = 0.5; // 0 = Aufgang, 1 = Untergang
          const sunPos = tt => { const a = Math.PI * (1 - tt); return { x: 310 + Math.cos(a) * 260, y: gy - Math.sin(a) * 240 }; };
          const draw = () => {
            const p = sunPos(t), hgt = Math.sin(Math.PI * t);
            const sky = g.createLinearGradient(0, 0, 0, gy);
            sky.addColorStop(0, `hsl(${205 + (1 - hgt) * 20}, ${60 + hgt * 15}%, ${40 + hgt * 32}%)`);
            sky.addColorStop(1, `hsl(${30 + hgt * 170}, ${70}%, ${68 + hgt * 14}%)`);
            g.fillStyle = sky; g.fillRect(0, 0, W, gy);
            g.setLineDash([6, 8]); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 2;
            g.beginPath(); g.arc(310, gy, 260, Math.PI, 0); g.stroke(); g.setLineDash([]);
            sunGlow(g, p.x, p.y, 24);
            // ground + Fernsehturm
            g.fillStyle = "#7fb36a"; g.fillRect(0, gy, W, H - gy);
            const tx = 310, base = gy + 18;
            // shadow opposite to the sun
            const len = Math.min(240, 60 / Math.max(0.12, hgt));
            const dir = p.x < 310 ? 1 : -1, dx = Math.abs(p.x - 310) / 260;
            g.fillStyle = "rgba(20,30,40,.35)"; g.beginPath(); g.moveTo(tx - 4, base); g.lineTo(tx + 4, base); g.lineTo(tx + dir * len * dx + 3, base + 26 * (1 - dx) + 6); g.lineTo(tx + dir * len * dx - 3, base + 26 * (1 - dx) + 6); g.closePath(); g.fill();
            g.fillStyle = "#5d6678"; g.fillRect(tx - 5, base - 150, 10, 150);
            g.beginPath(); g.arc(tx, base - 118, 17, 0, TAU); g.fill();
            g.fillRect(tx - 2, base - 190, 4, 45);
            g.fillStyle = "#dc3b2a"; g.fillRect(tx - 2, base - 196, 4, 8);
            // compass labels
            g.font = "700 26px 'Bricolage Grotesque'"; g.textAlign = "center"; g.fillStyle = "#1b2740";
            g.fillText("Osten", 52, H - 22); g.fillText("Süden", 310, H - 22); g.fillText("Westen", W - 58, H - 22);
          };
          draw();
          const timeLbl = s.h("p", { class: "h2" }, "Mittag: Sonne im Süden");
          const label = tt => tt < 0.12 ? "Sonnenaufgang im Osten" : tt < 0.4 ? "Vormittag: Sonne im Südosten" : tt <= 0.6 ? "Mittag: Sonne im Süden" : tt < 0.88 ? "Nachmittag: Sonne im Südwesten" : "Sonnenuntergang im Westen";
          const sl = s.slider({ label: "Tageslauf", min: 0, max: 100, value: 50, fmt: v => v < 34 ? "morgens" : v < 67 ? "mittags" : "abends", onInput: v => { t = v / 100; timeLbl.textContent = label(t); draw(); } });
          const play = async () => { s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 4000, ease: "linear", update: v => { t = v; timeLbl.textContent = label(t); draw(); } }); sl.set(100); s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid" , onclick: play }, "Einen Tag abspielen");
          const merk = s.h("div", { class: "merk later" }, s.h("span", { class: "hand", style: { fontSize: "29px", display: "block", lineHeight: "1.15" } }, "Im Osten geht die Sonne auf, im Süden nimmt sie ihren Lauf, im Westen wird sie untergehn, im Norden ist sie nie zu sehn."));
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Ein Fenster nach Osten bekommt Morgensonne. Mittags zeigt dein Schatten nach Norden. Die Sonne bewegt sich nicht wirklich – wir drehen uns mit der Erde."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "620px 1fr", alignItems: "center", height: "100%", gap: "24px" } },
            s.h("div", { class: "stack" }, canvas, sl),
            s.h("div", { class: "stack" }, timeLbl, s.h("div", { class: "row" }, btn), merk, lf)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { t = 0; draw(); await play(); });
          s.step(async () => { s.sfx.scribble(); await s.show(merk, "up"); s.say("Im Osten geht die Sonne auf, im Süden nimmt sie ihren Lauf, im Westen wird sie untergehn, im Norden ist sie nie zu sehn."); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Ein Jahr: einmal um die Sonne",
        say: "Für eine Runde um die Sonne braucht die Erde ungefähr 365 und einen Viertel Tag. Deshalb gibt es alle vier Jahre ein Schaltjahr.",
        build(s) {
          const W = 500, H = 470, cx = 250, cy = 235, A = 205, B = 160;
          const { canvas, g } = s.canvas(W, H);
          let day = 0, trail = 0;
          const draw = () => {
            starBg(g, W, H, 50, 3);
            g.strokeStyle = "rgba(255,255,255,.35)"; g.setLineDash([5, 7]); g.lineWidth = 2;
            g.beginPath(); g.ellipse(cx, cy, A, B, 0, 0, TAU); g.stroke(); g.setLineDash([]);
            if (trail > 0) { g.strokeStyle = "#ffd94a"; g.lineWidth = 5; g.beginPath(); g.ellipse(cx, cy, A, B, 0, Math.PI / 2, Math.PI / 2 - trail * TAU, true); g.stroke(); }
            sunGlow(g, cx, cy, 40);
            const a = Math.PI / 2 - (day / 365.25) * TAU;
            const x = cx + Math.cos(a) * A, y = cy + Math.sin(a) * B;
            g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(x, y, 15, 0, TAU); g.fill();
            g.fillStyle = "#4fae6a"; g.beginPath(); g.arc(x - 4, y - 3, 6, 0, TAU); g.fill();
            g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillStyle = "#cfd8ff";
            g.fillText("Erde", x, y + 36);
          };
          draw();
          const cnt = s.h("p", { class: "huge mono", style: { color: "var(--unit)" } }, "0");
          const cntLbl = s.h("p", { class: "t" }, "Tage unterwegs");
          const clocks = s.svg(440, 110);
          const pies = [0, 1, 2, 3].map(i => {
            const x = 55 + i * 110, y = 50;
            clocks.append(s.el("circle", { cx: x, cy: y, r: 36, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }));
            const p = s.el("path", { d: `M${x} ${y} L${x} ${y - 34} A34 34 0 0 1 ${x + 34} ${y} Z`, fill: "#ffd94a", class: "later" });
            const t = s.el("text", { x, y: 106, "text-anchor": "middle", class: "lbl", text: `Jahr ${i + 1}` });
            clocks.append(p, t); return p;
          });
          const sum = s.h("p", { class: "t later" }, "4 × 6 Stunden = ", s.h("b", null, "24 Stunden = 1 Tag"), " → der ", s.h("span", { class: "hl", style: { whiteSpace: "nowrap" } }, "29. Februar"));
          const merk = s.h("div", { class: "merk later" }, "Ein Jahr ≈ ", s.h("b", null, "365 ¼ Tage"), ". Alle 4 Jahre gibt es ein ", s.h("b", null, "Schaltjahr"), " mit 366 Tagen.");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "2024 war ein Schaltjahr, 2028 ist das nächste. Wer am 29. Februar Geburtstag hat, feiert ihn nur alle 4 Jahre am echten Tag."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { alignItems: "baseline" } }, cnt, cntLbl), clocks, sum, merk, lf)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => {
            s.sfx.whoosh(); let last = 0;
            await s.tween({ from: 0, to: 365, dur: 4200, ease: "linear", update: v => { day = v; trail = v / 365.25; draw(); cnt.textContent = s.fmt(Math.floor(v)); if (Math.floor(v / 30) !== last) { last = Math.floor(v / 30); s.sfx.tick(); } } });
            s.sfx.ding(); cntLbl.textContent = "Tage – und noch knapp 6 Stunden!";
          });
          s.step(async () => { for (let i = 0; i < 4; i++) { s.sfx.count(i * 2); await s.show(pies[i], "pop"); } s.sfx.success(); await s.show(sum, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Jahreszeiten: die schiefe Achse",
        say: "Die Erdachse ist schief, um etwa 23 Grad. Im Sommer ist der Norden zur Sonne geneigt, im Winter von ihr weg.",
        build(s) {
          const W = 600, H = 470, cx = 300, cy = 240, A = 230, B = 120;
          const { canvas, g } = s.canvas(W, H);
          let doy = 171; // 21. Juni
          const draw = () => {
            starBg(g, W, H, 50, 11);
            g.strokeStyle = "rgba(255,255,255,.35)"; g.setLineDash([5, 7]); g.lineWidth = 2;
            g.beginPath(); g.ellipse(cx, cy, A, B, 0, 0, TAU); g.stroke(); g.setLineDash([]);
            const th = (doy - 355) / 365.25 * TAU; // 0 = Dezember rechts, Juni links
            const x = cx + Math.cos(th) * A, y = cy - Math.sin(th) * B;
            const behind = Math.sin(th) > 0;
            const earth = () => {
              const r = 40;
              g.fillStyle = "#1f3f78"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
              const ang = Math.atan2(cy - y, cx - x); // to the sun (screen)
              g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
              g.fillStyle = "#4b97e6"; g.beginPath(); g.arc(x, y, r, ang - Math.PI / 2, ang + Math.PI / 2); g.closePath(); g.fill();
              g.restore();
              // axis tilted 23,4° – always leaning to the right (fixed in space)
              const tl = 23.4 * RAD, L = 62;
              g.strokeStyle = "#fff"; g.lineWidth = 4;
              g.beginPath(); g.moveTo(x - Math.sin(tl) * L, y + Math.cos(tl) * L); g.lineTo(x + Math.sin(tl) * L, y - Math.cos(tl) * L); g.stroke();
              g.fillStyle = "#fff"; g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillText("N", x + Math.sin(tl) * (L + 14), y - Math.cos(tl) * (L + 14) + 6);
              // Berlin
              const sgn = cx >= x ? 1 : -1, la = BERLIN_LAT * RAD;
              const bx = x + r * 0.95 * (Math.cos(la) * Math.cos(tl) * sgn + Math.sin(la) * Math.sin(tl));
              const by = y + r * 0.95 * (Math.cos(la) * Math.sin(tl) * sgn - Math.sin(la) * Math.cos(tl));
              g.fillStyle = "#dc3b2a"; g.beginPath(); g.arc(bx, by, 6, 0, TAU); g.fill();
            };
            if (behind) earth();
            sunGlow(g, cx, cy, 46);
            if (!behind) earth();
            g.font = "700 19px 'Atkinson Hyperlegible'"; g.fillStyle = "#cfd8ff"; g.textAlign = "center";
            g.fillText("Juni", cx - A - 6, cy + B * 0 + 80); g.fillText("Dezember", cx + A + 0, cy + 80);
            g.fillText("März", cx, cy - B - 14); g.fillText("September", cx, cy + B + 30);
          };
          draw();
          const dt = s.h("p", { class: "h2" }, "");
          const season = s.h("p", { class: "t" }, "");
          const lenV = s.h("b", { class: "mono" }, ""), altV = s.h("b", { class: "mono" }, "");
          const card = s.h("div", { class: "card soft stack", style: { gap: "6px" } }, s.h("span", { class: "exlabel" }, "In Berlin"),
            s.h("p", { class: "t" }, "Tageslänge: ", lenV), s.h("p", { class: "t" }, "Sonne mittags: ", altV, " hoch"));
          const update = () => {
            const { d, m } = dateOf(doy); dt.textContent = `${d}. ${MONTHS[m]}`;
            const b = berlinSun(doy);
            lenV.textContent = hm(b.len); altV.textContent = s.fmt(b.alt, 0) + "°";
            const name = doy >= 79 && doy < 171 ? "Frühling" : doy >= 171 && doy < 265 ? "Sommer" : doy >= 265 && doy < 354 ? "Herbst" : "Winter";
            season.textContent = `${name}: Norden ${b.dec >= 0 ? "zur Sonne hin" : "von der Sonne weg"} geneigt`;
            draw();
          };
          update();
          const sl = s.slider({ label: "Tag im Jahr", min: 0, max: 364, value: 171, fmt: v => { const { d, m } = dateOf(v); return `${d}. ${MONTHS[m]}`; }, onInput: v => { doy = v; update(); } });
          const merk = s.h("div", { class: "merk later" }, "Die Erdachse ist um etwa ", s.h("b", null, "23,4°"), " geneigt. Die Neigung macht die ", s.h("b", null, "Jahreszeiten"), " – nicht der Abstand zur Sonne.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "600px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, dt, season, card, sl, merk)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { s.sfx.whoosh(); await s.tween({ from: 171, to: 171 + 365, dur: 6000, ease: "linear", update: v => { doy = Math.round(v) % 365; sl.input.value = doy; update(); } }); doy = 171; sl.set(171); s.sfx.ding(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Berlin: Sommer und Winter",
        say: "Am 21. Juni ist der Tag in Berlin fast 17 Stunden lang, am 21. Dezember nicht einmal 8 Stunden. Und die Sonne steht im Winter viel tiefer.",
        build(s) {
          const mk = (title, rise, set, riseL, setL, len, alt, shadow, col) => {
            const bar = s.svg(500, 70);
            bar.append(s.el("rect", { x: 10, y: 8, width: 480, height: 30, rx: 8, fill: "#2b3350" }));
            const day = s.el("rect", { x: 10 + rise / 24 * 480, y: 8, width: (set - rise) / 24 * 480, height: 30, rx: 6, fill: "#ffd94a", class: "later" });
            bar.append(day);
            [0, 6, 12, 18, 24].forEach(h => bar.append(s.el("text", { x: 10 + h / 24 * 480, y: 62, "text-anchor": h === 0 ? "start" : h === 24 ? "end" : "middle", class: "lbl", style: { fontSize: "19px" }, text: h + " Uhr" })));
            const times = s.h("p", { class: "small later" }, `Aufgang ${riseL} – Untergang ${setL}`);
            const big = s.h("p", { class: "big mono later", style: { color: col } }, len);
            const sv = s.svg(500, 190);
            const gx = 70, gy = 160, k = 50; // 1 m = 50 px
            sv.append(s.el("line", { x1: 0, y1: gy, x2: 500, y2: gy, stroke: "#7fb36a", "stroke-width": 6 }));
            // child 1,4 m
            const ch = 1.4 * k;
            sv.append(s.el("circle", { cx: gx, cy: gy - ch + 10, r: 10, fill: "#1b2740" }), s.el("line", { x1: gx, y1: gy - ch + 20, x2: gx, y2: gy, stroke: "#1b2740", "stroke-width": 8, "stroke-linecap": "round" }));
            const shLen = Math.min(410, shadow * k);
            const sh = s.el("rect", { x: gx, y: gy - 4, width: shLen, height: 8, rx: 4, fill: "#5d6678", opacity: .6, class: "later" });
            const rl = Math.min((ch + 40) / Math.sin(alt * RAD), (gx + shLen - 6) / Math.cos(alt * RAD));
            const ray = s.el("line", { x1: gx + shLen, y1: gy, x2: gx + shLen - Math.cos(alt * RAD) * rl, y2: gy - Math.sin(alt * RAD) * rl, stroke: "#ee7a1a", "stroke-width": 4, "stroke-linecap": "round", class: "later" });
            const altT = s.el("text", { x: 490, y: 30, "text-anchor": "end", class: "lbl later", text: `Sonne mittags: ${alt}° hoch` });
            const shT = s.el("text", { x: 490, y: 60, "text-anchor": "end", class: "lbl later", text: `Schatten: ${s.fmt(shadow, 1)} m` });
            sv.append(sh, ray, altT, shT);
            const box = s.h("div", { class: "card stack", style: { gap: "6px", padding: "14px 18px" } }, s.h("p", { class: "h2" }, title), bar, times, big, sv);
            return { box, day, times, big, sh, ray, altT, shT };
          };
          const su = mk("21. Juni", 4 + 43 / 60, 21 + 33 / 60, "4:43", "21:33", "16 Std. 50 Min.", 61, 1.4 / Math.tan(61 * RAD), "var(--orange)");
          const wi = mk("21. Dezember", 8 + 14 / 60, 15 + 54 / 60, "8:14", "15:54", "7 Std. 39 Min.", 14, 1.4 / Math.tan(14 * RAD), "var(--blue)");
          const note = s.h("p", { class: "small pencil later" }, "Ein Kind (1,4 m) steht mittags in der Sonne. Uhrzeiten: Juni mit Sommerzeit.");
          const merk = s.h("div", { class: "merk later" }, "Sommer: ", s.h("b", null, "lange Tage"), " und ", s.h("b", null, "hohe Sonne"), " → viel Wärme. Winter: kurze Tage und tiefe Sonne → wenig Wärme.");
          s.add(s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "cols", style: { gap: "20px" } }, su.box, wi.box), note, merk));
          s.sfx.pop();
          for (const c of [su, wi]) {
            s.step(async () => {
              s.sfx.whoosh(); await s.show(c.day, "fade"); s.show(c.times, "fade");
              s.sfx.ding(); await s.show(c.big, "pop");
            });
          }
          s.step(async () => {
            for (const c of [su, wi]) { s.sfx.zap(); await s.show(c.ray, "draw"); s.sfx.swoosh(); await s.show(c.sh, "left"); s.show([c.altT, c.shT], "fade"); }
            s.show(note, "fade"); s.say("Im Winter steht die Sonne tief. Dein Schatten ist dann viel länger.");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Liegt es am Abstand? Nein!",
        say: "Anfang Januar ist die Erde der Sonne am nächsten – und trotzdem ist bei uns Winter. Es liegt am Winkel, mit dem das Sonnenlicht ankommt.",
        build(s) {
          const sv = s.svg(520, 300);
          sv.append(s.el("ellipse", { cx: 260, cy: 140, rx: 230, ry: 110, fill: "none", stroke: "#c8d3de", "stroke-width": 3, "stroke-dasharray": "8 8" }));
          sv.append(s.el("circle", { cx: 268, cy: 140, r: 34, fill: "#ffcf3f" }));
          const jan = s.el("g", { class: "later" }, s.el("circle", { cx: 30, cy: 140, r: 14, fill: "#1d5bd0" }), s.el("text", { x: 34, y: 185, "text-anchor": "start", class: "lbl", text: "Anfang Juli" }), s.el("text", { x: 34, y: 212, "text-anchor": "start", class: "lbl", style: { fill: "#ee7a1a", fontWeight: 700 }, text: "152 Mio. km" }));
          const jul = s.el("g", { class: "later" }, s.el("circle", { cx: 490, cy: 140, r: 14, fill: "#1d5bd0" }), s.el("text", { x: 490, y: 185, "text-anchor": "end", class: "lbl", text: "Anfang Januar" }), s.el("text", { x: 490, y: 212, "text-anchor": "end", class: "lbl", style: { fill: "#1d5bd0", fontWeight: 700 }, text: "147 Mio. km" }));
          const cap = s.el("text", { x: 260, y: 288, "text-anchor": "middle", class: "lbl later", text: "Die Bahn ist fast ein Kreis." });
          sv.append(jan, jul, cap);
          // flashlight demo
          const fl = s.svg(520, 230);
          const lamp = (x0, ang, w, txt, col) => {
            const gEl = s.el("g", { class: "later" });
            const L = 150, a = ang * RAD;
            const tipX = x0, tipY = 170;
            const sx = tipX - Math.cos(a) * L, sy = tipY - Math.sin(a) * L;
            const spread = w / 2;
            gEl.append(s.el("polygon", { points: `${sx},${sy} ${tipX - spread},${tipY} ${tipX + spread},${tipY}`, fill: "#ffd94a", opacity: .55 }));
            gEl.append(s.el("rect", { x: sx - 22, y: sy - 10, width: 44, height: 20, rx: 6, fill: "#5d6678", transform: `rotate(${ang} ${sx} ${sy})` }));
            gEl.append(s.el("line", { x1: tipX - spread, y1: tipY, x2: tipX + spread, y2: tipY, stroke: col, "stroke-width": 10, "stroke-linecap": "round" }));
            gEl.append(s.el("text", { x: x0, y: 210, "text-anchor": "middle", class: "lbl", text: txt }));
            return gEl;
          };
          fl.append(s.el("line", { x1: 0, y1: 170, x2: 520, y2: 170, stroke: "#7fb36a", "stroke-width": 4 }));
          const l1 = lamp(130, 61, 70, "Sommer: steiles Licht", "#dc3b2a");
          const l2 = lamp(380, 14, 230, "Winter: flaches Licht", "#1d5bd0");
          fl.append(l1, l2);
          const merk = s.h("div", { class: "merk later" }, "Steiles Licht wärmt ", s.h("b", null, "stärker"), " – die Energie trifft auf eine kleine Fläche. Flaches Licht verteilt sich und wärmt ", s.h("b", null, "weniger"), ".");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "In Australien (Südhalbkugel) ist es genau umgekehrt: Dort feiern viele Weihnachten im Sommer am Strand."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", gap: "28px", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "8px" } }, sv, fl),
            s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Ist im Sommer die Sonne einfach näher? Schauen wir nach!"), merk, lf)));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.pop(); await s.show(jul, "pop"); s.sfx.pop(); await s.show(jan, "pop"); s.show(cap, "fade"); s.say("Im Januar sind wir der Sonne am nächsten. Und trotzdem ist Winter!"); });
          s.step(async () => { s.sfx.zap(); await s.show(l1, "fade"); s.sfx.zap(); await s.show(l2, "fade"); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Der Mond leuchtet nicht selbst",
        say: "Der Mond ist wie ein großer Spiegel aus Stein. Er wirft das Licht der Sonne zu uns zurück.",
        build(s) {
          const sv = s.svg(1100, 250);
          sv.append(s.el("rect", { x: 0, y: 0, width: 1100, height: 250, rx: 18, fill: "#0e1633" }));
          sv.append(s.el("circle", { cx: -40, cy: 125, r: 130, fill: "#ffcf3f" }));
          sv.append(s.el("text", { x: 10, y: 140, class: "lbl", style: { fill: "#7a4a00" }, text: "Sonne" }));
          const moon = s.el("g", null, s.el("circle", { cx: 560, cy: 70, r: 34, fill: "#3a4266" }), s.el("path", { d: "M560 36 A34 34 0 0 0 560 104 Z", fill: "#f4f1e3" }));
          sv.append(moon, s.el("text", { x: 610, y: 78, class: "lbl", style: { fill: "#fff" }, text: "Mond" }));
          const earth = s.el("g", null, s.el("circle", { cx: 980, cy: 170, r: 46, fill: "#3f8ad8" }), s.el("path", { d: "M980 124 A46 46 0 0 0 980 216 Z", fill: "#7fc1ff", opacity: .7 }));
          sv.append(earth, s.el("text", { x: 980, y: 242, "text-anchor": "middle", class: "lbl", style: { fill: "#fff" }, text: "Erde (du)" }));
          const r1 = s.el("line", { x1: 95, y1: 90, x2: 524, y2: 70, stroke: "#ffd94a", "stroke-width": 5, class: "later" });
          const r2 = s.el("line", { x1: 528, y1: 80, x2: 940, y2: 160, stroke: "#f4f1e3", "stroke-width": 5, "stroke-dasharray": "12 8", class: "later" });
          const lb1 = s.el("text", { x: 300, y: 64, "text-anchor": "middle", class: "lbl later", style: { fill: "#ffd94a" }, text: "Sonnenlicht" });
          const lb2 = s.el("text", { x: 760, y: 160, "text-anchor": "middle", class: "lbl later", style: { fill: "#f4f1e3" }, text: "zurückgeworfen" });
          sv.append(r1, r2, lb1, lb2);
          // scale strip: 30 Earths between Earth and Moon
          const st = s.svg(1100, 90);
          st.append(s.el("circle", { cx: 34, cy: 40, r: 16, fill: "#3f8ad8" }), s.el("text", { x: 34, y: 82, "text-anchor": "middle", class: "lbl", text: "Erde" }));
          const ED = 32, moonX = 34 + 30.17 * ED;
          st.append(s.el("circle", { cx: moonX, cy: 40, r: 4.4, fill: "#8a90a6" }), s.el("text", { x: moonX, y: 82, "text-anchor": "middle", class: "lbl", text: "Mond" }));
          const dots = [];
          for (let i = 1; i <= 29; i++) { const c = s.el("circle", { cx: 34 + i * ED, cy: 40, r: 15, fill: "none", stroke: "#1d5bd0", "stroke-width": 2, opacity: .7, class: "later" }); dots.push(c); st.append(c); }
          const stT = s.el("text", { x: 550, y: 82, "text-anchor": "middle", class: "lbl later", text: "etwa 30 Erden passen dazwischen" });
          st.append(stT);
          const facts = s.h("div", { class: "cols3 later" },
            s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Abstand"), s.h("p", { class: "h2 mono" }, "384.400 km"), s.h("p", { class: "small" }, "im Durchschnitt")),
            s.h("div", { class: "card", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Durchmesser"), s.h("p", { class: "h2 mono" }, "3.474 km"), s.h("p", { class: "small" }, "gut ein Viertel der Erde")),
            s.h("div", { class: "life", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"), s.h("p", { class: "small" }, "Fahrrad-Reflektor, Warnweste, Spiegel: Sie leuchten nur, wenn Licht auf sie fällt.")));
          s.add(s.h("div", { class: "stack", style: { gap: "22px", height: "100%", justifyContent: "center" } }, sv, st, facts));
          s.show(sv, "fade"); s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(r1, "draw"); s.show(lb1, "fade"); s.sfx.ding(); await s.show(r2, "draw"); s.show(lb2, "fade"); });
          s.step(async () => {
            s.sfx.whoosh();
            for (let i = 0; i < dots.length; i++) { s.show(dots[i], "pop"); if (i % 3 === 0) s.sfx.count(Math.min(14, i / 2)); await s.wait(60); }
            await s.show(stT, "fade"); s.say("Etwa 30 Erden passen zwischen Erde und Mond.");
          });
          s.step(async () => { s.sfx.pop(); await s.show(facts, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Die Mondphasen",
        say: "Der Mond kreist in etwa einem Monat um die Erde. Je nachdem, wo er steht, sehen wir mehr oder weniger von seiner beleuchteten Seite.",
        build(s) {
          const W = 460, H = 450, cx = 240, cy = 225, R = 150;
          const { canvas, g } = s.canvas(W, H);
          const v = s.canvas(230, 230);
          let day = 0;
          const draw = () => {
            starBg(g, W, H, 50, 5);
            const gr = g.createLinearGradient(0, 0, 60, 0); gr.addColorStop(0, "rgba(255,210,70,.9)"); gr.addColorStop(1, "rgba(255,210,70,0)");
            g.fillStyle = gr; g.fillRect(0, 0, 60, H);
            g.fillStyle = "#ffd94a"; g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillText("Sonne →", 8, 26);
            g.strokeStyle = "rgba(255,255,255,.35)"; g.setLineDash([5, 7]); g.lineWidth = 2;
            g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke(); g.setLineDash([]);
            g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(cx, cy, 30, 0, TAU); g.fill();
            g.fillStyle = "rgba(8,12,40,.6)"; g.beginPath(); g.arc(cx, cy, 30, -Math.PI / 2, Math.PI / 2); g.fill();
            const a = Math.PI + (day / 29.53) * TAU;
            const mx = cx + Math.cos(a) * R, my = cy - Math.sin(a) * R;
            g.fillStyle = "#2b3350"; g.beginPath(); g.arc(mx, my, 20, 0, TAU); g.fill();
            g.fillStyle = "#f4f1e3"; g.beginPath(); g.arc(mx, my, 20, Math.PI / 2, Math.PI * 1.5); g.fill();
            g.strokeStyle = "#ffd94a"; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(mx, my); g.stroke();
            g.fillStyle = "#cfd8ff"; g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillText("Erde", cx, cy + 52);
            // view from earth
            const el = (day / 29.53) * TAU;
            const k = (1 - Math.cos(el)) / 2;
            v.g.clearRect(0, 0, 230, 230);
            v.g.fillStyle = "#0e1633"; v.g.beginPath(); v.g.arc(115, 115, 115, 0, TAU); v.g.fill();
            phase(v.g, 115, 115, 92, k, (day % 29.53) < 14.765);
          };
          draw();
          const nm = s.h("p", { class: "h2", style: { color: "var(--unit)" } }, "Neumond");
          const dl = s.h("p", { class: "t mono" }, "Tag 0 von 29,5");
          const update = () => { draw(); nm.textContent = moonName(day); dl.textContent = `Tag ${s.fmt(day, 1)} von 29,5`; };
          update();
          const sl = s.slider({ label: "Tage nach Neumond", min: 0, max: 29.5, step: 0.5, value: 0, fmt: x => s.fmt(x, 1), onInput: x => { day = x; update(); } });
          const play = async () => { s.sfx.whoosh(); let last = -1; await s.tween({ from: 0, to: 29.5, dur: 6500, ease: "linear", update: x => { day = x; update(); const q = Math.round(x / 29.53 * 8); if (q !== last) { last = q; s.sfx.note(q * 2, .15); } } }); sl.set(29.5); s.sfx.ding(); };
          const btn = s.h("button", { class: "btn solid", onclick: play }, "Einen Monat abspielen");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Von Neumond zu Neumond: etwa ", s.h("b", null, "29,5 Tage"), ". Die Hälfte zur Sonne ist immer hell.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "460px 1fr", alignItems: "center", height: "100%", gap: "24px" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, s.h("p", { class: "small pencil" }, "Von oben gesehen:"), canvas),
            s.h("div", { class: "stack", style: { gap: "12px" } },
              s.h("div", { class: "row", style: { gap: "20px", flexWrap: "nowrap" } }, v.canvas, s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "small pencil" }, "So sehen wir ihn:"), nm, dl)),
              sl, s.h("div", { class: "row" }, btn), merk)));
          s.show(canvas, "zoom"); s.sfx.pop();
          s.step(async () => { await play(); });
          s.step(async () => { s.sfx.ding(); await s.tween({ from: 0, to: 14.5, dur: 1800, update: x => { day = Math.round(x * 2) / 2; update(); } }); sl.set(14.5); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "Mondphasen im Alltag",
        say: "Bei uns gilt: Ist der Mond rechts hell, nimmt er zu. Ist er links hell, nimmt er ab.",
        build(s) {
          const moonPic = (k, right) => { const c = s.canvas(110, 110); c.g.fillStyle = "#0e1633"; c.g.beginPath(); c.g.arc(55, 55, 55, 0, TAU); c.g.fill(); phase(c.g, 55, 55, 42, k, right); return c.canvas; };
          const cards = [
            s.h("div", { class: "ex later row", style: { flexWrap: "nowrap", alignItems: "center" } }, moonPic(0.3, true),
              s.h("div", null, s.h("span", { class: "exlabel" }, "Rechts hell"), s.h("p", { class: "t" }, "Der Mond ", s.h("b", null, "nimmt zu"), ". Du siehst ihn am Abend."))),
            s.h("div", { class: "ex later row", style: { flexWrap: "nowrap", alignItems: "center" } }, moonPic(0.3, false),
              s.h("div", null, s.h("span", { class: "exlabel" }, "Links hell"), s.h("p", { class: "t" }, "Der Mond ", s.h("b", null, "nimmt ab"), ". Er ist am Morgen gut zu sehen."))),
            s.h("div", { class: "life later row", style: { flexWrap: "nowrap", alignItems: "center" } }, moonPic(1, true),
              s.h("div", null, s.h("span", { class: "exlabel" }, "Vollmond"), s.h("p", { class: "small" }, "Er steht der Sonne gegenüber: Er geht auf, wenn die Sonne untergeht."))),
            s.h("div", { class: "life later row", style: { flexWrap: "nowrap", alignItems: "center" } }, moonPic(0.5, true),
              s.h("div", null, s.h("span", { class: "exlabel" }, "Monat"), s.h("p", { class: "small" }, "Das Wort „Monat“ kommt von „Mond“. Ein Mond-Umlauf dauert ungefähr einen Monat."))),
          ];
          const note = s.h("p", { class: "small pencil later" }, "Den Halbmond siehst du oft auch am Tag – zum Beispiel nachmittags auf dem Schulweg.");
          s.add(s.h("div", { class: "stack", style: { gap: "16px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols", style: { gap: "18px" } }, ...cards), note));
          s.sfx.pop(); s.show(cards[0], "up");
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(cards[3], "up"); s.show(note, "fade"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Sonnen- und Mondfinsternis",
        say: "Bei einer Sonnenfinsternis schiebt sich der Mond vor die Sonne. Bei einer Mondfinsternis wandert der Mond in den Schatten der Erde.",
        build(s) {
          const W = 1100, H = 330;
          const { canvas, g } = s.canvas(W, H);
          let mode = "sofi", mPos = 0, shade = 0; // mPos: 0 = off-line, 1 = in line
          const draw = () => {
            starBg(g, W, H, 60, 9);
            sunGlow(g, 40, 165, 120);
            const ex = 700, ey = 165, er = 54;
            // moon position
            let mx, my;
            if (mode === "sofi") { mx = 470; my = ey - (1 - mPos) * 100; } else { mx = 960; my = ey - (1 - mPos) * 100; }
            // shadows
            if (shade > 0) {
              g.fillStyle = `rgba(0,0,0,${0.6 * shade})`;
              if (mode === "sofi") { g.beginPath(); g.moveTo(mx, my - 18); g.lineTo(ex - er + 6, ey - 6); g.lineTo(ex - er + 6, ey + 6); g.lineTo(mx, my + 18); g.closePath(); g.fill(); }
              else { g.beginPath(); g.moveTo(ex, ey - er); g.lineTo(1100, ey - 34); g.lineTo(1100, ey + 34); g.lineTo(ex, ey + er); g.closePath(); g.fill(); }
            }
            g.fillStyle = "#3f8ad8"; g.beginPath(); g.arc(ex, ey, er, 0, TAU); g.fill();
            g.fillStyle = "rgba(8,12,40,.55)"; g.beginPath(); g.arc(ex, ey, er, -Math.PI / 2, Math.PI / 2); g.fill();
            if (mode === "sofi" && shade > 0.5) { g.fillStyle = "#000"; g.beginPath(); g.arc(ex - er + 4, ey, 6, 0, TAU); g.fill(); }
            const inShadow = mode === "mofi" ? shade : 0;
            g.fillStyle = inShadow > 0.5 ? `rgb(${170},${70},${45})` : "#e9e5d3"; g.beginPath(); g.arc(mx, my, 18, 0, TAU); g.fill();
            g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "center"; g.fillStyle = "#fff";
            g.fillText("Sonne", 80, 316); g.fillText("Erde", ex, ey + er + 30); g.fillText("Mond", mx, my - 28);
          };
          draw();
          const sofiC = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Sonnenfinsternis – bei Neumond"), s.h("p", { class: "small" }, "Sonne – Mond – Erde in einer Linie. Der Mond verdeckt die Sonne, sein Schatten fällt auf die Erde."));
          const mofiC = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Mondfinsternis – bei Vollmond"), s.h("p", { class: "small" }, "Sonne – Erde – Mond in einer Linie. Der Mond liegt im Erdschatten und wirkt oft rötlich."));
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Am 12. August 2026 verdeckte der Mond in Berlin etwa 85 % der Sonne. Nie ohne Finsternisbrille in die Sonne schauen!"));
          const run = async m => { mode = m; mPos = 0; shade = 0; draw(); s.sfx.whoosh(); await s.tween({ from: 0, to: 1, dur: 1500, update: x => { mPos = x; draw(); } }); s.sfx.drum(); await s.tween({ from: 0, to: 1, dur: 700, update: x => { shade = x; draw(); } }); };
          const b1 = s.h("button", { class: "btn", onclick: () => run("sofi") }, "Sonnenfinsternis");
          const b2 = s.h("button", { class: "btn", onclick: () => run("mofi") }, "Mondfinsternis");
          s.add(s.h("div", { class: "stack", style: { gap: "14px" } }, canvas, s.h("div", { class: "row" }, b1, b2, s.h("p", { class: "small pencil" }, "Antippen und zuschauen (nicht maßstabsgetreu).")),
            s.h("div", { class: "cols3", style: { gap: "16px" } }, sofiC, mofiC, lf)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { await run("sofi"); s.sfx.pop(); await s.show(sofiC, "up"); });
          s.step(async () => { await run("mofi"); s.sfx.pop(); await s.show(mofiC, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Die acht Planeten",
        say: "Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel. Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun.",
        build(s) {
          const P = [
            ["Merkur", 4879, "#a8a29a", "Mein"], ["Venus", 12104, "#e8c27a", "Vater"], ["Erde", 12756, "#3f8ad8", "erklärt"], ["Mars", 6792, "#d4643a", "mir"],
            ["Jupiter", 142984, "#d9a873", "jeden"], ["Saturn", 120536, "#e3cc8f", "Sonntag"], ["Uranus", 51118, "#8fd3e0", "unseren"], ["Neptun", 49528, "#4b6fd8", "Nachthimmel"],
          ];
          const k = 118 / 142984;
          const cells = P.map(([n, d, c, w]) => {
            const sv = s.svg(130, 130);
            const r = Math.max(2.2, d * k / 2);
            if (n === "Saturn") sv.append(s.el("ellipse", { cx: 65, cy: 65, rx: r * 1.28, ry: r * 0.32, fill: "none", stroke: "#bfa56a", "stroke-width": 6 }));
            sv.append(s.el("circle", { cx: 65, cy: 65, r, fill: c }));
            if (n === "Jupiter") sv.append(s.el("rect", { x: 65 - r * 0.9, y: 52, width: r * 1.8, height: 8, fill: "#b9825a", opacity: .6 }), s.el("rect", { x: 65 - r * 0.95, y: 72, width: r * 1.9, height: 6, fill: "#b9825a", opacity: .5 }));
            const cell = s.h("div", { class: "stack later", style: { alignItems: "center", gap: "2px" } }, sv,
              s.h("p", { class: "t", style: { fontWeight: 700 } }, n),
              s.h("p", { class: "hand", style: { fontSize: "27px", color: "var(--red)" } }, w));
            return cell;
          });
          const sentence = s.h("p", { class: "h2 later", style: { textAlign: "center" } },
            ...P.map(([, , , w], i) => s.h("span", null, s.h("span", { class: "hl" }, w[0]), w.slice(1) + (i < 7 ? " " : "."))));
          const pluto = s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, "Und Pluto?"), s.h("p", { class: "small" }, "Seit 2006 zählt Pluto als ", s.h("b", null, "Zwergplanet"), ". Er ist mit 2.377 km Durchmesser sogar kleiner als unser Mond."));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "8 Planeten kreisen um die Sonne. Die Größen hier stimmen im Verhältnis.");
          s.add(s.h("div", { class: "stack", style: { gap: "22px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols4", style: { gridTemplateColumns: "repeat(8, 1fr)", gap: "4px" } }, ...cells), sentence,
            s.h("div", { class: "cols", style: { gap: "18px", gridTemplateColumns: "1.3fr 1fr" } }, pluto, merk)));
          s.step(async () => { for (let i = 0; i < 8; i++) { s.sfx.note([0, 2, 4, 5, 7, 9, 11, 12][i], .25); await s.show(cells[i], "pop"); } });
          s.step(async () => { s.sfx.scribble(); await s.show(sentence, "up"); s.say("Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel."); });
          s.step(async () => { s.sfx.boing(); await s.show(pluto, "up"); s.sfx.ding(); await s.show(merk, "up"); });
          s.sfx.whoosh(); s.show(cells[0], "pop");
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Wie groß ist die Sonne?",
        say: "Die Sonne ist riesig. 109 Erden passen nebeneinander quer durch die Sonne.",
        build(s) {
          const sv = s.svg(700, 370);
          const R = 330, cx = 350, cy = 352;
          const sun = s.el("path", { d: `M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy} Z`, fill: "#ffcf3f", stroke: "#f2a516", "stroke-width": 4 });
          sv.append(sun, s.el("text", { x: cx, y: 150, "text-anchor": "middle", class: "hlbl", style: { fill: "#b25c00", fontSize: "40px" }, text: "Sonne" }));
          const ed = 2 * R / 109;
          const earths = [];
          for (let i = 0; i < 109; i++) { const c = s.el("circle", { cx: cx - R + ed / 2 + i * ed, cy: cy - ed / 2 - 2, r: ed / 2 - 0.3, fill: "#1d5bd0", class: "later" }); earths.push(c); sv.append(c); }
          const arrow = s.el("g", { class: "later" }, s.el("line", { x1: cx - R + ed / 2, y1: cy - 70, x2: cx - R + ed / 2, y2: cy - 12, stroke: "#1b2740", "stroke-width": 3 }),
            s.el("text", { x: cx - R + 8, y: cy - 80, class: "lbl", text: "1 Erde" }));
          sv.append(arrow);
          const cnt = s.h("p", { class: "huge mono", style: { color: "var(--unit)" } }, "0");
          const right = s.h("div", { class: "stack", style: { gap: "10px" } }, s.h("p", { class: "t" }, "Erden quer durch die Sonne:"), cnt,
            s.h("p", { class: "small later", id: "u7diam" }, "Durchmesser der Sonne: etwa 1,39 Millionen km"));
          const merk = s.h("div", { class: "merk later" }, "Die Sonne ist etwa ", s.h("b", null, "109-mal"), " so breit wie die Erde. Sie ist ein ", s.h("b", null, "Stern"), " – eine riesige, heiße Gaskugel.");
          const lf = life(s, "Zum Vergleich", s.h("p", { class: "small" }, "Jupiter, der größte Planet, ist gut 11 Erden breit. Unser Mond ist nur gut ein Viertel so breit wie die Erde."));
          s.add(s.h("div", { class: "stack", style: { gap: "24px", height: "100%", justifyContent: "center" } }, s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "center", gap: "24px" } }, sv, right),
            s.h("div", { class: "cols", style: { gap: "18px" } }, merk, lf)));
          s.show(sv, "zoom"); s.sfx.pop();
          s.step(async () => {
            s.sfx.pop(); s.show(arrow, "fade"); s.show(earths[0], "pop"); cnt.textContent = "1"; await s.wait(400);
            let shown = 1;
            await s.tween({ from: 1, to: 109, dur: 2600, ease: "linear", update: v => { const n = Math.round(v); while (shown < n) { earths[shown].classList.remove("later"); shown++; if (shown % 10 === 0) s.sfx.count(shown / 10); } cnt.textContent = String(n); } });
            for (; shown < 109; shown++) earths[shown].classList.remove("later");
            cnt.textContent = "109"; s.sfx.success(); s.show(right.lastChild, "fade");
          });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Die Sonne als Fußball",
        say: "Stell dir vor, die Sonne ist ein Fußball am Fernsehturm. Dann ist die Erde ein Stecknadelkopf, 24 Meter entfernt. Neptun liegt schon 710 Meter weit weg.",
        build(s) {
          const PL = [ // name, distance m, size text
            ["Merkur", 9.2, "0,8 mm"], ["Venus", 17.1, "1,9 mm"], ["Erde", 23.6, "2 mm"], ["Mars", 36.0, "1,1 mm"],
            ["Jupiter", 123, "2,3 cm"], ["Saturn", 227, "1,9 cm"], ["Uranus", 454, "8 mm"], ["Neptun", 710, "8 mm"],
          ];
          // near track 0–40 m
          const a = s.svg(1100, 130);
          const ax = m => 40 + m * 25.5;
          a.append(s.el("line", { x1: 30, y1: 60, x2: 1085, y2: 60, stroke: "#c8d3de", "stroke-width": 4 }));
          a.append(s.el("circle", { cx: 40, cy: 60, r: 14, fill: "#ffcf3f", stroke: "#f2a516", "stroke-width": 3 }), s.el("text", { x: 40, y: 26, "text-anchor": "start", class: "lbl", text: "Fußball-Sonne (22 cm)" }));
          [0, 10, 20, 30, 40].forEach(m => a.append(s.el("text", { x: ax(m), y: 122, "text-anchor": m === 0 ? "start" : "middle", class: "lbl", style: { fill: "#5d6678" }, text: m + " m" })));
          const near = PL.slice(0, 4).map(([n, d, sz], i) => {
            const gg = s.el("g", { class: "later" }, s.el("circle", { cx: ax(d), cy: 60, r: 6, fill: ["#a8a29a", "#e8c27a", "#1d5bd0", "#d4643a"][i] }),
              s.el("text", { x: ax(d), y: i % 2 ? 36 : 94, "text-anchor": "middle", class: "lbl", text: `${n} · ${sz}` }));
            a.append(gg); return gg;
          });
          // far track 0–750 m
          const b = s.svg(1100, 150);
          const bx = m => 40 + m * 1.38;
          b.append(s.el("line", { x1: 30, y1: 60, x2: 1085, y2: 60, stroke: "#c8d3de", "stroke-width": 4 }));
          b.append(s.el("rect", { x: 34, y: 50, width: bx(40) - 34, height: 20, rx: 6, fill: "#ffd94a", opacity: .6 }));
          [0, 200, 400, 600].forEach(m => b.append(s.el("text", { x: bx(m), y: 142, "text-anchor": m === 0 ? "start" : "middle", class: "lbl", style: { fill: "#5d6678" }, text: m + " m" })));
          const far = PL.slice(4).map(([n, d, sz], i) => {
            const gg = s.el("g", { class: "later" }, s.el("circle", { cx: bx(d), cy: 60, r: 8, fill: ["#d9a873", "#e3cc8f", "#8fd3e0", "#4b6fd8"][i] }),
              s.el("text", { x: bx(d) - (i === 3 ? 30 : 0), y: i % 2 ? 30 : 100, "text-anchor": "middle", class: "lbl", text: `${n} · ${sz}` }));
            b.append(gg); return gg;
          });
          const walker = s.el("g", null, s.el("circle", { cx: 0, cy: -8, r: 7, fill: "#dc3b2a" }), s.el("line", { x1: 0, y1: -2, x2: 0, y2: 16, stroke: "#dc3b2a", "stroke-width": 5, "stroke-linecap": "round" }));
          walker.setAttribute("transform", `translate(${bx(0)} 108)`);
          b.append(walker);
          const wl = s.h("p", { class: "t" }, "Du stehst bei der Sonne.");
          const sl = s.slider({ label: "Spaziergang vom Fernsehturm", min: 0, max: 720, value: 0, step: 5, fmt: v => s.fmt(v) + " m", onInput: v => {
            walker.setAttribute("transform", `translate(${bx(v)} 108)`);
            const passed = PL.filter(p => p[1] <= v).map(p => p[0]);
            wl.textContent = passed.length ? `Schon vorbei an: ${passed.slice(-3).join(", ")}${passed.length > 3 ? " …" : ""}` : "Du stehst bei der Sonne.";
          } });
          const lf = life(s, "Und der nächste Stern?", s.h("p", { class: "small" }, "Proxima Centauri wäre in diesem Modell etwa 6.300 km entfernt – ungefähr so weit wie von Berlin nach New York! Der Mond: 6 cm neben dem Stecknadelkopf."));
          s.add(s.h("div", { class: "stack", style: { gap: "10px", height: "100%", justifyContent: "center" } },
            s.h("p", { class: "small pencil" }, "Nah dran: die ersten 40 Meter"), a,
            s.h("p", { class: "small pencil" }, "Weit weg: bis 750 Meter (gelb = die 40 Meter von oben)"), b,
            s.h("div", { class: "cols", style: { gridTemplateColumns: "430px 1fr", gap: "20px", alignItems: "start" } }, s.h("div", { class: "stack", style: { gap: "4px" } }, sl, wl), lf)));
          s.sfx.pop();
          s.step(async () => { for (const n of near) { s.sfx.pop(); await s.show(n, "pop"); } s.say("Die Erde ist nur 2 Millimeter groß, 24 Meter vom Ball entfernt."); });
          s.step(async () => { for (const n of far) { s.sfx.whoosh(); await s.show(n, "pop"); } s.say("Neptun liegt 710 Meter weit weg. Das ist fast doppelt so weit, wie der Fernsehturm hoch ist."); });
          s.step(async () => { s.sfx.ding(); await s.show(lf, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Sterne und Sternbilder",
        say: "Sterne leuchten selbst, wie unsere Sonne. Planeten werden nur angestrahlt. Mit dem Großen Wagen findest du den Polarstern und damit Norden.",
        build(s) {
          const W = 540, H = 520;
          const { canvas, g } = s.canvas(W, H);
          const S = { Dubhe: [175, 365], Merak: [140, 430], Phecda: [225, 470], Megrez: [250, 405], Alioth: [315, 420], Mizar: [370, 445], Alkaid: [430, 495] };
          const pol = [S.Dubhe[0] + 5 * (S.Dubhe[0] - S.Merak[0]), S.Dubhe[1] + 5 * (S.Dubhe[1] - S.Merak[1])];
          let lines = 0, pointer = 0, polShow = 0;
          const draw = t => {
            starBg(g, W, H, 110, 21);
            const tw = n => 3.2 + Math.sin(t * 3 + n) * 0.8;
            if (lines > 0) {
              g.strokeStyle = "rgba(160,190,255,.8)"; g.lineWidth = 2.5;
              const seq = ["Alkaid", "Mizar", "Alioth", "Megrez", "Dubhe", "Merak", "Phecda", "Megrez"];
              g.beginPath(); g.moveTo(...S[seq[0]]);
              const n = Math.floor(lines * (seq.length - 1));
              for (let i = 1; i <= n; i++) g.lineTo(...S[seq[i]]);
              g.stroke();
            }
            if (pointer > 0) {
              g.strokeStyle = "#ffd94a"; g.setLineDash([10, 8]); g.lineWidth = 3;
              g.beginPath(); g.moveTo(...S.Merak); g.lineTo(S.Merak[0] + (pol[0] - S.Merak[0]) * pointer, S.Merak[1] + (pol[1] - S.Merak[1]) * pointer); g.stroke(); g.setLineDash([]);
              for (let i = 1; i <= 4; i++) if (pointer * 6 >= i + 1) { const x = S.Dubhe[0] + i * (S.Dubhe[0] - S.Merak[0]), y = S.Dubhe[1] + i * (S.Dubhe[1] - S.Merak[1]); g.fillStyle = "#ffd94a"; g.font = "700 19px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillText(String(i) + "×", x + 12, y + 6); }
            }
            Object.values(S).forEach(([x, y], i) => { g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, tw(i), 0, TAU); g.fill(); });
            if (polShow > 0) {
              g.fillStyle = "#fff6c9"; g.beginPath(); g.arc(pol[0], pol[1], 5 + Math.sin(t * 2) * 0.8, 0, TAU); g.fill();
              g.font = "700 22px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillStyle = "#ffd94a"; g.fillText("Polarstern", pol[0] + 14, pol[1] + 7); g.fillText("= Norden", pol[0] + 14, pol[1] + 33);
            }
            g.font = "700 20px 'Atkinson Hyperlegible'"; g.textAlign = "left"; g.fillStyle = "#cfd8ff";
            if (lines >= 1) g.fillText("Großer Wagen", 290, 510);
          };
          s.loop(t => draw(t)); draw(0);
          const cmp = s.h("div", { class: "cols", style: { gap: "14px" } },
            s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Stern"), s.h("p", { class: "small" }, "leuchtet selbst – wie unsere Sonne. Sie ist der Stern, der uns am nächsten ist.")),
            s.h("div", { class: "card later", style: { padding: "12px 16px" } }, s.h("span", { class: "exlabel" }, "Planet"), s.h("p", { class: "small" }, "leuchtet nicht selbst. Er wird von der Sonne angestrahlt, wie der Mond.")));
          const sb = s.h("p", { class: "t later" }, "Ein ", s.h("b", null, "Sternbild"), " ist eine Gruppe von Sternen, die wir in Gedanken verbinden.");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Verlängere die hintere Wagenkante etwa ", s.h("b", null, "5-mal"), " – dort steht der ", s.h("b", null, "Polarstern"), ". Er zeigt nach Norden.");
          const lf = life(s, "Im Alltag", s.h("p", { class: "small" }, "Den Großen Wagen siehst du in Berlin in jeder klaren Nacht des Jahres. Seefahrer fanden mit dem Polarstern den Weg."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", gap: "24px", alignItems: "center", height: "100%" } }, canvas,
            s.h("div", { class: "stack", style: { gap: "12px" } }, cmp, sb, merk, lf)));
          s.show(canvas, "fade"); s.sfx.pop();
          s.step(async () => { s.show(cmp.children[0], "up"); s.sfx.pop(); await s.wait(300); s.sfx.pop(); await s.show(cmp.children[1], "up"); });
          s.step(async () => { s.sfx.scribble(); s.show(sb, "fade"); await s.tween({ from: 0, to: 1, dur: 1600, ease: "linear", update: v => { lines = v; } }); lines = 1; s.sfx.ding(); });
          s.step(async () => { s.sfx.zap(); await s.tween({ from: 0, to: 1, dur: 2000, update: v => { pointer = v; } }); pointer = 1; polShow = 1; s.sfx.success(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(lf, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Himmel über Berlin",
        say: "In Berlin kannst du in die Sterne schauen: in der Archenhold-Sternwarte und im Zeiss-Großplanetarium. Und unser Kalender kommt direkt vom Himmel.",
        build(s) {
          const ico = (draw) => { const sv = s.svg(84, 84, { style: "flex: 0 0 84px" }); draw(sv); return sv; };
          const tele = ico(sv => sv.append(s.el("rect", { x: 10, y: 34, width: 62, height: 14, rx: 4, fill: "#1d5bd0", transform: "rotate(-30 42 41)" }), s.el("line", { x1: 40, y1: 46, x2: 26, y2: 80, stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 40, y1: 46, x2: 56, y2: 80, stroke: "#1b2740", "stroke-width": 4 })));
          const dome = ico(sv => sv.append(s.el("path", { d: "M8 70 A34 34 0 0 1 76 70 Z", fill: "#e4ecfb", stroke: "#1d5bd0", "stroke-width": 4 }), s.el("circle", { cx: 30, cy: 52, r: 3, fill: "#1d5bd0" }), s.el("circle", { cx: 48, cy: 42, r: 3, fill: "#1d5bd0" }), s.el("circle", { cx: 60, cy: 58, r: 3, fill: "#1d5bd0" }), s.el("rect", { x: 6, y: 70, width: 72, height: 8, fill: "#1d5bd0" })));
          const clock = ico(sv => sv.append(s.el("circle", { cx: 42, cy: 42, r: 34, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 42, y1: 42, x2: 42, y2: 18, stroke: "#1b2740", "stroke-width": 4 }), s.el("line", { x1: 42, y1: 42, x2: 58, y2: 50, stroke: "#dc3b2a", "stroke-width": 4 }), s.el("path", { d: "M70 20 a34 34 0 0 1 6 18", fill: "none", stroke: "#dc3b2a", "stroke-width": 4 })));
          const cal = ico(sv => { sv.append(s.el("rect", { x: 10, y: 14, width: 64, height: 60, rx: 8, fill: "#fff", stroke: "#1b2740", "stroke-width": 4 }), s.el("rect", { x: 10, y: 14, width: 64, height: 16, rx: 6, fill: "#dc3b2a" }), s.el("text", { x: 42, y: 64, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: "#1b2740", text: "29" })); });
          const card = (icon, label, txt, cls = "ex") => s.h("div", { class: cls + " later row", style: { flexWrap: "nowrap", alignItems: "center", gap: "18px", padding: "20px 22px" } }, icon, s.h("div", null, s.h("span", { class: "exlabel" }, label), s.h("p", { class: "t", style: { fontSize: "22px" } }, txt)));
          const cards = [
            card(tele, "Archenhold-Sternwarte", "Im Treptower Park steht seit 1896 die „Himmelskanone“: ein 21 m langes Linsenfernrohr – das längste bewegliche der Welt."),
            card(dome, "Zeiss-Großplanetarium", "An der Prenzlauer Allee (seit 1987) wird der Sternenhimmel an eine riesige Kuppel projiziert – auch am Tag."),
            card(clock, "Sommerzeit", "Am 25. Oktober 2026 wird die Uhr von 3 auf 2 Uhr zurückgestellt. Die Erde dreht sich nicht anders – nur unsere Uhr.", "life"),
            card(cal, "Kalender", "Tag = eine Erddrehung. Monat ≈ ein Mondumlauf. Jahr = ein Weg um die Sonne. 2028 hat wieder einen 29. Februar.", "life"),
          ];
          s.add(s.h("div", { class: "cols", style: { gap: "18px", height: "100%", alignContent: "center" } }, ...cards));
          s.sfx.pop(); s.show(cards[0], "up");
          s.step(async () => { s.sfx.pop(); await s.show(cards[1], "up"); });
          s.step(async () => { s.sfx.tick(); await s.show(cards[2], "up"); });
          s.step(async () => { s.sfx.success(); await s.show(cards[3], "up"); s.confetti(590, 400, 70); });
        },
      },
    ],
  });
})();
