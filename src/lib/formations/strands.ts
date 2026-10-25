/**
 * The Haystack mark, rebuilt from numbers: vertical straws clipped to a
 * circle, slight tilts, a few gaps, and one gold straw right of centre where
 * the logo has it. Deterministic, so the SVG mark (components/ui/haystack-mark.tsx)
 * and the Open Graph images (lib/og.tsx) draw the same haystack.
 *
 * Coordinates are in a unit circle (radius 1, y up).
 */
import { createRng, gauss } from "./random"

export type Strand = { ax: number; ay: number; bx: number; by: number; gold: boolean }

/** Straw thickness in unit-circle space (the logo's straws are about 3% of its width). */
export const STRAND_WIDTH = 0.056

/** Where the gold straw sits (x in the unit circle). */
export const GOLD_X = 0.36

export function haystackStrands(count = 17, seed = 7): Strand[] {
  const rng = createRng(seed)
  const out: Strand[] = []
  const R = 0.985
  const step = 2 / count
  let goldIndex = 0
  let best = 9
  for (let i = 0; i < count; i++) {
    const xc = -1 + (i + 0.5) * step
    if (Math.abs(xc - GOLD_X) < best) {
      best = Math.abs(xc - GOLD_X)
      goldIndex = i
    }
  }

  for (let i = 0; i < count; i++) {
    const gold = i === goldIndex
    const xc = gold ? GOLD_X : -1 + (i + 0.5) * step + (rng() - 0.5) * step * 0.25
    // outer straws lean a little outward at the top, like the logo
    const theta = gold ? 0 : xc * 0.13 + gauss(rng) * 0.035
    const sx = Math.sin(theta)
    const cy = Math.cos(theta)
    const disc = xc * xc * sx * sx - xc * xc + R * R
    if (disc <= 0.01) continue
    const root = Math.sqrt(disc)
    let t0 = -xc * sx - root
    let t1 = -xc * sx + root
    const len = t1 - t0
    if (len < 0.12) continue
    const at = (t: number) => ({ x: xc + t * sx, y: t * cy })
    const push = (a: number, b: number, g = false) => {
      if (b - a < 0.06) return
      const p = at(a)
      const q = at(b)
      out.push({ ax: p.x, ay: p.y, bx: q.x, by: q.y, gold: g })
    }

    if (gold) {
      // navy above, gold through the upper middle, navy below
      push(0.74, t1)
      push(-0.1, 0.64, true)
      push(t0, -0.2)
      continue
    }

    // ragged ends: some straws stop short of the rim
    if (rng() < 0.35) t1 -= rng() * 0.14 * len
    if (rng() < 0.35) t0 += rng() * 0.12 * len
    const r = rng()
    const gaps = r < 0.38 ? 0 : r < 0.84 ? 1 : 2
    const cuts: number[] = []
    for (let g = 0; g < gaps; g++) cuts.push(t0 + (0.18 + rng() * 0.64) * (t1 - t0))
    cuts.sort((a, b) => a - b)
    let from = t0
    for (const c of cuts) {
      const gap = 0.045 + rng() * 0.06
      push(from, c - gap / 2)
      from = c + gap / 2
    }
    push(from, t1)
  }
  return out
}
