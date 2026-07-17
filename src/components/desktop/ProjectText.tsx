import React from 'react';

import { ProjectLinks } from '../common/ProjectLinks';
import { Tags } from '../common/Tags';

import type { Project } from '../../types/content';

interface ProjectTextProps {
  /** The `data-fx` marker the engine cross-fades (`pt1` / `pt2` / `pt3`). */
  fx: string;
  project: Project;
  /** Total project count, for the `NN/0N` chapter label. */
  total: number;
  /** Whether this panel starts hidden (only the first project is visible at rest). */
  hidden?: boolean;
}

/**
 * One project's text column — chapter number, name, blurb, tags, and links — stacked in the
 * pinned Projects scene. All three panels overlap; the engine cross-fades between them.
 * @param props - The panel marker, project data, total count, and initial visibility
 * @returns The project text panel
 */
export const ProjectText: React.FC<ProjectTextProps> = ({ fx, project, total, hidden }) => (
  <div
    data-fx={fx}
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 16,
      opacity: hidden ? 0 : 1,
    }}
  >
    <div
      className="font-display"
      style={{
        transform: 'rotate(0.8deg)',
        fontWeight: 900,
        fontSize: 'min(92px, 7vw)',
        lineHeight: 1,
        color: 'rgb(var(--faint))',
      }}
    >
      {project.index}
      <span style={{ color: 'rgb(var(--brand))' }}>/{String(total).padStart(2, '0')}</span>
    </div>
    <h2
      className="font-display"
      style={{
        transform: 'rotate(-0.6deg)',
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: '-0.015em',
        color: 'rgb(var(--ink))',
        margin: 0,
      }}
    >
      {project.name}
    </h2>
    <div
      className="font-display"
      style={{ fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: 'rgb(var(--muted-1))' }}
    >
      {project.blurb}
    </div>
    <Tags tags={project.tags} />
    <ProjectLinks liveUrl={project.liveUrl} sourceUrl={project.sourceUrl} />
  </div>
);
