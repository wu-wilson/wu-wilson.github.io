---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Responsive Design

One implementation, made responsive by the engine's per-frame layout math — not by media queries or separate component trees. `useNotebookFilm` re-derives the layout every frame from `window.innerWidth`/`innerHeight`, so it adapts continuously as the viewport changes.

## The layout system (`paint()` in `hooks/useNotebookFilm.ts`)

- **Two screen bands per viewport** — drawing on top, caption below — so the caption top sits at the same height for every stage. The drawing's interpolated anchor is pinned to the drawing band's centre via the `data-zoom` group transform.
- `kSlice = max(vw/1600, vh/900)` is the SVG slice scale; `s = D / (500 · kSlice)` the group scale.
- **Caption band height** `capH` is the measured tallest caption `offsetHeight` (min 60), re-measured when the viewport size changes and after `document.fonts.ready`.
- **Drawing size** `D = max(120, min(0.65·min(vw,vh), 500, vh − 44 − CAP_GAP − capH))` — a **500px hard cap** keeps the doodle from ballooning on desktop/ultrawide, and the `vh − …` term shrinks it to fit shorter viewports.
- **Phone landscape** (`vh < 480 && vw > vh`): the drawing centres at 30% of width and the captions move to a right column (`left: 56%`, `width: 40vw`, vertically centred); `capH` is not subtracted, and the scroll hint pins to the bottom.

## Caption type scale

The caption scale (values in the `design-tokens` skill) is **height-aware on purpose**. A width-only `vw` scale inflated captions from 15px to ~18.6px when a phone rotated — same physical screen, bigger text — so a `vh` term pins every phone, in either orientation, to the 15px floor. Desktop, laptop, tablet, and ultrawide are unaffected, because `vw` still wins the `min()` there. Any future fluid type on this site should be sized the same way; don't reintroduce a bare `vw` scale.

## The resume link

The one persistent fixture. It sits in the **top-right in every orientation**, with no breakpoint. In `.resume-link` (`index.css`):

- Insets are fluid and safe-area-aware — `top: max(clamp(14px, 2.2vh, 28px), env(safe-area-inset-top))`, `right` likewise on `2.2vw`/`40px` — so the link breathes on ultrawide (40px in) and tucks in on a phone (16px in). Its type scale is in the `design-tokens` skill.
- The `env(...)` terms matter: `viewport-fit=cover` makes notch and rounded-corner insets real, and they land on the left/right edges in landscape.
- **The box stays shrink-wrapped to the word, so nothing in flow inside it may be percentage-sized.** With no `width` on an absolutely positioned box the width is shrink-to-fit, which makes an in-flow percentage child a cyclic percentage that each engine resolves its own way — Safari once stretched the whole link to the 300px default replaced width. The hand-drawn underline is therefore positioned rather than in flow (`left: 0; bottom: 0; width: 100%`, with `padding-bottom: 0.5em` reserving its band), keeping it out of the shrink-to-fit pass. Keep any future decoration out of flow the same way.
- **What keeps it clear is the caption type scale above, not a breakpoint.** In the landscape branch the caption column is vertically centred on the right, so its height — driven by font size — is what decides whether it reaches the corner. At the old 19px landscape captions it collided on short viewports and needed a corner swap; at 15px it clears by 58–105px on every real phone landscape. If you ever raise the caption size again, re-measure this before assuming it still fits.

## Targets

Verify all four render cleanly: **mobile portrait** (e.g. 390×844), **phone landscape** (844×390 — the `vh < 480` branch), **desktop** (1920×1080), and **ultrawide** (3440×1440 — the 500px cap holds). No layout should need a CSS breakpoint.

When checking a persistent fixture, test it against the **tallest caption** (stage 4, the work history) at each size — that is the stage that collides first — and include a very short landscape window (e.g. 900×243), the tightest case on the site at ~13px of clearance.

## Viewport & safe areas

- `index.html` sets `viewport-fit=cover`; the paper stage fills notch/home-indicator insets.
- The engine's scroll math maps `window.innerHeight`, and the stage is `position: fixed; inset: 0` — so the drawing tracks the visual viewport as mobile browser chrome shows/hides. Do not swap the math to a fixed `vh`.
- `html { overflow-x: clip }` — the site only ever scrolls vertically; never allow horizontal overflow.

## States

- Every surface has designed content — no blank frames. There are no images to fail, no empty states: the whole page is generated SVG plus captions, always present.
- Captions start fully clipped (`clip-path: inset(0 100% 0 0)`) so nothing flashes before the first paint; the engine wipes each in as its stage arrives.
