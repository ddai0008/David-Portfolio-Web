import { highDistinction } from "@/content/site";

const figure =
  "block text-[clamp(4rem,13vw,9rem)] leading-none font-bold tracking-[-0.04em] tabular-nums";

export function Credentials() {
  return (
    <section id="education" className="bg-paper-alt py-28 md:py-40">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Monash University · Bachelor of IT and Business</p>
          <h2 className="headline mt-5 max-w-4xl">Double degree, finishing strong.</h2>
          <p className="lede mt-6 max-w-2xl">
            Majors in Software Development and Business Analytics, graduating November 2026.
          </p>
        </div>

        <div className="reveal mt-16 flex flex-wrap gap-x-16 gap-y-10 md:mt-24 md:gap-x-24">
          <p>
            <span className={figure}>3.70</span>
            <span className="mt-3 block text-[1.0625rem] text-ink-muted">GPA out of 4.0</span>
          </p>
          <p>
            <span className={figure}>82.1</span>
            <span className="mt-3 block text-[1.0625rem] text-ink-muted">WAM</span>
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-10">
          <div className="reveal">
            <h3 className="eyebrow">High Distinction</h3>
            <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
              {highDistinction.map((subject) => (
                <li key={subject} className="py-3.5 text-lg font-medium tracking-tight">
                  {subject}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9375rem] text-ink-muted">
              Industry Capstone and Software Security are in progress.
            </p>
          </div>

          <div className="reveal flex items-start gap-5 self-start rounded-3xl border border-hairline bg-paper-raised px-6 py-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-ink"
              aria-hidden="true"
            >
              <path d="M20 3.5 25.6 7l6.6.7.7 6.6L36.5 20l-3.6 5.7-.7 6.6-6.6.7L20 36.5 14.4 33l-6.6-.7-.7-6.6L3.5 20l3.6-5.7.7-6.6 6.6-.7L20 3.5Z" />
              <path d="m13.5 20.5 4.5 4.5 8.5-9.5" />
            </svg>
            <p>
              <span className="block text-lg font-semibold tracking-tight">
                Microsoft Certified: Azure Data Fundamentals
              </span>
              <span className="mt-1 block text-sm text-ink-muted">
                DP-900, now being applied in the ProBudget move to Azure
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
