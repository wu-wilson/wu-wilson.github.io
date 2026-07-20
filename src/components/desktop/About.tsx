import React from 'react';

import { ABOUT } from '../../constants/content';

/**
 * Scene 2 — the about blurb. Kicker, title, and body cascade in on scroll; the emphasized
 * "end to end" span carries the underline slot the travelling line hooks through.
 * @returns The about scene
 */
export const About: React.FC = () => (
  <div
    data-fx="about"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      visibility: 'hidden',
    }}
  >
    <div style={{ width: 'min(1280px, 92vw)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div
          data-fx="aboutK"
          className="font-hand"
          style={{ fontWeight: 500, fontSize: 12, letterSpacing: '0.12em', color: 'rgb(var(--brand))' }}
        >
          {ABOUT.kicker}
        </div>
        <h2
          data-fx="aboutT"
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 'min(58px, 4.5vw)',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            color: 'rgb(var(--ink))',
            margin: 0,
          }}
        >
          {ABOUT.title}
        </h2>
        <div
          data-fx="aboutB"
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: 'min(20px, 1.7vw)',
            lineHeight: 1.6,
            color: 'rgb(var(--muted-1))',
            maxWidth: 640,
          }}
        >
          {ABOUT.lead}
          <span data-fx="aboutU" style={{ color: 'rgb(var(--ink))' }}>
            {ABOUT.emphasis}
          </span>
          {ABOUT.tail}
        </div>
      </div>
    </div>
  </div>
);
