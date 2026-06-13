// Orquesta el movimiento del sitio con un IntersectionObserver compartido + scroll:
// - [data-reveal] / [data-reveal-stagger]: .is-visible una vez al entrar en viewport.
// - [data-countup]: cuenta de 0 a data-target al entrar en viewport.
// - [data-parallax]: desplazamiento suave según scroll (factor en data-parallax).
// - #scroll-progress: barra roja de progreso de lectura.
// Respeta prefers-reduced-motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runCountUp(el) {
  const target = parseFloat(el.dataset.countup || '0');
  const suffix = el.dataset.suffix || '';
  const duration = 1300;
  if (reduce) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(eased * target)}${suffix}`;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = `${target}${suffix}`;
  }
  requestAnimationFrame(frame);
}

function initReveal() {
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  const countTargets = document.querySelectorAll('[data-countup]');

  if (reduce) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    countTargets.forEach(runCountUp);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        if (el.hasAttribute('data-countup')) runCountUp(el);
        el.querySelectorAll('[data-countup]').forEach(runCountUp);
        obs.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
  countTargets.forEach((el) => {
    if (!el.closest('[data-reveal], [data-reveal-stagger]')) observer.observe(el);
  });
}

function initScroll() {
  const bar = document.getElementById('scroll-progress');
  const parallax = Array.from(document.querySelectorAll('[data-parallax]'));
  if (reduce) return;

  let ticking = false;
  function update() {
    const scroll = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${docH > 0 ? scroll / docH : 0})`;
    parallax.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax || '0.1');
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-center * factor).toFixed(1)}px, 0)`;
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function init() {
  initReveal();
  initScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
