---
name: design-tokens
description: wilsonwu.io's exact color tokens, fonts, the ruled ground, wobble radii, and animation timing. Read before writing any styling.
---

# wilsonwu.io design tokens

A warm-paper, hand-drawn **notebook**: cream page, blue horizontal rules, sketched wobble-boxes, two handwriting fonts, one blue accent (the pen). Light, single theme — no dark mode.

## Color tokens

Stored as **space-separated RGB channels** on `:root` in `src/index.css` (hex in a comment), consumed through `rgb(var(--token) / <alpha-value>)` in `tailwind.config.js`. Never hardcode hex — not in components, not in the engine (it assigns `rgb(var(--token))` strings).

```css
:root {
  /* Surface + ink */
  --paper: 245 241 232;    /* #F5F1E8  the page — fills the viewport */
  --ink: 38 36 31;         /* #26241F  primary ink */
  --ink-soft: 69 64 58;    /* #45403A  secondary ink */

  /* Brand blue (the pen) */
  --brand: 42 95 215;      /* #2A5FD7  the line + links */
  --brand-dark: 27 70 171; /* #1B46AB  link hover */
  --brand-flood: 46 86 212;/* #2E56D4  contact flood panel */

  /* Muted ramp, strongest to faintest */
  --muted-1: 95 90 78;     /* #5F5A4E  body copy */
  --muted-2: 138 131 116;  /* #8A8374  labels, tags */
  --muted-3: 154 147 127;  /* #9A937F  faint meta */

  /* Pencil lines + accents */
  --line-1: 184 176 156;   /* #B8B09C  tag / frame border */
  --line-2: 176 168 148;   /* #B0A894  inactive chapter dash */
  --line-3: 221 213 195;   /* #DDD5C3  nav hairline, placeholder surface */
  --faint: 217 210 191;    /* #D9D2BF  oversized index numerals */
  --skel: 236 231 219;     /* #ECE7DB  refactor-skeleton ground */

  /* Notebook ruling */
  --hatch-rule: 204 213 230;   /* #CCD5E6  blue horizontal rules */

  /* On the blue flood (contact) */
  --paper-on-blue: 242 239 233; /* #F2EFE9  paper-tone text on blue */
  --muted-on-blue: 185 200 245; /* #B9C8F5  muted text on blue */
}
```

`tailwind.config.js` maps these via a channel helper `ch('--token')` to: `paper, ink, ink-soft, brand, brand-dark, brand-flood, muted.{1,2,3}, line.{1,2,3}, faint, paper-on-blue, muted-on-blue`.

## Fonts

- **Shantell Sans** (500–800) — display name, headings, project names, big numerals, and the flood headline. `font-display`; it is the `body` default.
- **Architects Daughter** — labels, tags, meta, buttons, the SCROLL cue. Apply `font-hand` explicitly.

Loaded via the Google Fonts `@import` at the top of `index.css`.

## Ruled ground

- Desktop: `.hatch-ground` — blue horizontal rules (`--hatch-rule`) every 36px.
- Mobile: `.hatch-ground-mobile` — the same blue rules on a tighter 28px rhythm.
- Keep both rule periods a multiple of 4, so `period × devicePixelRatio` lands on a whole number of device pixels at every display-scaling ratio; otherwise the thin lines alias to alternating thicknesses.
- The desktop ground is fixed in place; the engine only fades it out under the contact flood.

## Wobble radii

Hand-drawn boxes use asymmetric `border-radius`:

```css
.wobble-sm { border-radius: 10px 4px 12px 5px / 5px 12px 4px 10px; } /* tags */
.wobble-md { border-radius: 14px 6px 16px 8px / 8px 16px 6px 14px; } /* buttons */
.wobble-lg { border-radius: 16px 7px 18px 8px / 8px 18px 7px 16px; } /* email pill */
```

## Animation timing

- `constants/animations.ts`: `FILM` (per-scene scroll windows), `EASING` (`cubic-bezier(0.2,0.7,0.25,1)`, the reveal curve), `INTRO` (hero underline auto-draw: 900ms delay, 450ms draw), `MOBILE_SNAKE` (tip/tail vh + intro), `MOBILE_CUE_FADE_VH` (0.45, mobile scroll-cue fade), `PROGRESS_SMOOTHING` (0.16 low-pass).
- CSS keyframes: `ww-rise` (hero words) and `ww-cue-bounce` (scroll cue). Everything else is scrubbed by the engines.
- `prefers-reduced-motion`: `index.css` disables the keyframes and clamps transitions; the engines drop smoothing and the timed intro draw.
