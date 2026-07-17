import { useEffect } from 'react';

import { EASING } from '../constants/animations';

/**
 * Reveal elements as they scroll into view on the mobile layout. Any element carrying a
 * `data-io` attribute fades and rises into place once 20% visible, honoring an optional
 * per-element `data-iod` stagger delay (in ms). Reveals fire once, then the element is
 * unobserved. On reduced-motion the elements are simply shown with no transition.
 * @param active - Whether the observer should run (mobile only); a no-op when `false`
 * @param reducedMotion - When `true`, reveal instantly without transitions
 */
export function useIntersectionReveal(active: boolean, reducedMotion: boolean): void {
  useEffect(() => {
    if (!active) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-io]'));
    if (targets.length === 0) return;

    if (reducedMotion) {
      targets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.iod ?? '0';
          el.style.transition = `opacity 0.45s ${EASING}, transform 0.45s ${EASING}`;
          el.style.transitionDelay = `${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [active, reducedMotion]);
}
