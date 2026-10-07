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
  MORPH_STAGGER,
  REVEAL_HALF,
  REVEAL_RAMP,
  STROKE_WIDTH,
} from '../constants/animations';
import { ANCHORS, FILLS, STAGES } from '../constants/stages';

import type { Point } from '../types/doodle';

/**
 * The engine's one reveal shape: ramps up through the previous half-stage, holds while stage `i`
 * is on screen, ramps back down through the next. Drives the caption wipes, the axis labels, and
 * the tie's switch to sharp corners.
 * @param q - Timeline position in stage units (`progress × (STAGES.length - 1)`)
 * @param i - Stage index the window is centred on
 * @returns Reveal amount in `[0, 1]`
 */
const stageWindow = (q: number, i: number): number =>
  clamp01((q - (i - REVEAL_HALF)) * REVEAL_RAMP) * clamp01((i + REVEAL_HALF - q) * REVEAL_RAMP);

/** A stroke's mean height in world coords — where it sits, top to bottom. */
const midY = (pts: Point[]): number => pts.reduce((sum, pt) => sum + pt[1], 0) / pts.length;

/**
 * Each morph's stroke order, as a `0..1` rank per slot: strokes start top to bottom by where they
 * land (or, for one parking, where it leaves), so a transition reads as the next doodle being
 * drawn rather than every line moving at once.
 */
