import Section from "@/components/custom/section";

const paragraphs = [
  "I work across the entire stack, from backend systems and APIs to responsive, polished interfaces.",
  "I've built software at Capital One, Fidelity, and Sikka Software, shipping both customer-facing features and large-scale, data-heavy internal tools.",
  "Most of my work focuses on systems that need to stay fast, reliable, and scaleable. I do my best to turn complex technical problems into simple, intuitive experiences.",
  "Outside of work, you'll probably find me exploring Teyvat, or binging Netflix with my girlfriend, Michelle, and our two cats, Naru and Sasu.",
];

function About() {
  return (
    <Section title="ABOUT ME" spritesheet="chest">
      <div className="flex flex-col gap-6 text-left">
        {paragraphs.map((p, i) => (
          <p key={i} className="max-w-125 text-sm px-5">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}

export default About;
