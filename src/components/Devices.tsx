import type { ReactNode } from "react";

// Device bodies are drawn in CSS (see globals.css), so they cost no bytes, follow the theme and
// can be restyled in one place. The 3D stage will replace them with procedural models later.

export function DisplayFrame({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="display-frame">{children}</div>
      <div className="display-stand" aria-hidden="true" />
      <div className="display-foot" aria-hidden="true" />
    </div>
  );
}

export function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="laptop-frame">{children}</div>
      <div className="laptop-base" aria-hidden="true" />
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return <div className="phone-frame">{children}</div>;
}
