import { useEffect, useState } from "react";

export function useIsFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mq.addEventListener("change", handler);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return isFinePointer;
}
