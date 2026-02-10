import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, LucideIcon } from "lucide-react";

type Social = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const socials: Social[] = [
  {
    href: "https://github.com/wu-wilson",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/in/wils-wu",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:wilson.cui.wu@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

function Hero() {
  return (
    <div className="flex flex-col items-center w-full p-3 gap-3">
      <h1 className="text-5xl">Wilson Wu</h1>
      <h2 className="text-xl">Full-Stack Engineer</h2>
      <span className="w-70 text-center mt-4">
        I build apps that feel simple, clean, and easy to use.
      </span>
      <div className="flex gap-3 mt-4">
        {socials.map(({ href, label, icon: Icon }) => (
          <Button key={label} variant="outline" size="icon" asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Hero;
