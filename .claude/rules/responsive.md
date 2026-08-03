---
paths:
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

## Targets

Verify all four render cleanly: **mobile portrait** (e.g. 390×844), **phone landscape** (844×390 — the `vh < 480` branch), **desktop** (1920×1080), and **ultrawide** (3440×1440 — the 500px cap holds). No layout should need a CSS breakpoint.

## Viewport & safe areas

- `index.html` sets `viewport-fit=cover`; the paper stage fills notch/home-indicator insets.
- The engine's scroll math maps `window.innerHeight`, and the stage is `position: fixed; inset: 0` — so the drawing tracks the visual viewport as mobile browser chrome shows/hides. Do not swap the math to a fixed `vh`.
- `html { overflow-x: clip }` — the site only ever scrolls vertically; never allow horizontal overflow.

## States

- Every surface has designed content — no blank frames. There are no images to fail, no empty states: the whole page is generated SVG plus captions, always present.
- Captions start fully clipped (`clip-path: inset(0 100% 0 0)`) so nothing flashes before the first paint; the engine wipes each in as its stage arrives.
