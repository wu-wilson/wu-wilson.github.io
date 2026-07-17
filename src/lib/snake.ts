/**
 * Geometry for "the line" — the single continuous pen-stroke that threads the whole site.
 * These builders measure the live layout and emit an SVG path `d` plus the cumulative segment
 * lengths (`marks`) the engine scrubs a drawing window across. Nothing here mutates React
 * state; the engine calls a builder whenever the layout changes (resize, font load, reflow).
 */

/** An element's box, in the coordinate space of the shared SVG overlay. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The measured anchor boxes the desktop line stitches together, scene by scene. */
export interface DesktopSnakeBoxes {
  /** Hero "WU" underline slot. */
  heroUnder: Box;
  /** About "end to end" emphasis span. */
  aboutU: Box;
  /** Projects media frame (traced as a rectangle). */
  pmedia: Box;
  /** Experience chart box (the step-line maps into its `1280×600` viewBox). */
  chartBox: Box;
  /** Contact email underline slot. */
  cu: Box;
}

/** The measured anchor boxes the mobile line hooks into as it runs down the margin rail. */
export interface MobileSnakeBoxes {
  /** Hero "WU" underline slot. */
  u0: Box;
  /** About "end to end" emphasis span. */
  u1: Box;
  /** The three project frames, top to bottom. */
  frames: [Box, Box, Box];
  /** The five experience entries, top to bottom. */
  entries: [Box, Box, Box, Box, Box];
  /** Document-Y of the contact panel's top edge; the line runs down to meet it. */
  contactTop: number;
}

/** A built desktop path: the `d` string, cumulative per-segment lengths, and total length. */
export interface SnakePath {
  d: string;
  /** Cumulative length at each segment boundary; `marks[0] === 0`, `marks.at(-1) === total`. */
  marks: number[];
  total: number;
}

/** A built mobile path, additionally carrying the document-Y at each mark for scroll mapping. */
export interface MobileSnakePath extends SnakePath {
  /** Monotonic document-Y values aligned with `marks`, used to map scroll position to length. */
  ys: number[];
}

/**
 * Measure the length of one path segment using a throwaway `d` on the hidden measure path.
 * @param measure - A path element in the same SVG, used only for `getTotalLength()`
 * @param from - The segment's start point `[x, y]`
 * @param d - The segment's path commands (without the leading `M`)
 * @returns The segment length in user units
 */
function segmentLength(measure: SVGPathElement, from: [number, number], d: string): number {
  measure.setAttribute('d', `M ${from[0]} ${from[1]} ${d}`);
  return measure.getTotalLength();
}

/**
 * Build the desktop line: hero underline → About emphasis underline → around the Projects
 * media frame → the Experience step-chart → the Contact email underline, as one path.
 * @param b - The measured scene anchor boxes
 * @param measure - A hidden path element in the overlay SVG for length measurement
 * @returns The path plus its segment marks, or `null` if any box has not been measured yet
 */
export function buildDesktopSnake(b: DesktopSnakeBoxes, measure: SVGPathElement): SnakePath | null {
  if (!b.heroUnder.w || !b.chartBox.w) return null;

  const { heroUnder: H, aboutU: A, chartBox: C, cu: Eb } = b;
  // The media frame is vertically centered on its top, so shift its box up half its height.
  const R: Box = { x: b.pmedia.x, y: b.pmedia.y - b.pmedia.h / 2, w: b.pmedia.w, h: b.pmedia.h };

  // Map a point in the chart's 1280×600 viewBox into overlay coordinates.
  const map = (cx: number, cy: number): [number, number] => [
    C.x + (cx / 1280) * C.w,
    C.y + (cy / 600) * C.h,
  ];

  const hy = H.y + 1;
  // Sit the "end to end" underline a touch below the text (was A.h - 4, which read too tight).
  const ay = A.y + A.h;
  const ey = Eb.y + 1;
  // Chart node coordinates — must match EXPERIENCE points in constants/content.ts so the line
  // lands on each plotted node.
  const S0 = map(140, 450);
  const P4 = map(1080, 180);
  const stepPts = (
    [
      [340, 450],
      [340, 410],
      [560, 410],
      [560, 340],
      [800, 340],
      [800, 265],
      [1080, 265],
      [1080, 180],
    ] as const
  ).map(([x, y]) => map(x, y));

  const segs: { s: [number, number]; d: string }[] = [
    { s: [H.x, hy], d: `L ${H.x + H.w} ${hy}` },
    {
      s: [H.x + H.w, hy],
      d: `C ${H.x + H.w + 90} ${hy + 70} ${A.x - 150} ${ay - 90} ${A.x} ${ay}`,
    },
    { s: [A.x, ay], d: `L ${A.x + A.w} ${ay}` },
    {
      s: [A.x + A.w, ay],
      d: `C ${A.x + A.w + 170} ${ay + 20} ${R.x - 190} ${R.y - 90} ${R.x} ${R.y}`,
    },
    {
      s: [R.x, R.y],
      d: `L ${R.x + R.w} ${R.y} L ${R.x + R.w} ${R.y + R.h} L ${R.x} ${R.y + R.h} L ${R.x} ${R.y}`,
    },
    {
      s: [R.x, R.y],
      d: `C ${R.x - 150} ${R.y + 90} ${S0[0] - 90} ${S0[1] - 150} ${S0[0]} ${S0[1]}`,
    },
    { s: S0, d: stepPts.map(([x, y]) => `L ${x} ${y}`).join(' ') },
    {
      s: P4,
      d: `C ${P4[0] + 70} ${P4[1] + 170} ${Eb.x - 170} ${ey - 150} ${Eb.x} ${ey}`,
    },
    { s: [Eb.x, ey], d: `L ${Eb.x + Eb.w} ${ey}` },
  ];

  const marks = [0];
  let d = `M ${H.x} ${hy}`;
  for (const seg of segs) {
    marks.push(marks[marks.length - 1] + segmentLength(measure, seg.s, seg.d));
    d += ` ${seg.d}`;
  }

  return { d, marks, total: marks[marks.length - 1] };
}

