import React from 'react';

import { ABOUT } from '../../constants/content';

/**
 * The mobile about block: kicker, title, and body reveal on scroll (via `data-io`); the "end to
 * end" span carries the underline slot the margin line hooks through.
 * @returns The mobile about section
 */
export const MobileAbout: React.FC = () => (
  <div
    data-fx="mAbout"
    data-screen-label="Mobile About"
    style={{ padding: '110px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}
  >
    <div
      data-io="1"
      className="font-hand"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', color: 'rgb(var(--brand))' }}
    >
      {ABOUT.kicker}
    </div>
    <h2
      data-io="1"
      data-iod="60"
      className="font-display"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 900, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'rgb(var(--ink))', margin: 0 }}
    >
      {ABOUT.title}
    </h2>
    <div
      data-io="1"
      data-iod="120"
      className="font-display"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: 'rgb(var(--muted-1))' }}
    >
      {ABOUT.lead.trim()}
      <br />
      <span data-fx="mU1" style={{ color: 'rgb(var(--ink))', display: 'inline-block', whiteSpace: 'nowrap' }}>
        {ABOUT.emphasis}
      </span>
      {ABOUT.tail}
    </div>
  </div>
);
