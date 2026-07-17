import React from 'react';

import { CopyButton } from '../common/CopyButton';

import { EMAIL } from '../../constants/config';
import { SOCIALS } from '../../constants/content';

/**
 * Scene 5 — Contact, revealed over the blue flood. A big "SAY HELLO." headline, the email with
 * the line's final underline slot, email / copy actions, and social links. The engine fades and
 * lifts it in as the flood completes.
 * @returns The contact scene
 */
export const Contact: React.FC = () => (
  <div
    data-fx="contact"
    data-screen-label="Scene 5 Contact"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      visibility: 'hidden',
    }}
  >
    <div style={{ width: 'min(1280px, 92vw)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 'min(800px, 100%)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          className="font-hand"
          style={{ fontWeight: 500, fontSize: 12, letterSpacing: '0.1em', color: 'rgb(var(--muted-on-blue))' }}
        >
          GET IN TOUCH
        </div>
        <h2
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 'min(96px, 8vw)',
            lineHeight: 0.93,
            letterSpacing: '-0.02em',
            color: 'rgb(var(--paper-on-blue))',
            margin: 0,
          }}
        >
          SAY HELLO.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="font-hand" style={{ fontWeight: 600, fontSize: 19, color: 'rgb(var(--paper-on-blue))' }}>
            {EMAIL}
          </div>
          <div data-fx="cu" style={{ width: 300, height: 2, background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <a
            href={`mailto:${EMAIL}`}
            className="font-hand wobble-lg bg-ink text-paper-on-blue transition-colors hover:text-brand"
            style={{ fontWeight: 600, fontSize: 13, padding: '13px 20px' }}
          >
            EMAIL ME ↗
          </a>
          <CopyButton text={EMAIL} />
        </div>
        <div style={{ display: 'flex', gap: 22, marginTop: 14 }}>
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="font-hand text-muted-on-blue transition-colors hover:text-paper-on-blue"
              style={{ fontWeight: 600, fontSize: 11 }}
            >
              {social.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);
