import Section from "@/components/layout/Section";

function AboutSection() {
  return (
    <Section
      id="about"
      spritesheet="chest"
      label="About Me"
      description="who I am and how I work"
    >
      <p>
        I'm a full-stack engineer who likes building software that feels simple,
        clean, and intuitive. I care about the little details—clean state
        management, fast endpoints, and logs that actually make sense.
      </p>
      <p>
        I started at{" "}
        <a
          href="https://www.sikkasoft.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-(--primary) hover:underline"
        >
          Sikka Software
        </a>{" "}
        building full-stack analytics dashboards, then interned at{" "}
        <a
          href="https://www.fidelity.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-(--primary) hover:underline"
        >
          Fidelity
        </a>{" "}
        working on frontend components and backend APIs. Today, I'm at{" "}
        <a
          href="https://www.capitalone.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-(--primary) hover:underline"
        >
          Capital One
        </a>{" "}
        building observability tools that help engineers catch issues before
        they become outages.
      </p>
      <p>
        No matter the project, my goal is always the same: keep it clean, keep
        it intuitive, and make it reliable. Good software should look nice, feel
        smooth, and be easy to trust.
      </p>
      <p>
        Outside of work, you'll probably find me designing pixel art, exploring
        Teyvat, or binging the latest reality TV show with my girlfriend,
        Michelle, and our two cats.
      </p>
    </Section>
  );
}

export default AboutSection;
