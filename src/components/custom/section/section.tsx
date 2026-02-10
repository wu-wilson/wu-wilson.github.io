import Sprite from "../sprite/Sprite";
import { SectionProps } from "./types";

function Section({ children, title, spritesheet }: SectionProps) {
  return (
    <div className="flex flex-col w-full border p-3">
      <div className="flex items-baseline">
        <Sprite sheet={spritesheet} />
        <span className="">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default Section;
