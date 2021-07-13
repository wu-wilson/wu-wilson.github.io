import { HiSun, HiMoon } from "react-icons/hi";

const ToggleTheme = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  // When the toggle theme slider is clicked, change the theme.
  const switchTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <label className="switch">
      <input type="checkbox" />
      <span
        className={`slider ${theme === "light" ? null : "slider-dark"}`}
        onClick={switchTheme}
      >
        <div
          className={`toggle ${theme === "light" ? null : "toggle-slide"}`}
          style={{
            backgroundColor: `${theme === "light" ? "white" : "#353535"}`,
          }}
        >
          <HiSun
            className={`tb-icon ${theme === "light" ? null : "icon-hide"}`}
          />
          <HiMoon
            className={`tb-icon ${theme === "light" ? "icon-hide" : null}`}
          />
        </div>
      </span>
    </label>
  );
};

export default ToggleTheme;
