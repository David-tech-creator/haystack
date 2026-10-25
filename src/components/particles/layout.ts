/**
 * Placement of the scroll formations on screen, per viewport class. Pure
 * helpers used by the engine (no three.js, no DOM writes). Ported from the
 * Rive Foundry engine and retuned for the Haystack shapes.
 *
 * - wide: desktop landscape. Shapes on the right half, copy on the left.
 * - compact: landscape tablets (iPad held sideways) and phones held sideways.
 *   Same idea as wide, but the copy column takes a bigger share of the
 *   width, so each shape is fitted into the free area to the right of it.
 * - portrait: phones and portrait tablets. Shapes in the upper part of the
 *   screen, copy in the lower part; each shape is fitted into the space left
 *   above its section's copy.
 */
import { unpack, type FormationName } from "@/lib/formations/types"

export type LayoutMode = "wide" | "compact" | "portrait"

/** x as a fraction of the half-width, y and scale in world units. */
export type Place = { x: number; y: number; s: number }

/** Shape extent in its local space (before scale), robust to stray dust. */
export type Bounds = { minX: number; maxX: number; minY: number; maxY: number }

/** World-space rectangle (y up, viewport half-height = 1). */
export type Rect = { x0: number; x1: number; y0: number; y1: number }

export function layoutMode(vw: number, vh: number): LayoutMode {
  const aspect = vw / vh
  if (aspect < 0.9) return "portrait"
  if (vw < 1280 || vh < 560) return "compact"
  return "wide"
}

export function defaultPlace(name: FormationName, aspect: number, mode: LayoutMode): Place {
  if (mode === "portrait") {
    const a = aspect
    switch (name) {
      case "haystack":
      case "sweep":
        return { x: 0, y: 0.47, s: Math.min(0.56, a * 0.78) }
      case "needle":
        return { x: 0, y: 0.42, s: Math.min(0.5, a * 0.7) }
      case "thread":
        // portrait tablets: the crest sits in the empty band between the
        // intro and the cards; phones keep it low, under their longer intro
        return { x: 0, y: a > 0.6 ? 0.3 : -0.2, s: 1 }
      case "loose":
        // in the window the FAQ opens with on phones (see globals.css)
        return { x: 0.34, y: 0.63, s: Math.min(0.34, a * 0.56) }
      default:
        return { x: 0, y: 0, s: 1 }
    }
  }
  if (mode === "compact") {
    switch (name) {
      case "haystack":
      case "sweep":
        return { x: 0.55, y: -0.02, s: 0.74 }
      case "needle":
        return { x: 0.56, y: 0, s: 0.72 }
      case "thread":
        return { x: 0, y: 0, s: 1 }
      case "loose":
        return { x: 0.74, y: 0.12, s: 0.6 }
      default:
        return { x: 0, y: 0, s: 1 }
    }
  }
  switch (name) {
    case "haystack":
    case "sweep":
      return { x: 0.5, y: -0.02, s: 0.8 }
    case "needle":
      return { x: 0.52, y: 0, s: 0.8 }
    case "thread":
      return { x: 0, y: 0, s: 1 }
    case "loose":
      return { x: 0.66, y: 0.08, s: 0.75 }
    default:
      return { x: 0, y: 0, s: 1 }
  }
}

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))
  return sorted[i]
}

/**
 * On-screen extent of a built formation in local units. Faint dust is left
 * out (it may drift off screen), and the 0.5th to 99.5th percentile is used so
 * a few stray particles do not shrink the shape.
 */
export function measureBounds(name: FormationName, arr: Float32Array, count: number): Bounds | null {
  if (name === "thread" || name === "stitch" || name === "contact") return null
  const step = Math.max(1, Math.floor(count / 4000))
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i < count; i += step) {
    const o = i * 4
    const { b } = unpack(arr[o + 3])
    if (b < 0.3) continue
    if (name === "loose") {
      // the ball turns: measure it as a sphere
      const r = Math.hypot(arr[o], arr[o + 1], arr[o + 2])
      if (r < 0.4) {
        xs.push(-r, r)
        ys.push(-r, r)
        continue
      }
    }
    xs.push(arr[o])
    ys.push(arr[o + 1])
  }
  if (xs.length < 20) return null
  xs.sort((a, b) => a - b)
  ys.sort((a, b) => a - b)
  return {
    minX: percentile(xs, 0.005),
    maxX: percentile(xs, 0.995),
    minY: percentile(ys, 0.005),
    maxY: percentile(ys, 0.995),
  }
}

/**
 * Fit a shape into a free rectangle: shrink it (never grow it, never below
 * minFrac of its default size) and move it as little as possible from its
 * default position so its bounds stay inside the rectangle. Returns x as a
 * fraction of the half-width, like Place.
 */
export function fitPlace(base: Place, b: Bounds, rect: Rect, aspect: number, minFrac: number): Place {
  const bw = Math.max(1e-3, b.maxX - b.minX)
  const bh = Math.max(1e-3, b.maxY - b.minY)
  const rw = Math.max(1e-3, rect.x1 - rect.x0)
  const rh = Math.max(1e-3, rect.y1 - rect.y0)
  const s = Math.max(base.s * minFrac, Math.min(base.s, rw / bw, rh / bh))
  const keep = (want: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, want)))
  let cx = keep(base.x * aspect, rect.x0 - b.minX * s, rect.x1 - b.maxX * s)
  const cy = keep(base.y, rect.y0 - b.minY * s, rect.y1 - b.maxY * s)
  // whatever happens, keep the shape on screen horizontally when it fits
  const edge = aspect * 0.98
  if (bw * s < edge * 2) cx = Math.min(edge - b.maxX * s, Math.max(-edge - b.minX * s, cx))
  return { x: cx / aspect, y: cy, s }
}
