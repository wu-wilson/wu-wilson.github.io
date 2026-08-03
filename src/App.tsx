import type { FC } from 'react';

import { Notebook } from './components/Notebook';

import { useMediaQuery } from './hooks/useMediaQuery';

/**
 * Root component. Renders the single doodle notebook and reads the reduced-motion preference,
 * threading it into the animation engine.
 * @returns The site
 */
export const App: FC = () => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return <Notebook reducedMotion={reducedMotion} />;
};
