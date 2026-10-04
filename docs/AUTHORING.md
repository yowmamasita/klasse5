# Writing a unit (Kapitel) for "Deutsch Klasse 5"

An interactive motion-graphics slide deck (plain HTML/CSS/JS/SVG/canvas, no libraries) covering the whole
Klasse 5 German language and literature (Deutsch) year for **Julian** (10, Albrecht-Dürer-Gymnasium Berlin, Schnelllerner class, is in the
Instrumentalklasse: he picks a string or wind instrument at the end of Klasse 5 and starts lessons in Klasse 6). He is a **visual learner** and learns through **real-life examples**.
It runs on an **iPad** (landscape, touch). Everything on screen is **German** (German school terms).

Files: `engine.js` (engine), `style.css` (classes), `units/uN.js` (one file per unit), `units/example.js`
(**read it first** – the reference unit). Look at `style.css` for the available classes.

## Hard rules
- **No quizzes, tests or "check your answer" widgets.** It is a presentation that *explains*. Interactivity
  = exploring: sliders, dragging, tap-to-reveal, buttons that run an animation, "nochmal" replays.
- **Multiple examples per concept** (at least 3, from different real-life settings), plus **"Im Alltag"**
  slides showing where the maths appears in real life (Berlin, U-Bahn/BVG, football, cooking, shopping with €,
  music/notes, Minecraft-style blocks, pizza, school timetable, sports day, trips, the Fernsehturm 368 m …).
  Use correct real numbers where you cite facts.
- **Animate and sound everything**: each reveal has a motion (`s.show(el,'pop'|'up'|'left'|'draw'|…)`,
  `s.tween`, canvas `s.loop`) **and** a sound (`s.sfx.*`). Build slides up in **steps** (`s.step`), one idea
  per "Weiter" press, like PowerPoint click-builds. Count-ups, drawing lines, moving objects, morphing shapes.
- Each slide has a `say` narration (German, 1–2 short sentences); steps may call `s.say("…")`.
- **Layout must fit the content box: 1100 × 636 px** (`s.root`). Nothing may stick out, nothing may be clipped,
  **no text may overlap other text or buttons**, in *every* step state. Min font size 19 px. Prefer
  flex/grid (`.cols`, `.cols3`, `.stack`, `.row`) over absolute positioning; when you position absolutely,
  compute positions so labels never collide. SVG text must stay inside its viewBox.
  Text deliberately placed *on* a graphic (a label inside a bar, a digit in a box) is fine. Only mark a
  wrapper `data-overlap-ok` if overlapping text is truly intended (rare).
- Touch: use `s.drag`, `s.slider`, buttons (`.btn`, min 56 px tall). No hover-only things. No keyboard input.
- Speak to a 10-year-old: short sentences, concrete, warm ("du"). Correct content, correct German (spelling and grammar must be flawless).
- Self-contained: no external images/fonts/libraries. Draw with SVG/canvas. Emoji are OK sparingly as
  real-world objects (🍕 ⚽ 🚇), never as decoration or bullet markers.
- Clean up is automatic: timers/tweens/loops created through `s.*` stop when the slide is left. Don't use raw
  `setInterval`; if you must use `setTimeout`, guard with `if (!s.alive) return`.

## Unit definition
```js
Deck.unit({
  id: "u3", num: 3, title: "Geraden und Winkel", color: "#…", soft: "#…(very light tint)",
  subtitle: "short hand-written subtitle", blurb: "1 sentence for the home tile (≤ 70 chars)",
  goals: ["3–5 goals in kid language"],      // shown on the auto-generated title slide
  icon(svg, el) { /* draw into a 70×70 viewBox */ },
  slides: [ { title: "…(≤ 34 chars)", say: "…", build(s) { … } }, … ],
});
```
The engine adds the chapter title slide automatically. Aim for **12–16 slides per unit**.

