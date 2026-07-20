import React from 'react';

import { EXPERIENCE, EXPERIENCE_META } from '../../constants/content';

/** Most-recent-first, matching the mobile reading order and the line's tick sequence. */
const ENTRIES = [...EXPERIENCE].reverse();

/**
 * The mobile experience list — the current role first, each entry a year/status line, a company
 * — role line, and (current only) a short blurb. Each carries the `data-fx` the line ticks at.
 * @returns The mobile experience section
 */
export const MobileExperience: React.FC = () => (
  <div
    data-fx="mExp"
    style={{ padding: '72px 24px 64px', display: 'flex', flexDirection: 'column', gap: 26 }}
  >
    <h2
      data-io="1"
      className="font-display"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 900, fontSize: 30, color: 'rgb(var(--ink))', margin: 0 }}
    >
      {EXPERIENCE_META.title}
      <span style={{ color: 'rgb(var(--brand))' }}>.</span>
    </h2>
    {ENTRIES.map((entry, j) => (
      <div
        key={entry.year}
        data-fx={`mX${j}`}
        data-io="1"
        style={{ opacity: 0, transform: 'translateY(24px)', display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <div className="font-hand" style={{ fontWeight: 600, fontSize: 11, color: entry.current ? 'rgb(var(--brand))' : 'rgb(var(--muted-2))' }}>
          {entry.year}
          {entry.status ? ` · ${entry.status}` : ''}
        </div>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, color: entry.current ? 'rgb(var(--ink))' : 'rgb(var(--ink-soft))', margin: 0 }}>
          {entry.company} — {entry.role}
        </h3>
        {entry.current && entry.blurb && (
          <div className="font-display" style={{ fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'rgb(var(--muted-1))' }}>
            {entry.blurb}
          </div>
        )}
      </div>
    ))}
  </div>
);
