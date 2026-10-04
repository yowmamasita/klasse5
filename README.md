# Klasse 5

Interactive, animated slide decks covering a whole Berlin Gymnasium Klasse 5 year
(Rahmenlehrplan Berlin-Brandenburg), built for an iPad in landscape:
**Mathe, Deutsch, Englisch, NaWi, GeWi, Musik, Kunst** — 7 subjects, 64 chapters, about 1,100 slides.

- Plain HTML, CSS, JavaScript, SVG and canvas. No build step, no framework, no dependencies
  (fonts load from Google Fonts). Real photos and recorded sounds are stored in the repo (`*/media/`).
- Every idea is built up step by step ("Weiter"), animated, with real photos, recorded and synthesized
  sound (Web Audio) and optional German/English read-aloud (Web Speech). Several real-life examples per concept.
- Explore, don't test: sliders, dragging, drawing, mixing, playing — no quizzes.
- Progress is remembered per device (localStorage).

## Run

```bash
python3 serve.py          # http://localhost:8790/
python3 serve.py 8790 0.0.0.0
```

`serve.py` adds a no-cache header, a bigger connection queue, and stamps every page's local `.js`/`.css`
URLs with `?v=<git commit>` so a browser never mixes a new page with an old cached engine (restart it after
`git pull`). Other static servers work for development.
On the iPad: open the address in Safari, then *Teilen → Zum Home-Bildschirm* for a full-screen app.

## Deploy (home server)

Runs on `kids` as a user systemd service (`~/.config/systemd/user/klasse5.service`, port 8790):

```bash
ssh ben@kids 'git -C ~/klasse5 pull && systemctl --user restart klasse5'
```

Open `http://192.168.88.242:8790/` on the home Wi-Fi or `http://kids:8790/` on the tailnet.

## Layout

```
index.html              start page (subject picker)
shared/engine.js        slide engine: stage scaling, steps, animation, sound, speech, touch helpers
shared/style.css        shared look (squared exercise-book paper, ink colours)
<subject>/index.html    one deck per subject (mathe, deutsch, englisch, nawi, gewi, musik, kunst)
<subject>/units/uN.js   one chapter per file, registered with Deck.unit({...})
docs/AUTHORING.md       slide API and content rules for writing a chapter
tools/check.py          layout check with jev (DOM overlap / bounds / clipping + screenshots)
tools/realtime.py       steps through every slide at real speed and reports JS errors
tools/media             find + fetch freely licensed photos/sounds, records credits (see docs/AUTHORING.md)
<subject>/media/        photos + sounds of a deck with credits.json / credits.js; shared/media/ for common sounds
```

## Checks

Needs a headless Chrome with remote debugging and [jev-ultrafast](https://github.com/Nimbly-Technologies/jev-ultrafast):

```bash
python3 serve.py 8790 127.0.0.1 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/k5chrome about:blank &
DECK_SUBJECT=mathe CDP_URL=http://127.0.0.1:9333 JEV_VIEWPORT=1180x820 \
  uv run --project ~/projects/jev-ultrafast python tools/check.py      # prints {"issues": 0}
DECK_SUBJECT=mathe CDP_URL=http://127.0.0.1:9333 JEV_VIEWPORT=1180x820 \
  uv run --project ~/projects/jev-ultrafast python tools/realtime.py   # prints {'runtime_errors': 0}
```

## Content notes

Curriculum order follows published Berlin school plans (the school's own plans are not public).
Facts were checked against Wikipedia and official sources; example data such as class surveys,
prices and timetables is invented. Photos and sound recordings come from Wikimedia
Commons and Freesound under free licences (public domain, CC0, CC BY, CC BY-SA); every file's author, licence and
source is listed in its `media/credits.json` and on the "Quellen" (ⓘ) screen of each deck. Artworks shown are
public domain; only public-domain music is quoted.
