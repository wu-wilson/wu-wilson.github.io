import Section from "@/components/layout/Section";
import ProjectCard, { ProjectCardProps } from "./components/ProjectCard";

const PROJECTS: ProjectCardProps[] = [
  {
    name: "Stratify",
    description:
      "A lightweight, intuitive Kanban board application built to help small teams manage tasks without the complexity of full enterprise tools.",
    skills: [
      "React",
      "TypeScript",
      "SASS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Firebase",
    ],
    href: "https://github.com/wu-wilson/stratify",
  },
  {
    name: "Togethr",
    description:
      "A simple, local-first budgeting application built to help people manage their finances.",
    skills: [
      "React",
      "TypeScript",
      "Tailwind",
      "shadcn",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
    ],
    href: "https://github.com/wu-wilson/togethr",
  },
  {
    name: "Unravel",
    description:
      "An interactive CLI tool that untangles your project's dependencies, showing gzipped npm package sizes and tracking imports.",
    skills: ["React Ink", "TypeScript"],
    href: "https://github.com/wu-wilson/unravel",
  },
];

function ProjectsSection() {
  return (
    <Section
      id="projects"
      spritesheet="hammer"
      label="Projects"
      description="some stuff I've built"
    >
      {PROJECTS.map((project) => (
        <ProjectCard key={project.name} {...project} />
      ))}
    </Section>
  );
}

export default ProjectsSection;
