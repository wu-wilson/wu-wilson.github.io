import React from 'react';

/**
 * The shared SVG overlay carrying the travelling line. `snake` is the visible stroke the
 * engine scrubs a dash-window across; `measure` is a hidden sibling used only to measure
 * segment lengths. The overlay's coordinate origin matches the sticky stage, so the engine's
 * stage-relative box measurements line up with the path.
 * @returns The overlay SVG
 */
export const SnakeOverlay: React.FC = () => (
  <svg
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 28,
      pointerEvents: 'none',
      overflow: 'visible',
    }}
  >
    <g data-fx="snakeG">
      <path
        data-fx="snake"
        d="M0 0"
        fill="none"
        stroke="rgb(var(--brand))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke 0.4s', opacity: 0 }}
      />
      <path data-fx="measure" d="M0 0" fill="none" stroke="none" />
    </g>
  </svg>
);
