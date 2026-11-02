import { person } from "@/content/site";
import { MotionToggle } from "./MotionToggle";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-8">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm text-ink-muted">
        <p>© 2026 David Dai</p>
        {/* The profile links again, for a reader who has reached the end and wants to check one. */}
        <ul role="list" className="flex flex-wrap gap-x-5 gap-y-1">
          <li>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${person.email}`} className="underline-offset-4">
              Email
            </a>
          </li>
        </ul>
        <p>Built with Next.js, TypeScript and Tailwind.</p>
        <MotionToggle />
      </div>
    </footer>
  );
}
