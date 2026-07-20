import React from 'react';

import { Arrow } from '../common/Arrow';

/** Oversized hand-drawn display name; the two words share one weight and size. */
const WORD: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 'min(200px, 13.5vw)',
  lineHeight: 0.85,
  letterSpacing: '-0.02em',
};

/**
 * Scene 1 — the hero: "WILSON / WU" rising in on first paint, with the underline slot the
 * travelling line draws first, and a bobbing scroll cue. The engine fades and lifts the whole
 * scene away as scrolling begins.
 * @returns The hero scene and its scroll cue
 */
export const Hero: React.FC = () => (
  <>
    <div
      data-fx="hero"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          width: 'min(1280px, 92vw)',
          paddingLeft: 64,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
        }}
      >
        <div
          className="font-display animate-rise"
          style={{ ...WORD, animationDelay: '0.1s', color: 'rgb(var(--ink))' }}
        >
          WILSON
        </div>
        <div
          className="animate-rise"
          style={{
            animationDelay: '0.22s',
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 22,
            alignSelf: 'flex-start',
          }}
        >
          <div className="font-display" style={{ ...WORD, color: 'rgb(var(--brand))' }}>
            WU
          </div>
          <div data-fx="heroUnder" style={{ height: 2, background: 'transparent' }} />
        </div>
      </h1>
    </div>
    <div
      data-fx="cue"
      style={{
        position: 'absolute',
        bottom: 26,
        left: 0,
        right: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        className="font-hand"
        style={{ fontWeight: 500, fontSize: 15, letterSpacing: '0.16em', color: 'rgb(var(--muted-2))' }}
      >
        SCROLL
      </div>
      <div
        className="animate-cue-bounce"
        style={{ fontSize: 54, lineHeight: 1, color: 'rgb(var(--brand))' }}
      >
        <Arrow dir="down" size={0.82} style={{ verticalAlign: 'middle' }} />
      </div>
    </div>
  </>
);
