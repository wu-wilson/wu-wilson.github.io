---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "tailwind.config.js"
---

# Styling

Warm graph-paper, hand-drawn doodle aesthetic — cream page, a school-blue grid, ink strokes, one handwriting font, one teal accent. No UI, animation, or drawing libraries; every doodle is generated SVG, and the rest is Tailwind + a little CSS.

## Theming

- All colors via CSS custom properties / Tailwind semantic tokens. Never hardcode hex in components (no `bg-[#ABC]`), and never in the engine — it assigns token strings like `rgb(var(--ink))` (with alpha, `rgb(var(--ink) / 0.5)`).
- **Light, single theme** — palette on `:root` in `index.css`. No `dark:` prefixes, no theme toggle.
- Tokens are **space-separated RGB channels** (`--ink: 38 36 31;`, hex in a comment), consumed via `rgb(var(--token) / <alpha-value>)` in `tailwind.config.js` so `text-ink/60` resolves. Direct SVG `fill`/`stroke` and engine assignments wrap as `rgb(var(--token))`.
- The palette: paper `--paper` fills the viewport; `--ink` is every stroke and all primary text; `--ink-soft` is the dimmed work-history lines; links use `--link` / `--link-hover` (teal); the graph grid is `--grid` (school blue).

## Visual language

- **One font — Gloria Hallelujah** (`font-hand`, the `body` default), loaded via the Google Fonts `@import` at the top of `index.css`. All text is this family.
- **Graph paper:** `.graph-paper` paints the fixed stage — 1px `--grid` rules every 28px on both axes over `--paper`. Applied once on the stage root, never per element.
- **Strokes:** the doodle SVG draws with `stroke: rgb(var(--ink))`, `stroke-width: 2.6` (`STROKE_WIDTH`), round caps/joins, `fill: none`. The engine turns fills on only for the tie (solid ink), the eyes, and the coffee surface, via token strings with alpha.
- Prefer the bare paper surface and hairline strokes over shadows or borders.

## Never signal by color alone

- Links pair teal with a hover darken and living inside caption text; the only other color is the dimmed `--ink-soft` work-history lines, which are also set apart by size and position. Color only reinforces.

## Inline style vs. Tailwind

- Use **Tailwind classes / base-layer CSS** for fonts, colors, links, focus rings, and the `.graph-paper` and `[data-ann]` rules.
- Use **inline `style`** for what the engine drives and what Tailwind can't cleanly express: `position: fixed`/`absolute`, the SVG group `transform`, `clip-path`, fluid `min()`/`clamp()` sizes, and any JS-derived value. This is a deliberately inline-heavy port — a pixel-and-motion-exact scroll morph — and that is the sanctioned reason.

## Animation

- All motion is hand-rolled `requestAnimationFrame` in `hooks/useNotebookFilm.ts`. There are no CSS keyframes — the only CSS transition is the scroll hint's `opacity`. Timing constants live in `constants/animations.ts` (`EASE`, `BOIL_MS`, `BOIL_AMP`, dwell, `SCROLL_LENGTH_VH`).
- Honor `prefers-reduced-motion`: `index.css` clamps transition durations, and the engine snaps progress (no easing) and skips the boil.
