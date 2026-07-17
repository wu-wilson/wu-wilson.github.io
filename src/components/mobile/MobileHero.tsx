import React from 'react';

import { Arrow } from '../common/Arrow';

/** The two hero words share one weight and size on mobile. */
const WORD: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 'min(96px, 21vw)',
  lineHeight: 0.9,
  letterSpacing: '-0.02em',
};

/**
 * The mobile hero: "WILSON / WU" rising in over the ruled ground, with the "WU" underline slot
 * the margin line draws first, and a bobbing scroll cue.
 * @returns The mobile hero section
 */
export const MobileHero: React.FC = () => (
  <div
    data-fx="mHero"
    data-screen-label="Mobile Hero"
    style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 24px',
      position: 'relative',
    }}
  >
    <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 0 }}>
      <div className="font-display animate-rise" style={{ ...WORD, animationDelay: '0.1s', color: 'rgb(var(--ink))' }}>
        WILSON
      </div>
      <div
        className="animate-rise"
        style={{ animationDelay: '0.22s', display: 'inline-flex', flexDirection: 'column', gap: 14, alignSelf: 'flex-start' }}
      >
        <div className="font-display" style={{ ...WORD, color: 'rgb(var(--brand))' }}>
          WU
        </div>
        <div data-fx="mU0" style={{ height: 2, background: 'transparent' }} />
      </div>
    </h1>
    <div data-fx="mCue" style={{ position: 'absolute', bottom: 22, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="font-hand" style={{ fontWeight: 500, fontSize: 13, letterSpacing: '0.12em', color: 'rgb(var(--muted-2))' }}>
        SCROLL
      </div>
      <div className="animate-cue-bounce" style={{ fontSize: 42, lineHeight: 1, color: 'rgb(var(--brand))' }}>
        <Arrow dir="down" size={0.82} style={{ verticalAlign: 'middle' }} />
      </div>
    </div>
  </div>
);
