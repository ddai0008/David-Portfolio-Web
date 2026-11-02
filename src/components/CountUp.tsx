"use client";

import { useEffect, useRef } from "react";

// A figure that counts up the first time it scrolls into view. The server renders, and
// assistive technology always reads, the finished number, so nothing depends on the animation:
// it only starts for a figure that is still below the fold, with motion allowed.
export function CountUp({ to, prefix = "" }: { to: number; prefix?: string }) {
  const visible = useRef<HTMLSpanElement>(null);
  const finished = `${prefix}${String(to).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  useEffect(() => {
    const node = visible.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen, or behind the reader: leave the finished number alone.
    if (node.getBoundingClientRect().top < innerHeight) return;

    let frame = 0;
    node.textContent = `${prefix}0`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Fast at first, easing into the last digits.
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent =
            progress < 1
              ? `${prefix}${Math.round(to * eased)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : finished;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = finished;
    };
  }, [to, prefix, finished]);

  return (
    <>
      <span ref={visible} aria-hidden="true">
        {finished}
      </span>
      <span className="sr-only">{finished}</span>
    </>
  );
}
