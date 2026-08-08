import { useEffect, type RefObject } from 'react';

import { clamp01, extent, NP, NS, smoothstep, strokePath } from '../lib/doodle';

import {
  BOIL_AMP,
  BOIL_MS,
  CAP_GAP,
  DOODLE_MAX_PX,
  DOODLE_WORLD_SIZE,
  DWELL_HOLD,
  DWELL_MORPH,
  EASE,
  HINT_FADE,
  HINT_NUDGE_PX,
  REVEAL_HALF,
  REVEAL_RAMP,
  STROKE_WIDTH,
} from '../constants/animations';
import { ANCHORS, STAGES } from '../constants/stages';

import type { Point } from '../types/doodle';

/** Ink fill for the tie, eyes, and coffee surface; token-based so the palette stays in CSS. */
const inkFill = (alpha: number): string => 'rgb(var(--ink) / ' + alpha.toFixed(3) + ')';

/**
 * The engine's one reveal shape: ramps up through the previous half-stage, holds while stage `i`
 * is on screen, ramps back down through the next. Drives the caption wipes, the axis labels, and
 * every fill.
 * @param q - Timeline position in stage units (`progress × (STAGES.length - 1)`)
 * @param i - Stage index the window is centred on
 * @returns Reveal amount in `[0, 1]`
 */
const stageWindow = (q: number, i: number): number =>
  clamp01((q - (i - REVEAL_HALF)) * REVEAL_RAMP) * clamp01((i + REVEAL_HALF - q) * REVEAL_RAMP);

/** Fresh boil jitter: `NS × NP` random `[dx, dy]` offsets in world px, uniform in `[-AMP/2, +AMP/2]`. */
const makeJitter = (): Point[][] =>
  Array.from({ length: NS }, () =>
    Array.from({ length: NP }, (): Point => [
      (Math.random() - 0.5) * BOIL_AMP,
      (Math.random() - 0.5) * BOIL_AMP,
    ])
  );

/**
 * Drive the doodle film: one `requestAnimationFrame` loop turns scroll position into a smoothed
 * progress value, then paints the whole frame as a pure function of it — morph, boil, band
 * layout, and caption wipes. Animated elements are found by their `data-*` marker inside the
 * stage, so they can live in separate components.
 * @param rootRef - Ref to the fixed stage: container of the animated elements, and the surface
 * every layout number is measured from
 * @param reducedMotion - When `true`, snap to the scroll position and disable the idle wobble
 */
