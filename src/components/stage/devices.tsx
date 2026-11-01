"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { palette } from "./palette";

// The devices are built in code: rounded bodies, a bezel, a glossy glass layer and a screen
// plane. No models are downloaded, so there is nothing to license and almost nothing to ship.

export type SceneState = { s: number; px: number; py: number };

type DeviceProps = {
  index: number;
  scene: RefObject<SceneState>;
  // World-space size and resting position, worked out from the viewport by the stage.
  scale: number;
  x: number;
  viewportHeight: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// `u` is how far the scroll is from this device's scene: 0 when it is centred on stage, then
// +/-1 at the neighbouring scenes. Scrolling forward lifts the device away and brings the next
// one up from below, the way page content moves.
function usePose(
  { index, scene, scale, x, viewportHeight }: DeviceProps,
  yaw: number,
): RefObject<THREE.Group | null> {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const node = group.current;
    if (!node) return;
    const { s, px, py } = scene.current;
    const u = s - index;
    const distance = Math.abs(u);
    const away = smoothstep(0.28, 0.85, distance);
    const direction = Math.sign(u);

    node.visible = distance < 0.95;
    node.position.set(x + px * 0.12, direction * away * viewportHeight * 1.05, 0);
    node.rotation.set(
      -direction * away * 0.3 - py * 0.1,
      yaw + u * 0.9 + px * 0.25,
      direction * away * 0.08,
    );
    node.scale.setScalar(scale * (1 - 0.18 * away));
  });
  return group;
}

function useDispose(resource: { dispose(): void }) {
  useEffect(() => () => resource.dispose(), [resource]);
}

function roundedRect(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - radius);
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + height);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);

  const geometry = new THREE.ShapeGeometry(shape, 8);
  // ShapeGeometry maps UVs to raw positions; stretch them over 0..1 so a texture fills the shape.
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
  }
  uv.needsUpdate = true;
  return geometry;
}

// Loads screen images as textures. They arrive one by one, so a device shows a dark screen for
// a moment rather than blocking the whole scene.
export function useScreens(
  urls: readonly string[],
  onError: () => void,
): (THREE.Texture | null)[] {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() => urls.map(() => null));

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const made: THREE.Texture[] = [];
    urls.forEach((url, index) => {
      loader.load(
        url,
        (texture) => {
          if (cancelled) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = gl.capabilities.getMaxAnisotropy();
          made.push(texture);
          setTextures((previous) => previous.map((old, i) => (i === index ? texture : old)));
          invalidate();
        },
        undefined,
        // A device with a blank screen is worse than the flat page, so give up on the stage.
        () => {
          if (!cancelled) onError();
        },
      );
    });
    return () => {
      cancelled = true;
      for (const texture of made) texture.dispose();
    };
  }, [urls, gl, invalidate, onError]);

  return textures;
}

// A glossy layer over the screen that catches the environment light.
function Glass({ geometry, z, y = 0 }: { geometry: THREE.BufferGeometry; z: number; y?: number }) {
  return (
    <mesh geometry={geometry} position={[0, y, z]} renderOrder={20}>
      <meshStandardMaterial
        color={palette.glass}
        transparent
        opacity={0.07}
        roughness={0.06}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Laptop({
  screen,
  ...props
}: DeviceProps & { screen: THREE.Texture | null }) {
  const group = usePose(props, -0.28);

  const base = useMemo(() => new RoundedBoxGeometry(3.4, 0.09, 2.3, 4, 0.045), []);
  const lid = useMemo(() => new RoundedBoxGeometry(3.4, 2.25, 0.07, 4, 0.045), []);
  const bezel = useMemo(() => roundedRect(3.34, 2.15, 0.05), []);
  const display = useMemo(() => roundedRect(3.22, 2.01, 0.035), []);
  useDispose(base);
  useDispose(lid);
  useDispose(bezel);
  useDispose(display);

  return (
    <group ref={group}>
      <group position={[0, -1, 0.2]}>
        <mesh geometry={base}>
          <meshStandardMaterial color={palette.aluminium} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.0455, -0.12]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[3.0, 1.1]} />
          <meshStandardMaterial color={palette.deck} roughness={0.75} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.0455, 0.8]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1.25, 0.78]} />
          <meshStandardMaterial color={palette.trackpad} roughness={0.35} metalness={0.4} />
        </mesh>

        <group position={[0, 0.045, -1.13]} rotation-x={-0.27}>
          <mesh geometry={lid} position={[0, 1.125, 0]}>
            <meshStandardMaterial color={palette.aluminium} metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh geometry={bezel} position={[0, 1.125, 0.0356]}>
            <meshBasicMaterial color={palette.black} />
          </mesh>
          <mesh geometry={display} position={[0, 1.125, 0.0362]}>
            <meshBasicMaterial
              // A new key rebuilds the material when the image arrives, so its shader gains the map.
              key={screen ? "ready" : "loading"}
              map={screen}
              color={screen ? "#ffffff" : palette.black}
              toneMapped={false}
            />
          </mesh>
          <Glass geometry={display} y={1.125} z={0.0366} />
        </group>
      </group>
    </group>
  );
}

