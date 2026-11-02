"use client";

import { useSyncExternalStore } from "react";

function paused() {
  return document.documentElement.dataset.motion === "paused";
}

function subscribe(onChange: () => void) {
  window.addEventListener("motionchange", onChange);
  return () => window.removeEventListener("motionchange", onChange);
}

// Stops the slow background drift behind the hero and the contact, for a reader who finds it
// distracting but has not set reduced motion in their system. The choice is remembered.
export function MotionToggle() {
  // False on the server and during hydration, so the first client render matches the HTML.
  const isPaused = useSyncExternalStore(subscribe, paused, () => false);

  function toggle() {
    const next = !paused();
    if (next) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
    try {
      if (next) localStorage.setItem("motion", "paused");
      else localStorage.removeItem("motion");
    } catch {
      // Private mode or blocked storage: the choice just lasts for this visit.
    }
    window.dispatchEvent(new Event("motionchange"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="motion-control cursor-pointer underline underline-offset-4 transition-colors hover:text-ink"
    >
      {isPaused ? "Resume background motion" : "Pause background motion"}
    </button>
  );
}
