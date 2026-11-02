import type { Hue } from "@/content/site";
import { vars } from "./css";

type Blob = {
  hue: Hue;
  // Centre of the pool, as a share of the section, and its width as a share of the section's width.
  x: string;
  y: string;
  size: string;
  // Seconds for one drift, so the four pools never move in step.
  dur?: number;
  delay?: number;
};

// Soft pools of the projects' own colours behind a section. Decorative, so hidden from assistive
// technology. The section holding it must be `relative isolate`.
export function Aurora({ blobs, fade }: { blobs: readonly Blob[]; fade: "top" | "bottom" }) {
  return (
    <div className={`aurora aurora-fade-${fade}`} aria-hidden="true">
      {blobs.map((blob) => (
        <span
          key={blob.hue}
          style={vars({
            "--hue": `var(--hue-${blob.hue})`,
            "--x": blob.x,
            "--y": blob.y,
            "--size": blob.size,
            "--dur": `${blob.dur ?? 30}s`,
            "--delay": `${blob.delay ?? 0}s`,
          })}
        />
      ))}
    </div>
  );
}
