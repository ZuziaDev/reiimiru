"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getItem, setItem, subscribe } from "@/lib/storage";

type Theme = "light" | "dark";
const KEY = "reiimiru-theme";

function getTheme(): Theme {
  const v = getItem(KEY);
  return v === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => setItem(KEY, theme === "light" ? "dark" : "light");

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        {theme === "light" ? (
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M2 12h2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
