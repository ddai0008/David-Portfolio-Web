import { person } from "@/content/site";
import { Aurora } from "./Aurora";
import { CopyEmail } from "./CopyEmail";
import { ProfileLink } from "./ProfileLink";

export function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden py-24 md:py-36">
      <Aurora
        fade="top"
        blobs={[
          { hue: "nutritrack", x: "20%", y: "78%", size: "48%", dur: 33 },
          { hue: "mymichlin", x: "46%", y: "92%", size: "46%", dur: 29, delay: -11 },
          { hue: "probudget", x: "74%", y: "70%", size: "50%", dur: 35, delay: -20 },
          { hue: "agencia", x: "92%", y: "88%", size: "44%", dur: 30, delay: -6 },
        ]}
      />
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Contact · Available from December 2026</p>
          <h2 className="display mt-5">Let’s talk.</h2>
          <p className="lede mt-6 max-w-xl">
            Looking for a graduate software engineering role. Data and analytics, and solution
            delivery, fit too.
          </p>

          <a
            href={`mailto:${person.email}`}
            className="hit mt-10 inline-block text-[clamp(1.25rem,4.4vw,2.75rem)] font-semibold tracking-[-0.022em] break-all text-ink underline decoration-hairline decoration-2 underline-offset-8 transition-colors hover:decoration-ink"
          >
            {person.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={person.resume} download className="btn btn-primary">
              Download résumé
            </a>
            <CopyEmail email={person.email} />
            <ProfileLink kind="linkedin" className="btn btn-secondary !w-11 !px-0" />
            <ProfileLink kind="github" className="btn btn-secondary !w-11 !px-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
