// Movimiento del sitio:
// - Lenis: scroll suave premium (respeta prefers-reduced-motion).
// - [data-reveal] / [data-reveal-stagger]: .is-visible al entrar en viewport.
// - [data-countup]: cuenta de 0 a data-target al entrar en viewport.
// - [data-parallax]: desplazamiento suave según scroll (factor en el atributo).
// - #scroll-progress: barra roja de progreso de lectura.
import Lenis from 'lenis';

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

function initScrollFx() {
  const bar = document.getElementById('scroll-progress');
  const parallax = Array.from(document.querySelectorAll('[data-parallax]'));
  const orbs = Array.from(document.querySelectorAll('#bg-fx span'));
  const orbY = [0.14, -0.1, 0.08];
  const orbX = [0.05, -0.04, 0.06];

  function update() {
    const scroll = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${docH > 0 ? scroll / docH : 0})`;
    if (reduce) return;
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax || '0.12');
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * factor).toFixed(1)}px, 0)`;
    });
    // Orbes de fondo: se desplazan con el scroll (cada uno a su ritmo)
    orbs.forEach((orb, i) => {
      orb.style.transform = `translate3d(${(scroll * (orbX[i] ?? 0)).toFixed(1)}px, ${(scroll * (orbY[i] ?? 0.1)).toFixed(1)}px, 0)`;
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initSmoothScroll() {
  if (reduce) return;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anclas internas con scroll suave (#... y /#... en la misma página)
  document.querySelectorAll('a[href*="#"]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const hashIndex = href.indexOf('#');
    if (hashIndex < 0) return;
    const path = href.slice(0, hashIndex);
    if (path && path !== '/' && path !== location.pathname) return; // link a otra página
    const id = href.slice(hashIndex);
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -76 });
      history.pushState(null, '', id);
    });
  });
}

function init() {
  initReveal();
  initScrollFx();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
