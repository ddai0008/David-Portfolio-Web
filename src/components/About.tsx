import { Shot } from "./Shot";

export function About() {
  return (
    <section id="about" className="bg-paper-alt py-28 md:py-40">
      <div className="wrap grid items-center gap-14 md:grid-cols-12 md:gap-16">
        <div className="reveal md:col-span-5">
          <Shot
            name="about/david"
            alt="David presenting in front of a whiteboard in a lecture theatre."
            sizes="(min-width: 768px) 480px, 100vw"
            className="w-full rounded-3xl"
          />
        </div>

        <div className="reveal md:col-span-7">
          <p className="eyebrow">About</p>
          <h2 className="headline mt-5">The other half of the job is talking to people.</h2>
          <p className="lede mt-6 max-w-xl">
            I like standing between the people who build things and the people who use them:
            running the demo, turning a need into acceptance criteria, writing the handover pack.
          </p>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted">
            As a Student Ambassador at Monash Open Day I answered unscripted questions about
            courses, majors and pathways, adapting the same information for school leavers, parents
            and international families.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Facts">
            <li className="chip">English and Mandarin, fluent</li>
            <li className="chip">Australian citizen</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
