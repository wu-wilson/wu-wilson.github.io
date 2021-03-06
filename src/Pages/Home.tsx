import { RiQuestionAnswerLine } from "react-icons/ri";

const Home = ({ theme }: { theme: string }) => {
  return (
    <div
      className="home"
      style={{
        background: `${
          theme === "light" ? "rgba(219, 248, 255, 1)" : "rgba(78, 81, 84, 1)"
        }`,
      }}
    >
      <div className="home-box">
        <RiQuestionAnswerLine className="chat-icon" />
        <div className="home-subtext">hi there! i’m</div>
        <div
          className="name"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          wilson wu.
        </div>
        <div
          className="description"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          I’m an Atlanta-based software engineer. Welcome to my space on the
          web!
        </div>
        <a className="resume-link" href="wilsonwu-resume.pdf" target="_blank">
          <button
            className={`resume-btn ${
              theme === "light" ? "light-btn" : "dark-btn"
            }`}
          >
            resume
          </button>
        </a>
      </div>
    </div>
  );
};

export default Home;
