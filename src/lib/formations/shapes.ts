/**
 * Procedural formations for the Haystack particle field. Every builder writes
 * `count` vec4s (xyz + packed w, see types.ts) into a caller-owned
 * Float32Array, so rebuilds (stitch and contact on resize) reuse the same
 * GPU buffer.
 */
import { pack, type RoundRect } from "./types"
import { gauss, type Rng } from "./random"
import { STRAND_WIDTH, haystackStrands, type Strand } from "./strands"

const TAU = Math.PI * 2

/** Haystack radius in local units (shared by haystack and sweep). */
export const STACK_R = 0.85

/* ------------------------------------------------------------------ */
/* Per-particle constants                                              */
/* ------------------------------------------------------------------ */

/** aRand: x phase seed, y arrival delay, z size seed, w gold fleck flag. */
export function buildRandoms(out: Float32Array, count: number, rng: Rng, goldShare = 0.035) {
  for (let i = 0; i < count; i++) {
    const o = i * 4
    out[o] = rng()
    out[o + 1] = rng()
    out[o + 2] = 0.6 + Math.pow(rng(), 3) * 1.2
    out[o + 3] = rng() < goldShare ? 1 : 0
  }
}

/** The loose field (resting state): straw dust spread through a shallow volume. */
export function buildScatter(out: Float32Array, count: number, rng: Rng) {
  for (let i = 0; i < count; i++) {
    const o = i * 3
    out[o] = (rng() * 2 - 1) * 2.6
    out[o + 1] = (rng() * 2 - 1) * 1.5
    out[o + 2] = 0.3 - Math.pow(rng(), 0.6) * 2.6
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function strandPicker(strands: Strand[]) {
  const lens = strands.map((s) => Math.hypot(s.bx - s.ax, s.by - s.ay))
  const total = lens.reduce((a, b) => a + b, 0)
  const cdf: number[] = []
  let acc = 0
  for (const l of lens) {
    acc += l / total
    cdf.push(acc)
  }
  return (r: number) => {
    let lo = 0
    let hi = cdf.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    return strands[lo]
  }
}

const tmp = { x: 0, y: 0, edge: false, right: false, eye: false }

/**
 * One point on a sewing needle lying along +y: point at y = -len/2, head with
 * an eye at y = +len/2. `edge` marks outline particles, `right` the side that
 * catches the gold highlight.
 */
export function needlePoint(rng: Rng, len: number) {
  const hwMax = len * 0.022
  const r = rng()
  if (r < 0.26) {
    // eye: an elongated slot near the head
    const a = rng() * TAU
    const ey = len * 0.36
    const ex = hwMax * 0.42
    const eh = len * 0.075
    tmp.x = Math.cos(a) * ex
    tmp.y = ey + Math.sin(a) * eh
    tmp.edge = true
    tmp.right = Math.cos(a) > 0.3
    tmp.eye = true
    return tmp
  }
  const u = rng()
  const y = -len / 2 + u * len
  let hw = hwMax
  if (u < 0.32) hw = hwMax * Math.pow(u / 0.32, 0.75)
  else if (u > 0.95) hw = hwMax * Math.sqrt(Math.max(0, 1 - ((u - 0.95) / 0.05) ** 2))
  const edge = r < 0.82
  const side = rng() < 0.5 ? -1 : 1
  tmp.x = edge ? side * hw + gauss(rng) * len * 0.0012 : (rng() * 2 - 1) * hw * 0.8
  tmp.y = y
  tmp.edge = edge
  tmp.right = side > 0
  tmp.eye = false
  return tmp
}

/**
 * Point on a rounded rectangle's outline at fraction t (0..1), starting at the
 * middle of the top edge and running clockwise. Writes the tangent too.
 */
export function roundRectPoint(rr: RoundRect, t: number, out: { x: number; y: number; tx: number; ty: number }) {
  const hw = rr.w / 2
  const hh = rr.h / 2
  const r = Math.min(rr.r, hw, hh)
  const sw = rr.w - 2 * r
  const sh = rr.h - 2 * r
  const arc = (Math.PI / 2) * r
  const P = 2 * sw + 2 * sh + 4 * arc
  let d = (((t % 1) + 1) % 1) * P
  const seg = [sw / 2, arc, sh, arc, sw, arc, sh, arc, sw / 2]
  let i = 0
  for (; i < seg.length - 1 && d > seg[i]; i++) d -= seg[i]
  const corner = (cx: number, cy: number, a0: number) => {
    const a = a0 - (r > 0 ? d / r : 0)
    out.x = cx + Math.cos(a) * r
    out.y = cy + Math.sin(a) * r
    out.tx = Math.sin(a)
    out.ty = -Math.cos(a)
  }
  switch (i) {
    case 0:
      out.x = d
      out.y = hh
      out.tx = 1
      out.ty = 0
      break
    case 1:
      corner(hw - r, hh - r, Math.PI / 2)
      break
    case 2:
      out.x = hw
      out.y = hh - r - d
      out.tx = 0
      out.ty = -1
      break
    case 3:
      corner(hw - r, -hh + r, 0)
      break
    case 4:
      out.x = hw - r - d
      out.y = -hh
      out.tx = -1
      out.ty = 0
      break
    case 5:
      corner(-hw + r, -hh + r, -Math.PI / 2)
      break
    case 6:
      out.x = -hw
      out.y = -hh + r + d
      out.tx = 0
      out.ty = 1
      break
    case 7:
      corner(-hw + r, hh - r, Math.PI)
      break
    default:
      out.x = -hw + r + d
      out.y = hh
      out.tx = 1
      out.ty = 0
  }
  out.x += rr.cx
  out.y += rr.cy
  return P
}

export function roundRectPerimeter(rr: RoundRect) {
  const r = Math.min(rr.r, rr.w / 2, rr.h / 2)
  return 2 * (rr.w - 2 * r) + 2 * (rr.h - 2 * r) + TAU * r
}

const rp = { x: 0, y: 0, tx: 0, ty: 0 }

/**
 * A t along the outline that falls on a stitch (dash), not in a gap.
 * dash and gap are in world units.
 */
function stitchT(rng: Rng, perim: number, dash: number, gap: number) {
  const period = dash + gap
  const n = Math.max(1, Math.floor(perim / period))
  const k = Math.floor(rng() * n)
  return (k * (perim / n) + rng() * dash) / perim
}

/* ------------------------------------------------------------------ */
/* 1. haystack and 2. sweep                                            */
/* ------------------------------------------------------------------ */

function fillStack(out: Float32Array, from: number, to: number, rng: Rng, strands: Strand[]) {
  const pick = strandPicker(strands)
  const half = (STRAND_WIDTH * STACK_R) / 2
  for (let i = from; i < to; i++) {
    const o = i * 4
    const s = pick(rng())
    const t = rng()
    const dx = s.bx - s.ax
    const dy = s.by - s.ay
    const l = Math.hypot(dx, dy) || 1
    const nx = -dy / l
    const ny = dx / l
    const lat = (rng() * 2 - 1) * half + gauss(rng) * half * 0.12
    out[o] = (s.ax + dx * t) * STACK_R + nx * lat
    out[o + 1] = (s.ay + dy * t) * STACK_R + ny * lat
    out[o + 2] = gauss(rng) * 0.012
    out[o + 3] = s.gold ? pack(1.25 + rng() * 0.2, 1) : pack(0.82 + rng() * 0.3)
  }
}

function fillDust(out: Float32Array, from: number, to: number, rng: Rng, rx: number, ry: number, b0 = 0.1, b1 = 0.12) {
  for (let i = from; i < to; i++) {
    const o = i * 4
    out[o] = (rng() * 2 - 1) * rx
    out[o + 1] = (rng() * 2 - 1) * ry
    out[o + 2] = -0.5 + rng() * 0.6
    out[o + 3] = pack(b0 + rng() * b1)
  }
}

export function buildHaystack(out: Float32Array, count: number, rng: Rng) {
  const strands = haystackStrands()
  const body = Math.floor(count * 0.92)
  fillStack(out, 0, body, rng, strands)
  fillDust(out, body, count, rng, STACK_R * 1.35, STACK_R * 1.2)
}

/** The stack again, plus a vertical search line (special 1) the shader slides across. */
export function buildSweep(out: Float32Array, count: number, rng: Rng) {
  const strands = haystackStrands()
  const body = Math.floor(count * 0.85)
  const band = Math.floor(count * 0.09)
  fillStack(out, 0, body, rng, strands)
  for (let i = body; i < body + band; i++) {
    const o = i * 4
    out[o] = gauss(rng) * 0.006
    out[o + 1] = (rng() * 2 - 1) * STACK_R * 1.12
    out[o + 2] = gauss(rng) * 0.01
    out[o + 3] = pack(1.0 + rng() * 0.25, 0, 1)
  }
  fillDust(out, body + band, count, rng, STACK_R * 1.35, STACK_R * 1.2)
}

/* ------------------------------------------------------------------ */
/* 3. needle: the gold straw lifts out of a settled pile               */
/* ------------------------------------------------------------------ */

export const NEEDLE_LEN = 1.45
export const NEEDLE_TILT = -0.2

export function buildNeedle(out: Float32Array, count: number, rng: Rng) {
  const nNeedle = Math.floor(count * 0.14)
  const nPile = Math.floor(count * 0.58)
  const c = Math.cos(NEEDLE_TILT)
  const s = Math.sin(NEEDLE_TILT)
  for (let i = 0; i < nNeedle; i++) {
    const o = i * 4
    const p = needlePoint(rng, NEEDLE_LEN)
    const x = p.x
    const y = p.y + 0.12
    out[o] = c * x - s * y
    out[o + 1] = s * x + c * y
    out[o + 2] = gauss(rng) * 0.006
    const gold = p.edge && p.right && rng() < 0.7 ? 1 : 0
    out[o + 3] = pack(p.edge ? 1.05 + rng() * 0.2 : 0.55, gold, 1)
  }
  // a low pile of loose straws along the bottom
  const straws: Array<[number, number, number, number]> = []
  for (let k = 0; k < 170; k++) {
    const cx = (rng() * 2 - 1) * 1.05
    const H = 0.36 * Math.max(0, 1 - (cx / 1.12) ** 2)
    const cy = -0.92 + Math.pow(rng(), 0.8) * H
    const a = (rng() - 0.5) * 1.5
    const l = 0.07 + rng() * 0.15
    straws.push([cx, cy, a, l])
  }
  for (let i = nNeedle; i < nNeedle + nPile; i++) {
    const o = i * 4
    const [cx, cy, a, l] = straws[Math.floor(rng() * straws.length)]
    const t = (rng() - 0.5) * l
    out[o] = cx + Math.cos(a) * t + gauss(rng) * 0.003
    out[o + 1] = cy + Math.sin(a) * t + gauss(rng) * 0.003
    out[o + 2] = gauss(rng) * 0.05
    out[o + 3] = pack(0.36 + rng() * 0.22)
  }
  fillDust(out, nNeedle + nPile, count, rng, 1.25, 1.0)
}

/* ------------------------------------------------------------------ */
/* 4. thread: a running stitch across the dark section                 */
/* ------------------------------------------------------------------ */

export const THREAD_AMP = 0.2
export const threadY = (x: number, aspect: number) => THREAD_AMP * Math.sin((x / aspect) * Math.PI * 1.25 + 0.5)

/**
 * Built for the current aspect (rebuilt on resize) so the needle at the end
 * keeps its proportions. The shader cuts the line into travelling dashes.
 */
export function buildThread(out: Float32Array, count: number, rng: Rng, aspect: number) {
  const x0 = -aspect * 1.02
  const x1 = aspect * 0.62
  const nThread = Math.floor(count * 0.5)
  const nNeedle = Math.floor(count * 0.06)
  for (let i = 0; i < nThread; i++) {
    const o = i * 4
    const x = x0 + rng() * (x1 - x0)
    out[o] = x
    out[o + 1] = threadY(x, aspect) + gauss(rng) * 0.0035
    out[o + 2] = gauss(rng) * 0.006
    out[o + 3] = pack(1.15 + rng() * 0.2, 1, 1)
  }
  // the needle leads the thread, eye first, along the curve's tangent
  const ey = threadY(x1, aspect)
  const dy = threadY(x1 + 0.01, aspect) - ey
  const ang = Math.atan2(dy, 0.01) - Math.PI / 2
  const len = 0.34
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  for (let i = nThread; i < nThread + nNeedle; i++) {
    const o = i * 4
    const p = needlePoint(rng, len)
    // eye at the thread end: shift so the eye sits on (x1, ey)
    const lx = p.x
    const ly = p.y - len * 0.36
    out[o] = x1 + (c * lx - s * ly) * -1
    out[o + 1] = ey + (s * lx + c * ly) * -1
    out[o + 2] = 0
    out[o + 3] = pack(p.edge ? 1.15 : 0.6, p.edge && p.right ? 1 : 0, 2)
  }
  fillDust(out, nThread + nNeedle, count, rng, aspect * 1.05, 1.05, 0.12, 0.16)
}

/* ------------------------------------------------------------------ */
/* 5. stitch: the thread sews around the three shortlist cards         */
/* ------------------------------------------------------------------ */

export const STITCH_DASH = 0.032
export const STITCH_GAP = 0.02
export const LEAD_LEN = 0.13

/**
 * cards: outlines in local units (relative to the group centre). Outline
 * particles carry s = card index + fraction along that card's outline in z
 * (the shader draws them in order); the lead needle (special 2) is placed on
 * the current stitch point by the uLead uniform.
 */
export function buildStitch(out: Float32Array, count: number, rng: Rng, cards: RoundRect[]) {
  const perims = cards.map(roundRectPerimeter)
  const total = perims.reduce((a, b) => a + b, 0) || 1
  const nLine = Math.floor(count * 0.66)
  const nLead = Math.floor(count * 0.05)
  for (let i = 0; i < nLine; i++) {
    const o = i * 4
    let r = rng() * total
    let c = 0
    while (c < cards.length - 1 && r > perims[c]) r -= perims[c++]
    const t = stitchT(rng, perims[c], STITCH_DASH, STITCH_GAP)
    roundRectPoint(cards[c], t, rp)
    const n = gauss(rng) * 0.0022
    out[o] = rp.x + rp.ty * n
    out[o + 1] = rp.y - rp.tx * n
    out[o + 2] = c + Math.min(0.999, t)
    out[o + 3] = pack(0.9 + rng() * 0.2, 1, 1)
  }
  for (let i = nLine; i < nLine + nLead; i++) {
    const o = i * 4
    const p = needlePoint(rng, LEAD_LEN)
    // lying along +x, point first
    out[o] = p.y * -1
    out[o + 1] = p.x
    out[o + 2] = 0
    out[o + 3] = pack(p.edge ? 1.2 : 0.6, p.edge && p.right ? 1 : 0, 2)
  }
  // faint dust around the group
  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0
  for (const rr of cards) {
    minX = Math.min(minX, rr.cx - rr.w / 2)
    maxX = Math.max(maxX, rr.cx + rr.w / 2)
    minY = Math.min(minY, rr.cy - rr.h / 2)
    maxY = Math.max(maxY, rr.cy + rr.h / 2)
  }
  for (let i = nLine + nLead; i < count; i++) {
    const o = i * 4
    out[o] = minX - 0.15 + rng() * (maxX - minX + 0.3)
    out[o + 1] = minY - 0.15 + rng() * (maxY - minY + 0.3)
    out[o + 2] = -0.4 + rng() * 0.4
    out[o + 3] = pack(0.08 + rng() * 0.1)
  }
}

/* ------------------------------------------------------------------ */
/* 6. loose: the thread relaxes into a small ball                      */
/* ------------------------------------------------------------------ */

export function buildLoose(out: Float32Array, count: number, rng: Rng) {
  const R = 0.34
  const loops: Array<[number, number, number, number, number, number]> = []
  for (let k = 0; k < 16; k++) {
    // random orthonormal pair for one wrap around the ball
    const u = rng() * TAU
    const v = Math.acos(rng() * 2 - 1)
    const ax = Math.sin(v) * Math.cos(u)
    const ay = Math.sin(v) * Math.sin(u)
    const az = Math.cos(v)
    let bx = -ay
    let by = ax
    let bz = 0
    const bl = Math.hypot(bx, by, bz) || 1
    bx /= bl
    by /= bl
    bz /= bl
    // c = a x b
    loops.push([bx, by, bz, ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx])
  }
  const nBall = Math.floor(count * 0.58)
  const nTail = Math.floor(count * 0.08)
  for (let i = 0; i < nBall; i++) {
    const o = i * 4
    const L = loops[Math.floor(rng() * loops.length)]
    const a = rng() * TAU
    const rr = R * (0.93 + rng() * 0.1)
    out[o] = (L[0] * Math.cos(a) + L[3] * Math.sin(a)) * rr
    out[o + 1] = (L[1] * Math.cos(a) + L[4] * Math.sin(a)) * rr
    out[o + 2] = (L[2] * Math.cos(a) + L[5] * Math.sin(a)) * rr
    out[o + 3] = pack(0.3 + rng() * 0.14, 1, 1)
  }
  // a loose end trailing off to the lower left
  for (let i = nBall; i < nBall + nTail; i++) {
    const o = i * 4
    const t = rng()
    out[o] = -R * 0.7 - t * 0.45
    out[o + 1] = -R * 0.75 - Math.sin(t * Math.PI) * 0.12 - t * 0.16
    out[o + 2] = gauss(rng) * 0.004
    out[o + 3] = pack(0.3 + rng() * 0.1, 1)
  }
  fillDust(out, nBall + nTail, count, rng, 1.4, 1.1, 0.06, 0.08)
}

/* ------------------------------------------------------------------ */
/* 7. contact: a stitched outline, a gold knot and the needle parked   */
/* ------------------------------------------------------------------ */

/**
 * flip: no room to the right of the box (phones), so the needle parks under
 * the box instead, lying almost flat and pointing left.
 */
export function buildContact(out: Float32Array, count: number, rng: Rng, box: RoundRect, flip = false) {
  const perim = roundRectPerimeter(box)
  const nLine = Math.floor(count * 0.6)
  const nKnot = Math.floor(count * 0.07)
  const nNeedle = Math.floor(count * 0.08)
  const nTail = Math.floor(count * 0.04)
  for (let i = 0; i < nLine; i++) {
    const o = i * 4
    const t = stitchT(rng, perim, STITCH_DASH, STITCH_GAP)
    roundRectPoint(box, t, rp)
    const n = gauss(rng) * 0.0022
    out[o] = rp.x + rp.ty * n
    out[o + 1] = rp.y - rp.tx * n
    out[o + 2] = gauss(rng) * 0.004
    out[o + 3] = pack(0.9 + rng() * 0.2, 1)
  }
  // knot at the bottom right corner, clear of the heading above
  const kx = box.w / 2 + 0.01
  const ky = -box.h / 2 - 0.01
  let i = nLine
  for (; i < nLine + nKnot; i++) {
    const o = i * 4
    const a = rng() * TAU
    const d = Math.abs(gauss(rng)) * 0.011
    out[o] = kx + Math.cos(a) * d
    out[o + 1] = ky + Math.sin(a) * d
    out[o + 2] = 0
    out[o + 3] = pack(1.3 + rng() * 0.2, 1, 1)
  }
  // a short tail from the knot down to the needle's eye
  const len = 0.2
  const ang = flip ? 1.671 : -2.25
  const ex = flip ? kx - 0.03 : kx + 0.05
  const ey = flip ? ky - 0.012 : ky - 0.05
  for (; i < nLine + nKnot + nTail; i++) {
    const o = i * 4
    const t = rng()
    out[o] = kx + (ex - kx) * t + Math.sin(t * Math.PI) * 0.012
    out[o + 1] = ky + (ey - ky) * t
    out[o + 2] = 0
    out[o + 3] = pack(1.15, 1)
  }
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  for (; i < nLine + nKnot + nTail + nNeedle; i++) {
    const o = i * 4
    const p = needlePoint(rng, len)
    // eye on (ex, ey), body pointing down and to the right
    const lx = p.x
    const ly = -(p.y - len * 0.36)
    out[o] = ex + c * lx - s * ly
    out[o + 1] = ey + s * lx + c * ly
    out[o + 2] = 0
    out[o + 3] = pack(p.edge ? 1.15 : 0.6, p.edge && p.right ? 1 : 0)
  }
  for (; i < count; i++) {
    const o = i * 4
    const a = rng() * TAU
    const d = 1 + Math.abs(gauss(rng)) * 0.5
    out[o] = Math.cos(a) * (box.w / 2 + 0.08) * d
    out[o + 1] = Math.sin(a) * (box.h / 2 + 0.08) * d
    out[o + 2] = -0.2 - rng() * 0.6
    out[o + 3] = pack(0.05 + rng() * 0.06)
  }
}
