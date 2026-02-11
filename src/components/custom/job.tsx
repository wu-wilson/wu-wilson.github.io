import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = {
  title: string;
  timeframe: string;
};

export type JobProps = {
  company: string;
  roles: Role[];
  description: string;
  tools: string[];
};

function Job({ company, roles, description, tools }: JobProps) {
  return (
    <Card className="w-full">
      <CardHeader className="gap-0">
        <CardTitle>{company}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col text-sm gap-6">
        {roles.map((role, i) => (
          <div key={i} className="flex flex-col">
            <span>{role.title}</span>
            <CardDescription>{role.timeframe}</CardDescription>
          </div>
        ))}
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool, i) => (
            <Badge key={i}>{tool}</Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export default Job;
