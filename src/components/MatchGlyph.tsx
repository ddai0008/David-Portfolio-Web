// A schematic of the de-duplication, one frame per step. The same dots appear in every frame, so
// the eye can follow them: collected, linked into likely pairs, flagged, then merged after review.
// It is an illustration of the method, not data, and says nothing about how many records matched.

type Point = readonly [number, number];

const pairs: readonly (readonly [Point, Point])[] = [
  [[30, 18], [44, 28]],
  [[74, 40], [90, 48]],
  [[108, 14], [122, 22]],
  [[132, 44], [146, 54]],
];

const singles: readonly Point[] = [
  [10, 34],
  [54, 50],
  [58, 10],
  [104, 34],
  [150, 12],
  [26, 52],
];

const middle = ([a, b]: readonly [Point, Point]): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

export function MatchGlyph({ step }: { step: 0 | 1 | 2 | 3 }) {
  return (
    <svg
      viewBox="0 0 160 64"
      className="h-auto w-full max-w-[14rem]"
      aria-hidden="true"
      focusable="false"
    >
      {step === 2 &&
        pairs.map((pair) => {
          const [x, y] = middle(pair);
          return <circle key={`${x}-${y}`} cx={x} cy={y} r={13} className="g-ring" />;
        })}

      {step === 1 &&
        pairs.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            pathLength={1}
            className="g-line"
          />
        ))}

      {singles.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} className="g-dot" />
      ))}

      {pairs.flatMap((pair) => {
        const [mx, my] = middle(pair);
        return pair.map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={3}
            className={step >= 2 ? (step === 3 ? "g-hot g-merge" : "g-hot") : "g-dot"}
            // Merged: the pair slides onto its midpoint. The animation only runs "from" the
            // original position, so this finished state is what shows without motion.
            style={step === 3 ? { transform: `translate(${mx - x}px, ${my - y}px)` } : undefined}
          />
        ));
      })}

      {step === 3 &&
        pairs.map((pair) => {
          const [x, y] = middle(pair);
          return <circle key={`${x}-${y}`} cx={x} cy={y} r={8} className="g-ring" />;
        })}
    </svg>
  );
}
