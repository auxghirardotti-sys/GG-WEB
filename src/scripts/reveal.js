// Movimiento del sitio:
// - Lenis: scroll suave premium (respeta prefers-reduced-motion).
// - [data-reveal] / [data-reveal-stagger]: .is-visible al entrar en viewport.
// - [data-countup]: cuenta de 0 a data-target al entrar en viewport.
// - [data-parallax]: desplazamiento suave según scroll (factor en el atributo).
// - #scroll-progress: barra roja de progreso de lectura.
//
// Con View Transitions (ClientRouter) el módulo carga UNA vez y el DOM se swapea
// en cada navegación: los listeners de window/document se registran una sola vez
// y todo lo que apunta a elementos se re-consulta en cada astro:page-load.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Si el browser soporta scroll-driven animations, el parallax .sd-parallax lo hace CSS puro.
const sdSupported =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

let lenis = null;
let parallaxEls = [];
let progressBar = null;

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
        // Lo que ya quedó ARRIBA del viewport nunca vuelve a intersectar si el usuario sigue
        // bajando: pasa al recargar a media página o si scrolleó mientras cargaba. Se revela igual.
        const yaPaso = entry.boundingClientRect.bottom <= 0;
        if (!entry.isIntersecting && !yaPaso) return;
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

function updateScrollFx() {
  const scroll = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = `scaleX(${docH > 0 ? scroll / docH : 0})`;
  if (reduce) return;
  const vh = window.innerHeight;
  parallaxEls.forEach((el) => {
    const factor = parseFloat(el.dataset.parallax || '0.12');
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - vh / 2;
    el.style.transform = `translate3d(0, ${(-center * factor).toFixed(1)}px, 0)`;
  });
}

function initScrollFxOnce() {
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollFx();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function initSmoothScrollOnce() {
  if (reduce) return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Anclas internas con scroll suave (#... y /#... en la misma página).
// Los <a> son nuevos en cada navegación, así que se re-bindea por página.
function bindAnchors() {
  if (!lenis) return;
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

// Vibración háptica sutil en elementos con [data-haptic] (Android/Chrome; iOS lo ignora).
function initHapticsOnce() {
  if (reduce || !('vibrate' in navigator)) return;
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest('[data-haptic]')) navigator.vibrate(8);
    },
    { passive: true }
  );
}

// Puntos indicadores de carrusel: marcan la tarjeta visible al deslizar en mobile.
function initCarouselDots() {
  document.querySelectorAll('[data-carousel]').forEach((wrap) => {
    const track = wrap.querySelector('[data-carousel-track]');
    const dots = Array.from(wrap.querySelectorAll('[data-carousel-dot]'));
    if (!track || dots.length === 0) return;
    let ticking = false;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const idx = max > 4 ? Math.round((track.scrollLeft / max) * (dots.length - 1)) : 0;
      dots.forEach((d, i) => {
        d.classList.toggle('bg-brand', i === idx);
        d.classList.toggle('bg-line', i !== idx);
      });
    };
    track.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => { update(); ticking = false; });
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  });
}

