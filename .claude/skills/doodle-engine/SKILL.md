---
name: doodle-engine
description: How the rAF engine, the stage/stroke data model, the morph/boil/dwell, and the responsive layout fit together — the data-* catalog and the stroke-slot map. Read before touching hooks/useNotebookFilm.ts, lib/doodle.ts, or constants/stages.ts.
---

# The doodle engine

The site's motion is one idea: **scroll position → a normalized progress value → the whole drawing's geometry**, computed every animation frame. One SVG, 18 strokes, 12 points each, seven stages. No timeline library, no images.

## Data model (`lib/doodle.ts`, `constants/stages.ts`, `types/doodle.ts`)

- A **stage** is `NS = 18` strokes; a **stroke** is `NP = 12` points (`Point = [x, y]` in the `1600×900` world). Constructors build strokes: `seg` (line), `circle`, `ell` (ellipse), `poly` (arc-length-resampled polyline), `collapse` (all 12 points parked at one spot — an "unused" stroke).
- `STAGES` is the seven finished doodles in scroll order; `ANCHORS` their hand-tuned visual centres. Coordinates are the design prototype's **verbatim** — the source of truth. Retune geometry here, never in the engine.
- **Slots are the contract.** Adjacent stages morph stroke-for-stroke, so stroke slot `i` holds the "same" line across stages (slot 5 is the tie body, slot 15 the tie knot; slots 1–3 are the eyes). A slot a stage doesn't use parks at a `collapse` point. Never reorder a stage's strokes without matching every other stage.

## The engine (`hooks/useNotebookFilm.ts`)

- Progress: `p = scrollY / (scrollHeight − innerHeight)`, clamped. Eased each frame: `cur += (target − cur) · EASE` (0.12; 1 under reduced-motion), snapping within 0.00005.
- **Timeline:** `q = p·6`, stage `k = min(5, floor(q))`. **Dwell** shapes local progress so each finished doodle holds: `f = smoothstep((q − k − 0.30) / 0.40)` — hold 30% each side, morph the middle 40%.
- **Morph:** each stroke lerps point-by-point from `STAGES[k]` to `STAGES[k+1]` by `f`.
- **Boil (idle wobble):** every `BOIL_MS` (160) a fresh `NS×NP` grid of jitter in `[−1.75, +1.75]` is applied; scaled down for small strokes (`jScale = min(1, (w+h)/110)`) and tapered to 0 at endpoints (`sin(π·i/(n−1))`) so joints stay joined. Skipped under reduced-motion.
- **Rendering:** quadratic-midpoint curves, except the tie (slots 5, 15) renders straight (`L`) while the work stage is on screen so corners stay crisp (`strokePath(pts, sharp)`).
- **Opacity:** strokes headed to / coming from a collapse point fade over the first / last 20% of the morph so no dot lingers; always-collapsed slots are hidden.
- **Fills** (token strings with alpha): tie slots fill over the work window `w4`; eye slots fill over their own `q`-windows (`w0/w1/w4/w5`) — and slot 2's `w5` window is what fills the **coffee surface**.
- Repaints only when scrolling, boiling, or after a resize / font load (a dirty flag).

## Responsive layout (in `paint()`)

- Two screen bands (drawing top, caption below); the interpolated anchor is pinned to the drawing band's centre via the `data-zoom` transform. `D = max(120, min(0.65·min(vw,vh), 500, vh − 44 − 36 − capH))` — 500px hard cap; `capH` is the measured tallest caption.
- **Phone landscape** (`vh < 480 && vw > vh`): drawing at 30% width, captions in a right column (`left 56%`, `width 40vw`, vertically centred), hint pinned to the bottom.
- Captions wipe in via `clip-path: inset(0 X% 0 0)` driven by `vis(i)`; the rampr axis labels share `vis(3)`.

## `data-*` catalog

- `data-zoom` — group the engine transforms (translate + scale); carries the paths' stroke-width.
- `data-s="0".."17"` — the 18 stroke paths, direct children of `data-zoom` (`d`, opacity, fill). Document order **must** match the stroke index.
- `data-axes` — the `time`/`hiring` labels (opacity).
- `data-ann="0".."6"` — the seven captions (clip-path, pointer-events, position).
- `data-hint` — the scroll cue (opacity, top/bottom).

Renaming or removing any of these requires updating the matching engine section. Keep the SVG paths in order 0→17 so `querySelectorAll('[data-s]')` lines up with `STAGES`.
