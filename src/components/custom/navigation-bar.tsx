import ThemeToggle from "./theme-toggle";

function NavigationBar() {
  return (
    <div className="sticky top-0 z-100 flex w-full justify-center border-b backdrop-blur-lg">
      <div className="flex w-full max-w-7xl justify-end p-3">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default NavigationBar;
