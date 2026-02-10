import { ReactNode } from "react";
import { Sheet } from "../sprite/types";

export type SectionProps = {
  children: ReactNode;
  title: string;
  spritesheet: Sheet;
};
