import { person } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  return (
    <section id="contact" className="py-28 md:py-44">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Contact · Available from December 2026</p>
          <h2 className="display mt-5">Let’s talk.</h2>
          <p className="lede mt-6 max-w-xl">
            Looking for a graduate program in software engineering, solution delivery or business
            analysis.
          </p>

          <a
            href={`mailto:${person.email}`}
            className="mt-10 inline-block text-[clamp(1.25rem,4.4vw,2.75rem)] font-semibold tracking-[-0.022em] break-all text-ink underline decoration-hairline decoration-2 underline-offset-8 transition-colors hover:decoration-ink"
          >
            {person.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={person.resume} download className="btn btn-primary">
              Download résumé
            </a>
            <CopyEmail email={person.email} />
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
