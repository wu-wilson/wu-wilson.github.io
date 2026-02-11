import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FiGithub, FiYoutube } from "react-icons/fi";

export type ProjectProps = {
  name: string;
  description: string;
  tools: string[];
  github: string;
  youtube: string;
};

function Project({ name, description, tools, github, youtube }: ProjectProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">{description}</CardContent>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool, i) => (
            <Badge key={i}>{tool}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} GitHub link`}
            >
              <FiGithub />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} YouTube link`}
            >
              <FiYoutube />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Project;
