import { BiCode } from "react-icons/bi";
import { AiOutlineSync } from "react-icons/ai";
import { ImStatsBars } from "react-icons/im";
import { FiGithub } from "react-icons/fi";
import { VscRocket } from "react-icons/vsc";

// Define type project.
type project = {
  id: number;
  name: string;
  description: string;
  tools: string;
  git: string;
  launch: string;
};

// Store list of sample projects.
const projects: project[] = [
  {
    id: 0,
    name: "Calendar Sync",
    description:
      "a productivity web app that creates a shareable calendar which updates in real time.",
    tools: "React, Node.js, Express, mySQL, Axios, socket.io, Typescript",
    git: "https://github.com/wu-wilson/calendar-sync",
    launch: "https://www.youtube.com/watch?v=Xkw4IhYh7L4",
  },
  {
    id: 1,
    name: "Sorting Visualizer",
    description:
      "a web app that animates sorting algorithms. Users can adjust speed and array size.",
    tools: "React, Typescript",
    git: "https://github.com/wu-wilson/sorting-visualizer",
    launch: "https://wu-wilson.github.io/sorting-visualizer/",
  },
];

const Projects = ({ theme }: { theme: string }) => {
  /* When the github icon is clicked, launch github. When the rocket
  icon is clicked, launch the web app. */
  const handleIconClick = (icon: string, project: project) => {
    if (icon === "git") {
      window.open(project.git);
    } else {
      window.open(project.launch);
    }
  };

  /* When in tablet/smartphone layout, add a margin above every project after
  the first. */
  const getMargin = (id: number) => {
    if (id > 0) {
      return "margin-top";
    }
  };

  // Get the appropriate header icon depending on the project.
  const getHeaderIcon = (project: string) => {
    if (project === "Calendar Sync") {
      return <AiOutlineSync className="icon-header" />;
    } else if (project === "Sorting Visualizer") {
      return <ImStatsBars className="icon-header" />;
    }
  };

  return (
    <div
      id="projects"
      className="projects"
      style={{ background: `${theme === "light" ? "#FAFAFA" : "#0C2435"}` }}
    >
      <div className="projects-box">
        <BiCode className="code-icon" />
        <div
          className="sample-projects"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          sample projects.
        </div>
        <div className="projects-container">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project ${getMargin(project.id)}`}
            >
              {getHeaderIcon(project.name)}
              {project.name}
              <div className="prj-description">{project.description}</div>
              <div className="tools">{project.tools}</div>
              <div className="prj-icon-container">
                <FiGithub
                  className="prj-icon"
                  onClick={() => handleIconClick("git", project)}
                />
                <VscRocket
                  className="prj-icon"
                  onClick={() => handleIconClick("launch", project)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
