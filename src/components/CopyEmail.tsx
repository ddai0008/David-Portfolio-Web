"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const canCopy = () => typeof navigator.clipboard?.writeText === "function";

// For people who read mail in a browser tab, where a mailto: link does nothing useful. It only
// appears once the page knows the clipboard is available (it is not on plain http or in some
// in-app browsers), so it can never be a dead button.
export function CopyEmail({ email }: { email: string }) {
  const available = useSyncExternalStore(subscribe, canCopy, () => false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!available) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
          } catch {
            return;
          }
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 2200);
        }}
      >
        {copied ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
