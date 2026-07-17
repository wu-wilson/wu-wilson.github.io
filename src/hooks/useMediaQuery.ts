import { useEffect, useState } from 'react';

/**
 * Track whether a CSS media query currently matches, re-rendering on change. Used to swap the
 * pinned desktop film for the flowing mobile layout at the breakpoint, and to read the user's
 * reduced-motion preference.
 * @param query - A media query string (e.g. `(max-width: 820px)`)
 * @returns `true` while the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
