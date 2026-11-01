import { impact } from "@/content/site";

export function Impact() {
  return (
    <section id="impact" className="bg-paper-alt py-28 md:py-40">
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
                {stat.figure}
              </dt>
              <dd className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-ink-muted">
                {stat.caption}
              </dd>
            </div>
          ))}
        </dl>

        <p className="reveal mt-8 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
          The matching logic is documented for reuse, and I recommended human review for the final
          merge decisions because the data is sensitive donor information.
        </p>
      </div>
    </section>
  );
}
