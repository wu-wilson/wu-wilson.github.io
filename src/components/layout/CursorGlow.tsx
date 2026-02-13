import { useIsFinePointer } from "@/hooks/useIsFinePointer";
import { useMousePosition } from "@/hooks/useMousePosition";

export default function CursorGlow() {
  const isFinePointer = useIsFinePointer();
  const position = useMousePosition(isFinePointer);

  if (!isFinePointer || !position) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-10"
      style={{
        background: `radial-gradient(
          800px at ${position.x}px ${position.y}px,
          var(--primary),
          transparent 70%
        )`,
      }}
    />
  );
}
