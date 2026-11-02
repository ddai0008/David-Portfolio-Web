"use client";

import { useEffect } from "react";

// The colour pools drift for as long as they are running, and a running animation costs the main
// thread every frame even when it is far off screen (measured: about half of the page's idle work
// while reading the lower half). This marks each pool group that is out of view so the CSS can
// pause it, and clears the mark as it scrolls back in. Without script the pools simply keep going.
export function AmbientGate() {
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>(".aurora");
    if (groups.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const group = entry.target as HTMLElement;
          if (entry.isIntersecting) delete group.dataset.offscreen;
          else group.dataset.offscreen = "";
        }
      },
      // A little early, so a pool is already moving by the time it comes into view.
      { rootMargin: "120px 0px" },
    );
    for (const group of groups) observer.observe(group);
    return () => observer.disconnect();
  }, []);

  return null;
}
