import type { Metadata } from "next";
import Link from "next/link";
import { Aurora } from "@/components/Aurora";
import { person } from "@/content/site";

export const metadata: Metadata = { title: "Page not found — David Dai" };

// Any address that is not the portfolio. In the static export this becomes 404.html, which Vercel
// serves for unknown paths. It sits inside the root layout, so the theme, type and skip link carry over.
export default function NotFound() {
  return (
    <main
      id="main"
      className="relative isolate grid min-h-svh place-items-center overflow-hidden py-24"
    >
      <Aurora
        fade="bottom"
        blobs={[
          { hue: "agencia", x: "72%", y: "24%", size: "56%", dur: 34 },
          { hue: "probudget", x: "50%", y: "56%", size: "50%", dur: 28, delay: -9 },
          { hue: "mymichlin", x: "92%", y: "70%", size: "44%", dur: 31, delay: -17 },
          { hue: "nutritrack", x: "26%", y: "90%", size: "42%", dur: 37, delay: -5 },
        ]}
      />
      <div className="wrap">
        <p className="eyebrow">404 · Page not found</p>
        <h1 className="headline mt-5 max-w-3xl">That page isn’t here.</h1>
        <p className="lede mt-6 max-w-xl">
          The address may be mistyped or out of date. The portfolio and the résumé are one tap away.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/" className="btn btn-primary">
            Back to the portfolio
          </Link>
          <a href={person.resume} download className="btn btn-secondary">
            Download résumé
          </a>
        </div>
      </div>
    </main>
  );
}
