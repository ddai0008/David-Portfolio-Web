"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const canCopy = () => typeof navigator.clipboard?.writeText === "function";

// For people who read mail in a browser tab, where a mailto: link does nothing useful. It only
// appears once the page knows the clipboard is available (it is not on plain http or in some
// in-app browsers), so it can never be a dead button.
export function CopyEmail({ email }: { email: string }) {
  const available = useSyncExternalStore(subscribe, canCopy, () => false);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!available) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={async () => {
          // The browser can refuse (permission denied, or the page lacks focus), so say so.
          let next: "copied" | "failed" = "copied";
          try {
            await navigator.clipboard.writeText(email);
          } catch {
            next = "failed";
          }
          setState(next);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setState("idle"), 2200);
        }}
      >
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn’t copy" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Could not copy. Select the address above instead."
            : ""}
      </span>
    </>
  );
}
