import type { FC } from 'react';

import { ScribbleLink } from './ScribbleLink';

import { RESUME } from '../constants/content';

/**
 * The persistent resume link — a scribble in the page's top-right margin rather than navigation
 * chrome, and the one fixture the engine never touches (no `data-*` marker, no per-frame writes).
 * Its layout lives in the `.resume-link` rules in `index.css`.
 * @returns The corner resume link
 */
export const ResumeLink: FC = () => (
  <ScribbleLink className="resume-link" href={RESUME.href} label={RESUME.label} />
);
