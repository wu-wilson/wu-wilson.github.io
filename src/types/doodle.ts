/**
 * A single point in the SVG world coordinate space (`0 0 1600 900` viewBox), as an `[x, y]`
 * tuple. Every stroke is a fixed-length list of these so strokes can morph point-by-point.
 */
export type Point = [number, number];

/** One pen stroke: an ordered list of `NP` points, drawn as a smooth (or sharp) polyline. */
export type Stroke = Point[];

/** One finished doodle: a fixed set of `NS` strokes. Stages morph into each other stroke-for-stroke. */
export type Stage = Stroke[];
