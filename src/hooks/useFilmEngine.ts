import { useEffect, type RefObject } from 'react';

import { FILM, INTRO, PROGRESS_SMOOTHING } from '../constants/animations';
import { clamp, easeInOut, lerp, segment } from '../lib/easing';
import { buildDesktopSnake, type Box, type DesktopSnakeBoxes, type SnakePath } from '../lib/snake';

/** Token-based color strings (resolved from `:root`) the engine assigns imperatively. */
const COLOR = {
  brand: 'rgb(var(--brand))',
  gray: 'rgb(var(--muted-2))',
  dim: 'rgb(var(--line-2))',
  navBg: 'rgb(var(--paper) / 0.92)',
  navBorder: 'rgb(var(--line-3))',
  snakeWhite: 'rgb(var(--paper-on-blue))',
} as const;

/**
 * Drive the pinned desktop "film": one `requestAnimationFrame` loop maps scroll position to a
 * smoothed progress value and positions every scene, the career chart, the flood, and the
 * single travelling line as pure functions of that progress. Elements are located by their
 * `data-fx` marker within the track, so scenes can live in separate components. Honors
 * reduced-motion by dropping the progress smoothing and timed intro draw.
 * @param rootRef - Ref to the full-height scroll track (the sticky stage lives inside it)
 * @param reducedMotion - When `true`, run the scrubbed layout without decorative motion
 */