export function useNotebookFilm(rootRef: RefObject<HTMLElement>, reducedMotion: boolean): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-s]'));
    const anns = Array.from(root.querySelectorAll<HTMLElement>('[data-ann]'));
    const zoom = root.querySelector<SVGGElement>('[data-zoom]');
    const hint = root.querySelector<HTMLElement>('[data-hint]');
    const axes = root.querySelector<SVGGElement>('[data-axes]');

    // Mutable per-run state, kept in closure (updated every frame, never React state).
    let cur = 0;
    let target = 0;
    let dirty = true;
    let measureKey: string | null = null;
    // Always measured (below) before they are first read; 0 is just a placeholder.
    let capH = 0;
    let openingCapH = 0;
    let hintH = 0;
    let jitter = makeJitter();
    let raf = 0;

    // The stage's own box, and the source of every layout number below — not
    // `window.innerWidth/innerHeight`. The two disagree whenever mobile browser chrome animates
    // (pull-to-refresh, toolbar collapse): the window reports the visual viewport while the fixed
    // stage keeps its own size, so sizing the drawing from the window paints it into a surface it
    // was not measured for. The SVG fills this box exactly (`inset: 0`, 100%×100%), so measuring
    // the stage also keeps the engine's slice scale identical to the one the SVG really applies.
    let stageW = 0;
    let stageH = 0;
    const measureStage = () => {
      const rect = root.getBoundingClientRect();
      stageW = rect.width;
      stageH = rect.height;
    };
    measureStage();

    const paint = (p: number) => {
      const K = STAGES.length - 1;
      const q = p * K;
      const k = Math.min(K - 1, Math.floor(q));
      // Dwell: hold each finished doodle, morph only through the middle of its segment.
      const f = smoothstep((q - k - DWELL_HOLD) / DWELL_MORPH);

      // Two fixed screen bands per stage — drawing on top, caption below — so the caption
      // top sits at the same height for every stage. Phone landscape splits left/right instead.
      // 1600×900 mirrors DoodleStage's viewBox; 800/450 further down are its centre.
      const kSlice = Math.max(stageW / 1600, stageH / 900);
      const landscape = stageH < 480 && stageW > stageH;

      // Measure once per stage size (re-measured on resize/font load): the tallest caption, stage
      // 0's alone, and the scroll cue's.
      if (!landscape && measureKey !== stageW + 'x' + stageH) {
        measureKey = stageW + 'x' + stageH;
        const capHeights = anns.map((g) => g.offsetHeight || 0);
        capH = Math.max(60, ...capHeights);
        openingCapH = capHeights[0] || capH;
        hintH = hint ? hint.offsetHeight : 0;
      }
      const capBand = landscape ? 0 : capH;
      // Drawing size: 65% of the smaller side, hard-capped, shrunk to fit the stage if needed.
      const D = landscape
        ? Math.min(0.78 * stageH, 0.42 * stageW)
        : Math.max(
            120,
            Math.min(0.65 * Math.min(stageW, stageH), DOODLE_MAX_PX, stageH - 44 - CAP_GAP - capBand)
          );
      const s = D / (DOODLE_WORLD_SIZE * kSlice);
      const unitTop = landscape
        ? (stageH - D) / 2
        : Math.max(22, (stageH - (D + CAP_GAP + capBand)) / 2);
      const drawCX = landscape ? 0.3 * stageW : stageW / 2;
      const drawCY = unitTop + D / 2;
      const capTop = unitTop + D + CAP_GAP;

      // Pin the interpolated anchor (the doodle's visual centre) to the drawing band's centre.
      const aA = ANCHORS[k];
      const aB = ANCHORS[k + 1];
      const acx = aA[0] + (aB[0] - aA[0]) * f;
      const acy = aA[1] + (aB[1] - aA[1]) * f;
      const vbx = 800 + (drawCX - stageW / 2) / kSlice;
      const vby = 450 + (drawCY - stageH / 2) / kSlice;
      if (zoom) {
        zoom.setAttribute(
          'transform',
          'translate(' + (vbx - acx * s).toFixed(1) + ' ' + (vby - acy * s).toFixed(1) + ') scale(' + s.toFixed(4) + ')'
        );
      }

      if (hint) {
        hint.style.opacity = p < HINT_FADE ? '1' : '0';
        // Draw the arrow with the same pen as the doodle. The group scale and the slice scale
        // cancel in `STROKE_WIDTH × s × kSlice`, so the drawing's rendered stroke is only ever
        // `STROKE_WIDTH × D / DOODLE_WORLD_SIZE` px — which the arrow's paths adopt verbatim via
        // `non-scaling-stroke`. `D` folds in the measured caption height, so CSS cannot derive it.
        hint.style.setProperty(
          '--hint-stroke',
          ((STROKE_WIDTH * D) / DOODLE_WORLD_SIZE).toFixed(2) + 'px'
        );
        if (landscape) {
          hint.style.top = 'auto';
          hint.style.bottom = '12px';
        } else {
          hint.style.bottom = 'auto';
          // Under stage 0's caption rather than the tallest one's reservation — `HINT_FADE`
          // retires the hint before any other caption appears. The clamp subtracts
          // `HINT_NUDGE_PX` because the arrow's bob is a transform and never reaches layout.
          hint.style.top =
            Math.round(
              Math.min(capTop + openingCapH + 18, stageH - hintH - HINT_NUDGE_PX - 8)
            ) + 'px';
        }
      }

      const wHello = stageWindow(q, 0);
      const wKrawly = stageWindow(q, 1);
      const wWork = stageWindow(q, 4);
      const wCoffee = stageWindow(q, 5);

      const A = STAGES[k];
      const B = STAGES[k + 1];
      paths.forEach((path, si) => {
        const pa = A[si];
        const pb = B[si];
        const j = jitter[si];

        // Source extent scales the boil down for small features (eyes, dots); comparing source to
        // target detects strokes collapsing to — or growing from — a park point.
        const extA = extent(pa);
        const extB = extent(pb);
        const jScale = Math.min(1, extA / 110);

        const pts = pa.map((pt, i): Point => {
          // Taper boil to zero at stroke endpoints so joints stay connected.
          const env = Math.sin((Math.PI * i) / (pa.length - 1));
          return [
            pt[0] + (pb[i][0] - pt[0]) * f + j[i][0] * jScale * env,
            pt[1] + (pb[i][1] - pt[1]) * f + j[i][1] * jScale * env,
          ];
        });

        // Fade parked strokes instead of leaving a lingering dot on the page.
        let op = 1;
        if (extA < 6 && extB < 6) op = 0;
        else if (extB < 6) op = Math.max(0, 1 - f / 0.2);
        else if (extA < 6) op = clamp01((f - 0.8) / 0.2);
        else {
          // Mid-morph a stroke can still pinch down to almost nothing.
          const ext = extent(pts);
          if (ext < 2.5) op = Math.max(0, (ext - 0.5) / 2);
        }
        path.style.opacity = String(op);

        // The tie (slots 5, 15) fills and renders sharp only while the work stage is on screen.
        const sharp = (si === 5 || si === 15) && wWork > 0.5;
        path.setAttribute('d', strokePath(pts, sharp));

        if (si === 5 || si === 15) {
          path.style.fill = wWork > 0.01 ? inkFill(wWork) : 'none';
        } else if (si === 1 || si === 2 || si === 3) {
          // Eyes fill as solid ovals during the stick-figure and spider stages; slot 2 does
          // double duty, its coffee window filling the mug's surface.
          const we =
            si === 1
              ? Math.max(wHello, wWork)
              : si === 2
                ? Math.max(wHello, wWork, wKrawly, wCoffee)
                : wKrawly;
          path.style.fill = we > 0.01 ? inkFill(we) : 'none';
        }
      });

      // Captions wipe in left-to-right over their own stage's window; the rampr axis labels
      // share the tallies→rampr→work window via stage 3's.
      anns.forEach((g, i) => {
        const v = stageWindow(q, i);
        g.style.clipPath = 'inset(0 ' + ((1 - v) * 100).toFixed(2) + '% 0 0)';
        g.style.pointerEvents = v > 0.9 ? 'auto' : 'none';
        if (landscape) {
          g.style.left = '56%';
          g.style.width = '40vw';
          g.style.transform = 'translateY(-50%)';
          g.style.top = '50%';
          g.style.bottom = 'auto';
        } else {
          g.style.left = '';
          g.style.width = '';
          g.style.transform = '';
          g.style.top = Math.round(capTop) + 'px';
          g.style.bottom = 'auto';
        }
      });
      if (axes) axes.setAttribute('opacity', stageWindow(q, 3).toFixed(3));
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    // Re-measure and repaint whenever the drawing surface changes size. The observer is the
    // load-bearing trigger: it catches the stage's own box moving while browser chrome animates,
    // which a `resize` event does not reliably correspond to. Without it the layout would only
    // catch up on the next scroll or boil tick — and under reduced motion, never. The window
    // event stays as the fallback for changes the observer misses.
    const onResize = () => {
      measureStage();
      measureKey = null;
      dirty = true;
    };
    const stageObserver = new ResizeObserver(onResize);
    stageObserver.observe(root);

    let boil: ReturnType<typeof setInterval> | undefined;
    if (!reducedMotion) {
      boil = setInterval(() => {
        jitter = makeJitter();
        dirty = true;
      }, BOIL_MS);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();
    // The caption band is measured in px, so re-measure once the handwriting font swaps in.
    document.fonts.ready.then(() => {
      measureKey = null;
      dirty = true;
    });

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const moving = cur !== target;
      if (moving) {
        cur += (target - cur) * (reducedMotion ? 1 : EASE);
        if (Math.abs(target - cur) < 0.00005) cur = target;
      }
      // Repaint only when scrolling, boiling, or after a resize/font load.
      if (moving || dirty) {
        dirty = false;
        paint(cur);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      if (boil) clearInterval(boil);
      stageObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [rootRef, reducedMotion]);
}
