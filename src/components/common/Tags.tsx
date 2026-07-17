import React from 'react';

interface TagsProps {
  /** Tech-stack labels to render as hand-drawn chips. */
  tags: string[];
}

/**
 * A wrapping row of tech-stack tags, each a hand-sketched wobble chip.
 * @param props - The tags to render
 * @returns The tag row
 */
export const Tags: React.FC<TagsProps> = ({ tags }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {tags.map((tag) => (
      <span
        key={tag}
        className="font-hand wobble-sm"
        style={{
          fontSize: 10,
          fontWeight: 500,
          border: '1.5px solid rgb(var(--line-1))',
          padding: '4px 8px',
          color: 'rgb(var(--muted-2))',
        }}
      >
        {tag}
      </span>
    ))}
  </div>
);
