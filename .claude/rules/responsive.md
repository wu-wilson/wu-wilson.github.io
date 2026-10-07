---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Responsive Design

One implementation, made responsive by the engine's per-frame layout math — not by media queries or separate component trees. `useNotebookFilm` re-derives the layout every frame from the **stage's own measured box** (`stageW`/`stageH`), so it adapts continuously as the surface changes.

**Measure the stage, never `window.innerWidth`/`innerHeight`.** The two diverge while mobile browser chrome animates — the window reports the visual viewport, the fixed stage keeps its own size — so window-derived layout paints the drawing into a surface it was not measured for, mis-sizing it and detaching it from the captions. A `ResizeObserver` on the stage re-measures and sets the dirty flag; `resize` is the fallback. It watches the captions and hint too, since text-only zoom resizes them without touching the stage. Rationale in the engine's own comment.

## The layout system (`paint()` in `hooks/useNotebookFilm.ts`)

- **Two screen bands per stage** — drawing on top, caption below — so the caption top sits at the same height for every stage. The drawing's interpolated anchor is pinned to the drawing band's centre via the `data-zoom` group transform.
- `kSlice = max(stageW/1600, stageH/900)` is the SVG slice scale; `s = D / (500 · kSlice)` the group scale.
- **Caption band height** `capH` is the measured tallest caption `offsetHeight` (min 60), re-measured when the stage size changes and after `document.fonts.ready`. It fixes the drawing band at one height for every stage — but the **scroll hint sits under `openingCapH`, stage 0's own height**, because `HINT_FADE` retires the hint before any other caption appears. Reserving the tallest caption's height for it would push it to the floor for no reason.
- The hint's bottom clamp subtracts its measured height **plus `HINT_NUDGE_PX`**. The arrow's bob is a `transform`, so it never reaches layout; anything positioning the hint has to account for that travel by hand.
- **Drawing size** `D = max(0, min(0.65·min(stageW,stageH), 500, stageH − 44 − CAP_GAP − capH))` — a **500px hard cap** keeps the doodle from ballooning on desktop/ultrawide, and the `stageH − …` term shrinks it to fit shorter stages. The caption always wins: on a stage too short for both (a page zoomed to 200% on a phone), the drawing shrinks as far as it must, to nothing and without the `CAP_GAP` if need be, so the caption keeps its room. That holds down to a stage of about 200px tall (narrow stages need the most), including WCAG's 320×256 reflow size; shorter than that (400% zoom on a short laptop screen), the tallest caption still runs past the stage.
- **Phone landscape** (`stageH < 480 && stageW > stageH`, and the tallest caption fits the side column, measured at that width; a zoomed-in page whose column is too narrow falls back to the stacked layout): the drawing centres at 30% of width and the captions move to a right column (`left: 56%`, `width: 40vw`, vertically centred) that ends short of a right-hand notch's safe area; the drawing is sized `D = min(0.78·stageH, 0.42·stageW)` instead, with no caption band to subtract, and the scroll hint pins to the bottom, above the home indicator's inset.

## Caption type scale

The caption scale (values in the `design-tokens` skill) is **height-aware on purpose**. A width-only `vw` scale inflated captions from 15px to ~18.6px when a phone rotated — same physical screen, bigger text — so a `vh` term pins every phone, in either orientation, to the 15px floor. Larger screens sit at or near the 24px cap: on most desktops and ultrawides both terms clear it, a short laptop window lands just under it on the `vh` term (23px at 1366×657), and a portrait tablet follows `vw`. Any future fluid type on this site should be sized the same way; don't reintroduce a bare `vw` scale.

## The resume link

The one persistent fixture. It sits in the **top-right in every orientation**, with no breakpoint. In `.resume-link` (`index.css`):

- Insets are fluid and safe-area-aware — `top: max(clamp(14px, 2.2vh, 28px), env(safe-area-inset-top))`, `right` likewise on `2.2vw`/`40px` — so the link breathes on ultrawide (40px in) and tucks in on a phone (16px in). Its type scale is in the `design-tokens` skill.
- The `env(...)` terms matter: `viewport-fit=cover` makes notch and rounded-corner insets real, and they land on the left/right edges in landscape.
- **The box stays shrink-wrapped to the word, so nothing in flow inside it may be percentage-sized.** With no `width` on an absolutely positioned box the width is shrink-to-fit, which makes an in-flow percentage child a cyclic percentage that each engine resolves its own way — Safari once stretched the whole link to the 300px default replaced width. The hand-drawn underline (the shared `.scribble` rule every `ScribbleLink` uses) is therefore positioned rather than in flow (`left: 0; bottom: 0; width: 100%`), with `.resume-link`'s `padding-bottom: 0.5em` reserving its band, keeping it out of the shrink-to-fit pass. Keep any future decoration out of flow the same way.
- **What keeps it clear is the caption type scale above, not a breakpoint.** In the landscape branch the caption column is vertically centred on the right, so its height — driven by font size — is what decides whether it reaches the corner. At the old 19px landscape captions it collided on short viewports and needed a corner swap; at 15px current phones in landscape clear it by 58–105px full-screen. If you ever raise the caption size again, re-measure this before assuming it still fits.

## Targets

Verify all four render cleanly: **mobile portrait** (e.g. 390×844), **phone landscape** (844×390 — the `stageH < 480` branch), **desktop** (1920×1080), and **ultrawide** (3440×1440 — the 500px cap holds). No layout should need a CSS breakpoint. Also check a zoomed page — 195×375 (a phone at 200%) and 455×217 (a laptop at 300%) — where no caption may clip, and the reflow size 320×256.

When checking a persistent fixture, test it against the **tallest caption** (stage 4, the work history) at each size — that is the stage that collides first — and include very short landscape windows, where width matters as much as height: the caption column is `40vw`, so a narrower window wraps the work history taller. 900×243 clears by ~13px and 800×243 just touches; current phones in landscape clear by 28px or more even with their browser bars showing, and only shorter, narrower windows (800×225, or a first-generation iPhone SE's 568px with its toolbars) overlap.

## Viewport & safe areas

- `index.html` sets `viewport-fit=cover`; the paper stage fills notch/home-indicator insets.
- `onScroll`, `onFocusIn`, and `onResize` keep `window.innerHeight` — the scroll range (`scrollHeight − innerHeight`) is a document question, not a stage one. It is the one thing the window is still the right source for; layout is not.
- The scroll track is sized in `vh` while the browser keeps `scrollY` in px, so a resize moves the story. A width change (rotating a phone, resizing a window sideways) scrolls to the same progress so the visitor keeps their place; a height-only change (browser chrome showing or hiding) only re-reads the progress, because scrolling mid-gesture would cut momentum short.
- The stage is `position: fixed; inset: 0`, so its box tracks browser chrome as it shows/hides and the drawing follows. Do not swap the layout math to a fixed `vh` — or back to `window.inner*`, which is what the box measurement replaced.
- `html { overflow-x: clip }` — the site only ever scrolls vertically; never allow horizontal overflow.

## States

- Every surface has designed content — no blank frames. There are no images to fail, no empty states: the whole page is generated SVG plus captions, always present.
- Captions start fully clipped (`clip-path: inset(0 100% 0 0)`) so nothing flashes before the first paint; the engine wipes each in as its stage arrives.
