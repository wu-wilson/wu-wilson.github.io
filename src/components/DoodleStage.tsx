import type { FC } from 'react';

import { NS } from '../lib/doodle';

import { STROKE_WIDTH } from '../constants/animations';

/** Ink stroke/fill, resolved from the CSS token so the palette stays in one place. */
const INK = 'rgb(var(--ink))';

/**
 * The single SVG that holds the whole doodle: the `NS` stroke paths (`data-s`) and the rampr axis
 * labels (`data-axes`), inside the group the engine transforms to place and scale them
 * (`data-zoom`). Paths render empty — the engine paints their `d`, opacity, and fill every frame.
 * @returns The doodle SVG
 */
export const DoodleStage: FC = () => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', stroke: INK }}
  >
    <g data-zoom strokeWidth={STROKE_WIDTH}>
      {Array.from({ length: NS }, (_, i) => (
        <path key={i} data-s={i} />
      ))}
      <g data-axes opacity={0}>
        <text x={762} y={662} fontSize={34} stroke="none" style={{ fill: INK }}>
          time
        </text>
        <text
          x={520}
          y={480}
          fontSize={34}
          stroke="none"
          transform="rotate(-90 520 480)"
          style={{ fill: INK }}
        >
          hiring
        </text>
      </g>
    </g>
  </svg>
);
