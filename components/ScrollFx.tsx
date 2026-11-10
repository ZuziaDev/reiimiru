"use client";

import { useEffect } from "react";

// Yalnız nav gizleme: aşağı kayarken nav çıkar, yukarı kayarken görünür.
// Diğer scroll animasyonları components/fx/motion.tsx içinde.
export default function ScrollFx() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const sy = window.scrollY;
      if (sy > lastY && sy > 160) nav.classList.add("hidden");
      else nav.classList.remove("hidden");
      lastY = sy;
      ticking = false;
    };
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return null;
}
