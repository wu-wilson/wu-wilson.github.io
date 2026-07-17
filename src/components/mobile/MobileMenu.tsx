import React from 'react';

import { Arrow } from '../common/Arrow';

import { RESUME_URL } from '../../constants/config';
import { NAV_LINKS, SOCIALS } from '../../constants/content';

interface MobileMenuProps {
  /** Navigate to a section by its nav target key (`about` / `projects` / …). */
  onNavigate: (target: string) => void;
}

/**
 * The full-screen mobile menu takeover: oversized section links, the résumé button, and social
 * links along the bottom. Sits just below the nav so the hamburger stays clickable to close it.
 * @param props - The section navigation handler
 * @returns The menu overlay
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigate }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 45,
      background: 'rgb(var(--paper))',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '0 24px' }}>
      {NAV_LINKS.map((link) => (
        <button
          key={link.target}
          type="button"
          onClick={() => onNavigate(link.target)}
          className="font-display"
          style={{ fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: 'rgb(var(--ink))', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, textAlign: 'left' }}
        >
          {link.label}
        </button>
      ))}
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noreferrer"
        className="font-hand wobble-lg bg-brand text-paper"
        style={{ fontWeight: 600, fontSize: 13, padding: '15px 0', textAlign: 'center', marginTop: 22, display: 'block' }}
      >
        RÉSUMÉ<Arrow style={{ marginLeft: 3 }} />
      </a>
    </div>
    <div style={{ padding: '20px 24px', display: 'flex', gap: 14 }}>
      {SOCIALS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="font-hand"
          style={{ fontWeight: 600, fontSize: 10.5, color: 'rgb(var(--muted-3))' }}
        >
          {social.label}
        </a>
      ))}
    </div>
  </div>
);
