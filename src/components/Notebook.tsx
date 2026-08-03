import { useRef, type FC } from 'react';

import { Captions } from './Captions';
import { DoodleStage } from './DoodleStage';
import { ScrollHint } from './ScrollHint';

import { useNotebookFilm } from '../hooks/useNotebookFilm';

import { SCROLL_LENGTH_VH } from '../constants/animations';

/** Props for {@link Notebook}. */
interface NotebookProps {
  /** When `true`, snap to the scroll position and disable the idle wobble (reduced-motion). */
  reducedMotion: boolean;
}

/**
 * The whole site: a tall empty scroll track drives a fixed, full-viewport graph-paper stage
 * that holds the doodle SVG, the captions, and the scroll hint. The rAF engine reads scroll
 * and paints every frame; React only renders this structure once.
 * @param reducedMotion - Forwarded to the engine to drop easing and the boil
 * @returns The notebook experience
 */
export const Notebook: FC<NotebookProps> = ({ reducedMotion }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  useNotebookFilm(stageRef, reducedMotion);

  return (
    <div style={{ position: 'relative' }}>
      {/* Empty scroll track — its length sets the pace of the whole story. */}
      <div style={{ height: `${SCROLL_LENGTH_VH}vh` }} />

      <div
        ref={stageRef}
        className="graph-paper"
        style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
      >
        <DoodleStage />
        <Captions />
        <ScrollHint />
      </div>
    </div>
  );
};
