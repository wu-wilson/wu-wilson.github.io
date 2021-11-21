import Home from "./Pages/Home";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Contact from "./Pages/Contact";
import ContactBar from "./Components/ContactBar";
import Navbar from "./Components/Navbar/Navbar";
import { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  // Store whether the page is loading.
  const [loading, setLoading] = useState<boolean>(true);

  // Store theme.
  const [theme, setTheme] = useState<string>("light");

  // If a theme was previously set by the user, set the theme to it.
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }
  }, []);

  // If the user switches the theme, store it in local storage.
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  // Scroll to the top of the webpage.
  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setLoading(true);
  };

  // When the page is reloaded, scroll the page to the top.
  useEffect(() => {
    window.addEventListener("beforeunload", scrollTop);
    setLoading(false);
    return () => {
      window.removeEventListener("beforeunload", scrollTop);
    };
  }, []);

  // Set the html body to the appropriate color
  useEffect(() => {
    if (theme === "light") {
      document.body.style.backgroundColor = "white";
    } else {
      document.body.style.backgroundColor = "#353535";
    }
  });

  // Open github code for this web-app.
  const redirect = () => {
    window.open("https://github.com/wu-wilson/wu-wilson.github.io");
  };

  /* If the page is still loading, return a blank page. Otherwise, 
  display the webpage. */
  return loading ? null : (
    <div className="app-container">
      <ContactBar theme={theme} />
      <Navbar theme={theme} setTheme={setTheme} />
      <Home theme={theme} />
      <About theme={theme} />
      <Projects theme={theme} />
      <Contact theme={theme} />
      <footer
        className="footer"
        style={{
          backgroundColor: `${theme === "light" ? "white" : "#2D3133"}`,
          borderTop: `${
            theme === "light" ? "1px solid lightgrey" : "1px solid #232525"
          }`,
        }}
      >
        <div
          className="footer-text"
          onClick={redirect}
          style={{
            color: `${theme === "light" ? "black" : "white"}`,
          }}
        >
          built this site with react! check out the code.
        </div>
      </footer>
    </div>
  );
};

export default App;
