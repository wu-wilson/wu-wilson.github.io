import React from 'react';

import { RESUME_URL, SCROLL_TARGETS } from '../../constants/config';
import { NAV_LINKS } from '../../constants/content';

interface DesktopNavProps {
  /** Smooth-scroll the film to a normalized position (0..1). */
  onJump: (fraction: number) => void;
}

/**
 * The pinned top nav. The engine frosts and condenses it on scroll and recolors the link that
 * matches the current scene; here it only wires the jump targets and the résumé link.
 * @param props - The scroll-jump handler
 * @returns The nav bar
 */
export const DesktopNav: React.FC<DesktopNavProps> = ({ onJump }) => (
  <nav
    data-fx="nav"
    aria-label="Primary"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      borderBottom: '1px solid transparent',
      transition: 'background 0.2s, border-color 0.2s',
    }}
  >
    <div
      data-fx="navIn"
      style={{
        width: 'min(1280px, 92vw)',
        boxSizing: 'border-box',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '26px 0 26px 64px',
        transition: 'padding 0.2s',
      }}
    >
      <button
        type="button"
        onClick={() => onJump(SCROLL_TARGETS.top)}
        className="font-hand"
        style={{ fontWeight: 600, fontSize: 13, color: 'rgb(var(--ink))', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
      >
        WW
      </button>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.target}
            type="button"
            data-fx={`nav-${link.target}`}
            onClick={() => onJump(SCROLL_TARGETS[link.target])}
            className="font-hand"
            style={{ fontWeight: 500, fontSize: 12, color: 'rgb(var(--muted-2))', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
          >
            {link.label}
          </button>
        ))}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          className="font-hand wobble-md bg-brand text-paper transition-colors hover:bg-brand-dark"
          style={{ fontWeight: 600, fontSize: 12, padding: '8px 14px' }}
        >
          RÉSUMÉ ↗
        </a>
      </div>
    </div>
  </nav>
);
