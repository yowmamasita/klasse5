"""Visual + DOM-measurement check of the deck with jev (deterministic helpers only, no model calls).

For every slide and every build step (fast mode = animations jump to their end state) it measures:
  - text-on-text and text-on-control overlaps (text-node ranges, SVG <text> boxes)
  - anything sticking out of the 1100x636 content area or the stage
  - clipped text (overflow hidden/auto with content larger than the box), truncated slide titles
  - JS errors (console.error / window.onerror / failed slide builds)
and saves a screenshot of each slide's final state to tools/shots/.

Run (needs headless Chrome on CDP 9333 and tools/serve.py on 8765, see units/README.md):
  cd ~/claude/juju/mathe-klasse5
  CDP_URL=http://127.0.0.1:9333 JEV_VIEWPORT=1180x820 \
    uv run --project ~/projects/jev-ultrafast python tools/check.py u3 [u4 ...] [--no-shots] [--final-only]
"""
import json
import os
import sys

from jev_ultrafast.browser import Browser

HERE = os.path.dirname(os.path.abspath(__file__))
URL = os.environ.get("DECK_URL") or "http://127.0.0.1:8790/" + os.environ.get("DECK_SUBJECT", "mathe") + "/"

MEASURE = r"""
async () => {
  const issues = [];
  const stage = document.getElementById('stage');
  const S = stage.getBoundingClientRect().width / 1180;
  const toS = r => ({ x: r.left / S, y: r.top / S, w: r.width / S, h: r.height / S, r: r.right / S, b: r.bottom / S });
  const sr = toS(stage.getBoundingClientRect());
  const rel = r => ({ x: r.x - sr.x, y: r.y - sr.y, w: r.w, h: r.h, r: r.r - sr.x, b: r.b - sr.y });
  const visible = el => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    }
    return true;
  };
  const name = el => {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : ''} "${t}"`;
  };
  const content = document.querySelector('.content');
  if (!content) return { issues: ['no .content'] };
  // real photos: wait until decoded, then flag broken ones
  const imgs = [...content.querySelectorAll('img')];
  await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 4000); })));
  for (const i of imgs) if (!i.naturalWidth) issues.push(`BROKEN IMAGE: ${i.getAttribute('src')}`);
  const cr = rel(toS(content.getBoundingClientRect()));
  // text boxes
  const boxes = [];
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const owner = n.parentElement;
    if (!owner || !visible(owner)) continue;
    if (owner.closest('[data-overlap-ok]')) continue;
    if (owner instanceof SVGElement) {
      const te = owner.closest('text') || owner;
      if (boxes.some(b => b.owner === te)) continue;
      const r = rel(toS(te.getBoundingClientRect()));
      if (r.w > 0 && r.h > 0) boxes.push({ owner: te, r, svg: true });
      continue;
    }
    const range = document.createRange(); range.selectNodeContents(n);
    for (const rr of range.getClientRects()) {
      const r = rel(toS(rr));
      if (r.w > 0.5 && r.h > 0.5) boxes.push({ owner, r });
    }
  }
  const controls = [...content.querySelectorAll('button, input, select')].filter(visible)
    .filter(el => !el.closest('[data-overlap-ok]')).map(el => ({ owner: el, r: rel(toS(el.getBoundingClientRect())) }));
  const inter = (a, b) => {
    const ix = Math.min(a.r, b.r) - Math.max(a.x, b.x), iy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
    return ix > 3 && iy > 3 ? { ix, iy, area: ix * iy } : null;
  };
  const related = (a, b) => a === b || a.contains(b) || b.contains(a);
  const seen = new Set();
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const A = boxes[i], B = boxes[j];
    if (related(A.owner, B.owner)) continue;
    const x = inter(A.r, B.r); if (!x) continue;
    const minA = Math.min(A.r.w * A.r.h, B.r.w * B.r.h);
    if (x.area < 0.12 * minA) continue;
    const key = name(A.owner) + '|' + name(B.owner); if (seen.has(key)) continue; seen.add(key);
    issues.push(`OVERLAP text/text: ${name(A.owner)} @${Math.round(A.r.x)},${Math.round(A.r.y)} <> ${name(B.owner)} @${Math.round(B.r.x)},${Math.round(B.r.y)}`);
  }
  for (const T of boxes) for (const C of controls) {
    if (related(T.owner, C.owner) || C.owner.contains(T.owner)) continue;
    const x = inter(T.r, C.r); if (!x) continue;
    if (x.area < 0.12 * T.r.w * T.r.h) continue;
    const key = name(T.owner) + '|c|' + name(C.owner); if (seen.has(key)) continue; seen.add(key);
    issues.push(`OVERLAP text/control: ${name(T.owner)} <> ${name(C.owner)}`);
  }
  for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
    const A = controls[i], B = controls[j];
    if (related(A.owner, B.owner)) continue;
    if (inter(A.r, B.r)) issues.push(`OVERLAP control/control: ${name(A.owner)} <> ${name(B.owner)}`);
  }
  // bounds: every visible element (SVG children excluded, the svg itself counts) must stay inside content
  for (const el of content.querySelectorAll('*')) {
    if (el instanceof SVGElement && el.tagName.toLowerCase() !== 'svg') continue;
    if (el.closest('[data-bleed-ok]')) continue;
    if (!visible(el)) continue;
    const r = rel(toS(el.getBoundingClientRect()));
    if (r.w === 0 && r.h === 0) continue;
    const out = Math.max(cr.x - r.x, r.r - cr.r, cr.y - r.y, r.b - cr.b);
    if (out > 2) { issues.push(`OUT OF CONTENT by ${Math.round(out)}px: ${name(el)} box ${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.w)}x${Math.round(r.h)}`); }
  }
  // text outside the svg viewport (would be clipped)
  for (const B of boxes.filter(b => b.svg)) {
    const svg = B.owner.ownerSVGElement; if (!svg) continue;
    const s = rel(toS(svg.getBoundingClientRect()));
    if (B.r.x < s.x - 2 || B.r.r > s.r + 2 || B.r.y < s.y - 2 || B.r.b > s.b + 2) issues.push(`SVG TEXT CLIPPED: ${name(B.owner)}`);
  }
  // clipped content
  for (const el of [content, ...content.querySelectorAll('*')]) {
    if (el instanceof SVGElement || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const clipX = cs.overflowX !== 'visible', clipY = cs.overflowY !== 'visible';
    if ((clipX && el.scrollWidth > el.clientWidth + 2) || (clipY && el.scrollHeight > el.clientHeight + 2))
      issues.push(`CLIPPED: ${name(el)} scroll ${el.scrollWidth}x${el.scrollHeight} > box ${el.clientWidth}x${el.clientHeight}`);
  }
  const h1 = document.querySelector('.hdr h1');
  if (h1 && h1.scrollWidth > h1.clientWidth + 1) issues.push(`TITLE TRUNCATED: "${h1.textContent}"`);
  if (content.textContent.includes('Fehler auf dieser Folie')) issues.push('BUILD ERROR shown on slide');
  for (const e of (window.__errs || [])) issues.push('JS ERROR: ' + e);
  window.__errs = [];
  return { issues };
}
"""

