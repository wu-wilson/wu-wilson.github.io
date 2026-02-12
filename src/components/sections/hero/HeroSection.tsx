import IconLink, { IconLinkProps } from "@/components/ui/IconLink";
import {
  LuFileText,
  LuGithub,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuYoutube,
} from "react-icons/lu";

const SOCIALS: IconLinkProps[] = [
  {
    href: "https://github.com/wu-wilson",
    label: "GitHub",
    icon: LuGithub,
  },
  {
    href: "https://linkedin.com/in/wils-wu",
    label: "LinkedIn",
    icon: LuLinkedin,
  },
  {
    href: "https://www.instagram.com/wilson_wu123",
    label: "Instagram",
    icon: LuInstagram,
  },
  {
    href: "https://www.youtube.com/@wilsonwu6209",
    label: "YouTube",
    icon: LuYoutube,
  },
  {
    href: "mailto:wilson.cui.wu@gmail.com",
    label: "Email",
    icon: LuMail,
  },
];

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-5 gap-6">
      <h1 className="text-5xl">Wilson Wu</h1>
      <h2 className="text-xl text-(--primary)">Full-Stack Engineer</h2>
      <p className="max-w-120">
        I build apps that are simple, clean, and reliable — because software
        should look <strong className="text-(--primary) underline">and</strong>{" "}
        feel good.
      </p>
      <IconLink
        href="/Wilson_Wu_Resume.pdf"
        label="View Resume"
        showLabel={true}
        icon={LuFileText}
      />
      <div className="flex gap-3">
        {SOCIALS.map((social) => (
          <IconLink {...social} key={social.href} />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
