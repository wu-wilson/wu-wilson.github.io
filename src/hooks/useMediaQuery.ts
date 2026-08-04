import { useEffect, useState } from 'react';

/**
 * Track whether a CSS media query currently matches, re-rendering on change. The site's layout is
 * resolution-independent, so this reads user preferences — not breakpoints.
 * @param query - A media query string (e.g. `(prefers-reduced-motion: reduce)`)
 * @returns `true` while the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
