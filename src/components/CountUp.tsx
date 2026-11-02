"use client";

import { useEffect, useRef } from "react";

const format = (value: number, prefix: string) =>
  `${prefix}${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// A figure that counts up the first time it scrolls into view. The server renders, and
// assistive technology always reads, the finished number, so nothing depends on the animation:
// it only starts for a figure that is still below the fold, with motion allowed.
export function CountUp({ to, prefix = "" }: { to: number; prefix?: string }) {
  const visible = useRef<HTMLSpanElement>(null);
  const finished = format(to, prefix);

  useEffect(() => {
    const node = visible.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen, or behind the reader: leave the finished number alone.
    if (node.getBoundingClientRect().top < innerHeight) return;

    // Change the text node React rendered rather than replacing it, so React's reference to it
    // stays valid if the props ever change.
    const text = node.firstChild;
    if (!text) return;
    const show = (value: string) => {
      text.nodeValue = value;
    };

    let frame = 0;
    show(format(0, prefix));
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
          show(progress < 1 ? format(Math.round(to * eased), prefix) : finished);
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
      show(finished);
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
