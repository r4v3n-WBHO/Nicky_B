"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Image that zooms into the point you hover over (like a product magnifier).
 * Fills its parent, so wrap it in a sized/aspect container.
 */
export default function ZoomImage({
  src,
  alt,
  sizes,
  priority = false,
  scale = 2.3,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const [active, setActive] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div
      ref={ref}
      className="relative h-full w-full cursor-zoom-in overflow-hidden"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain p-4 transition-transform duration-150 ease-out will-change-transform"
        style={{ transformOrigin: origin, transform: active ? `scale(${scale})` : "scale(1)" }}
      />
    </div>
  );
}