const MORPH_ORDER: number[][] = STAGES.slice(0, -1).map((A, k) => {
  const B = STAGES[k + 1];
  const heights = A.map((pa, si) => midY(extent(B[si]) < 6 ? pa : B[si]));
  const rank: number[] = [];
  heights
    .map((_, si) => si)
    .sort((a, b) => heights[a] - heights[b])
    .forEach((si, r) => {
      rank[si] = r / (NS - 1);
    });
  return rank;
});

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
    let sideCapH = 0;
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

    // The caption column for a layout: in phone landscape a right-hand column, narrowed to end at
    // a right-hand notch's safe area; otherwise the `[data-ann]` CSS defaults.
    const setColumn = (side: boolean) => {
      anns.forEach((g) => {
        g.style.left = side ? '56%' : '';
        g.style.width = side ? 'min(40vw, calc(44vw - env(safe-area-inset-right)))' : '';
        g.style.transform = side ? 'translateY(-50%)' : '';
      });
    };

    const paint = (p: number) => {
      const K = STAGES.length - 1;
      const q = p * K;
      const k = Math.min(K - 1, Math.floor(q));
      // Dwell: hold each finished doodle, morph only through the middle of its segment. `f` is the
      // whole morph's progress (it moves the anchor); each stroke runs its own staggered slice.
      const f = smoothstep((q - k - DWELL_HOLD) / DWELL_MORPH);
      const staggerSpan = DWELL_MORPH * MORPH_STAGGER;

      // Two fixed screen bands per stage — drawing on top, caption below — so the caption
      // top sits at the same height for every stage. Phone landscape splits left/right instead.
      // 1600×900 mirrors DoodleStage's viewBox; 800/450 further down are its centre.
      const kSlice = Math.max(stageW / 1600, stageH / 900);
      const wide = stageH < 480 && stageW > stageH;

      // Measure once per stage size (re-measured on resize/font load), each layout's caption
      // column applied first so a caption is never measured at another layout's width: the
      // tallest caption stacked under the drawing, stage 0's alone, the scroll cue, and, on a
      // phone-landscape stage, the tallest caption in the side column.
      if (measureKey !== stageW + 'x' + stageH) {
        measureKey = stageW + 'x' + stageH;
        if (wide) {
          setColumn(true);
          sideCapH = Math.max(...anns.map((g) => g.offsetHeight));
        }
        setColumn(false);
        const capHeights = anns.map((g) => g.offsetHeight);
        capH = Math.max(60, ...capHeights);
        openingCapH = capHeights[0] || capH;
        hintH = hint ? hint.offsetHeight : 0;
      }
      // Phone landscape puts the captions in a column beside the drawing, unless that column is
      // too narrow to hold them (a zoomed-in page); the stacked layout then takes over.
      const landscape = wide && sideCapH <= stageH;
      setColumn(landscape);

      const capBand = landscape ? 0 : capH;
      // Drawing size: 65% of the smaller side, hard-capped, and shrunk (to nothing if it must) so
      // the caption below keeps its room; the gap goes with it once there is no drawing.
      const D = landscape
        ? Math.min(0.78 * stageH, 0.42 * stageW)
        : Math.max(
            0,
            Math.min(0.65 * Math.min(stageW, stageH), DOODLE_MAX_PX, stageH - 44 - CAP_GAP - capBand)
          );
      const gap = D > 0 ? CAP_GAP : 0;
      const s = D / (DOODLE_WORLD_SIZE * kSlice);
      const unitTop = landscape
        ? (stageH - D) / 2
        : Math.max(22, (stageH - (D + gap + capBand)) / 2);
      const drawCX = landscape ? 0.3 * stageW : stageW / 2;
      const drawCY = unitTop + D / 2;
      const capTop = unitTop + D + gap;

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
        // Floored at 1px, so the cue keeps its arrow when a zoomed page shrinks the drawing away.
        hint.style.setProperty(
          '--hint-stroke',
          Math.max(1, (STROKE_WIDTH * D) / DOODLE_WORLD_SIZE).toFixed(2) + 'px'
        );
        if (landscape) {
          hint.style.top = 'auto';
          hint.style.bottom = 'calc(12px + env(safe-area-inset-bottom))';
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

      const wWork = stageWindow(q, 4);

      const A = STAGES[k];
      const B = STAGES[k + 1];
      paths.forEach((path, si) => {
        const pa = A[si];
        const pb = B[si];
        const j = jitter[si];
        // This stroke's own morph progress: its slice of the window starts later the lower it sits.
        const fs = smoothstep(
          (q - k - DWELL_HOLD - staggerSpan * MORPH_ORDER[k][si]) / (DWELL_MORPH - staggerSpan)
        );
        // Leaving a shape fades out over the stroke's first 20%; arriving fades in over its last.
        const leaving = Math.max(0, 1 - fs / 0.2);
        const arriving = clamp01((fs - 0.8) / 0.2);

        // The stroke's current extent scales the boil down for small features (eyes, dots);
        // comparing source to target detects strokes collapsing to — or growing from — a park
        // point.
        const extA = extent(pa);
        const extB = extent(pb);
        const jScale = Math.min(1, (extA + (extB - extA) * fs) / 110);

        const pts = pa.map((pt, i): Point => {
          // Taper boil to zero at stroke endpoints so joints stay connected.
          const env = Math.sin((Math.PI * i) / (pa.length - 1));
          return [
            pt[0] + (pb[i][0] - pt[0]) * fs + j[i][0] * jScale * env,
            pt[1] + (pb[i][1] - pt[1]) * fs + j[i][1] * jScale * env,
          ];
        });

        // Fade parked strokes instead of leaving a lingering dot on the page.
        let op = 1;
        if (extA < 6 && extB < 6) op = 0;
        else if (extB < 6) op = leaving;
        else if (extA < 6) op = arriving;
        else {
          // Mid-morph a stroke can still pinch down to almost nothing.
          const ext = extent(pts);
          if (ext < 2.5) op = Math.max(0, (ext - 0.5) / 2);
        }
        path.style.opacity = String(op);

        // The tie (slots 5, 15) renders sharp only while the work stage is on screen.
        const sharp = (si === 5 || si === 15) && wWork > 0.5;
        path.setAttribute('d', strokePath(pts, sharp));

        // A fill rides its stroke's morph like the opacity above: solid while both stages fill the
        // slot, so it never floods a stroke that is still changing into (or out of) its shape. It
        // draws in `currentColor`, the page's ink, faded by `fill-opacity`.
        const fillA = FILLS[k].includes(si);
        const fillB = FILLS[k + 1].includes(si);
        const fill = fillA && fillB ? 1 : fillA ? leaving : fillB ? arriving : 0;
        path.style.fill = fill > 0.01 ? 'currentColor' : 'none';
        path.style.fillOpacity = fill.toFixed(3);
      });

      // Captions wipe in left-to-right over their own stage's window; the rampr axis labels
      // share the tallies→rampr→work window via stage 3's.
      anns.forEach((g, i) => {
        const v = stageWindow(q, i);
        // The negative top leaves room for a first-line link's focus ring, which overhangs the box.
        g.style.clipPath = 'inset(-0.5em ' + ((1 - v) * 100).toFixed(2) + '% 0 0)';
        // A link is clickable as soon as its caption shows: the clip keeps the hidden part from
        // catching clicks, and neighbouring windows never overlap, so no two captions compete.
        g.style.pointerEvents = v > 0 ? 'auto' : 'none';
        g.style.top = landscape ? '50%' : Math.round(capTop) + 'px';
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
    // The track is sized in `vh` while the browser keeps `scrollY` in px, so a resize moves the
    // story. A new width (a rotation, a window resized sideways) holds the visitor's place by
    // scrolling to the same progress; a height-only change (browser chrome showing or hiding
    // mid-scroll) just re-reads it, since scrolling then would cut momentum short.
    const onResize = () => {
      const widthChanged = root.getBoundingClientRect().width !== stageW;
      measureStage();
      measureKey = null;
      dirty = true;
      if (widthChanged) {
        window.scrollTo(0, target * (document.documentElement.scrollHeight - window.innerHeight));
      }
      onScroll();
    };
    // It also watches the captions and the hint, which change size on their own when only text is
    // zoomed; with the stage's width unchanged, that just re-measures.
    const observer = new ResizeObserver(onResize);
    [root, ...anns].forEach((el) => observer.observe(el));
    if (hint) observer.observe(hint);

    // Keyboard focus on a caption's link scrolls the story to that caption's stage, so tabbing
    // walks the film and focus never lands on a link that is still clipped out of view. Mouse focus
    // (not `:focus-visible`) and the focus a browser restores when the window comes back are left
    // alone, so neither rewinds the film to a link used earlier.
    let restoring: Element | null = null;
    const onBlur = () => {
      restoring = document.activeElement;
    };
    const onFocusIn = (event: FocusEvent) => {
      const focused = event.target;
      const restored = focused === restoring;
      restoring = null;
      if (restored || !(focused instanceof Element) || !focused.matches(':focus-visible')) return;
      const i = anns.findIndex((g) => g.contains(focused));
      if (i < 0) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, (max * i) / (STAGES.length - 1));
    };
    root.addEventListener('focusin', onFocusIn);
    window.addEventListener('blur', onBlur);

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
    // Start at the current position rather than easing up from stage 0, so a restarted engine (a
    // reduced-motion change, a reload with a restored scroll) never replays the film.
    cur = target;
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
      observer.disconnect();
      root.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [rootRef, reducedMotion]);
}
