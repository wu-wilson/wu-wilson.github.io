import React from 'react';

import { ProjectMedia } from './ProjectMedia';
import { ProjectText } from './ProjectText';

import { PROJECTS } from '../../constants/content';

/**
 * Scene 3 — Projects. A pinned two-column scene: the text column cross-fades through the three
 * projects while the media frame swaps screenshots, swings toward the margin for the middle
 * project, and flashes a refactor skeleton at each hand-off. Chapter dashes track progress.
 * @returns The projects scene
 */
export const Projects: React.FC = () => (
  <div
    data-fx="proj"
    style={{ position: 'absolute', inset: 0, zIndex: 10, opacity: 0, visibility: 'hidden' }}
  >
    <div style={{ width: 'min(1280px, 92vw)', height: '100%', margin: '0 auto', position: 'relative' }}>
      <div data-fx="ptext" style={{ position: 'absolute', left: 64, top: 0, bottom: 0, width: 'calc(29.7% - 64px)' }}>
        {PROJECTS.map((project, i) => (
          <ProjectText
            key={project.imageKey}
            fx={`pt${i + 1}`}
            project={project}
            total={PROJECTS.length}
            hidden={i > 0}
          />
        ))}
      </div>

      <ProjectMedia />

      <div style={{ position: 'absolute', left: '50%', bottom: 26, transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        <div data-fx="d1" style={{ width: 44, height: 3, background: 'rgb(var(--brand))' }} />
        <div data-fx="d2" style={{ width: 44, height: 3, background: 'rgb(var(--line-2))' }} />
        <div data-fx="d3" style={{ width: 44, height: 3, background: 'rgb(var(--line-2))' }} />
      </div>
    </div>
  </div>
);
