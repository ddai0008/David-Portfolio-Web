import { person, proBudgetDemo, selectedWork } from "@/content/site";
import { Aurora } from "./Aurora";
import { vars } from "./css";
import { LaptopFrame } from "./Devices";
import { Shot } from "./Shot";
import { ProfileLink } from "./ProfileLink";
import { Tilt } from "./Tilt";

export function Hero() {
  // The section ends a little above the fold, so the facts strip under it shows without scrolling.
  return (
    <section
      id="top"
      className="dots relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-center pt-[clamp(4.5rem,11svh,6rem)] hero-glow pb-10"
      style={vars({ "--dots-at": "76% 46%", "--dots-w": "70%", "--dots-h": "80%", "--dots-in": 1, "--dots-out": 0.25 })}
    >
      {/* The colour of the project on the laptop, centred behind it, and the capstone's teal in the
          corner. All four colours are already in the project row below, and the closing section
          brings the four pools back; mixed here they turned to beige and blush on paper. */}
      <Aurora
        fade="bottom"
        blobs={[
          { hue: "probudget", x: "var(--glow-x)", y: "var(--glow-y)", size: "72%", dur: 34 },
          { hue: "agencia", x: "95%", y: "6%", size: "40%", dur: 28, delay: -9 },
        ]}
      />
      <div className="wrap grid items-center gap-x-8 gap-y-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="hero-in eyebrow flex items-center gap-2.5" style={vars({ "--i": 0 })}>
            <span className="signal-dot keep-colour size-2 rounded-full bg-signal" aria-hidden="true" />
            Available from December 2026
          </p>

          <h1 className="display mt-7">
            <span className="word-mask">
              <span style={vars({ "--i": 0 })}>David</span>
            </span>{" "}
            <span className="word-mask">
              <span style={vars({ "--i": 1 })}>Dai</span>
            </span>
          </h1>

          {/* The claim the whole page backs up, so it is ink, not the grey of the lines under it. */}
          <p className="hero-in title mt-7 max-w-3xl" style={vars({ "--i": 3 })}>
            Software engineer who ships — and leads.
          </p>

          <p className="hero-in lede mt-5 max-w-xl" style={vars({ "--i": 4 })}>
            Looking for a graduate software engineering role. Monash IT and Business, 2026.
            Australian citizen.
          </p>

          {/* Every way to reach David in one row. Recruiters check a profile before anything else, so
              the marks sit with the buttons rather than on a row of their own. */}
          <div
            className="hero-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-5"
            style={vars({ "--i": 5 })}
          >
            <a href={person.resume} download className="btn btn-primary">
              Download résumé
            </a>
            <a href={`mailto:${person.email}`} className="btn btn-secondary">
              Email me
            </a>
            <p className="flex items-center gap-x-6">
              <ProfileLink kind="linkedin" className="hit transition-opacity hover:opacity-70" />
              <ProfileLink kind="github" className="hit transition-opacity hover:opacity-70" />
            </p>
          </div>

          <nav
            aria-label="Selected work"
            className="hero-in mt-12 md:mt-[clamp(1.5rem,6svh,5rem)]"
            style={vars({ "--i": 6 })}
          >
            {/* A lead-in on the same line as the links, not a capitals label above them. The links
                are 15px and grey like the bar's, since they are a second way in, not the first. On
                touch the rows sit 21px apart so each link's 44px tap area stays its own. */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]">
              <p className="text-ink-muted" aria-hidden="true">
                Selected work
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 [@media(pointer:coarse)]:gap-y-[1.3125rem]">
                {selectedWork.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="hit group inline-flex items-center gap-2.5 font-medium text-ink-muted no-underline transition-colors hover:text-ink"
                    >
                      <span
                        className="keep-colour size-2 rounded-full transition-transform group-hover:scale-150"
                        style={{ background: `var(--hue-${item.hue})` }}
                        aria-hidden="true"
                      />
                      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* A preview of the work below. The picture is atmosphere: no screenshot reads at this size, so
            the caption under it says what it is and links to the real thing. */}
        <div
          className="hero-in relative mx-auto w-full max-w-md pb-2 md:col-span-5 md:mx-0 md:max-w-none"
          style={vars({ "--i": 5 })}
        >
          <div aria-hidden="true">
            <Tilt className="relative" max={7}>
              <LaptopFrame>
                <Shot
                  name="work/probudget-transactions"
                  alt=""
                  sizes="(min-width: 768px) 520px, 90vw"
                  eager
                />
              </LaptopFrame>
            </Tilt>
          </div>
          <p className="mt-6 text-center text-[0.9375rem] md:text-right">
            <a
              href={proBudgetDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="hit font-medium underline-offset-4 hover:underline"
            >
              ProBudget, live: try the demo
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
