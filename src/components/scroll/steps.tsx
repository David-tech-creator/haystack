"use client"

import { useEffect, useRef, useState } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SPRINT, STEPS } from "@/lib/content"
import { cn } from "@/lib/utils"
import styles from "./steps.module.css"

/**
 * Lab: "Five steps, one role". A sticky stage inside a tall track. Left, the
 * five sprint steps (real text, the active one lit). Right, a canvas field of
 * cream dots that the scroll narrows step by step: scattered, sorted into a
 * grid, filtered to a few, a short row, then one gold dot with a gold ring.
 * The canvas is redrawn at most once per frame, only when the scroll moves.
 * Reduced motion: no pinning, every step listed, final frame drawn once.
 */

const LINES: Record<(typeof STEPS)[number]["title"], string> = {
  Profile: "We learn the role, the team and what good looks like.",
  Sourcing: "We map who is out there and reach out personally.",
  Signals: "A shared scorecard filters the noise early.",
  Shortlist: "People we would hire ourselves, each with a written note.",
  Offer: "We see the offer through to day one and after.",
}

const COUNT = STEPS.length

export function StepsScroll() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const box = fieldRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!track || !stage || !box || !canvas || !ctx) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let reduce = motion.matches
    let field: Field | null = null
    let frame = 0
    let lastP = -1
    let lastActive = -1
    let stickTop = 0

    const draw = (p: number) => {
      if (field) render(ctx, field, p)
    }

    const update = () => {
      frame = 0
      let p = 1
      if (!reduce) {
        const rect = track.getBoundingClientRect()
        const travel = rect.height - stage.offsetHeight
        p = travel > 0 ? clamp((stickTop - rect.top) / travel) : 0
      }
      if (p === lastP) return
      lastP = p
      draw(p)
      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`
      const a = reduce ? -1 : Math.min(COUNT - 1, Math.floor(p * COUNT))
      if (a !== lastActive) {
        lastActive = a
        setActive(a)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
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
      stickTop = parseFloat(getComputedStyle(stage).top) || 0
      lastP = -1
      schedule()
    }

    const onMotion = () => {
      reduce = motion.matches
      setStill(reduce)
      lastP = -1
      resize()
    }

    setStill(reduce)
    const ro = new ResizeObserver(resize)
    ro.observe(box)
    window.addEventListener("scroll", schedule, { passive: true })
    motion.addEventListener("change", onMotion)
    resize()

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", schedule)
      motion.removeEventListener("change", onMotion)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section aria-labelledby="steps-title" data-tone="deep" className="relative bg-deep text-on-deep">
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <div className="wrap flex h-full flex-col gap-5 py-6 sm:py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-0">
            <div className="lg:col-span-5">
              <Eyebrow>{SPRINT.eyebrow}</Eyebrow>
              <h2 id="steps-title" className="mt-3 text-h2 font-medium lg:mt-4">
                {SPRINT.title}
              </h2>
              <p className="mt-5 hidden max-w-[30rem] text-lead text-on-deep-soft lg:block">{SPRINT.intro}</p>

              <div aria-hidden="true" className={cn(styles.ticks, "mt-5 lg:hidden")}>
                {STEPS.map((s, i) => (
                  <span key={s.title} className={styles.tick} data-on={still || i <= active ? "" : undefined} />
                ))}
              </div>

              <div className="relative mt-4 lg:mt-10">
                <span aria-hidden="true" className={styles.rail}>
                  <span ref={railRef} className={styles.railFill} />
                </span>
                <ol className={styles.items}>
                {STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className={styles.item}
                    data-on={still || i === active ? "" : undefined}
                    aria-current={!still && i === active ? "step" : undefined}
                  >
                    <h3 className="font-display text-h3 font-semibold text-on-deep">{s.title}</h3>
                    <p className="mt-1 text-small text-on-deep-soft">{LINES[s.title]}</p>
                  </li>
                ))}
                </ol>
              </div>
            </div>

            <div
              ref={fieldRef}
              className={cn(styles.field, "-mx-2 flex-1 lg:col-span-7 lg:col-start-6 lg:mx-0 lg:h-[min(80%,760px)]")}
            >
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* The field: five keyframes per dot, interpolated by scroll.               */
/* ------------------------------------------------------------------------ */

type Frame = { x: Float32Array; y: Float32Array; a: Float32Array; r: Float32Array; d: Float32Array }
type Box = { x: number; y: number; w: number; h: number }
type Field = {
  n: number
  w: number
  h: number
  s: number
  rank: Uint16Array
  k: Frame[]
  box: Box[]
  row: { x0: number; x1: number; y: number }
  hire: { x: number; y: number }
}

const CREAM = [246, 241, 231] as const
const GOLD = [230, 199, 122] as const
const SPAN = 0.5 // each dot moves over half of a transition; its delay fills the rest

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
  return { x: new Float32Array(n), y: new Float32Array(n), a: new Float32Array(n), r: new Float32Array(n), d: new Float32Array(n) }
}

function buildField(w: number, h: number): Field {
  const rand = rng(11)
  const s = clamp(Math.min(w, h) / 560, 0.75, 1.25)
  const pad = Math.min(w, h) * 0.07
  const fx = pad
  const fy = pad
  const fw = w - pad * 2
  const fh = h - pad * 2
  const cx = w / 2
  const cy = h / 2

  // A perfect grid at step two, so the count follows the shape of the box.
  const target = clamp((fw * fh) / (w < 640 ? 300 : 460), 180, 620)
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

  const k = [frame(n), frame(n), frame(n), frame(n), frame(n)]
  const [k0, k1, k2, k3, k4] = k

  // Survivors of the filter: a compact block in the middle, still sorted.
  const want = Math.max(24, Math.round(n * 0.09))
  const c2 = Math.max(4, Math.round(Math.sqrt((want * fw) / fh)))
  const r2 = Math.max(3, Math.round(want / c2))
  const m2 = c2 * r2
  const g2 = Math.min((fw * 0.56) / c2, (fh * 0.56) / r2)
  const b2x = cx - (g2 * (c2 - 1)) / 2
  const b2y = cy - (g2 * (r2 - 1)) / 2

  // The short row: the hire in the middle, the others either side.
  const slots = [0, -1, 1, -2, 2]
  const gap = Math.min(fw / 5.4, 120 * s)

  for (let i = 0; i < n; i++) {
    const rk = rank[i]
    const cell = i // scattered: each dot in its own cell, anywhere inside it
    const sx = fx + ((cell % cols) + rand()) * cw
    const sy = fy + (Math.floor(cell / cols) + rand()) * ch
    k0.x[i] = sx
    k0.y[i] = sy
    k0.a[i] = 0.2 + rand() * 0.42
    k0.r[i] = (0.9 + rand() * 1.1) * s

    // Sourcing: sorted into a grid, best first, brightness by rank.
    const gx = fx + ((rk % cols) + 0.5) * cw
    const gy = fy + (Math.floor(rk / cols) + 0.5) * ch
    k1.x[i] = gx
    k1.y[i] = gy
    k1.a[i] = 0.82 - 0.62 * Math.pow(rk / n, 0.7)
    k1.r[i] = 1.35 * s
    k1.d[i] = (SPAN * (gy - fy)) / fh

    // Signals: survivors regroup, the rest drift outward and go quiet.
    const dx = gx - cx
    const dy = gy - cy
    const len = Math.hypot(dx, dy) || 1
    const push = (0.04 + rand() * 0.08) * Math.min(w, h)
    const outX = gx + (dx / len) * push
    const outY = gy + (dy / len) * push
    if (rk < m2) {
      k2.x[i] = b2x + (rk % c2) * g2
      k2.y[i] = b2y + Math.floor(rk / c2) * g2
      k2.a[i] = 0.95 - 0.4 * (rk / m2)
      k2.r[i] = 2.1 * s
    } else {
      k2.x[i] = outX
      k2.y[i] = outY
      k2.a[i] = 0.06
      k2.r[i] = 1.1 * s
    }
    k2.d[i] = (SPAN * (gx - fx)) / fw

    // Shortlist: a few in a row, the other survivors fall away.
    if (rk < slots.length) {
      k3.x[i] = cx + slots[rk] * gap
      k3.y[i] = cy
      k3.a[i] = 1
      k3.r[i] = 4 * s
      k3.d[i] = SPAN * 0.6 + rand() * SPAN * 0.4
    } else if (rk < m2) {
      const ex = k2.x[i] - cx
      const ey = k2.y[i] - cy
      const el = Math.hypot(ex, ey) || 1
      const p = (0.06 + rand() * 0.06) * Math.min(w, h)
      k3.x[i] = k2.x[i] + (ex / el) * p
      k3.y[i] = k2.y[i] + (ey / el) * p
      k3.a[i] = 0.05
      k3.r[i] = 1.2 * s
      k3.d[i] = rand() * SPAN * 0.6
    } else {
      k3.x[i] = k2.x[i]
      k3.y[i] = k2.y[i]
      k3.a[i] = 0.045
      k3.r[i] = k2.r[i]
      k3.d[i] = 0
    }

    // Offer: one stays and turns gold, the others step back.
    if (rk === 0) {
      k4.x[i] = cx
      k4.y[i] = cy
      k4.a[i] = 1
      k4.r[i] = 5.5 * s
      k4.d[i] = 0.1
    } else if (rk < slots.length) {
      k4.x[i] = cx + slots[rk] * gap * 1.12
      k4.y[i] = cy
      k4.a[i] = 0.26
      k4.r[i] = 2.6 * s
      k4.d[i] = 0
    } else {
      k4.x[i] = k3.x[i]
      k4.y[i] = k3.y[i]
      k4.a[i] = 0.035
      k4.r[i] = k3.r[i]
      k4.d[i] = 0
    }
  }

  const m = 18 * s
  const ring = 24 * s
  const box: Box[] = [
    { x: fx - m * 0.4, y: fy - m * 0.4, w: fw + m * 0.8, h: fh + m * 0.8 },
    { x: fx - m * 0.4, y: fy - m * 0.4, w: fw + m * 0.8, h: fh + m * 0.8 },
    { x: b2x - m * 1.4, y: b2y - m * 1.4, w: g2 * (c2 - 1) + m * 2.8, h: g2 * (r2 - 1) + m * 2.8 },
    { x: cx - 2 * gap - m * 1.6, y: cy - m * 2, w: 4 * gap + m * 3.2, h: m * 4 },
    { x: cx - ring - m * 1.3, y: cy - ring - m * 1.3, w: (ring + m * 1.3) * 2, h: (ring + m * 1.3) * 2 },
  ]

  return { n, w, h, s, rank, k, box, row: { x0: cx - 2 * gap, x1: cx + 2 * gap, y: cy }, hire: { x: cx, y: cy } }
}

/** Transition windows sit across each step boundary, so the label and the field change together. */
function phase(p: number) {
  let to = 0
  for (let j = 1; j < COUNT; j++) if (p >= j / COUNT - 0.075) to = j
  if (to === 0) return { from: 0, to: 0, s: 1 }
  const start = to / COUNT - 0.075
  const s = clamp((p - start) / 0.16)
  return s < 1 ? { from: to - 1, to, s } : { from: to, to, s: 1 }
}

function render(ctx: CanvasRenderingContext2D, f: Field, p: number) {
  const { from, to, s } = phase(p)
  const A = f.k[from]
  const B = f.k[to]
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

  // Scan lines during sourcing (top to bottom) and signals (left to right).
  if (from !== to && (to === 1 || to === 2)) {
    const t = clamp(s / (SPAN + 0.06))
    const alpha = Math.sin(Math.PI * t) * 0.85
    ctx.globalAlpha = alpha
    if (to === 1) {
      const y = mix(ba.y, ba.y + ba.h, t)
      const grad = ctx.createLinearGradient(0, y - 40 * f.s, 0, y)
      grad.addColorStop(0, "rgba(230,199,122,0)")
      grad.addColorStop(1, "rgba(230,199,122,0.12)")
      ctx.fillStyle = grad
      ctx.fillRect(ba.x, y - 40 * f.s, ba.w, 40 * f.s)
      ctx.fillStyle = "rgb(230,199,122)"
      ctx.fillRect(ba.x, y - 0.5, ba.w, 1)
    } else {
      const x = mix(ba.x, ba.x + ba.w, t)
      const grad = ctx.createLinearGradient(x - 40 * f.s, 0, x, 0)
      grad.addColorStop(0, "rgba(230,199,122,0)")
      grad.addColorStop(1, "rgba(230,199,122,0.12)")
      ctx.fillStyle = grad
      ctx.fillRect(x - 40 * f.s, ba.y, 40 * f.s, ba.h)
      ctx.fillStyle = "rgb(230,199,122)"
      ctx.fillRect(x - 0.5, ba.y, 1, ba.h)
    }
  }

  // Shortlist hairline under the row.
  const rowIn = to >= 3 ? (from === 2 ? ease(clamp((s - 0.5) / 0.5)) : 1) : 0
  if (rowIn > 0) {
    const fade = to === 4 ? mix(1, 0.3, g) : 1
    const half = ((f.row.x1 - f.row.x0) / 2) * rowIn
    ctx.globalAlpha = 0.22 * fade
    ctx.fillStyle = "rgb(246,241,231)"
    ctx.fillRect(f.hire.x - half, f.row.y + 16 * f.s, half * 2, 1)
  }

  // Dots.
  ctx.fillStyle = "rgb(246,241,231)"
  for (let i = 0; i < f.n; i++) {
    const t = from === to ? 1 : ease(clamp((s - B.d[i]) / SPAN))
    const x = mix(A.x[i], B.x[i], t)
    const y = mix(A.y[i], B.y[i], t)
    const r = mix(A.r[i], B.r[i], t)
    const a = mix(A.a[i], B.a[i], t)
    if (a < 0.01) continue
    if (f.rank[i] === 0 && to === 4) {
      const c = CREAM.map((v, j) => Math.round(mix(v, GOLD[j], t)))
      // a soft glow first, then the dot
      if (t > 0) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 7)
        glow.addColorStop(0, `rgba(230,199,122,${0.32 * t})`)
        glow.addColorStop(1, "rgba(230,199,122,0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = glow
        ctx.fillRect(x - r * 7, y - r * 7, r * 14, r * 14)
      }
      ctx.globalAlpha = a
      ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "rgb(246,241,231)"
      continue
    }
    ctx.globalAlpha = a
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // The hire: a thin gold ring drawn round, with four fine ticks.
  if (to === 4) {
    const t = from === to ? 1 : ease(clamp((s - 0.35) / 0.6))
    if (t > 0) {
      const R = 24 * f.s
      ctx.globalAlpha = 0.95
      ctx.strokeStyle = "rgb(230,199,122)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(f.hire.x, f.hire.y, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * t)
      ctx.stroke()
      ctx.globalAlpha = 0.7 * t
      ctx.beginPath()
      for (let q = 0; q < 4; q++) {
        const ang = (q * Math.PI) / 2
        const c = Math.cos(ang)
        const sn = Math.sin(ang)
        ctx.moveTo(f.hire.x + c * (R + 6 * f.s), f.hire.y + sn * (R + 6 * f.s))
        ctx.lineTo(f.hire.x + c * (R + 14 * f.s), f.hire.y + sn * (R + 14 * f.s))
      }
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

function brackets(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, len: number, gold: number, s: number) {
  const L = Math.max(10 * s, Math.min(len, 34 * s))
  const c = CREAM.map((v, j) => Math.round(mix(v, GOLD[j], gold)))
  ctx.globalAlpha = mix(0.32, 0.75, gold)
  ctx.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`
  ctx.lineWidth = 1
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
