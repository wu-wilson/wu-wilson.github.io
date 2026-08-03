import { useEffect, type RefObject } from 'react';

import { clamp01, NP, NS, smoothstep, strokePath } from '../lib/doodle';

import {
  BOIL_AMP,
  BOIL_MS,
  CAP_GAP,
  DWELL_HOLD,
  DWELL_MORPH,
  EASE,
  HINT_FADE,
} from '../constants/animations';
import { ANCHORS, STAGES } from '../constants/stages';

import type { Point } from '../types/doodle';

/** Ink fill for the tie and eyes, at a given alpha; token-based so the palette stays in CSS. */
const inkFill = (alpha: number): string => 'rgb(var(--ink) / ' + alpha.toFixed(3) + ')';

/** Fresh boil jitter: `NS × NP` random `[dx, dy]` offsets in world px, uniform in `[-AMP/2, +AMP/2]`. */
const makeJitter = (): Point[][] =>
  Array.from({ length: NS }, () =>
    Array.from({ length: NP }, (): Point => [
      (Math.random() - 0.5) * BOIL_AMP,
      (Math.random() - 0.5) * BOIL_AMP,
    ])
  );

/**
 * Drive the doodle film: one `requestAnimationFrame` loop maps scroll position to a smoothed
 * progress value and, as a pure function of it, morphs the current doodle into the next,
 * wobbles it at rest (boil), lays out the drawing/caption bands, and wipes captions in and out.
 * Elements are located by their `data-*` marker within the fixed stage, so the SVG, captions,
 * and hint can live in separate components. Honors reduced-motion by snapping progress (no
 * easing) and skipping the boil.
 * @param rootRef - Ref to the fixed stage element that contains the SVG, captions, and hint
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
    let capH = 116;
    let jitter = makeJitter();
    let raf = 0;

    const paint = (p: number) => {
      const K = STAGES.length - 1;
      const q = p * K;
      const k = Math.min(K - 1, Math.floor(q));
      // Dwell: hold each finished doodle, morph only through the middle of its segment.
      const f = smoothstep((q - k - DWELL_HOLD) / DWELL_MORPH);

      // Two fixed screen bands per viewport — drawing on top, caption below — so the caption
      // top sits at the same height for every stage. Phone landscape splits left/right instead.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const kSlice = Math.max(vw / 1600, vh / 900);
      const landscape = vh < 480 && vw > vh;

      // Measure the tallest caption once per viewport size (re-measured on resize/font load).
      if (!landscape && measureKey !== vw + 'x' + vh) {
        measureKey = vw + 'x' + vh;
        capH = Math.max(60, ...anns.map((g) => g.offsetHeight || 0));
      }
      const capBand = landscape ? 0 : capH;
      // Drawing size: 65% of the smaller side, hard-capped at 500px, shrunk to fit if needed.
      const D = landscape
        ? Math.min(0.78 * vh, 0.42 * vw)
        : Math.max(120, Math.min(0.65 * Math.min(vw, vh), 500, vh - 44 - CAP_GAP - capBand));
      const s = D / (500 * kSlice);
      const unitTop = landscape
        ? (vh - D) / 2
        : Math.max(22, (vh - (D + CAP_GAP + capBand)) / 2);
      const drawCX = landscape ? 0.3 * vw : vw / 2;
      const drawCY = unitTop + D / 2;
      const capTop = unitTop + D + CAP_GAP;

      // Pin the interpolated anchor (the doodle's visual centre) to the drawing band's centre.
      const aA = ANCHORS[k];
      const aB = ANCHORS[k + 1];
      const acx = aA[0] + (aB[0] - aA[0]) * f;
      const acy = aA[1] + (aB[1] - aA[1]) * f;
      const vbx = 800 + (drawCX - vw / 2) / kSlice;
      const vby = 450 + (drawCY - vh / 2) / kSlice;
      if (zoom) {
        zoom.setAttribute(
          'transform',
          'translate(' + (vbx - acx * s).toFixed(1) + ' ' + (vby - acy * s).toFixed(1) + ') scale(' + s.toFixed(4) + ')'
        );
      }

      if (hint) {
        hint.style.opacity = p < HINT_FADE ? '1' : '0';
        if (landscape) {
          hint.style.top = '';
          hint.style.bottom = '12px';
        } else {
          hint.style.bottom = 'auto';
          hint.style.top = Math.round(Math.min(capTop + capBand + 18, vh - 72)) + 'px';
        }
      }

      const A = STAGES[k];
      const B = STAGES[k + 1];
      // The tie (strokes 5, 15) fills and renders sharp only while the work stage is on screen.
      const w4 = clamp01((q - 3.45) * 3.2) * clamp01((4.55 - q) * 3.2);
      paths.forEach((path, si) => {
        const pa = A[si];
        const pb = B[si];
        const j = jitter[si];

        // Source stroke extent → scale boil down for small features (eyes, dots).
        let ax0 = 1e9;
        let ax1 = -1e9;
        let ay0 = 1e9;
        let ay1 = -1e9;
        pa.forEach((pt) => {
          if (pt[0] < ax0) ax0 = pt[0];
          if (pt[0] > ax1) ax1 = pt[0];
          if (pt[1] < ay0) ay0 = pt[1];
          if (pt[1] > ay1) ay1 = pt[1];
        });
        const jScale = Math.min(1, (ax1 - ax0 + (ay1 - ay0)) / 110);

        let minx = 1e9;
        let maxx = -1e9;
        let miny = 1e9;
        let maxy = -1e9;
        const pts = pa.map((pt, i): Point => {
          // Taper boil to zero at stroke endpoints so joints stay connected.
          const env = Math.sin((Math.PI * i) / (pa.length - 1));
          const x = pt[0] + (pb[i][0] - pt[0]) * f + j[i][0] * jScale * env;
          const y = pt[1] + (pb[i][1] - pt[1]) * f + j[i][1] * jScale * env;
          if (x < minx) minx = x;
          if (x > maxx) maxx = x;
          if (y < miny) miny = y;
          if (y > maxy) maxy = y;
          return [x, y];
        });

        // Target stroke extent → fade collapse-bound strokes instead of leaving a lingering dot.
        let bx0 = 1e9;
        let bx1 = -1e9;
        let by0 = 1e9;
        let by1 = -1e9;
        pb.forEach((pt) => {
          if (pt[0] < bx0) bx0 = pt[0];
          if (pt[0] > bx1) bx1 = pt[0];
          if (pt[1] < by0) by0 = pt[1];
          if (pt[1] > by1) by1 = pt[1];
        });
        const extA = ax1 - ax0 + (ay1 - ay0);
        const extB = bx1 - bx0 + (by1 - by0);
        const ext = maxx - minx + (maxy - miny);
        let op = 1;
        if (extA < 6 && extB < 6) op = 0;
        else if (extB < 6) op = Math.max(0, 1 - f / 0.2);
        else if (extA < 6) op = clamp01((f - 0.8) / 0.2);
        else if (ext < 2.5) op = Math.max(0, (ext - 0.5) / 2);
        path.style.opacity = String(op);

        const sharp = (si === 5 || si === 15) && w4 > 0.5;
        path.setAttribute('d', strokePath(pts, sharp));

        if (si === 5 || si === 15) {
          path.style.fill = w4 > 0.01 ? inkFill(w4) : 'none';
        } else if (si === 1 || si === 2 || si === 3) {
          // Eyes fill as solid ovals during the stick-figure and spider stages.
          const w0 = clamp01((0.55 - q) * 3.2);
          const w1 = clamp01((q - 0.45) * 3.2) * clamp01((1.55 - q) * 3.2);
          const w5 = clamp01((q - 4.45) * 3.2) * clamp01((5.55 - q) * 3.2);
          const we = si === 1 ? Math.max(w0, w4) : si === 2 ? Math.max(w0, w4, w1, w5) : w1;
          path.style.fill = we > 0.01 ? inkFill(we) : 'none';
        }
      });

      // Captions wipe in left-to-right over a window centred on their stage; the rampr axis
      // labels share the tallies→rampr→work window via vis(3).
      const vis = (i: number) => clamp01((q - (i - 0.55)) * 3.2) * clamp01((i + 0.55 - q) * 3.2);
      anns.forEach((g, i) => {
        const v = vis(i);
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
      if (axes) axes.setAttribute('opacity', vis(3).toFixed(3));
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onResize = () => {
      measureKey = null;
      dirty = true;
    };

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
    if (document.fonts) {
      document.fonts.ready.then(() => {
        measureKey = null;
        dirty = true;
      });
    }

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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [rootRef, reducedMotion]);
}
