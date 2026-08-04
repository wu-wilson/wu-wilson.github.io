import type { FC } from 'react';

import { RESUME } from '../constants/content';

/**
 * The persistent resume link — a scribble in the page's top-right margin rather than navigation
 * chrome, and the one fixture the engine never touches (no `data-*` marker, no per-frame writes).
 * Text and its hand-drawn underline both take `currentColor`, so they darken together on hover;
 * layout lives in the `.resume-link` rules in `index.css`.
 * @returns The corner resume link
 */
export const ResumeLink: FC = () => (
  <a className="resume-link" href={RESUME.href} target="_blank" rel="noreferrer">
    <span>{RESUME.label}</span>
    <svg
      viewBox="0 0 60 5"
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <path d="M1.5 3.1 Q16 0.9 30 2.7 Q44 4.5 58.5 1.9" vectorEffect="non-scaling-stroke" />
    </svg>
  </a>
);
