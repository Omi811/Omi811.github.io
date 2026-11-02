(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 700px)');
  const sections = [...document.querySelectorAll('.hero, .project, .engineering, .next')];
  const reveals = [...document.querySelectorAll('.project-heading, .engineering .section-top, .approach h2, .next .section-top, .connect h2')];
  const displays = [...document.querySelectorAll('.product-display')];
  const navigation = document.querySelector('.local-nav');
  const descriptor = document.querySelector('.local-descriptor');
  const active = new Set();
  const seen = new WeakSet();
  const animations = new Set();
  let frame = 0;
  const enabled = () => !preference.matches && !document.body.classList.contains('motion-paused');
  const clamp = value => Math.max(0, Math.min(1, value));

  function clearMotion() {
    for (const animation of animations) animation.cancel();
    animations.clear();
    for (const display of displays) {
      display.style.removeProperty('--display-y');
      display.style.removeProperty('--display-scale');
      display.style.removeProperty('--display-tilt');
    }
    document.querySelector('.hero-sculpture').style.removeProperty('--sculpture-turn');
  }

  function render() {
    frame = 0;
    if (document.hidden) return;
    const height = window.innerHeight;
    const measurements = [...active].map(section => {
      const box = section.getBoundingClientRect();
      const display = section.querySelector('.product-display');
      return {section,box,display,displayTop:display ? box.top + display.offsetTop : 0};
    });
    const extent = document.documentElement.scrollHeight - height;
    navigation.style.setProperty('--page-progress', String(extent > 0 ? clamp(window.scrollY / extent) : 0));
    const chapter = measurements.find(item => item.box.top < height * .42 && item.box.bottom > height * .42);
    const titles = {freellm:'FreeLLM Hub',omsetra:'Omsetra',vedaachari:'VedaaChari',rea:'Developer ecosystem',next:'On the horizon'};
    const title = chapter ? titles[chapter.section.id] || (chapter.section.classList.contains('engineering') ? 'Engineering & discovery' : 'Independent engineer') : 'Independent engineer';
    if (descriptor.textContent !== title) descriptor.textContent = title;
    if (!enabled()) return;
    for (const {section, box, display, displayTop} of measurements) {
      const entry = clamp((height - displayTop) / (height * .7));
      if (display) {
        const depth = 1 - entry;
        display.style.setProperty('--display-y', `${(depth * (compact.matches ? 20 : 48)).toFixed(2)}px`);
        display.style.setProperty('--display-scale', (1 - depth * (compact.matches ? .025 : .055)).toFixed(4));
        display.style.setProperty('--display-tilt', `${(depth * (compact.matches ? 1 : 3)).toFixed(3)}deg`);
      }
      if (section.classList.contains('hero')) {
        const progress = clamp(-box.top / box.height);
        section.querySelector('.hero-sculpture').style.setProperty('--sculpture-turn', `${(progress * (compact.matches ? 3 : 7)).toFixed(2)}deg`);
      }
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) active.add(entry.target);
      else active.delete(entry.target);
    }
    schedule();
  }, {rootMargin:'120px 0px'});
  sections.forEach(section => visibility.observe(section));

  const entrances = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || seen.has(entry.target)) continue;
      seen.add(entry.target);
      entrances.unobserve(entry.target);
      if (!enabled() || typeof entry.target.animate !== 'function') continue;
      const animation = entry.target.animate([
        {opacity:.58,transform:`translate3d(0,${compact.matches ? 14 : 28}px,0)`},
        {opacity:1,transform:'translate3d(0,0,0)'}
      ], {duration:compact.matches ? 520 : 720,easing:'cubic-bezier(.22,1,.36,1)'});
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }
  }, {threshold:.12});
  reveals.forEach(element => entrances.observe(element));

  function sync() {
    if (!enabled()) clearMotion();
    schedule();
  }
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  preference.addEventListener('change',sync);
  compact.addEventListener('change',schedule);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',sync);
  schedule();
})();
