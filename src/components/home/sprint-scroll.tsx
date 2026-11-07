"use client"

import { useEffect, useRef, useState } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SPRINT, STEPS } from "@/lib/content"
import styles from "./sprint-scroll.module.css"

/**
 * "How it works": the five sprint steps as one pinned scroll scene.
 *
 * A sticky navy stage inside a tall track. Left, the five steps (the active
 * one lit, its text open). Right, a viewfinder: a haystack of thin cream
 * strands drifts; a gold scan line sweeps and the strands snap into a grid of
 * dots; most of them fade, a few remain, a short row, then one gold dot with
 * a ring, locked in the brackets.
 *
 * The tall track and the pinning are CSS, gated on
 * `(scripting: enabled) and (prefers-reduced-motion: no-preference)`, so the
 * server HTML already has the right height. Without JavaScript or with
 * reduced motion there is no track: every step is listed and the field shows
 * its final state as a static SVG.
 *
 * The canvas is drawn only while the section is on screen, only when the
 * scroll progress changes, plus a gentle drift of the strands (capped at
 * 30fps) while the haystack is still visible. DPR is capped at 2; glows are
 * pre-rendered once, never shadowBlur.
 */

const LIVE_QUERY = "(scripting: enabled) and (prefers-reduced-motion: no-preference)"
const COUNT = STEPS.length

