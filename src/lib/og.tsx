/**
 * Open Graph images drawn in code (1200x630): cream paper on the left with
 * the strand mark, the page title in Inter Tight and the brand line in
 * Instrument Serif italic; the hero photograph cropped to the right 540px.
 * If the photo is missing the mark is drawn large on the right instead, so
 * builds never fail on an absent asset.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { STRAND_WIDTH, haystackStrands } from "./formations/strands"
import { OG_IMAGE_PATH } from "./images"

export const OG_SIZE = { width: 1200, height: 630 }

const PAPER = "#F6F1E7"
const INK = "#1A2136"
const GOLD = "#C29A3E"
const LINE = "#DDD2BC"
const PHOTO_W = 540

const STRANDS = haystackStrands()
const f = (v: number) => (v * 100).toFixed(2)

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="-104 -104 208 208">
      {STRANDS.map((s, i) => (
        <line
          key={i}
          x1={f(s.ax)}
          y1={f(-s.ay)}
          x2={f(s.bx)}
          y2={f(-s.by)}
          stroke={s.gold ? GOLD : INK}
          strokeWidth={STRAND_WIDTH * 100}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

type Assets = { display: Buffer; serif: Buffer; photo: string | null }
let assets: Promise<Assets> | undefined

function loadAssets(): Promise<Assets> {
  assets ??= (async () => {
    const root = process.cwd()
    const [display, serif, photo] = await Promise.all([
      readFile(join(root, "src/assets/inter-tight-600.woff")),
      readFile(join(root, "src/assets/instrument-serif-italic.woff")),
      readFile(join(root, OG_IMAGE_PATH))
        .then((b) => `data:image/jpeg;base64,${b.toString("base64")}`)
        .catch(() => null),
    ])
    return { display, serif, photo }
  })()
  return assets
}

export async function ogImage(title: string) {
  const { display, serif, photo } = await loadAssets()
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: PAPER,
          fontFamily: "Inter Tight",
          color: INK,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={photo}
            width={PHOTO_W}
            height={630}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: PHOTO_W,
              height: 630,
              objectFit: "cover",
              borderLeft: `1px solid ${LINE}`,
            }}
          />
        ) : (
          <div style={{ position: "absolute", right: 90, top: 105, display: "flex" }}>
            <Mark size={420} />
          </div>
        )}

        <div style={{ position: "absolute", left: 64, top: 64, display: "flex", alignItems: "center" }}>
          <Mark size={44} />
          <div style={{ marginLeft: 14, fontSize: 30, letterSpacing: -0.6 }}>Haystack</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 200,
            width: 560,
            display: "flex",
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 34,
              lineHeight: 1.1,
              paddingBottom: 6,
              borderBottom: `3px solid ${GOLD}`,
            }}
          >
            Move the needle.
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter Tight", data: display, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  )
}
