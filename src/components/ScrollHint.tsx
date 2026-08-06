import type { CSSProperties, FC } from 'react';

/** Base style for the hint; the engine drives its `opacity`, `top`, and `bottom`. */
const hintStyle: CSSProperties = {
  position: 'absolute',
  bottom: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  fontSize: 14,
  color: 'rgb(var(--ink))',
  transition: 'opacity .5s',
};

/**
 * The "scroll" cue with a hand-drawn down arrow (bowed shaft, stroke-only head), tagged
 * `data-hint`. Visible on load, faded out by the engine after the first bit of scroll.
 * @returns The scroll hint
 */
export const ScrollHint: FC = () => (
  <div data-hint style={hintStyle}>
    <span>scroll</span>
    <svg
      width={34}
      height={44}
      viewBox="0 0 26 34"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.4 2 Q11.8 12 13.1 21.5 Q13.5 25 12.9 28.5" />
      <path d="M5.6 21.8 Q9.4 25.6 12.9 28.9" />
      <path d="M20.2 21.2 Q16.6 25.4 13.1 28.7" />
    </svg>
  </div>
);
