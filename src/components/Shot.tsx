import Image from "next/image";
import images from "@/content/images.json";

export type ShotName = keyof typeof images;

// Dimensions come from scripts/prepare-images.mjs, so they always match the files in public/.
export function Shot({
  name,
  alt,
  sizes,
  className,
  eager = false,
}: {
  name: ShotName;
  alt: string;
  sizes?: string;
  className?: string;
  // Above the fold: load straight away instead of lazily.
  eager?: boolean;
}) {
  const { src, width, height } = images[name];
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      sizes={sizes}
      className={className}
      loading={eager ? "eager" : undefined}
    />
  );
}
