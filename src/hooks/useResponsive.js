import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cellSize, setCellSize] = useState(20);

  const calculateCellSize = (width) => {
    if (width < 400) return 14;
    if (width < 640) return 16;
    if (width < 768) return 18;
    if (width < 1024) return 20;
    return 22;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setCellSize(calculateCellSize(width));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, cellSize };
};
