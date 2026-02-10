import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";
import {
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiFileText,
} from "react-icons/fi";

type Social = {
  href: string;
  label: string;
  icon: IconType;
};

const socials: Social[] = [
  {
    href: "https://github.com/wu-wilson",
    label: "GitHub",
    icon: FiGithub,
  },
  {
    href: "https://linkedin.com/in/wils-wu",
    label: "LinkedIn",
    icon: FiLinkedin,
  },
  {
    href: "https://www.instagram.com/wilson_wu123",
    label: "Instagram",
    icon: FiInstagram,
  },
  {
    href: "https://www.youtube.com/@wilsonwu6209",
    label: "Youtube",
    icon: FiYoutube,
  },
  {
    href: "mailto:wilson.cui.wu@gmail.com",
    label: "Email",
    icon: FiMail,
  },
];

function Hero() {
  return (
    <div className="flex flex-col items-center w-full p-3 gap-5">
      <h1 className="text-5xl">Wilson Wu</h1>
      <h2 className="text-xl">Full-Stack Engineer</h2>
      <span className="w-70 text-center">
        I build apps that feel simple, clean, and easy to use.
      </span>
      <Button variant="outline">
        <FiFileText />
        Resume
      </Button>
      <div className="flex gap-3">
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
