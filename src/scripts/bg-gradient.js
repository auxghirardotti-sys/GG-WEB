// Fondo "mesh gradient" fluido (estilo Stripe) sobre un <canvas> de baja resolución.
// - Blobs de rojo de marca ATENUADO + un cálido neutro => el rojo deja de ser protagonista.
// - Se desplazan solos (drift sinusoidal de período largo) => el degradado se mueve de lugar.
// - Reaccionan al cursor (con easing) y al scroll => interacción y profundidad que cautivan.
// - Lienzo interno chico + upscale suave = sedoso y barato (cap ~30 fps). Respeta reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  const canvas = document.getElementById('bg-fx');
  if (!(canvas instanceof HTMLCanvasElement) || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 3 rojos de marca suaves + 1 cálido neutro (terracota). Alpha bajo: presencia, no dominio.
  // ox/oy: centro base (0-1) · ax/ay: amplitud del vaivén · fx/fy: velocidad · phx/phy: fase.
  const blobs = [
    { rgb: '205,51,51',   a: 0.22, r: 0.56, ox: 0.20, oy: 0.18, ax: 0.16, ay: 0.12, fx: 0.62, fy: 0.45, phx: 0.0, phy: 1.3 },
    { rgb: '226,59,59',   a: 0.18, r: 0.46, ox: 0.82, oy: 0.28, ax: 0.14, ay: 0.16, fx: 0.50, fy: 0.70, phx: 2.1, phy: 0.4 },
    { rgb: '168,38,38',   a: 0.18, r: 0.52, ox: 0.32, oy: 0.80, ax: 0.18, ay: 0.13, fx: 0.80, fy: 0.55, phx: 3.4, phy: 2.2 },
    { rgb: '216,156,128', a: 0.16, r: 0.50, ox: 0.70, oy: 0.66, ax: 0.13, ay: 0.15, fx: 0.45, fy: 0.78, phx: 1.0, phy: 4.0 },
  ];

  let W = 0, H = 0;
  function resize() {
    const cap = 420; // ancho interno máx; el blur del upscale tapa la baja resolución
    const vw = window.innerWidth, vh = window.innerHeight;
    W = Math.min(cap, vw);
    H = Math.max(1, Math.round(W * (vh / vw)));
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Cursor (objetivo + posición suavizada) y scroll normalizado
  let tmx = 0.5, tmy = 0.42, mx = 0.5, my = 0.42, scrollN = 0;
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

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    for (const b of blobs) {
      const cx = (b.ox + Math.sin(t * b.fx + b.phx) * b.ax + (mx - 0.5) * 0.10) * W;
      const cy = (b.oy + Math.cos(t * b.fy + b.phy) * b.ay + (my - 0.5) * 0.10 + scrollN * 0.18) * H;
      const rad = b.r * W;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `rgba(${b.rgb},${b.a})`);
      g.addColorStop(0.55, `rgba(${b.rgb},${(b.a * 0.4).toFixed(3)})`);
      g.addColorStop(1, `rgba(${b.rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  paint(0); // primer fotograma sincrónico: nunca un flash en blanco antes del rAF
  if (reduce) return; // sin movimiento: queda el fotograma estático

  let last = -999, hidden = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    if (now - last < 33) return; // ~30 fps (suficiente para algo tan lento)
    last = now;
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;
    paint(now * 0.00016); // períodos ~50-80 s: muy lento, hipnótico, nada mareador
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
