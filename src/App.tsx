import NavigationBar from "./components/custom/navigation-bar";
import Section from "./components/custom/section/section";

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <NavigationBar />
      <div className="flex flex-col w-full max-w-7xl gap-5">
        <Section title="About Me" spritesheet="chest">
          Test
        </Section>
        <Section title="Where I've Worked" spritesheet="resume">
          Test
        </Section>
        <Section title="Stuff I've Built" spritesheet="hammer">
          Test
        </Section>
        <Section title="Contact Me" spritesheet="phone">
          Test
        </Section>
      </div>
    </div>
  );
}

export default App;
