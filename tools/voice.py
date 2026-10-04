"""Read-aloud clips: collect every text a deck speaks, then record it with Gemini TTS.

  collect <subject>   open every slide/step in headless Chrome (like check.py), log every say/speak text,
                      also click each button on the slide; plus string literals from s.say/s.speak/say: in the
                      unit sources. Writes <subject>/voice/texts.json.
  gen <subject>       record every text in texts.json that has no clip yet -> <subject>/voice/<key>.mp3,
                      then rewrite <subject>/voice/index.js. Needs GEMINI_API_KEY in the environment.
  status [subject]    how many texts / clips per subject.

collect needs the dev server (:8790) and a headless Chrome on CDP_URL (see README "Checks"), run via
  uv run -q --project ~/projects/jev-ultrafast python tools/voice.py collect mathe
gen only needs python3 + ffmpeg:
  GEMINI_API_KEY=... python3 tools/voice.py gen mathe [--model gemini-2.5-flash-preview-tts] [--voice Leda] [--limit N]

The clip key must match Voice.key() in shared/engine.js (cyrb53 over "<lang2>|<text>"); collect asks the page
for the keys, so the two can't drift apart.
"""
import base64
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
SUBJECTS = ["mathe", "deutsch", "englisch", "nawi", "gewi", "musik", "kunst"]
DEFAULT_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
STYLE = {
    "de": "Lies den folgenden Text freundlich, warm und deutlich vor, in ruhigem Tempo, für ein zehnjähriges Kind:",
    "en": "Read the following text aloud in a friendly, clear British English voice, at a calm pace, for a ten-year-old learner:",
}


def vdir(subject):
    return os.path.join(APP, subject, "voice")


# ---------------------------------------------------------------- collect
STATIC = re.compile(
    r"""(?:s\.say|s\.speak|\bsay)\s*(?:\(|:)\s*(["'])((?:\\.|(?!\1).)*?)\1(\s*,\s*\{[^}]*?lang:\s*["']([A-Za-z-]+)["'])?""")


def js_unquote(q, s):
    if q == '"':
        try:
            return json.loads('"' + s + '"')
        except Exception:
            return None
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n")


def static_texts(subject):
    out = []
    udir = os.path.join(APP, subject, "units")
    for f in sorted(os.listdir(udir)):
        if not f.endswith(".js"):
            continue
        src = open(os.path.join(udir, f), encoding="utf-8").read()
        for m in STATIC.finditer(src):
            t = js_unquote(m.group(1), m.group(2))
            if t and t.strip():
                out.append([m.group(4) or "de-DE", t])
    return out


def collect(subject):
    sys.path.insert(0, HERE)
    os.environ.setdefault("DECK_SUBJECT", subject)
    from check import HOOK  # noqa
    from jev_ultrafast.browser import Browser
    page = Browser(f"http://127.0.0.1:8790/{subject}/?v={int(time.time() * 1000)}")
    try:
        page.run(HOOK)
        page.run("() => { __deck.setFast(true); Deck.voiceLog = []; }")
        units = page.run("() => __deck.list()")
        for ui, u in enumerate(units):
            for si in range(len(u["slides"])):
                page.run(f"() => __deck.open({ui}, {si}, true)", timeout=60)
                page.run("""async () => {
                  for (const b of [...document.querySelectorAll('.content button')]) { try { b.click(); } catch (e) {} }
                  await new Promise(r => setTimeout(r, 120));
                }""", timeout=60)
            print(f"  {u['id']}: {len(u['slides'])} slides", file=sys.stderr)
        log = page.run("() => Deck.voiceLog")
        texts = log + static_texts(subject)
        uniq = {}
        for lang, text in texts:
            text = text.strip()
            if not text or not re.search(r"[A-Za-zÄÖÜäöüß0-9]", text):
                continue
            key = page.run(f"() => Deck.voiceKey({json.dumps(text)}, {json.dumps(lang)})")
            if key not in uniq:
                spoken = page.run(f"() => Deck.voiceSpoken({json.dumps(text)}, {json.dumps(lang)})")
                uniq[key] = {"lang": lang, "text": text, "spoken": spoken}
    finally:
        page.close()
    os.makedirs(vdir(subject), exist_ok=True)
    with open(os.path.join(vdir(subject), "texts.json"), "w", encoding="utf-8") as fh:
        json.dump(uniq, fh, ensure_ascii=False, indent=1, sort_keys=True)
    chars = sum(len(v["spoken"]) for v in uniq.values())
    print(json.dumps({"subject": subject, "texts": len(uniq), "chars": chars}))


