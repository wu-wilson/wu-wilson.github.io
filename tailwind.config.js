/** @type {import('tailwindcss').Config} */

/** Reference a channel-based CSS custom property so Tailwind opacity modifiers resolve. */
const ch = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
