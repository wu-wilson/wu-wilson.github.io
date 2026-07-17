/**
 * Smooth-scroll the desktop film to a normalized position along its track. A fraction of 0 is
 * the top; 1 is the end (the contact scene).
 * @param track - The full-height scroll track element
 * @param fraction - Target position in `[0, 1]` of the scrollable range
 */
export function scrollToProgress(track: HTMLElement, fraction: number): void {
  const max = track.offsetHeight - window.innerHeight;
  window.scrollTo({ top: fraction * max, behavior: 'smooth' });
}

/**
 * Smooth-scroll so an element sits just below the fixed mobile nav.
 * @param el - The section element to bring into view
 * @param offset - Pixels of headroom left above the element (default 52, clearing the nav)
 */
export function scrollToElement(el: HTMLElement, offset = 52): void {
  const top = el.getBoundingClientRect().top + (window.scrollY || 0) - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
