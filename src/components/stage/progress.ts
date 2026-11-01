// Scroll maths shared by the stage layout (text panels) and the 3D scene (devices), so both
// agree on which project is on stage.

// Matches `scroll-padding-top: 4rem` in globals.css: an in-page link such as #mymichlin lands
// the section's anchor exactly this far below the top, and that must read as a whole scene.
export const NAV_OFFSET = 64;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// 0 at the first scene, count - 1 at the last, fractional in between. The track holds one
// full-height anchor per scene and the sticky stage pins for count - 1 of those heights.
export function sceneProgress(track: HTMLElement | null, count: number): number {
  if (!track) return 0;
  const { top } = track.getBoundingClientRect();
  return clamp((-top + NAV_OFFSET) / window.innerHeight, 0, count - 1);
}

export function sceneOffset(track: HTMLElement, index: number): number {
  return window.scrollY + track.getBoundingClientRect().top + index * window.innerHeight - NAV_OFFSET;
}
