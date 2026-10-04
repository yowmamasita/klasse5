/* Unit 8 – Yesterday: the simple past (Englisch Klasse 5).
   Cast: Ruby (11, London, Year 7) and Lukas (10, Berlin, Klasse 5). */
(() => {
  const EN = { lang: "en-GB", rate: 0.85 };
  const SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const CSS = `
.ek-spk{width:56px;min-width:56px;height:56px;padding:0;border-radius:50%;flex:none}
.ek-spk svg,.ek-hear svg{width:26px;height:26px;flex:none}
.ek-hear{padding:0 18px}
.ek-line{display:flex;align-items:center;gap:12px}
.ek-en{font-family:var(--f-body);font-weight:700;color:var(--ink);margin:0}
.ek-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#fff;border:3px solid var(--line);border-radius:18px;cursor:pointer;color:var(--ink);padding:6px;font-family:var(--f-body)}
.ek-bub{background:#fff;border:2px solid var(--line);border-radius:18px;padding:8px 14px;font-size:22px;line-height:1.3;font-weight:700;margin:0;flex:1;min-width:0}
.ek-av{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font:800 22px/1 var(--f-display);color:#fff;flex:none}
.ek-ping{animation:ekping .45s ease}
@keyframes ekping{50%{transform:scale(1.14)}}
.ek-tag{font:700 19px/1.2 var(--f-display);color:var(--pencil);margin:0}
`;
  if (!document.getElementById("ek78css")) { const st = document.createElement("style"); st.id = "ek78css"; st.textContent = CSS; document.head.appendChild(st); }

  function hear(s, text, label) {
    const b = s.h("button", { class: label ? "btn ek-hear" : "btn ek-spk", "aria-label": "Anhören: " + text, onclick: () => { s.sfx.click(); s.speak(text, EN); b.classList.remove("ek-ping"); void b.offsetWidth; b.classList.add("ek-ping"); } });
    b.insertAdjacentHTML("afterbegin", SPK);
    if (label) b.append(s.h("span", null, label));
    return b;
  }
  function line(s, text, o = {}) {
    const p = s.h("p", { class: "ek-en", style: { fontSize: (o.size || 22) + "px", lineHeight: "1.3", flex: "1", minWidth: "0", color: o.color || null } }, o.show || text);
    return s.h("div", { class: "ek-line" + (o.later ? " later" : ""), style: o.style || null }, hear(s, o.speak || text), p);
  }
  async function seq(s, els, kind = "pop", gap = 160, snd) {
    for (let i = 0; i < els.length; i++) {
      if (!s.alive) return;
      (snd || (j => s.sfx.count(j)))(i);
      s.show(els[i], kind);
      await s.wait(gap);
    }
  }
  const B = (s, t) => s.h("b", null, t);
  const HL = (s, t) => s.h("span", { class: "hl" }, t);
  const RED = (s, t) => s.h("span", { style: { color: "var(--red)" } }, t);
  const U = (s, t) => s.h("span", { style: { color: "var(--unit)" } }, t);

  /* "-ed jumps to did": two lines, a flying chip moves from line A (the -ed / past form) to the did-slot in line B */
  function jumpCard(s, o) {
    const box = s.h("div", { style: { position: "relative" } });
    const tok = (t, st) => s.h("span", { style: Object.assign({ whiteSpace: "pre" }, st || {}) }, t);
    const fs = { fontSize: "28px", fontWeight: 700, fontFamily: "var(--f-body)", lineHeight: 1.25, margin: 0, display: "flex", alignItems: "baseline", flexWrap: "nowrap", whiteSpace: "pre" };
    const src = tok(o.fly, { color: "var(--red)", background: "#fde2df", borderRadius: "6px", padding: "0 3px" });
    const lineA = s.h("p", { style: fs }, o.a1, src, o.a2);
    const tgt = tok(o.did, { color: "var(--unit)", background: "var(--unit-soft)", borderRadius: "6px", padding: "0 4px" }); tgt.classList.add("later");
    const base = tok(o.base, { color: "var(--green)" }); base.classList.add("later");
    const lineB = s.h("p", { class: "later", style: fs }, ...o.b(tgt, base));
    const fl = tok(o.fly, { position: "absolute", left: 0, top: 0, color: "var(--red)", fontSize: "28px", fontWeight: 700, background: "#fde2df", borderRadius: "6px", padding: "0 3px", zIndex: 2 });
    fl.classList.add("later");
    box.append(lineA, lineB, fl);
    const sp = hear(s, o.sayA + " " + o.sayB);
    const card = s.h("div", { class: "card", style: { padding: "10px 18px", display: "flex", alignItems: "center", gap: "16px" } },
      s.h("span", { class: "exlabel", style: { margin: 0, width: "150px", flex: "none" } }, o.label), s.h("div", { style: { flex: 1, minWidth: 0 } }, box), sp);
    card.run = async () => {
      s.sfx.whoosh(); await s.show(lineB, "fade");
      const offs = el => { let x = 0, y = 0; for (let e = el; e && e !== box; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x, y }; };
      const a = offs(src), b = offs(tgt);
      fl.classList.remove("later"); s.sfx.boing();
      await s.tween({ from: 0, to: 1, dur: 800, ease: "inOut", update: t => { const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t - 50 * Math.sin(Math.PI * t); fl.style.transform = `translate(${x}px, ${y}px) scale(${1 + .3 * Math.sin(Math.PI * t)})`; } });
      fl.classList.add("later"); s.sfx.snap();
      await s.show(tgt, "pop"); s.sfx.pop(); await s.show(base, "up");
    };
    return card;
  }

  Deck.unit({
    id: "u8", num: 8, title: "Yesterday: the simple past", color: "#0e7490", soft: "#dff3f7",
    subtitle: "Was gestern passiert ist – erzählen, fragen, schreiben",
    blurb: "was/were, -ed, unregelmäßige Verben, did – und Geschichten erzählen.",
    goals: ["was und were richtig benutzen", "Verben mit -ed: Schreibung und Aussprache", "Unregelmäßige Verben: go – went, see – saw …", "Verneinen und fragen mit did / didn't", "Von gestern erzählen: Tagebuch, Postkarte, Chat"],
    icon(svg, el) {
      svg.append(el("circle", { cx: 35, cy: 35, r: 28, fill: "#0e7490", opacity: .14 }),
        el("circle", { cx: 35, cy: 35, r: 20, fill: "#fff", stroke: "#0e7490", "stroke-width": 4 }),
        el("path", { d: "M35 22 V35 L26 40", stroke: "#0e7490", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
        el("path", { d: "M10 22 a28 28 0 0 1 12 -12", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }),
        el("path", { d: "M8 14 l2 8 l8 -2", stroke: "#dc3b2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    },
    slides: [
      /* 1 ---------------------------------------------------------------- */
      {
        title: "Today or yesterday?",
        say: "Wenn etwas schon vorbei ist, benutzt du im Englischen das simple past. Schiebe den Regler in die Vergangenheit.",
        build(s) {
          const svg = s.svg(1100, 160);
          svg.append(s.el("rect", { x: 20, y: 14, width: 770, height: 132, rx: 14, fill: "#dff3f7" }), s.el("rect", { x: 800, y: 14, width: 280, height: 132, rx: 14, fill: "#fff6c9" }),
            s.el("text", { x: 40, y: 44, "font-size": 22, "font-weight": 800, fill: "#0e7490", text: "PAST – Vergangenheit" }),
            s.el("text", { x: 820, y: 44, "font-size": 22, "font-weight": 800, fill: "#a07800", text: "PRESENT – Gegenwart" }),
            s.el("line", { x1: 40, y1: 92, x2: 1050, y2: 92, stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M1050 82 l16 10 l-16 10z", fill: "#1b2740" }));
          const P = [["last year", 150], ["last week", 380], ["yesterday", 610], ["every day", 930]];
          P.forEach(([t, x]) => svg.append(s.el("line", { x1: x, y1: 82, x2: x, y2: 102, stroke: "#1b2740", "stroke-width": 4 }), s.el("text", { x, y: 132, "text-anchor": "middle", "font-size": 21, "font-weight": 700, fill: "#5d6678", text: t })));
          const dot = s.el("circle", { cx: 610, cy: 92, r: 14, fill: "#dc3b2a", stroke: "#fff", "stroke-width": 4 });
          svg.append(dot);
          const S = [["Last year, I ", "played", " football."], ["Last week, I ", "played", " football."], ["Yesterday, I ", "played", " football."], ["Every day, I ", "play", " football."]];
          const sent = s.h("p", { class: "big", style: { fontSize: "38px" } });
          let pos = 2;
          const render = () => { const [a, v, c] = S[pos]; sent.innerHTML = ""; sent.append(a, s.h("span", { class: "hl", style: { color: pos < 3 ? "var(--unit)" : "#8a6500" } }, v), c); };
          render();
          const sl = s.slider({ label: "Wann?", min: 0, max: 3, value: 2, fmt: v => P[v][0], onInput: v => { const from = P[pos][1]; pos = v; render(); s.sfx.whoosh(); s.tween({ from, to: P[v][1], dur: 400, update: x => dot.setAttribute("cx", x) }); } });
          const sp = hear(s, "x"); sp.onclick = () => { s.sfx.click(); s.speak(sent.textContent, EN); };
          const main = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "center", padding: "12px 20px" } },
            s.h("div", { class: "ek-line" }, sp, sent), sl);
          const ex = [["Yesterday, Ruby watched a film.", "🎬"], ["Last week, we visited Grandma.", "👵"], ["Two days ago, Lukas cleaned his bike.", "🚲"]].map(([t, e]) =>
            s.h("div", { class: "ex later", style: { padding: "10px 14px" } }, s.h("span", { style: { fontSize: "36px" } }, e), line(s, t, { size: 21 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Das ", B(s, "simple past"), " erzählt, was schon vorbei ist. Signalwörter: ", B(s, "yesterday, last week, two days ago, in 2025"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg, main, s.h("div", { class: "cols3", style: { gap: "16px" } }, ex), merk));
          s.sfx.whoosh(); s.show(svg, "fade");
          s.step(async () => { await seq(s, ex, "up", 300, () => s.sfx.pop()); s.say("Gestern, letzte Woche, vor zwei Tagen: alles vorbei."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 2 ---------------------------------------------------------------- */
      {
        title: "was and were",
        say: "Das Verb be hat in der Vergangenheit nur zwei Formen: was und were.",
        build(s) {
          const R = [["I", "am", "was"], ["you", "are", "were"], ["he / she / it", "is", "was"], ["we", "are", "were"], ["you", "are", "were"], ["they", "are", "were"]];
          const pasts = [];
          const rows = R.map(([p, pr, pa]) => {
            const past = s.h("span", { class: "later", style: { font: "800 30px/1 var(--f-display)", color: pa === "was" ? "var(--unit)" : "var(--violet)", width: "90px" } }, pa);
            pasts.push(past);
            return s.h("div", { style: { display: "grid", gridTemplateColumns: "170px 70px 40px 90px", alignItems: "center", height: "52px", borderBottom: "2px solid var(--line)" } },
              s.h("span", { class: "ek-en", style: { fontSize: "26px" } }, p), s.h("span", { style: { fontSize: "26px", color: "var(--pencil)" } }, pr), s.h("span", { style: { fontSize: "26px", color: "var(--pencil)" } }, "→"), past);
          });
          const sp = hear(s, "I was, you were, he was, she was, it was, we were, you were, they were.", "Alle anhören");
          const table = s.h("div", { class: "card", style: { padding: "12px 20px" } }, s.h("span", { class: "exlabel" }, "be – heute → gestern"), rows, s.h("div", { style: { marginTop: "12px" } }, sp));
          const ex = [["🏠", "I was at home."], ["🎡", "We were in London."], ["❄️", "It was very cold."]].map(([e, t]) =>
            s.h("div", { class: "ex later", style: { padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px" } }, s.h("span", { style: { fontSize: "40px" } }, e), s.h("div", { style: { flex: 1 } }, line(s, t, { size: 24 }))));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "am, is → was"), s.h("br"), B(s, "are → were"), s.h("br"), "Also: I was, he was – aber you, we, they were.");
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "500px 1fr", gap: "24px", height: "100%", alignItems: "start" } },
            table, s.h("div", { class: "stack", style: { gap: "12px" } }, ex, merk)));
          s.sfx.whoosh();
          s.step(async () => { await seq(s, pasts, "zoom", 220, i => s.sfx.note([0, 4, 0, 4, 4, 4][i] + 7, .15)); s.say("Was bei I, he, she und it. Were bei you, we und they."); });
          s.step(async () => { await seq(s, ex, "left", 300, i => (i === 2 ? s.sound("wind", { vol: .35, dur: 3, fade: .8 }) : s.sfx.pop())); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 3 ---------------------------------------------------------------- */
      {
        title: "Were you…? – No, I wasn't.",
        say: "Für eine Frage stellst du was oder were an den Anfang. Für nein hängst du not an: wasn't und weren't.",
        build(s) {
          const swapCard = (w1, w2, rest, q1, q2, qrest, ans) => {
            const a = s.h("span", { style: { display: "inline-block" } }, w1), b = s.h("span", { style: { display: "inline-block" } }, w2), r = s.h("span", null, rest);
            const p = s.h("p", { style: { margin: 0, display: "flex", gap: "9px", fontSize: "28px", fontWeight: 700, fontFamily: "var(--f-body)" } }, a, b, r);
            const an = s.h("p", { class: "ek-en later", style: { fontSize: "24px", color: "var(--unit)" } }, ans);
            const c = s.h("div", { class: "card later", style: { padding: "10px 16px", display: "flex", alignItems: "center", gap: "14px" } },
              s.h("div", { style: { flex: 1 } }, p, an), hear(s, `${q1} ${q2} ${qrest} ${ans.replace(/^– /, "")}`));
            c.run = async () => {
              await s.show(c, "up");
              await s.wait(400);
              const dx = b.offsetLeft - a.offsetLeft, wb = b.offsetWidth;
              s.sfx.whoosh();
              await s.tween({ from: 0, to: 1, dur: 700, update: t => { b.style.transform = `translate(${-dx * t}px, ${-24 * Math.sin(Math.PI * t)}px)`; a.style.transform = `translate(${(wb + 9) * t}px, 0)`; } });
              a.style.transform = ""; b.style.transform = ""; p.insertBefore(b, a);
              b.textContent = q1; b.style.color = "var(--unit)"; a.textContent = q2; r.textContent = qrest;
              s.sfx.pop(); await s.show(an, "left");
            };
            return c;
          };
          const C = [swapCard("You", "were", "at school.", "Were", "you", "at school?", "– Yes, I was."),
            swapCard("It", "was", "fun.", "Was", "it", "fun?", "– No, it wasn't."),
            swapCard("Lukas", "was", "at home.", "Was", "Lukas", "at home?", "– Yes, he was.")];
          const neg = s.h("div", { class: "card soft later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Verneinung – nein"),
            s.h("div", { class: "stack", style: { gap: "10px" } },
              line(s, "I wasn't tired.", { size: 24 }), line(s, "They weren't in Berlin.", { size: 24 }), line(s, "The film wasn't boring.", { size: 24 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Frage: ", B(s, "Was / Were"), " nach vorne. Nein: ", B(s, "wasn't"), " = was not, ", B(s, "weren't"), " = were not.");
          const life3 = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag – am Montag in der Schule"),
            s.h("div", { class: "stack", style: { gap: "8px" } }, line(s, "Where were you yesterday?", { size: 22 }), line(s, "I was at the swimming pool.", { size: 22 })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "22px", height: "100%", alignItems: "start" } },
            s.h("div", { class: "stack", style: { gap: "14px" } }, C, life3), s.h("div", { class: "stack", style: { gap: "14px" } }, neg, merk)));
          C[0].run();
          s.step(async () => { await C[1].run(); });
          s.step(async () => { await C[2].run(); });
          s.step(async () => { s.sfx.whoosh(); await s.show(neg, "left"); s.say("I wasn't, they weren't."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life3, "up"); });
        },
      },
      /* 4 ---------------------------------------------------------------- */
      {
        title: "Regular verbs: + -ed",
        say: "Die meisten Verben bekommen im simple past einfach ein e d hinten dran. Und das ist für alle Personen gleich.",
        build(s) {
          const ed = s.h("span", { class: "later", style: { color: "var(--red)" } }, "ed");
          const big = s.h("p", { class: "huge", style: { fontSize: "86px" } }, "play", ed);
          const pers = ["I", "you", "he", "she", "it", "we", "they"].map(p => s.h("span", { class: "chip later", style: { fontSize: "22px" } }, p));
          const sameRow = s.h("div", { class: "row", style: { gap: "8px" } }, pers, s.h("span", { class: "ek-en later", style: { fontSize: "26px", color: "var(--unit)" } }, "→ played"));
          const top = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "360px 1fr", alignItems: "center", gap: "18px", padding: "12px 22px" } },
            s.h("div", { class: "ek-line" }, hear(s, "play, played"), big), s.h("div", null, s.h("p", { class: "small pencil", style: { marginBottom: "8px" } }, "Für alle Personen gleich:"), sameRow));
          const ex = [["walk", "We walked to school.", "🚶"], ["watch", "Ruby watched a film.", "📺"], ["listen", "I listened to music.", "🎧"], ["clean", "Lukas cleaned his room.", "🧹"]].map(([v, t, e]) =>
            s.h("div", { class: "ex later", style: { display: "grid", gridTemplateColumns: "60px 260px 1fr", alignItems: "center", gap: "12px", padding: "8px 16px" } },
              s.h("span", { style: { fontSize: "40px" } }, e), s.h("p", { class: "ek-en", style: { fontSize: "28px" } }, v, " → ", v, RED(s, "ed")), line(s, t, { size: 24 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Regelmäßige Verben: Grundform + ", B(s, "-ed"), ". Kein extra -s bei he/she/it: ", B(s, "she played"), ", he played.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, top, ex, merk));
          s.sfx.pop();
          s.step(async () => { s.sfx.zap(); await s.show(ed, "right"); s.sfx.ding(); await seq(s, pers, "pop", 120); s.show(sameRow.lastChild, "left"); });
          s.step(async () => { await seq(s, ex, "left", 450, i => (i === 0 ? s.sound("footsteps", { vol: .4, dur: 1.5 }) : i === 2 ? s.sound("piano", { vol: .4, dur: 1.5, fade: .4 }) : s.sfx.pop())); s.say("Walked, watched, listened."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 5 ---------------------------------------------------------------- */
      {
        title: "Spelling: liked, stopped, tried",
        say: "Bei manchen Verben ändert sich die Schreibung ein bisschen. Hier sind die vier Regeln.",
        build(s) {
          const letters = w => w.split("").map(ch => s.h("span", { style: { display: "inline-block" } }, ch));
          const mkWord = (base) => { const ls = letters(base); const p = s.h("p", { class: "big", style: { fontSize: "44px", minHeight: "52px" } }, ls); p.ls = ls; return p; };
          const cards = [];
          const R = [
            { lab: "Endet auf -e: nur -d", base: "like", more: [["live", "lived"], ["dance", "danced"]], sent: "I liked the film.", anim: async w => { const d = s.h("span", { class: "later", style: { color: "var(--red)", display: "inline-block" } }, "d"); w.append(d); s.sfx.zap(); await s.show(d, "right"); } },
            { lab: "Kurzer Vokal + 1 Konsonant: verdoppeln", base: "stop", more: [["plan", "planned"], ["drop", "dropped"]], sent: "The bus stopped.", anim: async w => { const p2 = s.h("span", { class: "later", style: { color: "var(--red)", display: "inline-block" } }, "p"), e = s.h("span", { class: "later", style: { color: "var(--red)", display: "inline-block" } }, "ed"); w.append(p2, e); s.sfx.pop(); await s.show(p2, "bounce"); s.sfx.zap(); await s.show(e, "right"); } },
            { lab: "Konsonant + y: y → i + ed", base: "try", more: [["cry", "cried"], ["study", "studied"]], sent: "We tried sushi.", anim: async w => { const y = w.ls[2]; s.sfx.error(); y.style.color = "var(--red)"; y.classList.add("a-shake"); await s.wait(500); y.classList.remove("a-shake"); y.textContent = "i"; s.sfx.pop(); await s.show(y, "pop"); const e = s.h("span", { class: "later", style: { color: "var(--red)", display: "inline-block" } }, "ed"); w.append(e); s.sfx.zap(); await s.show(e, "right"); } },
            { lab: "Vokal + y: einfach -ed", base: "play", more: [["stay", "stayed"], ["enjoy", "enjoyed"]], sent: "I enjoyed the party.", anim: async w => { const e = s.h("span", { class: "later", style: { color: "var(--red)", display: "inline-block" } }, "ed"); w.append(e); s.sfx.zap(); await s.show(e, "right"); } },
          ];
          R.forEach(r => {
            const w = mkWord(r.base);
            const more = s.h("div", { class: "stack later", style: { gap: "4px" } }, r.more.map(([a, b]) => s.h("p", { class: "ek-en", style: { fontSize: "22px" } }, a, " → ", U(s, b))));
            const sent = line(s, r.sent, { size: 21, later: true });
            const c = s.h("div", { class: "card later", style: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: "12px" } },
              s.h("span", { class: "exlabel", style: { margin: 0, minHeight: "34px" } }, r.lab), w, more, sent);
            c.go = async () => { s.sfx.whoosh(); await s.show(c, "up"); await r.anim(w); await s.wait(200); s.sfx.pop(); await s.show(more, "fade"); await s.show(sent, "left"); };
            cards.push(c);
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "liked · stopped · tried · played – schau aufs Wortende! Die Aussprache-Regeln kommen auf der nächsten Folie.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "16px" } }, s.h("div", { class: "cols4", style: { gap: "14px" } }, cards), merk));
          cards[0].go();
          s.step(async () => { await cards[1].go(); s.say("Stop wird zu stopped, mit zwei p."); });
          s.step(async () => { await cards[2].go(); s.say("Try wird zu tried: aus y wird i."); });
          s.step(async () => { await cards[3].go(); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 6 ---------------------------------------------------------------- */
      {
        title: "Say it: /t/ – /d/ – /ɪd/",
        say: "Das e d spricht man auf drei Arten aus. Tippe auf ein Wort und hör genau hin.",
        build(s) {
          const W = { t: ["walked", "watched", "liked", "helped"], d: ["played", "listened", "opened", "cleaned"], id: ["wanted", "visited", "needed", "started"] };
          const order = ["played", "wanted", "walked", "listened", "visited", "watched", "opened", "liked", "needed", "cleaned", "helped", "started"];
          const chip = (w, later) => s.h("button", { class: "btn" + (later ? " later" : ""), style: { fontSize: "22px", padding: "0 14px" }, onclick: () => { s.sfx.click(); s.speak(w, EN); } }, w);
          const pool = {}; order.forEach(w => { pool[w] = chip(w); });
          const poolBox = s.h("div", { class: "card soft", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "Tippe und hör zu"),
            s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" } }, order.map(w => pool[w])));
          const buckets = {}, bchips = {};
          const meta = { t: ["/t/", "nach stimmlosen Lauten: p, k, s, sh, ch, f", "var(--blue)"], d: ["/d/", "nach stimmhaften Lauten und Vokalen", "var(--green)"], id: ["/ɪd/", "nach t oder d – eine Silbe mehr!", "var(--red)"] };
          const bk = Object.keys(W).map(k => {
            bchips[k] = W[k].map(w => chip(w, true));
            buckets[k] = s.h("div", { class: "card", style: { padding: "10px 16px", borderColor: meta[k][2], borderWidth: "3px", borderTopWidth: "10px" } },
              s.h("div", { class: "ek-line" }, s.h("p", { class: "big", style: { color: meta[k][2] } }, meta[k][0]), s.h("p", { class: "small", style: { flex: 1 } }, meta[k][1])),
              s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" } }, bchips[k]));
            return buckets[k];
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Nur bei ", B(s, "t"), " oder ", B(s, "d"), " am Ende sprichst du eine extra Silbe: want-ed, vis-it-ed. Sonst nie: walked = „walkt“, played = „pleid“.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, poolBox, s.h("div", { class: "cols3", style: { gap: "16px" } }, bk), merk));
          s.sfx.whoosh();
          const sort = async k => { for (const w of W[k]) { s.sfx.whoosh(); pool[w].style.opacity = ".3"; s.sfx.pop(); await s.show(bchips[k][W[k].indexOf(w)], "down"); if (!s.fast) s.speak(w, EN); await s.wait(500); } };
          s.step(async () => { await sort("t"); s.say("Walked, watched, liked, helped: ein kurzes t."); });
          s.step(async () => { await sort("d"); });
          s.step(async () => { await sort("id"); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 7 ---------------------------------------------------------------- */
      {
        title: "Irregular verbs",
        say: "Manche Verben sind unregelmäßig. Sie haben kein e d. Tippe auf eine Karte, dann dreht sie sich um.",
        build(s) {
          const V = [["go", "went", "gehen"], ["have", "had", "haben"], ["see", "saw", "sehen"], ["eat", "ate", "essen"], ["buy", "bought", "kaufen"], ["get", "got", "bekommen"], ["come", "came", "kommen"], ["take", "took", "nehmen"], ["make", "made", "machen"], ["say", "said", "sagen"]];
          const cards = V.map(([a, b, de]) => {
            const big = s.h("span", { style: { font: "800 40px/1 var(--f-display)" } }, a);
            const sm = s.h("span", { class: "small pencil" }, de);
            const inner = s.h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" } }, big, sm);
            let flipped = false;
            const c = s.h("button", { class: "ek-tile later", style: { height: "130px", borderColor: "var(--unit)" } }, inner);
            c.flip = async (to = !flipped) => {
              if (to === flipped) return;
              s.sfx.swoosh();
              await s.tween({ from: 1, to: 0, dur: 180, update: v => inner.style.transform = `scaleX(${v})` });
              flipped = to; big.textContent = to ? b : a; big.style.color = to ? "var(--unit)" : "var(--ink)"; sm.textContent = to ? `${a} – ${b}` : de;
              c.style.background = to ? "var(--unit-soft)" : "#fff";
              await s.tween({ from: 0, to: 1, dur: 180, update: v => inner.style.transform = `scaleX(${v})` });
              if (to && !s.fast) s.speak(`${a}, ${b}`, EN);
            };
            c.onclick = () => c.flip();
            return c;
          });
          const life = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { class: "cols3", style: { gap: "12px" } }, line(s, "I went to the cinema.", { size: 21 }), line(s, "We had pizza.", { size: 21 }), line(s, "Mum bought a new bike.", { size: 21 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Unregelmäßige Verben musst du auswendig lernen – am besten laut: ", B(s, "go – went"), ". Die Form ist für alle Personen gleich: I went, she went, they went.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" } }, cards), merk, life));
          seq(s, cards, "pop", 90);
          s.step(async () => { for (const c of cards.slice(0, 5)) { await c.flip(true); await s.wait(700); } s.say("Go, went. Have, had. See, saw. Eat, ate. Buy, bought."); });
          s.step(async () => { for (const c of cards.slice(5)) { await c.flip(true); await s.wait(700); } });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(life, "up"); });
        },
      },
      /* 8 ---------------------------------------------------------------- */
      {
        title: "Time words: yesterday, ago …",
        say: "Diese Zeitwörter zeigen dir: Jetzt kommt die Vergangenheit.",
        build(s) {
          const svg = s.svg(1100, 170);
          svg.append(s.el("line", { x1: 30, y1: 100, x2: 1060, y2: 100, stroke: "#1b2740", "stroke-width": 4 }), s.el("path", { d: "M1060 90 l18 10 l-18 10z", fill: "#1b2740" }));
          const T = [["in 2025", 110], ["last week", 360], ["two days ago", 600], ["yesterday", 810], ["today", 1000]];
          const marks = T.map(([t, x], i) => {
            const g = s.el("g", { class: "later", style: { cursor: "pointer" }, onclick: () => { s.sfx.pop(); s.speak(t, EN); } });
            g.append(s.el("circle", { cx: x, cy: 100, r: 13, fill: i === 4 ? "#ffd94a" : "#0e7490", stroke: "#fff", "stroke-width": 4 }),
              s.el("text", { x, y: i % 2 ? 150 : 66, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: i === 4 ? "#8a6500" : "#0e7490", text: t }));
            svg.append(g); return g;
          });
          const ex = [["In 2025, I was in class 4."], ["Last week, we had a maths test."], ["Two days ago, I saw a fox in the park."], ["Yesterday, Ruby bought a new book."]].map(([t]) => s.h("div", { class: "ex later", style: { padding: "10px 14px" } }, line(s, t, { size: 23 })));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "ago"), " steht hinten: two days ago = vor zwei Tagen · ", B(s, "last week"), " (ohne the!) = letzte Woche · ", B(s, "in"), " + Jahreszahl: in 2025. Das Zeitwort steht am Anfang oder am Ende.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, svg, s.h("div", { class: "cols", style: { gap: "14px" } }, ex), merk));
          s.sfx.whoosh();
          seq(s, marks, "pop", 250);
          s.step(async () => { await seq(s, ex.slice(0, 2), "up", 300, () => s.sfx.pop()); });
          s.step(async () => { await seq(s, ex.slice(2), "up", 300, () => s.sfx.pop()); s.say("Vor zwei Tagen heißt two days ago."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 9 ---------------------------------------------------------------- */
      {
        title: "No: didn't + Grundform",
        say: "Für die Verneinung springt die Vergangenheit vom Verb zu did. Das Verb steht dann wieder in der Grundform.",
        build(s) {
          const C = [
            jumpCard(s, { label: "Regelmäßig", a1: "Ruby play", fly: "ed", a2: " tennis.", did: "didn't", base: "play", b: (t, b) => ["Ruby ", t, "\u00a0", b, " tennis."], sayA: "Ruby played tennis.", sayB: "Ruby didn't play tennis." }),
            jumpCard(s, { label: "Regelmäßig", a1: "We watch", fly: "ed", a2: " TV.", did: "didn't", base: "watch", b: (t, b) => ["We ", t, "\u00a0", b, " TV."], sayA: "We watched TV.", sayB: "We didn't watch TV." }),
            jumpCard(s, { label: "Unregelmäßig", a1: "Lukas ", fly: "went", a2: " to school.", did: "didn't", base: "go", b: (t, b) => ["Lukas ", t, "\u00a0", b, " to school."], sayA: "Lukas went to school.", sayB: "Lukas didn't go to school." }),
          ];
          C.forEach(c => c.classList.add("later"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "didn't"), " (= did not) + ", B(s, "Grundform"), ". Wie does im Präsens: Die Vergangenheit steckt in did – also nie „didn't played“ oder „didn't went“!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, C, merk));
          const go = async c => { s.sfx.pop(); await s.show(c, "up"); await c.run(); };
          go(C[0]);
          s.step(async () => { await go(C[1]); });
          s.step(async () => { await go(C[2]); s.say("Aus went wird didn't go."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 10 --------------------------------------------------------------- */
      {
        title: "Questions: Did you…?",
        say: "Bei Fragen springt did nach vorne. Die Antwort ist kurz: Yes, I did, oder No, I didn't.",
        build(s) {
          const C = [
            jumpCard(s, { label: "– Yes, I did.", a1: "You play", fly: "ed", a2: " football.", did: "Did", base: "play", b: (t, b) => [t, " you ", b, " football?"], sayA: "", sayB: "Did you play football? Yes, I did." }),
            jumpCard(s, { label: "– Yes, she did.", a1: "Ruby ", fly: "went", a2: " to the cinema.", did: "Did", base: "go", b: (t, b) => [t, " Ruby ", b, " to the cinema?"], sayA: "", sayB: "Did Ruby go to the cinema? Yes, she did." }),
            jumpCard(s, { label: "– No, they didn't.", a1: "They ", fly: "ate", a2: " pizza.", did: "Did", base: "eat", b: (t, b) => [t, " they ", b, " pizza?"], sayA: "", sayB: "Did they eat pizza? No, they didn't." }),
          ];
          C.forEach(c => { c.classList.add("later"); c.querySelector(".exlabel").style.fontSize = "19px"; c.querySelector(".exlabel").style.textTransform = "none"; c.querySelector(".exlabel").style.letterSpacing = "0"; });
          const wh = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Mit Fragewort: Fragewort + did + Person + Grundform"),
            s.h("div", { class: "cols", style: { gap: "12px" } }, line(s, "Where did you go?", { size: 23 }), line(s, "What did you eat?", { size: 23 })));
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, C, wh));
          const go = async c => { s.sfx.pop(); await s.show(c, "up"); await c.run(); };
          go(C[0]);
          s.step(async () => { await go(C[1]); });
          s.step(async () => { await go(C[2]); s.say("Did they eat pizza? No, they didn't."); });
          s.step(async () => { s.sfx.ding(); await s.show(wh, "up"); });
        },
      },
      /* 11 --------------------------------------------------------------- */
      {
        title: "Present or past?",
        say: "Vergleich: links das simple present für jeden Tag, rechts das simple past für gestern.",
        build(s) {
          const head = s.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: "10px", alignItems: "center" } },
            s.h("p", { class: "h2", style: { background: "#fff6c9", borderRadius: "14px", padding: "8px 16px", color: "#8a6500" } }, "Present – every day"), s.h("span"),
            s.h("p", { class: "h2", style: { background: "var(--unit-soft)", borderRadius: "14px", padding: "8px 16px", color: "var(--unit)" } }, "Past – yesterday"));
          const R = [
            [["I ", HL(s, "play"), " football every day."], "I play football every day.", ["I ", HL(s, "played"), " football yesterday."], "I played football yesterday."],
            [["He ", HL(s, "goes"), " to school."], "He goes to school.", ["He ", HL(s, "went"), " to school."], "He went to school."],
            [["She ", HL(s, "doesn't like"), " tea."], "She doesn't like tea.", ["She ", HL(s, "didn't like"), " the tea."], "She didn't like the tea."],
            [[HL(s, "Does"), " he ", HL(s, "play"), " the guitar?"], "Does he play the guitar?", [HL(s, "Did"), " he ", HL(s, "play"), " the guitar?"], "Did he play the guitar?"]];
          const rows = R.map(([a, sa, b, sb]) => {
            const L = s.h("div", { class: "card", style: { padding: "6px 12px" } }, line(s, sa, { show: a, size: 23 }));
            const arr = s.h("span", { class: "big later", style: { textAlign: "center", color: "var(--unit)" } }, "→");
            const Rr = s.h("div", { class: "card later", style: { padding: "6px 12px", borderColor: "var(--unit)" } }, line(s, sb, { show: b, size: 23 }));
            const row = s.h("div", { class: "later", style: { display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: "10px", alignItems: "center" } }, L, arr, Rr);
            row.go = async () => { s.sfx.pop(); await s.show(row, "left"); s.sfx.whoosh(); s.show(arr, "left"); await s.show(Rr, "right"); };
            return row;
          });
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, B(s, "does / doesn't → did / didn't"), " · he plays → he ", B(s, "played"), " (kein -s!) · Nach did / didn't immer die ", B(s, "Grundform"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } }, head, rows, merk));
          s.sfx.whoosh(); rows[0].go();
          s.step(async () => { await rows[1].go(); });
          s.step(async () => { await rows[2].go(); });
          s.step(async () => { await rows[3].go(); s.say("Does wird zu did."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 12 --------------------------------------------------------------- */
      {
        title: "Comic: Ruby's school trip",
        say: "Rubys Klasse hat einen Ausflug durch London gemacht. Die Geschichte steht im simple past, Bild für Bild.",
        build(s) {
          const pic = n => {
            const v = s.svg(320, 150);
            v.append(s.el("rect", { x: 0, y: 0, width: 320, height: 150, rx: 10, fill: ["#e9f6fb", "#eef0f7", "#e9f6fb", "#e9f6fb", "#eaf7e7", "#fff6e6"][n] }));
            if (n === 0) { v.append(s.el("rect", { x: 50, y: 50, width: 220, height: 70, rx: 14, fill: "#ffd94a", stroke: "#b08a00", "stroke-width": 3 })); for (let i = 0; i < 5; i++) v.append(s.el("rect", { x: 66 + i * 38, y: 60, width: 28, height: 24, rx: 4, fill: "#bfe3f5" }), s.el("circle", { cx: 80 + i * 38, cy: 76, r: 7, fill: "#f1c9a5" })); v.append(s.el("circle", { cx: 95, cy: 122, r: 14, fill: "#333" }), s.el("circle", { cx: 225, cy: 122, r: 14, fill: "#333" }), s.el("line", { x1: 10, y1: 136, x2: 310, y2: 136, stroke: "#9aa6b4", "stroke-width": 3 })); }
            if (n === 1) { v.append(s.el("circle", { cx: 90, cy: 70, r: 42, fill: "none", stroke: "#dc3b2a", "stroke-width": 16 }), s.el("rect", { x: 34, y: 60, width: 112, height: 20, fill: "#1d3f9a" }), s.el("rect", { x: 170, y: 50, width: 140, height: 70, rx: 22, fill: "#d8dde6", stroke: "#5d6678", "stroke-width": 3 }), s.el("rect", { x: 170, y: 92, width: 140, height: 10, fill: "#dc3b2a" })); [190, 230, 270].forEach(x => v.append(s.el("rect", { x, y: 62, width: 26, height: 22, rx: 4, fill: "#bfe3f5" }))); }
            if (n === 2) { v.append(s.el("rect", { x: 130, y: 30, width: 44, height: 115, fill: "#d9b46a", stroke: "#8a6a2a", "stroke-width": 3 }), s.el("path", { d: "M130 30 l22 -24 l22 24z", fill: "#5d6678" }), s.el("circle", { cx: 152, cy: 52, r: 14, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 }), s.el("path", { d: "M152 44 v8 l6 4", stroke: "#1b2740", "stroke-width": 2.5, fill: "none" }), s.el("rect", { x: 174, y: 80, width: 130, height: 65, fill: "#e3c98a", stroke: "#8a6a2a", "stroke-width": 3 })); for (let i = 0; i < 6; i++) v.append(s.el("rect", { x: 182 + i * 20, y: 92, width: 10, height: 40, fill: "#8a6a2a", opacity: .5 })); }
            if (n === 3) { v.append(s.el("circle", { cx: 160, cy: 72, r: 58, fill: "none", stroke: "#5d6678", "stroke-width": 4 })); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; v.append(s.el("line", { x1: 160, y1: 72, x2: 160 + 58 * Math.cos(a), y2: 72 + 58 * Math.sin(a), stroke: "#9aa6b4", "stroke-width": 1.5 }), s.el("circle", { cx: 160 + 58 * Math.cos(a), cy: 72 + 58 * Math.sin(a), r: 6, fill: "#0e7490" })); } v.append(s.el("path", { d: "M140 145 l20 -73 l20 73", stroke: "#5d6678", "stroke-width": 5, fill: "none" }), s.el("path", { d: "M0 140 q80 -10 160 0 t160 0 v10 h-320z", fill: "#7cc4f0" })); }
            if (n === 4) { v.append(s.el("rect", { x: 0, y: 100, width: 320, height: 50, fill: "#9fd68a" }), s.el("rect", { x: 40, y: 50, width: 16, height: 60, fill: "#8a5a2b" }), s.el("circle", { cx: 48, cy: 42, r: 34, fill: "#4fa83d" }), s.el("rect", { x: 110, y: 100, width: 170, height: 40, rx: 4, fill: "#dc3b2a" })); for (let i = 0; i < 4; i++) v.append(s.el("rect", { x: 120 + i * 40, y: 104, width: 32, height: 32, fill: "#fff", opacity: .5 })); v.append(s.el("polygon", { points: "160,112 200,112 160,90", fill: "#f4e1b0", stroke: "#c79a4a", "stroke-width": 3 }), s.el("circle", { cx: 240, cy: 106, r: 10, fill: "#d9342b" })); }
            if (n === 5) { v.append(s.el("rect", { x: 70, y: 30, width: 180, height: 110, rx: 6, fill: "#fff", stroke: "#5d6678", "stroke-width": 3, transform: "rotate(-6 160 85)" }), s.el("rect", { x: 200, y: 40, width: 36, height: 42, fill: "#dc3b2a", transform: "rotate(-6 160 85)" }), s.el("line", { x1: 160, y1: 40, x2: 165, y2: 130, stroke: "#5d6678", "stroke-width": 2 }), s.el("path", { d: "M92 70 h50 M90 86 h56 M88 102 h44", stroke: "#1d5bd0", "stroke-width": 3, transform: "rotate(-6 160 85)" })); }
            v.append(s.el("circle", { cx: 22, cy: 22, r: 15, fill: "#0e7490" }), s.el("text", { x: 22, y: 29, "text-anchor": "middle", "font-size": 20, "font-weight": 800, fill: "#fff", text: String(n + 1) }));
            return v;
          };
          const caps = [
            ["On Friday, Ruby's class ", "went", " on a school trip."],
            ["They ", "took", " the Tube to Westminster."],
            ["They ", "saw", " Big Ben and the Houses of Parliament."],
            ["They ", "went", " on the London Eye – 135 metres high!"],
            ["At lunchtime, they ", "had", " a picnic in the park."],
            ["Ruby ", "bought", " a postcard for Lukas."]];
          const panels = caps.map(([a, v, c], i) => s.h("div", { class: "card later", style: { padding: "8px", display: "flex", flexDirection: "column", gap: "6px", border: "3px solid var(--ink)", borderRadius: "10px" } },
            pic(i), line(s, a + v + c, { size: 20, show: [a, s.h("span", { style: { color: "var(--unit)" } }, v), c] })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", height: "100%", alignContent: "start" } }, panels));
          const snd = [["london-bus-sound", { vol: .45, dur: 2.5, fade: .6 }], ["mind-the-gap", { vol: .7 }], ["big-ben-chimes", { vol: .5, dur: 3.5, fade: .8 }], ["wind", { vol: .3, dur: 2.5, fade: .8 }], ["birds", { vol: .4, dur: 3, fade: .8 }], ["cash-register", { vol: .5 }]];
          s.preload(snd.map(x => x[0]));
          const pop = async i => { s.sound(snd[i][0], snd[i][1]); await s.show(panels[i], "zoom"); };
          pop(0);
          for (let i = 1; i < 6; i++) s.step(async () => { await pop(i); });
        },
      },
      /* 13 --------------------------------------------------------------- */
      {
        title: "Writing a diary",
        say: "Lukas schreibt Tagebuch auf Englisch. Er erzählt seinen Tag im simple past, schön der Reihe nach.",
        build(s) {
          const L = [
            ["Saturday, 3rd October 2026", "var(--pencil)"],
            ["Dear Diary,", null],
            ["Today was a great day!", null],
            [[HL(s, "In the morning"), ", I played football with my friends. We won 3:2!"], null],
            [[HL(s, "In the afternoon"), ", I visited my grandma. We made a cake."], null],
            [[HL(s, "In the evening"), ", I watched a film. I was very tired."], null],
            ["Lukas", null]];
          const lines = L.map(([t, c]) => s.h("p", { class: "hand later", style: { margin: 0, fontSize: "31px", lineHeight: "1.15", color: c || "var(--blue)" } }, t));
          const text = "Saturday, the third of October 2026. Dear Diary, today was a great day! In the morning, I played football with my friends. We won three two! In the afternoon, I visited my grandma. We made a cake. In the evening, I watched a film. I was very tired. Lukas";
          const diary = s.h("div", { class: "card", style: { padding: "16px 24px 16px 40px", background: "repeating-linear-gradient(#fff 0 35px, #dbe6f3 35px 36px)", borderLeft: "10px solid var(--unit)", display: "flex", flexDirection: "column", gap: "4px" } },
            s.h("div", { class: "ek-line", style: { justifyContent: "space-between" } }, s.h("span", { class: "exlabel", style: { margin: 0 } }, "Lukas's diary"), hear(s, text, "Vorlesen")), lines);
          const tips = s.h("div", { class: "card soft later", style: { padding: "12px 18px" } }, s.h("span", { class: "exlabel" }, "So schreibst du Tagebuch"),
            s.h("div", { class: "stack", style: { gap: "8px" } },
              s.h("p", { class: "small" }, "1. Datum oben: ", B(s, "Saturday, 3rd October")),
              s.h("p", { class: "small" }, "2. Anrede: ", B(s, "Dear Diary,")),
              s.h("p", { class: "small" }, "3. Der Reihe nach: ", B(s, "In the morning … In the afternoon … In the evening …")),
              s.h("p", { class: "small" }, "4. Verben im ", B(s, "simple past"), ": played, visited, made, was")));
          const more = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Noch mehr Wörter für die Reihenfolge"),
            s.h("div", { class: "row", style: { gap: "8px" } }, ["First", "Then", "After that", "In the end"].map(w => s.h("button", { class: "btn", style: { fontSize: "20px", padding: "0 14px" }, onclick: () => { s.sfx.click(); s.speak(w, EN); } }, w))));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "22px", height: "100%", alignItems: "start" } }, diary, s.h("div", { class: "stack", style: { gap: "14px" } }, tips, more)));
          const write = async (a, b) => { s.sound("pencil-write", { vol: .6 }); for (let i = a; i < b; i++) { await s.show(lines[i], "left"); } };
          write(0, 3);
          s.step(async () => { await write(3, 5); s.say("Am Morgen Fußball, am Nachmittag bei Oma."); });
          s.step(async () => { await write(5, 7); });
          s.step(async () => { s.sfx.whoosh(); await s.show(tips, "up"); });
          s.step(async () => { s.sfx.ding(); await s.show(more, "up"); });
        },
      },
      /* 14 --------------------------------------------------------------- */
      {
        title: "Im Alltag: a holiday postcard",
        say: "Lukas ist in den Ferien auf Rügen und schreibt Ruby eine Postkarte auf Englisch.",
        build(s) {
          const msg = [
            "Dear Ruby,",
            "Greetings from Rügen! It's an island in the Baltic Sea.",
            [B(s, "Yesterday"), " we ", U(s, "went"), " to the beach. The water ", U(s, "was"), " very cold!"],
            ["Then we ", U(s, "walked"), " to the white chalk cliffs. They ", U(s, "were"), " amazing!"],
            "See you soon,",
            "Lukas"].map(t => s.h("p", { class: "hand later", style: { margin: 0, fontSize: "29px", lineHeight: "1.15", color: "var(--blue)" } }, t));
          const text = "Dear Ruby, greetings from Rügen! It's an island in the Baltic Sea. Yesterday we went to the beach. The water was very cold! Then we walked to the white chalk cliffs. They were amazing! See you soon, Lukas";
          const stamp = s.svg(110, 120);
          stamp.append(s.el("rect", { x: 5, y: 5, width: 100, height: 110, fill: "#fff", stroke: "#0e7490", "stroke-width": 3, "stroke-dasharray": "6 4" }), s.el("rect", { x: 16, y: 16, width: 78, height: 88, fill: "#dff3f7" }),
            s.el("path", { d: "M16 80 q20 -40 40 -10 q14 -30 38 -20 v54 h-78z", fill: "#fff", stroke: "#9aa6b4", "stroke-width": 2 }), s.el("path", { d: "M16 96 q40 -8 78 0 v8 h-78z", fill: "#7cc4f0" }), s.el("circle", { cx: 74, cy: 34, r: 9, fill: "#ffd94a" }));
          const stampWrap = s.h("div", { class: "later", style: { alignSelf: "flex-end" } }, stamp);
          const addr = ["Ruby", "72 Rose Street", "London", "UK"].map(t => s.h("p", { class: "hand later", style: { margin: 0, fontSize: "30px", borderBottom: "2px solid var(--line)", paddingBottom: "2px" } }, t));
          const card = s.h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "1.5fr 2px 1fr", gap: "20px", padding: "18px 24px", boxShadow: "0 8px 0 rgba(0,0,0,.08)" } },
            s.h("div", { class: "stack", style: { gap: "6px" } }, msg),
            s.h("div", { style: { background: "var(--line)" } }),
            s.h("div", { class: "stack", style: { gap: "10px" } }, stampWrap, s.h("div", { class: "stack", style: { gap: "10px", marginTop: "10px" } }, addr)));
          const ph = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Postkarten-Sätze"),
            s.h("div", { class: "row", style: { gap: "10px" } }, hear(s, text, "Ganze Karte"), ...["Greetings from …!", "Yesterday we …", "It was amazing!", "See you soon,"].map(w => s.h("button", { class: "btn", style: { fontSize: "20px", padding: "0 14px" }, onclick: () => { s.sfx.click(); s.speak(w.replace("…", ""), EN); } }, w))));
          const front = s.photo("ruegen-cliffs", { w: 360, h: 240, caption: "Kreidefelsen auf Rügen", cls: "later" });
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "14px" } }, card, s.h("div", { style: { display: "grid", gridTemplateColumns: "360px 1fr", gap: "16px", alignItems: "center" } }, front, ph)));
          s.sfx.whoosh(); s.show(card, "zoom");
          const write = async (a, b) => { s.sound("pencil-write", { vol: .6 }); for (let i = a; i < b; i++) { await s.show(msg[i], "left"); } };
          write(0, 2);
          s.step(async () => { s.sound("waves", { vol: .4, dur: 4, fade: 1 }); s.show(front, "zoom"); await write(2, 4); s.say("Gestern war Lukas am Strand und bei den weißen Kreidefelsen."); });
          s.step(async () => { await write(4, 6); s.sfx.snap(); await s.show(stampWrap, "zoom"); s.sound("pencil-write", { vol: .5 }); await seq(s, addr, "left", 200, () => {}); });
          s.step(async () => { s.sfx.ding(); await s.show(ph, "up"); });
        },
      },
      /* 15 --------------------------------------------------------------- */
      {
        title: "How was your weekend?",
        say: "Ruby und Lukas schreiben sich am Montag. Sie erzählen, was sie am Wochenende gemacht haben.",
        build(s) {
          const M = [
            ["R", "Hi Lukas! How was your weekend?"],
            ["L", "It was great! I played football on Saturday."],
            ["R", "Cool! Did you win?"],
            ["L", "Yes, we did! 3:2. What did you do?", "Yes, we did! Three two. What did you do?"],
            ["R", "I went to the cinema with my dad."],
            ["L", "Did you eat popcorn?"],
            ["R", "Of course I did!"]];
          const msgs = M.map(([w, t, sp]) => s.h("div", { class: "ek-line later", style: { flexDirection: w === "L" ? "row-reverse" : "row", gap: "8px" } },
            s.h("span", { class: "ek-av", style: { background: w === "L" ? "var(--unit)" : "var(--blue)", width: "40px", height: "40px", fontSize: "19px" } }, w),
            s.h("p", { class: "ek-bub", style: { fontSize: "21px", padding: "6px 12px", background: w === "L" ? "var(--unit-soft)" : "#fff", borderColor: w === "L" ? "var(--unit)" : "var(--blue)", flex: "0 1 auto" } }, t),
            hear(s, sp || t)));
          const phone = s.h("div", { style: { background: "#1b2740", borderRadius: "32px", padding: "14px", height: "636px" } },
            s.h("div", { style: { background: "#f4f7fb", borderRadius: "22px", height: "100%", padding: "12px", display: "flex", flexDirection: "column", gap: "9px" } },
              s.h("p", { class: "ek-tag", style: { textAlign: "center" } }, "Ruby ↔ Lukas · Monday"), msgs));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Fragen: ", B(s, "How was your weekend? What did you do?"), s.h("br"), "Antworten: ", B(s, "It was great / OK / boring."), " + was du gemacht hast: I played …, I went …");
          const words = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("span", { class: "exlabel" }, "Und du? Erzähl!"),
            s.h("div", { class: "stack", style: { gap: "8px" } }, line(s, "On Saturday, I visited my friends.", { size: 21 }), line(s, "On Sunday, I didn't do much.", { size: 21 })));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "600px 1fr", gap: "22px", height: "100%" } }, phone, s.h("div", { class: "stack", style: { gap: "14px" } }, merk, words)));
          const pop = async (a, b) => { for (let i = a; i < b; i++) { s.sfx.note(i % 2 ? 7 : 12, .12); await s.show(msgs[i], M[i][0] === "L" ? "right" : "left"); } };
          pop(0, 2);
          s.step(async () => { await pop(2, 4); });
          s.step(async () => { await pop(4, 7); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.whoosh(); await s.show(words, "up"); });
        },
      },
      /* 16 --------------------------------------------------------------- */
      {
        title: "Im Alltag: news for kids",
        say: "Nachrichten und Geschichtsberichte stehen fast immer im simple past. Hier sind drei echte Nachrichten aus der Geschichte Londons.",
        build(s) {
          const PH = [["big-ben", "Elizabeth Tower heute", "50% 30%"], ["tower-bridge-1892", "Baustelle 1892", "50% 50%"], ["london-eye", "London Eye heute", "40% 50%"]];
          const pic = n => s.photo(PH[n][0], { w: "100%", h: 170, caption: PH[n][1], pos: PH[n][2] });
          void (n => {
            const v = s.svg(300, 110);
            v.append(s.el("rect", { x: 0, y: 0, width: 300, height: 110, rx: 8, fill: "#e9f6fb" }));
            if (n === 0) { v.append(s.el("rect", { x: 130, y: 20, width: 40, height: 90, fill: "#d9b46a", stroke: "#8a6a2a", "stroke-width": 3 }), s.el("path", { d: "M130 20 l20 -18 l20 18z", fill: "#5d6678" }), s.el("circle", { cx: 150, cy: 42, r: 13, fill: "#fff", stroke: "#1b2740", "stroke-width": 3 })); [60, 240].forEach(x => v.append(s.el("path", { d: `M${x} 40 q${x < 150 ? -14 : 14} 15 0 30`, stroke: "#0e7490", "stroke-width": 4, fill: "none" }))); }
            if (n === 1) { v.append(s.el("path", { d: "M0 95 h300 v15 h-300z", fill: "#7cc4f0" })); [70, 230].forEach(x => v.append(s.el("rect", { x: x - 18, y: 20, width: 36, height: 80, fill: "#cfd6df", stroke: "#5d6678", "stroke-width": 3 }), s.el("path", { d: `M${x - 18} 20 l18 -14 l18 14z`, fill: "#5d6678" }))); v.append(s.el("rect", { x: 52, y: 32, width: 196, height: 8, fill: "#1d5bd0" }), s.el("rect", { x: 0, y: 70, width: 300, height: 10, fill: "#5d6678" })); }
            if (n === 2) { v.append(s.el("circle", { cx: 150, cy: 52, r: 44, fill: "none", stroke: "#5d6678", "stroke-width": 4 })); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; v.append(s.el("circle", { cx: 150 + 44 * Math.cos(a), cy: 52 + 44 * Math.sin(a), r: 5, fill: "#0e7490" })); } v.append(s.el("path", { d: "M134 110 l16 -58 l16 58", stroke: "#5d6678", "stroke-width": 4, fill: "none" })); }
            return v;
          });
          const A = [
            ["London's big clock", "The Great Clock in London chimed for the first time on 11th July 1859.", "The Great Clock in London chimed for the first time on the eleventh of July, eighteen fifty-nine."],
            ["A new bridge for London", "Tower Bridge opened on 30th June 1894. The Prince and Princess of Wales opened it.", "Tower Bridge opened on the thirtieth of June, eighteen ninety-four. The Prince and Princess of Wales opened it."],
            ["A giant wheel", "The London Eye opened to the public in March 2000. It is 135 metres tall.", "The London Eye opened to the public in March two thousand. It is one hundred and thirty-five metres tall."]];
          const arts = A.map(([hd, t, sp], i) => s.h("div", { class: "card later", style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px", borderTop: "6px solid var(--ink)", borderRadius: "6px" } },
            s.h("p", { class: "h2", style: { fontSize: "25px" } }, hd), pic(i), s.h("p", { class: "ek-en", style: { fontSize: "21px", lineHeight: "1.35", flex: 1 } }, t), hear(s, sp, "Anhören")));
          const mast = s.h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "4px double var(--ink)", paddingBottom: "4px" } },
            s.h("p", { class: "big", style: { fontFamily: "Georgia, serif" } }, "Class News"), s.h("p", { class: "ek-tag" }, "London history special"));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Nachrichten und Geschichten erzählen, was schon passiert ist – deshalb ", B(s, "simple past"), ": opened, chimed, was. Aber: Was heute noch stimmt, steht im Präsens: It ", B(s, "is"), " 135 metres tall.");
          s.add(s.h("div", { class: "stack", style: { height: "100%", gap: "12px" } }, mast, s.h("div", { class: "cols3", style: { gap: "16px" } }, arts), merk));
          s.sfx.whoosh();
          s.step(async () => { s.sound("big-ben-chimes", { vol: .5, dur: 5, fade: 1 }); await seq(s, arts, "up", 450, () => {}); s.say("Die Glocke, die Brücke, das Riesenrad."); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.confetti(590, 300, 60); });
        },
      },
    ],
  });
})();
