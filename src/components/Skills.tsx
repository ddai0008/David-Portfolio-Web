import { evidence, skillEvidence, skills } from "@/content/site";
import { vars } from "./css";

// Skills as typography: each group is a large label with its tools set as plain words, not a
// table or a wall of icons. A skill that a project on this page uses carries that project's dot,
// and choosing a project underlines its skills. The choice is a radio group read by CSS (:has),
// so it needs no script and works from the keyboard; without :has the dots still tell the story.
export function Skills() {
  const byId = Object.fromEntries(evidence.map((place) => [place.id, place]));

  return (
    <section id="skills" className="dots py-24 md:py-32">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Skills</p>
          <h2 className="headline mt-5 max-w-4xl">From the database to the stakeholder demo.</h2>
        </div>

        <div className="skills-explorer">
          <div
            role="radiogroup"
            aria-labelledby="skills-filter"
            className="mt-10 flex flex-wrap items-center gap-2 md:mt-14"
          >
            <span id="skills-filter" className="mr-1 text-[0.9375rem] text-ink-muted">
              Highlight skills used in
            </span>
            <label className="skill-pill">
              <input
                type="radio"
                name="skills-project"
                value="none"
                defaultChecked
                className="sr-only"
              />
              None
            </label>
            {evidence.map((place) => (
              <label key={place.id} className="skill-pill">
                <input
                  type="radio"
                  name="skills-project"
                  id={`skill-${place.id}`}
                  value={place.id}
                  className="sr-only"
                />
                <span
                  className="skill-dot"
                  data-plain={place.hue ? undefined : ""}
                  style={vars({ "--dot": place.hue ? `var(--hue-${place.hue})` : "transparent" })}
                  aria-hidden="true"
                />
                {place.label}
              </label>
            ))}
          </div>

          <ul className="group/skills mt-8 md:mt-12">
            {skills.map((group) => (
              // The dimming lives on the <li> and the entrance animation on its child: an animation
              // holds opacity at 1 and would override the hover state if they shared an element.
              <li
                key={group.label}
                className="border-t border-hairline transition-opacity duration-300 last:border-b group-hover/skills:opacity-45 hover:opacity-100!"
              >
                <div className="reveal-soft grid gap-3 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                  <h3 className="title md:col-span-4">{group.label}</h3>
                  <ul
                    role="list"
                    className="flex flex-wrap gap-x-[1.1em] gap-y-1.5 text-[clamp(1.125rem,2.2vw,1.5rem)] leading-snug tracking-[-0.015em] md:col-span-8"
                  >
                    {group.items.map((item) => {
                      const places = skillEvidence[item] ?? [];
                      return (
                        <li
                          key={item}
                          className="skill whitespace-nowrap"
                          data-p={places.length ? places.join(" ") : undefined}
                        >
                          {item}
                          {places.length > 0 && (
                            <>
                              <span className="skill-dots" aria-hidden="true">
                                {places.map((id) => (
                                  <span
                                    key={id}
                                    className="skill-dot"
                                    data-plain={byId[id].hue ? undefined : ""}
                                    style={vars({
                                      "--dot": byId[id].hue ? `var(--hue-${byId[id].hue})` : "transparent",
                                    })}
                                  />
                                ))}
                              </span>
                              <span className="sr-only">
                                {" "}
                                ({places.map((id) => byId[id].label).join(", ")})
                              </span>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
