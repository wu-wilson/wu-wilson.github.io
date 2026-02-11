import Job, { JobProps } from "@/components/custom/job";
import Section from "@/components/custom/section";

const JOBS: JobProps[] = [
  {
    company: "Capital One",
    roles: [
      {
        title: "Senior Associate Software Engineer",
        timeframe: "Jan. 2026 - Present",
      },
      {
        title: "Associate Software Engineer",
        timeframe: "Aug. 2024 - Jan. 2026",
      },
      {
        title: "Software Engineering Intern",
        timeframe: "Jun. 2023 - Aug. 2023",
      },
    ],
    description:
      "Implemented a cloud observability platform to monitor network and gateway traffic, enabling real-time tracking of status codes to detect service degradation.",
    tools: ["Angular", "TypeScript", "FastAPI", "Python", "AWS", "PostgreSQL"],
  },
  {
    company: "Fidelity Investments",
    roles: [
      {
        title: "Software Engineering Intern",
        timeframe: "Jun. 2022 - Aug. 2022",
      },
    ],
    description:
      "Built full-stack features for a personal investing platform, including responsive UI components and high-performance APIs for real-time portfolio visualization.",
    tools: ["React", "JavaScript", "Jest", "Node.js", "MySQL"],
  },
  {
    company: "Sikka Software",
    roles: [
      {
        title: "Software Engineering Intern",
        timeframe: "Aug. 2021 - May 2022",
      },
    ],
    description:
      "Developed an analytics dashboard for healthcare providers and led a UI migration that improved data rendering performance and maintainability across the platform.",
    tools: ["React", "JavaScript", "SASS", "C#", "ASP.NET Core", "MySQL"],
  },
];

function Jobs() {
  return (
    <Section title="PLACES I'VE WORKED" spritesheet="resume">
      <div className="flex flex-col w-full max-w-125 gap-5">
        {JOBS.map((job, i) => (
          <Job key={i} {...job} />
        ))}
      </div>
    </Section>
  );
}

export default Jobs;
