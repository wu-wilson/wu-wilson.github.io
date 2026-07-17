import React, { useEffect, useRef, useState } from 'react';

import { copyText } from '../../lib/clipboard';

interface CopyButtonProps {
  /** Text placed on the clipboard when clicked. */
  text: string;
}

/**
 * A copy-to-clipboard button styled for the blue contact panel. Owns its own "copied" state so
 * toggling the label never re-renders (and never flickers) the engine-driven contact scene.
 * @param props - The text to copy
 * @returns The copy button
 */
export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async (): Promise<void> => {
    await copyText(text);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="font-hand wobble-md border-[1.5px] border-paper-on-blue text-paper-on-blue transition-colors hover:bg-paper-on-blue/10"
      style={{ fontWeight: 600, fontSize: 12, padding: '12px 16px', cursor: 'pointer', background: 'transparent' }}
    >
      {copied ? '✓ COPIED' : 'COPY ⧉'}
    </button>
  );
};