export function useFilmEngine(rootRef: RefObject<HTMLElement>, reducedMotion: boolean): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Mutable per-run engine state (kept in closure, not React state — updated every frame).
    let smoothed: number | null = null;
    let snake: SnakePath | null = null;
    let pmediaSignature: Box | null = null;
    let geometryCheck = 0;
    let mediaShiftX = 0;
    let running = true;
    const bornAt = performance.now();
    const nodeCache = new Map<string, Element>();
    const lengthCache = new WeakMap<SVGPathElement, number>();

    /** Resolve a `data-fx` element within the track, caching until it disconnects. */
    const pick = <T extends Element = HTMLElement>(key: string): T | null => {
      const hit = nodeCache.get(key);
      if (hit && hit.isConnected) return hit as unknown as T;
      const el = root.querySelector<T>(`[data-fx="${key}"]`);
      if (el) nodeCache.set(key, el);
      else nodeCache.delete(key);
      return el;
    };

    /** Assign inline styles to a `data-fx` element, if present. */
    const set = (key: string, styles: Record<string, string>): void => {
      const el = pick(key);
      if (el) Object.assign(el.style, styles);
    };

    /** Measure an element's box relative to the sticky stage (the SVG overlay's origin). */
    const measureBox = (el: HTMLElement): Box => {
      const stage = pick('stage');
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== stage) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };

    /** Measure a named `data-fx` box, or `null` if not mounted yet. */
    const boxOf = (key: string): Box | null => {
      const el = pick(key);
      return el ? measureBox(el) : null;
    };

    /** Cached total length of an SVG path. */
    const pathLength = (el: SVGPathElement): number => {
      const cached = lengthCache.get(el);
      if (cached != null) return cached;
      let length = 0;
      try {
        length = el.getTotalLength();
      } catch {
        length = 0;
      }
      lengthCache.set(el, length);
      return length;
    };

    /** Draw a stroke-dashed path (an axis) to a fraction of its length. */
    const drawPath = (key: string, t: number): void => {
      const el = pick<SVGPathElement>(key);
      if (!el) return;
      const length = pathLength(el);
      el.style.strokeDasharray = `${length}px`;
      el.style.strokeDashoffset = `${length * (1 - t)}px`;
    };

    /** (Re)build the travelling line from the current layout and paint its `d`. */
    const buildSnake = (): void => {
      const measure = pick<SVGPathElement>('measure');
      if (!measure) return;
      const boxes = {
        heroUnder: boxOf('heroUnder'),
        aboutU: boxOf('aboutU'),
        pmedia: boxOf('pmedia'),
        chartBox: boxOf('chartBox'),
        cu: boxOf('cu'),
      };
      if (Object.values(boxes).some((box) => box === null)) return;
      const built = buildDesktopSnake(boxes as DesktopSnakeBoxes, measure);
      if (!built) return;
      const path = pick<SVGPathElement>('snake');
      if (path) path.setAttribute('d', built.d);
      snake = built;
      pmediaSignature = boxes.pmedia;
    };

    const frame = (): void => {
      const vh = window.innerHeight || 1;
      const max = root.offsetHeight - vh;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const raw = max > 0 ? clamp(y / max) : 0;

      if (smoothed === null || reducedMotion) smoothed = raw;
      else {
        smoothed += (raw - smoothed) * PROGRESS_SMOOTHING;
        if (Math.abs(raw - smoothed) < 0.0004) smoothed = raw;
      }
      const p = smoothed;
      const seg = (a: number, b: number): number => segment(p, a, b);
      const E = easeInOut;

      // Ruled ground: fixed in place, fading out under the contact flood.
      set('hatch', { opacity: `${1 - seg(FILM.hatchFade[0], FILM.hatchFade[1])}` });

      // Nav: transparent → frosted + condensed once scrolled; active link tracks the scene.
      const condensed = p > FILM.navCondense;
      set('nav', {
        background: condensed ? COLOR.navBg : 'transparent',
        backdropFilter: condensed ? 'blur(8px)' : 'none',
        borderBottomColor: condensed ? COLOR.navBorder : 'transparent',
      });
      set('navIn', { padding: condensed ? '14px 0 14px 64px' : '26px 0 26px 64px' });
      const na = FILM.navActive;
      const activeLink =
        p < na.about
          ? ''
          : p < na.projects
            ? 'about'
            : p < na.experience
              ? 'projects'
              : p < na.contact
                ? 'experience'
                : 'contact';
      (['about', 'projects', 'experience', 'contact'] as const).forEach((key) =>
        set(`nav-${key}`, { color: activeLink === key ? COLOR.brand : COLOR.gray })
      );

      // Scene 1 · Hero.
      const heroExit = E(seg(FILM.hero.exit[0], FILM.hero.exit[1]));
      set('hero', {
        opacity: `${1 - 0.92 * heroExit}`,
        transform: `translateY(${-70 * heroExit}px) scale(${1 - 0.05 * heroExit})`,
        visibility: p > FILM.hero.hide ? 'hidden' : 'visible',
      });
      set('cue', { opacity: `${1 - seg(FILM.hero.cueFade[0], FILM.hero.cueFade[1])}` });

      // Scene 2 · About.
      const aboutIn = E(seg(FILM.about.in[0], FILM.about.in[1]));
      const aboutOut = E(seg(FILM.about.out[0], FILM.about.out[1]));
      set('about', {
        opacity: `${aboutIn * (1 - 0.95 * aboutOut)}`,
        transform: `translateY(${40 * (1 - aboutIn) - 70 * aboutOut}px) scale(${1 - 0.045 * aboutOut})`,
        visibility: p < FILM.about.show[0] || p > FILM.about.show[1] ? 'hidden' : 'visible',
      });
      const kicker = E(seg(FILM.about.kicker[0], FILM.about.kicker[1]));
      const title = E(seg(FILM.about.title[0], FILM.about.title[1]));
      const body = E(seg(FILM.about.body[0], FILM.about.body[1]));
      set('aboutK', { opacity: `${kicker}`, transform: `translateY(${24 * (1 - kicker)}px)` });
      set('aboutT', { opacity: `${title}`, transform: `translateY(${24 * (1 - title)}px)` });
      set('aboutB', { opacity: `${body}`, transform: `translateY(${24 * (1 - body)}px)` });

      // Cut · blueprint caption bridging About → Projects.
      set('bp', {
        opacity: `${seg(FILM.blueprint.in[0], FILM.blueprint.in[1]) * (1 - seg(FILM.blueprint.out[0], FILM.blueprint.out[1]))}`,
      });

      // Scene 3 · Projects.
      const projIn = E(seg(FILM.projects.in[0], FILM.projects.in[1]));
      const projOut = E(seg(FILM.projects.out[0], FILM.projects.out[1]));
      set('proj', {
        opacity: `${projIn * (1 - projOut)}`,
        transform: `scale(${1 - 0.04 * projOut})`,
        visibility: p < FILM.projects.show[0] || p > FILM.projects.show[1] ? 'hidden' : 'visible',
      });

      const cross = FILM.projects.cross;
      let cf: number;
      if (p < cross.t01[0]) cf = 0;
      else if (p < cross.t01[1]) cf = E(seg(cross.t01[0], cross.t01[1]));
      else if (p < cross.hold1[1]) cf = 1;
      else if (p < cross.t12[1]) cf = 1 + E(seg(cross.t12[0], cross.t12[1]));
      else cf = 2;

      const near = (i: number): number => Math.max(0, 1 - Math.abs(cf - i) * 2);
      const wipe = E(seg(FILM.projects.mediaWipe[0], FILM.projects.mediaWipe[1]));
      for (let i = 0; i < 3; i++) {
        const proximity = near(i);
        const events = proximity > 0.5 ? 'auto' : 'none';
        set(`pt${i + 1}`, { opacity: `${proximity}`, pointerEvents: events });
        const mediaStyles: Record<string, string> = {
          opacity: `${proximity}`,
          pointerEvents: events,
        };
        if (i === 0) mediaStyles.clipPath = `inset(0 ${(1 - wipe) * 100}% 0 0)`;
        set(`pm${i + 1}`, mediaStyles);
      }
      const frac = cf % 1;
      set('skel', { opacity: `${frac > 0 ? Math.max(0, 1 - Math.abs(frac - 0.5) * 3) : 0}` });

      // Layout swing: the media frame drifts to the margin (and text opposite) mid-scene.
      const swing = cf <= 1 ? cf : 2 - cf;
      const textEl = pick('ptext');
      const mediaEl = pick('pmedia');
      mediaShiftX = 0;
      if (textEl && mediaEl) {
        mediaShiftX = (64 - mediaEl.offsetLeft) * swing;
        const textShift = (64 + mediaEl.offsetWidth + 28 - textEl.offsetLeft) * swing;
        set('ptext', { transform: `translateX(${textShift}px)` });
        set('pmedia', { transform: `translate(${mediaShiftX}px, -50%)` });
      }
      const chapter = Math.round(cf);
      set('d1', { background: chapter === 0 ? COLOR.brand : COLOR.dim });
      set('d2', { background: chapter === 1 ? COLOR.brand : COLOR.dim });
      set('d3', { background: chapter === 2 ? COLOR.brand : COLOR.dim });

      // Scene 4 · Experience (career chart draws itself, then the flood dims it).
      const expIn = E(seg(FILM.experience.in[0], FILM.experience.in[1]));
      const floodDim = 1 - 0.6 * seg(0.87, 0.93);
      set('exp', {
        opacity: `${expIn * floodDim}`,
        visibility:
          p < FILM.experience.show[0] || p > FILM.experience.show[1] ? 'hidden' : 'visible',
      });
      const header = E(seg(FILM.experience.header[0], FILM.experience.header[1]));
      set('expH', { opacity: `${header}`, transform: `translateY(${20 * (1 - header)}px)` });
      drawPath('ay', E(seg(FILM.experience.axisY[0], FILM.experience.axisY[1])));
      drawPath('ax', E(seg(FILM.experience.axisX[0], FILM.experience.axisX[1])));
      FILM.experience.nodes.forEach((threshold, i) => {
        const t = E(seg(threshold, threshold + 0.02));
        set(`n${i}`, { transform: `scale(${t * (1 + 0.3 * Math.sin(t * Math.PI))})` });
        set(`l${i}`, { opacity: `${t}`, transform: `translateY(${10 * (1 - t)}px)` });
      });
      const pulse = E(seg(FILM.experience.pulse[0], FILM.experience.pulse[1]));
      set('pulse', { opacity: `${0.22 * pulse}`, transform: `scale(${pulse})` });

      // Flood + Scene 5 · Contact.
      set('flood', {
        transform: `translateY(${(1 - E(seg(FILM.flood[0], FILM.flood[1]))) * 101}%)`,
      });
      const contactIn = E(seg(FILM.contact.in[0], FILM.contact.in[1]));
      set('contact', {
        opacity: `${contactIn}`,
        transform: `translateY(${50 * (1 - contactIn)}px)`,
        visibility: p < FILM.contact.show ? 'hidden' : 'visible',
      });
      set('cfoot', { opacity: `${seg(FILM.contact.foot[0], FILM.contact.foot[1])}` });

      // The line: invalidate geometry if the media frame moved, then scrub its drawing window.
      geometryCheck += 1;
      if (geometryCheck % 40 === 0 && snake && pmediaSignature) {
        const bb = boxOf('pmedia');
        if (bb && (Math.abs(bb.x - pmediaSignature.x) > 1.5 || Math.abs(bb.w - pmediaSignature.w) > 1.5)) {
          snake = null;
        }
      }
      if (!snake) buildSnake();
      const path = pick<SVGPathElement>('snake');
      if (snake && path) {
        const c = snake.marks;
        const introT = reducedMotion
          ? 1
          : clamp((performance.now() - bornAt - INTRO.delayMs) / INTRO.durationMs);
        let s: number;
        let e: number;
        if (p < 0.1) {
          s = 0;
          e = c[1] * E(introT);
        } else if (p < 0.16) {
          e = lerp(c[1], c[3], E(seg(0.1, 0.152)));
          s = lerp(0, c[2], E(seg(0.108, 0.16)));
        } else if (p < 0.24) {
          s = c[2];
          e = c[3];
        } else if (p < 0.31) {
          e = lerp(c[3], c[5], E(seg(0.24, 0.3)));
          s = lerp(c[2], c[4], E(seg(0.25, 0.31)));
        } else if (p < 0.56) {
          s = c[4];
          e = c[5];
        } else if (p < 0.87) {
          e = p < 0.65 ? lerp(c[5], c[6], E(seg(0.56, 0.635))) : lerp(c[6], c[7], seg(0.65, 0.8));
          s = lerp(c[4], c[6], E(seg(0.575, 0.7)));
        } else {
          s = lerp(c[6], c[8], E(seg(0.87, 0.955)));
          e = lerp(c[7], c[9], E(seg(0.885, 0.97)));
        }
        const windowLen = Math.max(0.1, e - s);
        path.style.strokeDasharray = `${windowLen}px ${snake.total + 20}px`;
        path.style.strokeDashoffset = `${-s}px`;
        path.style.stroke = p > FILM.contact.snakeWhite ? COLOR.snakeWhite : COLOR.brand;
        path.style.opacity = windowLen < 1 ? '0' : '1';
        set('snakeG', { transform: `translateX(${mediaShiftX}px)` });
      }
    };

    const invalidate = (): void => {
      snake = null;
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