export function SprintScroll() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY)
    const onChange = () => setLive(query.matches)
    onChange()
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!live) return
    const track = trackRef.current
    const stage = stageRef.current
    const box = fieldRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!track || !stage || !box || !canvas || !ctx) return

    let field: Field | null = null
    let sprites: Sprites | null = null
    let raf = 0
    let visible = false
    let lastP = -1
    let lastDraw = 0
    let lastActive = -1
    let stickTop = 0

    const progress = () => {
      const rect = track.getBoundingClientRect()
      const travel = rect.height - stage.offsetHeight
      return travel > 0 ? clamp((stickTop - rect.top) / travel) : 0
    }

    const tick = (now: number) => {
      raf = 0
      if (!visible || !field || !sprites) return
      const p = progress()
      const drifting = p < DRIFT_UNTIL
      const due = drifting && now - lastDraw >= 1000 / 30 - 1
      if (p !== lastP || due) {
        render(ctx, field, sprites, p, now / 1000)
        lastDraw = now
        if (p !== lastP) {
          lastP = p
          if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`
          const a = Math.min(COUNT - 1, Math.floor(p * COUNT))
          if (a !== lastActive) {
            lastActive = a
            setActive(a)
          }
        }
      }
      // Keep a cheap idle loop only while the strands are still drifting.
      if (drifting) raf = requestAnimationFrame(tick)
    }
    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(tick)
    }

    const resize = () => {
      const w = box.clientWidth
      const h = box.clientHeight
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      field = buildField(w, h)
      sprites = buildSprites(dpr)
      stickTop = parseFloat(getComputedStyle(stage).top) || 0
      lastP = -1
      schedule()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          lastP = -1
          schedule()
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { rootMargin: "120px 0px" },
    )
    io.observe(track)
    const ro = new ResizeObserver(resize)
    ro.observe(box)
    window.addEventListener("scroll", schedule, { passive: true })
    resize()

    return () => {
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("scroll", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [live])

  return (
    <section aria-labelledby="sprint-title" data-tone="deep" data-live={live ? "" : undefined} className={styles.section}>
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <div className={`wrap ${styles.grid}`}>
            <div className={styles.copy}>
              <div className={styles.head}>
                <Eyebrow index="02">{SPRINT.eyebrow}</Eyebrow>
                <h2 id="sprint-title" className="mt-3 text-h2 font-medium lg:mt-4">
                  {SPRINT.title}
                </h2>
                <p className={`${styles.intro} text-lead text-on-deep-soft`}>{SPRINT.intro}</p>
              </div>

              <div aria-hidden="true" className={styles.ticks}>
                {STEPS.map((s, i) => (
                  <span key={s.title} className={styles.tick} data-on={i <= active ? "" : undefined} />
                ))}
              </div>

              <div className={styles.steps}>
                <span aria-hidden="true" className={styles.rail}>
                  <span ref={railRef} className={styles.railFill} />
                </span>
                <ol className={styles.items}>
                  {STEPS.map((s, i) => (
                    <li
                      key={s.title}
                      className={styles.item}
                      data-on={i === active ? "" : undefined}
                      aria-current={live && i === active ? "step" : undefined}
                    >
                      <h3 className={styles.title}>
                        <span className={styles.num} aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.title}
                      </h3>
                      <div className={styles.body}>
                        <p className="text-small text-on-deep-soft">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div ref={fieldRef} className={styles.field}>
              <FinalFrame />
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The end state as plain SVG, for no-JS and reduced motion: one gold dot, ringed, in the brackets. */
function FinalFrame() {
  const row = [-2, -1, 1, 2]
  const L = 22
  const b = { x0: 116, y0: 116, x1: 284, y1: 284 }
  return (
    <svg className={styles.final} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="sprint-grain" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1.1" fill="#F6F1E7" fillOpacity="0.09" />
        </pattern>
        <radialGradient id="sprint-glow">
          <stop offset="0" stopColor="#E6C77A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#E6C77A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="24" y="24" width="352" height="352" fill="url(#sprint-grain)" />
      {row.map((k) => (
        <circle key={k} cx={200 + k * 62} cy="200" r="3.4" fill="#F6F1E7" fillOpacity="0.28" />
      ))}
      <circle cx="200" cy="200" r="54" fill="url(#sprint-glow)" />
      <circle cx="200" cy="200" r="34" fill="none" stroke="#E6C77A" strokeOpacity="0.95" />
      <path
        d="M200 157v-12M200 243v12M157 200h-12M243 200h12"
        stroke="#E6C77A"
        strokeOpacity="0.7"
        fill="none"
      />
      <circle cx="200" cy="200" r="7.5" fill="#E6C77A" />
      <path
        d={`M${b.x0} ${b.y0 + L}V${b.y0}H${b.x0 + L}M${b.x1 - L} ${b.y0}H${b.x1}V${b.y0 + L}M${b.x1} ${b.y1 - L}V${b.y1}H${b.x1 - L}M${b.x0 + L} ${b.y1}H${b.x0}V${b.y1 - L}`}
        stroke="#E6C77A"
        strokeOpacity="0.75"
        fill="none"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------------ */
/* The field: five keyframes per particle, interpolated by scroll.          */
/* A particle is a stroked segment with round caps: a long thin one is a    */
/* strand of hay, a zero-length one is a dot. One code path for both.       */
/* ------------------------------------------------------------------------ */

type Frame = {
  x: Float32Array
  y: Float32Array
  a: Float32Array // alpha
  w: Float32Array // stroke width (dot diameter)
  l: Float32Array // half length (0 = dot)
  d: Float32Array // delay into the transition that ends here
}
type Box = { x: number; y: number; w: number; h: number }
type Field = {
  n: number
  w: number
  h: number
  s: number
  rank: Uint16Array
  ang: Float32Array
  ph: Float32Array
  f1: Float32Array
  f2: Float32Array
  k: Frame[]
  box: Box[]
  row: { half: number; y: number }
  hire: { x: number; y: number; R: number }
}
type Sprites = { scan: HTMLCanvasElement; glow: HTMLCanvasElement }

const CREAM = [246, 241, 231] as const
const GOLD = [230, 199, 122] as const
/** How long each particle takes to move, per target step (a fraction of the transition). */
const SPAN = [0, 0.36, 0.5, 0.5, 0.5]
/** Where the Sourcing scan line has finished its sweep (fraction of the transition). */
const SWEEP = 0.62
/** Transition windows straddle each step boundary. */
const LEAD = 0.075
const WIN = 0.16
/** Strands drift until Sourcing has turned them all into dots. */
const DRIFT_UNTIL = 1 / COUNT - LEAD + WIN

function clamp(v: number, lo = 0, hi = 1) {
  return v < lo ? lo : v > hi ? hi : v
}
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function frame(n: number): Frame {
  const f = () => new Float32Array(n)
  return { x: f(), y: f(), a: f(), w: f(), l: f(), d: f() }
}

function buildField(w: number, h: number): Field {
  const rand = rng(11)
  const small = Math.min(w, h)
  const s = clamp(small / 560, 0.72, 1.25)
  const pad = small * 0.07
  const fx = pad
  const fy = pad
  const fw = w - pad * 2
  const fh = h - pad * 2
  const cx = w / 2
  const cy = h / 2

  // A perfect grid at Sourcing, so the count follows the shape of the box.
  const target = clamp((fw * fh) / (w < 640 ? 300 : 440), 180, 640)
  const cols = Math.max(8, Math.round(Math.sqrt((target * fw) / fh)))
  const rows = Math.max(6, Math.round(target / cols))
  const n = cols * rows
  const cw = fw / cols
  const ch = fh / rows

  const rank = new Uint16Array(n)
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  for (let i = 0; i < n; i++) rank[order[i]] = i

  const ang = new Float32Array(n)
  const ph = new Float32Array(n)
  const f1 = new Float32Array(n)
  const f2 = new Float32Array(n)
  const k = [frame(n), frame(n), frame(n), frame(n), frame(n)]
  const [k0, k1, k2, k3, k4] = k

  // From Signals on, everything is drawn about 1.5x larger so the field stays full.
  const U = 1.5

  // Signals: the survivors regroup into a block in the middle.
  const want = Math.max(24, Math.round(n * 0.09))
  const c2 = Math.max(4, Math.round(Math.sqrt((want * fw) / fh)))
  const r2 = Math.max(3, Math.round(want / c2))
  const m2 = c2 * r2
  const g2 = Math.min((fw * 0.8) / c2, (fh * 0.8) / r2)
  const b2x = cx - (g2 * (c2 - 1)) / 2
  const b2y = cy - (g2 * (r2 - 1)) / 2

  // Shortlist: the hire in the middle, the others either side.
  const slots = [0, -1, 1, -2, 2]
  const gap = Math.min(fw / 4.6, 120 * U * s)
  const R = 24 * U * s

  const strand = Math.min(cw, ch)
  for (let i = 0; i < n; i++) {
    const rk = rank[i]
    const col = i % cols
    const row = Math.floor(i / cols)

    // Profile: a haystack. Thin strands at random angles, a little denser and
    // brighter in the middle, softer towards the edge of the frame.
    const sx = fx + (col + 0.5 + (rand() - 0.5) * 1.6) * cw
    const sy = fy + (row + 0.5 + (rand() - 0.5) * 1.6) * ch
    const ex = (sx - cx) / (fw / 2)
    const ey = (sy - cy) / (fh / 2)
    const edge = 1 - clamp((Math.hypot(ex, ey) - 0.55) / 0.6)
    ang[i] = rand() * Math.PI
    ph[i] = rand() * Math.PI * 2
    f1[i] = 0.35 + rand() * 0.4
    f2[i] = 0.3 + rand() * 0.35
    k0.x[i] = sx
    k0.y[i] = sy
    k0.a[i] = (0.16 + rand() * 0.34) * (0.35 + 0.65 * edge)
    k0.w[i] = (0.8 + rand() * 0.6) * s
    k0.l[i] = strand * (0.28 + rand() * 0.42)

    // Sourcing: sorted into a grid, best first, brightness by rank. Each one
    // snaps as the scan line reaches it.
    const gx = fx + ((rk % cols) + 0.5) * cw
    const gy = fy + (Math.floor(rk / cols) + 0.5) * ch
    k1.x[i] = gx
    k1.y[i] = gy
    k1.a[i] = 0.85 - 0.6 * Math.pow(rk / n, 0.7)
    k1.w[i] = 2.7 * s
    k1.l[i] = 0
    k1.d[i] = SWEEP * clamp((sy - fy) / fh)

    // Signals: survivors regroup, the rest ease outward and go quiet.
    const dx = gx - cx
    const dy = gy - cy
    const len = Math.hypot(dx, dy) || 1
    const push = (0.015 + rand() * 0.035) * small
    if (rk < m2) {
      k2.x[i] = b2x + (rk % c2) * g2
      k2.y[i] = b2y + Math.floor(rk / c2) * g2
      k2.a[i] = 0.95 - 0.4 * (rk / m2)
      k2.w[i] = 2.1 * 2 * U * 0.9 * s
    } else {
      k2.x[i] = gx + (dx / len) * push
      k2.y[i] = gy + (dy / len) * push
      k2.a[i] = 0.14
      k2.w[i] = 2.2 * s
    }
    k2.l[i] = 0
    k2.d[i] = (SPAN[2] * (gx - fx)) / fw

    // Shortlist: a few in a row, the other survivors fall away.
    if (rk < slots.length) {
      k3.x[i] = cx + slots[rk] * gap
      k3.y[i] = cy
      k3.a[i] = 1
      k3.w[i] = 8 * U * s
      k3.d[i] = SPAN[3] * 0.6 + rand() * SPAN[3] * 0.4
    } else if (rk < m2) {
      const qx = k2.x[i] - cx
      const qy = k2.y[i] - cy
      const ql = Math.hypot(qx, qy) || 1
      const pp = (0.03 + rand() * 0.04) * small
      k3.x[i] = k2.x[i] + (qx / ql) * pp
      k3.y[i] = k2.y[i] + (qy / ql) * pp
      k3.a[i] = 0.13
      k3.w[i] = 2.4 * s
      k3.d[i] = rand() * SPAN[3] * 0.6
    } else {
      k3.x[i] = k2.x[i]
      k3.y[i] = k2.y[i]
      k3.a[i] = 0.13
      k3.w[i] = k2.w[i]
      k3.d[i] = 0
    }
    k3.l[i] = 0

    // Offer: one stays and turns gold, the others step back.
    if (rk === 0) {
      k4.x[i] = cx
      k4.y[i] = cy
      k4.a[i] = 1
      k4.w[i] = 11 * U * s
      k4.d[i] = 0.1
    } else if (rk < slots.length) {
      k4.x[i] = cx + slots[rk] * gap * 1.08
      k4.y[i] = cy
      k4.a[i] = 0.28
      k4.w[i] = 5 * U * s
      k4.d[i] = 0
    } else {
      k4.x[i] = k3.x[i]
      k4.y[i] = k3.y[i]
      k4.a[i] = 0.11
      k4.w[i] = k3.w[i]
      k4.d[i] = 0
    }
    k4.l[i] = 0
  }

  const m = 18 * s
  const M = m * U
  const outer = { x: fx - m * 0.4, y: fy - m * 0.4, w: fw + m * 0.8, h: fh + m * 0.8 }
  const box: Box[] = [
    outer,
    outer,
    { x: b2x - M * 1.4, y: b2y - M * 1.4, w: g2 * (c2 - 1) + M * 2.8, h: g2 * (r2 - 1) + M * 2.8 },
    { x: cx - 2 * gap - M * 1.4, y: cy - M * 1.8, w: 4 * gap + M * 2.8, h: M * 3.6 },
    { x: cx - R - M * 1.3, y: cy - R - M * 1.3, w: (R + M * 1.3) * 2, h: (R + M * 1.3) * 2 },
  ]

  return { n, w, h, s, rank, ang, ph, f1, f2, k, box, row: { half: 2 * gap, y: cy + M * 1.1 }, hire: { x: cx, y: cy, R } }
}

/** Glow textures, drawn once per size change: the scan line profile and the soft halo behind the hire. */
function buildSprites(dpr: number): Sprites {
  // Scan profile, 1 wide and 64 tall in CSS px: a faint trail above, a soft 2px glow, a bright core.
  const scan = document.createElement("canvas")
  const H = 64
  scan.width = 1
  scan.height = Math.round(H * dpr)
  const sc = scan.getContext("2d")
  if (sc) {
    sc.scale(1, dpr)
    const trail = sc.createLinearGradient(0, 0, 0, H - 4)
    trail.addColorStop(0, "rgba(230,199,122,0)")
    trail.addColorStop(1, "rgba(230,199,122,0.16)")
    sc.fillStyle = trail
    sc.fillRect(0, 0, 1, H - 4)
    const glow = sc.createLinearGradient(0, H - 8, 0, H)
    glow.addColorStop(0, "rgba(230,199,122,0)")
    glow.addColorStop(0.5, "rgba(230,199,122,0.45)")
    glow.addColorStop(1, "rgba(230,199,122,0)")
    sc.fillStyle = glow
    sc.fillRect(0, H - 8, 1, 8)
    sc.fillStyle = "rgba(240,215,150,0.9)"
    sc.fillRect(0, H - 4.6, 1, 1.2)
  }

  const glow = document.createElement("canvas")
  glow.width = glow.height = 128
  const gc = glow.getContext("2d")
  if (gc) {
    const g = gc.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, "rgba(230,199,122,0.42)")
    g.addColorStop(0.45, "rgba(230,199,122,0.12)")
    g.addColorStop(1, "rgba(230,199,122,0)")
    gc.fillStyle = g
    gc.fillRect(0, 0, 128, 128)
  }
  return { scan, glow }
}

/** Transition windows sit across each step boundary, so the label and the field change together. */
function phase(p: number) {
  let to = 0
  for (let j = 1; j < COUNT; j++) if (p >= j / COUNT - LEAD) to = j
  if (to === 0) return { from: 0, to: 0, s: 1 }
  const s = clamp((p - (to / COUNT - LEAD)) / WIN)
  return s < 1 ? { from: to - 1, to, s } : { from: to, to, s: 1 }
}

/** One pass of the gold scan line across a box: down (Sourcing) or across (Signals, Shortlist). */
function sweep(ctx: CanvasRenderingContext2D, sp: Sprites, b: Box, t: number, across: boolean, peak: number) {
  if (t <= 0 || t >= 1) return
  const alpha = Math.min(1, Math.sin(Math.PI * t) * 1.6) * peak
  ctx.globalAlpha = alpha
  const H = 64
  if (!across) {
    const y = mix(b.y, b.y + b.h, t)
    ctx.drawImage(sp.scan, b.x, y - H + 4, b.w, H)
  } else {
    const x = mix(b.x, b.x + b.w, t)
    ctx.save()
    ctx.translate(x, b.y + b.h)
    ctx.rotate(-Math.PI / 2)
    // after the rotation, the profile's "down" points to the right
    ctx.drawImage(sp.scan, 0, -H + 4, b.h, H)
    ctx.restore()
  }
}

function render(ctx: CanvasRenderingContext2D, f: Field, sp: Sprites, p: number, time: number) {
  const { from, to, s } = phase(p)
  const A = f.k[from]
  const B = f.k[to]
  const span = SPAN[to]
  const g = ease(s)
  ctx.clearRect(0, 0, f.w, f.h)

  // Viewfinder: corner brackets that close in on the search, step by step.
  const ba = f.box[from]
  const bb = f.box[to]
  const bx = mix(ba.x, bb.x, g)
  const by = mix(ba.y, bb.y, g)
  const bw = mix(ba.w, bb.w, g)
  const bh = mix(ba.h, bb.h, g)
  const goldness = to === 4 ? g : 0
  brackets(ctx, bx, by, bw, bh, Math.min(bw, bh) * 0.14, goldness, f.s)

  // Scan lines: Sourcing sweeps down, Signals across, a quick pass at Shortlist.
  if (from !== to) {
    if (to === 1) sweep(ctx, sp, ba, s / SWEEP, false, 0.95)
    else if (to === 2) sweep(ctx, sp, ba, s / (SPAN[2] + 0.08), true, 0.9)
    else if (to === 3) sweep(ctx, sp, ba, s / 0.42, true, 0.85)
  }

  // Shortlist hairline under the row.
  const rowIn = to >= 3 ? (from === 2 ? ease(clamp((s - 0.5) / 0.5)) : 1) : 0
  if (rowIn > 0) {
    const fade = to === 4 ? mix(1, 0.3, g) : 1
    const half = f.row.half * rowIn
    ctx.globalAlpha = 0.22 * fade
    ctx.fillStyle = "rgb(246,241,231)"
    ctx.fillRect(f.hire.x - half, f.row.y, half * 2, 1)
  }

  // Particles, batched into one path per (alpha, width) bucket.
  const drift = to <= 1
  const buckets = new Map<number, Path2D>()
  let hire = -1
  let hireT = 0
  for (let i = 0; i < f.n; i++) {
    const t = from === to ? 1 : ease(clamp((s - B.d[i]) / span))
    const a = mix(A.a[i], B.a[i], t)
    if (f.rank[i] === 0 && to === 4) {
      hire = i
      hireT = t
      continue
    }
    if (a < 0.012) continue
    let x = mix(A.x[i], B.x[i], t)
    let y = mix(A.y[i], B.y[i], t)
    const w = mix(A.w[i], B.w[i], t)
    const l = mix(A.l[i], B.l[i], t)
    let th = f.ang[i]
    if (drift) {
      // Hay drifts gently; once a strand has snapped to the grid it is still.
      const loose = to === 0 ? 1 : 1 - t
      if (loose > 0) {
        x += loose * Math.sin(time * f.f1[i] + f.ph[i]) * 3.2 * f.s
        y += loose * Math.cos(time * f.f2[i] + f.ph[i]) * 2.4 * f.s
        th += loose * Math.sin(time * f.f2[i] * 0.7 + f.ph[i]) * 0.16
      }
    }
    const ux = Math.cos(th) * Math.max(l, 0.01)
    const uy = Math.sin(th) * Math.max(l, 0.01)
    const key = Math.round(a * 40) * 256 + Math.min(255, Math.round(w * 4))
    let path = buckets.get(key)
    if (!path) {
      path = new Path2D()
      buckets.set(key, path)
    }
    path.moveTo(x - ux, y - uy)
    path.lineTo(x + ux, y + uy)
  }
  ctx.lineCap = "round"
  ctx.strokeStyle = "rgb(246,241,231)"
  buckets.forEach((path, key) => {
    ctx.globalAlpha = Math.floor(key / 256) / 40
    ctx.lineWidth = (key % 256) / 4
    ctx.stroke(path)
  })

  // The hire: turns gold, with a soft halo, then a thin ring drawn round with four ticks.
  if (hire >= 0) {
    const t = hireT
    const x = mix(A.x[hire], B.x[hire], t)
    const y = mix(A.y[hire], B.y[hire], t)
    const r = mix(A.w[hire], B.w[hire], t) / 2
    if (t > 0) {
      const G = r * 9
      ctx.globalAlpha = t
      ctx.drawImage(sp.glow, x - G, y - G, G * 2, G * 2)
    }
    const c = CREAM.map((v, j) => Math.round(mix(v, GOLD[j], t)))
    ctx.globalAlpha = mix(A.a[hire], B.a[hire], t)
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()

    const rt = from === to ? 1 : ease(clamp((s - 0.35) / 0.6))
    if (rt > 0) {
      const R = f.hire.R
      ctx.globalAlpha = 0.95
      ctx.strokeStyle = "rgb(230,199,122)"
      ctx.lineWidth = 1.25
      ctx.lineCap = "butt"
      ctx.beginPath()
      ctx.arc(f.hire.x, f.hire.y, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rt)
      ctx.stroke()
      ctx.globalAlpha = 0.7 * rt
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let q = 0; q < 4; q++) {
        const angQ = (q * Math.PI) / 2
        const cq = Math.cos(angQ)
        const sq = Math.sin(angQ)
        ctx.moveTo(f.hire.x + cq * (R + 9 * f.s), f.hire.y + sq * (R + 9 * f.s))
        ctx.lineTo(f.hire.x + cq * (R + 21 * f.s), f.hire.y + sq * (R + 21 * f.s))
      }
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

function brackets(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, len: number, gold: number, s: number) {
  const L = Math.max(12 * s, Math.min(len, 38 * s))
  const c = CREAM.map((v, j) => Math.round(mix(v, GOLD[j], gold)))
  ctx.globalAlpha = mix(0.34, 0.8, gold)
  ctx.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`
  ctx.lineWidth = 1
  ctx.lineCap = "butt"
  ctx.beginPath()
  const X = Math.round(x) + 0.5
  const Y = Math.round(y) + 0.5
  const R = Math.round(x + w) - 0.5
  const B = Math.round(y + h) - 0.5
  ctx.moveTo(X, Y + L)
  ctx.lineTo(X, Y)
  ctx.lineTo(X + L, Y)
  ctx.moveTo(R - L, Y)
  ctx.lineTo(R, Y)
  ctx.lineTo(R, Y + L)
  ctx.moveTo(R, B - L)
  ctx.lineTo(R, B)
  ctx.lineTo(R - L, B)
  ctx.moveTo(X + L, B)
  ctx.lineTo(X, B)
  ctx.lineTo(X, B - L)
  ctx.stroke()
}
