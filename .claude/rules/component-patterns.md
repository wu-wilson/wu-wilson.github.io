---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Component Patterns

## File Structure

1. Imports
2. Props interface (with JSDoc on non-obvious props)
3. Component (with JSDoc above)
4. Helper functions / local constants

## State vs. the engine

- **The engine owns motion.** Anything that changes with scroll (opacity, transform, visibility, the line, colors that track the active scene) is written imperatively by `useFilmEngine` / `useMobileFilm` every frame — never React state. Components render the element once, with its *rest / initial* inline style, and tag it with `data-fx`; the engine takes over from there.
- **React owns structure, content, and discrete UI state.** Use `useState` only for genuinely discrete interactions: the mobile menu open/closed, and the copy-button "copied" label. Keep such state in the smallest component possible (e.g. `CopyButton` owns its own `copied`) so toggling it never re-renders — and never re-inits the rest styles of — an engine-driven scene.
- No shared state store, no prop-drilling of animation values. The engines read the DOM, not props.

## The `data-fx` contract

- Every animated element carries `data-fx="{key}"`. The engines locate elements by this attribute within a root (`track` on desktop, `mWrap` on mobile), so scenes can be separate components.
- Keys are the contract between markup and engine. If you add, rename, or remove a `data-fx`, update the corresponding engine section. The line's anchors (`heroUnder`, `aboutU`, `pmedia`, `chartBox`, `cu` on desktop; `mU0`, `mU1`, `mF1..3`, `mX0..4`, `mContact` on mobile) additionally feed `lib/snake.ts`.
- Preserve DOM nesting when refactoring a scene: the line measures boxes by walking `offsetParent` chains up to the stage, so changing an anchor's offset parent moves the line.

## Content

- Projects, experience, socials, and nav come from `constants/content.ts`; both layouts render from it. Store layout-specific copy as explicit fields (`blurb` / `blurbShort`, `tags` / `tagsShort`) rather than truncating at render.
- Derive display strings in the component (e.g. the `NN/0N` chapter label, a mobile status line) — don't add redundant fields for what a line of code can compute.

## Limits

- Components stay small and single-purpose; extract a sub-component (e.g. `ProjectText`, `ProjectMedia`) rather than growing one past readability. The engines are the deliberate exception — they are one cohesive module each, documented section by section.