## Slide API (`s` inside `build(s)`)
| | |
|---|---|
| `s.h(tag, attrs, ...children)` | create HTML element. attrs: `class`, `style:{}`, `onclick`, `text`, `html` … |
| `s.svg(w,h)` / `s.el(tag, attrs, ...kids)` | create `<svg>` (viewBox 0 0 w h) / SVG child element |
| `s.add(el, …)` | append to the slide content (1100×636) |
| `s.step(async s => {…})` | register a build step (one per "Weiter" press). Steps run in order. |
| `s.show(el|[els], kind, delayMs)` | reveal an element hidden with class `later` using animation kind: `pop fade up down left right zoom bounce draw` (`draw` = SVG stroke draw-on). Returns a promise. |
| `s.hide(el)` | hide again (`later`) |
| `s.tween({from,to,dur,delay,ease,update})` | promise; `ease`: `linear in out inOut back bounce elastic` |
| `s.wait(ms)` | promise |
| `s.loop((t, dt) => …)` | rAF loop, return `false` to stop |
| `s.canvas(w,h)` → `{canvas, g}` | hi-dpi canvas, `g` = 2D context in CSS px |
| `s.drag(el, {onStart,onMove,onEnd, space})` | touch drag; callbacks get points in `space`'s local coordinates (SVG user units if `space` is an SVG element) |
| `s.slider({label,min,max,step,value,fmt,onInput})` | big touch slider (ticks a sound) |
| `s.sfx.pop() click() tick() whoosh() swoosh() snap() ding() coin() success() error() count(i) note(semitone,dur) drum() boing() zap() fanfare() chord([..]) scribble()` | synthesized sounds |
| `s.say(text)` | speak (only if the viewer turned Vorlesen on) |
| `s.confetti(x,y,n)` | celebration (stage coordinates) |
| `s.fmt(n, decimals)` | German number format (1.000.000 / 3,5) |
| `s.alive`, `s.fast` | slide still shown / check-mode (animations are instant) |

Everything visible at the end of the last step must be fully laid out (the checker runs all steps instantly).
Elements that appear in later steps start with class `later` (keeps their space, so layout doesn't jump).

## Visual language
Squared exercise-book paper. Ink colours via CSS vars: `--blue` (fountain pen), `--red` (correction),
`--yellow` (highlighter), `--green`, `--violet`, `--orange`, `--pencil`, `--ink`; `--unit` = unit colour.
Boxes: `.merk` (yellow "Merke!" rule box), `.ex` + `<span class="exlabel">Beispiel 1</span>`,
`.life` + `exlabel` "Im Alltag" (green), `.card`, `.chip`, `.hl` (highlighter), `.hand` (handwriting).
Text: `.huge` 76px, `.big` 40px, `.h2` 30px, `.t` 24px, `.small` 19px. Tables: `table.tafel`.

## Check your work (mandatory) – jev DOM measurement + screenshots
Servers are already running (dev server :8766, headless Chrome CDP :9334). From the project folder:
```bash
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.local/share/mise/installs/uv/0.10.12/uv-aarch64-apple-darwin:$PATH
cd ~/claude/juju/deutsch-klasse5
DECK_URL=http://127.0.0.1:8766/ CDP_URL=http://127.0.0.1:9334 JEV_VIEWPORT=1180x820 uv run --project ~/projects/jev-ultrafast python tools/check.py u3
```
It opens every slide in every step state and reports overlaps / out-of-bounds / clipping / JS errors, then
writes `tools/shots/u3-NN.png` (final state of each slide). Iterate until it prints `{"issues": 0}`, **and
look at every screenshot** (Read the PNG) for what the measurement can't see: text on top of drawings,
unbalanced empty space, tiny drawings, things that look wrong. Also `node -e` syntax-check your file.
If the dev server or Chrome is down, restart them (`python3 tools/serve.py 8766` from the project folder; Chrome:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9334 --user-data-dir=<scratch> --hide-scrollbars about:blank`).

## Extra rules for this deck
- **Facts must be verified.** Every real-world fact, number, date, author, quote or scientific value you put
  on a slide must be checked with a web search (WebSearch/WebFetch). List each fact + source URL in your
  final report. If you can't verify something, leave it out.
- **Copyright:** only quote texts that are in the public domain (Grimm, Goethe, Schiller, Fontane, Äsop,
  Lessing, Hoffmann von Fallersleben, Busch, Ringelnatz …, i.e. authors dead > 70 years). For modern books
  (Kästner, Steinhöfel …) mention title/author and describe, but write your own example sentences.
- Engine notes: `s.show()` reveal animations now end at the element's own opacity/transform, and SVG elements
  scale around their own centre. `.exlabel` works in any box (`.ex`, `.life`, `.card`).
- The engine uses German speech synthesis for `say`; write `say` texts so they sound natural read aloud.
- **New:** `s.speak(text, {lang, rate})` speaks immediately (for tap-to-hear buttons), ignoring the Vorlesen
  toggle; `lang` e.g. "de-DE" or "en-GB". `s.say` only speaks when Vorlesen is on.
