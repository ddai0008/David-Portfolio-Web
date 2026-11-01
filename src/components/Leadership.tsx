import { team } from "@/content/site";
import { vars } from "./css";
import { DetailsSheet, SheetSection } from "./DetailsSheet";
import { DisplayFrame } from "./Devices";
import { Shot } from "./Shot";
import { Tilt } from "./Tilt";

const beats = [
  {
    verb: "Lead",
    text: "Sprint planning, stand-ups, reviews and retrospectives for six people, with the security and analysis workstreams sequenced into the development plan.",
  },
  {
    verb: "Liaise",
    text: "The only line to the client: requirements and demo sessions, a prioritised backlog with clear acceptance criteria, and scope renegotiated when constraints shift.",
  },
  {
    verb: "Build",
    text: "One of two developers, in CakePHP over MySQL, live on VentraIP cPanel hosting. Form version control and real-time co-editing sit on top.",
  },
] as const;

export function Leadership() {
  return (
    <section id="leadership" className="relative overflow-hidden py-28 md:py-40">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Industry capstone · Aug 2026 – present</p>
          <h2 className="headline mt-5 max-w-4xl">
            Six people. One live client. I’m the link between them.
          </h2>
          <p className="lede mt-6 max-w-2xl">
            Team Lead, Client Liaison and Developer on a full-stack web app for Agencia Change, a
            change management consultancy.
          </p>
        </div>

        <div
          className="stage mt-16 md:mt-24"
          style={vars({ "--hue": "var(--hue-agencia)", "--hue-2": "var(--hue-agencia-2)" })}
        >
          <div className="glow" aria-hidden="true" />
          <Tilt className="relative mx-auto max-w-[62rem]" max={3}>
            <div className="reveal">
              <DisplayFrame>
                <Shot
                  name="work/agencia-details"
                  alt="Agencia Change workspace showing the project details form and timeline for a sample project, Digital Rostering Rollout."
                  sizes="(min-width: 1024px) 960px, 100vw"
                />
              </DisplayFrame>
            </div>
            <div
              className="drift absolute right-[-1%] bottom-[14%] w-[46%] md:right-[-3%]"
              style={vars({ "--drift": "2.5rem" })}
            >
              <Shot
                name="work/agencia-versions"
                alt="The version history dialog comparing an earlier saved state of a form with the current one."
                sizes="(min-width: 1024px) 440px, 46vw"
                className="rounded-xl border border-hairline shadow-[0_30px_60px_-20px_color-mix(in_srgb,var(--ink)_45%,transparent)]"
              />
            </div>
          </Tilt>
        </div>

        <div className="reveal mt-20 md:mt-28">
          <ul
            className="grid grid-cols-3 gap-4 border-y border-hairline py-8 md:gap-10"
            aria-label="Team make-up"
          >
            {team.map((group) => (
              <li key={group.role} className="flex flex-col items-center gap-4 text-center">
                <span className="flex gap-2" aria-hidden="true">
                  {Array.from({ length: group.count }, (_, index) => (
                    <span
                      key={index}
                      className={`size-5 rounded-full bg-ink md:size-7 ${
                        "note" in group && index === 0
                          ? "outline-2 outline-offset-4 outline-signal"
                          : ""
                      }`}
                    />
                  ))}
                </span>
                <span className="text-sm leading-snug font-medium md:text-base">
                  {group.count} {group.role.toLowerCase()}
                  {"note" in group && (
                    <span className="block text-xs font-normal text-ink-muted md:text-sm">
                      {group.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
          {beats.map((beat) => (
            <div key={beat.verb} className="reveal">
              <h3 className="title">{beat.verb}</h3>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-muted">{beat.text}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-14">
          <DetailsSheet label="Capstone details" eyebrow="Industry capstone" title="Agencia Change">
            <SheetSection title="Role">
              <p>
                Team Lead, Client Liaison and Developer, August 2026 to present, on a Monash
                industry capstone for Agencia Change.
              </p>
            </SheetSection>
            <SheetSection title="What I built">
              <p>
                <strong className="font-semibold">Form version control.</strong> Session-scoped
                operation logging, snapshots and version restore, so client staff can recover any
                earlier state of a form instead of losing work to an overwrite.
              </p>
              <p>
                <strong className="font-semibold">Real-time co-editing.</strong> Yjs (a CRDT) over
                WebSocket lets several people edit the same form at once, with no conflicts and no
                lock contention.
              </p>
              <p>
                <strong className="font-semibold">Handover.</strong> I own the technical
                documentation and handover pack, so the client can run and extend the product after
                the engagement ends.
              </p>
            </SheetSection>
            <SheetSection title="Stack">
              <p>CakePHP (MVC) on MySQL, Yjs, WebSocket, deployed to VentraIP cPanel hosting.</p>
            </SheetSection>
            <SheetSection title="The stakeholder matrix">
              <Shot
                name="work/agencia-matrix"
                alt="A stakeholder matrix plotting influence against impact, with drag-and-drop stakeholder circles."
                sizes="(min-width: 768px) 640px, 100vw"
                className="mx-auto w-full max-w-xl rounded-xl border border-hairline"
              />
              <p className="text-sm text-ink-muted">
                Screens show sample data only. Agencia Change’s product owner approved showing the
                product this way; no client data appears anywhere on this site.
              </p>
            </SheetSection>
          </DetailsSheet>
        </div>
      </div>
    </section>
  );
}
