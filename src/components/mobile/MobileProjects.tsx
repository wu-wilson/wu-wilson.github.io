import React from 'react';

import { ProjectLinks } from '../common/ProjectLinks';
import { Screenshot } from '../common/Screenshot';
import { Tags } from '../common/Tags';

import { PROJECTS } from '../../constants/content';

/**
 * The mobile projects list — a heading and one revealed card per project (number, screenshot,
 * name, short blurb, tags, links). Each frame carries the `data-fx` the margin line traces.
 * @returns The mobile projects section
 */
export const MobileProjects: React.FC = () => (
  <div
    data-fx="mProj"
    style={{ padding: '72px 24px 64px', display: 'flex', flexDirection: 'column', gap: 52 }}
  >
    <h2
      data-io="1"
      className="font-display"
      style={{ opacity: 0, transform: 'translateY(24px)', fontWeight: 900, fontSize: 30, color: 'rgb(var(--ink))', margin: 0 }}
    >
      PROJECTS<span style={{ color: 'rgb(var(--brand))' }}>.</span>
    </h2>
    {PROJECTS.map((project, i) => (
      <div key={project.imageKey} data-io="1" style={{ opacity: 0, transform: 'translateY(24px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="font-display" style={{ transform: 'rotate(0.8deg)', fontWeight: 900, fontSize: 38, lineHeight: 1, color: 'rgb(var(--faint))' }}>
          {project.index}
          <span style={{ color: 'rgb(var(--brand))', fontSize: 20 }}>/{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>
        <div data-fx={`mF${i + 1}`} style={{ width: '100%', height: 210, border: '1.5px solid rgb(var(--line-1))', position: 'relative', overflow: 'hidden' }}>
          <Screenshot imageKey={project.imageKey} alt={project.imageAlt} href={project.liveUrl} />
        </div>
        <h3 className="font-display" style={{ transform: 'rotate(-0.5deg)', fontWeight: 800, fontSize: 24, color: 'rgb(var(--ink))', margin: 0 }}>
          {project.name}
        </h3>
        <div className="font-display" style={{ fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'rgb(var(--muted-1))' }}>
          {project.blurbShort}
        </div>
        <Tags tags={project.tagsShort} />
        <ProjectLinks liveUrl={project.liveUrl} sourceUrl={project.sourceUrl} gap={14} fontSize={11} />
      </div>
    ))}
  </div>
);
