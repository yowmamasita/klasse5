# Media pass brief (photos + real sounds) – for the agent working on <SUBJECT> units <UNITS>

App: `~/claude/juju/klasse5-app` – interactive iPad slide decks for a pupil (10, Klasse 5, Gymnasium Berlin,
visual learner, learns through real-life examples). Read `docs/AUTHORING.md` first (rules + slide API, incl. the
new "Real photos and sounds" section), then `shared/engine.js` around `photo(`, `sound(`, `soundBtn(`.

## Your job
Go through **every slide** of your units (each file `<subject>/units/uN.js`) and make the deck more real:
1. **Real photos** wherever a photo explains better, illustrates, or gives real-life context: the real place,
   object, animal, plant, instrument, artwork, building, tool, phenomenon, historical artefact … that the slide
   talks about or uses as an example ("Im Alltag", "Beispiel"). Where a slide shows a hand-drawn stand-in for a
   real thing (an emoji, a crude SVG of a real object/artwork/place), a photo usually serves better – replace it or
   put the photo next to it. Keep SVG/canvas diagrams that *are* the explanation (number lines, angles, particle
   models, notation …) – don't swap a good diagram for a photo; add a photo beside it if the real-world anchor helps.
   You may add a new slide (≈1–2 per unit, e.g. "So sieht das in echt aus" / a small photo gallery with captions)
   where real photos teach something the existing slides can't. Photos should be large enough to see (typically
   ≥ 260 px on the short side), never stamp-sized decoration.
2. **More varied, more real sounds.** Today almost everything uses a handful of synthesized blips
   (`s.sfx.pop/ding/whoosh/success…`). Use recorded sounds where the slide's content makes a real sound (animals,
   instruments, places, machines, weather, actions like writing/cutting/pouring/kicking…) – both as reveal effects
   (`s.sound(id)` in a step) and as tap-to-hear buttons (`s.soundBtn(id, label)`) when listening is the point.
   Also vary the generic effects: use the shared library (page turns are already automatic on slide change) and
   the synthesized ones more deliberately – not the same pop/ding on every reveal. Don't make it noisy: one
   meaningful sound per reveal, ambience ≤ 10 s and quiet (`vol: .4–.6`), no sound on every tiny tick.
3. Be **exhaustive**: every slide gets considered; most content slides should end up with a photo and/or a real
   sound where one genuinely fits. A slide that is purely abstract may stay as it is – that's a decision, not an
   omission; list it in your report.

## Rules (in addition to AUTHORING.md)
- Media only via `tools/media` into **your subject folder** (`tools/media img-add <subject> …`). Do not add to
  `shared` and do not edit `shared/*`, `tools/*`, `index.html` or other subjects' files. Another agent works on the
  other half of the same subject at the same time: only edit **your** unit files; media ids are first-come (the
  tool refuses duplicates – reuse an existing id if it fits: `tools/media list <subject>`).
- Accuracy: the photo must really show what the caption/slide claims (check Commons title + description; Read the
  contact sheet). New facts in captions must be verified (web search) – list them with sources in the report.
  Correct German, flawless spelling; keep captions short.
- Kunst/Deutsch/GeWi/Musik: public-domain artworks, illustrations, manuscripts, historical recordings are great
  (Commons hosts only free/PD material). No modern copyrighted works (no book covers, comics, film stills).
- No private people as the main subject of a photo (public figures, historical portraits, crowds are fine).
- Layout rules still apply in every step state: 1100 × 636 content box, no overlap/clipping (text placed *on* the
  photo via `caption` is fine). Keep existing interactivity working.

## Check (mandatory, per unit)
Dev server is running at http://127.0.0.1:8790/. Start your **own** headless Chrome on port <PORT>:
```bash
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin:$HOME/.local/share/mise/installs/uv/0.10.12/uv-aarch64-apple-darwin:$PATH
cd ~/claude/juju/klasse5-app
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=<PORT> \
  --user-data-dir=/private/tmp/claude-501/k5chrome-<PORT> --hide-scrollbars about:blank >/dev/null 2>&1 &
node --check <subject>/units/uN.js && tools/media lint <subject>
DECK_SUBJECT=<subject> CDP_URL=http://127.0.0.1:<PORT> JEV_VIEWPORT=1180x820 \
  uv run -q --project ~/projects/jev-ultrafast python tools/check.py uN      # must print {"issues": 0}
```
(If port 8790 doesn't answer, start `python3 serve.py 8790 127.0.0.1 &` from the app folder.)
Then **Read the screenshot** `tools/shots/<subject>/uN-NN.png` of every slide you changed: photo crop sensible
(use `pos` to keep the subject in frame), nothing covering text, balanced layout, photo clearly visible.
Kill your Chrome at the end (`pkill -f k5chrome-<PORT>`).

## Report (final message, concise)
Per unit: slides changed (title → photo ids / sound ids), new slides, slides deliberately left without media
and why, facts added + source URLs, and the final check.py + lint result. No need to paste code.
