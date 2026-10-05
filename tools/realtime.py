"""Step through every slide at real speed (animations, sounds, loops running) and report JS errors.

Optional args: unit ids (u3 u10 …) to limit the run; default = every unit of DECK_SUBJECT."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from check import HOOK, URL
from jev_ultrafast.browser import Browser
import time as _t
page = Browser(URL.rstrip('/') + '/?v=' + str(int(_t.time()*1000)))
page.run(HOOK)
units = page.run("() => __deck.list()")
bad = 0
only = [a for a in sys.argv[1:] if not a.startswith("-")]
for ui, u in enumerate(units):
    if only and u["id"] not in only:
        continue
    for si in range(len(u["slides"])):
        page.run(f"""async () => {{
          __deck.setFast(false);
          document.querySelector('.content') || __deck.open({ui},{si},false);
          await __deck.step({ui},{si},0);
        }}""")
        page.run("""async () => {
          const W = ms => new Promise(r => setTimeout(r, ms));
          await W(700);
          for (let i = 0; i < 12; i++) { const b = document.querySelector('.navbtn.next.pulse'); if (!b) break; b.click(); await W(900); }
          document.querySelectorAll('.content button').forEach(b => { try { b.click(); } catch (e) {} });
          await W(800);
        }""", timeout=60)
        errs = page.run("() => { const e = window.__errs || []; window.__errs = []; return e; }")
        for e in errs:
            print(f"{u['id']} slide {si}: {e}"); bad += 1
print({"runtime_errors": bad})
page.close()
