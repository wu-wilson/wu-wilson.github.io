import React from 'react';

interface ProjectLinksProps {
  liveUrl: string;
  sourceUrl: string;
  /** Gap between the two links in px (default 18, the desktop spacing). */
  gap?: number;
  /** Link font size in px (default 12, the desktop size). */
  fontSize?: number;
}

/**
 * The "LIVE ↗ / SOURCE ↗" link pair shown under a project.
 * @param props - The destination URLs and optional gap / font-size overrides for mobile
 * @returns The link row
 */
export const ProjectLinks: React.FC<ProjectLinksProps> = ({
  liveUrl,
  sourceUrl,
  gap = 18,
  fontSize = 12,
}) => (
  <div style={{ display: 'flex', gap, marginTop: 4 }}>
    <a
      href={liveUrl}
      target="_blank"
      rel="noreferrer"
      className="font-hand text-brand"
      style={{ fontSize, fontWeight: 600 }}
    >
      LIVE ↗
    </a>
    <a
      href={sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="font-hand text-brand"
      style={{ fontSize, fontWeight: 600 }}
    >
      SOURCE ↗
    </a>
  </div>
);
