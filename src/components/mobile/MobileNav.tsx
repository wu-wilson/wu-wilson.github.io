import React from 'react';

interface MobileNavProps {
  menuOpen: boolean;
  /** Toggle the full-screen menu takeover. */
  onToggle: () => void;
  /** Jump to the top of the page. */
  onTop: () => void;
}

/**
 * The fixed mobile top bar. The engine frosts it once scrolled; the hamburger toggles the menu
 * takeover, its glyph flipping between `+` and `✕`.
 * @param props - The menu state and its toggle / scroll-to-top handlers
 * @returns The mobile nav bar
 */
export const MobileNav: React.FC<MobileNavProps> = ({ menuOpen, onToggle, onTop }) => (
  <nav
    data-fx="mNav"
    aria-label="Primary"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid transparent',
      transition: 'background 0.2s, border-color 0.2s',
    }}
  >
    <button
      type="button"
      onClick={onTop}
      className="font-hand"
      style={{ fontWeight: 600, fontSize: 13, color: 'rgb(var(--ink))', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
    >
      WW
    </button>
    <button
      type="button"
      onClick={onToggle}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', border: 'none' }}
    >
      {/* Hand-drawn toggle: two slightly wobbled pen strokes, matching the travelling line. */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgb(var(--brand))"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {menuOpen ? (
          <>
            <path d="M5.5 5 Q12 12.8 18.5 19" />
            <path d="M18.5 5 Q11.4 11.6 5.5 19" />
          </>
        ) : (
          <>
            <path d="M4.5 12 Q12 10.8 19.5 12.1" />
            <path d="M12 4.5 Q13.1 12 12 19.5" />
          </>
        )}
      </svg>
    </button>
  </nav>
);
