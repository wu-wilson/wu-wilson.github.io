import { BiAt } from "react-icons/bi";

const Contact = ({ theme }: { theme: string }) => {
  // When the connect button is clicked, open their email.
  const openMail = () => {
    window.open("mailto:wilson.cui.wu@gmail.com");
  };

  return (
    <div
      id="contact"
      className="contact"
      style={{ background: `${theme === "light" ? "white" : "#2D3133"}` }}
    >
      <div className="contact-box">
        <BiAt className="at-icon" />
        <div
          className="connect"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          let's connect.
        </div>
        <div
          className="connect-text"
          style={{ color: `${theme === "light" ? "black" : "white"}` }}
        >
          I'm always looking for new opportunities, so feel free to shoot me a
          message—my inbox is always open! I’ll get back to you as soon as
          possible.
        </div>
        <button className="cnt-btn" onClick={openMail}>
          connect
        </button>
      </div>
    </div>
  );
};

export default Contact;
