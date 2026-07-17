import { useEffect, type RefObject } from 'react';

import { INTRO, MOBILE_CUE_FADE_VH, MOBILE_SNAKE } from '../constants/animations';
import { clamp } from '../lib/easing';
import { buildMobileSnake, type Box, type MobileSnakeBoxes, type MobileSnakePath } from '../lib/snake';

/** Token-based colors the mobile nav toggles between as it frosts on scroll. */
const NAV = {
  bg: 'rgb(var(--paper) / 0.92)',
  border: 'rgb(var(--line-3))',
} as const;

/**
 * Drive the flowing mobile layout: frost the fixed nav past a small scroll offset, and scrub
 * the margin line so its drawn window tracks the reader down the page (drawing ahead of the
 * viewport, erasing behind). The line's geometry is rebuilt on resize / font load. Reveals of
 * individual blocks are handled separately by `useIntersectionReveal`.
 * @param rootRef - Ref to the mobile wrapper that contains the nav, sections, and line SVG
 * @param reducedMotion - When `true`, skip the timed intro draw (the line still tracks scroll)
 */
export function useMobileFilm(rootRef: RefObject<HTMLElement>, reducedMotion: boolean): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let path: MobileSnakePath | null = null;
    let running = true;
    const bornAt = performance.now();
    // Timestamp of the first successful path build; the intro draw is clocked from here (not
    // from mount) so a late font load can't start the underline mid-stroke.
    let pathReadyAt: number | null = null;
    const nodeCache = new Map<string, Element>();

    const pick = <T extends Element = HTMLElement>(key: string): T | null => {
      const hit = nodeCache.get(key);
      if (hit && hit.isConnected) return hit as unknown as T;
      const el = root.querySelector<T>(`[data-fx="${key}"]`);
      if (el) nodeCache.set(key, el);
      else nodeCache.delete(key);
      return el;
    };

    /** Measure a `data-fx` box relative to the mobile wrapper. */
    const boxOf = (key: string): Box | null => {
      const el = pick(key);
      if (!el) return null;
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== root) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };

    const buildSnake = (): void => {
      const measure = pick<SVGPathElement>('mMeasure');
      if (!measure) return;
      const u0 = boxOf('mU0');
      const u1 = boxOf('mU1');
      const frames = [boxOf('mF1'), boxOf('mF2'), boxOf('mF3')];
      const entries = [boxOf('mX0'), boxOf('mX1'), boxOf('mX2'), boxOf('mX3'), boxOf('mX4')];
      const contact = boxOf('mContact');
      if (!u0 || !u1 || frames.some((b) => !b) || entries.some((b) => !b) || !contact) return;
      const built = buildMobileSnake(
        {
          u0,
          u1,
          frames: frames as MobileSnakeBoxes['frames'],
          entries: entries as MobileSnakeBoxes['entries'],
          contactTop: contact.y,
        },
        measure
      );
      if (!built) return;
      const line = pick<SVGPathElement>('mSnake');
      if (line) line.setAttribute('d', built.d);
      path = built;
      if (pathReadyAt === null) pathReadyAt = performance.now();
    };

    /** Map a document-Y to a length along the line, interpolating between anchor marks. */
    const lengthAt = (docY: number, snake: MobileSnakePath): number => {
      const { ys, marks } = snake;
      if (docY <= ys[0]) return 0;
      if (docY >= ys[ys.length - 1]) return snake.total;
      let i = 0;
      while (i < ys.length - 2 && ys[i + 1] < docY) i++;
      return marks[i] + ((marks[i + 1] - marks[i]) * Math.max(0, docY - ys[i])) / (ys[i + 1] - ys[i] || 1);
    };

    const frame = (): void => {
      const vh = window.innerHeight || 1;
      const y = window.scrollY || 0;

      const scrolled = y > 24;
      const nav = pick('mNav');
      if (nav) {
        Object.assign(nav.style, {
          background: scrolled ? NAV.bg : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottomColor: scrolled ? NAV.border : 'transparent',
        });
      }

      // Fade the hero scroll cue out over the first part-viewport of scroll (desktop parity).
      const cue = pick('mCue');
      if (cue) cue.style.opacity = `${clamp(1 - y / (vh * MOBILE_CUE_FADE_VH))}`;

      if (!path) buildSnake();
      const line = pick<SVGPathElement>('mSnake');
      if (path && line) {
        const tip = y + vh * MOBILE_SNAKE.tipAheadVh;
        // Draw the intro from the later of (mount + delay) and (path ready), so the first
        // segment always animates smoothly from nothing rather than jumping in mid-stroke.
        const drawStart = Math.max(bornAt + INTRO.delayMs, pathReadyAt ?? bornAt + INTRO.delayMs);
        const introFrac = reducedMotion ? 1 : clamp((performance.now() - drawStart) / MOBILE_SNAKE.introMs);
        // At the very top, the intro alone draws the first segment from nothing; the moment the
        // reader scrolls, the scroll-scrubbed head takes over (never retracting below the intro).
        const head = Math.max(path.marks[1] * introFrac, y > 0 ? lengthAt(tip, path) : 0);
        const tail = Math.min(lengthAt(tip - vh * MOBILE_SNAKE.tailLagVh, path), head);
        const windowLen = Math.max(0.1, head - tail);
        line.style.strokeDasharray = `${windowLen}px ${path.total + 100}px`;
        line.style.strokeDashoffset = `${-tail}px`;
        line.style.opacity = windowLen > 1 ? '1' : '0';
      }
    };

    const invalidate = (): void => {
      path = null;
    };
    window.addEventListener('resize', invalidate);
    if (document.fonts?.ready) void document.fonts.ready.then(invalidate);
    const settle = window.setTimeout(invalidate, 1400);

    const loop = (): void => {
      if (!running) return;
      frame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('resize', invalidate);
      window.clearTimeout(settle);
    };
  }, [rootRef, reducedMotion]);
}
