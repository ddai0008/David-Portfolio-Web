import images from "../../content/images.json";

// How big the 3D phones are, in scene units where an iPhone body is 0.8 wide. No three.js here, so
// a test can read it. The screens are derived from the shipped images' own sizes, which is what
// keeps each picture exactly the shape of the glass it is shown on.

// The Figma frames for MyMichlin are bare iPhone screens with their rounded corners baked into the
// alpha channel. Measured on the 404px-wide frames: about 61 px along the diagonal and 67 px at the
// edge, so roughly 15.8% of the width. A test re-measures this when the frames are re-exported.
export const FRAME_CORNER_SHARE = 0.158;

// Every MyMichlin screen is the same size, so one stands for all of them.
const frame = images["work/mymichlin-splash"];
const crop = images["work/nutritrack-screen-home"];

// Real iPhone 15 Pro proportions: the body is 70.6 x 146.6 x 8.25 mm and the glass is inset by an
// even 2.75 mm. At 0.8 wide, one millimetre is about 0.0113 units.
const IPHONE_INSET = 0.0312;
const IPHONE_DEPTH = 0.0935;
// How round the edges of a phone body are. The black front glass must start where the flat front
// face ends, so the titanium rim round it is exactly this wide; any narrower and the glass would
// hang over the curve and float off the metal at an angle.
export const BODY_FILLET = 0.012;
const IPHONE_RIM = BODY_FILLET;

const iphoneDisplayWidth = 0.7376;
const iphoneDisplayHeight = (iphoneDisplayWidth * frame.height) / frame.width;
const iphoneDisplayRadius = FRAME_CORNER_SHARE * iphoneDisplayWidth;

const iphoneBodyWidth = iphoneDisplayWidth + 2 * IPHONE_INSET;
const iphoneBodyHeight = iphoneDisplayHeight + 2 * IPHONE_INSET;
// Concentric with the screen, as on the real phone, so the bezel is an even width all round.
const iphoneBodyRadius = iphoneDisplayRadius + IPHONE_INSET;

// The Dynamic Island: 126 x 37 pt on a 393 pt wide screen.
const iphoneIslandWidth = iphoneDisplayWidth * (126 / 393);
const iphoneIslandHeight = iphoneDisplayWidth * (37 / 393);

type Rect = { width: number; height: number; radius: number };

type PhoneSpec = {
  body: Rect & { depth: number };
  // The black glass in front of the screen.
  bezel: Rect;
  // Exactly the shape of the screenshots.
  display: Rect;
};

export const iphoneSpec = {
  body: {
    width: iphoneBodyWidth,
    height: iphoneBodyHeight,
    depth: IPHONE_DEPTH,
    radius: iphoneBodyRadius,
  },
  bezel: {
    width: iphoneBodyWidth - 2 * IPHONE_RIM,
    height: iphoneBodyHeight - 2 * IPHONE_RIM,
    radius: iphoneBodyRadius - IPHONE_RIM,
  },
  display: { width: iphoneDisplayWidth, height: iphoneDisplayHeight, radius: iphoneDisplayRadius },
  island: {
    width: iphoneIslandWidth,
    height: iphoneIslandHeight,
    // From the top edge of the screen to the top of the island: 11 pt on a 393 pt screen.
    top: iphoneDisplayWidth * (11 / 393),
  },
} as const satisfies PhoneSpec & { island: { width: number; height: number; top: number } };

const androidDisplayWidth = 0.72;
export const androidSpec = {
  body: { width: 0.8, height: 1.7, depth: 0.09, radius: 0.11 },
  bezel: { width: 0.76, height: (androidDisplayWidth * crop.height) / crop.width + 0.05, radius: 0.09 },
  display: {
    width: androidDisplayWidth,
    height: (androidDisplayWidth * crop.height) / crop.width,
    radius: 0.08,
  },
} as const satisfies PhoneSpec;
