// Movimiento del sitio:
// - El scroll es el NATIVO del navegador. Lo manejaba Lenis, que interceptaba la rueda
//   y la aceleraba: se sentia disparado. Al sacarlo, el "scroll-behavior: smooth" que ya
//   estaba en el CSS vuelve a aplicar y las anclas del menu siguen deslizando suave, con el
//   desfase del header resuelto por las clases scroll-mt-20 de cada seccion.
// - [data-reveal] / [data-reveal-stagger]: .is-visible al entrar en viewport.
// - [data-countup]: cuenta de 0 a data-target al entrar en viewport.
// - [data-parallax]: desplazamiento suave según scroll (factor en el atributo).
// - #scroll-progress: barra roja de progreso de lectura.
// - .marquee__track: las marquesinas (ver initMarquees).
//
// Cada página es una carga normal: este módulo corre una vez por página, con el DOM ya
// armado (los <script type="module"> son diferidos) y sin esperar a las imágenes.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Si el browser soporta scroll-driven animations, el parallax .sd-parallax lo hace CSS puro.
const sdSupported =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

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
    // threshold 0, NO 0.15. Con 0.15 el revelado dependía del ALTO del elemento: hay que
    // ver el 15% de su área, así que un contenedor mucho más alto que la pantalla nunca
    // llega. Paso de verdad en /novedades: la grilla mide 3.291px, al cargar se ve 420 y
    // eso es el 12,8% — por debajo del 15%, así que las 19 tarjetas quedaban invisibles
    // hasta scrollear. Con 0 alcanza que asome un píxel, y deja de importar cuán alto sea.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
  countTargets.forEach((el) => {
    if (!el.closest('[data-reveal], [data-reveal-stagger]')) observer.observe(el);
  });

  // Red de seguridad: al segundo y medio, lo que esté en pantalla y siga invisible se
  // muestra. Si el observer funcionó (el caso normal) no hace nada. Contenido > animación.
  window.setTimeout(() => {
    revealTargets.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  }, 1500);
}

// Barra de progreso de lectura + parallax por JS (donde no hay scroll-driven animations).
function initScrollFx() {
  const progressBar = document.getElementById('scroll-progress');
  const parallaxEls = reduce ? [] : Array.from(document.querySelectorAll('[data-parallax]')).filter(
    (el) => !(sdSupported && el.classList.contains('sd-parallax'))
  );
  const update = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${docH > 0 ? window.scrollY / docH : 0})`;
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax || '0.12');
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * factor).toFixed(1)}px, 0)`;
    });
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

// Marquesinas. Van por JS y no con @keyframes por dos cosas que el CSS no resuelve:
// - VELOCIDAD fija en px/s, la misma para todas. Un keyframe tiene DURACIÓN fija, así que
//   cada pista iba a otra velocidad según su ancho y había que recalibrarla a mano por
//   breakpoint cada vez que se agregaba un logo o una nota.
// - El recorrido se mide en cada cuadro. El -50% de un keyframe Safari (iPhone) lo resuelve
//   al arrancar, y si la pista crecía después (logos o fuentes que bajan tarde) los logos
//   quedaban trabados.
// La pista lleva el contenido DUPLICADO: al correrse media pista la vista es idéntica al
// inicio y el bucle no tiene costura. Se frena con el mouse encima o el foco adentro, solo
// con puntero real: en touch el :hover y el foco quedan pegados tras un tap.
// Con "reducir movimiento" no arranca y el CSS la deja deslizable a mano.
const VELOCIDAD = 60; // px por segundo
function initMarquees() {
  const pistas = Array.from(document.querySelectorAll('.marquee__track'));
  if (reduce || !pistas.length) return;
  const frenable = window.matchMedia('(hover: hover)').matches;
  const pos = new Map(pistas.map((p) => [p, 0]));
  let antes = performance.now();
  requestAnimationFrame(function cuadro(ahora) {
    const dx = (VELOCIDAD * Math.min(ahora - antes, 100)) / 1000; // tope: al volver de otra pestaña no salta
    antes = ahora;
    for (const p of pistas) {
      const mitad = p.scrollWidth / 2; // 0 si está oculta (la 2da fila de rubros en celular)
      if (!mitad || (frenable && (p.parentElement.matches(':hover') || p.contains(document.activeElement)))) continue;
      const x = (pos.get(p) + dx) % mitad;
      pos.set(p, x);
      p.style.transform = `translate3d(${p.classList.contains('marquee__track--reverse') ? x - mitad : -x}px, 0, 0)`;
    }
    requestAnimationFrame(cuadro);
  });
}

// Vibración háptica sutil en elementos con [data-haptic] (Android/Chrome; iOS lo ignora).
function initHaptics() {
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
function initSpotlight() {
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
// href del <a> lleve a la sección padre.
function bindVolver() {
  let interno = false;
  try {
    interno = !!document.referrer && new URL(document.referrer).origin === location.origin;
  } catch {}
  if (!interno || history.length < 2) return;
  document.querySelectorAll('a[data-volver]').forEach((a) => {
    a.addEventListener('click', (e) => {
      // Respetamos ctrl/cmd+clic y el botón del medio: ahí el usuario quiere otra pestaña.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      history.back();
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

// 'reveal-on' desarma la red de seguridad del <head> (la que muestra todo si este JS no llega).
document.documentElement.classList.add('reveal-on');

// Lo primero y aislado: el contenido tiene que aparecer aunque falle todo lo demás.
try {
  initReveal();
} catch (err) {
  console.error('[gg] initReveal falló; se muestra todo sin animación', err);
  document.documentElement.classList.add('sin-reveal');
}

// Cada init va aislado: ninguno puede dejar la página en blanco si tira una excepción.
for (const fn of [initScrollFx, initMarquees, initHaptics, initSpotlight, initCarouselDots, initMagnetic, bindVolver, initFooterAccordion]) {
  try {
    fn();
  } catch (err) {
    console.error(`[gg] ${fn.name} falló`, err);
  }
}
