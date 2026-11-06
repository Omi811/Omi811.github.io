/**
 * Apple Ecosystem Interconnected Runtime
 * Pure vanilla JavaScript following Ponytail senior-dev zero-bloat principles.
 * Auto-wires the ecosystem bar, keyboard shortcuts ('e' for ecosystem), and scrollytelling.
 */

(function () {
  'use strict';

  function initEcosystem() {
    const trigger = document.getElementById('appleEcosystemTrigger');
    const flyout = document.getElementById('appleEcosystemFlyout');

    if (!trigger || !flyout) return;

    function toggle(open) {
      const willOpen = open !== undefined ? open : !flyout.classList.contains('is-open');
      flyout.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    document.addEventListener('click', (e) => {
      if (flyout.classList.contains('is-open') && !flyout.contains(e.target) && e.target !== trigger) {
        toggle(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && flyout.classList.contains('is-open')) {
        toggle(false);
      }
    });

    // Detect current project
    const path = window.location.pathname.toLowerCase();
    const items = flyout.querySelectorAll('.apple-flyout-item');
    items.forEach((item) => {
      const proj = item.getAttribute('data-project');
      if (
        (proj === 'agentwire' && path.includes('agentwire')) ||
        (proj === 'omsetra' && path.includes('omsetra')) ||
        (proj === 'freellm' && path.includes('freellm')) ||
        (proj === 'seo' && path.includes('universal-seo')) ||
        (proj === 'rea' && path.includes('rea')) ||
        (proj === 'studio' && path.includes('autonomous-studio')) ||
        (proj === 'hub' && (path === '/' || path.endsWith('index.html') || path === ''))
      ) {
        item.classList.add('is-current');
      }
    });
  }

  // Scrollytelling & Choreographed Bento Motion
  function initScrollytelling() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-apple-reveal], .bento-card, .apple-reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initEcosystem();
      initScrollytelling();
    });
  } else {
    initEcosystem();
    initScrollytelling();
  }
})();
