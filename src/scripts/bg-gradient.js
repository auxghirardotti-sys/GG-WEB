// Fondo "Aurora + bokeh": cintas de luz que cruzan la pantalla + partículas finas.
// - Poco rojo: cintas de baja opacidad sobre el gris claro; las partículas son casi neutras.
// - Aurora: 3 cintas alargadas que barren de lado a lado, se ondulan y se cruzan entre sí.
// - Partículas: ~55 motas suaves que flotan hacia arriba (vida constante y perceptible).
// - Reaccionan al cursor (las cintas lo siguen un poco; las partículas se apartan) y al scroll.
// - Lienzo interno chico + upscale = sedoso y barato (cap ~33 fps). Respeta reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  const canvas = document.getElementById('bg-fx');
  if (!(canvas instanceof HTMLCanvasElement) || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Cintas de aurora: R radio base · sx/sy estiran a "cinta" · spd barrido lateral · fr ondulación.
  const ribbons = [
    { rgb: '205,51,51', a: 0.18, R: 0.62, sx: 1.7, sy: 0.34, angle: -0.16, y: 0.30, spd: 0.22, fr: 0.55, amp: 0.10, ph: 0.0, dir: 1 },
    { rgb: '168,38,38', a: 0.15, R: 0.66, sx: 1.8, sy: 0.30, angle: 0.13, y: 0.66, spd: 0.18, fr: 0.45, amp: 0.12, ph: 2.0, dir: -1 },
    { rgb: '226,59,59', a: 0.12, R: 0.55, sx: 1.6, sy: 0.30, angle: -0.06, y: 0.50, spd: 0.27, fr: 0.65, amp: 0.09, ph: 4.0, dir: 1 },
  ];

  // Partículas (bokeh): la mayoría casi blancas/cálidas, unas pocas rojas. Posición en 0..1.
  const PARTS = 55;
  const parts = [];
  for (let i = 0; i < PARTS; i++) {
    const red = Math.random() < 0.28;
    parts.push({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 2.2 + 1.0,
      a: Math.random() * 0.16 + 0.05,
      vx: (Math.random() - 0.5) * 0.00004,
      vy: -(Math.random() * 0.00006 + 0.00002),
      rgb: red ? '226,59,59' : '245,239,233',
    });
  }

  let W = 0, H = 0;
  function resize() {
    const cap = 460;
    const vw = window.innerWidth, vh = window.innerHeight;
    W = Math.min(cap, vw);
    H = Math.max(1, Math.round(W * (vh / vw)));
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let tmx = 0.5, tmy = 0.4, mx = 0.5, my = 0.4, scrollN = 0;
  window.addEventListener('pointermove', (e) => {
    tmx = e.clientX / window.innerWidth;
    tmy = e.clientY / window.innerHeight;
  }, { passive: true });
  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    scrollN = docH > 0 ? window.scrollY / docH : 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function step(dt) {
    for (const p of parts) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      // el cursor aparta suavemente las motas cercanas
      const dx = p.x - mx, dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.016 && d2 > 0.00001) {
        const f = (0.016 - d2) * 1.4;
        p.x += dx * f; p.y += dy * f;
      }
      if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); }
      if (p.x < -0.06) p.x = 1.06;
      else if (p.x > 1.06) p.x = -0.06;
    }
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    // Aurora
    for (const rb of ribbons) {
      const cx = (0.5 + Math.sin(t * rb.spd + rb.ph) * 0.55 * rb.dir + (mx - 0.5) * 0.05) * W;
      const cy = (rb.y + Math.sin(t * rb.fr + rb.ph) * rb.amp + (my - 0.5) * 0.05 + scrollN * 0.15) * H;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rb.angle);
      ctx.scale(rb.sx, rb.sy);
      const R = rb.R * W;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      g.addColorStop(0, `rgba(${rb.rgb},${rb.a})`);
      g.addColorStop(0.6, `rgba(${rb.rgb},${(rb.a * 0.3).toFixed(3)})`);
      g.addColorStop(1, `rgba(${rb.rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-R, -R, 2 * R, 2 * R);
      ctx.restore();
    }
    // Bokeh
    for (const p of parts) {
      const px = p.x * W, py = p.y * H, rad = p.size * 2.4;
      const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
      g.addColorStop(0, `rgba(${p.rgb},${p.a})`);
      g.addColorStop(1, `rgba(${p.rgb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, 6.2832);
      ctx.fill();
    }
  }

  paint(0); // primer fotograma sincrónico: nunca un flash en blanco
  if (reduce) return;

  let last = -999, hidden = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    if (now - last < 30) return; // ~33 fps
    const dt = last < 0 ? 16 : Math.min(now - last, 60);
    last = now;
    mx += (tmx - mx) * 0.07;
    my += (tmy - my) * 0.07;
    step(dt);
    paint(now * 0.001); // t en segundos
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
