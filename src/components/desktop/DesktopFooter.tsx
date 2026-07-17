import React from 'react';

import { Arrow } from '../common/Arrow';

import { copyright, FOOTER_TAGLINE } from '../../constants/config';

interface DesktopFooterProps {
  /** Jump back to the top of the film. */
  onTop: () => void;
}

/**
 * The contact-scene footer bar: copyright, the build signature, and a "TOP ↑" jump. The engine
 * fades it in as the contact scene settles.
 * @param props - The scroll-to-top handler
 * @returns The footer bar
 */
export const DesktopFooter: React.FC<DesktopFooterProps> = ({ onTop }) => (
  <footer
    data-fx="cfoot"
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 26,
      borderTop: '1.5px solid rgb(var(--paper-on-blue) / 0.4)',
      opacity: 0,
    }}
  >
    <div
      style={{
        width: 'min(1280px, 92vw)',
        margin: '0 auto',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div className="font-hand" style={{ fontWeight: 500, fontSize: 10, color: 'rgb(var(--muted-on-blue))' }}>
        {copyright()}
      </div>
      <div className="font-hand" style={{ fontWeight: 500, fontSize: 10, color: 'rgb(var(--muted-on-blue))' }}>
        {FOOTER_TAGLINE}
      </div>
      <button
        type="button"
        onClick={onTop}
        className="font-hand text-muted-on-blue transition-colors hover:text-paper-on-blue"
        style={{ fontWeight: 500, fontSize: 10, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
      >
        TOP<Arrow dir="up" style={{ marginLeft: 3 }} />
      </button>
    </div>
  </footer>
);
