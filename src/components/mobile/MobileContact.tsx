import React from 'react';

import { Arrow } from '../common/Arrow';
import { CopyButton } from '../common/CopyButton';

import { copyright, EMAIL, FOOTER_TAGLINE } from '../../constants/config';
import { SOCIALS } from '../../constants/content';

/**
 * The mobile contact section on the blue flood: heading, email, email / copy actions, social
 * links (all revealing on scroll), and the footer signature.
 * @returns The mobile contact section
 */
export const MobileContact: React.FC = () => (
  <div
    data-fx="mContact"
    style={{ background: 'rgb(var(--brand-flood))', padding: '80px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}
  >
    <div
      data-io="1"
      className="font-hand"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', color: 'rgb(var(--muted-on-blue))' }}
    >
      GET IN TOUCH
    </div>
    <h2
      data-io="1"
      data-iod="60"
      className="font-display"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 900, fontSize: 'min(64px, 15vw)', lineHeight: 0.95, letterSpacing: '-0.02em', color: 'rgb(var(--paper-on-blue))', margin: 0 }}
    >
      SAY HELLO.
    </h2>
    <div
      data-io="1"
      data-iod="120"
      className="font-hand"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 600, fontSize: 16, color: 'rgb(var(--paper-on-blue))' }}
    >
      {EMAIL}
    </div>
    <div data-io="1" data-iod="180" style={{ opacity: 0, transform: 'translateY(24px)', display: 'flex', gap: 12, marginTop: 6 }}>
      <a
        href={`mailto:${EMAIL}`}
        className="font-hand wobble-lg bg-ink text-paper-on-blue transition-colors hover:text-brand"
        style={{ fontWeight: 600, fontSize: 13, padding: '13px 20px' }}
      >
        EMAIL ME<Arrow style={{ marginLeft: 4 }} />
      </a>
      <CopyButton text={EMAIL} />
    </div>
    <div data-io="1" data-iod="240" style={{ opacity: 0, transform: 'translateY(24px)', display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="font-hand text-muted-on-blue transition-colors hover:text-paper-on-blue"
          style={{ fontWeight: 600, fontSize: 11 }}
        >
          {social.label}
          <Arrow size={0.92} style={{ marginLeft: 2 }} />
        </a>
      ))}
    </div>
    <footer style={{ borderTop: '1.5px solid rgb(var(--paper-on-blue) / 0.4)', marginTop: 36, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div className="font-hand" style={{ fontWeight: 500, fontSize: 9.5, color: 'rgb(var(--muted-on-blue))' }}>
        {copyright()}
      </div>
      <div className="font-hand" style={{ fontWeight: 500, fontSize: 9.5, color: 'rgb(var(--muted-on-blue))' }}>
        {FOOTER_TAGLINE}
      </div>
    </footer>
  </div>
);
