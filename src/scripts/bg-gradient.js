// Fondo "mesh gradient" fluido y DINÁMICO sobre un <canvas> de baja resolución.
// - Poco rojo: glows concentrados (no un lavado) sobre el gris claro => el rojo no domina.
// - Movimiento EVIDENTE: orbitan rápido (~10-13s), "respiran" (pulso de tamaño) y derivan.
// - Un glow PERSIGUE el cursor (interacción clara) + todos acompañan al scroll.
// - Lienzo interno chico + upscale = sedoso y barato (cap ~33 fps). Respeta reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  const canvas = document.getElementById('bg-fx');
  if (!(canvas instanceof HTMLCanvasElement) || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // follow:true => persigue el cursor.  cw = cuánto lo arrastra el cursor.
  // ax/ay = amplitud de la órbita · fx/fy = velocidad · pr/pf = pulso de tamaño (respiración).
  const blobs = [
    { rgb: '205,51,51',   a: 0.20, r: 0.42, follow: true, fx: 0.7,  fy: 0.9,  phx: 0.0, phy: 1.0, oa: 0.06, pr: 0.10, pf: 0.5, phr: 0.0 },
    { rgb: '226,59,59',   a: 0.16, r: 0.44, ox: 0.80, oy: 0.26, ax: 0.26, ay: 0.22, fx: 0.95, fy: 0.70, phx: 0.5, phy: 2.0, cw: 0.14, pr: 0.13, pf: 0.55, phr: 0.0 },
    { rgb: '168,38,38',   a: 0.15, r: 0.46, ox: 0.24, oy: 0.76, ax: 0.24, ay: 0.26, fx: 0.70, fy: 1.05, phx: 2.4, phy: 0.6, cw: 0.12, pr: 0.14, pf: 0.65, phr: 1.5 },
    { rgb: '214,150,120', a: 0.11, r: 0.40, ox: 0.62, oy: 0.54, ax: 0.28, ay: 0.22, fx: 0.55, fy: 0.85, phx: 3.6, phy: 3.0, cw: 0.10, pr: 0.10, pf: 0.45, phr: 2.5 },
  ];

  let W = 0, H = 0;
  function resize() {
    const cap = 440;
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

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    for (const b of blobs) {
      let cx, cy;
      if (b.follow) {
        cx = (mx + Math.sin(t * b.fx + b.phx) * b.oa) * W;
        cy = (my + Math.cos(t * b.fy + b.phy) * b.oa) * H;
      } else {
        cx = (b.ox + Math.sin(t * b.fx + b.phx) * b.ax + (mx - 0.5) * b.cw) * W;
        cy = (b.oy + Math.cos(t * b.fy + b.phy) * b.ay + (my - 0.5) * b.cw + scrollN * 0.22) * H;
      }
      const pulse = 1 + Math.sin(t * b.pf + b.phr) * b.pr;
      const rad = b.r * W * pulse;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `rgba(${b.rgb},${b.a})`);
      g.addColorStop(0.5, `rgba(${b.rgb},${(b.a * 0.35).toFixed(3)})`);
      g.addColorStop(1, `rgba(${b.rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  paint(0); // primer fotograma sincrónico: nunca un flash en blanco
  if (reduce) return;

  let last = -999, hidden = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    if (now - last < 30) return; // ~33 fps
    last = now;
    mx += (tmx - mx) * 0.07; // el glow "imán" alcanza al cursor con suavidad
    my += (tmy - my) * 0.07;
    paint(now * 0.0006); // órbitas ~10-13 s: movimiento claramente perceptible
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
