// Orquesta todo el movimiento del sitio con un único IntersectionObserver compartido:
// - [data-reveal] / [data-reveal-stagger]: agrega .is-visible una sola vez al entrar en viewport.
// - [data-countup]: cuenta de 0 a data-target al entrar en viewport.
// Respeta prefers-reduced-motion (muestra el estado final sin animar).

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runCountUp(el) {
  const target = parseFloat(el.dataset.countup || '0');
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  if (reduce) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = `${Math.round(eased * target)}${suffix}`;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = `${target}${suffix}`;
  }
  requestAnimationFrame(frame);
}

function init() {
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
  // Cifras sueltas que no estén dentro de un contenedor reveal
  countTargets.forEach((el) => {
    if (!el.closest('[data-reveal], [data-reveal-stagger]')) observer.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
