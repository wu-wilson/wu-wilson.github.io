import hammer from "@/assets/hammer.png";
import resume from "@/assets/resume.png";
import chest from "@/assets/chest.png";
import { Sheet, SpriteProps } from "./types";

const SPRITESHEETS: Record<Sheet, string> = {
  hammer,
  resume,
  chest,
};

function Sprite({ sheet }: SpriteProps) {
  const url = SPRITESHEETS[sheet];

  return (
    <div
      className="h-24 w-24 overflow-hidden bg-no-repeat bg-size-[1344px_96px] [image-rendering:pixelated] animate-sprite14"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}

export default Sprite;
