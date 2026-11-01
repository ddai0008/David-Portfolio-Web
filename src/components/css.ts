import type { CSSProperties } from "react";

// React's style prop does not know custom properties; this keeps the cast in one place.
export function vars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties;
}
