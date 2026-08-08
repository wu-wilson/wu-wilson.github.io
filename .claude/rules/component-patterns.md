---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Component Patterns

## File Structure

Component and hook files export exactly one thing, laid out in this order:

1. Imports
2. Module constants and helpers the export reads (style objects, `INK`, `inkFill`) — above, not below, so the export reads top-down
3. Props interface (with JSDoc on non-obvious props)
4. The exported component or hook (with JSDoc above)

`constants/`, `lib/`, and `types/` files are flat collections instead — many small named exports, each with its own docstring, and the file opening with a `/** … */` that frames what it is for.

## State vs. the engine

- **The engine owns motion.** Everything that changes with scroll — each stroke's `d`, opacity, and fill; the SVG group transform; the caption clip/position; the hint's opacity/position; the axis labels' opacity — is written imperatively by `useNotebookFilm` every frame, never React state. Components render the elements once (paths empty, captions clipped) and tag them with `data-*`; the engine takes over.
- **`ResumeLink` is the one exception.** It is static: no `data-*` marker, no per-frame writes, nothing for the engine to find. Its layout lives entirely in the `.resume-link` rules in `index.css`. If you add another persistent fixture, follow the same pattern — a fixture the engine doesn't animate should not be given a marker just for consistency.
- **React owns structure and content.** The only React state is the reduced-motion boolean (`useMediaQuery` in `App`); no component holds animation state. If a genuinely discrete UI interaction is ever added, keep its state in the smallest component possible so toggling it never re-renders the engine-driven stage.
- No shared state store, no prop-drilling of animation values. The engine reads the DOM (and the `STAGES` data), not props.

## The `data-*` contract

- Every animated element carries a `data-*` marker; the engine locates them by attribute within the fixed stage root, so the SVG, captions, and hint can be separate components:
  - `data-s="0".."17"` — the 18 stroke paths (engine sets `d`, opacity, fill). Order **is** the contract: morphing is slot-for-slot across stages, so `data-s` index must equal the stroke's index in every `STAGES` entry.
  - `data-zoom` — the group the engine transforms to place/scale the drawing (also carries the paths' `stroke-width`).
  - `data-axes` — the rampr `time`/`hiring` labels group (engine sets opacity).
  - `data-ann="0".."6"` — the seven captions (engine sets clip-path, pointer-events, position).
  - `data-hint` — the scroll cue (engine sets opacity, top/bottom, and `--hint-stroke`, the arrow's ink weight in px).
- If you add, rename, or remove a `data-*`, update the corresponding section of `useNotebookFilm`. Keep the SVG paths in document order 0→17 so `querySelectorAll('[data-s]')` indexes line up with `STAGES`.

## Content & data

- The seven doodles live in `constants/stages.ts` (`STAGES`, `ANCHORS`), built from the constructors in `lib/doodle.ts`; the point/stroke/stage types are in `types/doodle.ts`. These coordinates are the design's verbatim source of truth — edit doodles here, not in the engine.
- Caption copy is JSX in `components/Captions.tsx`; the repeated bits (project/contact links, work-history lines) come from `constants/content.ts`. Timing and layout constants live in `constants/animations.ts`.

## Limits

- Components stay small and single-purpose (`DoodleStage`, `Captions`, `ScrollHint`, `ResumeLink`, `Notebook`). The engine is the deliberate exception — one cohesive module, documented section by section. Don't split it or lift its per-frame work into React.
