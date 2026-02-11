import NavigationBar from "./components/custom/navigation-bar";
import About from "./sections/about";
import Jobs from "./sections/jobs";
import Projects from "./sections/projects";
import Hero from "./sections/hero";

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <NavigationBar />
      <div className="flex flex-col w-full max-w-7xl gap-6 my-6">
        <Hero />
        <About />
        <Jobs />
        <Projects />
      </div>
    </div>
  );
}

export default App;
