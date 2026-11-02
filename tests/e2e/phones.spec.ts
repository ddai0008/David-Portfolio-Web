import { expect, test } from "@playwright/test";
import sharp from "sharp";
import {
  androidSpec,
  BODY_FILLET,
  FRAME_CORNER_SHARE,
  frontLayers,
  iphoneSpec,
} from "../../src/components/stage/phones";
import images from "../../src/content/images.json";

// The 3D phones show real screenshots, so each screen has to be exactly the shape of its picture:
// the same proportions, and for MyMichlin the same rounded corners the Figma frames carry. These
// need no browser; they read the shipped files. When the frames are re-exported (for example at
// 3x), the corner check says whether FRAME_CORNER_SHARE needs updating.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "no browser involved, so run it once");
});

const sizes = (prefix: string) =>
  Object.entries(images)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, image]) => ({ name, width: image.width, height: image.height }));

test("the iPhone screen has the proportions of every MyMichlin frame", () => {
  const frames = sizes("work/mymichlin-");
  expect(frames.length).toBeGreaterThan(0);
  const shape = iphoneSpec.display.width / iphoneSpec.display.height;
  for (const { name, width, height } of frames) {
    expect(width / height, name).toBeCloseTo(shape, 3);
  }
});

test("the Android screen has the proportions of every NutriTrack crop", () => {
  const crops = sizes("work/nutritrack-screen-");
  expect(crops.length).toBeGreaterThan(0);
  const shape = androidSpec.display.width / androidSpec.display.height;
  for (const { name, width, height } of crops) {
    expect(width / height, name).toBeCloseTo(shape, 3);
  }
});

test("every MyMichlin frame has the rounded corners the iPhone screen is built for", async () => {
  const frames = sizes("work/mymichlin-");
  expect(frames.length).toBeGreaterThan(0);
  for (const { name, width } of frames) {
    const file = `public${images[name as keyof typeof images].src}`;
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = (x: number, y: number) => data[(y * info.width + x) * info.channels + 3];

    // A rounded corner crosses the diagonal at radius * (1 - 1/sqrt 2) from the corner.
    let step = 0;
    while (step < info.width / 2 && alpha(step, step) < 128) step++;
    const measured = step / (1 - Math.SQRT1_2) / width;
    expect(Math.abs(measured - FRAME_CORNER_SHARE), name).toBeLessThan(0.012);
  }
  expect(iphoneSpec.display.radius / iphoneSpec.display.width).toBeCloseTo(FRAME_CORNER_SHARE, 4);
});

test("the iPhone's glass sits an even distance inside its body, as on the real phone", () => {
  const { body, display, bezel } = iphoneSpec;
  const sideInset = (body.width - display.width) / 2;
  const endInset = (body.height - display.height) / 2;
  expect(endInset).toBeCloseTo(sideInset, 4);
  // Concentric corners: the body's radius is the screen's plus the inset, so the bezel never pinches.
  expect(body.radius - display.radius).toBeCloseTo(sideInset, 4);
  expect(bezel.radius).toBeLessThan(body.radius);
  expect(bezel.width).toBeLessThan(body.width);
  expect(bezel.width).toBeGreaterThan(display.width);
});

test("the black glass starts where the flat front face ends, so it cannot float off the edge", () => {
  for (const spec of [iphoneSpec, androidSpec]) {
    const rim = (spec.body.width - spec.bezel.width) / 2;
    expect(rim).toBeGreaterThanOrEqual(BODY_FILLET - 1e-9);
  }
});

test("the Dynamic Island is in front of every screen, and the glass in front of that", () => {
  // The last MyMichlin screens are mostly white at the top and wash out an island behind them.
  for (const screens of [1, 3, 5, 8]) {
    const layer = frontLayers(screens);
    const last = layer.screen(screens - 1);
    expect(layer.bezel, `${screens} screens`).toBeLessThan(layer.screen(0));
    expect(last, `${screens} screens`).toBeLessThan(layer.island);
    expect(layer.island, `${screens} screens`).toBeLessThan(layer.glass);
    // Far enough apart for the depth buffer to tell them apart at the stage's distance.
    expect(layer.island - last, `${screens} screens`).toBeGreaterThanOrEqual(0.0005);
  }
});
