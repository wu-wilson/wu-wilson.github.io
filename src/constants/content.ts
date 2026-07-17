import type { ExperienceEntry, Project, SocialLink } from '../types/content';

/** Short bio line shown in the About scene; the emphasized span is underlined by the line. */
export const ABOUT = {
  kicker: 'ABOUT',
  title: 'Full-stack engineer.',
  /** Text before the underlined phrase. */
  lead: 'I design, build, and ship web apps ',
  /** The phrase the travelling line underlines. */
  emphasis: 'end to end',
  /** Text after the underlined phrase. */
  tail: ' — currently building observability tools at Capital One.',
} as const;

/** The three flagship projects, in scroll order. */
export const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'Krawly',
    blurb:
      'Enter any URL and watch the site map itself in real time — every page a node in a live force-directed graph, color-coded by HTTP status so broken links surface immediately.',
    blurbShort:
      'Watch any site map itself in real time — a live, force-directed graph color-coded by HTTP status.',
    tags: ['React', 'TypeScript', 'D3', 'Zustand', 'Express', 'Railway', 'Cloudflare'],
    tagsShort: ['React', 'TypeScript', 'D3', 'Railway', 'Cloudflare'],
    liveUrl: 'https://krawly.dev',
    sourceUrl: 'https://github.com/wu-wilson/krawly',
    imageKey: 'krawly',
    imageAlt: 'Krawly — a live force-directed graph of a crawled website',
  },
  {
    index: '02',
    name: 'Tallies',
    blurb:
      'Scan a receipt and split the bill — Claude-powered OCR reads the items, you assign them to people, and everyone gets their share via a short link. Multiple receipts, one breakdown.',
    blurbShort:
      'Scan receipts, assign items, share a per-person breakdown via short link — OCR by Claude.',
    tags: ['React', 'TypeScript', 'Claude API', 'Express', 'Postgres', 'Railway', 'Cloudflare'],
    tagsShort: ['React', 'TypeScript', 'Claude API', 'Express', 'Railway', 'Cloudflare'],
    liveUrl: 'https://tallies.dev',
    sourceUrl: 'https://github.com/wu-wilson/tallies',
    imageKey: 'tallies',
    imageAlt: 'Tallies — a scanned receipt split into per-person shares',
  },
  {
    index: '03',
    name: 'Rampr',
    blurb:
      "A board of who's actually ramping up hiring — polls public Greenhouse, Lever, and Ashby job feeds daily and tracks how every company's open-role count moves over time.",
    blurbShort:
      "Who's actually hiring — daily polls of public ATS job feeds, tracking open-role counts over time.",
    tags: ['React', 'TypeScript', 'Express', 'Postgres', 'Railway', 'Cloudflare'],
    tagsShort: ['React', 'TypeScript', 'Express', 'Postgres', 'Railway', 'Cloudflare'],
    liveUrl: 'https://rampr.dev',
    sourceUrl: 'https://github.com/wu-wilson/rampr',
    imageKey: 'rampr',
    imageAlt: "Rampr — a hiring-momentum board tracking companies' open-role counts",
  },
];

/**
 * Career entries in chronological order, with plot coordinates for the desktop chart's
 * `0 0 1280 600` viewBox. The mobile list renders these most-recent-first.
 */
export const EXPERIENCE: ExperienceEntry[] = [
  {
    year: '2021',
    company: 'Sikka Software',
    role: 'SWE Intern',
    blurb: 'healthcare analytics dashboards',
    point: { x: 140, y: 450 },
  },
  {
    year: '2022',
    company: 'Fidelity',
    role: 'SWE Intern',
    blurb: 'investing platform UI + REST',
    point: { x: 340, y: 410 },
  },
  {
    year: '2023',
    company: 'Capital One',
    role: 'SWE Intern',
    status: 'RETURN OFFER →',
    point: { x: 560, y: 340 },
  },
  {
    year: '2024',
    company: 'Capital One',
    role: 'Associate SWE',
    status: 'PROMOTED ↑',
    point: { x: 800, y: 265 },
  },
  {
    year: '2026',
    company: 'Capital One',
    role: 'Senior Associate SWE',
    status: 'CURRENT',
    blurb: 'observability tools that catch anomalies before they become outages',
    point: { x: 1080, y: 180 },
    current: true,
  },
];

/** Experience heading meta. */
export const EXPERIENCE_META = { title: 'EXPERIENCE', range: '2021 → present' } as const;

/** Social/profile links, in display order. */
export const SOCIALS: SocialLink[] = [
  { label: 'GITHUB', href: 'https://github.com/wu-wilson' },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/wils-wu' },
  { label: 'INSTAGRAM', href: 'https://instagram.com/wilson_wu123' },
];

/** Primary nav destinations (desktop links + mobile menu). */
export const NAV_LINKS = [
  { label: 'ABOUT', target: 'about' },
  { label: 'PROJECTS', target: 'projects' },
  { label: 'EXPERIENCE', target: 'experience' },
  { label: 'CONTACT', target: 'contact' },
] as const;
