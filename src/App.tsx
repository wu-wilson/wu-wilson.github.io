import React from 'react';

import { DesktopFilm } from './components/desktop/DesktopFilm';
import { MobileFilm } from './components/mobile/MobileFilm';

import { useMediaQuery } from './hooks/useMediaQuery';

import { FILM_MIN_HEIGHT, MOBILE_MAX_WIDTH } from './constants/config';

/**
 * Root component. Renders one of two independent implementations — the pinned desktop film or
 * the flowing mobile layout — chosen by viewport size (mobile when too narrow or too short for
 * the film), and threads the reduced-motion preference down to whichever engine runs.
 * @returns The desktop or mobile experience
 */
export const App: React.FC = () => {
  const isMobile = useMediaQuery(
    `(max-width: ${MOBILE_MAX_WIDTH}px), (max-height: ${FILM_MIN_HEIGHT}px)`
  );
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return isMobile ? (
    <MobileFilm reducedMotion={reducedMotion} />
  ) : (
    <DesktopFilm reducedMotion={reducedMotion} />
  );
};
