/**
 * All copy and links for the seven captions, kept out of the JSX so the words are easy to edit.
 * Caption order matches `STAGES`. The prototype's exact wording is the source of truth.
 */

/** An external link rendered inside a caption (teal, no underline). */
interface CaptionLink {
  label: string;
  href: string;
}

/** Primary contact address (mailto — the site is fully static, no backend). */
const EMAIL = 'wilson.cui.wu@gmail.com';

/** The three flagship projects, linked from their captions. */
export const PROJECTS = {
  krawly: { label: 'krawly', href: 'https://krawly.dev' },
  tallies: { label: 'tallies', href: 'https://tallies.dev' },
  rampr: { label: 'rampr', href: 'https://rampr.dev' },
};

/** Work-history lines shown, stacked and dimmed, under the "work" caption. Newest first. */
export const WORK_HISTORY: string[] = [
  '2026 capital one, senior associate swe',
  '2024 capital one, associate swe',
  '2023 capital one, swe intern',
  '2022 fidelity, swe intern',
  '2021 sikka software, swe intern',
];

/** Contact links shown, stacked, under the final "mail" caption. */
export const CONTACT_LINKS: CaptionLink[] = [
  { label: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'github.com/wu-wilson', href: 'https://github.com/wu-wilson' },
  { label: 'linkedin.com/in/wils-wu', href: 'https://www.linkedin.com/in/wils-wu' },
];