type PhoneKind = "iphone" | "android";

export function Phone({
  kind,
  screens,
  ...props
}: DeviceProps & { kind: PhoneKind; screens: (THREE.Texture | null)[] }) {
  const layers = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const group = usePose(props, kind === "iphone" ? -0.3 : 0.28);

  const iphone = kind === "iphone";
  const screenHeight = iphone ? 1.56 : 1.617;
  const body = useMemo(
    () => new RoundedBoxGeometry(0.8, 1.7, 0.09, 4, iphone ? 0.13 : 0.11),
    [iphone],
  );
  const bezel = useMemo(
    () => roundedRect(0.76, screenHeight + 0.05, iphone ? 0.11 : 0.09),
    [iphone, screenHeight],
  );
  const display = useMemo(
    () => roundedRect(0.72, screenHeight, iphone ? 0.095 : 0.08),
    [iphone, screenHeight],
  );
  useDispose(body);
  useDispose(bezel);
  useDispose(display);

  // Each screen sits on the previous one and fades in as the scroll reaches it, so the content
  // appears to change as you scroll through the scene rather than cutting.
  useFrame(() => {
    const { s } = props.scene.current;
    const u = s - props.index;
    const f = clamp((u + 0.32) / 0.64, 0, 1) * (screens.length - 1);
    layers.current.forEach((material, k) => {
      if (material) material.opacity = k === 0 ? 1 : clamp(f - (k - 1), 0, 1);
    });
  });

  return (
    <group ref={group}>
      <mesh geometry={body}>
        <meshStandardMaterial
          color={iphone ? palette.titanium : palette.graphite}
          metalness={0.9}
          roughness={iphone ? 0.26 : 0.34}
        />
      </mesh>
      {iphone && (
        <>
          <mesh position={[0.4, 0.3, 0]}>
            <boxGeometry args={[0.014, 0.26, 0.03]} />
            <meshStandardMaterial color={palette.titanium} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[-0.4, 0.42, 0]}>
            <boxGeometry args={[0.014, 0.12, 0.03]} />
            <meshStandardMaterial color={palette.titanium} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[-0.4, 0.22, 0]}>
            <boxGeometry args={[0.014, 0.2, 0.03]} />
            <meshStandardMaterial color={palette.titanium} metalness={0.9} roughness={0.3} />
          </mesh>
        </>
      )}
      <mesh geometry={bezel} position={[0, 0, 0.0452]}>
        <meshBasicMaterial color={palette.black} />
      </mesh>
      {screens.map((texture, k) => (
        <mesh key={k} geometry={display} position={[0, 0, 0.0458 + k * 0.0003]} renderOrder={k + 1}>
          <meshBasicMaterial
            key={texture ? "ready" : "loading"}
            ref={(material) => {
              layers.current[k] = material;
            }}
            map={texture}
            color={texture ? "#ffffff" : palette.black}
            transparent={k > 0}
            opacity={k === 0 ? 1 : 0}
            depthWrite={k === 0}
            toneMapped={false}
          />
        </mesh>
      ))}
      {iphone && (
        <mesh position={[0, screenHeight / 2 - 0.095, 0.0468]} rotation-z={Math.PI / 2} renderOrder={15}>
          <capsuleGeometry args={[0.027, 0.13, 4, 14]} />
          <meshBasicMaterial color={palette.black} />
        </mesh>
      )}
      <Glass geometry={display} z={0.0472} />
    </group>
  );
}
