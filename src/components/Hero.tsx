import { person, selectedWork } from "@/content/site";
import { vars } from "./css";
import { LaptopFrame, PhoneFrame } from "./Devices";
import { Shot } from "./Shot";
import { Tilt } from "./Tilt";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center pt-24 pb-20">
      <div className="wrap grid items-center gap-x-8 gap-y-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="hero-in eyebrow flex items-center gap-2.5" style={vars({ "--i": 0 })}>
            <span className="signal-dot size-2 rounded-full bg-signal" aria-hidden="true" />
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
            Final-year Monash IT and Business student, graduating November 2026.
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

          <nav
            aria-label="Selected work"
            className="hero-in mt-16 md:mt-24"
            style={vars({ "--i": 6 })}
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
                      className="size-2.5 rounded-full transition-transform group-hover:scale-150"
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

        {/* A preview of the work below. Decorative: each project has its own described images. */}
        <div
          className="hero-in relative mx-auto w-full max-w-md pb-[18%] md:col-span-5 md:mx-0 md:max-w-none md:pb-[14%]"
          style={vars({ "--i": 5 })}
          aria-hidden="true"
        >
          <Tilt className="relative" max={7}>
            <div className="ml-auto w-[90%]">
              <LaptopFrame>
                <Shot
                  name="work/probudget-transactions"
                  alt=""
                  sizes="(min-width: 768px) 440px, 90vw"
                  eager
                />
              </LaptopFrame>
            </div>
            <div className="absolute bottom-0 left-[-2%] w-[27%] -rotate-6">
              <PhoneFrame>
                <Shot
                  name="work/mymichlin-dashboard"
                  alt=""
                  sizes="(min-width: 768px) 130px, 27vw"
                  eager
                />
              </PhoneFrame>
            </div>
            <div className="absolute right-[-4%] bottom-[-4%] w-[23%] rotate-6">
              <Shot
                name="work/nutritrack-home"
                alt=""
                sizes="(min-width: 768px) 110px, 23vw"
                className="drop-shadow-[0_24px_30px_color-mix(in_srgb,var(--ink)_30%,transparent)]"
                eager
              />
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
