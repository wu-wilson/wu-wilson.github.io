import { HTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  href: string;
  label: string;
};

function Card({ children, href, label }: CardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex flex-col w-full border rounded-md p-5 gap-5 
        transition-transform duration-200
        hover:-translate-y-1
        hover:border-(--primary)
      "
    >
      {children}
    </a>
  );
}

export default Card;
