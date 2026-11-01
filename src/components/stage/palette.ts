// Material colours for the procedural devices. WebGL cannot read the CSS tokens, so the few
// colours the 3D scene needs live here. Devices stay neutral on purpose: project colour comes
// from the glow behind them, never from the hardware.
export const palette = {
  aluminium: "#c9c9ce",
  deck: "#1c1c1e",
  trackpad: "#2c2c2e",
  titanium: "#9a968f",
  graphite: "#2a2b2e",
  glass: "#ffffff",
  black: "#050505",
} as const;
