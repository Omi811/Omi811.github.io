(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  const hero = document.querySelector('.hero');
  const track = document.querySelector('#highlight-track');
  const cards = Array.from(track.children);
  const dots = Array.from(document.querySelectorAll('[data-slide]'));
  const previous = document.querySelector('#gallery-prev');
  const next = document.querySelector('#gallery-next');
  const counter = document.querySelector('#gallery-count');
  let paused = reduced.matches, active = 0, animationFrame = 0;
  document.querySelector('#year').textContent = new Date().getFullYear();

  function setMotion() {
    if (reduced.matches) paused = true;
    document.body.classList.toggle('motion-paused', paused);
    motionButton.disabled = reduced.matches;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', reduced.matches ? 'Visual motion reduced by device preference' : paused ? 'Play visual motion' : 'Pause visual motion');
    motionButton.innerHTML = reduced.matches ? 'Reduced motion' : paused ? 'Play motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
    updateHero();
  }
  function updateHero() {
    animationFrame = 0;
    if (paused || reduced.matches || document.hidden) return;
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
    hero.style.setProperty('--hero-shift', `${Math.round(progress * 38)}px`);
    hero.style.setProperty('--hero-scale', String(1 - progress * .06));
  }
  window.addEventListener('scroll', () => {
    if (!animationFrame && !paused) animationFrame = window.requestAnimationFrame(updateHero);
  }, {passive:true});
  motionButton.addEventListener('click', () => { paused = !paused; setMotion(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; setMotion(); });

  function updateGallery() {
    const offset = track.scrollLeft;
    const first = cards[0].offsetLeft;
    active = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - first - offset) < Math.abs(cards[best].offsetLeft - first - offset) ? index : best, 0);
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
    const max = track.scrollWidth - track.clientWidth;
    previous.disabled = offset < 2;
    next.disabled = offset >= max - 2;
    counter.textContent = `${String(active + 1).padStart(2, '0')} / 05`;
  }
  function goTo(index) {
    const target = Math.max(0, Math.min(cards.length-1,index));
    track.scrollTo({left:cards[target].offsetLeft-cards[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
  }
  previous.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
  track.addEventListener('scroll', updateGallery, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  new ResizeObserver(updateGallery).observe(track);
  updateGallery(); setMotion();
})();
