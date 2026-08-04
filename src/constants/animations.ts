/**
 * Timing, motion, and band-layout constants for the doodle film. Every value here is the
 * prototype's verbatim — port, don't re-derive. Geometry counts (`NP`, `NS`) live in
 * `lib/doodle.ts`.
 */

/** Total scroll length of the story, in viewport heights. Longer = slower morphs per scene. */
export const SCROLL_LENGTH_VH = 800;

/** Low-pass factor easing the painted progress toward the scroll target each frame (1 = instant). */
export const EASE = 0.12;

/** Boil retick period in ms — how often the idle wobble picks fresh jitter offsets. */
export const BOIL_MS = 160;

/** Boil jitter amplitude in world px (offsets are uniform in `[-AMP/2, +AMP/2]`). */
export const BOIL_AMP = 3.5;

/**
 * Dwell shaping for each stage's local progress: a finished doodle holds for `DWELL_HOLD` of
 * its segment on each side and morphs through the middle. Local `f` is remapped as
 * `smoothstep((local - DWELL_HOLD) / DWELL_MORPH)`.
 */
export const DWELL_HOLD = 0.3;

/** The middle fraction of each stage segment over which the morph actually happens. */
export const DWELL_MORPH = 0.4;

/**
 * Half-width, in stage units, of a stage's reveal window — the shape that wipes captions in and
 * switches fills on. A window is centred on its stage and reaches `REVEAL_HALF` to either side.
 */
export const REVEAL_HALF = 0.55;

/** How steeply a reveal window ramps in and out; higher = snappier edges, `1/RAMP` stages wide. */
export const REVEAL_RAMP = 3.2;

/** Pen stroke width in world units (SVG `stroke-width`). */
export const STROKE_WIDTH = 2.6;

/** Vertical gap in px between the drawing band and the caption band. */
export const CAP_GAP = 36;

/** Scroll fraction past which the "scroll" hint fades out. */
export const HINT_FADE = 0.02;
