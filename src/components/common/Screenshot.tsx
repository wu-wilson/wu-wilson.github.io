import React, { useState } from 'react';

interface ScreenshotProps {
  /** Asset base name; resolves to `/projects/{imageKey}.png`. */
  imageKey: string;
  alt: string;
  /** When set, the frame becomes a link to this URL, opened in a new tab. */
  href?: string;
}

/**
 * A project screenshot that fills its frame, falling back to a hand-labeled placeholder when
 * the image is missing (e.g. before a screenshot has been added to `public/projects/`). When
 * `href` is given, the whole frame becomes a new-tab link (e.g. to the project's live site).
 * @param props - The image key, alt text, and optional link URL
 * @returns The image (or placeholder), wrapped in a link when `href` is set
 */
export const Screenshot: React.FC<ScreenshotProps> = ({ imageKey, alt, href }) => {
  const [failed, setFailed] = useState(false);

  const inner = failed ? (
    <div
      className="font-hand"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(var(--line-3) / 0.5)',
        color: 'rgb(var(--muted-2))',
        fontSize: 13,
        textAlign: 'center',
        padding: 24,
      }}
    >
      {alt}
    </div>
  ) : (
    <img
      src={`/projects/${imageKey}.png`}
      alt={alt}
      onError={() => setFailed(true)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'top',
      }}
    />
  );

  if (!href) return inner;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ position: 'absolute', inset: 0, display: 'block', cursor: 'pointer' }}
    >
      {inner}
    </a>
  );
};
