import React from 'react';

/** The directions the arrow can point. */
type ArrowDir = 'up-right' | 'up' | 'down';

interface ArrowProps {
  /** Which way the arrow points (default `up-right`, the external-link arrow). */
  dir?: ArrowDir;
  /** Edge length in `em`, so it scales with the surrounding text (default 1). */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Hand-drawn stroke paths per direction, in a `0 0 24 24` viewBox (shaft + arrowhead). */
const PATHS: Record<ArrowDir, string> = {
  'up-right': 'M6.5 17.5 Q11.5 11.5 17.5 6.5 M10.8 6.4 L17.6 6.5 L17.5 13.4',
  up: 'M12 18.5 Q11.6 12 12 5.8 M6.6 11 L12 5.8 L17.4 11',
  down: 'M12 5.8 Q12.4 12 12 18.5 M6.6 13.3 L12 18.5 L17.4 13.3',
};

/**
 * A small hand-drawn arrow rendered as inline SVG, replacing the Unicode arrow glyphs (`↗` `↑`
 * `↓`) so the mark looks identical on every browser — Safari renders the diagonal `↗` as a
 * color emoji otherwise. Strokes use `currentColor` and the box is sized in `em`, so it inherits
 * the link's color (including hover transitions) and font size like the glyph it replaces.
 * @param props - The direction, em size, and optional class / style
 * @returns The arrow SVG
 */
export const Arrow: React.FC<ArrowProps> = ({ dir = 'up-right', size = 1, className, style }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={`${size}em`}
    height={`${size}em`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: '-0.13em', flexShrink: 0, ...style }}
  >
    <path d={PATHS[dir]} />
  </svg>
);
