import disableScroll from "disable-scroll";
import ToggleTheme from "./ToggleTheme";
import { navItems, getSymbol } from "./Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-scroll";

const HamMenu = ({
  theme,
  setTheme,
  getScrollLink,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  getScrollLink: (section: string) => JSX.Element | undefined;
}) => {
  // Store whether or not the hamburger menu is open.
  const [open, setOpen] = useState<boolean>(false);

  /* Set open to the appropriate value when the hamburger
  menu is clicked. */
  const handleClick = () => {
    setOpen(!open);
  };

  // If the hamburger menu is open, disable scroll.
  useEffect(() => {
    if (open) {
      disableScroll.on();
    } else {
      disableScroll.off();
    }
  }, [open]);

  // Close the hamburger menu.
  const closeMenu = () => {
    setOpen(false);
  };

  /* Return a link that scrolls to the specified section and closes
   the hamburger menu. */
  const getScrollLinkHM = (section: string) => {
    switch (section) {
      case "about":
        return (
          <Link to="about" smooth={true} duration={300} onClick={closeMenu}>
            about
          </Link>
        );
      case "projects":
        return (
          <Link to="projects" smooth={true} duration={300} onClick={closeMenu}>
            projects
          </Link>
        );
      case "contact":
        return (
          <Link to="contact" smooth={true} duration={300} onClick={closeMenu}>
            contact
          </Link>
        );
    }
  };

  return (
    <div className="hm-container">
      <div className="line-container" onClick={handleClick}>
        <div
          className="line"
          style={{
            backgroundColor: `${theme === "light" ? "black" : "white"}`,
          }}
        />
        <div
          className="line"
          style={{
            backgroundColor: `${theme === "light" ? "black" : "white"}`,
          }}
        />
        <div
          className="line"
          style={{
            backgroundColor: `${theme === "light" ? "black" : "white"}`,
          }}
        />
      </div>
      <div
        className={`hm-menu ${open ? "show" : null}`}
        style={{
          backgroundColor: `${theme === "light" ? "#fafafa" : "#2c2c2c"}`,
          boxShadow: `${
            theme === "light"
              ? "3px 0 20px -2px lightgrey"
              : "3px 0 20px -2px black"
          }`,
        }}
      >
        <div className="hm-box">
          {navItems.map((item) => (
            <div className="hm-item-container" key={item.id}>
              <div
                className="hm-item"
                style={{ color: `${theme === "light" ? "black" : "white"}` }}
              >
                {getScrollLinkHM(item.content)}
                <div
                  className="hm-symbol"
                  style={{
                    color: `${theme === "light" ? "#5F6368" : "#979797"}`,
                  }}
                >
                  {getSymbol(item.symbol)}
                </div>
              </div>
            </div>
          ))}
          <div className="hm-toggle">
            <ToggleTheme theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </div>
      <div
        className={`hm-outer-box ${open ? "appear" : null}`}
        onClick={closeMenu}
      />
    </div>
  );
};

export default HamMenu;
