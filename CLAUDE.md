# CLAUDE.md — wilsonwu.io

## What This Is

wilsonwu.io is Wilson Wu's personal portfolio: a single-page, fully static, frontend-only site with a hand-drawn "notebook" identity (warm paper, ruled lines, sketched wobble-boxes, two handwriting fonts, one blue accent) — deliberately distinct from the Krawly / Tallies / Rampr house style. Its signature is **one continuous travelling line** that threads every scene: it underlines the hero "WU", hooks through the About emphasis, traces each Projects frame, *becomes* the Experience career chart, and finishes as the Contact email underline. There is no backend — contact is `mailto:` + clipboard copy, and the résumé is a static PDF.

The site ships **two independent implementations**, chosen at runtime by viewport width (`≤ 820px` → mobile):

- **Desktop — a pinned scroll film.** A tall track (`1500vh`, `FILM_LENGTH_VH` — the single knob for overall pace) with a `position: sticky` stage. A single `requestAnimationFrame` loop (`useFilmEngine`) maps scroll position to a smoothed progress value `p ∈ [0,1]` and positions all five scenes (Hero → About → Projects → Experience → Contact), the flood, and the line as pure functions of `p`. Elements are located by a `data-fx` marker so scenes can live in separate components while one engine drives them.
- **Mobile — a flowing document.** Normal vertical scroll; blocks reveal on entry via `IntersectionObserver` (`useIntersectionReveal`), and a margin line scrubs alongside the reader (`useMobileFilm`). A hamburger opens a full-screen menu takeover.

## Architecture

- **React 18 + Vite + TypeScript (strict).** Tailwind CSS v3 with semantic tokens mapped from CSS custom properties. No routing (one page; nav jumps scroll to a scene). No state library — a little `useState` for the mobile menu and the copy button; everything animated is driven imperatively by the engines, not React state.
- **The engines** (`hooks/useFilmEngine.ts`, `hooks/useMobileFilm.ts`) own the `requestAnimationFrame` loops. They read scroll, compute progress, and assign inline styles to `data-fx` elements every frame. Scene reveals key off named scroll windows in `constants/animations.ts` (`FILM`); the line's drawing window is scrubbed piecewise across those same windows.
- **The line** (`lib/snake.ts`) is pure geometry: it measures the live layout (anchor boxes) and emits an SVG path `d` plus the cumulative segment lengths the engine scrubs a dash-window across. Rebuilt on resize, font load, and when the Projects media frame shifts.
- **Content** (`constants/content.ts`) is the single source for projects, experience, socials, and nav — both layouts render from it. Copy that differs between layouts is stored as explicit fields (`blurb` / `blurbShort`, `tags` / `tagsShort`).
- **Deploy:** static Vite build → GitHub Pages (`gh-pages -d dist`) on the `wu-wilson.github.io` repo, custom domain `wilsonwu.io` via `public/CNAME`, DNS on Cloudflare. No CI, no Docker, no server.

## Key Decisions

- **Two implementations, not one responsive tree.** The pinned film and the flowing document are different enough — different DOM, different motion model — that a single responsive component would be worse than two focused ones. `App` renders exactly one, chosen by a `matchMedia` breakpoint that matches the engine's `820px` boundary.
- **Imperative animation by design.** Porting a pixel-and-motion-exact scroll film to per-property React state would be slower and less faithful. The engines mutate `data-fx` elements directly inside the rAF loop; React owns structure and content, the engine owns motion. This is the one place inline `style` and direct DOM writes are the right tool.
- **One line, measured from layout.** The travelling line is a single path rebuilt from real measured boxes (not hardcoded coordinates), so it stays correct across viewport sizes and font loads. It reads as continuous because both the drawing head and the erasing tail advance together — a moving dash-window, not a static draw.
- **Tokens, even in the engine.** Colors the engine assigns are `rgb(var(--token))` strings, not hex — so the whole palette still lives in `index.css`. Inline `style` carries only layout, transforms, fluid sizes, and JS-derived values.
- **Reduced motion is honored in JS, not just CSS.** The engines drop progress smoothing and the timed intro draw under `prefers-reduced-motion`; the scroll-scrubbed layout still works (it is user-driven, not autonomous).
- **Graceful asset fallback.** Project screenshots and the résumé are drop-in files under `public/`. Missing a screenshot renders a labeled placeholder, never a broken image; the site runs on a fresh clone.

## Do NOT

- Add a backend, database, auth, analytics, or any server-side anything — the site is static and frontend-only. Contact stays `mailto:` + clipboard.
- Add an animation library (Framer Motion, GSAP, anime.js, Lenis) or a scroll library — all motion is hand-rolled `requestAnimationFrame` + CSS.
- Add UI component or charting libraries — build from scratch with Tailwind and CSS/SVG.
- Write test files or install testing libraries (TypeScript `strict` is the only linter).
- Use `any`, `as` casts (unless genuinely unavoidable), or default exports.
- Hardcode hex colors — use the semantic tokens from `index.css` / `tailwind.config.js`, including inside the engine (`rgb(var(--token))`). No dark mode, no theme toggle.
- Restructure a scene's DOM nesting without re-checking the line: the geometry walks `offsetParent` chains from `data-fx` anchors up to the stage, so moving an anchor's offset parent can break the path.
- Rename or drop a `data-fx` marker without updating the engine — the engines find every animated element by that attribute.
- Add dead code, unused exports, or speculative abstractions.

## Rules (path-scoped — loaded automatically when editing matching files)

- `.claude/rules/code-style.md` — TypeScript, JSDoc, import ordering, naming, error handling. Loads for `src/**/*.{ts,tsx}`.
- `.claude/rules/component-patterns.md` — React file structure, when state vs. the engine owns a value, the `data-fx` contract. Loads for `src/**/*.{ts,tsx}`.
- `.claude/rules/styling.md` — Tokens, the notebook visual language, inline-style boundaries, animation. Loads for `src/**/*.{tsx,css}` and `tailwind.config.js`.
- `.claude/rules/responsive.md` — The desktop/mobile split, viewport units, the centered rail, safe areas. Loads for `src/**/*.{tsx,css}`.

## Skills (reference knowledge)

- `.claude/skills/design-tokens/` — Exact color tokens, the two fonts, the ruled ground, wobble radii, and animation timing.
- `.claude/skills/scroll-film/` — How the desktop engine, the scene windows, and the travelling line fit together; the `data-fx` catalog and the line's scrub schedule.
