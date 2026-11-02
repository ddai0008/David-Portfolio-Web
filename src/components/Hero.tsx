import { person, proBudgetDemo, selectedWork } from "@/content/site";
import { Aurora } from "./Aurora";
import { vars } from "./css";
import { LaptopFrame } from "./Devices";
import { Shot } from "./Shot";
import { Tilt } from "./Tilt";

export function Hero() {
  // The section ends a little above the fold, so the facts strip under it shows without scrolling.
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-center pt-[clamp(4.5rem,11svh,6rem)] pb-10"
    >
      <Aurora
        fade="bottom"
        blobs={[
          { hue: "agencia", x: "74%", y: "20%", size: "56%", dur: 34 },
          { hue: "probudget", x: "58%", y: "52%", size: "50%", dur: 28, delay: -9 },
          { hue: "mymichlin", x: "92%", y: "68%", size: "44%", dur: 31, delay: -17 },
          { hue: "nutritrack", x: "34%", y: "92%", size: "42%", dur: 37, delay: -5 },
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

          <p
            className="hero-in mt-7 max-w-3xl text-[clamp(1.5rem,3.8vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.022em] text-balance text-ink-muted"
            style={vars({ "--i": 3 })}
          >
            Software engineer who ships — and leads.
          </p>

          <p className="hero-in lede mt-5 max-w-xl" style={vars({ "--i": 4 })}>
            Looking for a graduate software engineering role. Monash IT and Business, 2026.
            Australian citizen.
          </p>

          <div
            className="hero-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={vars({ "--i": 5 })}
          >
            <a href={person.resume} download className="btn btn-primary">
              Download résumé
            </a>
            <a href={`mailto:${person.email}`} className="btn btn-secondary">
              Email me
            </a>
          </div>

          {/* Recruiters check a profile before anything else, so it is not left to the last section. */}
          <p
            className="hero-in mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.9375rem] font-medium"
            style={vars({ "--i": 6 })}
          >
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>

          <nav
            aria-label="Selected work"
            className="hero-in mt-12 md:mt-[clamp(1.5rem,6svh,5rem)]"
            style={vars({ "--i": 7 })}
          >
            <p className="eyebrow">Selected work</p>
            <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
              {selectedWork.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink no-underline"
                  >
                    <span
                      className="keep-colour size-2.5 rounded-full transition-transform group-hover:scale-150"
                      style={{ background: `var(--hue-${item.hue})` }}
                      aria-hidden="true"
                    />
                    <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-hairline">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
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
              className="font-medium underline-offset-4"
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
