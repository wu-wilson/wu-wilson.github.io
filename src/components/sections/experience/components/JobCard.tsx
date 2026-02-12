import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type JobRole = {
  title: string;
  timeframe: string;
};

export type JobCardProps = {
  company: string;
  roles: JobRole[];
  description: string;
  skills: string[];
  href: string;
};

function JobCard({ company, roles, description, skills, href }: JobCardProps) {
  return (
    <Card href={href} label={`${company} website`}>
      <h1 className="text-lg">{company}</h1>
      {roles.map(({ title, timeframe }) => (
        <section key={`${company} title`} className="flex flex-col gap-2">
          <span className="text-(--primary)">{title}</span>
          <span className="text-sm">{timeframe}</span>
        </section>
      ))}
      {description}
      <footer className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </footer>
    </Card>
  );
}

export default JobCard;
