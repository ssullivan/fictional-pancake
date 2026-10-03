/* Learn Area & Surface Area (Grade 6 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* face colors: gold, cyan, pink, green, purple, orange */
const COLS = ["#ffc93c", "#7fe3ff", "#ff8ac4", "#5fe0a8", "#b69cff", "#ff9f5a"];
/* A coordinate plane from xmin..xmax by ymin..ymax, u pixels per unit, with pad around it. Returns P: X(x) and Y(y) (pixels),
   W and H (the picture's size), u, and drawing helpers that give markup: grid(), pts(list), poly(list, cls), line(a, b, cls),
   text(x, y, t, cls, dx, dy), rt(x, y, sx, sy) (a right-angle mark opening toward sx, sy), and svg(body, label).
   down:true draws y increasing downward (used for nets, to match the 3D view from the front) */
function plane({ xmin = 0, xmax, ymin = 0, ymax, u = 36, pad = 26, down = false }) {
  const X = (x) => pad + (x - xmin) * u,
    Y = (y) => (down ? pad + (y - ymin) * u : pad + (ymax - y) * u),
    W = (xmax - xmin) * u + 2 * pad,
    H = (ymax - ymin) * u + 2 * pad;
  const P = { X, Y, W, H, u };
  P.grid = () => {
    let markup = "";
    for (let i = xmin; i <= xmax; i++)
      markup += `<line class="gl" x1="${X(i)}" y1="${Y(ymin)}" x2="${X(i)}" y2="${Y(ymax)}"/>`;
    for (let j = ymin; j <= ymax; j++)
      markup += `<line class="gl" x1="${X(xmin)}" y1="${Y(j)}" x2="${X(xmax)}" y2="${Y(j)}"/>`;
    return markup;
  };
  P.pts = (list) => list.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");
  P.poly = (list, cls) => `<polygon class="${cls}" points="${P.pts(list)}"/>`;
  P.line = (a, b, cls) => `<line class="${cls}" x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}"/>`;
  P.text = (x, y, t, cls = "lbl", dx = 0, dy = 0) =>
    `<text class="${cls}" x="${X(x) + dx}" y="${Y(y) + dy}">${t}</text>`;
  P.rt = (x, y, sx = 1, sy = 1) =>
    `<polyline class="rt" points="${X(x + 0.35 * sx)},${Y(y)} ${X(x + 0.35 * sx)},${Y(y + 0.35 * sy)} ${X(x)},${Y(y + 0.35 * sy)}"/>`;
  P.svg = (body, label) =>
    `<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="${label}">${body}</svg>`;
  return P;
}
/* a height from a top point down to the base line y=0, extending the base [x0,x1] if the foot lands outside */
function heightMark(P, x, h, x0, x1) {
  let markup = "";
  if (x < x0) markup += P.line([x, 0], [x0, 0], "ext");
  if (x > x1) markup += P.line([x1, 0], [x, 0], "ext");
  return markup + P.line([x, h], [x, 0], "hgt") + P.rt(x, 0, x > (x0 + x1) / 2 ? -1 : 1);
}
/* a rectangle's corners, from (x0, y0) to (x1, y1). A net's faces are {poly: corners in the flat net, [x,y]; hinge: the edge
   shared with the parent; angle: how far the face turns at full fold (default 90°)}. */
const Rect = (x0, y0, x1, y1) => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
/* three.js, loading (a promise, started once) */
let threeLoading = null;
/* Load three.js and its orbit controls and label renderer (the import map has their URLs). Rejects when there's no WebGL, or
   after 10 seconds, so the caller can fall back to a drawing. */
function load3D() {
  if (threeLoading) return threeLoading;
  threeLoading = (async () => {
    /* test for WebGL on a canvas of our own, then give its context back */
    const canvas = document.createElement("canvas"),
      gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) throw new Error("no WebGL");
    const loseContext = gl.getExtension("WEBGL_lose_context");
    if (loseContext) loseContext.loseContext();
    const timeout = new Promise((_, no) => setTimeout(() => no(new Error("timed out")), 10000));
    const [THREE, orbit, css2d] = await Promise.race([
      Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
        import("three/addons/renderers/CSS2DRenderer.js"),
      ]),
      timeout,
    ]);
    return {
      THREE,
      OrbitControls: orbit.OrbitControls,
      CSS2DRenderer: css2d.CSS2DRenderer,
      CSS2DObject: css2d.CSS2DObject,
    };
  })();
  threeLoading.catch(() => {});
  return threeLoading;
}
/* A 3D stage in el's view (data-v): a scene, lights, a camera dist away that orbits the center, and text labels. Returns S:
   render(), frame(dist) (look from up and to the side, dist away), spin(dir) and tilt(dir) (turn by a step), dispose(), and
   before (a function run before each render), with THREE, scene, camera, controls, renderer, and view. */
