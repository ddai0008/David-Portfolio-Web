"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

// Leans its children a few degrees towards the pointer. The transform itself lives in CSS
// (.tilt), which only applies on hover-capable devices when motion is allowed, so touch and
// reduced-motion visitors get a still composition.
export function Tilt({
  children,
  max = 5,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const box = node.getBoundingClientRect();
      const x = (clientX - box.left) / box.width - 0.5;
      const y = (clientY - box.top) / box.height - 0.5;
      node.style.setProperty("--ry", `${(x * max * 2).toFixed(2)}deg`);
      node.style.setProperty("--rx", `${(-y * max * 2).toFixed(2)}deg`);
      node.dataset.active = "true";
    });
  }

  function reset() {
    const node = ref.current;
    if (!node) return;
    cancelAnimationFrame(frame.current);
    node.style.removeProperty("--rx");
    node.style.removeProperty("--ry");
    node.dataset.active = "false";
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
