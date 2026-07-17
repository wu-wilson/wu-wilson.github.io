/** @type {import('tailwindcss').Config} */

/** Reference a channel-based CSS custom property so Tailwind opacity modifiers resolve. */
const ch = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      md: '821px',
    },
    extend: {
      colors: {
        paper: ch('--paper'),
        ink: ch('--ink'),
        'ink-soft': ch('--ink-soft'),
        brand: ch('--brand'),
        'brand-dark': ch('--brand-dark'),
        'brand-flood': ch('--brand-flood'),
        muted: {
          1: ch('--muted-1'),
          2: ch('--muted-2'),
          3: ch('--muted-3'),
        },
        line: {
          1: ch('--line-1'),
          2: ch('--line-2'),
          3: ch('--line-3'),
        },
        faint: ch('--faint'),
        'paper-on-blue': ch('--paper-on-blue'),
        'muted-on-blue': ch('--muted-on-blue'),
      },
      fontFamily: {
        display: ['"Shantell Sans"', 'cursive'],
        hand: ['"Architects Daughter"', 'cursive'],
      },
    },
  },
  plugins: [],
};
