import Sprite, { Spritesheet } from "../ui/Sprite";
import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  spritesheet: Spritesheet;
  label: string;
  description: string;
  id: string;
};

function Section({
  children,
  spritesheet,
  label,
  description,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className="flex flex-col w-full max-w-2xl items-center py-10 px-5 gap-5"
    >
      <Sprite spritesheet={spritesheet} />
      <h1 className="text-2xl">{label}</h1>
      <h2 className="text-lg text-(--text-accent)">{description}</h2>
      {children}
    </section>
  );
}

export default Section;
