import { impact, matchingFlow } from "@/content/site";
import { CountUp } from "./CountUp";
import { MatchGlyph } from "./MatchGlyph";

export function Impact() {
  return (
    <section id="impact" className="bg-paper-alt py-24 md:py-32">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Business analyst intern · St Vincent de Paul Society · Mar – May 2026</p>
          <h2 className="headline mt-5 max-w-4xl">Fewer hours. Cleaner data. Numbers I can defend.</h2>
          <p className="lede mt-6 max-w-2xl">
            I gathered requirements from Treasury, Philanthropy and Fundraising, then built Power BI
            dashboards over Microsoft Dynamics. Fundraising adopted them for their weekly
            catch-ups, which was never in the brief.
          </p>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline md:mt-24 md:grid-cols-2">
          {impact.map((stat) => (
            <div key={stat.figure} className="reveal bg-paper-alt px-7 py-10 md:px-12 md:py-14">
              <dt className="text-[clamp(3.25rem,9vw,6.5rem)] leading-none font-bold tracking-[-0.04em] tabular-nums">
                {"spoken" in stat ? (
                  <>
                    <span aria-hidden="true">{stat.figure}</span>
                    <span className="sr-only">{stat.spoken}</span>
                  </>
                ) : "count" in stat ? (
                  <CountUp to={stat.count.to} prefix={stat.count.prefix} />
                ) : (
                  stat.figure
                )}
              </dt>
              <dd className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-ink-muted">
                {stat.caption}
              </dd>
            </div>
          ))}
        </dl>

        <ol
          aria-label="How the matching worked"
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-9 md:mt-24 md:grid-cols-4 md:gap-x-8"
        >
          {matchingFlow.map((step, index) => (
            <li key={step.label} className="flow-step reveal border-t-2 border-ink pt-5">
              <MatchGlyph step={index as 0 | 1 | 2 | 3} />
              <span
                className="mt-4 block text-sm font-medium text-ink-muted tabular-nums"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <h3 className="title mt-2">{step.label}</h3>
              <p className="mt-2 text-[1.0625rem] leading-snug text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <p className="reveal mt-12 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
          The matching logic is documented for reuse. I recommended the human review step because
          this is sensitive donor information.
        </p>
      </div>
    </section>
  );
}
