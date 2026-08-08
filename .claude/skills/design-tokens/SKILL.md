---
name: design-tokens
description: wilsonwu.io's exact color tokens, font, type scale, the graph-paper grid, and animation timing. Read before writing any styling.
---

# wilsonwu.io design tokens

A warm graph-paper doodle: cream page, a school-blue grid, ink strokes, one handwriting font, one teal accent for links. Light, single theme — no dark mode.

## Color tokens

Stored as **space-separated RGB channels** on `:root` in `src/index.css` (hex in a comment), consumed through `rgb(var(--token) / <alpha-value>)` in `tailwind.config.js`. Never hardcode hex — not in components, not in the engine (it assigns `rgb(var(--token))` / `rgb(var(--token) / a)` strings).

```css
:root {
  --paper: 251 250 246;    /* #FBFAF6  the page — fills the viewport */
  --ink: 38 36 31;         /* #26241F  all strokes + primary text */
  --ink-soft: 87 84 75;    /* #57544B  dimmed work-history lines */
  --link: 47 111 106;      /* #2F6F6A  links */
  --link-hover: 31 79 75;  /* #1F4F4B  link hover */
  --grid: 223 231 240;     /* #DFE7F0  the school-blue graph-paper rules */
}
```

`tailwind.config.js` maps these via a channel helper `ch('--token')` to: `paper, ink, ink-soft, link, link-hover, grid`.

## Font

- **Gloria Hallelujah** — the only family, the `body` default (`font-hand`). All text — captions, links, axis labels, the scroll cue — uses it. Loaded from Google Fonts via a preconnected `<link>` in `index.html`.

## Type scale

Fluid `clamp()`s in `index.css` — there are no breakpoints, so these are the whole scale:

- **Captions** (`[data-ann]`): `clamp(15px, min(2.2vw, 3.5vh), 19px)`. The `3.5vh` term is deliberate — a width-only scale inflated captions when a phone rotated. Rationale in `.claude/rules/responsive.md`.
- **Resume link** (`.resume-link`): `clamp(13px, 1.15vw, 17px)` — subordinate to the captions at every size.
- **Scroll hint**: a flat `14px`. Work-history sub-lines are `0.85em` of the caption.

## Graph paper

- `.graph-paper` paints the fixed stage: two 1px `--grid` linear-gradients over `--paper`, `background-size: 28px 28px` — a school-blue grid on both axes.
- Applied once on the stage root; never per element.

## Strokes & fills

- The doodle SVG: `stroke: rgb(var(--ink))`, `stroke-width: 2.6` (`STROKE_WIDTH`), round caps/joins, `fill: none`. That is 2.6 **world** units — the group scale and the slice scale cancel, so on screen it renders at `STROKE_WIDTH × D / DOODLE_WORLD_SIZE` px, i.e. 2.6px only at the 500px cap and thinner as the drawing shrinks.
- **One pen for the whole page.** The scroll arrow takes that same px value from `--hint-stroke` (engine-set) with `non-scaling-stroke`; the resume underline is a deliberate exception at a flat 1.6px, since it is subordinate chrome rather than part of the drawing.
- The engine turns fills on for a few slots via token strings with alpha: the tie (strokes 5, 15) fills solid ink during the work stage; the eyes (strokes 1–3) fill during the stick-figure/spider stages; the coffee surface reuses an eye slot's fill during the coffee stage.

## Animation timing

- `constants/animations.ts`: `SCROLL_LENGTH_VH` (800, total scroll track), `EASE` (0.12/frame progress low-pass, 1 under reduced-motion), `BOIL_MS` (160, idle-wobble retick), `BOIL_AMP` (3.5, wobble amplitude), `DWELL_HOLD`/`DWELL_MORPH` (0.30 / 0.40, the hold-then-morph shaping), `REVEAL_HALF`/`REVEAL_RAMP` (0.55 / 3.2, the reveal-window shape behind every caption wipe and fill), `STROKE_WIDTH` (2.6), `DOODLE_WORLD_SIZE`/`DOODLE_MAX_PX` (both 500 — the nominal doodle width in world units and the on-screen px cap; equal by coincidence, retune separately), `CAP_GAP` (36, drawing→caption gap), `HINT_FADE` (0.02), `HINT_NUDGE_PX` (9 — the arrow bob's travel; must match the `hint-nudge` keyframe, since a transform never reaches layout).
- Geometry counts live in `lib/doodle.ts`: `NP` (12 points/stroke), `NS` (18 strokes/stage).
- The only CSS-side motion is the scroll cue: an `opacity` transition on the hint, and `hint-nudge` on its arrow — a 9px bob, 1.1s `ease-in-out` each way on `alternate` (2.2s round trip, seamless reversal). `prefers-reduced-motion`: `index.css` clamps transition durations and disables animations; the engine snaps progress and skips the boil.
