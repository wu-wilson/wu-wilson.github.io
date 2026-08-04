/** @type {import('tailwindcss').Config} */

/** Reference a channel-based CSS custom property so Tailwind opacity modifiers resolve. */
const ch = (name) => `rgb(var(${name}) / <alpha-value>)`;

/**
 * Treat only the contents of a `className` attribute as class candidates. Tailwind's default
 * extractor mines every word in a file, and this project's own vocabulary collides with utility
 * names — the `collapse` stroke constructor, `onResize`, `position: 'absolute'` in style objects,
 * even the word "grid" inside a docstring — so it was emitting a dozen utilities that no markup
 * uses. Scoping the extractor keeps real classes working and stops a comment from changing the
 * stylesheet.
 * @param content - Raw source text of one scanned `.ts`/`.tsx` file
 * @returns Every whitespace-separated class name written literally inside a `className`
 */
const fromClassName = (content) =>
  [...content.matchAll(/className\s*=\s*\{?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g)]
    .flatMap((m) => (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/))
    .filter(Boolean);

export default {
  content: {
    files: ['./index.html', './src/**/*.{ts,tsx}'],
    extract: { ts: fromClassName, tsx: fromClassName },
  },
  theme: {
    extend: {
      colors: {
        paper: ch('--paper'),
        ink: ch('--ink'),
        'ink-soft': ch('--ink-soft'),
        link: ch('--link'),
        'link-hover': ch('--link-hover'),
        grid: ch('--grid'),
      },
      fontFamily: {
        hand: ['"Gloria Hallelujah"', 'cursive'],
      },
    },
  },
  plugins: [],
};
