import type { Point, Stroke } from '../types/doodle';

/**
 * The stroke constructors the seven doodles are drawn with, the two counts that fix the
 * stroke-and-point grid every stage shares, and the geometry and easing helpers the engine
 * paints with. Every function here is pure — no DOM, no state, no time.
 */

/** Points per stroke. Every stroke — line, ellipse, polyline, or parked point — has exactly this many. */
export const NP = 12;

/** Strokes per stage. Stages morph stroke-for-stroke, so all stages share this count. */
export const NS = 18;

/**
 * A straight segment from `(x1, y1)` to `(x2, y2)`, sampled into `NP` evenly spaced points.
 * @param x1 - Start x in world coords
 * @param y1 - Start y in world coords
 * @param x2 - End x in world coords
 * @param y2 - End y in world coords
 * @returns The stroke's `NP` points
 */
export const seg = (x1: number, y1: number, x2: number, y2: number): Stroke =>
  Array.from({ length: NP }, (_, i): Point => [
    x1 + ((x2 - x1) * i) / (NP - 1),
    y1 + ((y2 - y1) * i) / (NP - 1),
  ]);

/**
 * An ellipse sampled into `NP` points, starting at the top and going clockwise (used for the
 * small filled eye ovals, and for every circle).
 * @param cx - Centre x
 * @param cy - Centre y
 * @param rx - Horizontal radius
 * @param ry - Vertical radius
 * @returns The stroke's `NP` points
 */
export const ell = (cx: number, cy: number, rx: number, ry: number): Stroke =>
  Array.from({ length: NP }, (_, i): Point => {
    const a = ((-90 + (360 * i) / (NP - 1)) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

/**
 * A full circle sampled into `NP` points — an {@link ell} with equal radii.
 * @param cx - Centre x
 * @param cy - Centre y
 * @param r - Radius
 * @returns The stroke's `NP` points
 */
export const circle = (cx: number, cy: number, r: number): Stroke => ell(cx, cy, r, r);

/**
 * All `NP` points parked at one spot — an "unused" stroke that a doodle grows from or collapses to.
 * @param x - The park point's x
 * @param y - The park point's y
 * @returns The stroke's `NP` points, all identical
 */
export const collapse = (x: number, y: number): Stroke =>
  Array.from({ length: NP }, (): Point => [x, y]);

/**
 * An open polyline through the given corner points, arc-length-resampled to `NP` evenly spaced
 * points so it morphs smoothly against any other stroke regardless of how many corners it has.
 * @param pts - The polyline's corner points, in order
 * @returns The stroke's `NP` points
 */
export const poly = (...pts: Point[]): Stroke => {
  const d: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    d.push(l);
    total += l;
  }
  const out: Stroke = [];
  for (let k = 0; k < NP; k++) {
    const target = (total * k) / (NP - 1);
    let acc = 0;
    let i = 0;
    while (i < d.length - 1 && acc + d[i] < target) {
      acc += d[i];
      i++;
    }
    const f = d[i] ? Math.min(1, (target - acc) / d[i]) : 0;
    out.push([
      pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f,
      pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f,
    ]);
  }
  return out;
};

/**
 * A stroke's bounding-box extent — its width plus its height — used to tell "real" strokes from
 * ones parked at (or pinched down to) a point.
 * @param pts - Any list of points in world coords
 * @returns Width + height of the bounding box, in world px
 */
export const extent = (pts: Point[]): number => {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return x1 - x0 + (y1 - y0);
};

/**
 * Clamp a value to the `0..1` range.
 * @param t - Any number
 * @returns `t` clamped to `[0, 1]`
 */
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/**
 * Smoothstep easing on `0..1` — the S-curve that shapes each stage's dwell.
 * @param t - Input, clamped to `[0, 1]`
 * @returns The eased value in `[0, 1]`
 */
export const smoothstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * Build an SVG path `d` string from a stroke's live points. Smooth strokes join with
 * quadratic curves through each point to the midpoint of the next pair (a hand-drawn feel);
 * `sharp` strokes join with straight segments so corners (the tie) stay crisp.
 * @param pts - The stroke's `NP` live points
 * @param sharp - When `true`, use straight `L` segments instead of quadratic curves
 * @returns The SVG path `d` attribute value
 */
export const strokePath = (pts: Point[], sharp: boolean): string => {
  let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  if (sharp) {
    for (let i = 1; i < pts.length; i++) {
      d += ' L' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
    }
    return d;
  }
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ' Q' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
  }
  d += ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + pts[pts.length - 1][1].toFixed(1);
  return d;
};
