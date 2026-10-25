import Image from "next/image"
import type { ImageEntry } from "@/lib/images"
import { cn } from "@/lib/utils"

export type FrameRatio = "1/1" | "4/5" | "3/2" | "4/3" | "16/9" | "21/9"

// Literal class strings so Tailwind sees them.
const RATIO: Record<FrameRatio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
}
const RATIO_LG: Record<FrameRatio, string> = {
  "1/1": "lg:aspect-square",
  "4/5": "lg:aspect-[4/5]",
  "3/2": "lg:aspect-[3/2]",
  "4/3": "lg:aspect-[4/3]",
  "16/9": "lg:aspect-video",
  "21/9": "lg:aspect-[21/9]",
}

/** Editorial image: next/image in a fixed-ratio frame (no layout shift), blur placeholder, optional figure label + caption. */
export function Frame({
  image,
  ratio = "3/2",
  ratioLg,
  sizes,
  priority = false,
  position = "50% 50%",
  caption,
  label,
  className,
}: {
  image: ImageEntry
  ratio?: FrameRatio
  ratioLg?: FrameRatio
  sizes: string
  priority?: boolean
  position?: string
  caption?: React.ReactNode
  label?: string
  className?: string
}) {
  return (
    <figure className={className}>
      <div className={cn("frame", RATIO[ratio], ratioLg && RATIO_LG[ratioLg])}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={80}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
      {caption || label ? (
        <figcaption className="frame-caption mt-3 flex gap-3 text-small text-ink-mute">
          {label ? <span className="frame-label">{label}</span> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
