import NavigationBar from "./components/custom/navigation-bar";
import About from "./sections/about";
import WorkHistory from "./sections/work-history";
import Projects from "./sections/projects";
import Header from "./sections/header";

function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <NavigationBar />
      <div className="flex flex-col w-full max-w-7xl gap-5 my-5">
        <Header />
        <About />
        <WorkHistory />
        <Projects />
      </div>
    </div>
  );
}

export default App;
