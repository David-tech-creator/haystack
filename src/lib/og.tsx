/**
 * Open Graph images drawn in code: cream paper, the strand mark rebuilt from
 * the same numbers as the particle haystack, the page title in Outfit.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { STRAND_WIDTH, haystackStrands } from "./formations/strands"

export const OG_SIZE = { width: 1200, height: 630 }

export async function ogImage(title: string) {
  const outfit = await readFile(join(process.cwd(), "src/assets/outfit-500.woff"))
  const R = 210
  const cx = 930
  const cy = 315
  const strands = haystackStrands()
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f0e2", position: "relative" }}>
        {strands.map((s, i) => {
          const x1 = cx + s.ax * R
          const y1 = cy - s.ay * R
          const x2 = cx + s.bx * R
          const y2 = cy - s.by * R
          const len = Math.hypot(x2 - x1, y2 - y1)
          const w = STRAND_WIDTH * R
          const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (x1 + x2) / 2 - len / 2,
                top: (y1 + y2) / 2 - w / 2,
                width: len,
                height: w,
                borderRadius: w,
                background: s.gold ? "#c9a046" : "#253e5e",
                transform: `rotate(${ang}deg)`,
              }}
            />
          )
        })}
        <div style={{ position: "absolute", left: 80, top: 80, display: "flex", fontSize: 30, color: "#1f2640", letterSpacing: -0.5 }}>
          Haystack
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 190,
            width: 600,
            display: "flex",
            fontSize: 66,
            lineHeight: 1.08,
            color: "#1f2640",
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 80, display: "flex", alignItems: "center", fontSize: 28, color: "#1f2640" }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: "#c9a046", marginRight: 16 }} />
          Move the needle.
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Outfit", data: outfit, weight: 500, style: "normal" }] },
  )
}
