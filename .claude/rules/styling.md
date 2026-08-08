---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "tailwind.config.js"
---

# Styling

Warm graph-paper, hand-drawn doodle aesthetic — cream page, a school-blue grid, ink strokes, one handwriting font, one teal accent. No UI, animation, or drawing libraries; every doodle is generated SVG, and the rest is hand-written CSS over Tailwind's reset and design tokens.

## Theming

- All colors via CSS custom properties / Tailwind semantic tokens. Never hardcode hex in components (no `bg-[#ABC]`), and never in the engine — it assigns token strings like `rgb(var(--ink))` (with alpha, `rgb(var(--ink) / 0.5)`).
- **Light, single theme** — palette on `:root` in `index.css`. No `dark:` prefixes, no theme toggle.
- Tokens are **space-separated RGB channels** (`--ink: 38 36 31;`, hex in a comment), consumed via `rgb(var(--token) / <alpha-value>)` in `tailwind.config.js` so `text-ink/60` resolves. Direct SVG `fill`/`stroke` and engine assignments wrap as `rgb(var(--token))`.
- **Tailwind only scans `className` values**, via a custom `extract` in `tailwind.config.js`. Its default extractor treats every word in a file as a possible class, and this project's vocabulary collides with utility names (`collapse` the stroke constructor, `onResize`, `position: 'absolute'`, the word "grid" in a docstring), which shipped a dozen utilities no markup used. Write classes as literal text inside `className` — a class assembled dynamically won't be generated.
- The palette: paper `--paper` fills the viewport; `--ink` is every stroke and all primary text; `--ink-soft` is the dimmed work-history lines; links use `--link` / `--link-hover` (teal); the graph grid is `--grid` (school blue).

## Visual language

- **One font — Gloria Hallelujah** (`font-hand`, the `body` default), loaded from Google Fonts via a preconnected `<link>` in `index.html` — not a CSS `@import`, which would serialize the font request behind the stylesheet. All text is this family.
- **Graph paper:** `.graph-paper` paints the fixed stage — 1px `--grid` rules every 28px on both axes over `--paper`. Applied once on the stage root, never per element.
- **Strokes:** the doodle SVG draws with `stroke: rgb(var(--ink))`, `stroke-width: 2.6` (`STROKE_WIDTH`), round caps/joins, `fill: none`. The engine turns fills on only for the tie (solid ink), the eyes, and the coffee surface, via token strings with alpha.
- Prefer the bare paper surface and hairline strokes over shadows or borders.

## Never signal by color alone

- Links pair teal with a hover darken and living inside caption text; the only other color is the dimmed `--ink-soft` work-history lines, which are also set apart by size and position. Color only reinforces.

## Stylesheet vs. inline style

- Use **CSS in `index.css`** for fonts, colors, links, focus rings, and the `.graph-paper`, `.resume-link`, and `[data-ann]` rules. Tailwind's whole contribution is its reset, the semantic color/font tokens, and four `@apply`ed utilities on `html`/`body` — no component uses a utility class.
- Use **inline `style`** for what the engine drives and for one-off component layout: the fixed stage, the scroll track's height, the SVG group `transform`, `clip-path`, and any JS-derived value. This is a deliberately inline-heavy port — a pixel-and-motion-exact scroll morph — and that is the sanctioned reason.
- **Anything needing a media query, a pseudo-class, or a fluid `clamp()` goes in `index.css`** — inline styles can't express them. That is why the resume link is a `.resume-link` class rather than a style object, and why the two fluid type scales live in CSS.

## Animation

- All motion is hand-rolled `requestAnimationFrame` in `hooks/useNotebookFilm.ts`, with the scroll cue as the sole CSS exception: an `opacity` transition on the hint, and the `hint-nudge` keyframe on its arrow. Timing constants live in `constants/animations.ts` (`EASE`, `BOIL_MS`, `BOIL_AMP`, dwell, reveal, `SCROLL_LENGTH_VH`).
- **An idle loop belongs in CSS, not the engine.** The engine repaints only when scrolling, boiling, or resized — 6fps at rest, and nothing at all under reduced motion — so driving a decorative loop through it would mean forcing 60fps repaints of all 18 strokes. Keep such motion on the compositor, and off any property the engine writes (the hint's `opacity`) or that carries layout (its centring `transform`); a CSS animation outranks inline styles and would silently break both.
- Honor `prefers-reduced-motion`: `index.css` clamps transition durations and disables animations, and the engine snaps progress (no easing) and skips the boil.