HOOK = r"""() => {
  if (window.__hooked) return; window.__hooked = true; window.__errs = [];
  const ce = console.error.bind(console);
  console.error = (...a) => { window.__errs.push(a.map(x => (x && x.stack) || String(x)).join(' ').slice(0, 300)); ce(...a); };
  window.addEventListener('error', e => window.__errs.push(String(e.message)));
  window.addEventListener('unhandledrejection', e => window.__errs.push('unhandled: ' + String(e.reason && e.reason.stack || e.reason).slice(0, 300)));
}"""


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    shots = "--no-shots" not in sys.argv
    final_only = "--final-only" in sys.argv
    import time as _t
    page = Browser(URL.rstrip('/') + '/?v=' + str(int(_t.time()*1000)))
    try:
        page.run(HOOK)
        page.run("() => __deck.setFast(true)")
        units = page.run("() => __deck.list()")
        import re as _re, os as _os
        want_n = len(_re.findall(r'src="units/u\d+\.js"', open(_os.path.join(_os.path.dirname(HERE), _os.environ.get("DECK_SUBJECT", ""), "index.html")).read()))
        if len(units) != want_n:
            print(f"EXPECTED UNITS: {want_n}, LOADED: {len(units)} ({[u['id'] for u in units]}) - a unit file failed to load or is missing")
        want = set(args) if args else {u["id"] for u in units}
        os.makedirs(os.path.join(HERE, "shots", os.environ.get("DECK_SUBJECT", "deck")), exist_ok=True)
        total = 0
        if not args:
            page.run("() => __deck.home()")
            res = page.run(MEASURE.replace("const content = document.querySelector('.content');", "const content = document.querySelector('.home');"))
            for i in res["issues"]:
                print(f"home: {i}"); total += 1
            if shots:
                page.screenshot(os.path.join(HERE, "shots", os.environ.get("DECK_SUBJECT", "deck"), "home.png"))
        for ui, u in enumerate(units):
            if u["id"] not in want:
                continue
            for si, title in enumerate(u["slides"]):
                info = page.run(f"() => __deck.open({ui}, {si}, false)")
                nsteps = info["steps"]
                states = [nsteps] if final_only else range(nsteps + 1)
                for k in states:
                    page.run(f"() => __deck.step({ui}, {si}, {k})")
                    page.run("() => new Promise(r => setTimeout(r, 60))")
                    res = page.run(MEASURE)
                    for issue in res["issues"]:
                        print(f"{u['id']} slide {si} ({title}) step {k}/{nsteps}: {issue}")
                        total += 1
                if shots:
                    page.screenshot(os.path.join(HERE, "shots", os.environ.get("DECK_SUBJECT", "deck"), f"{u['id']}-{si:02d}.png"))
        print(json.dumps({"issues": total}))
    finally:
        page.close()


if __name__ == "__main__":
    main()
