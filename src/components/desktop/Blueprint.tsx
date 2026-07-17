import React from 'react';

/**
 * A blueprint annotation that flashes over the media frame's footprint while the site cuts
 * from About to Projects — a wireframe-spec beat naming the frame's dimensions.
 * @returns The blueprint caption overlay
 */
export const Blueprint: React.FC = () => (
  <div data-fx="bp" style={{ position: 'absolute', inset: 0, zIndex: 12, opacity: 0, pointerEvents: 'none' }}>
    <div style={{ width: 'min(1280px, 92vw)', height: '100%', margin: '0 auto', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: '34.4%',
          right: 0,
          top: '50%',
          height: 'min(560px, 62vh)',
          transform: 'translate(0, -50%)',
        }}
      >
        <div
          className="font-hand"
          style={{ position: 'absolute', top: -22, left: 0, fontWeight: 400, fontSize: 11, color: 'rgb(var(--brand))' }}
        >
          media-frame: 840 × 560
        </div>
      </div>
    </div>
  </div>
);
