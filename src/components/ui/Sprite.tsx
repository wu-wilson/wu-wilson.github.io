import hammer from "@/assets/spritesheets/hammer.png";
import resume from "@/assets/spritesheets/resume.png";
import chest from "@/assets/spritesheets/chest.png";

export type Spritesheet = "chest" | "hammer" | "resume";

type SpriteProps = {
  spritesheet: Spritesheet;
};

const SPRITESHEETS: Record<Spritesheet, string> = {
  hammer,
  resume,
  chest,
};

function Sprite({ spritesheet }: SpriteProps) {
  const url = SPRITESHEETS[spritesheet];

  return (
    <div
      className="h-25 w-32 overflow-hidden bg-no-repeat bg-size-[1792px_100px] [image-rendering:pixelated] animate-spritesheet"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}

export default Sprite;
