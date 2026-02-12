import { IconType } from "react-icons/lib";

export type IconLinkProps = {
  href: string;
  label: string;
  showLabel?: boolean;
  icon: IconType;
};

function IconLink({
  href,
  label,
  showLabel = false,
  icon: Icon,
}: IconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex items-center gap-5 rounded-md border-2 p-2
        transition-transform duration-200
        hover:-translate-y-1
        hover:text-(--primary)
      "
    >
      <Icon className="h-5 w-5" aria-hidden="true" /> {showLabel && label}
    </a>
  );
}

export default IconLink;
