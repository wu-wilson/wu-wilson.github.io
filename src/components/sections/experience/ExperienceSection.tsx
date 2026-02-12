import Section from "@/components/layout/Section";
import JobCard, { JobCardProps } from "./components/JobCard";

const JOBS: JobCardProps[] = [
  {
    company: "Capital One",
    roles: [
      {
        title: "Senior Associate Software Engineer",
        timeframe: "JAN 2026 - PRESENT",
      },
      {
        title: "Associate Software Engineer",
        timeframe: "AUG 2024 - JAN 2026",
      },
      {
        title: "Software Engineering Intern",
        timeframe: "JUN 2023 - AUG 2023",
      },
    ],
    description:
      "Built cloud-based observability tools that analyze service traffic and detect anomalies, helping engineers identify and resolve issues before they become outages.",
    skills: [
      "Angular",
      "TypeScript",
      "Jest",
      "FastAPI",
      "Python",
      "Lambda",
      "ECS",
      "DynamoDB",
      "PostgreSQL",
    ],
    href: "https://www.capitalone.com",
  },
  {
    company: "Fidelity Investments",
    roles: [
      {
        title: "Software Engineering Intern",
        timeframe: "JUN 2022 - AUG 2022",
      },
    ],
    description:
      "Helped build new features for a personal investing platform by developing responsive UI components and RESTful endpoints, improving usability and expanding core functionality.",
    skills: [
      "React",
      "JavaScript",
      "Jest",
      "Node.js",
      "Express",
      "MySQL",
      "Docker",
    ],
    href: "https://www.fidelity.com",
  },
  {
    company: "Sikka Software",
    roles: [
      {
        title: "Software Engineering Intern",
        timeframe: "AUG 2021 - MAY 2022",
      },
    ],
    description:
      "Developed full-stack analytics dashboards used by healthcare providers. Built RESTful APIs and interactive frontend data visualizations to present real-time operational and financial insights.",
    skills: ["React", "TypeScript", "SASS", "C#", "ASP.NET CORE", "MySQL"],
    href: "https://sikkasoft.com",
  },
];

function ExperienceSection() {
  return (
    <Section
      id="experience"
      spritesheet="resume"
      label="Work Experience"
      description="where I've worked and what I did"
    >
      {JOBS.map((job) => (
        <JobCard key={job.company} {...job} />
      ))}
    </Section>
  );
}

export default ExperienceSection;
