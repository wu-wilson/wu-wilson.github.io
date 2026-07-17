import React from 'react';

import { Screenshot } from '../common/Screenshot';

import { PROJECTS } from '../../constants/content';

/** A dashed placeholder rectangle in the refactor skeleton. */
const dashedBox = (style: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  border: '1.5px dashed rgb(var(--brand))',
  ...style,
});

/** A faint filler line in the refactor skeleton. */
const fillerLine = (style: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  background: 'rgb(var(--faint))',
  ...style,
});

/**
 * The wireframe "refactor skeleton" that flashes over the media frame at each project hand-off
 * — dashed boxes and filler lines suggesting a design being rebuilt between projects.
 * @returns The skeleton overlay
 */
const RefactorSkeleton: React.FC = () => (
  <div
    data-fx="skel"
    style={{ position: 'absolute', inset: 0, opacity: 0, background: 'rgb(var(--skel))', pointerEvents: 'none' }}
  >
    <div style={dashedBox({ top: '12%', left: '8%', width: '44%', height: '34%' })} />
    <div style={fillerLine({ top: '14%', left: '58%', width: '30%', height: 5 })} />
    <div style={fillerLine({ top: '22%', left: '58%', width: '34%', height: 3 })} />
    <div style={fillerLine({ top: '27%', left: '58%', width: '28%', height: 3 })} />
    <div style={dashedBox({ top: '56%', left: '26%', width: '52%', height: '30%', transform: 'rotate(-1deg)' })} />
    <div style={fillerLine({ top: '62%', left: '8%', width: '14%', height: 4 })} />
  </div>
);

/**
 * The project media frame — three overlapping screenshots the engine cross-fades (with a wipe
 * on the first) and the refactor skeleton that flashes between them.
 * @returns The media frame
 */
export const ProjectMedia: React.FC = () => (
  <div
    data-fx="pmedia"
    style={{
      position: 'absolute',
      left: '34.4%',
      right: 0,
      top: '50%',
      height: 'min(560px, 62vh)',
      transform: 'translate(0, -50%)',
      overflow: 'hidden',
    }}
  >
    {PROJECTS.map((project, i) => (
      <div
        key={project.imageKey}
        data-fx={`pm${i + 1}`}
        style={{ position: 'absolute', inset: 0, opacity: i > 0 ? 0 : 1 }}
      >
        <Screenshot imageKey={project.imageKey} alt={project.imageAlt} href={project.liveUrl} />
      </div>
    ))}
    <RefactorSkeleton />
  </div>
);