function stage(el, three, dist) {
  const { THREE, OrbitControls, CSS2DRenderer } = three,
    view = Q(el)("v");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  view.prepend(renderer.domElement);
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = "labels3d";
  view.appendChild(labelRenderer.domElement);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a4870, 1.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.3);
  sun.position.set(4, 10, 6);
  scene.add(sun);
  const camera = new THREE.PerspectiveCamera(38, 4 / 3, 0.1, 1000),
    controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  const S = {
    THREE,
    scene,
    camera,
    controls,
    renderer,
    view,
    before: null,
    render() {
      if (S.before) S.before();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    },
    frame(d) {
      camera.position.copy(new THREE.Vector3(0.45, 0.68, 0.62).normalize().multiplyScalar(d));
      controls.target.set(0, 0, 0);
      controls.minDistance = d * 0.35;
      controls.maxDistance = d * 2.2;
      controls.update();
      S.render();
    },
    /* turn around the vertical axis by an eighth of a half turn */
    spin(dir) {
      const offset = camera.position
        .clone()
        .sub(controls.target)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), (dir * Math.PI) / 8);
      camera.position.copy(controls.target).add(offset);
      controls.update();
      S.render();
    },
    /* look from higher up (dir -1) or lower down (dir 1), as far as under the shape */
    tilt(dir) {
      const offset = camera.position.clone().sub(controls.target),
        spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.phi = Math.min(Math.PI - 0.15, Math.max(0.15, spherical.phi + (dir * Math.PI) / 6));
      camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
      controls.update();
      S.render();
    },
    dispose() {
      resizer.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  controls.addEventListener("change", () => S.render());
  /* keep the renderers and the camera's aspect matched to the view's size */
  const resizer = new ResizeObserver(() => {
    const w = view.clientWidth,
      h = view.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    S.render();
  });
  resizer.observe(view);
  const loadingNote = view.querySelector(".loading");
  if (loadingNote) loadingNote.remove();
  S.frame(dist);
  return S;
}
/* ---------- nets that fold in 3D (nets, prisms and pyramids) ---------- */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* the center of a polygon (the average of its corners) */
const cen = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
/* A net drawn flat: each face in its color (bright when counted), labeled with its size. tap: faces can be tapped (data-id). */
function netSvg(net, { counted = new Set(), labels = true, tap = false, maxW = 440, u = 40 } = {}) {
  const xs = net.faces.flatMap((f) => f.poly.map((p) => p[0])),
    ys = net.faces.flatMap((f) => f.poly.map((p) => p[1]));
  const xmin = Math.min(...xs),
    xmax = Math.max(...xs),
    ymin = Math.min(...ys),
    ymax = Math.max(...ys);
  const P = plane({ xmin, xmax, ymin, ymax, u: Math.min(u, maxW / (xmax - xmin)), pad: 14, down: true });
  let markup = "";
  /* the color's alpha: cc when counted, 4d when not */
  net.faces.forEach((f) => {
    markup += `<polygon class="nf${tap ? " tap" : ""}" data-id="${f.id}" points="${P.pts(f.poly)}" style="fill:${COLS[f.col % 6]}${counted.has(f.id) ? "cc" : "4d"}"/>`;
  });
  if (labels)
    net.faces.forEach((f) => {
      const [x, y] = cen(f.poly);
      markup += P.text(x, y, (counted.has(f.id) ? "✓ " : "") + f.dims, "lbl s");
    });
  return P.svg(markup, "A net: the flat pattern of a 3D shape");
}
/* Folding: every face sits in an inner group drawn in flat net coordinates. Its outer group turns
   around the hinge line, and children hang off the parent's inner group, so folds stack up.
   Returns {root, holder, nodes (by face id), list, setFold(t) (0 flat to 1 folded), check(), b0 and b1 (bounds flat and folded)}. */
