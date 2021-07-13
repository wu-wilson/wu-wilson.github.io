import { FiGithub, FiMail, FiLinkedin, FiInstagram } from "react-icons/fi";

const ContactBar = ({ theme }: { theme: string }) => {
  // When an icon is clicked, redirect to the appropriate link.
  const redirect = (icon: string) => {
    switch (icon) {
      case "git":
        window.open("https://github.com/wu-wilson");
        break;
      case "in":
        window.open("https://www.linkedin.com/in/wils-wu/");
        break;
      case "mail":
        window.open("mailto:wilson.cui.wu@gmail.com");
        break;
      case "ig":
        window.open("https://www.instagram.com/wilson_wu123/");
        break;
    }
  };

  return (
    <div
      className="cb-container"
      style={{ color: `${theme === "light" ? "#0eaccf" : "#03CBF6"}` }}
    >
      <FiGithub className="cb-icon" onClick={() => redirect("git")} />
      <FiLinkedin className="cb-icon" onClick={() => redirect("in")} />
      <FiMail className="cb-icon" onClick={() => redirect("mail")} />
      <FiInstagram className="cb-icon" onClick={() => redirect("ig")} />
      <div
        className="bar"
        style={{
          backgroundColor: `${theme === "light" ? "#0eaccf" : "#03CBF6"}`,
        }}
      />
    </div>
  );
};

export default ContactBar;
