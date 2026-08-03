# CLAUDE.md — wilsonwu.io

## What This Is

wilsonwu.io is Wilson Wu's personal portfolio: a single-page, fully static, frontend-only site that plays like a short animated story on **graph paper**. One hand-drawn doodle at a time morphs into the next as the user scrolls, telling an arc in seven stages — **hello → krawly → tallies → rampr → work → coffee → mail** — with a minimal one-line caption under each drawing. There is no backend, no nav, no buttons, no footer: scroll is the only interaction, contact is a `mailto:` link, and every drawing is generated SVG (no images, no icon fonts). One handwriting font (Gloria Hallelujah), warm paper, school-blue grid, ink strokes, one teal accent for links.

The whole thing is **one implementation** driven by a single `requestAnimationFrame` loop — the responsive behavior (portrait, landscape, desktop, ultrawide) is handled inside the engine's per-frame layout math, not by separate component trees.

## Architecture

- **React 18 + Vite + TypeScript (strict).** Tailwind CSS v3 with semantic tokens mapped from CSS custom properties. No routing (one page). No state library — the only React state is the reduced-motion boolean (from `useMediaQuery`); everything animated is driven imperatively by the engine.
- **The page is empty space.** The document body holds a tall empty scroll track (`800vh`, `SCROLL_LENGTH_VH`) and a `position: fixed`, full-viewport graph-paper **stage**. The stage holds one SVG (`viewBox="0 0 1600 900"`, `preserveAspectRatio="xMidYMid slice"`) with **18 stroke `<path>`s** plus the rampr axis labels, the seven caption divs, and the scroll hint.
- **The engine** (`hooks/useNotebookFilm.ts`) owns the `requestAnimationFrame` loop. It reads `scrollY`, computes a smoothed progress `p ∈ [0,1]`, and every frame: morphs each stroke from the current stage to the next, adds "boil" (idle wobble), lays out the drawing/caption bands, transforms the SVG group to centre the doodle, and wipes the captions in. It locates elements by `data-*` markers within the stage, so the SVG, captions, and hint can live in separate components.
- **The data model** (`lib/doodle.ts`, `constants/stages.ts`, `types/doodle.ts`). A stage is `NS = 18` strokes; a stroke is `NP = 12` points. Stroke constructors (`seg`, `circle`, `ell`, `poly`, `collapse`) build the geometry; `STAGES` is the seven finished doodles and `ANCHORS` their hand-tuned visual centres. Adjacent stages morph stroke-for-stroke, so a stroke *slot* holds the "same" line across stages (slot 5 is always the tie) and unused slots park at a collapse point.
- **Copy** (`constants/content.ts`) holds the project/contact links and work-history lines; the caption text is JSX in `components/Captions.tsx`. Timing lives in `constants/animations.ts`.
- **Deploy:** static Vite build → GitHub Pages (`gh-pages -d dist`) on the `wu-wilson.github.io` repo, custom domain `wilsonwu.io` via `public/CNAME`, DNS on Cloudflare. No CI, no Docker, no server.

## Key Decisions

- **One SVG, 7×18×12 numbers.** The entire visual is a fixed grid of strokes and points morphed by scroll — no per-shape components, no images. This makes the morph trivial (lerp point-by-point) and keeps the whole design in one typed data module. Coordinates are ported verbatim from the design prototype; they are the source of truth — retune geometry in `constants/stages.ts`, never re-derive it in the engine.
- **Imperative animation by design.** Porting a pixel-and-motion-exact scroll morph to per-property React state would be slower and less faithful. The engine mutates the SVG paths and caption styles directly inside the rAF loop; React owns structure and content, the engine owns motion. This is the one place inline `style` and direct DOM writes are the right tool.
- **Responsive lives in the engine, not in CSS breakpoints.** Each frame the engine derives two screen bands (drawing on top, caption below) from `innerWidth`/`innerHeight`, caps the drawing at 500px, and — for phone landscape (`vh < 480 && vw > vh`) — splits to drawing-left / caption-right. There are no media queries for layout; the math is resolution-independent.
- **Tokens, even in the engine.** Colors the engine assigns (the tie/eye/coffee fills) are `rgb(var(--token) / a)` strings, not hex — so the whole palette still lives in `index.css`. Inline `style` carries only layout, transforms, and JS-derived values.
- **Reduced motion is honored in JS, not just CSS.** The engine snaps progress (no easing) and skips the boil under `prefers-reduced-motion`; the scroll-scrubbed drawing still works (it is user-driven, not autonomous).

## Do NOT

- Add a backend, database, auth, analytics, or any server-side anything — the site is static and frontend-only. Contact stays a `mailto:` link.
- Add an animation library (Framer Motion, GSAP, anime.js, Lenis) or a scroll library — all motion is hand-rolled `requestAnimationFrame` + SVG + CSS.
- Add UI, charting, or drawing libraries — every doodle is generated SVG built from the stroke constructors.
- Add images or icon fonts — there are no assets; keep it that way.
- Write test files or install testing libraries (TypeScript `strict` is the only linter).
- Use `any`, `as` casts (unless genuinely unavoidable), or default exports.
- Hardcode hex colors — use the semantic tokens from `index.css` / `tailwind.config.js`, including inside the engine (`rgb(var(--token))`). No dark mode, no theme toggle.
- Re-derive or "clean up" the stroke coordinates, easing constants, or layout math — they are the prototype's verbatim values. Change them only to intentionally retune the design, in the data/constants modules.
- Rename or drop a `data-*` marker (`data-s`, `data-ann`, `data-zoom`, `data-axes`, `data-hint`) without updating the engine — it finds every animated element by that attribute.
- Change the stroke/point counts (`NP`, `NS`) or a stage's stroke *order* without updating every stage — morphing is slot-for-slot, so slot indices are a contract.

## Rules (path-scoped — loaded automatically when editing matching files)

- `.claude/rules/code-style.md` — TypeScript, JSDoc, import ordering, naming, error handling. Loads for `src/**/*.{ts,tsx}`.
- `.claude/rules/component-patterns.md` — React file structure, when the engine owns a value, the `data-*` contract. Loads for `src/**/*.{ts,tsx}`.
- `.claude/rules/styling.md` — Tokens, the graph-paper visual language, inline-style boundaries, animation. Loads for `src/**/*.{tsx,css}` and `tailwind.config.js`.
- `.claude/rules/responsive.md` — The single-engine layout system: the two bands, the landscape split, the 500px cap, safe areas. Loads for `src/**/*.{tsx,css}`.

## Skills (reference knowledge)

- `.claude/skills/design-tokens/` — Exact color tokens, the font, the graph-paper grid, and animation timing.
- `.claude/skills/doodle-engine/` — How the rAF engine, the stage/stroke data model, the morph/boil/dwell, and the responsive layout fit together; the `data-*` catalog and the stroke-slot map.
