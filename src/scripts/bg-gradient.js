// Fondo en DOS capas para máxima nitidez:
//  · #bg-fx  (baja resolución, upscale sedoso): AURORA — cintas de luz que cruzan y se ondulan.
//  · #fx-top (resolución real, crispy): PARTÍCULAS nítidas + ESTELA luminosa que sigue al cursor.
// Poco rojo, movimiento constante, e interacción que deslumbra. Respeta reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sprites cacheados (drawImage es nítido y barato).
// makeGlow = halo difuso (estela). makeDot = burbuja NÍTIDA: núcleo definido + halo suave.
function makeGlow(rgb) {
  const s = 64;
  const oc = document.createElement('canvas');
  oc.width = oc.height = s;
  const o = oc.getContext('2d');
  const g = o.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(0.28, `rgba(${rgb},0.5)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  o.fillStyle = g;
  o.fillRect(0, 0, s, s);
  return oc;
}
function makeDot(rgb) {
  const s = 80;
  const oc = document.createElement('canvas');
  oc.width = oc.height = s;
  const o = oc.getContext('2d');
  const g = o.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(0.38, `rgba(${rgb},0.92)`); // núcleo lleno => burbuja definida
  g.addColorStop(0.72, `rgba(${rgb},0.20)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  o.fillStyle = g;
  o.fillRect(0, 0, s, s);
  return oc;
}

function start() {
  const bg = document.getElementById('bg-fx');
  const top = document.getElementById('fx-top');
  if (!(bg instanceof HTMLCanvasElement) || !(top instanceof HTMLCanvasElement)) return;
  const bx = bg.getContext('2d');
  const tx = top.getContext('2d');
  if (!bx || !tx) return;

  // ---- AURORA (baja resolución) ----
  const ribbons = [
    { rgb: '205,51,51', a: 0.18, R: 0.62, sx: 1.7, sy: 0.34, angle: -0.16, y: 0.30, spd: 0.22, fr: 0.55, amp: 0.10, ph: 0.0, dir: 1 },
    { rgb: '168,38,38', a: 0.15, R: 0.66, sx: 1.8, sy: 0.30, angle: 0.13, y: 0.66, spd: 0.18, fr: 0.45, amp: 0.12, ph: 2.0, dir: -1 },
    { rgb: '226,59,59', a: 0.12, R: 0.55, sx: 1.6, sy: 0.30, angle: -0.06, y: 0.50, spd: 0.27, fr: 0.65, amp: 0.09, ph: 4.0, dir: 1 },
  ];
  let BW = 0, BH = 0;
  function resizeBg() {
    BW = Math.min(460, innerWidth);
    BH = Math.max(1, Math.round(BW * (innerHeight / innerWidth)));
    bg.width = BW; bg.height = BH;
  }

  // ---- CAPA NÍTIDA (resolución real) ----
  let dpr = 1, TW = 0, TH = 0;
  function resizeTop() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    TW = innerWidth; TH = innerHeight;
    top.width = Math.round(TW * dpr);
    top.height = Math.round(TH * dpr);
    tx.setTransform(dpr, 0, 0, dpr, 0, 0); // dibujamos en px CSS
  }
  resizeBg(); resizeTop();
  addEventListener('resize', () => { resizeBg(); resizeTop(); }, { passive: true });

  const spWarm = makeDot('250,245,240');
  const spRed = makeDot('233,86,80');
  const spTrail = makeGlow('233,76,66');

  // Partículas (burbujas nítidas): posición en 0..1, tamaño/alpha en px reales.
  const PARTS = 60;
  const parts = [];
  for (let i = 0; i < PARTS; i++) {
    const red = Math.random() < 0.26;
    parts.push({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 2.6 + 1.8,
      a: Math.random() * 0.4 + 0.5,
      twp: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.00004,
      vy: -(Math.random() * 0.00006 + 0.00002),
      sprite: red ? spRed : spWarm,
    });
  }

  // Cursor: objetivo (cx,cy), cabeza suavizada (hx,hy), estela y velocidad.
  let cx = innerWidth / 2, cy = innerHeight * 0.4;
  let hx = cx, hy = cy, speed = 0;
  let mx = 0.5, my = 0.4, tmx = 0.5, tmy = 0.4, scrollN = 0;
  const trail = [];
  addEventListener('pointermove', (e) => {
    cx = e.clientX; cy = e.clientY;
    tmx = e.clientX / innerWidth; tmy = e.clientY / innerHeight;
  }, { passive: true });
  function onScroll() {
    const docH = document.documentElement.scrollHeight - innerHeight;
    scrollN = docH > 0 ? scrollY / docH : 0;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function paintAurora(t) {
    bx.clearRect(0, 0, BW, BH);
    for (const rb of ribbons) {
      const rx = (0.5 + Math.sin(t * rb.spd + rb.ph) * 0.55 * rb.dir + (mx - 0.5) * 0.05) * BW;
      const ry = (rb.y + Math.sin(t * rb.fr + rb.ph) * rb.amp + (my - 0.5) * 0.05 + scrollN * 0.15) * BH;
      bx.save();
      bx.translate(rx, ry); bx.rotate(rb.angle); bx.scale(rb.sx, rb.sy);
      const R = rb.R * BW;
      const g = bx.createRadialGradient(0, 0, 0, 0, 0, R);
      g.addColorStop(0, `rgba(${rb.rgb},${rb.a})`);
      g.addColorStop(0.6, `rgba(${rb.rgb},${(rb.a * 0.3).toFixed(3)})`);
      g.addColorStop(1, `rgba(${rb.rgb},0)`);
      bx.fillStyle = g; bx.fillRect(-R, -R, 2 * R, 2 * R);
      bx.restore();
    }
  }

  function paintTop(t) {
    tx.clearRect(0, 0, TW, TH);
    // Partículas nítidas
    for (const p of parts) {
      const tw = 0.78 + 0.22 * Math.sin(t * p.tws + p.twp);
      const r = p.size * 1.7;
      tx.globalAlpha = Math.min(1, p.a * tw);
      tx.drawImage(p.sprite, p.x * TW - r, p.y * TH - r, r * 2, r * 2);
    }
    // Estela + cabeza del cursor (aditivo => glow luminoso)
    tx.globalCompositeOperation = 'lighter';
    for (let i = trail.length - 1; i >= 0; i--) {
      const tp = trail[i];
      const k = 1 - i / trail.length; // cabeza = 1, cola → 0
      const r = 5 + k * 15;
      tx.globalAlpha = 0.04 + k * 0.14;
      tx.drawImage(spTrail, tp.x - r, tp.y - r, r * 2, r * 2);
    }
    // Cabeza "apretando": crece con la velocidad + pulso suave
    const hr = 14 + Math.min(speed * 0.5, 44) + Math.sin(t * 4) * 2.5;
    tx.globalAlpha = Math.min(0.5, 0.16 + speed * 0.004);
    tx.drawImage(spTrail, hx - hr, hy - hr, hr * 2, hr * 2);
    tx.globalCompositeOperation = 'source-over';
    tx.globalAlpha = 1;
  }

  function step(dt) {
    const px = hx, py = hy;
    hx += (cx - hx) * 0.25; hy += (cy - hy) * 0.25;
    speed = Math.hypot(hx - px, hy - py);
    trail.unshift({ x: hx, y: hy });
    if (trail.length > 22) trail.pop();
    mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08;
    for (const p of parts) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 < 0.014 && d2 > 0.00001) { const f = (0.014 - d2) * 1.6; p.x += dx * f; p.y += dy * f; }
      if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); }
      if (p.x < -0.06) p.x = 1.06; else if (p.x > 1.06) p.x = -0.06;
    }
  }

  paintAurora(0); paintTop(0); // primer fotograma sincrónico
  if (reduce) return;

  let last = -999, hidden = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    if (now - last < 22) return; // ~45 fps: estela fluida
    const dt = last < 0 ? 16 : Math.min(now - last, 50);
    last = now;
    const t = now * 0.001;
    step(dt);
    paintAurora(t);
    paintTop(t);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
