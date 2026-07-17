---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Code Style

## TypeScript

- Strict mode enabled. No `any` — use `unknown` with narrowing. No `as` casts unless genuinely unavoidable (the engines' `querySelector<T>` generics carry types instead). Prefer `interface` for object shapes, `type` for unions.
- Functional components: `const` arrow functions typed via a `{ComponentName}Props` interface defined directly above the component.
- Named exports only — no default exports.

## Docstrings

- Every exported function, hook, component, and type has a JSDoc docstring.
- **Functions, hooks, components:** one-sentence overview (a second sentence when it helps), then `@param name - description` for each parameter, then `@returns description` (omit `@returns` only on void functions). Both tags are mandatory when applicable — never "as appropriate".
- **Types/interfaces:** one-line overview; add inline `/** … */` on individual fields that need explanation, leave self-evident fields untagged.
- `@param`/`@returns` are prose only — don't restate the TypeScript type. Add semantic info the signature doesn't carry (units, normalized 0..1 progress, px, coordinate space, null-vs-empty).
- Don't use `@throws`; describe failure semantics in prose or a result shape.
- Internal helpers: a one-line `/** … */` only when the name doesn't carry the whole meaning.

## Imports

- Group with blank lines: third-party → Components → Hooks → Lib/utils → Constants → Types (via `import type`).
- All imports relative (`../../constants/...`). No path aliases.
- Alphabetical within groups.

## Naming

- Event handlers: `handle{Event}` (or `on{Event}` for passed-in callbacks). Hooks: `use{Name}`. Booleans: `is`/`has`/`should`.
- PascalCase component files (`Hero.tsx`); camelCase for hooks, lib, and util files (`snake.ts`, `easing.ts`).
- SCREAMING_SNAKE_CASE module constants (`FILM_LENGTH_VH`, `PROGRESS_SMOOTHING`); PascalCase types.
- Animation markers use the `data-fx="{key}"` attribute; keep keys short and stable (`heroUnder`, `pmedia`, `flood`).

## Patterns

- Pure functions, early returns, no deep nesting. 2-space indent, semicolons always, single quotes in code / double in JSX.
- Try/catch async operations meaningfully; `finally` for cleanup; no silent swallowing. (`copyText` deliberately returns a boolean instead of throwing.)
- The engines' rAF loops must clean up on unmount — clear the running flag, remove listeners, clear timeouts. Never leak a loop or a `resize` handler.
- No dead code, unused imports, unused exports, or speculative abstractions.
- No `console.log`. There is no operational logging surface here — the site is a static frontend.