/**
 * Build the mobile line: a margin rail that hooks into the "WU" underline, the About emphasis,
 * each project frame (traced as a rectangle), and a tick at each experience entry.
 * @param b - The measured mobile anchor boxes, in `mWrap`-relative coordinates
 * @param measure - A hidden path element in the overlay SVG for length measurement
 * @returns The path plus its marks and aligned document-Y values, or `null` if unmeasured
 */
export function buildMobileSnake(
  b: MobileSnakeBoxes,
  measure: SVGPathElement
): MobileSnakePath | null {
  const { u0: U0, u1: U1, frames: F, entries: X, contactTop } = b;
  if (!U0.w || !U1.w || F.some((f) => !f.w) || X.some((e) => !e.h)) return null;

  const rx = 13;
  const marks = [0];
  const ys = [U0.y];
  let cur: [number, number] = [U0.x, U0.y + 1];
  let d = `M ${cur[0]} ${cur[1]}`;

  const add = (dd: string, end: [number, number], yMark: number): void => {
    marks.push(marks[marks.length - 1] + segmentLength(measure, cur, dd));
    ys.push(yMark);
    d += ` ${dd}`;
    cur = end;
  };

  // Underline "WU", then swing back to the left-margin rail.
  add(`L ${U0.x + U0.w} ${cur[1]}`, [U0.x + U0.w, cur[1]], U0.y + 60);
  add(
    `C ${U0.x + U0.w + 16} ${U0.y + 80} ${rx} ${U0.y + 60} ${rx} ${U0.y + 170}`,
    [rx, U0.y + 170],
    U0.y + 170
  );

  // Hook out to underline "end to end", retrace, hook back to the rail (a touch below the text).
  const u1y = U1.y + U1.h;
  add(`L ${rx} ${u1y - 50}`, [rx, u1y - 50], U1.y - 110);
  add(`C ${rx} ${u1y} ${U1.x - 8} ${u1y} ${U1.x} ${u1y}`, [U1.x, u1y], U1.y - 40);
  add(`L ${U1.x + U1.w} ${u1y}`, [U1.x + U1.w, u1y], U1.y + 10);
  add(`L ${U1.x} ${u1y}`, [U1.x, u1y], U1.y + 20);
  add(`C ${U1.x - 8} ${u1y} ${rx} ${u1y} ${rx} ${u1y + 60}`, [rx, u1y + 60], U1.y + 70);

  // Each project frame: rail down the margin, hook in, trace the rectangle, hook out.
  for (const frame of F) {
    add(`L ${rx} ${frame.y - 40}`, [rx, frame.y - 40], frame.y - 130);
    add(
      `C ${rx} ${frame.y - 6} ${frame.x - 5} ${frame.y} ${frame.x} ${frame.y}`,
      [frame.x, frame.y],
      frame.y - 20
    );
    add(
      `L ${frame.x + frame.w} ${frame.y} L ${frame.x + frame.w} ${frame.y + frame.h} L ${frame.x} ${frame.y + frame.h} L ${frame.x} ${frame.y}`,
      [frame.x, frame.y],
      frame.y + frame.h
    );
    add(
      `C ${frame.x - 5} ${frame.y + 8} ${rx} ${frame.y + 16} ${rx} ${frame.y + 70}`,
      [rx, frame.y + 70],
      frame.y + frame.h + 40
    );
  }

  // Rail down to the experience plot: a tick at each entry.
  const y0 = X[0].y + X[0].h / 2;
  add(`L ${rx} ${y0}`, [rx, y0], X[0].y - 30);
  for (const entry of X) {
    const yy = entry.y + entry.h / 2;
    add(`L ${rx} ${yy} L ${rx + 11} ${yy} L ${rx} ${yy}`, [rx, yy], yy);
  }
  // Run the tail down to meet the top edge of the contact panel, closing the gap. (The line
  // stays blue on mobile, so it ends at the blue panel's edge rather than draw onto it.)
  add(`L ${rx} ${contactTop}`, [rx, contactTop], contactTop);

  // The scroll→length map assumes strictly increasing document-Y; nudge any flat/backward step.
  for (let i = 1; i < ys.length; i++) {
    if (ys[i] <= ys[i - 1]) ys[i] = ys[i - 1] + 1;
  }

  return { d, marks, ys, total: marks[marks.length - 1] };
}
