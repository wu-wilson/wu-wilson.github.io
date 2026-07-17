import React from 'react';

/**
 * The mobile travelling line overlay. `mSnake` is the visible margin stroke the engine scrubs
 * with scroll; `mMeasure` is a hidden sibling used only for segment-length measurement.
 * @returns The mobile line overlay SVG
 */
export const MobileSnake: React.FC = () => (
  <svg
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 30,
      pointerEvents: 'none',
      overflow: 'visible',
    }}
  >
    <path
      data-fx="mSnake"
      d="M0 0"
      fill="none"
      stroke="rgb(var(--brand))"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0 }}
    />
    <path data-fx="mMeasure" d="M0 0" fill="none" stroke="none" />
  </svg>
);
