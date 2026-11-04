import { person } from "@/content/site";
import { MotionToggle } from "./MotionToggle";
import { ProfileLink } from "./ProfileLink";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-8">
      {/* From lg, three columns with the middle one on the page's centre line, so the links do not
          drift to wherever the two outer groups happen to leave room. Between md and lg the columns
          are too narrow for the credits, so they take a row of their own; on a phone everything stacks. */}
      <div className="wrap grid items-center gap-x-6 gap-y-4 text-[0.9375rem] text-ink-muted md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
        <p>© 2026 David Dai</p>
        {/* The profile links again, for a reader who has reached the end and wants to check one. */}
        <ul role="list" className="flex flex-wrap items-center gap-x-6 gap-y-1 md:justify-self-end lg:justify-self-center">
          <li>
            <ProfileLink kind="linkedin" size={20} className="hit transition-opacity hover:opacity-70" />
          </li>
          <li>
            <ProfileLink kind="github" size={20} className="hit transition-opacity hover:opacity-70" />
          </li>
          <li>
            <a href={`mailto:${person.email}`} className="hit underline-offset-4 hover:underline">
              Email
            </a>
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-2 lg:col-span-1 lg:justify-end">
          <p>Built with Next.js, TypeScript and Tailwind.</p>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
