/** A flagship project featured in the Projects scene. */
export interface Project {
  /** Two-digit chapter label shown oversized (e.g. `01`). */
  index: string;
  name: string;
  /** Full description used in the pinned desktop scene. */
  blurb: string;
  /** Condensed description used on the flowing mobile card. */
  blurbShort: string;
  /** Tech-stack tags shown on desktop. */
  tags: string[];
  /** Trimmed tag set shown on the narrower mobile card. */
  tagsShort: string[];
  liveUrl: string;
  sourceUrl: string;
  /** Persistence key / asset base name for the project screenshot. */
  imageKey: string;
  /** Alt text for the project screenshot. */
  imageAlt: string;
}

/** A single career entry, plotted on the desktop chart and listed on mobile. */
export interface ExperienceEntry {
  year: string;
  company: string;
  role: string;
  /** Descriptive line shown under the role; only the current role shows it on mobile. */
  blurb?: string;
  /** Short status tag (e.g. `RETURN OFFER →`, `PROMOTED ↑`, `CURRENT`). */
  status?: string;
  /** Plot coordinates in the desktop chart's `0 0 1280 600` viewBox. */
  point: { x: number; y: number };
  /** Whether this is the current, highlighted role (larger node + pulse). */
  current?: boolean;
}

/** An external social/profile link shown in the contact scene. */
export interface SocialLink {
  label: string;
  href: string;
}
