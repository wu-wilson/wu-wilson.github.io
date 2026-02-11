import Project, { ProjectProps } from "@/components/custom/project";
import Section from "@/components/custom/section";

const PROJECTS: ProjectProps[] = [
  {
    name: "Stratify",
    description:
      "A lightweight, intuitive Kanban board application built to help small teams manage tasks without the complexity of full enterprise tools.",
    tools: ["React", "TypeScript", "SASS", "Node.js", "Express", "PostgreSQL"],
    github: "https://github.com/wu-wilson/stratify",
    youtube: "https://www.youtube.com/watch?v=oEfJazUEyto",
  },
  {
    name: "Togethr",
    description:
      "A simple, local-first budgeting application built to help people manage their finances.",
    tools: [
      "React",
      "TypeScript",
      "Tailwind",
      "shadcn",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
    ],
    github: "https://github.com/wu-wilson/togethr",
    youtube: "https://www.youtube.com/watch?v=h2FI8OoysfM",
  },
  {
    name: "Unravel",
    description:
      "An interactive CLI tool that untangles your project's dependencies, showing gzipped npm package sizes and tracking imports.",
    tools: ["React Ink", "TypeScript"],
    github: "https://github.com/wu-wilson/unravel",
    youtube: "https://www.youtube.com/watch?v=MCo71SJ0has",
  },
];

function Projects() {
  return (
    <Section title="STUFF I'VE BUILT" spritesheet="hammer">
      <div className="flex flex-col w-full max-w-125 gap-5">
        {PROJECTS.map((project, i) => (
          <Project key={i} {...project} />
        ))}
      </div>
    </Section>
  );
}

export default Projects;
