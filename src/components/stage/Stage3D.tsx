"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import images from "@/content/images.json";
import { Laptop, Phone, useScreens } from "./devices";
import type { SceneState } from "./devices";
import { sceneProgress } from "./progress";

const laptopScreens = [images["work/probudget-transactions"].src] as const;
// The screens fade through in this order as the scene scrolls, and the middle one is what rests on
// the phone when the scene is centred (or reached from a link), so it is the strongest: the home
// screen. The onboarding frames live in the details sheet.
const iphoneScreens = [
  images["work/mymichlin-splash"].src,
  images["work/mymichlin-dashboard"].src,
  images["work/mymichlin-search"].src,
] as const;
const androidScreens = [
  images["work/nutritrack-screen-home"].src,
  images["work/nutritrack-screen-insights"].src,
  images["work/nutritrack-screen-persona"].src,
] as const;

// Reads the scroll position (and the pointer) once per frame, eases towards it, and keeps
// asking for frames only until it has settled. The canvas renders on demand, so a still page
// costs nothing.
function Driver({
  track,
  count,
  scene,
}: {
  track: RefObject<HTMLElement | null>;
  count: number;
  scene: RefObject<SceneState>;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const pointer = useRef({ x: 0, y: 0 });
  const first = useRef(true);

  useEffect(() => {
    const wake = () => invalidate();
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [invalidate]);

  useFrame((state, delta) => {
    const target = sceneProgress(track.current, count);
    const current = scene.current;
    const ease = first.current ? 1 : 1 - Math.exp(-delta * 9);
    first.current = false;

    current.s += (target - current.s) * ease;
    current.px += (pointer.current.x - current.px) * ease;
    current.py += (pointer.current.y - current.py) * ease;

    const settled =
      Math.abs(target - current.s) < 0.0004 &&
      Math.abs(pointer.current.x - current.px) < 0.002 &&
      Math.abs(pointer.current.y - current.py) < 0.002;
    if (!settled) state.invalidate();
  }, -1);

  return null;
}

// Soft studio reflections for the metal, generated on the GPU instead of downloading an HDRI.
function StudioLight() {
  const gl = useThree((state) => state.gl);
  const environment = useMemo(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    generator.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);

  return (
    <>
      <primitive object={environment} attach="environment" />
      <hemisphereLight args={["#ffffff", "#8a8a90", 0.6]} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, 1, -3]} intensity={0.8} />
    </>
  );
}

function Rig({
  track,
  count,
  onLost,
}: {
  track: RefObject<HTMLElement | null>;
  count: number;
  onLost: () => void;
}) {
  const scene = useRef<SceneState>({ s: 0, px: 0, py: 0 });
  const viewport = useThree((state) => state.viewport);
  const laptop = useScreens(laptopScreens, onLost);
  const iphone = useScreens(iphoneScreens, onLost);
  const android = useScreens(androidScreens, onLost);

  // Devices fill about 60% of the stage height and sit right of centre, clear of the text.
  const { width, height } = viewport;
  const x = width * 0.2;
  const laptopScale = Math.min((width * 0.5) / 3.5, (height * 0.62) / 2.4);
  const phoneScale = Math.min((height * 0.7) / 1.7, (width * 0.26) / 0.8);

  return (
    <>
      <Driver track={track} count={count} scene={scene} />
      <StudioLight />
      <Laptop
        index={0}
        scene={scene}
        scale={laptopScale}
        x={x}
        viewportHeight={height}
        screen={laptop[0]}
      />
      <Phone
        kind="iphone"
        index={1}
        scene={scene}
        scale={phoneScale}
        x={x}
        viewportHeight={height}
        screens={iphone}
      />
      <Phone
        kind="android"
        index={2}
        scene={scene}
        scale={phoneScale}
        x={x}
        viewportHeight={height}
        screens={android}
      />
    </>
  );
}

export default function Stage3D({
  track,
  count,
  onLost,
}: {
  track: RefObject<HTMLElement | null>;
  count: number;
  onLost: () => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 9], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onLost();
        });
      }}
    >
      <Rig track={track} count={count} onLost={onLost} />
    </Canvas>
  );
}
