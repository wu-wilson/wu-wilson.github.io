import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import stratify from "@/assets/thumbnails/stratify.png";
import togethr from "@/assets/thumbnails/togethr.png";
import unravel from "@/assets/thumbnails/unravel.png";

const THUMBNAILS: Record<string, string> = {
  stratify,
  togethr,
  unravel,
};

export type ProjectCardProps = {
  name: string;
  description: string;
  skills: string[];
  href: string;
};

function ProjectCard({ name, description, skills, href }: ProjectCardProps) {
  const thumbnail = THUMBNAILS[name.toLowerCase()];

  return (
    <Card href={href} label={`${name} video demo`}>
      <h1 className="text-lg">{name}</h1>
      <p>{description}</p>
      <footer className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </footer>
      <img
        src={thumbnail}
        alt={`${name} thumbnail`}
        className="max-w-xs rounded-md"
      />
    </Card>
  );
}

export default ProjectCard;
