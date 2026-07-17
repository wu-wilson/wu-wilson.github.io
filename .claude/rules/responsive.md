---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Responsive Design

## The split

- Two independent implementations, chosen at runtime, not one fluid tree. `App` reads `matchMedia('(max-width: 820px)')`: at or below `820px` it renders `MobileFilm`; above, `DesktopFilm`. The engines share the same `820px` boundary — keep `MOBILE_MAX_WIDTH`, the `App` query, and the Tailwind `md` screen (`821px`) in agreement.
- **Desktop** is a pinned film: a `1500vh` track (`FILM_LENGTH_VH`) under a `position: sticky; height: 100vh` stage. Here `100vh` is intentional and correct — the scroll math maps `window.innerHeight` to the sticky stage, so `dvh` would desync it. Do not "fix" it to `dvh`.
- **Mobile** is a normal flowing document; blocks reveal on entry. Use the dynamic viewport (`svh` / `dvh`), never `100vh` — the hero is `100svh`.

## Layout

- Desktop scenes center content in a `min(1280px, 92vw)` (or `90vw`) rail with a `64px` left inset; the ruled ground fills the viewport behind it.
- Mobile uses a `24px` (occasionally `20px`) gutter and stacks everything in one column; projects and experience become vertical cards/entries.
- Fluid type via `min(px, vw)` so headlines scale with the viewport without media queries.

## Viewport & safe areas

- `index.html` sets `viewport-fit=cover`; the paper surface fills notch/home-indicator insets.
- `html { overflow-x: hidden }` and `body { overscroll-behavior-x: none }` — never allow horizontal overflow; the pinned stage is `overflow: hidden`.
- `html { scrollbar-gutter: stable }` reserves the scrollbar space from first paint, so the viewport width (and the center-relative desktop margin) doesn't shift when the tall film mounts and the scrollbar appears.

## States

- Every surface has designed content — no blank frames. A missing project screenshot renders a labeled placeholder (`Screenshot`), never a broken image. The mobile menu is a designed full-screen takeover, not a dropdown.
