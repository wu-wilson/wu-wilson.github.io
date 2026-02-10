import NavigationBar from "./components/custom/navigation-bar";
import About from "./sections/about";
import Work from "./sections/work";
import Projects from "./sections/projects";
import Hero from "./sections/hero";

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <NavigationBar />
      <div className="flex flex-col w-full max-w-7xl gap-5 my-5">
        <Hero />
        <About />
        <Work />
        <Projects />
      </div>
    </div>
  );
}

export default App;
