import React, { useEffect, useRef, useState } from 'react';

import { MobileAbout } from './MobileAbout';
import { MobileContact } from './MobileContact';
import { MobileExperience } from './MobileExperience';
import { MobileHero } from './MobileHero';
import { MobileMenu } from './MobileMenu';
import { MobileNav } from './MobileNav';
import { MobileProjects } from './MobileProjects';
import { MobileSnake } from './MobileSnake';

import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { useMobileFilm } from '../../hooks/useMobileFilm';

import { scrollToElement } from '../../lib/scroll';

/** Nav target keys → the mobile section's `data-fx` marker. */
const SECTION_FX: Record<string, string> = {
  about: 'mAbout',
  projects: 'mProj',
  experience: 'mExp',
  contact: 'mContact',
};

interface MobileFilmProps {
  /** Whether the viewer prefers reduced motion (drops the timed intro draw). */
  reducedMotion: boolean;
}

/**
 * The flowing mobile experience: a normal scroll document whose blocks reveal on entry while a
 * margin line scrubs alongside. Owns the menu-takeover state and section navigation.
 * @param props - The reduced-motion preference forwarded to the engine and reveals
 * @returns The mobile film
 */
export const MobileFilm: React.FC<MobileFilmProps> = ({ reducedMotion }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMobileFilm(rootRef, reducedMotion);
  useIntersectionReveal(true, reducedMotion);

  useEffect(
    () => () => {
      document.body.style.overflow = '';
    },
    []
  );

  const closeMenu = (): void => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMenu = (): void => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const goTop = (): void => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (target: string): void => {
    closeMenu();
    const el = document.querySelector<HTMLElement>(`[data-fx="${SECTION_FX[target]}"]`);
    if (el) scrollToElement(el);
  };

  return (
    <div
      data-fx="mWrap"
      ref={rootRef}
      className="hatch-ground-mobile"
      style={{ backgroundColor: 'rgb(var(--paper))', position: 'relative' }}
    >
      <MobileSnake />
      <MobileNav menuOpen={menuOpen} onToggle={toggleMenu} onTop={goTop} />
      {menuOpen && <MobileMenu onNavigate={navigate} />}
      <main>
        <MobileHero />
        <MobileAbout />
        <MobileProjects />
        <MobileExperience />
        <MobileContact />
      </main>
    </div>
  );
};
