import { skills } from "@/content/site";

// Skills as typography: each group is a large label with its tools set as running text, not a
// table or a wall of icons. Hovering a group quietly dims the others.
export function Skills() {
  return (
    <section id="skills" className="py-28 md:py-40">
      <div className="wrap">
        <div className="reveal">
          <p className="eyebrow">Skills</p>
          <h2 className="headline mt-5 max-w-4xl">From the database to the stakeholder demo.</h2>
        </div>

        <ul className="group/skills mt-16 md:mt-24">
          {skills.map((group) => (
            // The dimming lives on the <li> and the entrance animation on its child: an animation
            // holds opacity at 1 and would override the hover state if they shared an element.
            <li
              key={group.label}
              className="border-t border-hairline transition-opacity duration-300 last:border-b group-hover/skills:opacity-45 hover:opacity-100!"
            >
              <div className="reveal grid gap-3 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                <h3 className="title md:col-span-4">{group.label}</h3>
                <p className="text-[clamp(1.125rem,2.2vw,1.5rem)] leading-snug tracking-[-0.015em] text-ink-muted md:col-span-8">
                  {group.items.map((item, index) => (
                    <span key={item}>
                      {item}
                      {index < group.items.length - 1 && (
                        <>
                          <span className="mx-[0.1em] text-hairline" aria-hidden="true">
                            ·
                          </span>
                          <span className="sr-only">,</span>{" "}
                        </>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
