"use client";

import { useId, useRef } from "react";
import type { ReactNode } from "react";

// A modal sheet on the native <dialog>: focus is trapped, Escape closes it and focus returns to
// the button that opened it. The content is rendered on the server, so it is in the HTML even
// while the sheet is closed.
export function DetailsSheet({
  label,
  eyebrow,
  title,
  children,
}: {
  label: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        {label}
        {/* Three buttons say "Details", so each says what it opens. */}
        <span className="sr-only"> on {title}</span>
      </button>

      <dialog
        ref={dialog}
        className="sheet"
        aria-labelledby={titleId}
        // A click on the backdrop lands on the dialog element itself, never on its content.
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="sheet-scroll">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-hairline bg-paper-raised px-6 py-5 md:px-10">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h3 id={titleId} className="mt-1.5 text-2xl font-semibold tracking-tight">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={`Close ${title} details`}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-hairline text-ink-muted transition-colors hover:text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2 2l10 10M12 2 2 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-8 md:px-10 md:py-10">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-hairline py-6 first:border-t-0 first:pt-0">
      <h4 className="eyebrow">{title}</h4>
      <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed">{children}</div>
    </section>
  );
}
