import { AiOutlineInfoCircle } from "react-icons/ai";
import { RiReactjsFill } from "react-icons/ri";
import { DiNodejsSmall, DiJavascript } from "react-icons/di";
import { SiTypescript } from "react-icons/si";
import { GrMysql } from "react-icons/gr";

// Define type paragraph.
type paragraph = {
  id: number;
  content: string;
};

// Store the paragraphs displayed in the about section.
const paragraphs: paragraph[] = [
  {
    id: 0,
    content:
      "My name is Wilson Wu, and I’m a junior at Emory University pursuing a B.S. in computer science.",
  },
  {
    id: 1,
    content:
      "I’ve recently been experimenting with full stack web development! If you’re interested in checking out some of my projects, click",
  },
  {
    id: 2,
    content: "Here are a few frameworks/libraries I’ve been using:",
  },
];

const About = ({ theme }: { theme: string }) => {
  // Return the "here" link for the 2nd paragraph.
  const getHere = (id: number) => {
    if (id === 1) {
      return (
        <span
          className="here"
          onClick={() => window.open("https://github.com/wu-wilson")}
        >
          {" "}
          here.
        </span>
      );
    }
  };

  // When an about icon is clicked, redirect to the appropriate website.
  const abtRedirect = (icon: string) => {
    switch (icon) {
      case "react":
        window.open("https://reactjs.org/");
        break;
      case "node":
        window.open("https://nodejs.org/en/");
        break;
      case "sql":
        window.open("https://www.mysql.com/");
        break;
      case "js":
        window.open("https://www.javascript.com/");
        break;
      case "ts":
        window.open("https://www.typescriptlang.org/");
        break;
    }
  };

  return (
    <div
      id="about"
      className="about"
      style={{
        background: `${theme === "light" ? "rgba(255,255,255, 1)" : "#2D3133"}`,
      }}
    >
      <div className="about-box">
        <AiOutlineInfoCircle className="info-icon" />
        <div
          className="about-me"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          about me.
        </div>
        {paragraphs.map((paragraph) => (
          <div
            className="paragraph"
            key={paragraph.id}
            style={{ color: `${theme === "light" ? "black" : "white"}` }}
          >
            {paragraph.content}
            {getHere(paragraph.id)}
          </div>
        ))}
        <div className="icon-container">
          <RiReactjsFill
            className="about-icon"
            onClick={() => abtRedirect("react")}
          />
          <DiNodejsSmall
            className="about-icon"
            onClick={() => abtRedirect("node")}
          />
          <GrMysql className="about-icon" onClick={() => abtRedirect("sql")} />
          <DiJavascript
            className="about-icon"
            onClick={() => abtRedirect("js")}
          />
          <SiTypescript
            className="about-icon ts"
            onClick={() => abtRedirect("ts")}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
