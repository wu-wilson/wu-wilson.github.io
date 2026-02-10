import { ReactNode } from "react";
import Sprite, { Sheet } from "./sprite";

type SectionProps = {
  children: ReactNode;
  title: string;
  spritesheet: Sheet;
};

function Section({ children, title, spritesheet }: SectionProps) {
  return (
    <div className="flex flex-col items-center w-full p-3">
      <Sprite sheet={spritesheet} />
      <h1 className="font-bold my-2">{title}</h1>
      {children}
    </div>
  );
}

export default Section;
