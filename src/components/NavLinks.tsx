"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/content/site";

// Marks the section the reader is in. A section counts only while the reading line (40% down the
// window) is inside it, so the nav stays quiet in the stretches between nav sections.
export function NavLinks() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let found: string | null = null;
      for (const { href } of navLinks) {
        const box = document.getElementById(href.slice(1))?.getBoundingClientRect();
        if (box && box.top <= line && box.bottom > line) found = href;
      }
      setCurrent(found);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <ul className="flex items-center gap-9">
      {navLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            aria-current={current === link.href ? "location" : undefined}
            className="text-sm text-ink-muted no-underline transition-colors hover:text-ink aria-[current=location]:text-ink"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