# ---------------------------------------------------------------- gen
def tts(text, lang, model, voice, key):
    style = STYLE["en" if lang.lower().startswith("en") else "de"]
    body = {
        "contents": [{"parts": [{"text": f"{style}\n\n{text}"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.load(r)
            part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
            return base64.b64decode(part["data"]), part.get("mimeType", "")
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 503) and attempt < 5:
                time.sleep(min(60, 5 * 2 ** attempt))
                continue
            raise RuntimeError(f"HTTP {e.code}: {msg}")
        except (KeyError, IndexError):
            if attempt < 5:
                time.sleep(3)
                continue
            raise RuntimeError("no audio in response: " + json.dumps(d)[:300])


def to_mp3(pcm, mime, out):
    rate = int((re.search(r"rate=(\d+)", mime) or [0, "24000"])[1])
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", "-",
                    "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse",
                    "-c:a", "libmp3lame", "-b:a", "40k", out], input=pcm, check=True)


def write_index(subject):
    d = vdir(subject)
    texts = json.load(open(os.path.join(d, "texts.json"), encoding="utf-8")) if os.path.exists(os.path.join(d, "texts.json")) else {}
    have = {f[:-4] for f in os.listdir(d) if f.endswith(".mp3")}
    m = {k: k + ".mp3" for k in sorted(have) if k in texts}
    with open(os.path.join(d, "index.js"), "w", encoding="utf-8") as fh:
        fh.write("/* generated by tools/voice.py – read-aloud clips (Gemini TTS) */\n")
        fh.write("Deck.voiceClips(\"voice/\", " + json.dumps(m, separators=(",", ":")) + ");\n")
    return len(m), len(texts)


def gen(subject, model, voice, limit, workers):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY not set")
    d = vdir(subject)
    texts = json.load(open(os.path.join(d, "texts.json"), encoding="utf-8"))
    todo = [(k, v) for k, v in texts.items() if not os.path.exists(os.path.join(d, k + ".mp3"))]
    if limit:
        todo = todo[:limit]
    print(f"{subject}: {len(todo)} clips to record", file=sys.stderr)
    fails = 0

    def one(item):
        k, v = item
        pcm, mime = tts(v["spoken"], v["lang"], model, voice, key)
        to_mp3(pcm, mime, os.path.join(d, k + ".mp3"))
        return k

    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(one, it): it for it in todo}
        for i, f in enumerate(as_completed(futs), 1):
            try:
                f.result()
            except Exception as e:
                fails += 1
                print(f"  FAIL {futs[f][0]}: {e}", file=sys.stderr)
            if i % 25 == 0:
                print(f"  {i}/{len(todo)}", file=sys.stderr)
                write_index(subject)
    n, total = write_index(subject)
    print(json.dumps({"subject": subject, "clips": n, "texts": total, "failed": fails}))


def status(subjects):
    for s in subjects:
        d = vdir(s)
        t = json.load(open(os.path.join(d, "texts.json"))) if os.path.exists(os.path.join(d, "texts.json")) else {}
        clips = [f for f in os.listdir(d) if f.endswith(".mp3")] if os.path.isdir(d) else []
        size = sum(os.path.getsize(os.path.join(d, f)) for f in clips)
        print(f"{s:9} texts {len(t):5}  clips {len(clips):5}  {size / 1e6:6.1f} MB  chars {sum(len(v['spoken']) for v in t.values())}")


def opt(name, default):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    subs = [a for a in sys.argv[2:] if a in SUBJECTS] or (SUBJECTS if cmd == "status" else [])
    if cmd == "collect":
        for s in subs:
            collect(s)
    elif cmd == "gen":
        for s in subs:
            gen(s, opt("--model", DEFAULT_MODEL), opt("--voice", "Leda"), int(opt("--limit", 0)), int(opt("--workers", 4)))
    elif cmd == "status":
        status(subs)
    else:
        sys.exit(__doc__)
