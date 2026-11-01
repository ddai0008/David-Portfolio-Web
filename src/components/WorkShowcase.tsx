"use client";

import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, ReactNode, RefObject } from "react";
import type { Hue } from "@/content/site";
import { vars } from "./css";
import { sceneOffset, sceneProgress } from "./stage/progress";

export type ShowcaseProject = {
  id: string;
  hue: Hue;
  // The words and buttons, and the 2D picture. The same nodes serve both layouts.
  copy: ReactNode;
  art: ReactNode;
};

type StageProps = {
  track: RefObject<HTMLElement | null>;
  count: number;
  onLost: () => void;
};

let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl === undefined) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      webgl = Boolean(gl);
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

// The 3D stage is an enhancement. Every other case gets the flat page, which already tells the
// whole story: small screens, reduced motion, data saver and browsers without WebGL 2.
function canStage() {
  if (!matchMedia("(min-width: 768px)").matches) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (connection?.saveData) return false;
  return hasWebGL();
}

// Re-evaluated whenever the window crosses the width breakpoint or the motion preference changes.
function subscribeToEligibility(onChange: () => void) {
  const queries = [matchMedia("(min-width: 768px)"), matchMedia("(prefers-reduced-motion: reduce)")];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

class StageBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function WorkShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const root = useRef<HTMLDivElement>(null);
  // False on the server and during hydration, so the first client render matches the HTML.
  const eligible = useSyncExternalStore(subscribeToEligibility, canStage, () => false);
  const [Stage, setStage] = useState<ComponentType<StageProps> | null>(null);
  const [swapped, setSwapped] = useState(false);
  const [failed, setFailed] = useState(false);
  const staged = eligible && swapped && !failed && Stage !== null;
  // Stable, because the 3D scene reloads its textures if this changes.
  const giveUp = useCallback(() => setFailed(true), []);

  // Fetch the 3D code only when the section is a screen or two away, so it never competes with
  // the first paint.
  useEffect(() => {
    if (!eligible || Stage || failed) return;
    const node = root.current;
    if (!node) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import("./stage/Stage3D")
          .then((module) => {
            if (!cancelled) setStage(() => module.default);
          })
          .catch(() => {
            if (!cancelled) setFailed(true);
          });
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [eligible, Stage, failed]);

  // Swap layouts only while the section is below the viewport. The two layouts differ in height,
  // so swapping while it is on screen, or above the reader, would shift the page under them. A
  // reader who is already past the section simply keeps the flat layout.
  useEffect(() => {
    if (!eligible || !Stage || failed || swapped) return;
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) setSwapped(true);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [eligible, Stage, failed, swapped]);

  // If the stage goes away while it is being read (the window narrowed, motion was switched
  // off, or the scene failed), put the reader back at the start of the section.
  const wasStaged = useRef(false);
  useEffect(() => {
    if (wasStaged.current && !staged) {
      root.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
    wasStaged.current = staged;
  }, [staged]);

  return (
    <div ref={root}>
      {staged && Stage ? (
        <StageLayout projects={projects} Stage={Stage} onFail={giveUp} />
      ) : (
        <FlatLayout projects={projects} />
      )}
    </div>
  );
}

function FlatLayout({ projects }: { projects: ShowcaseProject[] }) {
  return projects.map(({ id, hue, copy, art }, index) => {
    const flip = index % 2 === 1;
    return (
      <article
        key={id}
        id={id}
        className="relative scroll-mt-16 overflow-hidden py-20 md:py-32"
        style={vars({ "--hue": `var(--hue-${hue})` })}
        aria-labelledby={`${id}-title`}
      >
        <div className="wrap grid items-center gap-14 md:grid-cols-12 md:gap-10">
          <div className={`reveal md:col-span-5 ${flip ? "md:order-2" : ""}`}>{copy}</div>
          <div className={`stage md:col-span-7 ${flip ? "md:order-1" : ""}`}>
            <div className="glow" aria-hidden="true" />
            {art}
          </div>
        </div>
      </article>
    );
  });
}

// A tall track with one screen of scroll per project. The stage is pinned to the viewport for
// the length of the track while the devices take turns; the empty anchors keep in-page links
// such as #mymichlin landing on the right project.
function StageLayout({
  projects,
  Stage,
  onFail,
}: {
  projects: ShowcaseProject[];
  Stage: ComponentType<StageProps>;
  onFail: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(Math.round(sceneProgress(track.current, count)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return (
    <div ref={track} className="relative">
      <div className="sticky top-0 h-svh overflow-hidden" style={{ marginBottom: "-100svh" }}>
        {projects.map(({ id, hue }, index) => (
          <div
            key={id}
            className="stage-glow"
            data-on={active === index}
            style={vars({ "--hue": `var(--hue-${hue})` })}
            aria-hidden="true"
          />
        ))}

        <StageBoundary onError={onFail}>
          <Stage track={track} count={count} onLost={onFail} />
        </StageBoundary>

        <div className="wrap pointer-events-none relative z-10 grid h-full grid-cols-12 items-center">
          <div className="col-span-5 grid">
            {projects.map(({ id, copy }, index) => (
              <article
                key={id}
                className="stage-panel"
                style={{ gridArea: "1 / 1" }}
                data-active={active === index}
                aria-labelledby={`${id}-title`}
                // Tabbing into a hidden project brings its scene on stage first.
                onFocusCapture={() => {
                  if (active !== index && track.current) {
                    window.scrollTo({ top: sceneOffset(track.current, index), behavior: "instant" });
                  }
                }}
              >
                {copy}
              </article>
            ))}
          </div>
        </div>

        <ol
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2.5"
          aria-hidden="true"
        >
          {projects.map(({ id }, index) => (
            <li
              key={id}
              className="h-1.5 rounded-full bg-ink transition-all duration-500"
              style={{ width: active === index ? "1.75rem" : "0.375rem", opacity: active === index ? 1 : 0.25 }}
            />
          ))}
        </ol>
      </div>

      {projects.map(({ id }) => (
        <div key={id} id={id} aria-hidden="true" style={{ height: "100svh" }} />
      ))}
    </div>
  );
}
