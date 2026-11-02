import { person } from "@/content/site";
import { MotionToggle } from "./MotionToggle";
import { ProfileLink } from "./ProfileLink";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-8">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm text-ink-muted">
        <p>© 2026 David Dai</p>
        {/* The profile links again, for a reader who has reached the end and wants to check one. */}
        <ul role="list" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <li>
            <ProfileLink kind="linkedin" size={20} className="hit transition-opacity hover:opacity-70" />
          </li>
          <li>
            <ProfileLink kind="github" size={20} className="hit transition-opacity hover:opacity-70" />
          </li>
          <li>
            <a href={`mailto:${person.email}`} className="hit underline-offset-4">
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