function buildNet(THREE, net) {
  /* a net point [x, y] in 3D, lying flat (y becomes z) */
  const toVec = (p) => new THREE.Vector3(p[0], 0, p[1]);
  const root = new THREE.Group(),
    holder = new THREE.Group(),
    nodes = {},
    list = [];
  root.add(holder);
  for (const f of net.faces) {
    const outer = new THREE.Group(),
      inner = new THREE.Group();
    outer.add(inner);
    /* a child face turns about its hinge (from a to b), upward: sign picks the direction that lifts its center */
    let axis = null,
      sign = 1;
    if (f.parent) {
      const a = toVec(f.hinge[0]),
        b = toVec(f.hinge[1]);
      outer.position.copy(a);
      inner.position.copy(a).negate();
      axis = b.clone().sub(a).normalize();
      sign = toVec(cen(f.poly)).sub(a).applyAxisAngle(axis, 0.1).y > 0 ? 1 : -1;
      nodes[f.parent].inner.add(outer);
    } else holder.add(outer);
    const node = { f, outer, inner, axis, sign, angle: f.angle ?? Math.PI / 2 };
    nodes[f.id] = node;
    list.push(node);
  }
  const setFold = (t) => {
    for (const node of list)
      if (node.axis) node.outer.quaternion.setFromAxisAngle(node.axis, node.sign * node.angle * t);
  };
  /* a face's corners in world space, and the bounds of every face */
  const corners = (node) => node.f.poly.map((p) => node.inner.localToWorld(toVec(p)));
  const bbox = () => {
    root.updateMatrixWorld(true);
    const box = new THREE.Box3();
    list.forEach((node) => corners(node).forEach((p) => box.expandByPoint(p)));
    return box;
  };
  setFold(1);
  const b1 = bbox();
  setFold(0);
  const b0 = bbox();
  /* folded shape is closed when every edge meets exactly one other edge and no two faces land in the same spot */
  const check = () => {
    setFold(1);
    root.updateMatrixWorld(true);
    const faceCorners = list.map(corners),
      edges = [];
    faceCorners.forEach((pts, i) => pts.forEach((p, j) => edges.push({ i, a: p, b: pts[(j + 1) % pts.length] })));
    const same = (e, g) =>
      (e.a.distanceTo(g.a) < 1e-3 && e.b.distanceTo(g.b) < 1e-3) ||
      (e.a.distanceTo(g.b) < 1e-3 && e.b.distanceTo(g.a) < 1e-3);
    const edgesOk = edges.every((e) => edges.filter((g) => g !== e && g.i !== e.i && same(e, g)).length === 1);
    /* two faces overlap when their centers meet */
    const centers = faceCorners.map((pts) =>
        pts.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(pts.length),
      ),
      overlaps = [];
    for (let i = 0; i < centers.length; i++)
      for (let j = i + 1; j < centers.length; j++)
        if (centers[i].distanceTo(centers[j]) < 0.05) overlaps.push([list[i].f.id, list[j].f.id]);
    return { closed: edgesOk && !overlaps.length, overlaps };
  };
  return { root, holder, nodes, list, setFold, check, b0, b1 };
}
/* A net you can fold, turn, and tap. Falls back to a flat SVG net without WebGL.
   opts: fold (where it starts, 0 to 1), locked, slider (a fold slider and button), count (tap faces to add their areas),
   labels (false leaves off the sizes), onFolded (runs when it's fully folded). Returns api: t (the fold), mode ('3d' or 'flat'),
   ready (a promise), toggle(id), counted, setT(t), animateTo(t), check(), markBad(ids), setLocked(v), dispose(), stage, build. */
