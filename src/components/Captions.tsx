import type { CSSProperties, FC } from 'react';

import { CONTACT_LINKS, PROJECTS, WORK_HISTORY } from '../constants/content';

/** A dimmed `.85em` sub-line for the work-history entries. */
const subLineStyle: CSSProperties = { fontSize: '0.85em', color: 'rgb(var(--ink-soft))' };

/** A `.85em` contact link — smaller, but keeps the teal link color. */
const linkSubStyle: CSSProperties = { fontSize: '0.85em' };

/** Column wrapper for the multi-line captions (work, contact). */
const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

/**
 * The seven one-line captions, one per stage, in scroll order and tagged `data-ann={i}` — the
 * engine positions each under the drawing band and wipes it in as its stage arrives. Base
 * layout and the starting clip live in the `[data-ann]` rule in `index.css`.
 * @returns The caption layer
 */
export const Captions: FC = () => (
  <>
    <div data-ann={0}>
      <span>hi, i'm wilson. i build things.</span>
    </div>

    <div data-ann={1}>
      <span>
        i built{' '}
        <a href={PROJECTS.krawly.href} target="_blank" rel="noreferrer">
          {PROJECTS.krawly.label}
        </a>
        , a little spider that maps any website's dependencies into a graph.
      </span>
    </div>

    <div data-ann={2}>
      <span>
        then came{' '}
        <a href={PROJECTS.tallies.href} target="_blank" rel="noreferrer">
          {PROJECTS.tallies.label}
        </a>
        , a bill splitter that turns receipts into shareable breakdowns.
      </span>
    </div>

    <div data-ann={3}>
      <span>
        and{' '}
        <a href={PROJECTS.rampr.href} target="_blank" rel="noreferrer">
          {PROJECTS.rampr.label}
        </a>
        , which shows who's ramping up hiring and who's slowing down.
      </span>
    </div>

    <div data-ann={4}>
      <div style={stackStyle}>
        <span>when i'm not building those, i'm building at work.</span>
        {WORK_HISTORY.map((line) => (
          <span key={line} style={subLineStyle}>
            {line}
          </span>
        ))}
      </div>
    </div>

    <div data-ann={5}>
      <span>most of it happens over a cup of coffee.</span>
    </div>

    <div data-ann={6}>
      <div style={stackStyle}>
        <span>if you want to build something together, let's talk.</span>
        {CONTACT_LINKS.map((link) => {
          const external = !link.href.startsWith('mailto:');
          return (
            <a
              key={link.href}
              href={link.href}
              style={linkSubStyle}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  </>
);
