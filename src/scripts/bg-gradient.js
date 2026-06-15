// Fondo en DOS capas:
//  · #bg-fx  (baja resolución): AURORA — cintas de luz que cruzan y se ondulan.
//  · #fx-top (resolución real, nítido): BURBUJAS grandes + ESTALLIDOS al tocar el cursor.
// El cursor es un IMÁN: atrae las burbujas y además inclina la luz de la aurora hacia él.
// Poco rojo, movimiento constante. Respeta reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sprite cacheado: burbuja NÍTIDA (núcleo definido + halo). drawImage = nítido y barato.
function makeDot(rgb) {
  const s = 96;
  const oc = document.createElement('canvas');
  oc.width = oc.height = s;
  const o = oc.getContext('2d');
  const g = o.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(0.36, `rgba(${rgb},0.9)`);
  g.addColorStop(0.7, `rgba(${rgb},0.22)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  o.fillStyle = g;
  o.fillRect(0, 0, s, s);
  return oc;
}

// Sprite de cinta de aurora: el gradiente es invariante entre frames -> se cachea una sola vez
// (resolución fija; se escala al dibujar, imperceptible en la capa difusa de baja resolución).
function makeRibbonSprite(rgb, a) {
  const s = 256;
  const oc = document.createElement('canvas');
  oc.width = oc.height = s;
  const o = oc.getContext('2d');
  const g = o.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(0.6, `rgba(${rgb},${(a * 0.3).toFixed(3)})`);
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
  for (const rb of ribbons) rb.sprite = makeRibbonSprite(rb.rgb, rb.a); // cacheado una sola vez
  let BW = 0, BH = 0;
  function resizeBg() {
    BW = Math.min(460, innerWidth);
    BH = Math.max(1, Math.round(BW * (innerHeight / innerWidth)));
    bg.width = BW; bg.height = BH;
  }

  // ---- CAPA NÍTIDA (resolución real) ----
  let TW = 0, TH = 0;
  function resizeTop() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    TW = innerWidth; TH = innerHeight;
    top.width = Math.round(TW * dpr);
    top.height = Math.round(TH * dpr);
    tx.setTransform(dpr, 0, 0, dpr, 0, 0); // dibujamos en px CSS
  }
  resizeBg(); resizeTop();
  addEventListener('resize', () => { resizeBg(); resizeTop(); }, { passive: true });

  const spWarm = makeDot('250,245,240');
  const spRed = makeDot('233,86,80');

  // ---- Burbujas: pocas y grandes (radio en px). Base de flotación + velocidad de imán. ----
  const PARTS = 18;
  const parts = [];
  function spawn(p, fromBottom) {
    p.x = Math.random();
    p.y = fromBottom ? 1.08 + Math.random() * 0.1 : Math.random();
    p.size = Math.random() * 16 + 16;          // radio 16..32 px
    p.a = Math.random() * 0.24 + 0.42;          // 0.42..0.66
    p.twp = Math.random() * Math.PI * 2;
    p.tws = Math.random() * 0.6 + 0.4;
    p.bvx = (Math.random() - 0.5) * 0.00003;    // deriva base (norm/ms)
    p.bvy = -(Math.random() * 0.00004 + 0.00002);
    p.mvx = 0; p.mvy = 0;                        // velocidad por el imán
    p.red = Math.random() < 0.28;
  }
  for (let i = 0; i < PARTS; i++) { const p = {}; spawn(p, false); parts.push(p); }

  // ---- Fragmentos de estallido (px, vida corta) ----
  const frags = [];
  function explode(p) {
    const ex = p.x * TW, ey = p.y * TH;
    for (let i = 0; i < 14 && frags.length < 300; i++) {
      const ang = Math.random() * 6.2832;
      const spd = Math.random() * 0.18 + 0.06;  // px/ms
      frags.push({
        x: ex, y: ey,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        life: 1, size: p.size * 0.32 * (Math.random() * 0.6 + 0.6), red: p.red,
      });
    }
    spawn(p, true); // renace desde abajo (mantiene el conteo)
  }

  // ---- Cursor / imán ----
  let mx = 0.5, my = 0.4, tmx = 0.5, tmy = 0.4, scrollN = 0;
  addEventListener('pointermove', (e) => {
    tmx = e.clientX / innerWidth; tmy = e.clientY / innerHeight;
  }, { passive: true });
  function onScroll() {
    const docH = document.documentElement.scrollHeight - innerHeight;
    scrollN = docH > 0 ? scrollY / docH : 0;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const MAG_R = 0.30, MAG_R2 = MAG_R * MAG_R, PULL = 0.0000009, EXPLODE_R = 0.05;

  function step(dt) {
    mx += (tmx - mx) * 0.12; my += (tmy - my) * 0.12; // el imán reacciona rápido
    for (const p of parts) {
      const dx = mx - p.x, dy = my - p.y, d2 = dx * dx + dy * dy;
      if (d2 < MAG_R2) {
        const dist = Math.sqrt(d2) + 1e-4;
        if (dist < EXPLODE_R) { explode(p); continue; } // estalla al tocar el cursor
        const pull = (1 - dist / MAG_R) * PULL;
        p.mvx += (dx / dist) * pull * dt;
        p.mvy += (dy / dist) * pull * dt;
      }
      p.mvx *= 0.94; p.mvy *= 0.94; // fricción => las burbujas orbitan y se calman
      p.x += (p.bvx + p.mvx) * dt;
      p.y += (p.bvy + p.mvy) * dt;
      if (p.y < -0.12) spawn(p, true);
      if (p.x < -0.12) p.x = 1.12; else if (p.x > 1.12) p.x = -0.12;
    }
    for (let i = frags.length - 1; i >= 0; i--) {
      const f = frags[i];
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.vx *= 0.93; f.vy *= 0.93;
      f.life -= dt / 700;
      if (f.life <= 0) frags.splice(i, 1);
    }
  }

  function paintAurora(t) {
    bx.clearRect(0, 0, BW, BH);
    for (const rb of ribbons) {
      const baseX = 0.5 + Math.sin(t * rb.spd + rb.ph) * 0.55 * rb.dir;
      const baseY = rb.y + Math.sin(t * rb.fr + rb.ph) * rb.amp + scrollN * 0.15;
      const rx = (baseX + (mx - baseX) * 0.20) * BW; // la luz se inclina hacia el imán
      const ry = (baseY + (my - baseY) * 0.20) * BH;
      bx.save();
      bx.translate(rx, ry); bx.rotate(rb.angle); bx.scale(rb.sx, rb.sy);
      const R = rb.R * BW;
      bx.drawImage(rb.sprite, -R, -R, 2 * R, 2 * R); // sprite cacheado (sin reconstruir gradiente)
      bx.restore();
    }
  }

  function paintTop(t) {
    tx.clearRect(0, 0, TW, TH);
    for (const p of parts) {
      const tw = 0.8 + 0.2 * Math.sin(t * p.tws + p.twp);
      const r = p.size;
      tx.globalAlpha = Math.min(1, p.a * tw);
      tx.drawImage(p.red ? spRed : spWarm, p.x * TW - r, p.y * TH - r, r * 2, r * 2);
    }
    tx.globalCompositeOperation = 'lighter'; // estallidos = destello luminoso
    for (const f of frags) {
      const r = f.size * Math.max(f.life, 0.25);
      tx.globalAlpha = Math.max(0, f.life);
      tx.drawImage(f.red ? spRed : spWarm, f.x - r, f.y - r, r * 2, r * 2);
    }
    tx.globalCompositeOperation = 'source-over';
    tx.globalAlpha = 1;
  }

  paintAurora(0); paintTop(0); // primer fotograma sincrónico
  if (reduce) return;

  let last = -999, hidden = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (hidden) return;
    if (now - last < 22) return; // ~45 fps
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
