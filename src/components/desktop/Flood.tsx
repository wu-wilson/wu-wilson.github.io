import React from 'react';

/**
 * The blue panel that floods up from the bottom to hand the film over to the contact scene.
 * @returns The flood panel
 */
export const Flood: React.FC = () => (
  <div
    data-fx="flood"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      background: 'rgb(var(--brand-flood))',
      transform: 'translateY(101%)',
    }}
  />
);
