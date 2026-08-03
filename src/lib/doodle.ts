import type { Point, Stroke } from '../types/doodle';

/** Points per stroke. Every stroke — line, circle, arc, or parked point — has exactly this many. */
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
 * A full circle sampled into `NP` points starting at angle `a0` (degrees, clockwise from +x).
 * @param cx - Centre x
 * @param cy - Centre y
 * @param r - Radius
 * @param a0 - Start angle in degrees (default -90, i.e. top)
 * @returns The stroke's `NP` points
 */
export const circle = (cx: number, cy: number, r: number, a0 = -90): Stroke =>
  Array.from({ length: NP }, (_, i): Point => {
    const a = ((a0 + (360 * i) / (NP - 1)) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

/**
 * An ellipse sampled into `NP` points (used for the small filled eye ovals).
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

/** All `NP` points parked at one spot — an "unused" stroke that a doodle grows from or collapses to. */
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
 * Clamp a value to the `0..1` range.
 * @param t - Any number
 * @returns `t` clamped to `[0, 1]`
 */
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/**
 * Smoothstep easing on `0..1` — the S-curve used for dwell and every reveal window.
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
