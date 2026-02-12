import { useIsAtTop } from "@/hooks/useIsAtTop";
import { useScrollDirection } from "@/hooks/useScrollDirection";

type NavigationLink = {
  label: string;
  href: string;
};

const NAVIGATION_LINKS: NavigationLink[] = [
  { label: "About Me", href: "#about" },
  { label: "Work Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

function NavigationBar() {
  const scrollDirection = useScrollDirection();
  const isAtTop = useIsAtTop();

  const hide = scrollDirection === "down";
  const showShadow = !isAtTop;

  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-16 z-50 backdrop-blur-md
        flex items-center justify-center gap-5
        transition-all duration-200
        ${hide ? "-translate-y-full" : "translate-y-0"}
        ${showShadow && "shadow-md"}
      `}
    >
      {NAVIGATION_LINKS.map(({ label, href }, i) => (
        <a key={i} href={href} className="hover:text-(--primary)">
          {label}
        </a>
      ))}
    </div>
  );
}

export default NavigationBar;
