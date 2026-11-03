const motion = matchMedia('(prefers-reduced-motion: no-preference)');

if (motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    visible.forEach(({ target }) => observer.unobserve(target));
    import('./vendor/anime-4.5.0.esm.min.js').then(({ animate }) => {
      if (!motion.matches) return;
      for (const { target } of visible) {
        animate(target, {
          y: [8, 0],
          duration: 380,
          ease: 'outQuad',
          onComplete: () => target.style.removeProperty('transform'),
        });
      }
    }).catch(() => {
      // The notes remain fully readable if the animation module fails to load.
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-build-note]').forEach((card) => observer.observe(card));
}
