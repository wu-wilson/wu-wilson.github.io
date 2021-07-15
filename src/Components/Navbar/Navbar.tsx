import ToggleTheme from "./ToggleTheme";
import logo from "./Logo.svg";
import HamMenu from "./HamMenu";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiCode, BiAt } from "react-icons/bi";
import { Link, animateScroll as scroller } from "react-scroll";
import { useEffect, useState, useCallback } from "react";

// Define the type navItem, a link in the navbar.
type navItem = {
  id: number;
  content: string;
  symbol: string;
};

// List of links in navbar.
export const navItems: navItem[] = [
  {
    id: 0,
    content: "about",
    symbol: "info",
  },
  {
    id: 1,
    content: "projects",
    symbol: "code",
  },
  {
    id: 2,
    content: "contact",
    symbol: "at",
  },
];

// Return the appropriate symbol depending on the nav item.
export const getSymbol = (symbol: string) => {
  switch (symbol) {
    case "info":
      return <AiOutlineInfoCircle />;
    case "code":
      return <BiCode />;
    case "at":
      return <BiAt />;
  }
};

const Navbar = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  // Store whether or not to show the navbar.
  const [navBar, setNavBar] = useState<boolean>(true);

  // Store the current and previous scroll location.
  const [scrollLocation, setScrollLocation] = useState<number>(0);
  const [prevScrollLocation, setPrevScrollLocation] = useState<number>(0);

  /* If the user scrolls up, show the navbar. If the user scrolls 
  down, hide the navber. */
  const translateNavbar = useCallback(() => {
    setScrollLocation(window.pageYOffset);
    if (scrollLocation > prevScrollLocation) {
      if (scrollLocation >= 0) {
        setNavBar(false);
      } else {
        setNavBar(true);
      }
    } else {
      setNavBar(true);
    }
    setPrevScrollLocation(scrollLocation);
  }, [prevScrollLocation, scrollLocation]);

  // Adjust the navbar whenever the user scrolls.
  useEffect(() => {
    window.addEventListener("scroll", translateNavbar);
    return () => {
      window.removeEventListener("scroll", translateNavbar);
    };
  }, [translateNavbar]);

  // Scroll to the home div.
  const directHome = () => {
    scroller.scrollToTop({ duration: 400 });
  };

  // Return a link that scrolls to the specified section.
  const getScrollLink = (section: string) => {
    switch (section) {
      case "about":
        return (
          <Link to="about" smooth={true} duration={300}>
            about
          </Link>
        );
      case "projects":
        return (
          <Link to="projects" smooth={true} duration={300}>
            projects
          </Link>
        );
      case "contact":
        return (
          <Link to="contact" smooth={true} duration={300}>
            contact
          </Link>
        );
    }
  };

  return (
    <div
      className="nb-container"
      style={{
        borderBottom: `${
          theme === "light" ? "1px solid lightgrey" : "1px solid #232525"
        }`,
        backgroundColor: `${theme === "light" ? "white" : "#353535"}`,
        top: navBar ? 0 : -71,
      }}
    >
      <HamMenu
        theme={theme}
        setTheme={setTheme}
        getScrollLink={getScrollLink}
      />
      <div className="logo-container">
        <img src={logo} alt="logo" onClick={directHome} style={{ zIndex: 1 }} />
      </div>
      <div className="nb-items-container">
        {navItems.map((item) => (
          <div
            className="nb-item-container"
            key={item.id}
            style={{
              color: `${theme === "light" ? "#5F6368" : "#979797"}`,
            }}
          >
            {getSymbol(item.symbol)}
            <div
              className="nb-item"
              style={{
                color: `${theme === "light" ? "black" : "white"}`,
              }}
            >
              {getScrollLink(item.content)}
            </div>
          </div>
        ))}
      </div>
      <div className="tb-container">
        <ToggleTheme theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Navbar;
