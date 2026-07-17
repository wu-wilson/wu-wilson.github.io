/**
 * Clamp a number into a closed range.
 * @param value - The number to clamp
 * @param min - Lower bound (default 0)
 * @param max - Upper bound (default 1)
 * @returns `value` limited to `[min, max]`
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Remap a progress value onto a sub-window, clamped to `[0, 1]`. This is the core scrubbing
 * primitive: `segment(p, 0.27, 0.305)` reads 0 before the window, 1 after it, and a linear
 * ramp across it — letting each scene own a slice of the global scroll.
 * @param progress - Overall normalized scroll progress (0..1)
 * @param start - Window start in the same 0..1 space
 * @param end - Window end in the same 0..1 space
 * @returns The position within the window, clamped to `[0, 1]`
 */
export function segment(progress: number, start: number, end: number): number {
  return clamp((progress - start) / (end - start));
}

/**
 * Ease-in-out quadratic. Gives scrubbed transitions a soft start and finish so scenes settle
 * rather than snap.
 * @param t - Linear progress in `[0, 1]`
 * @returns The eased value in `[0, 1]`
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Linear interpolation between two values.
 * @param a - Start value (returned at `t = 0`)
 * @param b - End value (returned at `t = 1`)
 * @param t - Interpolation factor, typically in `[0, 1]`
 * @returns The interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
