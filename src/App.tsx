import CursorGlow from "./components/layout/CursorGlow";
import Footer from "./components/layout/Footer";
import NavigationBar from "./components/layout/NavigationBar";
import AboutSection from "./components/sections/about/AboutSection";
import ExperienceSection from "./components/sections/experience/ExperienceSection";
import HeroSection from "./components/sections/hero/HeroSection";
import ProjectsSection from "./components/sections/projects/ProjectsSection";

function App() {
  return (
    <div className="flex flex-col items-center">
      <CursorGlow />
      <NavigationBar />
      <div className="flex flex-col items-center w-full max-w-5xl gap-15">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
      </div>
      <Footer />
    </div>
  );
}

export default App;
