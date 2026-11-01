// Turns the raw captures in .context/asset/ (gitignored) into the web-ready images in public/.
// Run with `pnpm images` after changing the picks below. The outputs are committed, so CI and
// Vercel never need the raw files. Picks and exclusions are recorded in .context/decisions.md:
// every source here was checked for student IDs, phone numbers, UAT labels and real names.
//
// sharp drops all metadata (EXIF, GPS, colour profile text) unless asked to keep it.
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const asset = (...parts) => path.join(root, ".context", "asset", ...parts);
const live = (...parts) =>
  path.join(root, ".context", "previous-portfolio", "live-assets", "Image", ...parts);

// `crop` is in source pixels, `width` is the output width (never upscaled past the crop).
const jobs = [
  // Agencia Change (sample data only). Crops keep to the sample project and drop real-looking names.
  {
    out: "work/agencia-details",
    src: asset("Capstone", "ScreenShot_2026-11-01_171356_857.png"),
    width: 1800,
  },
  {
    out: "work/agencia-versions",
    src: asset("Capstone", "ScreenShot_2026-11-01_171453_978.png"),
    crop: { left: 760, top: 348, width: 1010, height: 586 },
    width: 1100,
  },
  {
    out: "work/agencia-matrix",
    src: asset("Capstone", "ScreenShot_2026-11-01_171509_450.png"),
    crop: { left: 960, top: 480, width: 870, height: 720 },
    width: 900,
  },

  // ProBudget. Crops skip the $0 summary cards above the transaction list.
  {
    out: "work/probudget-transactions",
    src: asset("ProBudget", "ScreenShot_2026-11-01_171111_049.png"),
    crop: { left: 740, top: 450, width: 1080, height: 675 },
    width: 1400,
  },
  {
    out: "work/probudget-add",
    src: asset("ProBudget", "ScreenShot_2026-11-01_171150_365.png"),
    crop: { left: 760, top: 230, width: 1040, height: 880 },
    width: 900,
  },

  // MyMichlin: bare Figma frames with rounded alpha corners. Native size (about 1x); re-export
  // at 3x before the 3D stage.
  { out: "work/mymichlin-splash", src: asset("MyMichlin", "Splash Screen.png") },
  { out: "work/mymichlin-onboarding-1", src: asset("MyMichlin", "Onboarding 1.png") },
  { out: "work/mymichlin-onboarding-2", src: asset("MyMichlin", "Onboarding 2.png") },
  { out: "work/mymichlin-dashboard", src: asset("MyMichlin", "Dashboard.png") },
  { out: "work/mymichlin-search", src: asset("MyMichlin", "Seach Result.png") },

  // NutriTrack screens without the baked-in Android frame, for the 3D phone to wear its own.
  {
    out: "work/nutritrack-screen-home",
    src: asset("NutriTrack", "Screenshot_20261101_170202.png"),
    crop: { left: 57, top: 62, width: 1076, height: 2416 },
    width: 720,
  },
  {
    out: "work/nutritrack-screen-insights",
    src: asset("NutriTrack", "Screenshot_20261101_170214.png"),
    crop: { left: 57, top: 62, width: 1076, height: 2416 },
    width: 720,
  },
  {
    out: "work/nutritrack-screen-persona",
    src: asset("NutriTrack", "Screenshot_20261101_170053.png"),
    crop: { left: 57, top: 62, width: 1076, height: 2416 },
    width: 720,
  },

  // NutriTrack: the Android frame is baked into the capture.
  {
    out: "work/nutritrack-home",
    src: asset("NutriTrack", "Screenshot_20261101_170202.png"),
    width: 640,
  },
  {
    out: "work/nutritrack-insights",
    src: asset("NutriTrack", "Screenshot_20261101_170214.png"),
    width: 640,
  },
  {
    out: "work/nutritrack-persona",
    src: asset("NutriTrack", "Screenshot_20261101_170053.png"),
    width: 640,
  },

  // About: cropped tight so the lectern crest and the rest of the room stay out of frame.
  {
    out: "about/david",
    src: live("aboutme", "david_presentation.jpg"),
    crop: { left: 1250, top: 700, width: 1060, height: 850 },
    width: 1000,
  },
];

// Output sizes are written next to the code so components never hard-code (and drift from) them.
const sizes = {};
let total = 0;
for (const job of jobs) {
  const dest = path.join(root, "public", `${job.out}.webp`);
  await mkdir(path.dirname(dest), { recursive: true });

  let image = sharp(job.src).rotate();
  if (job.crop) image = image.extract(job.crop);
  if (job.width) image = image.resize({ width: job.width, withoutEnlargement: true });
  const { width, height } = await image
    .webp({ quality: 84, alphaQuality: 100, effort: 6 })
    .toFile(dest);
  sizes[job.out] = { src: `/${job.out}.webp`, width, height };

  const { size } = await stat(dest);
  total += size;
  console.log(`${job.out}.webp  ${(size / 1024).toFixed(0)} KB`);
}
console.log(`total ${(total / 1024).toFixed(0)} KB`);
await writeFile(
  path.join(root, "src", "content", "images.json"),
  `${JSON.stringify(sizes, null, 2)}\n`,
);
