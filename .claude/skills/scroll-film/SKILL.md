---
name: scroll-film
description: How the desktop scroll engine, the scene windows, and the single travelling line fit together — the data-fx catalog and the line's scrub schedule. Read before touching hooks/useFilmEngine.ts, hooks/useMobileFilm.ts, or lib/snake.ts.
---

# The scroll film

The site's motion is one idea applied two ways: **scroll position → a normalized progress value → everything's style**, computed every animation frame. No timeline library.

## Desktop engine (`hooks/useFilmEngine.ts`)

- A `1500vh` track (`FILM_LENGTH_VH`) holds a `position: sticky; height: 100vh` stage. Progress `raw = scrollY / (trackHeight − innerHeight)`, clamped to `[0,1]`.
- `raw` is low-pass smoothed each frame: `smoothed += (raw − smoothed) * PROGRESS_SMOOTHING` (0.16), snapping within 0.0004. The smoothed value `p` drives everything.
- Two primitives do all the work: `segment(p, a, b)` remaps a scroll window to `[0,1]`; `easeInOut` softens it; `lerp` interpolates. Scene windows are named in `constants/animations.ts` (`FILM`).
- Elements are found by `data-fx` within the track and cached; `set(key, styles)` assigns inline styles; `measureBox` walks `offsetParent` up to the stage for line geometry.

### Scene schedule (desktop, in `p`)

| Scene | In | Out / hidden |
|---|---|---|
| Hero | at rest | fade/lift `0.10–0.16`, hidden `> 0.19` |
| About | `0.115–0.165` (kicker/title/body cascade) | out `0.24–0.30`, shown `0.09–0.33` |
| Blueprint caption | `0.25–0.27` | `0.305–0.33` |
| Projects | `0.27–0.305` | out `0.565–0.625`, shown `0.24–0.66` |
| — cross-fade | `cf` 0→1 over `0.395–0.425`, 1→2 over `0.505–0.535`; media wipe `0.285–0.315`; frame swings to margin at the middle project | |
| Experience | `0.585–0.635` | axes draw `0.575–0.635`; nodes at `0.655/0.685/0.715/0.75/0.785`; pulse `0.79–0.815`; shown `0.55–0.97` |
| Flood | slides up `0.865–0.935` | |
| Contact | `0.92–0.965`; footer `0.96–1`; shown `> 0.87` | |
| Nav | condenses `> 0.012`; active link by `FILM.navActive` | |

## The travelling line (`lib/snake.ts`)

- One SVG path, rebuilt from measured anchor boxes into a `d` string plus cumulative segment lengths (`marks`). Desktop anchors: `heroUnder → aboutU → pmedia (rectangle) → chartBox (the step-chart) → cu`. The hidden `measure` path computes each segment's length via `getTotalLength()`.
- Drawn as a **moving dash-window**: `strokeDasharray = (e − s) + total`, `strokeDashoffset = −s`, where `[s, e]` is a start/end pair advancing along the length. Both ends move, so the line *slithers* — draws ahead, erases behind. The scrub schedule (piecewise `lerp` between `marks[i]`) lives in the engine's snake block and mirrors the scene windows.
- The intro (`INTRO`, 900ms delay / 450ms) draws the first segment before any scroll. The line turns `--paper-on-blue` past `p = 0.90` (on the flood) and follows the Projects frame's horizontal swing via `snakeG`. Geometry rebuilds on resize, font load, and when the media frame moves.

## Mobile engine (`hooks/useMobileFilm.ts`)

- No pinning. A margin line (`mSnake`) is scrubbed by scroll: the tip reaches `scrollY + 62%vh`, the tail lags `115%vh` (`MOBILE_SNAKE`), interpolated by document-Y through the path's `ys`/`marks` map. It hooks into `mU0`, `mU1`, each `mF1..3` frame, and each `mX0..4` entry, then runs down to the `mContact` panel's top edge. At rest the intro draws the first segment from nothing; scroll takes over once the reader moves.
- Block reveals are a separate concern: `useIntersectionReveal` fades/rises any `data-io` element in at 20% visibility, honoring a `data-iod` stagger. The nav frosts past 24px of scroll; the hamburger toggles a full-screen menu (body scroll locked).

## `data-fx` catalog

- **Structure:** `track`, `stage`, `mWrap`.
- **Desktop scenes:** `hatch`, `hero`, `cue`, `heroUnder`; `about`, `aboutK/T/B`, `aboutU`; `bp`; `proj`, `ptext`, `pt1..3`, `pmedia`, `pm1..3`, `skel`, `d1..3`; `exp`, `expH`, `chartBox`, `ay`, `ax`, `pulse`, `n0..4`, `l0..4`; `flood`; `contact`, `cu`, `cfoot`; `nav`, `navIn`, `nav-{about,projects,experience,contact}`.
- **The line:** `snakeG`, `snake`, `measure` (desktop); `mSnake`, `mMeasure` (mobile).
- **Mobile scenes:** `mNav`; `mHero`, `mCue`, `mU0`; `mAbout`, `mU1`; `mProj`, `mF1..3`; `mExp`, `mX0..4`; `mContact`.

Renaming or removing any of these requires updating the engine (and `lib/snake.ts` for the line anchors). Preserve a scene's DOM nesting so the `offsetParent`-based measurements stay correct.
