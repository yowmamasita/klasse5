/* Kapitel 5 – Rechtschreib-Profi (s-Laute, das/dass, Doppelkonsonanten, ck/tz, Großschreibung,
   wörtliche Rede, Wörterbuch). Regeln geprüft am Amtlichen Regelwerk 2024 (§§ 2, 3, 4, 25, 57; Anführungszeichen E1). */
(() => {
  const C = "#dc2626";
  const SPK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6"/></svg>';

  if (!document.getElementById("u5css")) {
    const st = document.createElement("style");
    st.id = "u5css";
    st.textContent = `
.u5w{white-space:nowrap;display:inline-block;padding-bottom:.14em}
.u5L,.u5S{position:relative;display:inline-block}
.u5L::after{content:"";position:absolute;left:-3px;right:-3px;bottom:-.06em;height:5px;border-radius:3px;background:${C};transform:scaleX(0);transform-origin:left center;transition:transform .5s cubic-bezier(.2,1.3,.4,1)}
.u5S::after{content:"";position:absolute;left:50%;bottom:-.12em;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:var(--blue);transform:scale(0);transition:transform .45s cubic-bezier(.2,1.8,.4,1)}
.mk .u5L::after,.mk .u5S::after,.u5w.mk .u5L::after,.u5w.mk .u5S::after{transform:none}
.u5c{color:${C}}
.btn.u5say{font:700 30px/1.1 var(--f-display);min-height:62px;padding:0 16px;gap:10px;color:var(--ink);border-color:var(--line);background:#fff}
.btn.u5say svg{flex:none;color:${C}}
.btn.u5say.sm{font-size:26px;min-height:56px;padding:0 12px}
.u5tiles{display:flex;gap:8px;justify-content:center;align-items:center}
.u5tile{display:inline-grid;place-items:center;width:70px;height:88px;border-radius:12px;background:#fff;border:3px solid var(--line);font:800 56px/1 var(--f-display);overflow:hidden;flex:none}
.u5tile.hot{border-color:${C};color:${C}}
.u5tag{display:inline-block;font:700 19px/1.2 var(--f-display);padding:5px 12px;border-radius:999px;background:#fde6e3;color:${C};white-space:nowrap}
.u5tag.b{background:#e4ecfb;color:var(--blue)}
.u5tag.g{background:#e6f6ee;color:var(--green)}
.u5tag.v{background:#efe8fb;color:var(--violet)}
.u5slot{display:inline-block;min-width:120px;text-align:center;border-bottom:3px dashed var(--pencil);color:var(--pencil);font-weight:700;padding:0 6px}
.u5slot.ok{border-bottom-color:transparent;color:var(--blue);min-width:0;padding:0}
.u5slot.ss{border-bottom-color:transparent;color:${C};min-width:0;padding:0}
.u5phone{background:#1b2740;border-radius:36px;padding:14px;display:flex;flex-direction:column}
.u5screen{background:#efeae2;border-radius:24px;flex:1;display:flex;flex-direction:column;gap:12px;padding:12px 14px;overflow:hidden}
.u5bub{max-width:380px;border-radius:16px;padding:8px 14px;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.12)}
.u5bub.me{align-self:flex-end;background:#d9fdd3}
.u5bub .nm{font:700 19px/1.2 var(--f-display);color:var(--violet)}
.u5bub .tx{font-size:22px;line-height:1.3}
.u5bub .pr{font:600 19px/1.25 var(--f-body);color:var(--pencil);margin-top:2px}
.u5das{color:var(--blue);font-weight:700}
.u5dass{color:${C};font-weight:700}
.u5lamp{flex:none}
.u5beg{display:inline-block;font:700 28px/1 var(--f-display);color:#fff;background:var(--blue);border-radius:10px;padding:8px 12px}
.u5word{font:700 34px/1 var(--f-display)}
.u5cap{display:inline-block;color:${C}}
.u5sign{border-radius:16px;padding:22px 22px;min-height:170px;display:flex;flex-direction:column;gap:6px;cursor:pointer;position:relative}
.u5sign .st{font:800 30px/1.15 var(--f-display)}
.u5sign .fix{font:700 30px/1.1 var(--f-hand);color:#ffe14d}
.u5sign .why{font:600 19px/1.2 var(--f-body);opacity:.95}
.u5strike{text-decoration:line-through;text-decoration-color:#ff3b30;text-decoration-thickness:4px}
.u5bs{color:var(--blue)}
.u5wr{color:#9a3412}
.u5qm{color:${C};font-weight:800;font-size:1.25em;line-height:1}
.u5pz{color:var(--green);font-weight:800;font-size:1.3em;line-height:1}
.u5sent{font:600 30px/1.35 var(--f-body)}
.u5bubble{position:relative;background:#fff;border:3px solid var(--ink);border-radius:22px;padding:12px 16px;font:700 23px/1.25 var(--f-display);text-align:center}
.u5bubble::after{content:"";position:absolute;left:46px;bottom:-18px;border:9px solid transparent;border-top:12px solid var(--ink);border-bottom:0}
.u5abc{position:absolute;left:0;width:300px;height:64px;border-radius:14px;background:#fff;border:2px solid var(--line);display:flex;align-items:center;padding:0 20px;font:700 34px/1 var(--f-display);box-shadow:0 2px 0 var(--line)}
.u5abc span{display:inline-block;min-width:.2em;border-radius:6px}
.u5abc span.on{background:#ffd94a}
.u5abc span.on3{background:${C};color:#fff}
.u5page{background:#fffdf6;border:2px solid #d9cfb4;border-radius:10px;padding:14px 20px;box-shadow:4px 5px 0 rgba(0,0,0,.08)}
.u5lw{font:800 24px/1 var(--f-display);color:${C}}
.u5entry{font-size:22px;line-height:1.3;padding:3px 6px;border-radius:8px}
.u5entry.on{background:#ffd94a}
`;
    document.head.appendChild(st);
  }

  function speak(t, rate = 0.75) {
    if (Deck.fast || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "de-DE"; u.rate = rate; u.pitch = 1.05;
      const v = Deck.Voice.voice(); if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  /* {x} long vowel line, {!x} long + coloured, [x] short vowel dot, <x> coloured letters */
  function W(s, str, cls = "") {
    const el = s.h("span", { class: "u5w " + cls });
    const re = /\{([^}]*)\}|\[([^\]]*)\]|<([^>]*)>|([^{[<]+)/g;
    let m;
    while ((m = re.exec(str))) {
      if (m[1] != null) el.append(m[1][0] === "!" ? s.h("span", { class: "u5L u5c" }, m[1].slice(1)) : s.h("span", { class: "u5L" }, m[1]));
      else if (m[2] != null) el.append(s.h("span", { class: "u5S" }, m[2]));
      else if (m[3] != null) el.append(s.h("span", { class: "u5c" }, m[3]));
      else el.append(m[4]);
    }
    return el;
  }
  const plain = str => str.replace(/[{}\[\]<>!·]/g, "");
  const bump = el => { el.classList.remove("a-pop"); void el.getBoundingClientRect(); el.classList.add("a-pop"); };
  function sayBtn(s, str, o = {}) {
    const b = s.h("button", { class: "btn u5say " + (o.cls || "") });
    b.innerHTML = SPK;
    b.append(W(s, str, o.mk === false ? "" : "mk"));
    b.addEventListener("click", () => { s.sfx.pop(); bump(b); speak(o.speak || plain(str), o.rate || 0.7); });
    return b;
  }
  const P = (s, cls, ...k) => s.h("p", { class: cls }, ...k);
  /* tiles with one letter that "clones" itself (Wasser, Mutter) */
  function cloneTiles(s, letters, at) {
    const tiles = letters.map((l, i) => s.h("span", { class: "u5tile" + (i === at ? " hot" : "") }, l));
    const clone = s.h("span", { class: "u5tile hot later", style: { width: "0px", borderWidth: "0px" } }, letters[at]);
    tiles.splice(at + 1, 0, clone);
    const row = s.h("div", { class: "u5tiles" }, ...tiles);
    const run = async () => {
      clone.classList.remove("later");
      clone.style.borderWidth = "3px";
      await s.tween({ from: 0, to: 70, dur: 500, ease: "back", update: v => (clone.style.width = Math.max(0, v) + "px") });
    };
    return { row, run };
  }
  const ping = s => { s.sfx.note(12, 0.08, "sine"); setTimeout(() => s.alive && s.sfx.note(19, 0.12, "sine"), 90); };

  Deck.unit({
    id: "u5", num: 5, title: "Rechtschreib-Profi", color: C, soft: "#fde6e3",
    subtitle: "s, ss, ß – das oder dass – groß oder klein",
    blurb: "s-Laute, das/dass, Großschreibung, wörtliche Rede, Wörterbuch",
    goals: ["s, ss oder ß – hören und begründen", "das oder dass? Die Ersatzprobe", "Doppelte Mitlaute, ck und tz", "Großschreibung und das Begleiter-Signal", "Wörtliche Rede und Wörterbuch wie ein Profi"],
    icon(svg, el) {
      svg.append(el("rect", { x: 6, y: 8, width: 58, height: 54, rx: 12, fill: C, opacity: .14 }),
        el("text", { x: 35, y: 48, "text-anchor": "middle", "font-size": 38, "font-weight": 800, fill: C, text: "ß" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Summendes und zischendes s",
        say: "Leg die Hand an deinen Hals. Beim summenden s spürst du ein Kribbeln. Beim zischenden s nicht.",
        build(s) {
          const wave = (summ) => {
            const sv = s.svg(420, 100);
            const p = s.el("path", { d: "", fill: "none", stroke: summ ? "#138a5a" : C, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" });
            sv.append(s.el("line", { x1: 0, y1: 50, x2: 420, y2: 50, stroke: "#c8d3de", "stroke-width": 2 }), p);
            const draw = t => {
              let d = "M0 50";
              for (let x = 0; x <= 420; x += summ ? 6 : 7) {
                const y = summ ? 50 + Math.sin(x / 14 - t * 9) * 30 : 50 + (Math.random() * 2 - 1) * 26 * (0.6 + 0.4 * Math.sin(x / 40 + t * 3));
                d += ` L${x} ${y.toFixed(1)}`;
              }
              p.setAttribute("d", d);
            };
            draw(0);
            return { sv, draw };
          };
          const card = (summ) => {
            const w = wave(summ);
            const words = summ ? ["S[o]nne", "H{a}se", "R{o}se", "l{e}sen"] : ["B[u]s", "W[a]sser", "Str{a}ße", "F{u}ß"];
            const c = s.h("div", { class: "card stack later", style: { gap: "12px" } },
              s.h("div", null, P(s, "h2", summ ? "summendes s" : "zischendes s"), P(s, "small pencil", summ ? "stimmhaft – es summt wie eine Biene" : "stimmlos – es zischt wie eine Schlange")),
              w.sv,
              s.h("div", { class: "cols", style: { gap: "10px" } }, ...words.map(x => sayBtn(s, x, { rate: 0.55 }))));
            return { c, w };
          };
          const A = card(true), B = card(false);
          const merk = s.h("div", { class: "merk later" }, "Summt es? → immer ", s.h("b", null, "s"), ".  Zischt es? → ", s.h("b", null, "s, ss oder ß"), " – dafür gibt es Regeln!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } },
            P(s, "t", "Tippe auf die Wörter. Leg die Hand an den Hals: Spürst du ein Kribbeln?"),
            s.h("div", { class: "cols" }, A.c, B.c), merk));
          let onA = false, onB = false;
          s.loop(t => { if (onA) A.w.draw(t); if (onB) B.w.draw(t); });
          s.step(async () => { s.say("Sonne, Hase, Rose, lesen. Das s summt."); onA = true; s.show(A.c, "left"); s.sound("bee-buzz", { vol: .6 }); await s.wait(600); });
          s.step(async () => { s.say("Bus, Wasser, Straße, Fuß. Das s zischt."); onB = true; s.show(B.c, "right"); s.sound("snake-hiss", { vol: .7 }); await s.wait(600); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "ss nach kurzem Vokal",
        say: "Klingt der Vokal davor kurz und zischt das s, dann schreibst du ss. Wasser, Klasse, essen.",
        build(s) {
          const T = cloneTiles(s, ["W", "a", "s", "e", "r"], 2);
          const words = ["W[a]sser", "Kl[a]sse", "[e]ssen", "Fl[u]ss", "Schl[o]ss", "m[u]ss"].map(w => sayBtn(s, w, { cls: "sm" }));
          words.forEach(b => b.classList.add("later"));
          const lifes = [["Im Schwimmbad", "Das Wasser ist kalt."], ["In der Schule", "Unsere Klasse ist die 5a."], ["Beim Ausflug", "Wir fahren mit dem Schiff über den Fluss."]]
            .map(([l, t]) => s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, l), P(s, "t", t)));
          const merk = s.h("div", { class: "merk later" }, "Kurzer Vokal + zischendes s → ", s.h("b", null, "ss"), ".");
          const spree = s.photo("spree-schiff", { w: "100%", h: 250, pos: "50% 60%", caption: "der Fluss: die Spree in Berlin", cls: "later" });
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "18px" } },
              s.h("div", { class: "card stack", style: { alignItems: "center", gap: "12px" } }, P(s, "t", "Der kurze Vokal braucht zwei s:"), T.row),
              s.h("div", { class: "cols3", style: { gap: "10px" } }, ...words), merk),
            s.h("div", { class: "stack", style: { gap: "14px" } }, spree, ...lifes)));
          s.sfx.whoosh();
          s.step(async () => { s.say("Wa, sser. Das a ist kurz, also zwei s."); s.sfx.snap(); await T.run(); s.sfx.ding(); });
          s.step(async () => { for (let i = 0; i < words.length; i++) { s.show(words[i], "pop"); s.sfx.count(i); await s.wait(120); } });
          s.step(async () => { s.show(spree, "zoom"); s.sound("splash", { vol: .5 }); for (const l of lifes) { s.show(l, "right"); await s.wait(200); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "ß nach langem Vokal",
        say: "Nach einem langen Vokal oder einem Doppellaut schreibst du für das zischende s ein ß.",
        build(s) {
          const g1 = ["Str{a}ße", "F{u}ß", "gr{o}ß", "Gr{ü}ße"].map(w => sayBtn(s, w, { cls: "sm" }));
          const g2 = ["h{ei}ßen", "dr{au}ßen", "w{ei}ß", "b{ei}ßen"].map(w => sayBtn(s, w, { cls: "sm" }));
          const box = (lab, btns) => s.h("div", { class: "ex later" }, s.h("span", { class: "exlabel" }, lab), s.h("div", { class: "cols", style: { gap: "10px" } }, ...btns));
          const b1 = box("nach langem Vokal", g1), b2 = box("nach Doppellaut (ei, au, eu)", g2);
          const sign = s.photo("strassenschild", { w: "100%", h: 190, pos: "50% 45%", caption: "echtes Berliner Straßenschild", cls: "later" });
          const signBox = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"), P(s, "t", "Julians Schule liegt an der Emser Straße. Auf Briefen: „Viele Grüße“."));
          const facts = s.h("div", { class: "card soft later", style: { padding: "14px 18px" } },
            P(s, "t", s.h("b", null, "Großbuchstaben: "), "STRAẞE oder STRASSE"),
            P(s, "t", s.h("b", null, "Schweiz: "), "dort schreibt man immer ss – Strasse."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1.1fr 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "16px" } }, b1, b2, s.h("div", { class: "merk later", id: "u5m3" }, "Langer Vokal oder Doppellaut + zischendes s → ", s.h("b", null, "ß"), ".")),
            s.h("div", { class: "stack", style: { gap: "16px", alignItems: "stretch" } }, sign, signBox, facts)));
          const merk = s.root.querySelector("#u5m3");
          s.step(async () => { s.say("Straße, Fuß, groß, Grüße"); s.sfx.whoosh(); await s.show(b1, "left"); });
          s.step(async () => { s.say("heißen, draußen, weiß, beißen"); s.sfx.whoosh(); await s.show(b2, "left"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sound("traffic", { vol: .4, dur: 3 }); s.show(sign, "zoom"); await s.show(signBox, "up", 200); });
          s.step(async () => { s.sfx.pop(); await s.show(facts, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "s-Detektiv: verlängern!",
        say: "Am Wortende hörst du das s nicht genau. Verlängere das Wort, dann hörst du es.",
        build(s) {
          const rows = [["Hau", "Häu·ser", "Häuser", "summt", "g", "Haus"], ["F{u}", "F{ü}·ße", "Füße", "zischt nach langem Vokal", "", "Fuß"],
            ["Fl[u]", "Fl[ü]s·se", "Flüsse", "zischt nach kurzem Vokal", "b", "Fluss"], ["Gr{a}", "Gr{ä}·ser", "Gräser", "summt", "g", "Gras"], ["Gr{u}", "Gr{ü}·ße", "Grüße", "zischt nach langem Vokal", "", "Gruß"]];
          const grid = s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 36px 210px 330px 150px", columnGap: "14px", rowGap: "14px", alignItems: "center", justifyContent: "center" } });
          const parts = rows.map(([a, b, bs, how, col, fin]) => {
            const q = s.h("span", { class: "u5word" }, W(s, a, "mk"), s.h("span", { class: "u5c" }, "?"));
            const ar = s.h("span", { class: "u5word pencil later" }, "→");
            const lf = sayBtn(s, b, { cls: "sm later", speak: bs });
            const hw = s.h("span", { class: "later" }, s.h("span", { class: "u5tag " + col }, how));
            const fi = s.h("span", { class: "u5word later", style: { color: C } }, "= ", fin);
            grid.append(q, ar, lf, hw, fi);
            return [ar, lf, hw, fi];
          });
          const merk = s.h("div", { class: "merk later" }, "Summt es → ", s.h("b", null, "s"), ".  Zischt es nach kurzem Vokal → ", s.h("b", null, "ss"), ".  Nach langem Vokal → ", s.h("b", null, "ß"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "22px", justifyContent: "center" } }, grid, merk));
          parts.forEach((p, i) => s.step(async () => {
            s.say(rows[i][2] + ". Also " + rows[i][5] + ".");
            s.show(p[0], "left"); s.sfx.swoosh(); await s.wait(200);
            s.show(p[1], "pop"); s.sfx.pop(); await s.wait(350);
            s.show(p[2], "fade"); rows[i][4] === "g" ? s.sound("bee-buzz", { vol: .5, dur: .9 }) : s.sound("snake-hiss", { vol: .6, dur: .9 }); await s.wait(400);
            s.show(p[3], "zoom"); s.sfx.ding();
          }));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Wenn der Vokal wechselt",
        say: "In einer Wortfamilie kann der Vokal mal lang und mal kurz sein. Dann wechseln ß und ss.",
        build(s) {
          const fams = [["fl{ie}ßen", "er fl[o]ss", "der Fl[u]ss", "das Fl{o}ß"], ["w[i]ssen", "ich w{ei}ß", "sie w[u]sste"], ["[e]ssen", "er {a}ß"], ["gen{ie}ßen", "er gen[o]ss", "der Gen[u]ss"]];
          const rows = fams.map(f => {
            const items = f.map(w => {
              const isLong = /\{/.test(w);
              return s.h("div", { class: "card later", style: { padding: "8px 14px", display: "flex", alignItems: "center", gap: "10px" } },
                sayBtn(s, w, { cls: "sm", speak: plain(w).replace(/\[|\]/g, "") }), s.h("span", { class: "u5tag " + (isLong ? "" : "b") }, isLong ? "ß" : "ss"));
            });
            return { r: s.h("div", { class: "row", style: { gap: "12px", flexWrap: "nowrap" } }, ...items), items };
          });
          const merk = s.h("div", { class: "merk later" }, "Hör bei jeder Form neu hin: ", s.h("b", null, "kurz → ss"), ", ", s.h("b", null, "lang → ß"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } },
            P(s, "t", s.h("span", { class: "u5tag" }, "ß"), " = Strich, langer Vokal   ", s.h("span", { class: "u5tag b" }, "ss"), " = Punkt, kurzer Vokal"),
            ...rows.map(x => x.r), merk));
          rows.forEach((x, i) => s.step(async () => {
            s.say(fams[i].map(plain).join(", ").replace(/\[|\]/g, ""));
            for (const it of x.items) { s.show(it, "right"); /ß/.test(it.textContent) ? s.sfx.note(7, 0.45) : s.sfx.note(0, 0.1); await s.wait(260); }
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "das oder dass?",
        say: "Die Ersatzprobe hilft. Kannst du das Wort durch dieses oder welches ersetzen, schreibst du das mit einem s.",
        build(s) {
          const data = [
            { pre: "", post: " Fahrrad ist neu.", fin: "Das", probe: ["", "Dieses", " Fahrrad ist neu."], ok: true, kind: "Begleiter" },
            { pre: "Das Lied, ", post: " wir singen, ist schön.", fin: "das", probe: ["Das Lied, ", "welches", " wir singen, ist schön."], ok: true, kind: "Rückbezug" },
            { pre: "Ich hoffe, ", post: " du kommst.", fin: "dass", probe: ["Ich hoffe, ", "dieses", " du kommst."], ok: false, kind: "Bindewort" },
          ];
          const cards = data.map(d => {
            const slot = s.h("span", { class: "u5slot" }, "?");
            const pr = s.h("div", { class: "row later", style: { gap: "12px" } },
              s.h("span", { class: "t pencil" }, "Probe: ", d.probe[0], s.h("b", { style: { color: d.ok ? "var(--green)" : C, textDecoration: d.ok ? "none" : "line-through" } }, d.probe[1]), d.probe[2]),
              s.h("span", { class: "u5tag " + (d.ok ? "g" : "") }, d.ok ? "✓ passt → das" : "✗ passt nicht → dass"));
            const c = s.h("div", { class: "card stack", style: { gap: "8px", padding: "14px 22px" } },
              s.h("div", { class: "u5sent" }, d.pre, slot, d.post), pr);
            return { c, slot, pr, d };
          });
          const merk = s.h("div", { class: "merk later" }, "Ersetzbar durch ", s.h("b", null, "dieses, jenes, welches"), " → ", s.h("span", { class: "u5das" }, "das"), ".  Nicht ersetzbar → ", s.h("span", { class: "u5dass" }, "dass"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px", justifyContent: "center" } }, ...cards.map(x => x.c), merk));
          s.show(cards.map(x => x.c), "up"); s.sfx.pop();
          cards.forEach((x, i) => s.step(async () => {
            s.show(x.pr, "left"); s.sfx.whoosh(); await s.wait(500);
            x.d.ok ? s.sfx.success() : s.sfx.boing();
            x.slot.textContent = x.d.fin; x.slot.classList.add(x.d.ok ? "ok" : "ss"); bump(x.slot);
            s.say(x.d.ok ? x.d.probe[1] + " passt. Also das mit einem s." : "Dieses passt nicht. Also dass mit Doppel-s.");
          }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Im Alltag: das und dass im Chat",
        say: "So sieht das im Familien-Chat aus. Bei jedem das kannst du die Ersatzprobe machen.",
        build(s) {
          const D = t => s.h("span", { class: "u5das" }, t), DS = t => s.h("span", { class: "u5dass" }, t);
          const msgs = [
            { me: false, nm: "Mama", tx: ["Denk dran, ", DS("dass"), " heute Orchesterprobe ist!"], pr: "dass – ersetzen geht nicht" },
            { me: true, nm: "Julian", tx: ["Ist ", D("das"), " die Probe in der Aula?"], pr: "das → „Ist dies die Probe …“ ✓" },
            { me: false, nm: "Emil", tx: [D("Das"), " Spiel, ", D("das"), " wir gestern hatten, war super!"], pr: "Dieses Spiel ✓ · welches wir … ✓" },
            { me: true, nm: "Julian", tx: ["Schade, ", DS("dass"), " ich nicht da war."], pr: "dass – ersetzen geht nicht" },
          ];
          const bubs = msgs.map(m => s.h("div", { class: "u5bub later" + (m.me ? " me" : "") },
            s.h("div", { class: "nm" }, m.nm), s.h("div", { class: "tx" }, ...m.tx), s.h("div", { class: "pr" }, m.pr)));
          const phone = s.h("div", { class: "u5phone", style: { width: "470px", height: "636px", flex: "none" } },
            s.h("div", { style: { color: "#fff", font: "700 21px/1 var(--f-display)", padding: "6px 12px 12px", textAlign: "center" } }, "Familie"),
            s.h("div", { class: "u5screen" }, ...bubs));
          const leg = s.h("div", { class: "stack", style: { gap: "14px" } },
            s.h("span", { class: "u5tag v", style: { alignSelf: "flex-start" } }, "Erfundener Chat"),
            s.h("div", { class: "card later" }, P(s, "t", D("das"), " – lässt sich durch ", s.h("b", null, "dies, dieses"), " oder ", s.h("b", null, "welches"), " ersetzen.")),
            s.h("div", { class: "card later" }, P(s, "t", DS("dass"), " – lässt sich nicht ersetzen. Es verbindet zwei Sätze, oft nach einem Komma: „…, dass …“")));
          const merk = s.h("div", { class: "merk later" }, "Erst die Probe, dann tippen!");
          leg.append(merk);
          s.add(s.h("div", { class: "row", style: { height: "100%", flexWrap: "nowrap", alignItems: "center", gap: "34px" } }, phone, leg));
          bubs.forEach((b, i) => s.step(async () => { ping(s); await s.show(b, msgs[i].me ? "right" : "left"); if (i === 1) s.show(leg.children[1], "up"); if (i === 3) s.show(leg.children[2], "up"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Doppelte Mitlaute",
        say: "Nach einem kurzen, betonten Vokal hörst du nur einen Mitlaut. Du schreibst ihn aber doppelt.",
        build(s) {
          const T = cloneTiles(s, ["M", "u", "t", "e", "r"], 2);
          const vs = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "auto auto", gap: "10px 14px", alignItems: "center", justifyContent: "center" } }, sayBtn(s, "V{a}ter", { cls: "sm" }), s.h("span", { class: "u5tag" }, "lang → ein t"), sayBtn(s, "M[u]tter", { cls: "sm" }), s.h("span", { class: "u5tag b" }, "kurz → tt"));
          const left = s.h("div", { class: "card stack", style: { alignItems: "center", gap: "16px" } }, P(s, "t", "Mut | ter: Das t gehört zu beiden Silben."), T.row, vs);
          const lifes = [["Beim Sport", ["B[a]ll", "schw[i]mmen", "r[e]nnen"]], ["In der Küche", ["T[e]ller", "L[ö]ffel", "Pf[a]nne"]], ["Zu Hause", ["Z[i]mmer", "B[e]tt", "T[a]sse"]]]
            .map(([l, ws]) => s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("span", { class: "exlabel" }, l), s.h("div", { class: "row", style: { gap: "8px" } }, ...ws.map(w => sayBtn(s, w, { cls: "sm" })))));
          const merk = s.h("div", { class: "merk later" }, "Kurzer, betonter Vokal + ", s.h("b", null, "ein"), " Mitlaut hörbar → Mitlaut ", s.h("b", null, "verdoppeln"), ": ll, mm, nn, tt, ff …");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1fr", height: "100%", alignItems: "center" } },
            s.h("div", { class: "stack", style: { gap: "18px" } }, left, merk), s.h("div", { class: "stack", style: { gap: "14px" } }, ...lifes)));
          s.show(left, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Mut, ter. Das u ist kurz. Also tt."); s.sfx.drum(); await s.wait(250); s.sfx.drum(); await T.run(); s.sfx.ding(); });
          s.step(async () => { s.say("Vater ist lang, ein t. Mutter ist kurz, zwei t."); s.sfx.pop(); await s.show(vs, "up"); });
          s.step(async () => { const fx = [["ball-kick", 1], ["sizzle", 1.3], ["glass-clink", 1]]; for (let i = 0; i < lifes.length; i++) { s.show(lifes[i], "right"); s.sound(fx[i][0], { vol: .55, dur: fx[i][1] }); await s.wait(700); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "ck und tz statt kk und zz",
        say: "Statt zwei k schreibst du ck. Statt zwei z schreibst du tz. Zucker, Katze.",
        build(s) {
          const morph = (a, b) => {
            const t1 = s.h("span", { class: "u5tile hot" }, a), t2 = s.h("span", { class: "u5tile hot" }, a);
            return { row: s.h("div", { class: "u5tiles" }, t1, t2), run: async () => { s.sfx.zap(); await s.tween({ from: 1, to: 0, dur: 250, update: v => (t1.style.transform = `scaleX(${v})`) }); t1.textContent = b; await s.tween({ from: 0, to: 1, dur: 300, ease: "back", update: v => (t1.style.transform = `scaleX(${v})`) }); s.sfx.snap(); } };
          };
          const K = morph("k", "c"), Z = morph("z", "t");
          const side = (M, title, ws) => {
            const btns = ws.map(w => sayBtn(s, w, { cls: "sm" }));
            const c = s.h("div", { class: "card stack later", style: { gap: "12px", alignItems: "center" } }, P(s, "h2", title), M.row, s.h("div", { class: "cols", style: { gap: "10px", width: "100%" } }, ...btns));
            return c;
          };
          const cK = side(K, "kk → ck", ["Z[u]<ck>er", "D[e]<ck>e", "b[a]<ck>en", "Br[ü]<ck>e"]);
          const cZ = side(Z, "zz → tz", ["K[a]<tz>e", "Pl[a]<tz>", "s[i]<tz>en", "M[ü]<tz>e"]);
          const merk = s.h("div", { class: "merk later" }, "„Nach l, n, r – das merke ja – steht nie tz und nie ck!“  ",
            s.h("span", { class: "row", style: { display: "inline-flex", gap: "8px", marginTop: "6px" } }, ...["Ba<n>k", "Wo<l>ke", "He<r>z", "Ho<l>z"].map(w => s.h("span", { class: "u5tag g" }, W(s, w)))));
          const ex = s.h("div", { class: "card soft later", style: { flex: "0 0 300px" } }, P(s, "t", s.h("b", null, "Ausnahmen:")), P(s, "t", "Fremdwörter wie Pizza und Mokka"));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } },
            s.h("div", { class: "cols" }, cK, cZ), s.h("div", { class: "row", style: { flexWrap: "nowrap", alignItems: "stretch" } }, merk, ex)));
          s.step(async () => { s.say("Zucker, Decke, backen, Brücke"); s.show(cK, "left"); s.sfx.whoosh(); await s.wait(450); await K.run(); });
          s.step(async () => { s.say("Katze, Platz, sitzen, Mütze"); s.show(cZ, "right"); s.sfx.whoosh(); await s.wait(450); await Z.run(); s.sound("cat-meow", { vol: .6 }); });
          s.step(async () => { s.say("Nach l, n, r, das merke ja, steht nie tz und nie ck."); s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.pop(); await s.show(ex, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Groß schreibt man …",
        say: "Groß schreibt man das erste Wort im Satz, alle Nomen und alle Namen.",
        build(s) {
          const caps = [];
          const capWord = (lower, rest) => { const c = s.h("span", { class: "u5cap" }, lower); caps.push(c); return s.h("span", null, c, rest); };
          const c1 = s.h("div", { class: "card stack later", style: { gap: "12px" } }, P(s, "h2", "1. Satzanfang"),
            s.h("p", { class: "u5sent", style: { fontSize: "28px", margin: 0 } }, capWord("h", "eute"), " spielen wir Fußball."),
            s.h("p", { class: "u5sent", style: { fontSize: "28px", margin: 0 } }, capWord("w", "o"), " ist mein Turnbeutel?"));
          const nouns = [["Dinge", "b", "all", "f", "ernsehturm"], ["Lebewesen", "h", "und", "l", "ehrerin"], ["Gefühle, Gedanken", "f", "reude", "i", "dee"]];
          const c2 = s.h("div", { class: "card stack later", style: { gap: "10px" } }, P(s, "h2", "2. Nomen"),
            ...nouns.map(([l, a, ar, b, br]) => s.h("div", null, P(s, "small pencil", l), s.h("p", { class: "u5sent", style: { fontSize: "28px", margin: 0 } }, capWord(a, ar), ", ", capWord(b, br)))));
          const c3 = s.h("div", { class: "card stack later", style: { gap: "12px" } }, P(s, "h2", "3. Namen"),
            s.h("p", { class: "u5sent", style: { fontSize: "28px", margin: 0 } }, capWord("j", "ulian"), ", ", capWord("l", "ouisa")),
            s.h("p", { class: "u5sent", style: { fontSize: "28px", margin: 0 } }, capWord("b", "erlin"), ", ", capWord("s", "pree")));
          const merk = s.h("div", { class: "merk later" }, s.h("b", null, "Artikelprobe:"), " Passt ", s.h("b", null, "der, die"), " oder ", s.h("b", null, "das"), " davor? → Nomen → groß!  der Ball · die Freude · das Fahrrad");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "22px", justifyContent: "center" } }, s.h("div", { class: "cols3", style: { alignItems: "stretch" } }, c1, c2, c3), merk));
          const grow = async (from, to) => { for (let i = from; i < to; i++) { const c = caps[i]; c.textContent = c.textContent.toUpperCase(); bump(c); s.sfx.count(i); await s.wait(170); } };
          s.step(async () => { s.show(c1, "up"); s.sfx.whoosh(); await s.wait(400); await grow(0, 2); });
          s.step(async () => { s.show(c2, "up"); s.sfx.whoosh(); await s.wait(400); await grow(2, 8); });
          s.step(async () => { s.show(c3, "up"); s.sfx.whoosh(); await s.wait(400); await grow(8, 12); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Das Begleiter-Signal",
        say: "Steht ein Begleiter vor einem Verb oder Adjektiv, wird es zum Nomen. Dann schreibst du es groß.",
        build(s) {
          const mkRow = (beg, word) => {
            const sv = s.svg(44, 44, { class: "u5lamp" });
            const glow = s.el("circle", { cx: 22, cy: 22, r: 20, fill: "#ffd94a", opacity: 0 });
            const bulb = s.el("circle", { cx: 22, cy: 22, r: 13, fill: "#c8d3de", stroke: "#5d6678", "stroke-width": 2 });
            sv.append(glow, bulb);
            const cap = s.h("span", { class: "u5cap", style: { color: "var(--ink)" } }, word[0]);
            const r = s.h("div", { class: "row", style: { gap: "14px", flexWrap: "nowrap" } }, sv, s.h("span", { class: "u5beg" }, beg), s.h("span", { class: "u5word" }, cap, word.slice(1)));
            const on = async () => { glow.setAttribute("opacity", .7); bulb.setAttribute("fill", "#ffd94a"); s.sfx.ding(); await s.wait(250); cap.textContent = word[0].toUpperCase(); cap.style.color = C; bump(cap); s.sfx.pop(); };
            return { r, on };
          };
          const L = [["das", "laufen"], ["beim", "essen"], ["zum", "lesen"]].map(([a, b]) => mkRow(a, b));
          const R = [["etwas", "schönes"], ["viel", "neues"], ["alles", "gute"]].map(([a, b]) => mkRow(a, b));
          const colL = s.h("div", { class: "card stack", style: { gap: "16px" } }, s.h("span", { class: "u5tag b", style: { alignSelf: "flex-start" } }, "Verb → Nomen"), ...L.map(x => x.r));
          const colR = s.h("div", { class: "card stack later", style: { gap: "16px" } }, s.h("span", { class: "u5tag b", style: { alignSelf: "flex-start" } }, "Adjektiv → Nomen"), ...R.map(x => x.r));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            P(s, "t", "Beim Schwimmen bin ich schnell. · Zum Geburtstag alles Gute! · In der Instrumentalklasse lernen wir viel Neues."));
          const merk = s.h("div", { class: "merk later" }, "Begleiter wie ", s.h("b", null, "das, beim, zum, etwas, viel, alles"), " schalten das Signal an → ", s.h("b", null, "großschreiben"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px", justifyContent: "center" } }, s.h("div", { class: "cols" }, colL, colR), life, merk));
          s.show(colL, "left"); s.sfx.whoosh();
          s.step(async () => { s.say("das Laufen, beim Essen, zum Lesen"); for (const x of L) { await x.on(); await s.wait(200); } });
          s.step(async () => { s.say("etwas Schönes, viel Neues, alles Gute"); s.show(colR, "right"); s.sfx.whoosh(); await s.wait(400); for (const x of R) { await x.on(); await s.wait(200); } });
          s.step(async () => { s.sound("splash", { vol: .45 }); await s.show(life, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Im Alltag: Schilder-Detektiv",
        say: "Auf Schildern stecken oft Fehler. Diese Schilder sind erfunden. Tippe auf ein Schild, dann kommt der Rotstift.",
        build(s) {
          const signs = [
            { bg: "#7a4a1f", fg: "#fff", pre: "Frische Brötchen zum ", bad: "mitnehmen", post: "", fix: "zum Mitnehmen", why: "Begleiter zum → groß", font: "var(--f-display)" },
            { bg: "#ffe680", fg: "#1b2740", pre: "", bad: "Strassenfest", post: " am Samstag", fix: "Straßenfest", why: "langes a → ß", font: "var(--f-display)", fixc: C },
            { bg: "#23412f", fg: "#f4f4ec", pre: "", bad: "Heisse", post: " Waffeln", fix: "Heiße", why: "Doppellaut ei → ß", font: "var(--f-hand)" },
            { bg: "#fff", fg: "#1b2740", pre: "Wir hoffen, ", bad: "das", post: " es Ihnen schmeckt!", fix: "dass", why: "Probe: welches? passt nicht → dass", font: "var(--f-display)", fixc: C, border: "4px solid " + C },
          ];
          const cards = signs.map(g => {
            const bad = s.h("span", null, g.bad);
            const fix = s.h("div", { class: "fix later", style: g.fixc ? { color: g.fixc } : null }, "✎ " + g.fix);
            const why = s.h("div", { class: "why later" }, g.why);
            const el = s.h("div", { class: "u5sign later", style: { background: g.bg, color: g.fg, border: g.border || "4px solid rgba(0,0,0,.25)" } },
              s.h("div", { class: "st", style: { fontFamily: g.font, fontSize: g.font.includes("hand") ? "40px" : "30px" } }, g.pre, bad, g.post), fix, why);
            let done = false;
            const correct = async () => { if (done) return; done = true; s.sound("pencil-write", { vol: .7 }); bad.classList.add("u5strike"); await s.wait(300); s.show(fix, "pop"); s.sfx.pop(); await s.wait(250); s.show(why, "fade"); };
            el.addEventListener("click", correct);
            return { el, correct };
          });
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } },
            s.h("div", { class: "row", style: { gap: "14px" } }, s.h("span", { class: "u5tag v" }, "Erfundene Schilder"), P(s, "t", "So etwas sieht man oft in der Stadt.")),
            s.h("div", { class: "cols", style: { gap: "20px" } }, ...cards.map(c => c.el))));
          s.show(cards.map(c => c.el), "pop"); s.sfx.whoosh();
          cards.forEach(c => s.step(async () => { await c.correct(); }));
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Wörtliche Rede: drei Muster",
        say: "Wörtliche Rede steht in Anführungszeichen. Der Begleitsatz kann vorne, hinten oder in der Mitte stehen.",
        build(s) {
          const T = (cls, t) => s.h("span", { class: cls + " later" }, t);
          const rows = [
            ["vorne", [T("u5bs", "Julian sagt"), T("u5pz", ":"), " ", T("u5qm", "„"), T("u5wr", "Ich habe heute Probe."), T("u5qm", "“")], "Begleitsatz: „Rede.“"],
            ["hinten", [T("u5qm", "„"), T("u5wr", "Ich habe heute Probe"), T("u5qm", "“"), T("u5pz", ","), " ", T("u5bs", "sagt Julian.")], "„Rede“, Begleitsatz."],
            ["eingeschoben", [T("u5qm", "„"), T("u5wr", "Heute"), T("u5qm", "“"), T("u5pz", ","), " ", T("u5bs", "sagt Julian"), T("u5pz", ","), " ", T("u5qm", "„"), T("u5wr", "habe ich Probe."), T("u5qm", "“")], "„Rede“, Begleitsatz, „Rede.“"],
          ];
          const els = rows.map(([lab, toks, schema]) => {
            const sch = s.h("span", { class: "u5tag v later" }, schema);
            const r = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "205px 1fr", alignItems: "center", columnGap: "16px", rowGap: "6px", padding: "12px 20px" } },
              s.h("span", { class: "h2", style: { color: C, gridRow: "1 / 3" } }, lab), s.h("div", { class: "u5sent" }, ...toks), s.h("div", null, sch));
            return { r, toks: toks.filter(t => typeof t !== "string"), sch };
          });
          const legend = s.h("div", { class: "row", style: { gap: "12px" } },
            s.h("span", { class: "u5tag b" }, "Begleitsatz"), s.h("span", { class: "u5tag", style: { color: "#9a3412", background: "#fdecd8" } }, "wörtliche Rede"),
            s.h("span", { class: "u5tag" }, "„ Anführungszeichen “"), s.h("span", { class: "u5tag g" }, "Doppelpunkt : und Komma ,"));
          const note = s.h("div", { class: "merk later" }, "Frage- und Ausrufezeichen bleiben: ", s.h("b", null, "„Kommst du mit?“, fragt Louisa."), " Folgt der Begleitsatz, fällt nur der Punkt weg.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px", justifyContent: "center" } }, legend, ...els.map(x => x.r), note));
          els.forEach((x, i) => s.step(async () => {
            s.say(["Begleitsatz vorne, dann Doppelpunkt.", "Begleitsatz hinten, dann Komma nach dem Anführungszeichen.", "Begleitsatz eingeschoben, mit zwei Kommas."][i]);
            for (const t of x.toks) {
              s.show(t, t.classList.contains("u5qm") || t.classList.contains("u5pz") ? "pop" : "fade");
              if (t.classList.contains("u5qm")) s.sfx.snap(); else if (t.classList.contains("u5pz")) s.sfx.coin(); else s.sfx.tick();
              await s.wait(230);
            }
            s.show(x.sch, "up"); s.sfx.ding();
          }));
          s.step(async () => { s.sfx.pop(); await s.show(note, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Von der Sprechblase zum Satz",
        say: "Im Comic steht das Gesprochene in Sprechblasen. In einer Geschichte schreibst du wörtliche Rede.",
        build(s) {
          const fig = (col, prop) => {
            const sv = s.svg(200, 130);
            sv.append(s.el("circle", { cx: 60, cy: 32, r: 22, fill: "#fff", stroke: col, "stroke-width": 5 }),
              s.el("path", { d: "M60 54 L60 98 M60 66 L34 86 M60 66 L86 82 M60 98 L42 126 M60 98 L78 126", stroke: col, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }));
            if (prop === "ball") sv.append(s.el("circle", { cx: 140, cy: 108, r: 18, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M128 100 L140 94 L152 100 L148 114 L132 114 Z", fill: "#1b2740" }));
            if (prop === "pot") sv.append(s.el("rect", { x: 110, y: 78, width: 70, height: 40, rx: 8, fill: "#9aa3b5" }), s.el("rect", { x: 104, y: 72, width: 82, height: 10, rx: 4, fill: "#5d6678" }), s.el("path", { d: "M130 64 q6 -12 0 -24 M150 64 q6 -12 0 -24", stroke: "#9aa3b5", "stroke-width": 3, fill: "none" }));
            if (prop === "swing") sv.append(s.el("path", { d: "M110 10 L130 126 M190 10 L170 126 M110 10 L190 10", stroke: "#8a4b12", "stroke-width": 5, fill: "none" }), s.el("path", { d: "M140 10 L140 92 M160 10 L160 92 M134 92 L166 92", stroke: "#5d6678", "stroke-width": 3, fill: "none" }));
            return sv;
          };
          const Q = t => s.h("span", { class: "u5qm" }, t), Z = t => s.h("span", { class: "u5pz" }, t), BS = t => s.h("span", { class: "u5bs" }, t), WR = t => s.h("span", { class: "u5wr" }, t);
          const panels = [
            { who: "Louisa", col: "#7b4fd6", prop: "swing", snd: ["playground", 3], bub: "Kommst du mit auf den Spielplatz?", tag: "Begleitsatz hinten",
              sent: [Q("„"), WR("Kommst du mit auf den Spielplatz?"), Q("“"), Z(","), " ", BS("fragt Louisa.")] },
            { who: "Mama", col: "#138a5a", prop: "pot", snd: ["sizzle", 2], bub: "Das Essen ist fertig!", tag: "Begleitsatz vorne",
              sent: [BS("Mama ruft"), Z(":"), " ", Q("„"), WR("Das Essen ist fertig!"), Q("“")] },
            { who: "Trainer", col: "#1d5bd0", prop: "ball", snd: ["whistle", 1.3], bub: "Heute üben wir Elfmeter.", tag: "Begleitsatz eingeschoben",
              sent: [Q("„"), WR("Heute"), Q("“"), Z(","), " ", BS("sagt der Trainer"), Z(","), " ", Q("„"), WR("üben wir Elfmeter."), Q("“")] },
          ];
          const els = panels.map(p => {
            const bub = s.h("div", { class: "u5bubble" }, p.bub);
            const sent = s.h("div", { class: "later", style: { fontSize: "23px", lineHeight: "1.35", fontWeight: "600" } }, ...p.sent);
            const tag = s.h("span", { class: "u5tag v later", style: { alignSelf: "flex-start" } }, p.tag);
            const c = s.h("div", { class: "card stack", style: { gap: "10px" } }, bub, s.h("div", { class: "row", style: { gap: "4px", flexWrap: "nowrap" } }, fig(p.col, p.prop)), P(s, "small pencil", p.who), sent, tag);
            return { c, bub, sent, tag, p };
          });
          s.preload("playground"); s.preload("sizzle"); s.preload("whistle");
          s.add(s.h("div", { class: "cols3", style: { height: "100%", alignItems: "center" } }, ...els.map(e => e.c)));
          s.show(els.map(e => e.c), "up"); s.sfx.pop();
          els.forEach(e => s.step(async () => {
            s.say(e.p.bub);
            e.bub.classList.remove("a-shake"); void e.bub.offsetWidth; e.bub.classList.add("a-shake"); s.sound(e.p.snd[0], { vol: .5, dur: e.p.snd[1] }); await s.wait(450);
            s.show(e.sent, "down"); s.sfx.scribble(); await s.wait(500); s.show(e.tag, "pop"); s.sfx.ding();
          }));
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "Wörterbuch: ABC bis zum 3. Buchstaben",
        say: "Im Wörterbuch stehen die Wörter nach dem Abc. Sind die ersten Buchstaben gleich, schaust du auf den nächsten.",
        build(s) {
          const box = s.h("div", { style: { position: "relative", width: "320px", height: "420px", flex: "none" } });
          const words = ["Baum", "Ball", "Bad", "Banane", "Bahn"];
          const sorted = [...words].sort();
          const tiles = words.map((w, i) => {
            const spans = [...w].map(ch => s.h("span", null, ch));
            const el = s.h("div", { class: "u5abc", style: { top: (i * 82) + "px" } }, ...spans);
            box.append(el);
            return { el, spans, w, y: i * 82 };
          });
          const cards = [["1. Buchstabe:", " alle B – gleich!"], ["2. Buchstabe:", " alle a – gleich!"], ["3. Buchstabe entscheidet:", " d – h – l – n – u"]]
            .map(([a, b]) => s.h("div", { class: "card later", style: { padding: "12px 18px" } }, P(s, "t", s.h("b", null, a), b)));
          const um = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Umlaute"), P(s, "t", "ä wird wie a einsortiert: ", s.h("b", null, "Bank – Bär – Bart")));
          s.add(s.h("div", { class: "row", style: { height: "100%", flexWrap: "nowrap", gap: "50px", alignItems: "center", justifyContent: "center" } }, box,
            s.h("div", { class: "stack", style: { gap: "14px", width: "560px" } }, ...cards, um)));
          s.show(tiles.map(t => t.el), "left"); s.sfx.whoosh();
          const light = (k, cls) => tiles.forEach(t => { t.spans[k].classList.add(cls); bump(t.spans[k]); });
          s.step(async () => { light(0, "on"); s.sfx.tick(); await s.show(cards[0], "right"); });
          s.step(async () => { light(1, "on"); s.sfx.tick(); await s.show(cards[1], "right"); });
          s.step(async () => {
            s.say("Bad, Bahn, Ball, Banane, Baum.");
            light(2, "on3"); s.sfx.pop(); s.show(cards[2], "right"); await s.wait(500);
            s.sfx.whoosh();
            await Promise.all(tiles.map(t => { const ny = sorted.indexOf(t.w) * 82; const oy = t.y; t.y = ny; return s.tween({ from: oy, to: ny, dur: 800, ease: "inOut", update: v => (t.el.style.top = v + "px") }); }));
            s.sfx.success();
          });
          s.step(async () => { s.sfx.pop(); await s.show(um, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Grundform und Leitwörter",
        say: "Im Wörterbuch steht die Grundform. Lief findest du unter laufen. Die Leitwörter oben zeigen dir die richtige Seite.",
        build(s) {
          const pairs = [["lief", "laufen"], ["Häuser", "Haus"], ["schöner", "schön"], ["aß", "essen"]];
          const rows = pairs.map(([a, b]) => {
            const ar = s.h("span", { class: "u5word pencil later" }, "→");
            const bb = s.h("span", { class: "u5word later", style: { color: C } }, b);
            return { r: s.h("div", { style: { display: "grid", gridTemplateColumns: "150px 40px 1fr", alignItems: "center" } }, s.h("span", { class: "u5word" }, a), ar, bb), ar, bb };
          });
          const left = s.h("div", { class: "card stack", style: { gap: "14px" } }, P(s, "h2", "Erst die Grundform"), ...rows.map(x => x.r),
            P(s, "small pencil", "Nomen → Einzahl · Verb → Grundform · Adjektiv → ohne Steigerung"));
          const lw1 = s.h("span", { class: "u5lw" }, "lauern"), lw2 = s.h("span", { class: "u5lw" }, "Laune");
          const entries = [["lau·ern", "", false], ["der Lauf", "", false], ["lau·fen", "du läufst, er lief", true], ["der Läu·fer", "", false], ["die Lau·ne", "", false]]
            .map(([w, f, hit]) => { const e = s.h("div", { class: "u5entry" }, s.h("b", null, w), f ? ", " + f : ""); e.hit = hit; return e; });
          const page = s.h("div", { class: "u5page stack later", style: { gap: "4px" } },
            s.h("div", { class: "row", style: { justifyContent: "space-between", borderBottom: "2px solid #d9cfb4", paddingBottom: "8px", marginBottom: "6px" } }, lw1, s.h("span", { class: "small pencil" }, "Leitwörter"), lw2),
            ...entries);
          const merk = s.h("div", { class: "merk later" }, "Leitwörter = erstes und letztes Wort der Seite. Liegt dein Wort im Abc dazwischen? Dann bist du auf der richtigen Seite!");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "1fr 1.1fr", height: "100%", alignItems: "center" } }, left, s.h("div", { class: "stack", style: { gap: "16px" } }, page, merk)));
          s.show(left, "left"); s.sfx.whoosh();
          s.step(async () => { s.say("lief, laufen. Häuser, Haus. schöner, schön. aß, essen."); for (const x of rows) { s.show(x.ar, "left"); s.sfx.swoosh(); await s.wait(200); s.show(x.bb, "pop"); s.sfx.pop(); await s.wait(250); } });
          s.step(async () => { s.show(page, "zoom"); s.sound("page-turn-3"); await s.wait(500); bump(lw1); bump(lw2); s.sfx.ding(); });
          s.step(async () => { const e = entries.find(x => x.hit); e.classList.add("on"); bump(e); s.sfx.success(); s.say("Gefunden. Laufen, du läufst, er lief."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 17 --------------------------------------------------------------- */
      {
        title: "So sieht das in echt aus",
        say: "Wörterbücher gibt es schon lange. Die Brüder Grimm und Konrad Duden haben berühmte Wörterbücher gemacht. Schon damals gab es Leitwörter.",
        build(s) {
          const items = [
            [s.photo("grimm-woerterbuch", { w: 240, h: 340, fit: "contain", style: { background: "#fff" } }), ["Brüder Grimm: ", s.h("b", null, "Deutsches Wörterbuch"), ". Begonnen 1838 – fertig erst 1961, nach 123 Jahren!"], 240],
            [s.photo("duden-1880", { w: 240, h: 340, fit: "contain", style: { background: "#fff" } }), ["Konrad Duden, 1880: der „Urduden“ – ", s.h("b", null, "27.000 Wörter"), " auf 187 Seiten."], 240],
            [s.photo("duden-1880-seite", { w: 540, h: 340, pos: "50% 4%", caption: "Leitwörter: beschuhen … Betretung" }), ["Eine Seite im Urduden. Oben links und rechts: die ", s.h("b", null, "Leitwörter"), ". Die Schrift heißt Fraktur."], 540],
          ].map(([ph, txt, w]) => {
            return s.h("div", { class: "stack later", style: { gap: "10px", width: w + "px", flex: "none" } }, ph, P(s, "small", ...txt));
          });
          const merk = s.h("div", { class: "merk later" }, "Heute schlägst du genauso nach: Abc, Grundform, Leitwörter – wie vor über 140 Jahren!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "18px", justifyContent: "center" } },
            s.h("div", { class: "row", style: { gap: "30px", flexWrap: "nowrap", alignItems: "flex-start", justifyContent: "center" } }, ...items), merk));
          items.forEach((it, i) => s.step(async () => { s.sound("page-turn-2", { vol: .8 }); await s.show(it, "up"); }));
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.sfx.fanfare(); s.confetti(590, 400, 80); });
        },
      },
    ],
  });
})();
