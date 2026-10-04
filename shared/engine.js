/* Mathe Klasse 5 – slide engine.
   Units register themselves with Deck.unit({...}); see units/README.md for the slide API. */
(() => {
  "use strict";
  const W = 1180, H = 820;
  const NS = "http://www.w3.org/2000/svg";

  /* ---------------- sound: everything synthesised with WebAudio (no files, no licences) ---------------- */
  const Sfx = (() => {
    let ac = null, master = null, on = true;
    function audio() {
      if (!ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ac = new AC();
        master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination);
      }
      if (ac.state === "suspended") ac.resume();
      return ac;
    }
    function tone(freq, dur = 0.15, type = "sine", vol = 0.25, when = 0, slideTo = null) {
      if (!on || Deck.fast || !Number.isFinite(freq) || !Number.isFinite(dur) || freq <= 0 || dur <= 0) return;
      const a = audio(); if (!a) return;
      const t = a.currentTime + when;
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
    }
    function noise(dur = 0.3, vol = 0.2, f0 = 400, f1 = 3000, when = 0, q = 1.2) {
      if (!on || Deck.fast) return;
      const a = audio(); if (!a) return;
      const t = a.currentTime + when;
      const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource(); src.buffer = buf;
      const f = a.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = a.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + dur + 0.05);
    }
    const semi = n => 523.25 * Math.pow(2, n / 12); // n semitones above C5
    return {
      unlock: audio,
      get master() { audio(); return master; },
      get on() { return on; }, set on(v) { on = !!v; },
      tone, noise,
      pop() { tone(500, 0.09, "sine", 0.3, 0, 1100); },
      click() { tone(1600, 0.03, "square", 0.06); },
      tick() { tone(2600, 0.025, "square", 0.04); },
      whoosh() { noise(0.4, 0.22, 300, 3500); },
      swoosh() { noise(0.25, 0.18, 3000, 600); },
      snap() { noise(0.06, 0.35, 2500, 5000, 0, 3); },
      ding() { tone(1318.5, 0.7, "sine", 0.22); tone(2637, 0.4, "sine", 0.05); },
      coin() { tone(987.8, 0.08, "square", 0.1); tone(1318.5, 0.35, "square", 0.1, 0.08); },
      success() { [0, 4, 7, 12].forEach((n, i) => tone(semi(n), 0.28, "triangle", 0.2, i * 0.085)); },
      error() { tone(240, 0.22, "sawtooth", 0.1, 0, 160); tone(190, 0.3, "sawtooth", 0.09, 0.13, 120); },
      count(i = 0) { if (!Number.isFinite(i)) i = 0; i = Math.max(0, Math.round(i)); const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]; tone(semi(scale[Math.min(i, scale.length - 1)] - 12), 0.12, "triangle", 0.2); },
      note(n = 0, dur = 0.2, type = "triangle") { tone(semi(n), dur, type, 0.2); },
      drum() { tone(150, 0.25, "sine", 0.5, 0, 45); noise(0.05, 0.12, 1500, 800); },
      boing() { tone(180, 0.35, "sine", 0.3, 0, 520); },
      zap() { tone(1400, 0.18, "sawtooth", 0.07, 0, 300); },
      fanfare() { [[0, 0], [4, .12], [7, .24], [12, .36], [7, .52], [12, .62]].forEach(([n, w]) => tone(semi(n), 0.25, "square", 0.08, w)); },
      chord(ns = [0, 4, 7]) { ns.forEach(n => tone(semi(n), 0.6, "sine", 0.12)); },
      scribble() { for (let i = 0; i < 4; i++) noise(0.06, 0.1, 3000, 4500, i * 0.07, 4); },
    };
  })();

  /* ---------------- media: real photos + recorded sounds ----------------
     Files live in <deck>/media/ and shared/media/; each folder has a credits.js (written by tools/media.py)
     that calls Deck.media(base, {id: {file, kind, w, h, title, author, license, license_url, source}}). */
  const Media = (() => {
    const reg = {}, bufs = {};
    function add(base, map) { for (const [id, m] of Object.entries(map)) reg[id] = Object.assign({ id, src: base + m.file }, m); }
    function get(id) { const m = reg[id]; if (!m) console.error("media: unknown id \"" + id + "\" (add it with tools/media.py)"); return m; }
    function load(id) {
      if (bufs[id]) return bufs[id];
      const m = get(id); if (!m || m.kind !== "snd") return Promise.resolve(null);
      const a = Sfx.unlock(); if (!a) return Promise.resolve(null);
      bufs[id] = fetch(m.src).then(r => { if (!r.ok) throw new Error("media: " + r.status + " " + m.src); return r.arrayBuffer(); })
        .then(ab => new Promise((res, rej) => a.decodeAudioData(ab, res, rej)))
        .catch(err => { console.error(String(err)); delete bufs[id]; return null; });
      return bufs[id];
    }
    const dummy = () => ({ stop() {}, done: Promise.resolve(), playing: false });
    /** play a recorded sound. opts: {vol=1, rate=1, loop=false, when=0 (s), from=0 (s), dur (s), fade=0.15 (s fade-out on stop), force} */
    function play(id, { vol = 1, rate = 1, loop = false, when = 0, from = 0, dur, fade = 0.15, force = false } = {}) {
      if (!get(id) || Deck.fast || (!Sfx.on && !force)) return dummy();
      const a = Sfx.unlock(); if (!a) return dummy();
      let src = null, g = null, stopped = false, resolve;
      const handle = { playing: true, done: new Promise(r => (resolve = r)) };
      const end = () => { handle.playing = false; resolve(); };
      handle.stop = (f = fade) => {
        if (stopped) return; stopped = true;
        if (src && g) { const t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + f); try { src.stop(t + f + 0.02); } catch (e) {} }
        else end();
      };
      load(id).then(buf => {
        if (!buf || stopped) return end();
        src = a.createBufferSource(); src.buffer = buf; src.loop = loop; src.playbackRate.value = rate;
        g = a.createGain(); g.gain.value = vol;
        src.connect(g); g.connect(Sfx.master);
        src.onended = end;
        const t = a.currentTime + when;
        if (dur != null && !loop) src.start(t, from, dur); else src.start(t, from);
      });
      return handle;
    }
    function credit(m) {
      if (!m) return "";
      return [m.title, m.author && (m.kind === "snd" ? "Ton: " : "Foto: ") + m.author, m.license, m.source && m.source.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]].filter(Boolean).join(" · ");
    }
    return { add, get, load, play, credit, all: () => Object.values(reg) };
  })();

  /* ---------------- voice: read-aloud ----------------
     Pre-recorded clips (Gemini TTS, made by tools/voice.py) live in <deck>/voice/ and are registered by
     <deck>/voice/index.js via Deck.voiceClips(base, {key: file}). The key is a hash of language + text, so any
     text without a clip (e.g. computed at runtime) falls back to the browser's speech synthesis. */
  const Voice = {
    on: false, clips: {}, bufs: {}, cur: null, seq: 0,
    key(text, lang = "de-DE") {
      const str = lang.slice(0, 2).toLowerCase() + "|" + String(text).trim();
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
    },
    voice(lang = "de") {
      if (!window.speechSynthesis) return null;
      const want = lang.slice(0, 2).toLowerCase();
      const vs = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith(want));
      const exact = vs.filter(v => v.lang.toLowerCase().replace("_", "-") === lang.toLowerCase());
      const pool = exact.length ? exact : vs;
      return pool.find(v => /Anna|Petra|Helena|Daniel|Serena|Kate|Google/i.test(v.name)) || pool[0] || null;
    },
    /** the text as it should be pronounced (Mathe: "·" → "mal", ":" → "geteilt durch") */
    spoken(text, lang = "de-DE") {
      let t = String(text);
      const isMath = !Deck.meta || !Deck.meta.subject || Deck.meta.subject === "Mathe";
      if (isMath && lang.startsWith("de")) t = t.replace(/([\d)²³])\s*·\s*(?=[\d(a-z])/g, "$1 mal ").replace(/(\d)\s+:\s+(?=\d)/g, "$1 geteilt durch ");
      return t;
    },
    speak(text, { lang = "de-DE", rate = 0.95, pitch = 1.05 } = {}) {
      if (Deck.voiceLog && text) Deck.voiceLog.push([lang, String(text)]);
      if (!text || Deck.fast) return;
      this.stop();
      const file = this.clips[this.key(text, lang)];
      if (file && this.playClip(file)) return;
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(this.spoken(text, lang));
      u.lang = lang; u.rate = rate; u.pitch = pitch;
      const v = this.voice(lang); if (v) u.voice = v;
      speechSynthesis.speak(u);
    },
    playClip(file) {
      const a = Sfx.unlock(); if (!a) return false;
      const my = ++this.seq;
      if (!this.bufs[file]) this.bufs[file] = fetch(file).then(r => { if (!r.ok) throw new Error("voice: " + r.status + " " + file); return r.arrayBuffer(); })
        .then(ab => new Promise((res, rej) => a.decodeAudioData(ab, res, rej)))
        .catch(err => { console.error(String(err)); delete this.bufs[file]; return null; });
      this.bufs[file].then(buf => {
        if (!buf || my !== this.seq) return;
        const src = a.createBufferSource(); src.buffer = buf;
        const g = a.createGain(); g.gain.value = 1; src.connect(g); g.connect(a.destination);
        src.start(); this.cur = src;
        src.onended = () => { if (this.cur === src) this.cur = null; };
      });
      return true;
    },
    say(text, force = false) {
      if (Deck.voiceLog && text) Deck.voiceLog.push(["de-DE", String(text)]);
      if ((!this.on && !force) || !text) return;
      this.speak(text);
    },
    stop() {
      this.seq++;
      if (this.cur) { try { this.cur.stop(); } catch (e) {} this.cur = null; }
      try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    },
  };
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};

  /* ---------------- DOM helpers ---------------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    setAttrs(el, attrs);
    append(el, kids);
    return el;
  }
  function setAttrs(el, attrs) {
    if (!attrs) return;
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.setAttribute("class", v);
      else if (k === "style" && typeof v === "object") { for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith("--")) el.style.setProperty(sk, sv); else el.style[sk] = sv; } }
      else if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
  }
  function append(el, kids) {
    for (const k of kids.flat(Infinity)) {
      if (k == null || k === false) continue;
      el.appendChild(typeof k === "object" ? k : document.createTextNode(String(k)));
    }
  }
  function svgEl(tag, attrs, ...kids) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "text") el.textContent = v;
      else if (k === "style" && typeof v === "object") { for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith("--")) el.style.setProperty(sk, sv); else el.style[sk] = sv; } }
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    append(el, kids);
    return el;
  }
  const ease = {
    linear: t => t,
    in: t => t * t * t,
    out: t => 1 - Math.pow(1 - t, 3),
    inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    bounce: t => { const n1 = 7.5625, d1 = 2.75; if (t < 1 / d1) return n1 * t * t; if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75; if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375; return n1 * (t -= 2.625 / d1) * t + 0.984375; },
    elastic: t => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmt = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------------- confetti ---------------- */
  let confettiCanvas, confettiParts = [], confettiRaf = 0;
  function confetti(x = W / 2, y = H / 2, n = 90) {
    if (Deck.fast) return;
    const colors = ["#1d5bd0", "#dc3b2a", "#ffd94a", "#138a5a", "#7b4fd6", "#ee7a1a"];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      confettiParts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, r: Math.random() * 6.28, vr: (Math.random() - .5) * .4, w: 8 + Math.random() * 8, h: 5 + Math.random() * 5, c: colors[i % colors.length], life: 0 });
    }
    if (!confettiRaf) confettiRaf = requestAnimationFrame(confettiLoop);
  }
  function confettiLoop() {
    const c = confettiCanvas.getContext("2d");
    c.clearRect(0, 0, W, H);
    confettiParts = confettiParts.filter(p => p.life < 140 && p.y < H + 40);
    for (const p of confettiParts) {
      p.life++; p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.globalAlpha = Math.min(1, (140 - p.life) / 30);
      c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
    }
    confettiRaf = confettiParts.length ? requestAnimationFrame(confettiLoop) : (c.clearRect(0, 0, W, H), 0);
  }

  /* ---------------- stage scaling + pointer mapping ---------------- */
  let stage, scale = 1, offX = 0, offY = 0;
  function fit() {
    const vw = window.innerWidth, vh = window.innerHeight;
    scale = Math.min(vw / W, vh / H);
    offX = (vw - W * scale) / 2; offY = (vh - H * scale) / 2;
    stage.style.transform = `translate(${offX}px, ${offY}px) scale(${scale})`;
  }
  function toStage(e) {
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - offX) / scale, y: (p.clientY - offY) / scale };
  }
  /** point in the local coordinate system of el (works for HTML and SVG elements) */
  function localPoint(e, el) {
    const p = e.touches ? e.touches[0] : e;
    if (el instanceof SVGElement) {
      const svg = el.ownerSVGElement || el;
      const pt = svg.createSVGPoint(); pt.x = p.clientX; pt.y = p.clientY;
      const m = (el.getScreenCTM ? el : svg).getScreenCTM();
      const r = pt.matrixTransform(m.inverse());
      return { x: r.x, y: r.y };
    }
    const r = el.getBoundingClientRect();
    return { x: (p.clientX - r.left) / scale, y: (p.clientY - r.top) / scale };
  }

  /* ---------------- icons ---------------- */
  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    voice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.6"/><path d="M2.5 21a6.5 6.5 0 0113 0"/><path d="M16.5 5.5a4 4 0 010 5"/><path d="M19.5 3a8 8 0 010 10"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8"/><path d="M3 3v5h5"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  };
  const iconBtn = (name, label, onclick) => { const b = h("button", { class: "iconbtn", "aria-label": label, title: label, onclick }); b.innerHTML = ICON[name]; return b; };

  /* ---------------- progress (per-viewer convenience only) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem((Deck.meta.key || "mk5") + ":" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem((Deck.meta.key || "mk5") + ":" + k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------------- the deck ---------------- */
  const Deck = (window.Deck = {
    units: [], meta: {}, fast: false, Sfx, Voice, ease, lerp, fmt, h, svgEl, toStage, localPoint, confetti, W, H,
    unit(def) { this.units.push(def); this.units.sort((a, b) => a.num - b.num); },
    media(base, map) { Media.add(base, map); },
    voiceClips(base, map) { for (const [k, f] of Object.entries(map)) Voice.clips[k] = base + f; },
    voiceKey: (text, lang) => Voice.key(text, lang),
    voiceSpoken: (text, lang) => Voice.spoken(text, lang),
    Media,
  });

  let cur = null; // { u, s, ctx }
  let headerEls = {}, contentEl, slideHost, footerEls = {};

  function makeCtx(unit, slideDef, host) {
    const cleanups = [];
    const steps = [];
    let alive = true;
    let chain = Promise.resolve();
    const ctx = {
      unit, slide: slideDef, root: host, W: 1100, H: 636,
      sfx: Sfx, ease, lerp, fmt, h, confetti: (x, y, n) => confetti(x, y, n),
      get fast() { return Deck.fast; },
      get alive() { return alive; },
      say: t => Voice.say(t),
      /** speak now (user tapped a button), ignores the Vorlesen toggle. opts: {lang:"en-GB", rate} */
      speak: (t, opts) => Voice.speak(t, opts),
      el: svgEl,
      add(...kids) { append(host, kids); return kids[0]; },
      svg(w, hgt, attrs = {}) { return svgEl("svg", Object.assign({ width: w, height: hgt, viewBox: `0 0 ${w} ${hgt}` }, attrs)); },
      step(fn) { steps.push(fn); return ctx; },
      steps,
      stepIndex: 0,
      onLeave(fn) { cleanups.push(fn); },
      wait(ms) {
        return new Promise(res => {
          if (Deck.fast || !alive) return res();
          const id = setTimeout(res, ms); cleanups.push(() => { clearTimeout(id); res(); });
        });
      },
      tween({ from = 0, to = 1, dur = 600, delay = 0, ease: e = "inOut", update }) {
        const fn = typeof e === "function" ? e : ease[e] || ease.inOut;
        return new Promise(res => {
          if (Deck.fast || !alive) { update && update(to, 1); return res(); }
          let start = null, raf = 0, done = false;
          const finish = () => { if (done) return; done = true; cancelAnimationFrame(raf); res(); };
          const frame = ts => {
            if (!alive) return finish();
            if (start == null) start = ts + delay;
            const t = Math.max(0, Math.min(1, (ts - start) / dur));
            if (ts >= start) update && update(lerp(from, to, fn(t)), t);
            if (t < 1) raf = requestAnimationFrame(frame); else finish();
          };
          raf = requestAnimationFrame(frame);
          cleanups.push(finish);
        });
      },
      /** add an animation class (pop, fade, up, down, left, right, zoom, bounce, draw) and reveal the element */
      show(el, kind = "pop", delay = 0) {
        if (!el || !alive) return Promise.resolve();
        const els = Array.isArray(el) ? el : [el];
        els.forEach((x, i) => {
          x.classList.remove("later"); x.removeAttribute("hidden");
          if (kind === "draw" && x.getTotalLength) { let len = 1000; try { len = Math.ceil(x.getTotalLength()) + 1; } catch (e) {} x.style.setProperty("--len", len); }
          x.style.setProperty("--d", (delay + (Array.isArray(el) ? i * 120 : 0)) + "ms");
          x.classList.remove("a-" + kind); void x.getBoundingClientRect(); x.classList.add("a-" + kind);
        });
        return ctx.wait(delay + (els.length - 1) * 120 + (kind === "draw" ? 1000 : 550));
      },
      hide(el) { (Array.isArray(el) ? el : [el]).forEach(x => x.classList.add("later")); },
      /** requestAnimationFrame loop; fn(t seconds, dt). Stops when the slide is left or fn returns false. */
      loop(fn) {
        let raf = 0, last = null, t0 = null, stop = false;
        const frame = ts => {
          if (!alive || stop) return;
          if (t0 == null) { t0 = ts; last = ts; }
          const r = fn((ts - t0) / 1000, (ts - last) / 1000); last = ts;
          if (r === false) return;
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        const cancel = () => { stop = true; cancelAnimationFrame(raf); };
        cleanups.push(cancel);
        return cancel;
      },
      /** hi-dpi canvas: returns {canvas, g} where g is the 2D context in CSS pixels */
      canvas(w, hgt, attrs = {}) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, scale);
        const c = h("canvas", Object.assign({ width: Math.round(w * dpr), height: Math.round(hgt * dpr) }, attrs));
        c.style.width = w + "px"; c.style.height = hgt + "px";
        const g = c.getContext("2d"); g.scale(dpr, dpr);
        return { canvas: c, g, w, h: hgt };
      },
      /** pointer drag on an element. opts: {onStart(p,e), onMove(p,e), onEnd(p,e), space: element for local coords} */
      drag(el, opts = {}) {
        el.classList.add("draggable");
        const space = opts.space || el.parentNode;
        let active = false;
        const down = e => { active = true; el.classList.add("dragging"); try { el.setPointerCapture(e.pointerId); } catch (_) {} opts.onStart && opts.onStart(localPoint(e, space), e); e.preventDefault(); };
        const move = e => { if (!active) return; opts.onMove && opts.onMove(localPoint(e, space), e); e.preventDefault(); };
        const up = e => { if (!active) return; active = false; el.classList.remove("dragging"); opts.onEnd && opts.onEnd(localPoint(e, space), e); };
        el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
      },
      /** real photo (id from media/credits.js) in a fixed w×h box. opts: {w, h, fit:"cover"|"contain",
          pos:"50% 30%" (object-position), caption, kb (slow Ken-Burns zoom), cls, style, credit:true} */
      photo(id, { w = 420, h: ph = 300, fit = "cover", pos = "50% 50%", caption, kb = false, cls = "", style = {}, credit = true, attrs = {} } = {}) {
        const m = Media.get(id) || { title: id };
        const px = v => (typeof v === "number" ? v + "px" : v);
        const img = h("img", { src: m.src, alt: m.title || id, draggable: "false", decoding: "async", style: { objectFit: fit, objectPosition: pos } });
        const fig = h("figure", Object.assign({ class: "photo" + (kb ? " kb" : "") + (fit === "contain" ? " contain" : "") + (cls ? " " + cls : ""), style: Object.assign({ width: px(w), height: px(ph) }, style) }, attrs), img);
        if (caption) fig.append(h("figcaption", null, caption));
        if (credit) fig.append(h("button", { class: "credit", "aria-label": "Bildquelle", onclick: e => { e.stopPropagation(); Sfx.click(); toast(Media.credit(m)); } }, "©"));
        return fig;
      },
      /** play a recorded sound (id from media/credits.js); stops automatically when the slide is left.
          opts: {vol, rate, loop, when, from, dur, fade}. Returns {stop(), done, playing}. */
      sound(id, opts = {}) {
        const hnd = Media.play(id, opts);
        if (hnd.playing) cleanups.push(() => hnd.stop(0.08));
        return hnd;
      },
      /** button that plays/stops a recorded sound (plays even when effects are muted – the child asked for it) */
      soundBtn(id, label = "Anhören", opts = {}) {
        const b = h("button", { class: "btn sndbtn" + (opts.solid ? " solid" : ""), "aria-label": label });
        b.innerHTML = ICON.play;
        b.append(h("span", null, label));
        let cur = null;
        b.addEventListener("click", () => {
          if (cur) { cur.stop(); return; }
          b.classList.add("playing"); opts.onPlay && opts.onPlay();
          cur = ctx.sound(id, Object.assign({ force: true }, opts));
          cur.done.then(() => { cur = null; b.classList.remove("playing"); opts.onEnd && opts.onEnd(); });
        });
        return b;
      },
      /** start fetching/decoding sounds early (sounds named literally in build() are preloaded automatically) */
      preload(...ids) { ids.flat().forEach(id => Media.load(id)); },
      /** big touch slider */
      slider({ label = "", min = 0, max = 10, step = 1, value = 0, fmt: f = v => fmt(v), onInput, id }) {
        const val = h("span", { class: "mono" }, f(value));
        const inp = h("input", { type: "range", min, max, step, value, id: id || "sl-" + Math.random().toString(36).slice(2, 8), "aria-label": label });
        let lastTick = value;
        inp.addEventListener("input", () => {
          const v = Number(inp.value); val.textContent = f(v);
          if (v !== lastTick) { Sfx.tick(); lastTick = v; }
          onInput && onInput(v);
        });
        const wrap = h("div", { class: "slider" }, h("div", { class: "sl-top" }, h("span", null, label), val), inp);
        wrap.input = inp; wrap.set = v => { inp.value = v; val.textContent = f(Number(v)); onInput && onInput(Number(v)); };
        return wrap;
      },
    };
    ctx._kill = () => { alive = false; cleanups.splice(0).forEach(f => { try { f(); } catch (e) {} }); };
    ctx._next = () => {
      if (ctx.stepIndex >= steps.length) return false;
      const fn = steps[ctx.stepIndex++];
      chain = chain.then(() => (alive ? fn(ctx) : null)).catch(err => console.error(err));
      return chain;
    };
    ctx._chain = () => chain;
    return ctx;
  }

  /* ---------- auto title card for every unit ---------- */
  function titleSlide(unit) {
    return {
      title: unit.title, auto: true,
      say: `Kapitel ${unit.num}. ${unit.title}. ${unit.subtitle || ""}`,
      build(s) {
        const left = s.h("div", null,
          s.h("div", { class: "bignum a-zoom" }, String(unit.num)),
          s.h("h2", { class: "tt a-up", style: { "--d": "200ms" } }, unit.title),
          s.h("p", { class: "ts a-up", style: { "--d": "350ms" } }, unit.subtitle || ""));
        const ul = s.h("ul", null, (unit.goals || []).map((g, i) => s.h("li", { class: "a-left", style: { "--d": 450 + i * 130 + "ms" } }, s.h("b", null, "→"), s.h("span", null, g))));
        const right = s.h("div", { class: "card", style: { padding: "26px 28px" } }, s.h("p", { class: "hand", style: { margin: "0 0 14px", color: "var(--red)" } }, "Das lernst du:"), ul);
        s.add(s.h("div", { class: "titlecard" }, left, right));
        Sfx.whoosh();
        if (unit.goals) unit.goals.forEach((_, i) => setTimeout(() => s.alive && Sfx.count(i), 450 + i * 130));
      },
    };
  }
  const slidesOf = unit => [titleSlide(unit), ...unit.slides];

  /* ---------- toast (photo credits) + Quellen panel ---------- */
  let toastEl = null, toastTimer = 0;
  function toast(text) {
    if (!toastEl || !toastEl.isConnected) { toastEl = h("div", { class: "toast" }); stage.appendChild(toastEl); }
    toastEl.textContent = text; toastEl.classList.add("on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl && toastEl.classList.remove("on"), 4500);
  }
  function showCredits() {
    const items = Media.all().sort((a, b) => (a.kind + a.id).localeCompare(b.kind + b.id));
    const row = m => h("li", null, h("b", null, (m.kind === "snd" ? "♪ " : "") + (m.title || m.id)), " – ", [m.author, m.license].filter(Boolean).join(", "), " ",
      m.source ? h("a", { href: m.source, target: "_blank", rel: "noopener" }, "Quelle") : null,
      m.license_url ? [" · ", h("a", { href: m.license_url, target: "_blank", rel: "noopener" }, "Lizenz")] : null);
    const panel = h("div", { class: "credits" },
      h("div", { class: "cr-top" }, h("h2", null, "Bild- und Tonquellen"), h("button", { class: "btn", onclick: () => { Sfx.click(); panel.remove(); } }, "Schließen")),
      h("p", null, "Fotos und Tonaufnahmen von Wikimedia Commons, Freesound u. a. unter freien Lizenzen (gemeinfrei, CC0, CC BY, CC BY-SA). Danke an alle Urheberinnen und Urheber!"),
      h("ul", null, items.filter(m => m.kind !== "snd").map(row)),
      h("h3", null, "Töne"),
      h("ul", null, items.filter(m => m.kind === "snd").map(row)));
    stage.appendChild(panel);
  }
  /** sounds named literally in a slide's build() source – fetched as soon as the slide (or its neighbour) opens */
  function preloadSlide(def) {
    if (!def || !def.build || Deck.fast) return;
    const re = /\b(?:sound|soundBtn|preload)\(\s*["'`]([\w.-]+)["'`]/g; let m;
    const src = def.build.toString();
    while ((m = re.exec(src))) if (Media.get(m[1])) Media.load(m[1]);
  }
  const PAGE_TURNS = ["page-turn-1", "page-turn-2", "page-turn-3"];
  function pageTurn() {
    const have = PAGE_TURNS.filter(id => Media.all().some(m => m.id === id));
    if (!have.length) return Sfx.swoosh();
    Media.play(have[Math.floor(Math.random() * have.length)], { vol: 0.55 });
  }

  /* ---------- render ---------- */
  function buildChrome() {
    stage.innerHTML = "";
    const hdr = h("div", { class: "hdr" });
    headerEls.home = iconBtn("home", "Übersicht", () => { Sfx.click(); showHome(); });
    headerEls.chip = h("div", { class: "unitchip" });
    headerEls.title = h("h1");
    headerEls.replay = iconBtn("replay", "Folie neu starten", () => { Sfx.click(); go(cur.u, cur.s, 0, "none"); });
    headerEls.voice = iconBtn("voice", "Vorlesen an/aus", toggleVoice);
    headerEls.sound = iconBtn("sound", "Ton an/aus", toggleSound);
    append(hdr, [headerEls.home, headerEls.chip, headerEls.title, headerEls.replay, headerEls.voice, headerEls.sound]);
    slideHost = h("div", { class: "slide" });
    contentEl = h("div", { class: "content" });
    slideHost.appendChild(contentEl);
    const ftr = h("div", { class: "ftr" });
    footerEls.back = h("button", { class: "navbtn back", onclick: () => back() });
    footerEls.back.innerHTML = ICON.left + "<span>Zurück</span>";
    footerEls.dots = h("div", { class: "dots" });
    footerEls.step = h("div", { class: "stepinfo" });
    footerEls.next = h("button", { class: "navbtn next", onclick: () => next() });
    append(ftr, [footerEls.back, footerEls.dots, footerEls.step, footerEls.next]);
    confettiCanvas = h("canvas", { id: "confetti", width: W, height: H });
    append(stage, [slideHost, hdr, ftr, confettiCanvas]);
    refreshToggles();
  }
  function refreshToggles() {
    if (!headerEls.sound) return;
    headerEls.sound.innerHTML = Sfx.on ? ICON.sound : ICON.mute;
    headerEls.sound.classList.toggle("on", Sfx.on);
    headerEls.voice.classList.toggle("on", Voice.on);
  }
  function toggleSound() { Sfx.on = !Sfx.on; store.set("sound", Sfx.on); refreshToggles(); Sfx.click(); }
  function toggleVoice() {
    Voice.on = !Voice.on; store.set("voice", Voice.on); refreshToggles(); Sfx.click();
    if (Voice.on && cur && cur.ctx) Voice.say(cur.ctx.slide.say || cur.ctx.slide.title); else Voice.stop();
  }

  function go(ui, si, dir = 1, anim = "next") {
    const unit = Deck.units[ui]; if (!unit) return showHome();
    const slides = slidesOf(unit);
    si = Math.max(0, Math.min(si, slides.length - 1));
    if (!contentEl || !contentEl.isConnected) buildChrome();
    if (cur && cur.ctx) cur.ctx._kill();
    Voice.stop();
    stage.style.setProperty("--unit", unit.color || "#1d5bd0");
    stage.style.setProperty("--unit-soft", unit.soft || "#e4ecfb");
    const def = slides[si];
    headerEls.chip.textContent = `Kapitel ${unit.num}`;
    headerEls.title.textContent = def.title || unit.title;
    const fresh = h("div", { class: "content" });
    contentEl.replaceWith(fresh); contentEl = fresh;
    slideHost.className = "slide" + (anim === "none" || Deck.fast ? "" : dir >= 0 ? " enter-next" : " enter-prev");
    const ctx = makeCtx(unit, def, contentEl);
    cur = { u: ui, s: si, ctx };
    try { def.build(ctx); } catch (err) { console.error("slide build failed", unit.id, si, err); contentEl.appendChild(h("p", { class: "t red" }, "Fehler auf dieser Folie: " + err.message)); }
    Voice.say(def.say || "");
    updateFooter();
    preloadSlide(def); setTimeout(() => preloadSlide(slides[si + 1]), 400);
    const seen = store.get("seen", {}); seen[unit.id] = Math.max(seen[unit.id] || 0, si + 1); store.set("seen", seen);
    try { history.replaceState(null, "", `#${unit.id}-${si}`); } catch (e) {}
  }
  function updateFooter() {
    const unit = Deck.units[cur.u], slides = slidesOf(unit), ctx = cur.ctx;
    footerEls.dots.innerHTML = "";
    slides.forEach((_, i) => footerEls.dots.appendChild(h("span", { class: "dot" + (i < cur.s ? " done" : i === cur.s ? " cur" : "") })));
    const left = ctx.steps.length - ctx.stepIndex;
    footerEls.step.textContent = ctx.steps.length ? `Schritt ${ctx.stepIndex + 1}/${ctx.steps.length + 1}` : "";
    const last = cur.s === slides.length - 1 && cur.u === Deck.units.length - 1;
    const label = left > 0 ? "Weiter" : cur.s === slides.length - 1 ? (last ? "Fertig" : "Nächstes Kapitel") : "Nächste Folie";
    footerEls.next.innerHTML = `<span>${label}</span>` + ICON.right;
    footerEls.next.classList.toggle("pulse", left > 0);
  }
  function next() {
    Sfx.unlock();
    if (!cur) return;
    const ctx = cur.ctx;
    if (ctx.stepIndex < ctx.steps.length) { Sfx.click(); ctx._next(); updateFooter(); return; }
    const slides = slidesOf(Deck.units[cur.u]);
    pageTurn();
    if (cur.s < slides.length - 1) go(cur.u, cur.s + 1, 1);
    else if (cur.u < Deck.units.length - 1) go(cur.u + 1, 0, 1);
    else { Sfx.fanfare(); confetti(W / 2, H / 2, 160); showHome(); }
  }
  function back() {
    Sfx.unlock(); if (!cur) return;
    pageTurn();
    if (cur.s > 0) go(cur.u, cur.s - 1, -1);
    else if (cur.u > 0) go(cur.u - 1, slidesOf(Deck.units[cur.u - 1]).length - 1, -1);
    else showHome();
  }

  function showHome() {
    if (cur && cur.ctx) cur.ctx._kill();
    cur = null; Voice.stop();
    stage.innerHTML = ""; contentEl = null;
    stage.style.setProperty("--unit", "#1d5bd0"); stage.style.setProperty("--unit-soft", "#e4ecfb");
    const seen = store.get("seen", {});
    const home = h("div", { class: "home" });
    const tools = h("div", { class: "tools" });
    headerEls = {};
    headerEls.voice = iconBtn("voice", "Vorlesen an/aus", toggleVoice);
    headerEls.sound = iconBtn("sound", "Ton an/aus", toggleSound);
    const fs = iconBtn("full", "Vollbild", () => { const d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || (() => {})).call(d)?.catch?.(() => {}); });
    if (Deck.meta.hub) {
      const hub = h("a", { class: "iconbtn", href: Deck.meta.hub, "aria-label": "Alle Fächer", title: "Alle Fächer", style: { width: "auto", padding: "0 14px", gap: "8px", display: "flex", textDecoration: "none", font: "700 17px/1 var(--f-display)" } });
      hub.innerHTML = ICON.left + "<span>Alle Fächer</span>";
      tools.appendChild(hub);
    }
    const cr = iconBtn("info", "Bild- und Tonquellen", () => { Sfx.click(); showCredits(); });
    append(tools, Media.all().length ? [cr, headerEls.voice, headerEls.sound, fs] : [headerEls.voice, headerEls.sound, fs]);
    home.appendChild(h("div", { class: "top" },
      h("div", null, h("h1", { class: "title a-left" }, (Deck.meta.subject || "Mathe") + " ", h("em", null, "Klasse 5")), h("p", { class: "sub a-left", style: { "--d": "120ms" } }, Deck.meta.sub || "")),
      tools));
    const grid = h("div", { class: Deck.units.length > 8 ? "units many" : "units" });
    Deck.units.forEach((u, i) => {
      const total = slidesOf(u).length, done = Math.min(seen[u.id] || 0, total);
      const card = h("button", { class: "ucard a-up", style: { "--uc": u.color, "--d": 80 * i + "ms" }, onclick: () => { Sfx.unlock(); Sfx.whoosh(); go(i, 0, 1); } },
        h("span", { class: "num" }, String(u.num)),
        h("span", { class: "ut" }, u.title),
        h("span", { class: "ud" }, u.blurb || ""),
        h("span", { class: "bar" }, h("i", { style: { width: Math.round((done / total) * 100) + "%" } })));
      if (u.icon) { const ic = svgEl("svg", { class: "ico", viewBox: "0 0 70 70" }); try { u.icon(ic, svgEl); } catch (e) {} card.appendChild(ic); }
      grid.appendChild(card);
    });
    home.appendChild(grid);
    home.appendChild(h("p", { class: "hint" }, "Tippe auf ein Kapitel. „Weiter“ zeigt den nächsten Schritt. Wischen geht auch. Knopf mit dem sprechenden Kopf = Vorlesen."));
    stage.appendChild(home);
    confettiCanvas = h("canvas", { id: "confetti", width: W, height: H });
    stage.appendChild(confettiCanvas);
    refreshToggles();
    try { history.replaceState(null, "", "#start"); } catch (e) {}
  }

  /* ---------- input: keys + swipe ---------- */
  function wireInput() {
    window.addEventListener("keydown", e => {
      if (!cur) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); back(); }
      else if (e.key === "Escape") showHome();
    });
    let sx = null, sy = null, st = 0, onDrag = false;
    stage.addEventListener("pointerdown", e => { onDrag = !!e.target.closest(".draggable, input, canvas, .nosw"); sx = e.clientX; sy = e.clientY; st = Date.now(); }, true);
    stage.addEventListener("pointerup", e => {
      if (sx == null || !cur || onDrag) return (sx = null);
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Date.now() - st < 600 && Math.abs(dx) > 90 * scale && Math.abs(dx) > Math.abs(dy) * 2) dx < 0 ? next() : back();
    }, true);
  }

  /* ---------- debug/check API (used by the jev DOM checks) ---------- */
  window.__deck = {
    setFast(v) { Deck.fast = !!v; document.documentElement.classList.toggle("fast", Deck.fast); },
    list() { return Deck.units.map(u => ({ id: u.id, num: u.num, title: u.title, slides: slidesOf(u).map(s => s.title || "") })); },
    async open(ui, si, allSteps = true) {
      go(ui, si, 0, "none");
      if (allSteps) { while (cur.ctx.stepIndex < cur.ctx.steps.length) { cur.ctx._next(); } await cur.ctx._chain(); updateFooter(); }
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { steps: cur.ctx.steps.length };
    },
    async step(ui, si, n) { go(ui, si, 0, "none"); for (let i = 0; i < n && cur.ctx.stepIndex < cur.ctx.steps.length; i++) cur.ctx._next(); await cur.ctx._chain(); updateFooter(); },
    home: () => showHome(),
    media: () => Media.all().map(m => ({ id: m.id, kind: m.kind, src: m.src })),
  };

  /* ---------- boot ---------- */
  function rotateHint() {
    let el = document.getElementById("rotate"), dismissed = false;
    if (!el) { el = h("div", { id: "rotate", role: "button" }, h("div", null, "Bitte das iPad quer halten ↻", h("br"), h("small", { style: { fontWeight: 400, fontSize: "18px" } }, "(Tippen zum Ausblenden)"))); document.body.appendChild(el); }
    el.addEventListener("click", () => { dismissed = true; el.style.display = "none"; });
    const upd = () => { el.style.display = !dismissed && window.innerHeight > window.innerWidth * 1.15 ? "grid" : "none"; };
    window.addEventListener("resize", upd); upd();
  }
  function boot() {
    stage = document.getElementById("stage");
    rotateHint();
    Sfx.on = store.get("sound", true);
    Voice.on = store.get("voice", false);
    fit(); window.addEventListener("resize", fit);
    wireInput();
    const m = /^#(u\d+)-(\d+)$/.exec(location.hash || "");
    const ui = m ? Deck.units.findIndex(u => u.id === m[1]) : -1;
    if (/fast/.test(location.hash)) window.__deck.setFast(true);
    if (ui >= 0) go(ui, Number(m[2]), 0, "none"); else showHome();
  }
  Deck.boot = boot;
})();
