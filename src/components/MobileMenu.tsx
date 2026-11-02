"use client";

import { useId, useRef } from "react";
import { navLinks } from "@/content/site";

// Below the md breakpoint the section links collapse into this menu. It is the browser's own
// popover: Escape and a tap outside close it, and focus goes back to the button.
export function MobileMenu() {
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);

  return (
    <div className="md:hidden">
      <button
        type="button"
        popoverTarget={id}
        aria-label="Menu"
        className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:text-ink"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h12M3 12h12" />
        </svg>
      </button>

      {/* The browser's default popover box is centred with a border; this one hangs under the bar. */}
      <div
        id={id}
        ref={menu}
        popover="auto"
        className="fixed inset-x-0 top-14 bottom-auto m-0 h-auto w-auto border-0 border-b border-hairline bg-paper-raised p-0 text-ink"
      >
        <nav aria-label="Site menu">
          <ul className="wrap py-2">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-hairline last:border-b-0">
                <a
                  href={link.href}
                  onClick={() => menu.current?.hidePopover()}
                  className="block py-4 text-[1.0625rem] font-medium text-ink no-underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
