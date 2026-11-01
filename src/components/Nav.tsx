import { person } from "@/content/site";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap flex h-14 items-center justify-between gap-4">
        <a
          href="#top"
          className="text-[1.0625rem] font-semibold tracking-tight text-ink no-underline"
        >
          {person.name}
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={person.resume}
            download
            className="btn btn-primary !min-h-9 !px-4 !text-sm"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
