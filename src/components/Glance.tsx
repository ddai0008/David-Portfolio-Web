import { glance } from "@/content/site";

// The four facts a recruiter scans for, before any of the long sections below.
export function Glance() {
  return (
    <section aria-label="At a glance" className="border-y border-hairline">
      <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4 md:gap-x-10 md:py-10">
        {glance.map((fact) => (
          <div key={fact.caption} className="reveal-soft">
            <dt className="text-[clamp(1.875rem,3.4vw,2.75rem)] leading-none font-bold tracking-[-0.03em]">
              {fact.figure}
            </dt>
            <dd className="mt-2.5 max-w-[16rem] text-[0.9375rem] leading-normal text-ink-muted">
              {fact.caption}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
