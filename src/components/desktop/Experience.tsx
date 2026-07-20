import React from 'react';

import { EXPERIENCE, EXPERIENCE_META } from '../../constants/content';

/** Label anchor positions (percent of the chart box) aligned to `EXPERIENCE`, oldest first. */
const LABEL_POS = [
  { left: '7.5%', top: '77%' },
  { left: '22.5%', top: '58.5%' },
  { left: '40%', top: '47%' },
  { left: '58%', top: '34.5%' },
  { left: '67.5%', top: '16.5%' },
];

/** Circles start collapsed; the engine scales them in with an overshoot. */
const NODE_HIDDEN: React.CSSProperties = {
  transform: 'scale(0)',
  transformOrigin: 'center',
  transformBox: 'fill-box',
};

/**
 * Scene 4 — Experience, drawn as a career trajectory chart. The axes draw themselves, each
 * role's node pops in with an elastic overshoot, its label rises alongside, and a pulse blooms
 * on the current role. The step-line between nodes is part of the travelling line, not drawn
 * here. The flood later dims the whole scene as contact takes over.
 * @returns The experience scene
 */
export const Experience: React.FC = () => (
  <div
    data-fx="exp"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      visibility: 'hidden',
      // This scene has no interactive elements, and its reveal window overlaps the still-clickable
      // Projects scene at equal z-index — so let clicks pass through to the project links beneath.
      pointerEvents: 'none',
    }}
  >
    <div style={{ width: 'min(1280px, 90vw)', paddingLeft: 64, boxSizing: 'border-box', position: 'relative' }}>
      <div data-fx="expH" style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
        <h2
          className="font-display"
          style={{ fontWeight: 900, fontSize: 'min(54px, 4vw)', color: 'rgb(var(--ink))', letterSpacing: '-0.02em', margin: 0 }}
        >
          {EXPERIENCE_META.title}
          <span style={{ color: 'rgb(var(--brand))' }}>.</span>
        </h2>
        <div className="font-hand" style={{ fontWeight: 500, fontSize: 12, color: 'rgb(var(--muted-3))' }}>
          {EXPERIENCE_META.range}
        </div>
      </div>

      <div data-fx="chartBox" style={{ position: 'relative', width: 'min(100%, 136vh)', aspectRatio: '1280 / 600', margin: '0 auto' }}>
        <svg aria-hidden="true" viewBox="0 0 1280 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <path data-fx="ay" d="M60 520 L60 40" stroke="rgb(var(--brand))" strokeWidth={2} fill="none" />
          <path data-fx="ax" d="M60 520 L1240 520" stroke="rgb(var(--brand))" strokeWidth={2} fill="none" />
          <circle data-fx="pulse" cx={1080} cy={180} r={14} fill="rgb(var(--brand))" opacity={0} style={NODE_HIDDEN} />
          {EXPERIENCE.map((entry, i) => (
            <circle
              key={entry.year}
              data-fx={`n${i}`}
              cx={entry.point.x}
              cy={entry.point.y}
              r={entry.current ? 7 : 6}
              fill="rgb(var(--brand))"
              style={NODE_HIDDEN}
            />
          ))}
        </svg>

        {EXPERIENCE.map((entry, i) => {
          const line2 = entry.current ? entry.blurb : (entry.status ?? entry.blurb ?? '');
          const emphasis = i < 2 ? 'rgb(var(--ink-soft))' : 'rgb(var(--ink))';
          return (
            <div
              key={entry.year}
              data-fx={`l${i}`}
              className="font-hand"
              style={{
                position: 'absolute',
                left: LABEL_POS[i].left,
                top: LABEL_POS[i].top,
                fontWeight: 400,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: 'rgb(var(--muted-2))',
                opacity: 0,
                // Keep the description on one line when it fits; when it must wrap, avoid
                // leaving a single word orphaned on the last line.
                textWrap: 'pretty',
              }}
            >
              {entry.year} ·{' '}
              {entry.current ? (
                <>
                  <span style={{ color: 'rgb(var(--ink))', fontWeight: 600 }}>
                    {entry.company} · {entry.role}
                  </span>{' '}
                  · <span style={{ color: 'rgb(var(--brand))' }}>CURRENT</span>
                </>
              ) : (
                <>
                  <span style={{ color: emphasis, fontWeight: 600 }}>{entry.company}</span> · {entry.role}
                </>
              )}
              <br />
              {line2}
            </div>
          );
        })}

        <div className="font-hand" style={{ position: 'absolute', left: '10%', top: '89%', fontWeight: 500, fontSize: 13, color: 'rgb(var(--muted-3))' }}>
          2021
        </div>
        <div className="font-hand" style={{ position: 'absolute', left: '43%', top: '89%', fontWeight: 500, fontSize: 13, color: 'rgb(var(--muted-3))' }}>
          2023
        </div>
        <div className="font-hand" style={{ position: 'absolute', left: '83.5%', top: '89%', fontWeight: 500, fontSize: 13, color: 'rgb(var(--muted-3))' }}>
          2026
        </div>
      </div>
    </div>
  </div>
);
