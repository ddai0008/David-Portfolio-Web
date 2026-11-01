import { navLinks, person } from "@/content/site";
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
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-muted no-underline transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
