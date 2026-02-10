import ThemeToggle from "./theme-toggle";

function NavigationBar() {
  return (
    <div className="sticky top-0 z-100 bg-background flex w-full justify-center p-3 border-b">
      <div className="flex w-full max-w-7xl justify-end">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default NavigationBar;
