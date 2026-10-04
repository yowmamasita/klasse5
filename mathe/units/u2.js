/* Kapitel 2 – Körper und Figuren (Berliner Rahmenlehrplan, Niveau C–D) */
(() => {
  "use strict";
  const U = "#0f766e", INK = "#1b2740", BLUE = "#1d5bd0", RED = "#dc3b2a", GREEN = "#138a5a", ORANGE = "#ee7a1a", VIOLET = "#7b4fd6", PENCIL = "#5d6678";
  const P = pts => pts.map(p => (+p[0]).toFixed(1) + "," + (+p[1]).toFixed(1)).join(" ");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ln = (s, x1, y1, x2, y2, o) => s.el("line", Object.assign({ x1, y1, x2, y2, stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, o || {}));
  const tx = (s, x, y, t, o) => { const e = s.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "lbl", text: t }, o || {})); if (o && o.fill) e.style.fill = o.fill; return e; };
  const pg = (s, pts, o) => s.el("polygon", Object.assign({ points: P(pts), fill: "none", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, o || {}));
  const pth = (s, d, o) => s.el("path", Object.assign({ d, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" }, o || {}));
  const undraw = el => { el.classList.remove("a-draw"); el.style.removeProperty("--len"); };
  /* show a chosen part of a photo (view = [x, y, w, h] in image pixels, aspect = box aspect) and put an SVG
     overlay on top whose coordinates are image pixels – so outlines sit exactly on the real object. */
  function viewFig(s, fig, iw, ih, view, W) {
    const sc = W / view[2], img = fig.querySelector("img");
    img.style.visibility = "hidden";   // the visible picture is the figure background (keeps the box free of overflow)
    Object.assign(fig.style, { backgroundImage: `url("${img.getAttribute("src")}")`, backgroundRepeat: "no-repeat", backgroundSize: `${iw * sc}px ${ih * sc}px`, backgroundPosition: `${-view[0] * sc}px ${-view[1] * sc}px` });
    const ov = s.svg(view[2], view[3]);
    ov.setAttribute("viewBox", view.join(" "));
    Object.assign(ov.style, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" });
    img.after(ov);
    return { ov, k: 1 / sc };
  }

  /* ---------- animated pencil ---------- */
  function makePen(s) {
    const g = s.el("g", { class: "later", "pointer-events": "none" });
    const r = s.el("g", { transform: "rotate(30)" });
    r.append(
      s.el("rect", { x: -8, y: -118, width: 16, height: 13, rx: 4, fill: "#f08da0" }),
      s.el("rect", { x: -8, y: -106, width: 16, height: 10, fill: "#c3c9d4" }),
      s.el("rect", { x: -8, y: -96, width: 16, height: 76, fill: "#ffc93c", stroke: "#b07d12", "stroke-width": 1.5 }),
      s.el("polygon", { points: "0,0 -8,-20 8,-20", fill: "#f5d3a1", stroke: "#8a5a2b", "stroke-width": 1.5 }),
      s.el("polygon", { points: "0,0 -3,-7.5 3,-7.5", fill: INK }));
    g.append(r);
    let x = 0, y = 0, last = 0;
    const put = (nx, ny) => { x = nx; y = ny; g.setAttribute("transform", `translate(${nx.toFixed(1)},${ny.toFixed(1)})`); };
    const scrib = () => { const n = performance.now(); if (n - last > 240) { last = n; s.sfx.scribble(); } };
    put(0, 0);
    const pen = {
      g, put,
      show() { g.classList.remove("later"); },
      hide() { g.classList.add("later"); },
      async move(nx, ny, dur = 320) { pen.show(); const x0 = x, y0 = y; await s.tween({ dur, update: v => put(x0 + (nx - x0) * v, y0 + (ny - y0) * v) }); },
      async line(el, x1, y1, x2, y2, dur = 520) {
        await pen.move(x1, y1);
        el.setAttribute("x1", x1); el.setAttribute("y1", y1); el.setAttribute("x2", x1); el.setAttribute("y2", y1);
        el.classList.remove("later");
        await s.tween({ dur, ease: "inOut", update: v => { const px = x1 + (x2 - x1) * v, py = y1 + (y2 - y1) * v; el.setAttribute("x2", px); el.setAttribute("y2", py); put(px, py); scrib(); } });
      },
    };
    return pen;
  }

  /* ---------- small 3D toolkit (canvas) ---------- */
  const V3 = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    avg: ps => { let c = [0, 0, 0]; ps.forEach(p => { c = V3.add(c, p); }); return V3.mul(c, 1 / ps.length); },
  };
  function rotAround(p, a, d, ang) {
    const v = V3.sub(p, a), c = Math.cos(ang), sn = Math.sin(ang);
    return V3.add(a, V3.add(V3.add(V3.mul(v, c), V3.mul(V3.cross(d, v), sn)), V3.mul(d, V3.dot(d, v) * (1 - c))));
  }
  function viewRot(p, yaw, pitch) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x = p[0] * cy + p[2] * sy, z0 = -p[0] * sy + p[2] * cy;
    return [x, p[1] * cp - z0 * sp, p[1] * sp + z0 * cp];
  }
  const DIST = 9;
  const proj = (q, S, cx, cy) => { const f = DIST / (DIST - q[2]); return [cx + q[0] * S * f, cy - q[1] * S * f]; };

  function solidDef(v, f) {
    const edges = [], key = {};
    f.forEach((face, fi) => face.forEach((a, i) => {
      const b = face[(i + 1) % face.length], k = Math.min(a, b) + "-" + Math.max(a, b);
      if (key[k] == null) { key[k] = edges.length; edges.push({ a, b, f: [fi] }); } else edges[key[k]].f.push(fi);
    }));
    return { v, f, edges };
  }
  const CUBE_V = [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]];
  const CUBE_F = [[0, 1, 2, 3], [4, 5, 1, 0], [5, 6, 2, 1], [6, 7, 3, 2], [7, 4, 0, 3], [4, 5, 6, 7]];
  const SOL = {
    "Würfel": solidDef(CUBE_V, CUBE_F),
    "Quader": solidDef(CUBE_V.map(([x, y, z]) => [x * 1.55, y * 0.8, z * 0.95]), CUBE_F),
    "Pyramide": solidDef([[0, 1.25, 0], [-1.1, -0.85, 1.1], [1.1, -0.85, 1.1], [1.1, -0.85, -1.1], [-1.1, -0.85, -1.1]], [[1, 2, 0], [2, 3, 0], [3, 4, 0], [4, 1, 0], [1, 2, 3, 4]]),
  };
  const FACECOL = ["#ffd94a", "#7cc6b9", "#f2a07b", "#9db8f2", "#c4a8f0", "#9fd88a"];

  function drawSolid(g, W, H, sol, st) {
    g.clearRect(0, 0, W, H);
    const S = st.S, cx = W / 2, cy = H / 2 + 6;
    const q = sol.v.map(p => viewRot(p, st.yaw, st.pitch));
    const p2 = q.map(p => proj(p, S, cx, cy));
    const ctr = V3.avg(q), cam = [0, 0, DIST];
    const front = sol.f.map(face => {
      const pts = face.map(k => q[k]), c = V3.avg(pts);
      let n = V3.cross(V3.sub(pts[1], pts[0]), V3.sub(pts[2], pts[0]));
      if (V3.dot(n, V3.sub(c, ctr)) < 0) n = V3.mul(n, -1);
      return V3.dot(n, V3.sub(cam, c)) > 0;
    });
    const fillFace = fi => {
      g.beginPath(); sol.f[fi].forEach((k, i) => (i ? g.lineTo(p2[k][0], p2[k][1]) : g.moveTo(p2[k][0], p2[k][1]))); g.closePath();
      g.fillStyle = fi < st.f ? FACECOL[fi] + (front[fi] ? "f0" : "80") : front[fi] ? "rgba(255,255,255,.85)" : "rgba(220,243,239,.6)";
      g.fill();
    };
    const hiddenE = e => e.f.every(fi => !front[fi]);
    const drawEdge = (e, i) => {
      const hid = hiddenE(e), hi = i < Math.floor(st.k + 1e-6);
      g.setLineDash(hid ? [9, 8] : []);
      g.strokeStyle = hi ? RED : hid ? "rgba(27,39,64,.5)" : INK;
      g.lineWidth = hi ? 7 : 3.5; g.lineCap = "round";
      g.beginPath(); g.moveTo(p2[e.a][0], p2[e.a][1]); g.lineTo(p2[e.b][0], p2[e.b][1]); g.stroke();
    };
    sol.f.forEach((_, fi) => { if (!front[fi]) fillFace(fi); });
    sol.edges.forEach((e, i) => { if (hiddenE(e)) drawEdge(e, i); });
    sol.f.forEach((_, fi) => { if (front[fi]) fillFace(fi); });
    sol.edges.forEach((e, i) => { if (!hiddenE(e)) drawEdge(e, i); });
    g.setLineDash([]);
    const pc = proj(ctr, S, cx, cy), ne = Math.floor(st.e + 1e-6);
    sol.v.forEach((_, k) => {
      if (k >= ne) return;
      const [x, y] = p2[k];
      g.fillStyle = BLUE; g.beginPath(); g.arc(x, y, 9, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 2.5; g.stroke();
      const dx = x - pc[0], dy = y - pc[1], l = Math.hypot(dx, dy) || 1;
      g.font = "700 21px 'Atkinson Hyperlegible', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = BLUE; g.fillText(String(k + 1), x + dx / l * 26, y + dy / l * 26);
    });
  }

  /* ---------- nets that fold (Würfel- und Quadernetze) ---------- */
  function sharedEdge(r1, r2) {
    const e = 1e-6;
    for (const [A, B] of [[r1, r2], [r2, r1]]) {
      if (Math.abs(A.x + A.w - B.x) < e) { const y0 = Math.max(A.y, B.y), y1 = Math.min(A.y + A.h, B.y + B.h); if (y1 - y0 > e) return [[B.x, y0], [B.x, y1]]; }
      if (Math.abs(A.y + A.h - B.y) < e) { const x0 = Math.max(A.x, B.x), x1 = Math.min(A.x + A.w, B.x + B.w); if (x1 - x0 > e) return [[x0, B.y], [x1, B.y]]; }
    }
    return null;
  }
  function makeNet(rects, root = 0) {
    const n = rects.length, parent = Array(n).fill(-1), axis = Array(n).fill(null), seen = new Set([root]), queue = [root];
    while (queue.length) {
      const i = queue.shift();
      for (let j = 0; j < n; j++) {
        if (seen.has(j)) continue;
        const e = sharedEdge(rects[i], rects[j]);
        if (!e) continue;
        seen.add(j); parent[j] = i; queue.push(j);
        const mid = [(e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2], r = rects[j];
        const nx = r.x + r.w / 2 - mid[0], ny = r.y + r.h / 2 - mid[1];
        axis[j] = { a: [e[0][0], e[0][1], 0], d: V3.norm([ny, -nx, 0]) };
      }
    }
    const xs = rects.flatMap(r => [r.x, r.x + r.w]), ys = rects.flatMap(r => [r.y, r.y + r.h]);
    return { rects, parent, axis, root, w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), minX: Math.min(...xs), minY: Math.min(...ys) };
  }
  function netWorld(net, i, x, y, t) {
    let q = [x, y, 0], k = i;
    while (k !== net.root && k >= 0) { const ax = net.axis[k]; q = rotAround(q, ax.a, ax.d, -t * Math.PI / 2); k = net.parent[k]; }
    return [q[0], q[2], q[1]];
  }
  function foldCheck(net) {
    const cs = net.rects.map((r, i) => netWorld(net, i, r.x + r.w / 2, r.y + r.h / 2, 1).map(v => Math.round(v * 100)).join(","));
    const bad = new Set();
    cs.forEach((c, i) => cs.forEach((d, j) => { if (i !== j && c === d) bad.add(i); }));
    return bad;
  }
  const PIPS = { 1: [[.5, .5]], 2: [[.27, .27], [.73, .73]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.27, .27], [.73, .27], [.27, .73], [.73, .73]], 5: [[.25, .25], [.75, .25], [.5, .5], [.25, .75], [.75, .75]], 6: [[.27, .23], [.73, .23], [.27, .5], [.73, .5], [.27, .77], [.73, .77]] };
  function drawNet(g, W, H, net, t, st) {
    g.clearRect(0, 0, W, H);
    const faces = net.rects.map((r, i) => ({ i, r, c: [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]].map(([x, y]) => netWorld(net, i, x, y, t)) }));
    const ctr = V3.avg(faces.flatMap(f => f.c));
    const S = st.S0 + (st.S1 - st.S0) * t, pitch = st.pitch0 + (st.pitch1 - st.pitch0) * t;
    const cx = W / 2, cy = H / 2;
    const V = p => viewRot(V3.sub(p, ctr), st.yaw, pitch);
    const items = faces.map(f => {
      const q = f.c.map(V), mid = V3.avg(q);
      const nrm = V3.cross(V3.sub(q[3], q[0]), V3.sub(q[1], q[0]));
      return { f, q, mid, front: V3.dot(nrm, V3.sub([0, 0, DIST], mid)) > 0 };
    }).sort((a, b) => a.mid[2] - b.mid[2]);
    for (const it of items) {
      const p2 = it.q.map(q => proj(q, S, cx, cy)), r = it.f.r;
      g.beginPath(); p2.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath();
      const bad = st.bad && st.bad.has(it.f.i) && t > 0.97;
      g.fillStyle = bad ? "rgba(220,59,42,.78)" : it.front ? r.fill : r.back || "#dfe4dc";
      g.fill();
      g.strokeStyle = r.edge || INK; g.lineWidth = 2.5; g.lineJoin = "round"; g.stroke();
      if (it.front && r.pips) {
        g.fillStyle = r.pipCol || INK;
        for (const [u, v] of PIPS[r.pips]) {
          g.beginPath();
          for (let k = 0; k < 12; k++) {
            const a = k / 12 * Math.PI * 2, pr = 0.085 * Math.min(r.w, r.h);
            const w = netWorld(net, it.f.i, r.x + u * r.w + Math.cos(a) * pr, r.y + v * r.h + Math.sin(a) * pr, t);
            const pp = proj(V(w), S, cx, cy);
            k ? g.lineTo(pp[0], pp[1]) : g.moveTo(pp[0], pp[1]);
          }
          g.closePath(); g.fill();
        }
      }
      if (it.front && r.label) {
        const c = proj(V(netWorld(net, it.f.i, r.x + r.w / 2, r.y + r.h / 2, t)), S, cx, cy);
        g.font = "700 20px 'Atkinson Hyperlegible', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#5a3a12";
        g.fillText(r.label, c[0], c[1]);
      }
    }
  }
  const DICE_COL = { 1: "#ffffff", 2: "#fff3b8", 3: "#d6f0ea", 4: "#ffe0d1", 5: "#e3e9fb", 6: "#ece2fb" };
  const cells = (list, pipList) => list.map(([c, r], i) => ({ x: c, y: r, w: 1, h: 1, pips: pipList ? pipList[i] : null, fill: pipList ? DICE_COL[pipList[i]] : "#d4efe9", back: "#c8d6d2" }));
  function boxNet() {
    const L = 2, B = 1.3, Hh = 0.75, col = "#e4c08f", side = "#d6ab70";
    return [
      { x: 0, y: 0, w: L, h: B, fill: col, back: "#b98a52", edge: "#6b4a22", label: "Deckel" },
      { x: 0, y: B, w: L, h: Hh, fill: side, back: "#b98a52", edge: "#6b4a22" },
      { x: 0, y: -Hh, w: L, h: Hh, fill: side, back: "#b98a52", edge: "#6b4a22" },
      { x: 0, y: -Hh - B, w: L, h: B, fill: col, back: "#b98a52", edge: "#6b4a22", label: "Boden" },
      { x: -Hh, y: 0, w: Hh, h: B, fill: side, back: "#b98a52", edge: "#6b4a22" },
      { x: L, y: 0, w: Hh, h: B, fill: side, back: "#b98a52", edge: "#6b4a22" },
    ];
  }
  function netView(net, W, H) {
    const S0 = Math.min(W * 0.8 / net.w, H * 0.95 / net.h, 120);
    const maxDim = Math.max(...net.rects.map(r => Math.max(r.w, r.h)));
    return { S0, S1: Math.min(W, H) * 0.42 / maxDim, yaw: -0.45, pitch0: 0.95, pitch1: 0.55, bad: null };
  }
  function netThumb(s, net, color) {
    const svg = s.svg(124, 78);
    const sc = Math.min(116 / net.w, 70 / net.h);
    const ox = (124 - net.w * sc) / 2 - net.minX * sc, oy = (78 - net.h * sc) / 2 - net.minY * sc;
    net.rects.forEach(r => svg.append(s.el("rect", { x: ox + r.x * sc, y: oy + r.y * sc, width: r.w * sc, height: r.h * sc, fill: color || r.fill, stroke: INK, "stroke-width": 1.6 })));
    return svg;
  }

  /* ---------- 3D-looking solid icons (SVG) ---------- */
  function solidIcon(s, kind, w = 130, h = 112) {
    const svg = s.svg(w, h);
    const F = "#5fb3a7", T = "#a5ddd3", R = "#3a8c80", st = { stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" };
    const box = (x, y, a, b, dx, dy) => [
      pg(s, [[x, y], [x + a, y], [x + a, y + b], [x, y + b]], Object.assign({ fill: F }, st)),
      pg(s, [[x, y], [x + dx, y - dy], [x + a + dx, y - dy], [x + a, y]], Object.assign({ fill: T }, st)),
      pg(s, [[x + a, y], [x + a + dx, y - dy], [x + a + dx, y + b - dy], [x + a, y + b]], Object.assign({ fill: R }, st))];
    if (kind === "Würfel") svg.append(...box(22, 40, 62, 62, 30, 28));
    if (kind === "Quader") svg.append(...box(8, 52, 86, 50, 30, 30));
    if (kind === "Kugel") svg.append(s.el("circle", Object.assign({ cx: 65, cy: 57, r: 48, fill: F }, st)), s.el("ellipse", { cx: 65, cy: 57, rx: 48, ry: 13, fill: "none", stroke: INK, "stroke-width": 1.8, "stroke-dasharray": "6 5" }), s.el("ellipse", { cx: 48, cy: 36, rx: 14, ry: 9, fill: "#fff", opacity: .55 }));
    if (kind === "Zylinder") svg.append(pth(s, "M33,24 L33,92 A32,10 0 0 0 97,92 L97,24", Object.assign({ fill: F }, st)), s.el("ellipse", Object.assign({ cx: 65, cy: 24, rx: 32, ry: 10, fill: T }, st)));
    if (kind === "Kegel") svg.append(pth(s, "M65,8 L25,94 A40,11 0 0 0 105,94 Z", Object.assign({ fill: F }, st)), pth(s, "M25,94 A40,11 0 0 1 105,94", { stroke: INK, "stroke-width": 1.8, "stroke-dasharray": "6 5" }));
    if (kind === "Pyramide") svg.append(
      pth(s, "M14,100 L44,76 L120,76", { stroke: INK, "stroke-width": 1.8, "stroke-dasharray": "6 5" }), ln(s, 44, 76, 64, 8, { "stroke-width": 1.8, "stroke-dasharray": "6 5" }),
      pg(s, [[14, 100], [90, 100], [64, 8]], Object.assign({ fill: F }, st)), pg(s, [[90, 100], [120, 76], [64, 8]], Object.assign({ fill: R }, st)));
    return svg;
  }

  /* ---------- coordinate system (first quadrant) ---------- */
  function kosy(s, o = {}) {
    const W = o.W || 570, H = o.H || 500, ox = 56, oy = 446, u = 46, xmax = 10, ymax = 8;
    const svg = s.svg(W, H);
    const X = x => ox + x * u, Y = y => oy - y * u;
    svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#fff", stroke: "#d6e2ea", "stroke-width": 2 }));
    const grid = s.el("g");
    for (let i = 0; i <= xmax; i++) grid.append(ln(s, X(i), Y(0), X(i), Y(ymax), { stroke: "#cfdfe9", "stroke-width": 1.5 }));
    for (let j = 0; j <= ymax; j++) grid.append(ln(s, X(0), Y(j), X(xmax), Y(j), { stroke: "#cfdfe9", "stroke-width": 1.5 }));
    const axX = ln(s, X(0), Y(0), X(xmax) + 32, Y(0), { "stroke-width": 3.5 }), axY = ln(s, X(0), Y(0), X(0), Y(ymax) - 32, { "stroke-width": 3.5 });
    const arrX = pg(s, [[X(xmax) + 40, Y(0)], [X(xmax) + 26, Y(0) - 8], [X(xmax) + 26, Y(0) + 8]], { fill: INK, "stroke-width": 1 });
    const arrY = pg(s, [[X(0), Y(ymax) - 40], [X(0) - 8, Y(ymax) - 26], [X(0) + 8, Y(ymax) - 26]], { fill: INK, "stroke-width": 1 });
    const nums = s.el("g");
    for (let i = 1; i <= xmax; i++) nums.append(tx(s, X(i), Y(0) + 27, String(i), { class: "lbl", style: { fontSize: "19px" } }), ln(s, X(i), Y(0) - 5, X(i), Y(0) + 5, { "stroke-width": 2 }));
    for (let j = 1; j <= ymax; j++) nums.append(tx(s, X(0) - 14, Y(j) + 7, String(j), { "text-anchor": "end", style: { fontSize: "19px" } }), ln(s, X(0) - 5, Y(j), X(0) + 5, Y(j), { "stroke-width": 2 }));
    nums.append(tx(s, X(0) - 14, Y(0) + 25, "0", { "text-anchor": "end", style: { fontSize: "19px" } }));
    const names = s.el("g");
    names.append(tx(s, X(xmax) + 34, Y(0) + 30, "x", { class: "hlbl", fill: BLUE }), tx(s, X(0) + 24, Y(ymax) - 22, "y", { class: "hlbl", fill: RED }));
    svg.append(grid, axX, axY, arrX, arrY, nums, names);
    return { svg, X, Y, u, ox, oy, xmax, ymax, axes: [axX, axY, arrX, arrY], nums, names, grid };
  }

  Deck.unit({
    id: "u2", num: 2, title: "Körper und Figuren", color: U, soft: "#dcf3ef",
    subtitle: "Formen sehen, falten, zeichnen",
    blurb: "Würfel, Kugel, Netze, Koordinaten und das Haus der Vierecke.",
    goals: ["Figuren und Körper erkennen und benennen", "Ecken, Kanten, Flächen und Symmetrie entdecken", "Punkte und Figuren ins Koordinatensystem zeichnen", "Würfelnetze falten und Schrägbilder zeichnen", "Das Haus der Vierecke verstehen"],
    icon(svg, el) {
      svg.append(
        el("polygon", { points: "10,30 40,30 40,60 10,60", fill: "#5fb3a7", stroke: U, "stroke-width": 2.5 }),
        el("polygon", { points: "10,30 24,16 54,16 40,30", fill: "#a5ddd3", stroke: U, "stroke-width": 2.5 }),
        el("polygon", { points: "40,30 54,16 54,46 40,60", fill: "#3a8c80", stroke: U, "stroke-width": 2.5 }),
        el("circle", { cx: 56, cy: 54, r: 11, fill: "#ffd94a", stroke: U, "stroke-width": 2.5 }));
    },
    slides: [
      /* 1 ─────────────────────────────── */
      {
        title: "Ebene Figuren um uns herum",
        say: "Flache Figuren findest du überall: auf Schildern, an Fenstern, an Türen und auf der Uhr. Wir suchen die Form darin.",
        build(s) {
          const PW = 220, PH = 210;
          const items = [
            { name: "Dreieck", prop: "3 Ecken, 3 Seiten", ex: "auch: Pizzastück, Hausdach", fig: () => s.photo("vorfahrt-schild", { w: PW, h: PH }), iw: 700, ih: 528, view: [85, 30, 520, 496],
              shape: k => pg(s, [[118, 93], [572, 93], [335, 461]], { stroke: U, "stroke-width": 7 * k }), snd: () => s.sound("traffic", { vol: .4, dur: 2.5 }) },
            { name: "Quadrat", prop: "4 gleich lange Seiten, 4 rechte Winkel", ex: "auch: Schachfeld, Post-it", fig: () => s.photo("schachbrett", { w: PW, h: PH }), iw: 600, ih: 600, view: [50, 54, 506, 483],
              shape: k => s.el("rect", { x: 98, y: 97, width: 411, height: 410, fill: "none", stroke: U, "stroke-width": 7 * k }), snd: () => s.sfx.snap() },
            { name: "Rechteck", prop: "Gegenüber gleich lang, 4 rechte Winkel", ex: "auch: Handy, Tafel", fig: () => s.photo("holztuer", { w: PW, h: PH }), iw: 500, ih: 700, view: [15, 185, 471, 450],
              shape: k => s.el("rect", { x: 101, y: 209, width: 292, height: 406, fill: "none", stroke: U, "stroke-width": 7 * k }), snd: () => s.sound("knock", { vol: .6, dur: 1.5 }) },
            { name: "Kreis", prop: "keine Ecken, ganz rund", ex: "auch: Pizza, Münze", fig: () => s.photo("uhr-rohrdamm", { w: PW, h: PH, caption: "Berlin, U7" }), iw: 700, ih: 640, view: [194, 96, 314, 300],
              shape: k => s.el("circle", { cx: 351, cy: 246, r: 104, fill: "none", stroke: U, "stroke-width": 7 * k }), snd: () => s.sound("clock-tick", { vol: .5, dur: 2.5 }) },
          ];
          const cards = items.map(it => {
            const fig = it.fig(), { ov, k } = viewFig(s, fig, it.iw, it.ih, it.view, PW);
            const outline = it.shape(k); outline.classList.add("later"); ov.append(outline);
            const words = [s.h("p", { class: "h2", style: { color: U } }, it.name), s.h("p", { class: "small", style: { fontWeight: 700, textAlign: "center" } }, it.prop), s.h("p", { class: "small pencil", style: { textAlign: "center" } }, it.ex)];
            words.forEach(w => w.classList.add("later"));
            const card = s.h("div", { class: "card", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px 10px" } }, fig, ...words);
            return { card, outline, words };
          });
          const merk = s.h("div", { class: "merk later" }, "Figuren sind ", s.h("b", null, "flach"), " (eben) – man kann sie aufs Papier zeichnen. Die Ränder heißen ", s.h("b", null, "Seiten"), ", die Spitzen heißen ", s.h("b", null, "Ecken"), ".");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { class: "cols4" }, cards.map(c => c.card)), merk));
          cards.forEach((c, i) => s.show(c.card, "up", i * 120));
          s.sfx.whoosh();
          cards.forEach((c, i) => s.step(async () => {
            s.sfx.zap(); await s.show(c.outline, "draw");
            items[i].snd(); s.show(c.words, "up"); s.say(items[i].name + ": " + items[i].prop);
          }));
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 2 ─────────────────────────────── */
      {
        title: "Körper zum Anfassen",
        say: "Körper sind nicht flach. Sie haben Länge, Breite und Höhe. Man kann sie anfassen.",
        build(s) {
          const list = [
            ["Würfel", "Spielwürfel, Zauberwürfel, Minecraft-Block"],
            ["Quader", "Schuhkarton, Tetra Pak, Ziegelstein"],
            ["Kugel", "Fußball, Murmel, Kugel vom Fernsehturm"],
            ["Zylinder", "Getränkedose, Litfaßsäule, Kerze"],
            ["Kegel", "Eistüte, Partyhut, Leitkegel (Pylone)"],
            ["Pyramide", "Pyramiden in Ägypten, Turmdach, Zelt"],
          ];
          const cards = list.map(([name, ex]) => {
            const icon = solidIcon(s, name);
            const card = s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "14px", alignItems: "center", padding: "14px 16px", cursor: "pointer" },
              onclick: () => { s.sfx.boing(); icon.classList.remove("a-bounce"); void icon.getBoundingClientRect(); icon.classList.add("a-bounce"); } },
            icon, s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "h2", style: { color: U } }, name), s.h("p", { class: "small" }, ex)));
            return card;
          });
          const merk = s.h("div", { class: "merk" }, "Ebene ", s.h("b", null, "Figuren"), " sind flach. ", s.h("b", null, "Körper"), " sind räumlich: Sie haben Länge, Breite und Höhe. Tippe auf einen Körper!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "22px" } }, s.h("div", { class: "cols3" }, cards), merk));
          s.show(merk, "up"); s.sfx.whoosh();
          [[0, 1], [2, 3], [4, 5]].forEach(pair => s.step(async () => {
            for (const i of pair) { s.sfx.pop(); s.show(cards[i], "bounce"); await s.wait(250); }
            s.say(pair.map(i => list[i][0]).join(" und "));
          }));
        },
      },
      /* 2b ─────────────────────────────── */
      {
        title: "Körper in echt",
        say: "So sehen die sechs Körper in echt aus. Schau genau hin: Wo sind Ecken, wo ist es rund?",
        build(s) {
          const o = (caption, pos) => ({ w: 350, h: 268, caption, pos: pos || "50% 50%" });
          const figs = [
            s.photo("spielwuerfel", o("Würfel: Spielwürfel")),
            s.photo("ziegelsteine", o("Quader: Ziegelsteine")),
            s.photo("murmeln", o("Kugel: Murmeln")),
            s.photo("litfasssaeule", o("Zylinder: Litfaßsäule", "50% 45%")),
            s.photo("leitkegel", o("Kegel: Leitkegel", "50% 55%")),
            s.photo("pyramiden-gizeh", o("Pyramide: Gizeh, Ägypten", "50% 60%")),
          ];
          figs.forEach((f, i) => { if (i > 1) f.classList.add("later"); });
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center" } }, s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 350px)", gap: "22px 25px", justifyContent: "center" } }, figs)));
          s.show(figs[0], "zoom"); s.show(figs[1], "zoom", 150); s.sound("wuerfeln", { vol: .6 });
          s.step(async () => { s.sound("murmeln-rollen", { vol: .6 }); s.show(figs[2], "zoom"); await s.show(figs[3], "zoom", 150); s.say("Kugel und Zylinder sind rund – sie können rollen."); });
          s.step(async () => { s.sound("wind", { vol: .4, dur: 3 }); s.show(figs[4], "zoom"); await s.show(figs[5], "zoom", 150); s.say("Kegel und Pyramide laufen oben spitz zu. Die Pyramiden in Ägypten sind über 4.000 Jahre alt."); });
        },
      },
      /* 3 ─────────────────────────────── */
      {
        title: "Ecken, Kanten, Flächen",
        say: "Wir zählen am Würfel: Wie viele Ecken, Kanten und Flächen hat er? Du kannst ihn mit dem Finger drehen.",
        build(s) {
          const W = 540, H = 560;
          const { canvas, g } = s.canvas(W, H);
          const st = { yaw: 0.6, pitch: 0.42, S: 118, e: 0, k: 0, f: 0, kind: "Würfel", drag: false };
          let on = { e: false, k: false, f: false };
          const tiles = {};
          const tile = (key, label, col) => {
            const num = s.h("p", { class: "huge mono", style: { color: col, fontSize: "60px", lineHeight: "1.3" } }, "?");
            tiles[key] = num;
            return s.h("div", { class: "card", style: { textAlign: "center", padding: "10px 6px" } }, num, s.h("p", { class: "t", style: { fontWeight: 700 } }, label));
          };
          const btns = Object.keys(SOL).map(name => s.h("button", { class: "btn" + (name === "Würfel" ? " solid" : ""), onclick: () => pick(name) }, name));
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, s.h("b", null, "Würfel und Quader:"), " 8 Ecken, 12 Kanten, 6 Flächen. Kugel, Zylinder und Kegel haben ", s.h("b", null, "gekrümmte"), " Flächen – darum können sie rollen.");
          const right = s.h("div", { class: "stack", style: { gap: "18px" } },
            s.h("div", { class: "row" }, btns),
            s.h("div", { class: "cols3", style: { gap: "14px" } }, tile("e", "Ecken", BLUE), tile("k", "Kanten", RED), tile("f", "Flächen", ORANGE)),
            s.h("p", { class: "small pencil" }, "Zum Drehen: auf dem Körper wischen. Gestrichelt = Kante hinten (verdeckt)."),
            merk);
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%" } }, s.h("div", { class: "nosw" }, canvas), right));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          let last = null;
          s.drag(canvas, { space: canvas, onStart: p => { st.drag = true; last = p; }, onMove: p => { st.yaw += (p.x - last.x) * 0.012; st.pitch = clamp(st.pitch + (p.y - last.y) * 0.01, -0.2, 1.2); last = p; }, onEnd: () => { st.drag = false; } });
          s.loop((t, dt) => { if (!st.drag) st.yaw += dt * 0.35; drawSolid(g, W, H, SOL[st.kind], st); });
          const totals = () => { const sol = SOL[st.kind]; return { e: sol.v.length, k: sol.edges.length, f: sol.f.length }; };
          async function count(key) {
            const n = totals()[key]; let shown = 0;
            tiles[key].textContent = "0";
            await s.tween({ from: 0, to: n, dur: n * (key === "f" ? 330 : 230), ease: "linear", update: v => {
              st[key] = v; const c = Math.floor(v + 1e-6);
              if (c > shown) { shown = c; tiles[key].textContent = String(c); s.sfx.count(c - 1); }
            } });
            st[key] = n; tiles[key].textContent = String(n);
            tiles[key].classList.remove("a-pop"); void tiles[key].offsetWidth; tiles[key].classList.add("a-pop");
          }
          async function pick(name) {
            s.sfx.click(); st.kind = name;
            btns.forEach(b => b.classList.toggle("solid", b.textContent === name));
            st.e = st.k = st.f = 0;
            ["e", "k", "f"].forEach(k => { tiles[k].textContent = "?"; });
            for (const k of ["e", "k", "f"]) if (on[k]) await count(k);
          }
          s.step(async () => { on.e = true; s.say("Ecken sind die Spitzen. Der Würfel hat 8 Ecken."); await count("e"); s.sfx.ding(); });
          s.step(async () => { on.k = true; s.say("Kanten sind die Linien, wo zwei Flächen zusammenstoßen. 12 Stück!"); await count("k"); s.sfx.ding(); });
          s.step(async () => { on.f = true; s.say("Flächen sind die Seiten des Körpers. Der Würfel hat 6 Flächen."); await count("f"); s.sfx.ding(); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 4 ─────────────────────────────── */
      {
        title: "Achsensymmetrie: Falten!",
        say: "Wenn du eine Figur in der Mitte faltest und beide Hälften genau aufeinander passen, ist sie achsensymmetrisch.",
        build(s) {
          const AX = 260;
          const EX = {
            "Schmetterling": {
              half: () => [
                pth(s, "M0,190 C40,60 200,20 225,110 C236,170 120,205 0,212 Z", { fill: "#c4a8f0", stroke: VIOLET, "stroke-width": 4 }),
                pth(s, "M0,222 C100,215 205,250 175,330 C145,392 40,335 0,252 Z", { fill: "#9fd88a", stroke: GREEN, "stroke-width": 4 }),
                s.el("circle", { cx: 150, cy: 115, r: 24, fill: "#ffd94a", stroke: ORANGE, "stroke-width": 3 }),
                s.el("circle", { cx: 110, cy: 290, r: 16, fill: "#fff", stroke: GREEN, "stroke-width": 3 }),
                pth(s, "M0,140 Q22,80 56,62", { stroke: INK, "stroke-width": 3 }), s.el("circle", { cx: 56, cy: 62, r: 6, fill: INK })],
              mid: () => [s.el("ellipse", { cx: 0, cy: 225, rx: 11, ry: 88, fill: INK })],
            },
            "Brandenburger Tor": {
              half: () => [
                s.el("rect", { x: 0, y: 358, width: 228, height: 20, fill: "#d9c48f", stroke: "#9b7d45", "stroke-width": 3 }),
                ...[40, 115, 190].map(x => s.el("rect", { x: x - 12, y: 200, width: 24, height: 158, fill: "#ead9ad", stroke: "#9b7d45", "stroke-width": 3 })),
                s.el("rect", { x: 0, y: 172, width: 222, height: 30, fill: "#ead9ad", stroke: "#9b7d45", "stroke-width": 3 }),
                s.el("rect", { x: 0, y: 132, width: 150, height: 40, fill: "#e2cd98", stroke: "#9b7d45", "stroke-width": 3 }),
                pth(s, "M0,132 L0,84 L18,76 L30,96 L46,88 L56,110 L66,132 Z", { fill: "#3f8f7a", stroke: "#285e50", "stroke-width": 3 })],
              mid: () => [],
            },
            "Geige": {
              half: () => [
                pth(s, "M0,150 C35,148 70,150 78,180 C84,205 60,215 58,232 C56,250 92,262 96,300 C100,345 60,374 0,374 Z", { fill: "#c9762f", stroke: "#7a4316", "stroke-width": 3 }),
                pth(s, "M38,246 c12,8 -8,24 4,36", { stroke: INK, "stroke-width": 3 }),
                s.el("rect", { x: 0, y: 40, width: 11, height: 200, fill: "#2b2b2b" }),
                s.el("rect", { x: 0, y: 318, width: 13, height: 46, fill: "#2b2b2b" }),
                s.el("rect", { x: 0, y: 290, width: 28, height: 7, fill: "#e8cf9a" }),
                s.el("circle", { cx: 0, cy: 28, r: 15, fill: "#a85b22", stroke: "#7a4316", "stroke-width": 3 }),
                ln(s, 3.5, 36, 3.5, 330, { stroke: "#f2f2f2", "stroke-width": 1.5 }), ln(s, 8.5, 36, 8.5, 330, { stroke: "#f2f2f2", "stroke-width": 1.5 })],
              mid: () => [],
            },
          };
          const svg = s.svg(520, 400);
          svg.append(s.el("rect", { x: 0, y: 0, width: 520, height: 400, rx: 18, fill: "#fff", stroke: "#d6e2ea", "stroke-width": 2 }));
          const stg = s.el("g"); svg.append(stg);
          const axis = ln(s, AX, 8, AX, 392, { stroke: RED, "stroke-width": 4, "stroke-dasharray": "14 10", class: "later" });
          svg.append(axis);
          let right = null, cur = "Schmetterling", busy = false;
          function load(name) {
            cur = name; stg.textContent = "";
            const ex = EX[name];
            const left = s.el("g", { transform: `translate(${AX},0) scale(-1,1)` }); left.append(...ex.half());
            const mid = s.el("g", { transform: `translate(${AX},0)` }); mid.append(...ex.mid());
            right = s.el("g", { transform: `translate(${AX},0)` }); right.append(...ex.half());
            stg.append(left, right, mid);
            btns.forEach(b => b.classList.toggle("solid", b.dataset.n === name));
            Object.entries(REAL).forEach(([n, f]) => { f.style.display = n === name ? "" : "none"; });
          }
          const status = s.h("p", { class: "t", style: { minHeight: "68px" } }, "Wähle ein Bild und falte es an der roten Linie.");
          const REAL = {
            "Schmetterling": s.photo("tagpfauenauge", { w: 310, h: 196, caption: "Tagpfauenauge" }),
            "Brandenburger Tor": s.photo("brandenburger-tor", { w: 310, h: 196, caption: "Brandenburger Tor", pos: "50% 40%" }),
            "Geige": s.photo("geige-vorne", { w: 310, h: 196, caption: "Geige", pos: "50% 72%" }),
          };
          const realBox = s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "flex-end" } }, ...Object.values(REAL), s.h("p", { class: "small pencil" }, "So sieht es in echt aus."));
          async function fold() {
            if (busy) return; busy = true;
            s.show(axis, "fade");
            s.sfx.whoosh();
            status.textContent = "Falten …";
            await s.tween({ from: 1, to: -1, dur: 1300, ease: "inOut", update: v => { right.setAttribute("transform", `translate(${AX},0) scale(${v.toFixed(3)},1)`); right.setAttribute("opacity", v < 0 ? .9 : 1); } });
            s.sfx.ding(); status.textContent = "Passt genau aufeinander! Die Figur ist achsensymmetrisch.";
            await s.wait(900);
            s.sfx.swoosh();
            await s.tween({ from: -1, to: 1, dur: 1000, ease: "inOut", update: v => { right.setAttribute("transform", `translate(${AX},0) scale(${v.toFixed(3)},1)`); right.setAttribute("opacity", v < 0 ? .9 : 1); } });
            busy = false;
          }
          const btns = Object.keys(EX).map(n => s.h("button", { class: "btn", "data-n": n, onclick: () => { if (busy) return; if (n === "Geige") s.sound("klang-geige", { vol: .6 }); else s.sfx.pop(); load(n); status.textContent = "Tippe auf „Falten“."; } }, n));
          const foldBtn = s.h("button", { class: "btn solid", style: { background: ORANGE, borderColor: ORANGE }, onclick: fold }, "Falten ▶");
          load("Schmetterling");
          const merk = s.h("div", { class: "merk later", style: { fontSize: "21px" } }, "Kann man eine Figur so falten, dass beide Hälften ", s.h("b", null, "genau aufeinander"), " passen, ist sie ", s.h("b", null, "achsensymmetrisch"), ". Die Faltlinie heißt ", s.h("b", null, "Symmetrieachse"), ".");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row", style: { gap: "12px" } }, btns, foldBtn), status, realBox, merk)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.zap(); await s.show(axis, "fade"); status.textContent = "Die rote Linie ist die Faltlinie."; s.say("Hier falten wir."); });
          s.step(async () => { await fold(); });
          s.step(async () => { s.sfx.success(); await s.show(merk, "up"); });
        },
      },
      /* 5 ─────────────────────────────── */
      {
        title: "Wie viele Symmetrieachsen?",
        say: "Manche Figuren haben mehrere Symmetrieachsen. Das Quadrat hat vier, der Kreis sogar unendlich viele.",
        build(s) {
          const C = [150, 75];
          const defs = [
            { name: "Quadrat", n: "4", shape: () => s.el("rect", { x: 90, y: 15, width: 120, height: 120 }), axes: [[150, 2, 150, 148], [77, 75, 223, 75], [80, 5, 220, 145], [220, 5, 80, 145]] },
            { name: "Rechteck", n: "2", shape: () => s.el("rect", { x: 50, y: 22, width: 200, height: 106 }), axes: [[150, 6, 150, 144], [36, 75, 264, 75]] },
            { name: "Dreieck", sub: "(gleichseitig)", n: "3", shape: () => pg(s, [[78, 138], [222, 138], [150, 13]]), axes: [[150, 3, 150, 146], [66, 145, 199, 68], [234, 145, 101, 68]] },
            { name: "Raute", n: "2", shape: () => pg(s, [[150, 6], [245, 75], [150, 144], [55, 75]]), axes: [[150, 0, 150, 150], [40, 75, 260, 75]] },
            { name: "Parallelogramm", n: "0", shape: () => pg(s, [[50, 130], [195, 130], [250, 20], [105, 20]]), axes: [] },
            { name: "Kreis", n: "∞", shape: () => s.el("circle", { cx: 150, cy: 75, r: 66 }), axes: Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 8; return [150 + 74 * Math.cos(a), 75 + 74 * Math.sin(a), 150 - 74 * Math.cos(a), 75 - 74 * Math.sin(a)]; }) },
          ];
          const cards = defs.map(d => {
            const svg = s.svg(300, 150);
            const sh = d.shape(); sh.setAttribute("fill", "#dcf3ef"); sh.setAttribute("stroke", U); sh.setAttribute("stroke-width", 5); sh.setAttribute("stroke-linejoin", "round");
            svg.append(sh);
            const axes = d.axes.map(a => ln(s, ...a, { stroke: RED, "stroke-width": 3.5, "stroke-dasharray": "10 7", class: "later" }));
            svg.append(...axes);
            const num = s.h("span", { class: "big mono", style: { color: RED } }, "?");
            const card = s.h("div", { class: "card", style: { padding: "10px 14px", cursor: "pointer" }, onclick: () => run() },
              svg, s.h("div", { class: "row", style: { justifyContent: "space-between", flexWrap: "nowrap" } }, s.h("span", { class: "t", style: { fontWeight: 700 } }, d.name, d.sub ? s.h("span", { class: "pencil", style: { fontWeight: 400, fontSize: "19px" } }, " " + d.sub) : ""), num));
            async function run() {
              s.hide(axes); num.textContent = "0";
              if (!axes.length) { s.sfx.boing(); num.textContent = "0"; card.classList.remove("a-shake"); void card.offsetWidth; card.classList.add("a-shake"); return; }
              for (let i = 0; i < axes.length; i++) {
                s.show(axes[i], "fade"); s.sfx.count(i);
                num.textContent = d.n === "∞" ? String(i + 1) : String(i + 1);
                await s.wait(d.n === "∞" ? 110 : 330);
              }
              num.textContent = d.n; s.sfx.ding();
            }
            return { card, run };
          });
          const life = s.h("div", { class: "life later", style: { padding: "10px 18px" } }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "Verkehrsschilder, Fenster, das Brandenburger Tor und viele Logos sind achsensymmetrisch – das wirkt ruhig und ordentlich."));
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards.map(c => c.card)), life));
          cards.forEach((c, i) => s.show(c.card, "up", i * 80)); s.sfx.whoosh();
          [[0, 1], [2, 3], [4, 5]].forEach(pair => s.step(async () => { for (const i of pair) await cards[i].run(); }));
          s.step(async () => { s.sfx.success(); await s.show(life, "up"); });
        },
      },
      /* 6 ─────────────────────────────── */
      {
        title: "Der Kreis",
        say: "Jeder Kreis hat einen Mittelpunkt M. Der Radius r geht vom Mittelpunkt bis zum Rand. Der Durchmesser d ist doppelt so lang.",
        build(s) {
          const cx = 250, cy = 250, PX = 44, RA = 50 * Math.PI / 180;
          let r = 4;
          const svg = s.svg(500, 500);
          svg.append(s.el("rect", { x: 0, y: 0, width: 500, height: 500, rx: 18, fill: "#fff", stroke: "#d6e2ea", "stroke-width": 2 }));
          const arc = pth(s, "", { stroke: U, "stroke-width": 6 });
          const circle = s.el("circle", { cx, cy, r: r * PX, fill: "#dcf3ef", stroke: U, "stroke-width": 6, class: "later" });
          const rad = ln(s, cx, cy, cx, cy, { stroke: BLUE, "stroke-width": 5, class: "later" });
          const dia = ln(s, cx, cy, cx, cy, { stroke: RED, "stroke-width": 5, class: "later" });
          const mDot = s.el("circle", { cx, cy, r: 7, fill: INK, class: "later" });
          const mLbl = tx(s, cx - 26, cy + 34, "M", { class: "hlbl later", fill: INK });
          const rLbl = tx(s, 0, 0, "r", { class: "hlbl later", fill: BLUE });
          const dLbl = tx(s, 0, 0, "d", { class: "hlbl later", fill: RED });
          svg.append(circle, arc, dia, rad, mDot, mLbl, rLbl, dLbl);
          const place = (R, ang = RA) => {
            circle.setAttribute("r", R);
            rad.setAttribute("x2", cx + R * Math.cos(ang)); rad.setAttribute("y2", cy - R * Math.sin(ang));
            const mx = cx + R / 2 * Math.cos(ang), my = cy - R / 2 * Math.sin(ang);
            rLbl.setAttribute("x", mx - 22 * Math.sin(ang)); rLbl.setAttribute("y", my - 22 * Math.cos(ang) + 4);
            dia.setAttribute("x1", cx - R); dia.setAttribute("x2", cx + R); dia.setAttribute("y1", cy); dia.setAttribute("y2", cy);
            dLbl.setAttribute("x", cx + R / 2 + 6); dLbl.setAttribute("y", cy + 36);
          };
          place(r * PX);
          const val = s.h("p", { class: "h2 mono" }, "");
          const upd = () => { val.innerHTML = ""; val.append(s.h("span", { class: "blue" }, `r = ${r} cm`), "   →   ", s.h("span", { class: "red" }, `d = ${2 * r} cm`)); };
          upd();
          const sl = s.slider({ label: "Radius", min: 1, max: 5, value: r, fmt: v => v + " cm", onInput: v => { r = v; undraw(circle); arc.setAttribute("d", ""); s.show(circle, "fade"); place(r * PX); upd(); } });
          const formula = s.h("p", { class: "big later" }, "d = 2 · r", s.h("span", { class: "t pencil" }, "   und   r = d : 2"));
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("div", { class: "row", style: { flexWrap: "nowrap", gap: "14px", alignItems: "center" } },
              s.photo("fahrradrad", { w: 170, h: 210, caption: "Speichen", pos: "50% 45%", style: { flex: "none" } }),
              s.h("div", { class: "stack", style: { gap: "8px" } },
                s.h("p", { class: "small" }, "Die Speichen am Fahrrad sind Radien: Sie gehen alle von der Mitte zum Rand."),
                s.h("p", { class: "small" }, "Pizza mit d = 30 cm → r = 15 cm"),
                s.h("p", { class: "small" }, "Fernsehturm: Die Kugel hat d = 32 m, also r = 16 m."))));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "500px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, sl, val, formula, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.sfx.pop(); s.show(mDot, "pop"); await s.show(mLbl, "pop"); s.say("Das ist der Mittelpunkt M."); });
          s.step(async () => {
            s.show(rad, "fade"); s.show(rLbl, "fade"); s.say("Der Radius dreht sich einmal herum und zeichnet den Kreis.");
            const R = r * PX; let last = 0;
            await s.tween({ from: 0, to: 359.9, dur: 2200, ease: "inOut", update: v => {
              const a0 = RA, a1 = RA + v * Math.PI / 180;
              const x0 = cx + R * Math.cos(a0), y0 = cy - R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
              arc.setAttribute("d", `M${x0},${y0} A${R},${R} 0 ${v > 180 ? 1 : 0} 0 ${x1},${y1}`);
              place(R, a1);
              const now = performance.now(); if (now - last > 200) { last = now; s.sfx.tick(); }
            } });
            place(R); arc.setAttribute("d", ""); circle.classList.remove("later"); s.sfx.ding();
          });
          s.step(async () => { s.sfx.zap(); await s.show(dia, "draw"); undraw(dia); s.show(dLbl, "pop"); s.sfx.pop(); await s.show(formula, "up"); s.say("Der Durchmesser geht durch den Mittelpunkt von Rand zu Rand. Er ist doppelt so lang wie der Radius."); });
          s.step(async () => { s.sound("bike-bell", { vol: .6 }); await s.show(life, "up"); });
        },
      },
      /* 7 ─────────────────────────────── */
      {
        title: "Das Koordinatensystem",
        say: "Im Koordinatensystem hat jeder Punkt eine Adresse. Erst gehst du nach rechts, dann nach oben.",
        build(s) {
          const K = kosy(s);
          const { svg, X, Y } = K;
          let px = 4, py = 3;
          const hx = ln(s, X(0), Y(0), X(0), Y(0), { stroke: BLUE, "stroke-width": 6, class: "later" });
          const hy = ln(s, X(0), Y(0), X(0), Y(0), { stroke: RED, "stroke-width": 6, class: "later" });
          const walker = s.el("circle", { cx: X(0), cy: Y(0), r: 10, fill: ORANGE, class: "later" });
          const dot = s.el("circle", { cx: X(px), cy: Y(py), r: 12, fill: U, stroke: "#fff", "stroke-width": 3, class: "later" });
          const hit = s.el("circle", { cx: X(px), cy: Y(py), r: 30, fill: "transparent", class: "later" });
          const lab = tx(s, 0, 0, "", { class: "lbl later", "font-weight": 700, style: { fontSize: "22px" }, "text-anchor": "start" });
          svg.append(hx, hy, walker, dot, lab, hit);
          const big = s.h("p", { class: "huge mono", style: { fontSize: "64px" } });
          const setBig = () => { big.innerHTML = ""; big.append("P(", s.h("span", { class: "blue" }, String(px)), "|", s.h("span", { class: "red" }, String(py)), ")"); };
          const placeP = () => {
            dot.setAttribute("cx", X(px)); dot.setAttribute("cy", Y(py)); hit.setAttribute("cx", X(px)); hit.setAttribute("cy", Y(py));
            hx.setAttribute("x1", X(0)); hx.setAttribute("y1", Y(0)); hx.setAttribute("x2", X(px)); hx.setAttribute("y2", Y(0));
            hy.setAttribute("x1", X(px)); hy.setAttribute("y1", Y(0)); hy.setAttribute("x2", X(px)); hy.setAttribute("y2", Y(py));
            const flip = px >= 8;
            lab.textContent = `P(${px}|${py})`;
            lab.setAttribute("text-anchor", flip ? "end" : "start");
            lab.setAttribute("x", X(px) + (flip ? -16 : 16)); lab.setAttribute("y", Y(py) - (py >= 7 ? -34 : 16));
            setBig();
          };
          placeP();
          s.drag(hit, { space: svg, onMove: p => {
            const nx = clamp(Math.round((p.x - K.ox) / K.u), 0, 10), ny = clamp(Math.round((K.oy - p.y) / K.u), 0, 8);
            if (nx !== px || ny !== py) { px = nx; py = ny; placeP(); s.sfx.tick(); }
          } });
          const merk = s.h("div", { class: "merk later" }, "Erst nach ", s.h("b", { class: "blue" }, "rechts"), " (x-Wert), dann nach ", s.h("b", { class: "red" }, "oben"), " (y-Wert). Der Punkt O(0|0) heißt ", s.h("b", null, "Ursprung"), ".");
          const life = s.h("div", { class: "life later" }, s.h("span", { class: "exlabel" }, "Im Alltag"),
            s.h("p", { class: "small" }, "Schiffe versenken: Feld B5"), s.h("p", { class: "small" }, "Kino: Reihe 7, Platz 12"), s.h("p", { class: "small" }, "Minecraft: Koordinaten zeigen, wo du bist"));
          const hint = s.h("p", { class: "small pencil later" }, "Zieh den grünen Punkt herum!");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "570px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, big, hint, merk, life)));
          big.classList.add("later");
          s.sfx.whoosh(); s.show(K.grid, "fade");
          s.step(async () => { s.sfx.zap(); s.show(K.axes, "fade"); s.show(K.nums, "fade"); await s.show(K.names, "pop"); s.say("Die x-Achse geht nach rechts, die y-Achse nach oben."); });
          s.step(async () => {
            s.show(walker, "pop"); s.show(big, "up"); s.say("P vier drei: vier nach rechts, drei nach oben.");
            hx.classList.remove("later"); hy.setAttribute("y2", Y(0));
            for (let i = 1; i <= px; i++) { await s.tween({ from: X(i - 1), to: X(i), dur: 260, update: v => { walker.setAttribute("cx", v); hx.setAttribute("x2", v); } }); s.sfx.count(i - 1); }
            hy.classList.remove("later");
            for (let j = 1; j <= py; j++) { await s.tween({ from: Y(j - 1), to: Y(j), dur: 260, update: v => { walker.setAttribute("cy", v); hy.setAttribute("y2", v); } }); s.sfx.count(px + j - 1); }
            s.hide(walker); placeP(); s.sfx.ding(); s.show(dot, "pop"); s.show(hit, "fade"); await s.show(lab, "pop");
          });
          s.step(async () => { s.sfx.pop(); s.show(hint, "fade"); await s.show(merk, "up"); });
          s.step(async () => { s.sfx.success(); await s.show(life, "up"); });
        },
      },
      /* 8 ─────────────────────────────── */
      {
        title: "Figuren zeichnen mit Punkten",
        say: "Erst setzen wir die Punkte, dann verbinden wir sie der Reihe nach. So entsteht eine Figur.",
        build(s) {
          const K = kosy(s);
          const { svg, X, Y } = K;
          const fig = s.el("g"); svg.append(fig);
          const pen = makePen(s); svg.append(pen.g); pen.put(X(11), Y(9));
          const FIGS = {
            "Rechteck": { col: BLUE, pts: [["A", 1, 1], ["B", 7, 1], ["C", 7, 4], ["D", 1, 4]] },
            "Haus": { col: RED, pts: [["A", 2, 1], ["B", 8, 1], ["C", 8, 5], ["D", 5, 8], ["E", 2, 5]] },
            "Drachen": { col: VIOLET, pts: [["A", 5, 1], ["B", 8, 5], ["C", 5, 7], ["D", 2, 5]] },
          };
          const list = s.h("div", { class: "row", style: { gap: "10px", minHeight: "92px", alignContent: "flex-start" } });
          let busy = false;
          async function draw(name) {
            if (busy) return; busy = true;
            const F = FIGS[name];
            btns.forEach(b => b.classList.toggle("solid", b.textContent === name));
            fig.textContent = ""; list.textContent = "";
            const chips = F.pts.map(([n, x, y]) => { const c = s.h("span", { class: "chip later", style: { fontSize: "21px" } }, `${n}(${x}|${y})`); list.append(c); return c; });
            const cxm = F.pts.reduce((a, p) => a + p[1], 0) / F.pts.length, cym = F.pts.reduce((a, p) => a + p[2], 0) / F.pts.length;
            const fill = pg(s, F.pts.map(p => [X(p[1]), Y(p[2])]), { fill: F.col, "fill-opacity": .14, stroke: "none", class: "later" });
            fig.append(fill);
            for (let i = 0; i < F.pts.length; i++) {
              const [n, x, y] = F.pts[i];
              s.show(chips[i], "pop"); s.sfx.pop();
              await pen.move(X(x) - 7, Y(y) - 7, 380);
              const c1 = ln(s, 0, 0, 0, 0, { stroke: F.col, "stroke-width": 3.5, class: "later" }), c2 = ln(s, 0, 0, 0, 0, { stroke: F.col, "stroke-width": 3.5, class: "later" });
              fig.append(c1, c2);
              await pen.line(c1, X(x) - 7, Y(y) - 7, X(x) + 7, Y(y) + 7, 140);
              await pen.line(c2, X(x) + 7, Y(y) - 7, X(x) - 7, Y(y) + 7, 140);
              const dx = x - cxm, dy = -(y - cym), l = Math.hypot(dx, dy) || 1;
              const t = tx(s, X(x) + dx / l * 26, Y(y) + dy / l * 26 + 9, n, { class: "lbl later", "font-weight": 700, fill: F.col, style: { fontSize: "24px" } });
              fig.append(t); s.show(t, "pop");
            }
            s.sound("pencil-write", { vol: .5 });
            for (let i = 0; i < F.pts.length; i++) {
              const a = F.pts[i], b = F.pts[(i + 1) % F.pts.length];
              const L = ln(s, 0, 0, 0, 0, { stroke: F.col, "stroke-width": 4.5, class: "later" });
              fig.insertBefore(L, fig.children[1]);
              await pen.line(L, X(a[1]), Y(a[2]), X(b[1]), Y(b[2]), 420);
            }
            s.show(fill, "fade"); s.sfx.ding();
            await pen.move(X(9.6), Y(7.2), 400);
            busy = false;
          }
          const btns = Object.keys(FIGS).map(n => s.h("button", { class: "btn", onclick: () => { s.sfx.click(); draw(n); } }, n));
          const merk = s.h("div", { class: "merk" }, "1. Punkte eintragen: ", s.h("b", null, "erst x, dann y"), ".", s.h("br"), "2. Der Reihe nach verbinden – und zum Schluss zurück zum ersten Punkt.");
          const life = s.h("div", { class: "life later" }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "So zeichnen auch Computer, Spielekonsolen und Navis ihre Bilder – Punkt für Punkt."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "570px 1fr", alignItems: "center", height: "100%" } }, svg,
            s.h("div", { class: "stack" }, s.h("div", { class: "row" }, btns), list, merk, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Ein Rechteck aus vier Punkten."); await draw("Rechteck"); });
          s.step(async () => { s.say("Ein Haus aus fünf Punkten."); await draw("Haus"); });
          s.step(async () => { s.say("Und ein Drachen!"); await draw("Drachen"); s.sfx.success(); await s.show(life, "up"); });
        },
      },
      /* 9 ─────────────────────────────── */
      {
        title: "Aus einem Netz wird ein Würfel",
        say: "Ein Würfelnetz besteht aus sechs Quadraten. Wenn man es faltet, entsteht ein Würfel.",
        build(s) {
          const W = 560, H = 560;
          const { canvas, g } = s.canvas(W, H);
          const net = makeNet(cells([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], [2, 3, 1, 4, 6, 5]), 2);
          const st = netView(net, W, H);
          let t = 0, drag = false, last = null;
          s.drag(canvas, { space: canvas, onStart: p => { drag = true; last = p; }, onMove: p => { st.yaw += (p.x - last.x) * 0.012; last = p; }, onEnd: () => { drag = false; } });
          s.loop((tt, dt) => { if (!drag && t > 0.99) st.yaw += dt * 0.5; drawNet(g, W, H, net, t, st); });
          const sl = s.slider({ label: "Falten", min: 0, max: 100, value: 0, fmt: v => v + " %", onInput: v => { t = v / 100; } });
          async function foldTo(target) {
            s.sfx.whoosh();
            const from = t;
            await s.tween({ from, to: target, dur: 1800 * Math.abs(target - from) + 100, ease: "inOut", update: v => { t = v; sl.input.value = Math.round(v * 100); sl.querySelector(".sl-top .mono").textContent = Math.round(v * 100) + " %"; } });
            t = target;
            if (target === 1) { s.sfx.snap(); await s.wait(120); s.sound("wuerfeln", { vol: .6 }); }
          }
          const b1 = s.h("button", { class: "btn solid", onclick: () => foldTo(1) }, "Falten"), b2 = s.h("button", { class: "btn", onclick: () => foldTo(0) }, "Aufklappen");
          const merk = s.h("div", { class: "merk later" }, "Ein Würfelnetz hat ", s.h("b", null, "6 Quadrate"), ". Beim Spielwürfel ergeben gegenüberliegende Seiten immer ", s.h("b", null, "7"), ": 1 + 6, 2 + 5, 3 + 4.");
          const life = s.h("div", { class: "life later" }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "Spielwürfel, Geschenkboxen und Papier-Minecraft-Blöcke werden genau so aus einem Netz gefaltet."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%" } }, s.h("div", { class: "nosw" }, canvas),
            s.h("div", { class: "stack" }, s.h("p", { class: "t" }, "Sechs Quadrate – mit Augen wie beim Spielwürfel. Schieb den Regler oder tippe auf „Falten“."), sl, s.h("div", { class: "row" }, b1, b2), merk, life)));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Wir falten!"); await foldTo(1); });
          s.step(async () => { s.sfx.ding(); await s.show(merk, "up"); s.say("Gegenüberliegende Seiten ergeben zusammen sieben."); });
          s.step(async () => { s.sfx.pop(); await s.show(life, "up"); });
        },
      },
      /* 10 ─────────────────────────────── */
      {
        title: "Netz-Labor: Was passt?",
        say: "Nicht jedes Netz aus sechs Quadraten wird ein Würfel. Probier es aus: Tippe ein Netz an.",
        build(s) {
          const W = 540, H = 560;
          const { canvas, g } = s.canvas(W, H);
          const NETS = [
            { name: "Kreuz", net: makeNet(cells([[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]]), 2), cube: true },
            { name: "Treppe", net: makeNet(cells([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]), 2), cube: true },
            { name: "3 und 3", net: makeNet(cells([[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]), 2), cube: true },
            { name: "Block", net: makeNet(cells([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]), 1), cube: true },
            { name: "Lange Reihe", net: makeNet(cells([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 0]]), 2), cube: true },
            { name: "Schuhkarton", net: makeNet(boxNet(), 0), cube: false },
          ];
          let cur = NETS[0], st = netView(cur.net, W, H), t = 0, drag = false, last = null, busy = false;
          s.drag(canvas, { space: canvas, onStart: p => { drag = true; last = p; }, onMove: p => { st.yaw += (p.x - last.x) * 0.012; last = p; }, onEnd: () => { drag = false; } });
          s.loop((tt, dt) => { if (!drag && t > 0.99) st.yaw += dt * 0.45; drawNet(g, W, H, cur.net, t, st); });
          const status = s.h("p", { class: "t", style: { minHeight: "100px" } }, "Tippe ein Netz an – es faltet sich von allein.");
          const thumbs = NETS.map(N => {
            const b = s.h("button", { class: "btn", style: { flexDirection: "column", padding: "6px 4px", gap: "2px", minHeight: "112px" }, onclick: () => run(N) }, netThumb(s, N.net, N.cube ? "#d4efe9" : null), s.h("span", { style: { fontSize: "19px" } }, N.name));
            N.btn = b; return b;
          });
          async function run(N) {
            if (busy) return; busy = true;
            s.sfx.click();
            thumbs.forEach(b => b.classList.toggle("solid", b === N.btn));
            cur = N; st = netView(N.net, W, H); t = 0;
            const bad = foldCheck(N.net); st.bad = bad;
            status.textContent = "Falten …";
            await s.wait(350); s.sfx.whoosh();
            await s.tween({ from: 0, to: 1, dur: 1700, update: v => { t = v; } });
            t = 1;
            if (bad.size) { s.sfx.boing(); status.innerHTML = ""; status.append(s.h("b", { class: "red" }, "Klappt nicht! "), "Zwei Flächen landen aufeinander (rot), und eine Seite bleibt offen."); }
            else { s.sfx.success(); status.innerHTML = ""; status.append(s.h("b", { class: "green" }, "Passt! "), N.cube ? "Daraus wird ein geschlossener Würfel." : "Ein Quader – wie ein Schuhkarton oder Tetra Pak."); }
            busy = false;
          }
          const merk = s.h("div", { class: "merk later", style: { fontSize: "22px" } }, "Es gibt genau ", s.h("b", null, "11"), " verschiedene Würfelnetze. Ein Quadernetz hat 3 Paare gleicher Rechtecke.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "540px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, s.h("div", { class: "nosw" }, canvas),
            s.h("div", { class: "stack", style: { gap: "14px" } }, s.h("div", { class: "cols3", style: { gap: "10px" } }, thumbs), status, merk)));
          s.show(canvas, "zoom"); s.sfx.whoosh();
          s.step(async () => { s.say("Die Treppe – passt sie?"); await run(NETS[1]); });
          s.step(async () => { s.say("Und dieser Block?"); await run(NETS[3]); });
          s.step(async () => { s.say("Ein Schuhkarton ist ein Quader. Auch er hat ein Netz."); await run(NETS[5]); s.sfx.ding(); await s.show(merk, "up"); });
        },
      },
      /* 11 ─────────────────────────────── */
      {
        title: "Schrägbild zeichnen",
        say: "Mit einem Schrägbild sieht ein Würfel auf Karopapier räumlich aus. Wir zeichnen ihn Schritt für Schritt.",
        build(s) {
          const C = 24, SW = 520, SH = 470;
          const svg = s.svg(SW, SH);
          svg.append(s.el("rect", { x: 0, y: 0, width: SW, height: SH, rx: 14, fill: "#fff", stroke: "#d6e2ea", "stroke-width": 2 }));
          const grid = s.el("g");
          for (let x = C; x < SW; x += C) grid.append(ln(s, x, 2, x, SH - 2, { stroke: "#cfdfe9", "stroke-width": 1.2 }));
          for (let y = C; y < SH; y += C) grid.append(ln(s, 2, y, SW - 2, y, { stroke: "#cfdfe9", "stroke-width": 1.2 }));
          const draw = s.el("g"), labels = s.el("g");
          const pen = makePen(s);
          svg.append(grid, draw, labels, pen.g); pen.put(SW + 40, 40);
          const KINDS = {
            "Würfel": { x0: 96, a: 8, b: 8, lab: ["4 cm", "4 cm", "4 cm"] },
            "Quader": { x0: 72, a: 10, b: 6, lab: ["5 cm", "3 cm", "4 cm"] },
          };
          let kind = "Würfel", done = 0, busy = false;
          const geo = () => {
            const k = KINDS[kind], y0 = 408, F = [[k.x0, y0], [k.x0 + k.a * C, y0], [k.x0 + k.a * C, y0 - k.b * C], [k.x0, y0 - k.b * C]];
            const B = F.map(([x, y]) => [x + 4 * C, y - 4 * C]);
            return { k, F, B };
          };
          const L = (o) => { const l = ln(s, 0, 0, 0, 0, Object.assign({ "stroke-width": 4, class: "later" }, o || {})); draw.append(l); return l; };
          async function stepDraw(n, fast) {
            const { k, F, B } = geo(), d = fast ? 260 : 520;
            items.forEach((it, i) => it.classList.toggle("on", i === n - 1));
            if (n === 1) {
              for (let i = 0; i < 4; i++) await pen.line(L({ stroke: BLUE }), F[i][0], F[i][1], F[(i + 1) % 4][0], F[(i + 1) % 4][1], d);
              const a = tx(s, (F[0][0] + F[1][0]) / 2, F[0][1] + 34, k.lab[0], { class: "lbl later", fill: BLUE, "font-weight": 700 });
              const b = tx(s, F[0][0] - 12, (F[0][1] + F[3][1]) / 2 + 7, k.lab[1], { class: "lbl later", fill: BLUE, "font-weight": 700, "text-anchor": "end" });
              labels.append(a, b); s.sfx.pop(); s.show([a, b], "pop");
            }
            if (n === 2) {
              const help = ln(s, F[1][0], F[1][1], F[1][0] + 70, F[1][1], { stroke: PENCIL, "stroke-width": 2, "stroke-dasharray": "4 5", class: "later" });
              const arc = pth(s, `M${F[1][0] + 36},${F[1][1]} A36,36 0 0 0 ${F[1][0] + 36 * Math.SQRT1_2},${F[1][1] - 36 * Math.SQRT1_2}`, { stroke: ORANGE, "stroke-width": 3, class: "later" });
              const al = tx(s, F[1][0] + 46, F[1][1] - 6, "45°", { class: "lbl later", fill: ORANGE, "font-weight": 700, "text-anchor": "start" });
              labels.append(help, arc, al); s.show([help, arc, al], "fade");
              for (const i of [1, 2, 3]) await pen.line(L({ stroke: RED }), F[i][0], F[i][1], B[i][0], B[i][1], d);
              const mid = [(F[1][0] + B[1][0]) / 2, (F[1][1] + B[1][1]) / 2];
              const dl = tx(s, mid[0] + 24, mid[1] - 6, k.lab[2], { class: "lbl later", fill: RED, "font-weight": 700, "text-anchor": "start" });
              labels.append(dl); s.sfx.pop(); s.show(dl, "pop");
            }
            if (n === 3) { await pen.line(L({ stroke: GREEN }), B[3][0], B[3][1], B[2][0], B[2][1], d); await pen.line(L({ stroke: GREEN }), B[2][0], B[2][1], B[1][0], B[1][1], d); }
            if (n === 4) {
              const o = { stroke: PENCIL, "stroke-width": 3, "stroke-dasharray": "9 8" };
              await pen.line(L(o), F[0][0], F[0][1], B[0][0], B[0][1], d);
              await pen.line(L(o), B[0][0], B[0][1], B[1][0], B[1][1], d);
              await pen.line(L(o), B[0][0], B[0][1], B[3][0], B[3][1], d);
            }
            await pen.move(SW - 50, 150, 300);
            s.sfx.ding();
          }
          async function redo(name) {
            if (busy) return; busy = true; s.sfx.click(); kind = name;
            kb.forEach(b => b.classList.toggle("solid", b.textContent === name));
            draw.textContent = ""; labels.textContent = "";
            for (let n = 1; n <= Math.max(done, 1); n++) await stepDraw(n, true);
            done = Math.max(done, 1); busy = false;
          }
          const steps = ["Vorderfläche in wahrer Größe zeichnen.", "Kanten nach hinten: schräg im 45°-Winkel, quer durch die Kästchen. Für 1 cm nur 1 Kästchen-Diagonale – sie werden kürzer.", "Hintere Kanten zeichnen (parallel zur Vorderfläche).", "Verdeckte Kanten zeichnest du gestrichelt."];
          const cols = [BLUE, RED, GREEN, PENCIL];
          const items = steps.map((t, i) => s.h("div", { class: "row later", style: { flexWrap: "nowrap", alignItems: "flex-start", gap: "12px" } },
            s.h("span", { style: { flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: cols[i], color: "#fff", display: "grid", placeItems: "center", font: "700 21px var(--f-display)" } }, String(i + 1)),
            s.h("p", { class: "small", style: { fontSize: "20px" } }, t)));
          const kb = Object.keys(KINDS).map(n => s.h("button", { class: "btn" + (n === "Würfel" ? " solid" : ""), onclick: () => redo(n) }, n));
          const life = s.h("div", { class: "life later", style: { padding: "10px 16px" } }, s.h("p", { class: "small" }, s.h("b", null, "Im Alltag: "), "So zeichnest du Schuhkartons, Kisten und Minecraft-Blöcke räumlich."));
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "520px 1fr", alignItems: "center", height: "100%", gap: "24px" } }, svg,
            s.h("div", { class: "stack", style: { gap: "12px" } }, s.h("div", { class: "row" }, kb), ...items, life)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          [1, 2, 3, 4].forEach(n => s.step(async () => {
            busy = true; s.show(items[n - 1], "left"); s.sound("pencil-write", { vol: .45 }); s.say(steps[n - 1]);
            await stepDraw(n, false); done = n; busy = false;
            if (n === 4) { s.sfx.success(); s.show(life, "up"); }
          }));
        },
      },
      /* 12 ─────────────────────────────── */
      {
        title: "Das Haus der Vierecke",
        say: "Im Haus der Vierecke wohnen alle Vierecke. Je weiter unten, desto mehr besondere Eigenschaften hat ein Viereck.",
        build(s) {
          const svg = s.svg(1100, 636);
          const NW = 336, NH = 78;
          const N = {
            Viereck: { x: 550, y: 4, prop: "4 Ecken, 4 Seiten", sh: [[6, 46], [62, 40], [52, 6], [14, 16]] },
            Trapez: { x: 290, y: 128, prop: "1 Paar parallele Seiten", sh: [[4, 46], [66, 46], [50, 8], [20, 8]] },
            Drachenviereck: { x: 810, y: 128, prop: "symmetrisch (Diagonale)", sh: [[35, 2], [62, 20], [35, 50], [8, 20]] },
            Parallelogramm: { x: 370, y: 252, prop: "2 Paar parallele Seiten", sh: [[4, 46], [50, 46], [66, 8], [20, 8]] },
            Rechteck: { x: 250, y: 376, prop: "4 rechte Winkel", sh: [[4, 10], [66, 10], [66, 46], [4, 46]] },
            Raute: { x: 760, y: 376, prop: "4 gleich lange Seiten", sh: [[35, 2], [64, 26], [35, 50], [6, 26]] },
            Quadrat: { x: 550, y: 500, prop: "alles zusammen!", sh: [[13, 6], [57, 6], [57, 50], [13, 50]] },
          };
          const E = [["Viereck", "Trapez"], ["Viereck", "Drachenviereck"], ["Trapez", "Parallelogramm"], ["Parallelogramm", "Rechteck"], ["Parallelogramm", "Raute"], ["Drachenviereck", "Raute"], ["Rechteck", "Quadrat"], ["Raute", "Quadrat"]];
          const house = s.el("g", { opacity: .9 });
          house.append(pth(s, "M550,2 L30,250 L30,630 L1070,630 L1070,250 Z", { stroke: "#9fd3c9", "stroke-width": 5, fill: "#f2faf8" }));
          svg.append(house);
          const edges = {};
          E.forEach(([a, b]) => { const A = N[a], B = N[b]; const l = ln(s, A.x, A.y + NH, B.x, B.y, { stroke: U, "stroke-width": 3.5, class: "later" }); edges[a + b] = l; svg.append(l); });
          const nodes = {};
          Object.entries(N).forEach(([name, d]) => {
            const outer = s.el("g", { transform: `translate(${d.x - NW / 2},${d.y})` });
            const g = s.el("g", { class: "later", style: { cursor: "pointer", transformBox: "fill-box", transformOrigin: "center" } });
            outer.append(g);
            const sh = pg(s, d.sh, { fill: "#a5ddd3", stroke: U, "stroke-width": 3 });
            const shg = s.el("g", { transform: "translate(14,13)" }); shg.append(sh);
            g.append(s.el("rect", { x: 0, y: 0, width: NW, height: NH, rx: 14, fill: "#fff", stroke: U, "stroke-width": 3 }), shg,
              s.el("text", { x: 96, y: 33, class: "lbl", "font-weight": 700, style: { fontSize: "23px" }, text: name }),
              s.el("text", { x: 96, y: 61, class: "lbl", fill: PENCIL, style: { fontSize: "19px" }, text: d.prop }));
            g.addEventListener("click", () => { s.sfx.note(Object.keys(N).indexOf(name) * 2); s.say(name + ": " + d.prop); shg.classList.remove("a-wiggle"); void shg.getBoundingClientRect(); shg.classList.add("a-pulse"); setTimeout(() => s.alive && shg.classList.remove("a-pulse"), 1300); });
            nodes[name] = g; svg.append(outer);
          });
          const note = s.el("g", { class: "later" });
          note.append(tx(s, 890, 524, "Jedes Quadrat ist", { class: "hlbl", fill: RED, style: { fontSize: "28px" } }), tx(s, 890, 556, "auch ein Rechteck", { class: "hlbl", fill: RED, style: { fontSize: "28px" } }), tx(s, 890, 588, "und eine Raute!", { class: "hlbl", fill: RED, style: { fontSize: "28px" } }));
          const note2 = s.el("g", { class: "later" });
          note2.append(tx(s, 950, 282, "Je weiter unten,", { class: "hlbl", fill: U, style: { fontSize: "28px" } }), tx(s, 950, 314, "desto mehr Eigenschaften!", { class: "hlbl", fill: U, style: { fontSize: "28px" } }));
          svg.append(note, note2);
          s.add(svg);
          s.show(nodes.Viereck, "pop"); s.sfx.whoosh();
          const lvl = async (names, es) => { es.forEach(e => { s.show(edges[e], "draw"); }); s.sfx.zap(); await s.wait(500); names.forEach((n, i) => { s.show(nodes[n], "pop", i * 150); s.sfx.pop(); }); await s.wait(500); };
          s.step(async () => { s.say("Trapez: ein Paar parallele Seiten. Drachenviereck: symmetrisch zu einer Diagonale."); await lvl(["Trapez", "Drachenviereck"], ["ViereckTrapez", "ViereckDrachenviereck"]); });
          s.step(async () => { s.say("Hat ein Trapez zwei Paar parallele Seiten, ist es ein Parallelogramm."); await lvl(["Parallelogramm"], ["TrapezParallelogramm"]); s.sfx.ding(); s.show(note2, "fade"); });
          s.step(async () => { s.say("Mit vier rechten Winkeln wird es ein Rechteck, mit vier gleich langen Seiten eine Raute."); await lvl(["Rechteck", "Raute"], ["ParallelogrammRechteck", "ParallelogrammRaute", "DrachenviereckRaute"]); });
          s.step(async () => { s.say("Ganz unten wohnt das Quadrat. Es hat alle Eigenschaften."); await lvl(["Quadrat"], ["RechteckQuadrat", "RauteQuadrat"]); s.sfx.fanfare(); s.show(note, "up"); s.confetti(590, 640, 70); });
        },
      },
      /* 13 ─────────────────────────────── */
      {
        title: "Vierecke verwandeln",
        say: "Schieb den Regler oder zieh an den Ecken. Der Name des Vierecks ändert sich, sobald sich seine Eigenschaften ändern.",
        build(s) {
          const W = 560, H = 520;
          const svg = s.svg(W, H);
          svg.append(s.el("rect", { x: 0, y: 0, width: W, height: H, rx: 16, fill: "#fff", stroke: "#d6e2ea", "stroke-width": 2 }));
          for (let x = 20; x < W; x += 20) svg.append(ln(s, x, 2, x, H - 2, { stroke: "#e2ecf2", "stroke-width": 1 }));
          for (let y = 20; y < H; y += 20) svg.append(ln(s, 2, y, W - 2, y, { stroke: "#e2ecf2", "stroke-width": 1 }));
          const KEY = [
            [[180, 160], [380, 160], [380, 360], [180, 360]],
            [[120, 180], [440, 180], [440, 340], [120, 340]],
            [[160, 180], [460, 180], [400, 340], [100, 340]],
            [[200, 180], [360, 180], [460, 340], [100, 340]],
            [[280, 120], [400, 240], [280, 420], [160, 240]],
            [[280, 100], [400, 260], [280, 420], [160, 260]],
            [[280, 120], [420, 260], [280, 400], [140, 260]],
          ];
          let pts = KEY[0].map(p => p.slice());
          const fill = s.el("polygon", { fill: "#dcf3ef", stroke: "none" });
          const sides = [0, 1, 2, 3].map(() => ln(s, 0, 0, 0, 0, { "stroke-width": 6 }));
          const marks = s.el("g");
          const lbls = ["A", "B", "C", "D"].map(n => tx(s, 0, 0, n, { class: "lbl", "font-weight": 700, style: { fontSize: "22px" } }));
          const handles = [0, 1, 2, 3].map(() => s.el("circle", { r: 13, fill: U, stroke: "#fff", "stroke-width": 3 }));
          const hits = [0, 1, 2, 3].map(() => s.el("circle", { r: 30, fill: "transparent" }));
          svg.append(fill, ...sides, marks, ...lbls, ...handles, ...hits);
          const name = s.h("p", { class: "big", style: { color: U, minHeight: "48px" } }, "");
          const facts = s.h("div", { class: "stack", style: { gap: "8px" } });
          let lastName = "";
          const len = v => Math.hypot(v[0], v[1]);
          function classify(p) {
            const sv = [0, 1, 2, 3].map(i => [p[(i + 1) % 4][0] - p[i][0], p[(i + 1) % 4][1] - p[i][1]]);
            const L = sv.map(len);
            if (Math.min(...L) < 1) return { name: "kein Viereck", sv, L, right: [], par: [false, false] };
            const cr = (a, b) => a[0] * b[1] - a[1] * b[0], dt = (a, b) => a[0] * b[0] + a[1] * b[1];
            const par = [Math.abs(cr(sv[0], sv[2])) / (L[0] * L[2]) < 0.012, Math.abs(cr(sv[1], sv[3])) / (L[1] * L[3]) < 0.012];
            const right = [0, 1, 2, 3].map(i => Math.abs(dt(sv[(i + 3) % 4], sv[i])) / (L[(i + 3) % 4] * L[i]) < 0.012);
            const eq = (a, b) => Math.abs(a - b) / Math.max(a, b) < 0.015;
            const allEq = eq(L[0], L[1]) && eq(L[1], L[2]) && eq(L[2], L[3]);
            const kite = (eq(L[0], L[1]) && eq(L[2], L[3])) || (eq(L[1], L[2]) && eq(L[3], L[0]));
            const segX = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
            let nm;
            if (segX(p[0], p[1], p[2], p[3]) || segX(p[1], p[2], p[3], p[0])) nm = "überschlagen – kein Viereck";
            else if (par[0] && par[1]) nm = right.every(Boolean) ? (allEq ? "Quadrat" : "Rechteck") : allEq ? "Raute" : "Parallelogramm";
            else if (par[0] || par[1]) nm = "Trapez";
            else if (kite) nm = "Drachenviereck";
            else nm = "allgemeines Viereck";
            const oppEq = eq(L[0], L[2]) && eq(L[1], L[3]);
            return { name: nm, sv, L, right, par, allEq, kite, oppEq };
          }
          function render() {
            fill.setAttribute("points", P(pts));
            const c = classify(pts);
            sides.forEach((l, i) => {
              const a = pts[i], b = pts[(i + 1) % 4];
              l.setAttribute("x1", a[0]); l.setAttribute("y1", a[1]); l.setAttribute("x2", b[0]); l.setAttribute("y2", b[1]);
              l.setAttribute("stroke", c.par[i % 2] ? (i % 2 ? ORANGE : BLUE) : INK);
            });
            marks.textContent = "";
            pts.forEach((p, i) => {
              if (!c.right[i]) return;
              const a = c.sv[(i + 3) % 4], b = c.sv[i], la = len(a), lb = len(b), k = 18;
              const u = [-a[0] / la * k, -a[1] / la * k], v = [b[0] / lb * k, b[1] / lb * k];
              marks.append(pth(s, `M${p[0] + u[0]},${p[1] + u[1]} L${p[0] + u[0] + v[0]},${p[1] + u[1] + v[1]} L${p[0] + v[0]},${p[1] + v[1]}`, { stroke: RED, "stroke-width": 2.5 }));
            });
            const cx = pts.reduce((a, p) => a + p[0], 0) / 4, cy = pts.reduce((a, p) => a + p[1], 0) / 4;
            pts.forEach((p, i) => {
              const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
              lbls[i].setAttribute("x", p[0] + dx / l * 32); lbls[i].setAttribute("y", p[1] + dy / l * 32 + 8);
              handles[i].setAttribute("cx", p[0]); handles[i].setAttribute("cy", p[1]); hits[i].setAttribute("cx", p[0]); hits[i].setAttribute("cy", p[1]);
            });
            if (c.name !== lastName) {
              lastName = c.name; name.textContent = c.name;
              name.classList.remove("a-pop"); void name.offsetWidth; name.classList.add("a-pop");
              if (/Viereck|kein/.test(c.name)) s.sfx.note(-5); else s.sfx.ding();
            }
            const np = c.par.filter(Boolean).length, nr = (c.right || []).filter(Boolean).length;
            facts.textContent = "";
            const row = (k, v, col) => s.h("div", { class: "row", style: { gap: "10px", flexWrap: "nowrap" } }, s.h("span", { class: "chip", style: { background: col, color: "#fff", minWidth: "190px" } }, k), s.h("span", { class: "t" }, v));
            facts.append(row("parallele Seiten", np === 2 ? "2 Paare" : np === 1 ? "1 Paar" : "keine", BLUE),
              row("rechte Winkel", String(nr), RED),
              row("Seitenlängen", c.allEq ? "alle 4 gleich" : c.oppEq ? "gegenüber gleich" : c.kite ? "2 Nachbar-Paare gleich" : "verschieden", U));
          }
          const setT = v => { const i = Math.min(5, Math.floor(v)), f = v - i; pts = KEY[i].map((p, k) => [p[0] + (KEY[i + 1][k][0] - p[0]) * f, p[1] + (KEY[i + 1][k][1] - p[1]) * f]); render(); };
          const sl = s.slider({ label: "Verwandeln", min: 0, max: 6, step: 0.05, value: 0, fmt: () => "", onInput: setT });
          hits.forEach((h, i) => s.drag(h, { space: svg, onMove: p => { const nx = clamp(Math.round(p.x / 20) * 20, 20, W - 20), ny = clamp(Math.round(p.y / 20) * 20, 20, H - 20); if (nx !== pts[i][0] || ny !== pts[i][1]) { pts[i] = [nx, ny]; s.sfx.tick(); render(); } } }));
          render();
          const hint = s.h("p", { class: "small pencil" }, "Zieh an den grünen Ecken – sie rasten auf dem Karo ein.");
          s.add(s.h("div", { class: "cols", style: { gridTemplateColumns: "560px 1fr", alignItems: "center", height: "100%" } }, svg, s.h("div", { class: "stack" }, name, facts, sl, hint)));
          s.show(svg, "zoom"); s.sfx.whoosh();
          const go = async (a, b, txt) => { s.say(txt); await s.tween({ from: a, to: b, dur: 1500 * (b - a), update: v => { sl.input.value = v; setT(v); } }); sl.input.value = b; setT(b); };
          s.step(() => go(0, 1, "Wir ziehen das Quadrat in die Breite: ein Rechteck."));
          s.step(() => go(1, 2, "Jetzt schieben wir es schief: ein Parallelogramm."));
          s.step(() => go(2, 3, "Nur noch ein Paar parallele Seiten: ein Trapez."));
          s.step(() => go(3, 5, "Über den Drachen wird es zur Raute."));
          s.step(async () => { await go(5, 6, "Und mit rechten Winkeln: wieder ein Quadrat!"); s.sfx.success(); });
        },
      },
      /* 14 ─────────────────────────────── */
      {
        title: "Im Alltag: Formen in Berlin",
        say: "In Berlin stecken überall Körper und Figuren: im Fernsehturm, im Reichstag, in Litfaßsäulen und Verkehrsschildern.",
        build(s) {
          const PW = 260, PH = 250, O = k => ({ stroke: U, "stroke-width": 7 * k, fill: "none", class: "later" });
          const lab = (text, fill) => s.h("span", { class: "chip later", style: { fontSize: "21px", background: fill || U, color: "#fff", alignSelf: "center" } }, text);
          const spots = [
            { fig: s.photo("fernsehturm", { w: PW, h: PH }), iw: 804, ih: 1400, view: [252, 448, 310, 298], name: "Kugel",
              shape: k => s.el("circle", Object.assign({ cx: 407, cy: 600, r: 62 }, O(k))) },
            { fig: s.photo("reichstagskuppel", { w: PW, h: PH }), iw: 700, ih: 394, view: [140, 0, 410, 394], name: "Halbkugel",
              shape: k => pth(s, "M140,170 A205,118 0 0 1 550,170 Z", O(k)) },
            { fig: s.photo("litfass-denkmal", { w: PW, h: PH }), iw: 700, ih: 464, view: [101, 12, 458, 440], name: "Zylinder",
              shape: k => pth(s, "M264,62 L264,428 A66,12 0 0 0 396,428 L396,62 M264,62 A66,12 0 0 1 396,62", O(k)) },
            { fig: s.photo("stoppschild", { w: PW, h: PH }), iw: 525, ih: 700, view: [0, 90, 343, 330], name: "Achteck",
              shape: k => pg(s, Array.from({ length: 8 }, (_, i) => { const a = (i + 0.5) * Math.PI / 4; return [115 + 89 * Math.cos(a), 242 + 89 * Math.sin(a)]; }), O(k)) },
          ];
          const ov = spots.map(sp => { const v = viewFig(s, sp.fig, sp.iw, sp.ih, sp.view, PW); const sh = sp.shape(v.k); v.ov.append(sh); return [sh, lab(sp.name)]; });
          const facts = [
            ["Fernsehturm", "368 m hoch. Die Kugel hat 32 m Durchmesser."],
            ["Reichstagskuppel", "Kuppel aus Glas – fast eine halbe Kugel."],
            ["Litfaßsäule", "Ein Zylinder. Seit 1855 in Berlin, erfunden von Ernst Litfaß."],
            ["Verkehrsschilder", "Stopp = Achteck, Vorfahrt gewähren = Dreieck, Vorfahrtstraße = Quadrat auf der Spitze."],
          ];
          const cards = facts.map(([h, t]) => s.h("div", { class: "life later", style: { padding: "12px 14px" } }, s.h("p", { class: "t", style: { fontWeight: 700, color: GREEN } }, h), s.h("p", { class: "small", style: { fontSize: "21px" } }, t)));
          const cols = spots.map((sp, i) => s.h("div", { class: "stack", style: { gap: "10px" } }, sp.fig, ov[i][1], cards[i]));
          s.add(s.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 260px)", gap: "20px", justifyContent: "center", alignItems: "start", alignContent: "center", height: "100%" } }, cols));
          spots.forEach((sp, i) => s.show(sp.fig, "up", i * 120)); s.sound("tram-bell", { vol: .45, dur: 3 });
          const snd14 = [() => s.sound("wind", { vol: .4, dur: 2.5 }), () => s.sfx.chord([0, 4, 7]), () => s.sfx.swoosh(), () => s.sound("traffic", { vol: .4, dur: 2.5 })];
          ov.forEach((group, i) => s.step(async () => {
            s.sfx.zap(); await s.show(group[0], "draw");
            snd14[i](); s.show(group[1], "pop"); await s.show(cards[i], "up"); s.say(facts[i][0] + ": " + facts[i][1]);
          }));
        },
      },
      /* 15 ─────────────────────────────── */
      {
        title: "Im Alltag: Spiel und Sport",
        say: "Auch beim Spielen und beim Sport stecken überall Körper und Figuren.",
        build(s) {
          const icon = {
            mine() {
              const svg = s.svg(120, 120), x = 18, y = 46, a = 58, dx = 32, dy = 28;
              svg.append(pg(s, [[x, y], [x + a, y], [x + a, y + a], [x, y + a]], { fill: "#8b5a2b", stroke: "#3b2410", "stroke-width": 2 }),
                pg(s, [[x, y], [x + dx, y - dy], [x + a + dx, y - dy], [x + a, y]], { fill: "#5cae3c", stroke: "#2a5a1a", "stroke-width": 2 }),
                pg(s, [[x + a, y], [x + a + dx, y - dy], [x + a + dx, y + a - dy], [x + a, y + a]], { fill: "#6e4520", stroke: "#3b2410", "stroke-width": 2 }),
                pg(s, [[x, y], [x + a, y], [x + a, y + 12], [x + 44, y + 18], [x + 30, y + 12], [x + 14, y + 20], [x, y + 12]], { fill: "#5cae3c", stroke: "none" }));
              [[26, 74], [52, 88], [36, 96], [62, 70]].forEach(([px, py]) => svg.append(s.el("rect", { x: px, y: py, width: 7, height: 7, fill: "#a0703f" })));
              return svg;
            },
            drachen() {
              const svg = s.svg(120, 120);
              svg.append(pg(s, [[56, 6], [92, 40], [56, 92], [20, 40]], { fill: "#ffd94a", stroke: INK, "stroke-width": 2.5 }),
                pg(s, [[56, 6], [92, 40], [56, 40]], { fill: "#e86a5a", stroke: "none" }), pg(s, [[56, 40], [20, 40], [56, 92]], { fill: "#e86a5a", stroke: "none" }),
                ln(s, 56, 6, 56, 92, { "stroke-width": 2 }), ln(s, 20, 40, 92, 40, { "stroke-width": 2 }),
                pth(s, "M56,92 Q70,100 62,108 Q54,116 72,118", { stroke: INK, "stroke-width": 2 }));
              return svg;
            },
          };
          const list = [
            ["Zauberwürfel", "Würfel", "Sieht aus wie 3 · 3 · 3 = 27 kleine Würfel.", "zauber"],
            ["Minecraft-Block", "Würfel", "Jeder Block ist 1 m · 1 m · 1 m groß.", "mine"],
            ["Kartons", "Quader", "Aufgeklappt ist ein Karton ein Quadernetz.", "tetra"],
            ["Fußball", "Kugel", "Genäht aus 12 Fünfecken und 20 Sechsecken.", "ball"],
            ["Getränkedose", "Zylinder", "Oben und unten ein Kreis – sie rollt geradeaus.", "dose"],
            ["Flugdrachen", "Drachenviereck", "Das Viereck hat seinen Namen vom Drachen!", "drachen"],
          ];
          const PHOTO = {
            zauber: () => s.photo("zauberwuerfel", { w: 130, h: 150 }),
            tetra: () => s.photo("kartons", { w: 130, h: 150 }),
            ball: () => s.photo("fussball", { w: 130, h: 150, pos: "50% 50%" }),
            dose: () => s.photo("getraenkedose", { w: 130, h: 150, pos: "50% 40%" }),
          };
          const cards = list.map(([n, k, f, ic], i) => {
            const svg = PHOTO[ic] ? PHOTO[ic]() : icon[ic]();
            return s.h("div", { class: "card later", style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "12px", alignItems: "center", padding: "12px 14px", cursor: "pointer" },
              onclick: () => { s.sfx.note(i * 2); svg.classList.remove("a-bounce"); void svg.getBoundingClientRect(); svg.classList.add("a-bounce"); } },
            svg, s.h("div", { class: "stack", style: { gap: "4px" } }, s.h("p", { class: "t", style: { fontWeight: 700 } }, n), s.h("span", { class: "chip", style: { alignSelf: "flex-start", background: "#dcf3ef", color: U } }, k), s.h("p", { class: "small" }, f)));
          });
          const merk = s.h("div", { class: "merk later" }, "Augen auf: In fast jedem Ding steckt ein Körper oder eine Figur!");
          s.add(s.h("div", { class: "stack", style: { height: "100%", justifyContent: "center", gap: "18px" } }, s.h("div", { class: "cols3", style: { gap: "16px" } }, cards), merk));
          s.show(cards[0], "up"); s.show(cards[1], "up", 150); s.sfx.whoosh();
          s.step(async () => { s.sound("ball-kick", { vol: .7 }); s.show(cards[2], "up"); await s.show(cards[3], "up", 150); s.say("Karton: ein Quader. Fußball: eine Kugel."); });
          s.step(async () => { s.sound("dose-oeffnen", { vol: .7 }); s.show(cards[4], "up"); await s.show(cards[5], "up", 150); s.say("Dose: ein Zylinder. Drachen: ein Drachenviereck."); });
          s.step(async () => { s.sfx.fanfare(); await s.show(merk, "up"); });
        },
      },
    ],
  });
})();
