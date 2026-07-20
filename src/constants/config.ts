/** Primary contact address (mailto — the site is fully static, no backend). */
export const EMAIL = 'wilson.cui.wu@gmail.com';

/** Path to the résumé PDF served from `public/`. Drop the file in as `public/resume.pdf`. */
export const RESUME_URL = '/resume.pdf';

/**
 * Total scroll length of the pinned desktop film, in viewport heights. The sticky stage maps
 * scroll progress across this track; longer means each scene transition gets more travel (so
 * the user scrolls more to advance). All scene windows are normalized fractions of this, so
 * this single value sets the overall pace.
 */
export const FILM_LENGTH_VH = 1500;

/** Max-width (px) at or below which the flowing mobile layout replaces the pinned film. */
export const MOBILE_MAX_WIDTH = 820;

/**
 * Minimum viewport height (px) the pinned desktop film needs. Its sticky stage is a single
 * `100vh` frame every scene must fit inside; below this the film is too cramped (most visibly
 * the Experience chart), so short viewports — chiefly phones in landscape, which clear the
 * width breakpoint — fall back to the flowing mobile document, which has no height requirement.
 */
export const FILM_MIN_HEIGHT = 520;

/**
 * Normalized scroll targets (0..1 of the desktop track) for nav jumps. Each lands in its
 * scene's settled window — fully revealed, past its intro animation, and not yet leaving — so
 * the destination reads as stable rather than mid-transition.
 */
export const SCROLL_TARGETS = {
  top: 0,
  about: 0.21,
  projects: 0.35,
  experience: 0.83,
  contact: 1,
} as const;

/** Footer signature line — the build, verbatim. */
export const FOOTER_TAGLINE = '$ react + ts + vite';

/**
 * The footer copyright line, with the year tracked from the current date.
 * @returns The copyright string, e.g. `© 2026 WILSON WU`
 */
export const copyright = (): string => `© ${new Date().getFullYear()} WILSON WU`;
