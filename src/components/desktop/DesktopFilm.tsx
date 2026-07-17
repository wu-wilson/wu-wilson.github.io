import React, { useRef } from 'react';

import { About } from './About';
import { Blueprint } from './Blueprint';
import { Contact } from './Contact';
import { DesktopFooter } from './DesktopFooter';
import { DesktopNav } from './DesktopNav';
import { Experience } from './Experience';
import { Flood } from './Flood';
import { HatchGround } from './HatchGround';
import { Hero } from './Hero';
import { Projects } from './Projects';
import { SnakeOverlay } from './SnakeOverlay';

import { useFilmEngine } from '../../hooks/useFilmEngine';

import { FILM_LENGTH_VH, SCROLL_TARGETS } from '../../constants/config';
import { scrollToProgress } from '../../lib/scroll';

interface DesktopFilmProps {
  /** Whether the viewer prefers reduced motion (drops progress smoothing and the intro draw). */
  reducedMotion: boolean;
}

/**
 * The pinned desktop experience: a tall scroll track with a sticky stage whose five scenes,
 * career chart, flood, and single travelling line are all scrubbed by `useFilmEngine`. Scenes
 * are separate components but share the stage's coordinate space (located by `data-fx`).
 * @param props - The reduced-motion preference forwarded to the engine
 * @returns The desktop film
 */
export const DesktopFilm: React.FC<DesktopFilmProps> = ({ reducedMotion }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useFilmEngine(rootRef, reducedMotion);

  const jump = (fraction: number): void => {
    if (rootRef.current) scrollToProgress(rootRef.current, fraction);
  };

  return (
    <div
      ref={rootRef}
      data-fx="track"
      style={{ height: `${FILM_LENGTH_VH}vh`, position: 'relative', background: 'rgb(var(--paper))' }}
    >
      <div data-fx="stage" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <HatchGround />
        <main>
          <Hero />
          <About />
          <SnakeOverlay />
          <Projects />
          <Blueprint />
          <Experience />
          <Flood />
          <Contact />
        </main>
        <DesktopFooter onTop={() => jump(SCROLL_TARGETS.top)} />
        <DesktopNav onJump={jump} />
      </div>
    </div>
  );
};
