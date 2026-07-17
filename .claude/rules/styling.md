---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "tailwind.config.js"
---

# Styling

Warm-paper, hand-drawn notebook aesthetic — a distinct identity, not the Krawly/Tallies/Rampr house style. No UI component or animation libraries; build everything from Tailwind, CSS, and inline SVG.

## Theming

- All colors via CSS custom properties / Tailwind semantic tokens. Never hardcode hex in components (no `bg-[#ABC]`), and never in the engines — the loop assigns token strings like `rgb(var(--brand))`.
- **Light, single theme** — palette defined on `:root` in `index.css`. No `dark:` prefixes, no theme toggle.
- Tokens are **space-separated RGB channels** (`--brand: 42 95 215;`, hex in a comment), consumed via `rgb(var(--token) / <alpha-value>)` in `tailwind.config.js` so `text-ink/60` resolves. Direct SVG `fill`/`stroke` and engine assignments wrap as `rgb(var(--token))`.
- Surfaces & ink: paper `--paper` fills the viewport; ink `--ink`, secondary `--ink-soft`; muted ramp `--muted-1..3`; pencil lines `--line-1..3` + `--faint`. Brand blue `--brand` (+ `--brand-dark` hover, `--brand-flood` for the contact panel). On-blue text uses `--paper-on-blue` / `--muted-on-blue`. Ruling uses `--hatch-rule` (blue).

## Visual language

- Display, names, and big numerals use **Shantell Sans** (`font-display`, weights 500–800); labels, tags, meta, and mono-ish captions use **Architects Daughter** (`font-hand`). Loaded via the Google Fonts `@import` at the top of `index.css`.
- Sketched boxes use the asymmetric wobble radii (`.wobble-sm` / `.wobble-md` / `.wobble-lg`) — tags, buttons, the résumé pill. Slight `rotate()` on chapter numbers and project names sells the hand-drawn feel.
- The ruled ground is token-built: `.hatch-ground` (desktop) and `.hatch-ground-mobile` are blue horizontal rules, differing only in row rhythm. Paint the mobile ruling once on the wrapper root — never per section — so the rhythm stays unbroken across section seams.
- Prefer hairlines and the paper surface over drop shadows.

## Never signal by color alone

- The Projects chapter dashes pair position with the active-blue fill; nav pairs the active scene's blue with the section it names; momentum-style cues always carry a glyph + text. Color only reinforces.

## Inline style vs. Tailwind

- Use **Tailwind classes** for fonts, colors, borders, and hover/focus states (`hover:*`, `:focus-visible` ring from the base layer).
- Use **inline `style`** for what Tailwind can't cleanly express and for what the engine drives: absolute/sticky positioning, `transform`, `clip-path`, `z-index` layering, fluid `min()` type sizes, animation delays, and any JS-derived value. This is a deliberately inline-heavy port — a pixel-and-motion-exact scroll film — and that is the sanctioned reason.

## Animation

- All motion is hand-rolled: CSS `@keyframes` (`ww-rise`, `ww-cue-bounce`) for first-paint flourishes, and `requestAnimationFrame` in the engines for the scroll film. Timing landmarks live in `constants/animations.ts` (`FILM`, `EASING`, `INTRO`, smoothing constants).
- Honor `prefers-reduced-motion`: `index.css` disables the keyframes and clamps transitions, and the engines drop progress smoothing and the timed intro draw.
