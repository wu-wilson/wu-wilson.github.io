/**
 * Timing landmarks for the desktop film, expressed as normalized scroll progress (0..1) of
 * the pinned track. Each scene reads its own window out of this map; keeping them in one
 * place makes the choreography legible and the transitions easy to retune together. The
 * engine remaps any `[start, end]` window to 0..1 with `segment()` and eases it.
 */
export const FILM = {
  /** Nav switches from transparent to its condensed frosted state past this progress. */
  navCondense: 0.012,
  /** Scroll-progress cutoffs that mark which nav link reads as active. */
  navActive: { about: 0.1, projects: 0.28, experience: 0.58, contact: 0.86 },

  hero: { exit: [0.1, 0.16], cueFade: [0.004, 0.03], hide: 0.19 },
  about: {
    in: [0.115, 0.165],
    out: [0.24, 0.3],
    kicker: [0.115, 0.145],
    title: [0.125, 0.155],
    body: [0.135, 0.165],
    show: [0.09, 0.33],
  },
  blueprint: { in: [0.25, 0.27], out: [0.305, 0.33] },
  projects: {
    in: [0.27, 0.305],
    out: [0.565, 0.625],
    show: [0.24, 0.66],
    mediaWipe: [0.285, 0.315],
    /** Crossfade hold/transition bands producing the 0→1→2 project index. */
    cross: { t01: [0.395, 0.425], hold1: [0.425, 0.505], t12: [0.505, 0.535] },
  },
  experience: {
    in: [0.585, 0.635],
    show: [0.55, 0.97],
    header: [0.6, 0.645],
    axisY: [0.575, 0.615],
    axisX: [0.595, 0.635],
    /** Per-node reveal start thresholds; each node/label eases over the next 0.02. */
    nodes: [0.655, 0.685, 0.715, 0.75, 0.785],
    pulse: [0.79, 0.815],
  },
  flood: [0.865, 0.935],
  contact: { in: [0.92, 0.965], foot: [0.96, 1], show: 0.87, snakeWhite: 0.9 },
  hatchFade: [0.865, 0.935],
} as const;

/**
 * Scrub parameters for the mobile margin line: how far ahead of the scroll position the
 * drawing tip reaches and how far the erasing tail lags (both in viewport heights), plus the
 * first-segment intro window. The desktop line derives its window per-scene inside the engine.
 */
export const MOBILE_SNAKE = {
  /** How far ahead of the scroll position (in vh) the pen tip reaches. */
  tipAheadVh: 0.62,
  /** How far behind the tip (in vh) the tail lags, giving the slithering window. */
  tailLagVh: 1.15,
  /** Intro auto-draw window for the first mobile segment, in ms after the intro delay. */
  introMs: 500,
} as const;

/** Shared easing curve for scene reveals and in-flow transitions. */
export const EASING = 'cubic-bezier(0.2, 0.7, 0.25, 1)' as const;

/**
 * Scroll distance (in viewport heights) over which the mobile hero's scroll cue fades out —
 * so it bows out quickly on first scroll, mirroring the desktop cue's early fade.
 */
export const MOBILE_CUE_FADE_VH = 0.45;

/** Intro auto-draw timing for the hero underline, in milliseconds after mount. */
export const INTRO = { delayMs: 900, durationMs: 450 } as const;

/** Low-pass factor applied to raw scroll progress each frame (higher = snappier). */
export const PROGRESS_SMOOTHING = 0.16;
