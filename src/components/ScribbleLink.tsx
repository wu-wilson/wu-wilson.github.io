import type { CSSProperties, FC } from 'react';

/** Props for {@link ScribbleLink}. */
interface ScribbleLinkProps {
  /** Destination; anything but a `mailto:` link opens in a new tab. */
  href: string;
  /** The link's text. */
  label: string;
  /** Layout class for a link placed outside a caption (the corner resume link). */
  className?: string;
  /** Inline style, e.g. the contact links' smaller size. */
  style?: CSSProperties;
}

/**
 * A link with the page's hand-drawn underline, so every link reads as one by its mark, not only its
 * teal. Text and underline both take `currentColor`, so they darken together on hover; the
 * underline's placement lives in the `.scribble` rule in `index.css`.
 * @param props - Destination, text, and an optional layout class and style
 * @returns The underlined link
 */
export const ScribbleLink: FC<ScribbleLinkProps> = ({ href, label, className, style }) => {
  const opensNewTab = !href.startsWith('mailto:');
  return (
    <a
      href={href}
      className={className}
      style={style}
      {...(opensNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {label}
      <svg
        className="scribble"
        viewBox="0 0 60 5"
        preserveAspectRatio="none"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <path d="M1.5 3.1 Q16 0.9 30 2.7 Q44 4.5 58.5 1.9" vectorEffect="non-scaling-stroke" />
      </svg>
    </a>
  );
};
