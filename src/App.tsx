import React from 'react';

import { DesktopFilm } from './components/desktop/DesktopFilm';
import { MobileFilm } from './components/mobile/MobileFilm';

import { useMediaQuery } from './hooks/useMediaQuery';

import { MOBILE_MAX_WIDTH } from './constants/config';

/**
 * Root component. Renders one of two independent implementations — the pinned desktop film or
 * the flowing mobile layout — chosen by viewport width, and threads the reduced-motion
 * preference down to whichever engine runs.
 * @returns The desktop or mobile experience
 */
export const App: React.FC = () => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return isMobile ? (
    <MobileFilm reducedMotion={reducedMotion} />
  ) : (
    <DesktopFilm reducedMotion={reducedMotion} />
  );
};