// Spotlight: la luz de las tarjetas sigue el cursor (setea --mx/--my del CSS).
// Un solo listener delegado para todas las cards.
function initSpotlightOnce() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.addEventListener(
    'pointermove',
    (e) => {
      if (!(e.target instanceof Element)) return;
      const card = e.target.closest('.surface-card, .service-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true }
  );
}

// Botones magnéticos [data-magnetic]: se inclinan unos px hacia el cursor y vuelven solos.
function initMagnetic() {
  if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${(x * 8).toFixed(1)}px, ${(y * 6).toFixed(1)}px)`;
      },
      { passive: true }
    );
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

// Flecha "Volver": si venimos de otra página del sitio, retrocedemos en el historial —que es
// lo que uno espera: vuelve a donde estabas, con el scroll donde lo dejaste—. Si se entró
// directo (desde Google, un link compartido), no hay a dónde retroceder y dejamos que el
// href del <a> lleve a la sección padre. Se re-bindea por página: los <a> son nuevos en cada
// navegación con view transitions.
function bindVolver() {
  document.querySelectorAll('a[data-volver]').forEach((a) => {
    a.addEventListener('click', (e) => {
      // Respetamos ctrl/cmd+clic y el botón del medio: ahí el usuario quiere otra pestaña.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      // Con view transitions la navegación es pushState, así que document.referrer NO se
      // actualiza: mirarlo solo daría falsos negativos. Por eso contamos las páginas que
      // pasaron por initPage. Más de una = hubo navegación dentro del sitio y hay a dónde
      // volver. El referrer sirve igual para la navegación clásica (sin ClientRouter).
      let interno = paginasVistas > 1;
      if (!interno) {
        try {
          interno = !!document.referrer && new URL(document.referrer).origin === location.origin;
        } catch {
          interno = false;
        }
      }
      if (interno && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });
}

// Footer: en celular las columnas arrancan plegadas; en ≥640px siempre abiertas.
// El markup las trae con [open] para que sin JS se vea como antes (todo visible).
function initFooterAccordion() {
  const cols = document.querySelectorAll('.foot-col');
  if (!cols.length) return;
  const wide = window.matchMedia('(min-width: 640px)');
  const sync = () => cols.forEach((c) => { c.open = wide.matches; });
  sync();
  wide.addEventListener('change', sync);
}

// Se ejecuta en cada navegación (y en la carga inicial): re-consulta el DOM nuevo.
// En la carga inicial nos llaman dos veces (DOMContentLoaded y después astro:page-load),
// así que lleva guard. Con view transitions el guard se suelta antes de cada swap.
let paginaLista = false;
// Cuántas páginas pasaron por initPage en esta sesión. Sirve para saber si hay historial
// propio del sitio: con view transitions es la única señal fiable (ver bindVolver).
let paginasVistas = 0;
document.addEventListener('astro:before-swap', () => {
  paginaLista = false;
});

function initPage() {
  if (paginaLista) return;
  paginaLista = true;
  paginasVistas++;
  // El swap de las view transitions reemplaza los atributos de <html>, así que la clase 'js'
  // que puso el script inline del <head> se pierde en cada navegación interna: hay que reponerla
  // o el CSS deja de ocultar y se pierde el revelado. 'reveal-on' desarma la red del <head>.
  document.documentElement.classList.add('js', 'reveal-on');

  // Lo primero y aislado: el contenido tiene que aparecer aunque falle todo lo demás.
  try {
    initReveal();
  } catch (err) {
    console.error('[gg] initReveal falló; se muestra todo sin animación', err);
    document.documentElement.classList.add('sin-reveal');
  }

  progressBar = document.getElementById('scroll-progress');
  parallaxEls = Array.from(document.querySelectorAll('[data-parallax]')).filter(
    (el) => !(sdSupported && el.classList.contains('sd-parallax'))
  );
  for (const fn of [initCarouselDots, initFooterAccordion, initMagnetic, bindAnchors, bindVolver, updateScrollFx]) {
    try {
      fn();
    } catch (err) {
      console.error(`[gg] ${fn.name} falló`, err);
    }
  }
}

// Los listeners van ANTES de los init globales: si Lenis explota, el revelado igual queda enganchado.
// after-swap: en una navegación interna el DOM nuevo ya está en pantalla pero Astro todavía no
// corrió los <script> de la página entrante, y recién después emite page-load. Revelando en el
// swap no queda ni un frame de cuerpo vacío. El guard de initPage absorbe el disparo duplicado.
document.addEventListener('astro:after-swap', initPage);
document.addEventListener('astro:page-load', initPage);

// Cada init global va aislado: ninguno puede dejar la página en blanco si tira una excepción.
for (const fn of [initScrollFxOnce, initSmoothScrollOnce, initHapticsOnce, initSpotlightOnce]) {
  try {
    fn();
  } catch (err) {
    console.error(`[gg] ${fn.name} falló`, err);
  }
}

// El ClientRouter emite astro:page-load en cada view transition, pero en la CARGA INICIAL lo
// emite recién en window.load, que espera a que bajen todas las imágenes. Como el contenido
// arranca en opacity:0 hasta que lo revelamos, eso dejaba la página medio en blanco varios
// segundos (y para siempre si alguna imagen se colgaba). Arrancamos con el DOM listo.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPage);
else initPage();
