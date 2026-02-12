import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateDirection = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) < 5) {
        return;
      }
      setDirection(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", updateDirection);

    return () => {
      window.removeEventListener("scroll", updateDirection);
    };
  }, []);

  return direction;
}
