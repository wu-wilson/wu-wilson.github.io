import React from 'react';

/**
 * The ruled-notebook ground behind every desktop scene — evenly spaced blue horizontal
 * rules. The engine fades it out under the contact flood.
 * @returns The ruled background layer
 */
export const HatchGround: React.FC = () => (
  <div className="hatch-ground" data-fx="hatch" style={{ position: 'absolute', inset: -12, zIndex: 1 }} />
);