function solid3D(el, net, opts = {}) {
  const api = { t: opts.fold ?? 1, locked: !!opts.locked, disposed: false, mode: "loading" },
    counted = new Set();
  let cleanup = () => {},
    paint = () => {},
    applyLock = () => {};
  api.dispose = () => {
    api.disposed = true;
    cleanup();
  };
  api.setLocked = (v) => {
    api.locked = v;
    applyLock();
  };
  el.innerHTML = `<div class="view3d" data-v><p class="loading">Loading 3D…</p></div><div class="wrow" data-ctl></div>${opts.count ? '<div class="chips" data-chips></div>' : ""}<p class="readout" data-r></p>`;
  const q = Q(el);
  /* the readout and chips for the faces counted so far */
  const updCount = () => {
    if (!opts.count) return;
    const countedFaces = net.faces.filter((f) => counted.has(f.id)),
      total = countedFaces.reduce((s, f) => s + f.area, 0),
      faces = net.faces.length;
    q("r").innerHTML = !countedFaces.length
      ? "Tap a face (or a button) to add its area."
      : countedFaces.length === faces
        ? `<span class="ok">All ${faces} faces: ${countedFaces.map((f) => f.area).join(" + ")} = <b>${total}</b> square units. That’s the surface area!</span>`
        : `Faces counted: ${countedFaces.map((f) => f.area).join(" + ")} = <b>${total}</b> · ${faces - countedFaces.length} face${faces - countedFaces.length > 1 ? "s" : ""} left`;
    q("chips")
      .querySelectorAll("[data-id]")
      .forEach((b) => b.setAttribute("aria-pressed", counted.has(b.dataset.id)));
  };
  const toggle = (id) => {
    counted.has(id) ? counted.delete(id) : counted.add(id);
    updCount();
    paint();
  };
  api.toggle = toggle;
  api.counted = counted;
  if (opts.count) {
    q("chips").innerHTML = net.faces
      .map(
        (f) => `<button type="button" class="chip" data-id="${f.id}" aria-pressed="false">${f.name} ${f.dims}</button>`,
      )
      .join("");
    q("chips").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-id]");
      if (chip) toggle(chip.dataset.id);
    });
    updCount();
  }
  const done = (t) => {
    if (t >= 1 && opts.onFolded) opts.onFolded();
  };

  /* without WebGL: the flat net, with a Check it button standing in for folding */
  function initFlat() {
    api.mode = "flat";
    const draw = () => {
      q("v").outerHTML =
        `<div data-v><p class="note">The 3D view can’t load on this device, so here is the flat net. Each face appears once.</p><div class="fig">${netSvg(net, { counted, tap: opts.count, labels: opts.labels !== false })}</div></div>`;
    };
    paint = draw;
    draw();
    el.addEventListener("click", (e) => {
      const face = e.target.closest("polygon[data-id]");
      if (face && opts.count) toggle(face.dataset.id);
    });
    if (opts.onFolded) {
      q("ctl").innerHTML = `<button type="button" class="ghost-btn" data-fbtn>Check it</button>`;
      q("fbtn").onclick = () => done(1);
      applyLock = () => {
        q("fbtn").disabled = api.locked;
      };
      applyLock();
    }
    api.check = () => ({ closed: net.valid !== false, overlaps: [] });
    api.animateTo = (t) => done(t);
  }
  function init3D(three) {
    api.mode = "3d";
    const { THREE, CSS2DObject } = three,
      folding = buildNet(THREE, net);
    /* the net's size and center flat and folded; the camera fits the flat net (with a slider) or the folded shape */
    const flatSize = folding.b0.getSize(new THREE.Vector3()),
      foldedSize = folding.b1.getSize(new THREE.Vector3()),
      flatCenter = folding.b0.getCenter(new THREE.Vector3()),
      foldedCenter = folding.b1.getCenter(new THREE.Vector3());
    const world = stage(
      el,
      three,
      opts.slider
        ? Math.max(flatSize.x, flatSize.z) * 1.45 + 1.5
        : Math.max(foldedSize.x, foldedSize.y, foldedSize.z) * 2.3 + 1,
    );
    world.scene.add(folding.root);
    /* each face as a mesh (triangles fanned from its first corner) with a white outline and its size label */
    const meshes = [];
    folding.list.forEach((node) => {
      const f = node.f,
        pts = f.poly.map((p) => new THREE.Vector3(p[0], 0, p[1])),
        tri = [];
      for (let i = 1; i < pts.length - 1; i++) tri.push(pts[0], pts[i], pts[i + 1]);
      const geo = new THREE.BufferGeometry().setFromPoints(tri);
      geo.computeVertexNormals();
      node.mat = new THREE.MeshStandardMaterial({
        color: COLS[f.col % 6],
        side: THREE.DoubleSide,
        roughness: 0.75,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const mesh = new THREE.Mesh(geo, node.mat);
      mesh.userData.id = f.id;
      node.inner.add(mesh);
      meshes.push(mesh);
      node.inner.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0xf3f6fb }),
        ),
      );
      if (opts.labels !== false) {
        const div = document.createElement("div");
        div.className = "flabel";
        div.textContent = f.dims;
        const labelObj = new CSS2DObject(div),
          [cx, cy] = cen(f.poly);
        labelObj.position.set(cx, 0, cy);
        node.inner.add(labelObj);
        node.label = labelObj;
        node.ldiv = div;
      }
    });
    /* show a label only on the side of its face that points at the camera */
    const up = new THREE.Vector3(0, 1, 0),
      turn = new THREE.Quaternion();
    world.before = () => {
      if (opts.labels === false) return;
      folding.root.updateMatrixWorld(true);
      /* each face's center, and the middle of them all */
      const centers = folding.list.map((node) => {
        const P = node.f.poly.map((p) => node.inner.localToWorld(new THREE.Vector3(p[0], 0, p[1])));
        return P.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(P.length);
      });
      const mid = centers.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(centers.length);
      folding.list.forEach((node, i) => {
        /* the face's normal, turned to face up (mostly flat) or outward (mostly folded) */
        const normal = up.clone().applyQuaternion(node.inner.getWorldQuaternion(turn));
        if (api.t < 0.5 ? normal.y < 0 : normal.dot(centers[i].clone().sub(mid)) < 0) normal.negate();
        node.label.visible = normal.dot(world.camera.position.clone().sub(centers[i])) > 0;
      });
    };
    /* bad: faces to show in red; counted faces glow */
    let bad = new Set();
    paint = () => {
      folding.list.forEach((node) => {
        const on = counted.has(node.f.id);
        node.mat.color.set(bad.has(node.f.id) ? 0xff4d4d : COLS[node.f.col % 6]);
        node.mat.emissive.set(bad.has(node.f.id) ? 0xff3b3b : on ? COLS[node.f.col % 6] : 0x000000);
        node.mat.emissiveIntensity = bad.has(node.f.id) ? 0.5 : on ? 0.45 : 0;
        if (node.ldiv) {
          node.ldiv.textContent = (on ? "✓ " : "") + node.f.dims;
          node.ldiv.classList.toggle("on", on);
        }
      });
      world.render();
    };
    api.markBad = (ids) => {
      bad = new Set(ids);
      paint();
    };
    let raf = 0;
    /* fold to t, keeping the shape centered as it folds, and update the slider and button */
    const setT = (t) => {
      api.t = t;
      folding.setFold(t);
      folding.holder.position.lerpVectors(flatCenter, foldedCenter, t).negate();
      const slider = q("fold");
      if (slider) slider.value = Math.round(t * 100);
      const foldBtn = q("fbtn");
      if (foldBtn) foldBtn.textContent = t < 1 ? "Fold it" : "Unfold it";
      world.render();
    };
    api.setT = setT;
    /* fold to target smoothly (eased in and out, about 1.3 seconds for a full fold) */
    api.animateTo = (target) => {
      cancelAnimationFrame(raf);
      if (reduceMotion) {
        setT(target);
        return done(target);
      }
      const from = api.t,
        start = performance.now(),
        duration = 1300 * Math.abs(target - from) + 1;
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration),
          eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setT(from + (target - from) * eased);
        if (progress < 1) raf = requestAnimationFrame(step);
        else done(target);
      };
      raf = requestAnimationFrame(step);
    };
    api.check = () => {
      const result = folding.check();
      folding.setFold(api.t);
      world.render();
      return result;
    };
    q("ctl").innerHTML =
      (opts.slider
        ? `<label class="slider"><span>Net</span><input type="range" min="0" max="100" value="${Math.round(api.t * 100)}" data-fold aria-label="Fold amount"><span>Solid</span></label><button type="button" class="ghost-btn" data-fbtn>Fold it</button>`
        : "") +
      `<button type="button" class="ghost-btn" data-spin="-1" aria-label="Turn left">⟲</button><button type="button" class="ghost-btn" data-spin="1" aria-label="Turn right">⟳</button>`;
    q("ctl")
      .querySelectorAll("[data-spin]")
      .forEach((b) => (b.onclick = () => world.spin(+b.dataset.spin)));
    if (opts.slider) {
      q("fold").addEventListener("input", (e) => {
        cancelAnimationFrame(raf);
        setT(e.target.value / 100);
        if (+e.target.value === 100) done(1);
      });
      q("fbtn").onclick = () => api.animateTo(api.t < 1 ? 1 : 0);
      applyLock = () => {
        q("fold").disabled = api.locked;
        q("fbtn").disabled = api.locked;
      };
      applyLock();
    }
    const hint = document.createElement("p");
    hint.className = "hint3d";
    hint.textContent = opts.count ? "Drag to turn · tap a face" : "Drag to turn · pinch to zoom";
    world.view.appendChild(hint);
    /* tap = press and release without dragging */
    const ray = new THREE.Raycaster(),
      pointer = new THREE.Vector2();
    let down = null;
    const canvas = world.renderer.domElement;
    canvas.addEventListener("pointerdown", (e) => {
      down = [e.clientX, e.clientY];
    });
    canvas.addEventListener("pointerup", (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      down = null;
      const rect = canvas.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, (-(e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(pointer, world.camera);
      const hit = ray.intersectObjects(meshes, false)[0];
      if (hit && opts.count) toggle(hit.object.userData.id);
    });
    setT(api.t);
    paint();
    cleanup = () => {
      cancelAnimationFrame(raf);
      world.dispose();
    };
    api.stage = world;
    api.build = folding;
  }
  api.ready = load3D().then(
    (three) => {
      if (!api.disposed) init3D(three);
    },
    () => {
      if (!api.disposed) initFlat();
    },
  );
  return api;
}

