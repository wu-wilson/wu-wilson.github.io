import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

function Badge({ children }: BadgeProps) {
  return (
    <span className="flex items-center rounded-md text-sm bg-(--surface) p-2">
      {children}
    </span>
  );
}

export default Badge;
