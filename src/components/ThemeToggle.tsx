"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const query = "(prefers-color-scheme: dark)";

function current(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia(query).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = matchMedia(query);
  media.addEventListener("change", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("themechange", onChange);
  };
}

// The browser toolbar colour is set per scheme by the viewport metadata, which cannot follow a
// manual choice, so point every theme-color tag at the paper colour that is actually showing.
function syncThemeColor() {
  const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
  for (const tag of document.querySelectorAll('meta[name="theme-color"]')) {
    tag.setAttribute("content", paper);
  }
}

export function ThemeToggle() {
  // null on the server and during hydration, so the first client render matches the HTML.
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  useEffect(() => {
    if (document.documentElement.dataset.theme) syncThemeColor();
  }, []);

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the choice just lasts for this visit.
    }
    syncThemeColor();
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:text-ink"
    >
      <svg
        className="theme-moon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
      <svg
        className="theme-sun"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