/* ---------- a polyhedron (or a solid that isn't one) to turn and tap (polyhedra, prisms and pyramids) ---------- */
const PLURAL = { faces: "faces", edges: "edges", vertices: "vertices" },
  ONE = { faces: "face", edges: "edge", vertices: "vertex" };
/* shape: a solid from shared/solids.js (solidOf), or {curved: 'cylinder' | 'cone' | 'sphere' | 'open' | 'flat'}.
   opts.count: 'faces', 'edges', or 'vertices' to tap and count them. opts.point: mark one face, one edge, and one vertex.
   opts.bases: color the bases gold. opts.read(shape, api): the readout under the view.
   api.set(shape) swaps in another shape. Without WebGL it shows a drawing (solids.js) instead. */
function polyView(el, shape, opts = {}) {
  /* world: the 3D stage; three: the loaded library; group: the shape's meshes; hits: the edge and vertex tap targets */
  const api = { counted: new Set(), disposed: false };
  el.polyView = api;
  let world = null,
    three = null,
    group = null,
    hits = [],
    faceMeshes = [],
    paint = () => {};
  el.innerHTML = `<div class="view3d" data-v><p class="loading">Loading 3D…</p></div><div class="wrow" data-ctl></div><p class="readout" data-r></p>`;
  const q = Q(el),
    counting = opts.count;
  const total = () =>
    shape.curved ? 0 : { faces: shape.F.length, edges: shape.E.length, vertices: shape.V.length }[counting];
  const read = () => {
    if (opts.read) {
      q("r").innerHTML = opts.read(shape, api);
      return;
    }
    if (!counting) return;
    const n = api.counted.size,
      all = total();
    q("r").innerHTML =
      api.mode === "flat"
        ? `This ${shape.name} has <b>${all} ${PLURAL[counting]}</b>. Dashed lines are edges at the back.`
        : n === all
          ? `<span class="ok">All ${all} ${PLURAL[counting]} of the ${shape.name}!</span>`
          : `${n} ${n === 1 ? ONE[counting] : PLURAL[counting]} counted. <span class="dimline">Tap each one once. Turn the shape to find the ones at the back${counting === "faces" ? " and on the bottom" : ""}.</span>`;
  };
  api.set = (s) => {
    shape = s;
    api.counted.clear();
    if (world) build();
    else if (api.mode === "flat") flat();
    read();
  };
  /* without WebGL: a drawing of the shape */
  function flat() {
    api.mode = "flat";
    const pic = shape.curved
      ? shape.curved === "flat"
        ? `<svg viewBox="0 0 130 90" style="max-width:160px" role="img" aria-label="A flat hexagon"><polygon class="sd-face sd-base" points="30,15 100,15 125,45 100,75 30,75 5,45"/><polygon class="sd-edge" points="30,15 100,15 125,45 100,75 30,75 5,45"/></svg>`
        : curvedSvg(shape.curved)
      : solidSvg(shape, { dots: counting === "vertices", bases: opts.bases });
    q("v").outerHTML =
      `<div data-v><p class="note">The 3D view can’t load on this device, so here is a drawing.</p><div class="fig">${pic}</div></div>`;
  }
  const dispose = (o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) [].concat(o.material).forEach((m) => m.dispose());
  };
  /* (re)build the shape's meshes, edges, vertices, and tap targets in the stage */
  function build() {
    const THREE = three.THREE,
      { CSS2DObject } = three;
    if (group) {
      world.scene.remove(group);
      group.traverse((o) => {
        dispose(o);
        if (o.element) o.element.remove();
      });
    }
    group = new THREE.Group();
    hits = [];
    faceMeshes = [];
    const mat = (color, extra = {}) =>
      new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        roughness: 0.75,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        ...extra,
      });
    /* a text label at a point */
    const tag = (text, at) => {
      const div = document.createElement("div");
      div.className = "flabel on";
      div.textContent = text;
      const labelObj = new CSS2DObject(div);
      labelObj.position.copy(at);
      group.add(labelObj);
    };
    /* radius: how far the shape reaches from its center, for framing the camera */
    let radius = 1.6;
    /* a rod from a to b, r thick, for an edge */
    const UP = new THREE.Vector3(0, 1, 0),
      rod = (a, b, r, material) => {
        const along = b.clone().sub(a),
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, along.length(), 10), material);
        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(UP, along.normalize());
        return mesh;
      };
    const white = () => new THREE.MeshBasicMaterial({ color: 0xf3f6fb });
    if (shape.curved) {
      const curved = shape.curved,
        material = mat(COLS[1]);
      let geometry;
      if (curved === "cylinder") geometry = new THREE.CylinderGeometry(1.1, 1.1, 2.4, 48);
      else if (curved === "cone") geometry = new THREE.ConeGeometry(1.2, 2.6, 48);
      else if (curved === "sphere") geometry = new THREE.SphereGeometry(1.4, 48, 32);
      else if (curved === "flat") {
        const hexagon = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          hexagon[i ? "lineTo" : "moveTo"](1.5 * Math.cos(a), 1.5 * Math.sin(a));
        }
        geometry = new THREE.ShapeGeometry(hexagon);
        geometry.rotateX(-Math.PI / 2);
      } else geometry = new THREE.BoxGeometry(2.6, 1.4, 1.8);
      /* an open box leaves out its top face */
      const mesh = new THREE.Mesh(
        geometry,
        curved === "open"
          ? [material, material, new THREE.MeshBasicMaterial({ visible: false }), material, material, material]
          : curved === "flat"
            ? mat(COLS[0])
            : material,
      );
      group.add(mesh);
      /* white edges like the polyhedra's: rings where a curved side meets a flat base (a sphere has none), rods on straight edges */
      const ring = (r, y) => {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 8, 64), white());
        torus.rotation.x = Math.PI / 2;
        torus.position.y = y;
        group.add(torus);
      };
      if (curved === "cylinder") {
        ring(1.1, 1.2);
        ring(1.1, -1.2);
      } else if (curved === "cone") ring(1.2, -1.3);
      else if (curved !== "sphere") {
        const ends = new THREE.EdgesGeometry(geometry, 40).attributes.position;
        for (let i = 0; i < ends.count; i += 2)
          group.add(
            rod(
              new THREE.Vector3().fromBufferAttribute(ends, i),
              new THREE.Vector3().fromBufferAttribute(ends, i + 1),
              0.035,
              white(),
            ),
          );
      }
    } else {
      /* the vertices, centered top to bottom */
      const top = Math.max(...shape.V.map((p) => p[1])),
        V = shape.V.map((p) => new THREE.Vector3(p[0], p[1] - top / 2, p[2]));
      radius = Math.max(...V.map((v) => v.length()));
      /* each face as triangles fanned from its first corner, gold for a base when opts.bases; c is its center for tests */
      shape.F.forEach((face, faceIndex) => {
        const P = face.map((i) => V[i]),
          tri = [];
        for (let i = 1; i < P.length - 1; i++) tri.push(P[0], P[i], P[i + 1]);
        const geometry = new THREE.BufferGeometry().setFromPoints(tri);
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(geometry, mat(opts.bases && shape.bases.includes(faceIndex) ? COLS[0] : COLS[1]));
        mesh.userData = {
          kind: "faces",
          id: faceIndex,
          c: P.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(P.length),
        };
        group.add(mesh);
        faceMeshes.push(mesh);
      });
      /* edges and vertices in white; when counting them, a wider invisible tap target goes over each (show: the one it lights up) */
      const clear = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      shape.E.forEach(([i, j], edgeIndex) => {
        const edge = rod(V[i], V[j], 0.035, white());
        group.add(edge);
        if (counting === "edges") {
          const hit = rod(V[i], V[j], 0.16, clear);
          hit.userData = { kind: "edges", id: edgeIndex, show: edge, r0: 0.16 };
          group.add(hit);
          hits.push(hit);
        }
      });
      V.forEach((v, vertexIndex) => {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), white());
        ball.position.copy(v);
        group.add(ball);
        if (counting === "vertices") {
          const hit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), clear);
          hit.position.copy(v);
          hit.userData = { kind: "vertices", id: vertexIndex, show: ball, r0: 0.24 };
          group.add(hit);
          hits.push(hit);
        }
      });
      if (opts.point) {
        /* a side face, the edge along its top, and a vertex at the corner, each marked and named */
        const faceIndex = shape.F.length - 1,
          face = shape.F[faceIndex],
          P = face.map((i) => V[i]),
          mid = P.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(P.length);
        faceMeshes[faceIndex].material.color.set(COLS[2]);
        tag("face", mid);
        const edge =
          shape.E.find(
            ([i, j]) =>
              face.includes(i) &&
              face.includes(j) &&
              V[i].y === V[j].y &&
              V[i].y >= Math.max(...P.map((p) => p.y)) - 1e-6,
          ) || shape.E.find(([i, j]) => face.includes(i) && face.includes(j));
        group.add(rod(V[edge[0]], V[edge[1]], 0.07, new THREE.MeshBasicMaterial({ color: COLS[0] })));
        tag("edge", V[edge[0]].clone().add(V[edge[1]]).multiplyScalar(0.5).multiplyScalar(1.12));
        const corner = shape.kind === "pyramid" ? V[V.length - 1] : V[edge[1]],
          dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: COLS[3] }));
        dot.position.copy(corner);
        group.add(dot);
        tag("vertex", corner.clone().multiplyScalar(1.18));
      }
    }
    /* tap targets for edges and vertices: at least 45 pixels across on any screen, but less than half the shortest edge */
    if (!shape.curved) {
      const maxRadius =
        0.4 *
        Math.min(
          ...shape.E.map(([i, j]) => new THREE.Vector3(...shape.V[i]).distanceTo(new THREE.Vector3(...shape.V[j]))),
        );
      const at = new THREE.Vector3();
      world.before = () => {
        /* pixels per unit at distance 1 from the camera */
        const pixelsPerUnit = world.view.clientHeight / (2 * Math.tan((world.camera.fov * Math.PI) / 360));
        group.updateMatrixWorld(true);
        hits.forEach((hit) => {
          const r = Math.min(
              maxRadius,
              Math.max((22.5 * world.camera.position.distanceTo(hit.getWorldPosition(at))) / pixelsPerUnit, 0.16),
            ),
            scale = r / hit.userData.r0;
          if (hit.userData.kind === "vertices") hit.scale.setScalar(scale);
          else hit.scale.set(scale, 1, scale);
        });
      };
    }
    /* a quarter turn's worth of yaw, so no side of a prism starts out edge-on */
    if (!shape.curved) group.rotation.y = -0.45;
    world.scene.add(group);
    world.frame(radius * 3.3 + 1);
    paint();
  }
  /* light up what's counted: faces glow gold; edges and vertices turn gold and grow */
  paint = () => {
    if (!world) return;
    const on = (id) => api.counted.has(id);
    faceMeshes.forEach((mesh) => {
      if (counting === "faces") {
        mesh.material.emissive.set(on(mesh.userData.id) ? 0xffc93c : 0x000000);
        mesh.material.emissiveIntensity = on(mesh.userData.id) ? 0.55 : 0;
      }
    });
    hits.forEach((hit) => {
      hit.userData.show.material.color.set(on(hit.userData.id) ? 0xffc93c : 0xf3f6fb);
      hit.userData.show.scale.setScalar(on(hit.userData.id) ? 1.9 : 1);
    });
    world.render();
    read();
  };
  api.ready = load3D().then(
    (loaded) => {
      if (api.disposed) return;
      three = loaded;
      api.mode = "3d";
      world = stage(el, three, 6);
      const { THREE } = three;
      build();
      q("ctl").innerHTML =
        `<button type="button" class="ghost-btn" data-spin="-1" aria-label="Turn left">⟲</button><button type="button" class="ghost-btn" data-spin="1" aria-label="Turn right">⟳</button>` +
        `<button type="button" class="ghost-btn" data-tilt="-1" aria-label="Tilt to see the top">⤒</button><button type="button" class="ghost-btn" data-tilt="1" aria-label="Tilt to see the bottom">⤓</button>` +
        (counting ? `<button type="button" class="ghost-btn" data-clr>Start over</button>` : "");
      q("ctl")
        .querySelectorAll("[data-spin]")
        .forEach((b) => (b.onclick = () => world.spin(+b.dataset.spin)));
      q("ctl")
        .querySelectorAll("[data-tilt]")
        .forEach((b) => (b.onclick = () => world.tilt(+b.dataset.tilt)));
      if (counting)
        q("clr").onclick = () => {
          api.counted.clear();
          paint();
        };
      const hint = document.createElement("p");
      hint.className = "hint3d";
      hint.textContent = counting ? `Drag to turn · tap each ${ONE[counting]}` : "Drag to turn · pinch to zoom";
      world.view.appendChild(hint);
      /* a tap counts the face, edge, or vertex under it; an edge or vertex only counts if no face is in front of it */
      const ray = new THREE.Raycaster(),
        pointer = new THREE.Vector2(),
        canvas = world.renderer.domElement;
      let down = null;
      /* the id of what's under screen point (nx, ny), from −1 to 1 (null for nothing) */
      const under = (nx, ny) => {
        pointer.set(nx, ny);
        ray.setFromCamera(pointer, world.camera);
        const got = ray.intersectObjects([...faceMeshes, ...hits], false),
          face = got.find((h) => h.object.userData.kind === "faces"),
          want = got.find((h) => h.object.userData.kind === counting);
        return !want || (counting !== "faces" && face && want.distance > face.distance + 0.25)
          ? null
          : want.object.userData.id;
      };
      canvas.addEventListener("pointerdown", (e) => {
        down = [e.clientX, e.clientY];
      });
      canvas.addEventListener("pointerup", (e) => {
        if (!counting || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
        down = null;
        const rect = canvas.getBoundingClientRect(),
          id = under(((e.clientX - rect.left) / rect.width) * 2 - 1, (-(e.clientY - rect.top) / rect.height) * 2 + 1);
        if (id === null) return;
        api.counted.has(id) ? api.counted.delete(id) : api.counted.add(id);
        paint();
      });
      /* For tests (tests/learn-3d.spec.js): each face, edge, or vertex to count, where it is on the page, how big a target it is
       there (a radius in pixels, for edges and vertices), and whether a tap there counts it now. */
      api.targets = () => {
        group.updateMatrixWorld(true);
        const rect = canvas.getBoundingClientRect(),
          perPx = (d) => rect.height / (2 * d * Math.tan((world.camera.fov * Math.PI) / 360));
        return (counting === "faces" ? faceMeshes : hits).map((o) => {
          const p =
              counting === "faces" ? group.localToWorld(o.userData.c.clone()) : o.getWorldPosition(new THREE.Vector3()),
            v = p.clone().project(world.camera);
          return {
            id: o.userData.id,
            x: rect.left + ((v.x + 1) / 2) * rect.width,
            y: rect.top + ((1 - v.y) / 2) * rect.height,
            r: counting === "faces" ? null : o.userData.r0 * o.scale.x * perPx(world.camera.position.distanceTo(p)),
            tappable: under(v.x, v.y) === o.userData.id,
            counted: api.counted.has(o.userData.id),
          };
        });
      };
    },
    () => {
      if (!api.disposed) {
        flat();
        read();
      }
    },
  );
  read();
  api.dispose = () => {
    api.disposed = true;
    if (world) {
      group &&
        group.traverse((o) => {
          if (o.element) o.element.remove();
        });
      world.dispose();
    }
  };
  return api;
}
