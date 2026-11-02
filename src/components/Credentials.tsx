import { academics, highDistinction } from "@/content/site";

const figure =
  "block text-[clamp(3.5rem,11vw,5.75rem)] leading-none font-bold tracking-[-0.04em] tabular-nums";

export function Credentials() {
  return (
    <section id="education" className="bg-paper-alt py-24 md:py-32">
      <div className="wrap grid gap-x-10 gap-y-12 md:grid-cols-12 md:gap-y-20">
        <div className="reveal md:col-span-7">
          <p className="eyebrow">Monash University · Bachelor of IT and Business · 2026</p>
          <h2 className="headline mt-5 max-w-4xl">Double degree, finishing strong.</h2>
          <p className="lede mt-6 max-w-2xl">
            Majors in Software Development and Business Analytics.
          </p>
        </div>

        <div className="reveal flex flex-wrap items-end gap-x-12 gap-y-8 md:col-span-5 md:justify-end">
          <p>
            <span className={figure}>{academics.gpa}</span>
            <span className="mt-3 block text-[1.0625rem] text-ink-muted">GPA out of 4.0</span>
          </p>
          <p>
            <span className={figure}>{academics.wam}</span>
            <span className="mt-3 block text-[1.0625rem] text-ink-muted">WAM, weighted average mark</span>
          </p>
        </div>

        <div className="reveal-soft md:col-span-7">
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

        <div className="reveal-soft flex items-start gap-5 self-start rounded-3xl border border-hairline bg-paper-raised px-6 py-6 md:col-span-5">
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
    </section>
  );
}
