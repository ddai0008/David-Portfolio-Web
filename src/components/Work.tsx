import type { ReactNode } from "react";
import { proBudgetDemo } from "@/content/site";
import type { Hue } from "@/content/site";
import { vars } from "./css";
import { DetailsSheet, SheetSection } from "./DetailsSheet";
import { LaptopFrame, PhoneFrame } from "./Devices";
import { Shot } from "./Shot";
import { Tilt } from "./Tilt";
import { WorkShowcase } from "./WorkShowcase";
import type { ShowcaseProject } from "./WorkShowcase";

// What every project says, wherever it is laid out: flat in the 2D page, or beside the 3D stage.
function Copy({
  id,
  eyebrow,
  title,
  summary,
  highlights,
  chips,
  actions,
}: {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  chips: readonly string[];
  actions: ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h3 id={`${id}-title`} className="headline mt-4">
        {title}
      </h3>
      <p className="lede mt-4">{summary}</p>
      {/* What the details sheet holds that matters most, so a skimmer need not open it. The gaps are
          tight enough that the whole panel fits a 600px-tall window beside the pinned stage. */}
      <ul className="mt-5 space-y-2.5">
        {highlights.map((line) => (
          <li key={line} className="flex gap-3 text-[1.0625rem] leading-normal">
            <span
              className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-ink-muted"
              aria-hidden="true"
            />
            {line}
          </li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
        {chips.map((chip) => (
          <li key={chip} className="chip">
            {chip}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
    </>
  );
}

type ProjectInput = {
  id: string;
  hue: Hue;
  eyebrow: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  chips: readonly string[];
  art: ReactNode;
  actions: ReactNode;
};

function project({ id, hue, art, ...copy }: ProjectInput): ShowcaseProject {
  return { id, hue, art, label: copy.title, copy: <Copy id={id} {...copy} /> };
}

function Fact({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function Work() {
  const projects = [
    project({
      id: "probudget",
      hue: "probudget",
      eyebrow: "Full-stack web · live",
      title: "ProBudget",
      summary: "A live finance app for tracking recurring subscriptions and budget trends, in a responsive, dark-mode interface.",
      highlights: [
        "I architected, built and deployed it, with a schema and indexes designed for fast retrieval as data grows.",
        "I moved its database from PostgreSQL to Azure SQL Database, where I put my DP-900 to work.",
      ],
      chips: ["Next.js 15", "TypeScript", "Azure SQL Database", "Vercel"],
      art: (
        <Tilt className="relative mx-auto max-w-2xl" max={4}>
          <div className="reveal">
            <LaptopFrame>
              <Shot
                name="work/probudget-transactions"
                alt="ProBudget's transaction history: a searchable list of income and expenses with category, date and amount."
                sizes="(min-width: 768px) 560px, 100vw"
              />
            </LaptopFrame>
          </div>
          <div
            className="drift absolute right-[-2%] bottom-[-8%] w-[38%]"
            style={vars({ "--drift": "2rem" })}
          >
            <Shot
              name="work/probudget-add"
              alt="The Add Transaction form: expense or income, amount, date, description, category and a receipt upload."
              sizes="(min-width: 768px) 220px, 38vw"
              className="rounded-xl border border-hairline shadow-[0_30px_60px_-20px_color-mix(in_srgb,var(--ink)_45%,transparent)]"
            />
          </div>
        </Tilt>
      ),
      actions: (
        <>
          <a
            href={proBudgetDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Try the live demo
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <DetailsSheet label="Details" eyebrow="Full-stack web" title="ProBudget">
            <SheetSection title="What it is">
              <Fact>
                A live application where people manage recurring subscriptions and visualise
                budget trends, in a responsive dark-mode interface.
              </Fact>
            </SheetSection>
            <SheetSection title="Decisions">
              <Fact>
                I designed the schema and indexing strategy so transaction retrieval stays
                efficient as the data grows.
              </Fact>
              <Fact>
                I then moved the production database from PostgreSQL to Azure SQL Database, which
                is where I apply my DP-900 certification in practice. The SQL was translated
                across about 40 call sites behind one data-access layer, money is bound as exact
                decimals, and the app retries while the serverless database resumes from a pause.
              </Fact>
            </SheetSection>
            <SheetSection title="Stack">
              <Fact>Next.js 15, React, TypeScript, Tailwind CSS, Azure SQL Database, Vercel.</Fact>
            </SheetSection>
            <SheetSection title="Try it">
              <Fact>
                The demo account is printed on the sign-in page at{" "}
                <a href={proBudgetDemo} target="_blank" rel="noopener noreferrer">
                  pro-budget.vercel.app
                </a>
                . The source repository is private.
              </Fact>
            </SheetSection>
          </DetailsSheet>
        </>
      ),
    }),

    project({
      id: "mymichlin",
      hue: "mymichlin",
      eyebrow: "iOS · design prototype",
      title: "MyMichlin",
      summary: "A restaurant discovery app with an AI recommendation engine on Google Gemini. Graded 95%, High Distinction.",
      highlights: [
        "Live restaurant data from the Google Maps SDK, Places API and MapKit.",
        "Custom map annotations, built with async Swift.",
      ],
      chips: ["Swift", "UIKit", "MapKit", "Google Places API", "Gemini API"],
      art: (
        <Tilt className="mx-auto max-w-xl" max={6}>
          <div className="reveal flex items-end justify-center gap-[3%]">
            <div className="w-[29%] -rotate-6 translate-y-6">
              <PhoneFrame>
                <Shot
                  name="work/mymichlin-onboarding-1"
                  alt="MyMichlin onboarding: Explore like a Michelin inspector."
                  sizes="(min-width: 768px) 170px, 30vw"
                />
              </PhoneFrame>
            </div>
            <div className="relative z-10 w-[36%]">
              <PhoneFrame>
                <Shot
                  name="work/mymichlin-dashboard"
                  alt="The MyMichlin home screen with a search bar, a greeting and trending restaurants."
                  sizes="(min-width: 768px) 210px, 36vw"
                />
              </PhoneFrame>
            </div>
            <div className="w-[29%] rotate-6 translate-y-6">
              <PhoneFrame>
                <Shot
                  name="work/mymichlin-search"
                  alt="MyMichlin search results, with AI-suggested restaurants listed with rating and cuisine."
                  sizes="(min-width: 768px) 170px, 30vw"
                />
              </PhoneFrame>
            </div>
          </div>
        </Tilt>
      ),
      actions: (
        <>
          <a
            href="https://github.com/ddai0008/MyMichlin"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Source on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <DetailsSheet label="Details" eyebrow="iOS" title="MyMichlin">
            <SheetSection title="What it is">
              <Fact>
                An iOS restaurant discovery app. Screens here are from the Figma prototype, which
                the finished app follows closely.
              </Fact>
            </SheetSection>
            <SheetSection title="Decisions">
              <Fact>
                I built the recommendation engine on the Google Gemini API, and integrated the
                Google Maps SDK, Places API and MapKit through async Swift for live restaurant
                data and custom map annotations.
              </Fact>
            </SheetSection>
            <SheetSection title="Outcome">
              <Fact>
                Graded 95% (High Distinction) for UI design, code quality and technical
                implementation.
              </Fact>
            </SheetSection>
            <SheetSection title="Stack">
              <Fact>Swift, UIKit, MVC, MapKit, Google Maps SDK, Google Places API, Gemini API, Figma.</Fact>
            </SheetSection>
            <SheetSection title="Onboarding">
              <div className="flex justify-center gap-4">
                <div className="w-1/3 max-w-40">
                  <PhoneFrame>
                    <Shot
                      name="work/mymichlin-splash"
                      alt="The MyMichlin splash screen with a chef's hat logo."
                      sizes="160px"
                    />
                  </PhoneFrame>
                </div>
                <div className="w-1/3 max-w-40">
                  <PhoneFrame>
                    <Shot
                      name="work/mymichlin-onboarding-2"
                      alt="MyMichlin onboarding: Personalised for you."
                      sizes="160px"
                    />
                  </PhoneFrame>
                </div>
              </div>
            </SheetSection>
          </DetailsSheet>
        </>
      ),
    }),

    project({
      id: "nutritrack",
      hue: "nutritrack",
      eyebrow: "Android · offline-first",
      title: "NutriTrack",
      summary: "A Gemini-powered dietary analysis app that keeps working offline. Graded High Distinction.",
      highlights: [
        "Scores a person’s diet against food guidelines and suggests where to improve.",
        "Material Design interface designed in Figma, scoped through simulated client sessions.",
      ],
      chips: ["Kotlin", "Jetpack Compose", "Room", "Gemini API", "MVVM"],
      art: (
        <Tilt className="mx-auto max-w-xl" max={6}>
          <div className="reveal flex items-end justify-center gap-[2%]">
            <div className="w-[30%] -rotate-6 translate-y-6">
              <Shot
                name="work/nutritrack-persona"
                alt="NutriTrack's food intake questionnaire, asking which persona fits best."
                sizes="(min-width: 768px) 180px, 30vw"
                className="drop-shadow-[0_24px_30px_color-mix(in_srgb,var(--ink)_30%,transparent)]"
              />
            </div>
            <div className="relative z-10 w-[37%]">
              <Shot
                name="work/nutritrack-home"
                alt="NutriTrack's home screen with a plate graphic and a Food Quality Score of 47 out of 100."
                sizes="(min-width: 768px) 220px, 37vw"
                className="drop-shadow-[0_24px_30px_color-mix(in_srgb,var(--ink)_30%,transparent)]"
              />
            </div>
            <div className="w-[30%] rotate-6 translate-y-6">
              <Shot
                name="work/nutritrack-insights"
                alt="NutriTrack's food score insights, with a bar for each food group."
                sizes="(min-width: 768px) 180px, 30vw"
                className="drop-shadow-[0_24px_30px_color-mix(in_srgb,var(--ink)_30%,transparent)]"
              />
            </div>
          </div>
        </Tilt>
      ),
      actions: (
        <>
          <a
            href="https://github.com/ddai0008/Nutritrack"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Source on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <DetailsSheet label="Details" eyebrow="Android" title="NutriTrack">
            <SheetSection title="What it is">
              <Fact>
                An Android app that scores a person’s diet against food guidelines and suggests
                where to improve.
              </Fact>
            </SheetSection>
            <SheetSection title="Decisions">
              <Fact>
                The dietary analysis runs on the Gemini API, with Room persistence so the app is
                offline-first.
              </Fact>
              <Fact>
                I designed the Material Design interface in Figma, scoped through simulated client
                requirement-gathering sessions.
              </Fact>
            </SheetSection>
            <SheetSection title="Outcome">
              <Fact>
                Graded High Distinction for functionality, structure and adherence to clean MVVM
                architecture.
              </Fact>
            </SheetSection>
            <SheetSection title="Stack">
              <Fact>Kotlin, Jetpack Compose, Room, Gemini API, MVVM, Figma.</Fact>
            </SheetSection>
          </DetailsSheet>
        </>
      ),
    }),
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="py-12 md:py-20">
      <div className="wrap reveal">
        <p className="eyebrow">Selected work</p>
        {/* The section's heading is a step down so that each project's name, which is what the section
            is about, is the biggest type in it. */}
        <h2 id="work-title" className="title mt-5 max-w-3xl">
          Built end to end, then shipped.
        </h2>
      </div>
      <WorkShowcase projects={projects} />
    </section>
  );
}
