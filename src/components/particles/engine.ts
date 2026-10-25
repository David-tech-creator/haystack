/**
 * Haystack particle engine (plain three.js). Loaded with a dynamic import
 * from <ParticleStage />, so three is never part of the initial bundle.
 * Architecture ported from the Rive Foundry engine (same author).
 *
 * - One THREE.Points cloud. Each formation is a vec4 target attribute built
 *   once on the CPU; the vertex shader blends them with per-stage uniforms.
 * - Scroll timeline: elements with data-formation="..." define windows in
 *   viewport heights; each window is smoothstepped into its uniform.
 * - Writes --<formation>-ready CSS variables on <html> so text reveals sync
 *   with shape completion.
 * - Story uniforms: the sweep line follows the five sprint steps, the needle
 *   rises, the thread's stitches travel, the shortlist cards get sewn in
 *   order, and the contact knot pulses once.
 * - No allocations in the frame loop (DOM strings aside), pauses when hidden.
 */
import * as THREE from "three"
import { FORMATION_COUNT, fragmentShader, vertexShader } from "./shaders"
import { FORMATIONS, FORMATION_INDEX, isFormationName, type RoundRect } from "@/lib/formations/types"
import { createRng } from "@/lib/formations/random"
import { GOLD_X } from "@/lib/formations/strands"
import {
  LEAD_LEN,
  STACK_R,
  buildContact,
  buildHaystack,
  buildLoose,
  buildNeedle,
  buildRandoms,
  buildScatter,
  buildStitch,
  buildSweep,
  buildThread,
  roundRectPoint,
} from "@/lib/formations/shapes"
import { defaultPlace, fitPlace, layoutMode, measureBounds, type Bounds, type LayoutMode, type Place, type Rect } from "./layout"
import { particleStore } from "./store"

export type EngineOptions = {
  canvas: HTMLCanvasElement
  count: number
  /** Device pixel ratio cap. Default 2. Lowered further while frames run slow. */
  maxDpr?: number
  onContextLost?: () => void
}

export type Engine = { dispose(): void }

type Section = {
  el: HTMLElement
  k: number
  /** window start/length in viewport heights */
  start: number
  len: number
  /** document top and height in px */
  top: number
  height: number
}

const rgb = (hex: number) => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255] as const

const PALETTE = {
  ink: rgb(0x1f2640), // navy, on cream
  paper: rgb(0xfefbf4), // on the dark section
  gold: rgb(0xb08425), // logo gold, a shade deeper so it reads on cream
  goldLight: rgb(0xe2bb5e), // gold on navy
}

const CAMERA_FOV = 40
const CAMERA_Z = 1 / Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180) // visible height at z=0 is 2

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (t: number) => t * t * (3 - 2 * t)

/** Sweep stops (local x) for the five sprint steps; step 4 sits on the gold straw. */
const SWEEP_STOPS = [-0.7, -0.36, 0, GOLD_X, 0.72].map((x) => x * STACK_R)
const SWEEP_START = -1.12 * STACK_R

const H = FORMATION_INDEX.haystack
const SW = FORMATION_INDEX.sweep
const N = FORMATION_INDEX.needle
const TH = FORMATION_INDEX.thread
const ST = FORMATION_INDEX.stitch
const L = FORMATION_INDEX.loose
const C = FORMATION_INDEX.contact

export function createEngine(opts: EngineOptions): Engine {
  const { canvas } = opts
  const count = Math.max(1000, Math.floor(opts.count))
  const root = document.documentElement

  /* ---------------- renderer, camera, geometry ---------------- */

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  })
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.05, 40)
  camera.position.set(0, 0, CAMERA_Z)

  const geometry = new THREE.BufferGeometry()
  const scatter = new Float32Array(count * 3)
  const rand = new Float32Array(count * 4)
  const targets: Float32Array[] = []
  for (let k = 0; k < FORMATION_COUNT; k++) targets.push(new Float32Array(count * 4))

  buildScatter(scatter, count, createRng(11))
  buildRandoms(rand, count, createRng(12))

  const built = new Array<boolean>(FORMATION_COUNT).fill(false)
  const bounds: Array<Bounds | null> = new Array(FORMATION_COUNT).fill(null)

  geometry.setAttribute("position", new THREE.BufferAttribute(scatter, 3))
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4))
  const targetAttrs = targets.map((arr, k) => {
    const attr = new THREE.BufferAttribute(arr, 4)
    geometry.setAttribute(`aF${k}`, attr)
    return attr
  })

  const mUniform = new Float32Array(FORMATION_COUNT)
  const offUniform = new Float32Array(FORMATION_COUNT * 3)
  const sclUniform = new Float32Array(FORMATION_COUNT * 3).fill(1)

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 4 },
    uTurb: { value: 0 },
    uIntro: { value: 0 },
    uM: { value: mUniform },
    uOff: { value: offUniform },
    uScl: { value: sclUniform },
    uPointer: { value: new THREE.Vector2(9, 9) },
    uPointerOn: { value: 0 },
    uGlowR: { value: 0.18 },
    uStackR: { value: STACK_R },
    uSweepX: { value: SWEEP_START },
    uFlare: { value: 0 },
    uRise: { value: 0 },
    uThreadPhase: { value: 0 },
    uStitch: { value: 0 },
    uLead: { value: new THREE.Vector2(0, 0) },
    uLeadAng: { value: 0 },
    uLeadOn: { value: 0 },
    uLeadLen: { value: LEAD_LEN },
    uKnot: { value: 0 },
    uInkA: { value: new THREE.Vector3(...PALETTE.ink) },
    uInkB: { value: new THREE.Vector3(...PALETTE.paper) },
    uGoldA: { value: new THREE.Vector3(...PALETTE.gold) },
    uGoldB: { value: new THREE.Vector3(...PALETTE.goldLight) },
    uInk: { value: 0 },
    uOpacity: { value: count > 30000 ? 0.78 : 0.9 },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending,
    premultipliedAlpha: true,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  /* ---------------- viewport + layout ---------------- */

  let vw = window.innerWidth
  let vh = window.innerHeight
  let aspect = vw / vh
  let mode: LayoutMode = layoutMode(vw, vh)
  let isPortraitVp = mode === "portrait"
  const coarse = window.matchMedia("(pointer: coarse)").matches

  let sections: Section[] = []
  const present = new Array<boolean>(FORMATION_COUNT).fill(false)
  const nextPresent = new Int8Array(FORMATION_COUNT).fill(-1)
  const sectionPlace: Array<Partial<Place> | null> = new Array(FORMATION_COUNT).fill(null)
  const copyBox: Array<{ top: number; bottom: number; left: number; right: number } | null> = new Array(
    FORMATION_COUNT,
  ).fill(null)

  let dprCap = opts.maxDpr ?? 2

  function resizeRenderer() {
    vw = window.innerWidth
    vh = window.innerHeight
    aspect = vw / vh
    mode = layoutMode(vw, vh)
    isPortraitVp = mode === "portrait"
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    renderer.setPixelRatio(dpr)
    renderer.setSize(vw, vh, false)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    // fewer particles (phones, tablets) are drawn a little larger
    const density = Math.min(1.35, Math.max(1, Math.sqrt(40000 / count)))
    uniforms.uSize.value = 1.75 * CAMERA_Z * dpr * Math.min(1.3, Math.max(0.75, vh / 900)) * density
    uniforms.uGlowR.value = isPortraitVp ? 0.14 : 0.18
  }

  /** px from the viewport top (y down) to world y (up, half-height 1) */
  const pxToWorldY = (py: number) => 1 - (py / vh) * 2
  const pxToWorldX = (px: number) => ((px - vw / 2) / vh) * 2

  /**
   * Free area for a shape on phones and tablets: above the copy (portrait) or
   * to its right (compact landscape). Null on wide screens, where the desktop
   * placement is kept as tuned, and when the copy has not been measured.
   */
  function freeRect(k: number): Rect | null {
    const c = copyBox[k]
    if (!c || mode === "wide") return null
    const top = k === H ? 80 : Math.max(64, vh * 0.08)
    if (mode === "portrait") {
      return {
        x0: -aspect * 0.94,
        x1: aspect * 0.94,
        y0: pxToWorldY(c.top - Math.max(14, vh * 0.02)),
        y1: pxToWorldY(top),
      }
    }
    return {
      x0: pxToWorldX(c.right + Math.max(24, vw * 0.03)),
      x1: aspect - Math.max(0.04, (24 / vh) * 2),
      y0: -0.94,
      y1: pxToWorldY(Math.max(72, vh * 0.1)),
    }
  }

  function applyLayout() {
    for (let k = 0; k < FORMATION_COUNT; k++) {
      if (k === ST || k === C) continue // these follow their DOM targets every frame
      const name = FORMATIONS[k]
      let base = defaultPlace(name, aspect, mode)
      const ov = sectionPlace[k]
      const b = bounds[k]
      const rect = !ov && b ? freeRect(k) : null
      if (rect && b) base = fitPlace(base, b, rect, aspect, mode === "portrait" ? 0.6 : 0.55)
      const x = ov?.x ?? base.x
      const y = ov?.y ?? base.y
      const s = base.s * (ov?.s ?? 1)
      offUniform[k * 3] = x * aspect
      offUniform[k * 3 + 1] = y
      offUniform[k * 3 + 2] = 0
      sclUniform[k * 3] = sclUniform[k * 3 + 1] = sclUniform[k * 3 + 2] = s
    }
  }

  function scanSections() {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-formation]"))
    const next: Section[] = []
    present.fill(false)
    sectionPlace.fill(null)
    for (const el of els) {
      const name = el.dataset.formation
      if (!isFormationName(name)) continue
      const k = FORMATION_INDEX[name]
      present[k] = true
      const num = (v: string | undefined) => {
        if (v === undefined || v === "") return undefined
        const n = parseFloat(v)
        return Number.isFinite(n) ? n : undefined
      }
      const px = num(el.dataset.formationX)
      const py = num(el.dataset.formationY)
      const ps = num(el.dataset.formationScale)
      if (px !== undefined || py !== undefined || ps !== undefined) sectionPlace[k] = { x: px, y: py, s: ps }
      next.push({ el, k, start: 0, len: 0.6, top: 0, height: 0 })
    }
    sections = next
    stepShown = -1
    ensureFormations()
    let nxt = -1
    for (let k = FORMATION_COUNT - 1; k >= 0; k--) {
      nextPresent[k] = nxt
      if (present[k]) nxt = k
    }
    measure()
  }

  const range = document.createRange()
  /** The section copy's text extent, relative to its sticky stage, with the
   *  reveal's translate taken out (it drifts up to 18px while fading in). */
  function measureCopy(section: HTMLElement) {
    const stage = section.querySelector<HTMLElement>(".fm-stage")
    const copy = section.querySelector<HTMLElement>(".fm-copy")
    if (!stage || !copy) return null
    range.selectNodeContents(copy)
    const r = range.getBoundingClientRect()
    if (!r.height) return null
    const st = stage.getBoundingClientRect()
    let ty = 0
    const tf = getComputedStyle(copy).transform
    if (tf && tf !== "none") {
      try {
        ty = new DOMMatrixReadOnly(tf).m42
      } catch {
        ty = 0
      }
    }
    return { top: r.top - st.top - ty, bottom: r.bottom - st.top - ty, left: r.left, right: r.right }
  }

  /* ---------- DOM-following shapes: shortlist stitch and contact outline ---------- */

  type Follow = { el: HTMLElement | null; cx: number; cy: number; key: string; w: number; h: number }
  const stitchF: Follow = { el: null, cx: 0, cy: 0, key: "", w: 0, h: 0 }
  const contactF: Follow = { el: null, cx: 0, cy: 0, key: "", w: 0, h: 0 }
  let stitchCards: RoundRect[] = []
  let stitchTop = 0
  let stitchH = 0

  const radiusOf = (el: Element, r: DOMRect) => {
    const v = parseFloat(getComputedStyle(el).borderTopLeftRadius)
    return Math.min(Number.isFinite(v) ? v : 0, r.height / 2, r.width / 2)
  }

  function measureStitch(sec: Section | undefined, sy: number) {
    const ids = (sec?.el.dataset.outlineTarget ?? "").split(",").map((s) => s.trim()).filter(Boolean)
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!sec || !els.length) {
      built[ST] = false
      stitchF.el = null
      return
    }
    const rects = els.map((e) => e.getBoundingClientRect())
    let l = Infinity
    let t = Infinity
    let r = -Infinity
    let b = -Infinity
    for (const q of rects) {
      l = Math.min(l, q.left)
      t = Math.min(t, q.top)
      r = Math.max(r, q.right)
      b = Math.max(b, q.bottom)
    }
    const gcx = (l + r) / 2
    const gcy = (t + b) / 2
    stitchF.el = sec.el
    stitchF.cx = gcx
    stitchF.cy = gcy + sy
    stitchTop = t + sy
    stitchH = b - t
    const pad = 9
    const cards = rects.map((q, i) => ({
      cx: ((q.left + q.width / 2 - gcx) / vh) * 2,
      cy: -((q.top + q.height / 2 - gcy) / vh) * 2,
      w: ((q.width + pad * 2) / vh) * 2,
      h: ((q.height + pad * 2) / vh) * 2,
      r: ((radiusOf(els[i], q) + pad) / vh) * 2,
    }))
    const key = cards.map((c) => [c.cx, c.cy, c.w, c.h, c.r].map((v) => Math.round(v * 400)).join(",")).join(";")
    if (key !== stitchF.key || !built[ST]) {
      stitchF.key = key
      stitchCards = cards
      buildStitch(targets[ST], count, createRng(31), cards)
      targetAttrs[ST].needsUpdate = true
      built[ST] = true
    }
  }

  function measureContact(sec: Section | undefined, sy: number) {
    const id = sec?.el.dataset.outlineTarget
    const el = id ? document.getElementById(id) : null
    if (!el) {
      built[C] = false
      contactF.el = null
      return
    }
    const q = el.getBoundingClientRect()
    contactF.el = el
    contactF.cx = q.left + q.width / 2
    contactF.cy = q.top + sy + q.height / 2
    const pad = q.height > 120 ? 12 : 9
    const box: RoundRect = {
      cx: 0,
      cy: 0,
      w: ((q.width + pad * 2) / vh) * 2,
      h: ((q.height + pad * 2) / vh) * 2,
      r: ((radiusOf(el, q) + pad) / vh) * 2,
    }
    const key = [box.w, box.h, box.r].map((v) => Math.round(v * 400)).join(",")
    if (key !== contactF.key || !built[C]) {
      contactF.key = key
      buildContact(targets[C], count, createRng(37), box)
      targetAttrs[C].needsUpdate = true
      built[C] = true
    }
  }

  /** dark bands (data-ink="dark") in document px: the field switches to paper ink there */
  let bands: Array<[number, number]> = []

  function measure() {
    const sy = window.scrollY
    for (const s of sections) {
      const r = s.el.getBoundingClientRect()
      s.top = r.top + sy
      s.height = r.height
      const startOff = parseFloat(s.el.dataset.formationStart ?? "")
      const len = parseFloat(s.el.dataset.formationLength ?? "")
      // Phones in portrait (and very short screens) do not pin the stage: the
      // shape sits in a window at the top of its section, so it forms a little
      // later, as that window reaches the top of the screen.
      const stage = s.el.querySelector<HTMLElement>(".fm-stage")
      const pinned = !stage || getComputedStyle(stage).position === "sticky"
      s.start = s.top / vh - (pinned ? 0.8 : 0.62) + (Number.isFinite(startOff) ? startOff : 0)
      s.len = Number.isFinite(len) && len > 0 ? len : 0.6
      copyBox[s.k] = measureCopy(s.el)
    }
    applyLayout()
    measureStitch(
      sections.find((s) => s.k === ST),
      sy,
    )
    measureContact(
      sections.find((s) => s.k === C),
      sy,
    )
    bands = Array.from(document.querySelectorAll<HTMLElement>('[data-ink="dark"]')).map((el) => {
      const r = el.getBoundingClientRect()
      return [r.top + sy, r.bottom + sy] as [number, number]
    })
    if (present[TH] && Math.abs(threadAspect - aspect) > 0.01) buildThreadNow()
  }

  /* ---------------- procedural formations, built on demand ---------------- */

  let disposed = false
  let threadAspect = 0

  function finishBuild(k: number) {
    targetAttrs[k].needsUpdate = true
    built[k] = true
    bounds[k] = measureBounds(FORMATIONS[k], targets[k], count)
    applyLayout()
  }

  function buildThreadNow() {
    threadAspect = aspect
    buildThread(targets[TH], count, createRng(33), aspect)
    targetAttrs[TH].needsUpdate = true
    built[TH] = true
  }

  function ensureFormations() {
    if (disposed) return
    if (present[H] && !built[H]) {
      buildHaystack(targets[H], count, createRng(21))
      finishBuild(H)
    }
    if (present[SW] && !built[SW]) {
      buildSweep(targets[SW], count, createRng(23))
      finishBuild(SW)
    }
    if (present[N] && !built[N]) {
      buildNeedle(targets[N], count, createRng(25))
      finishBuild(N)
    }
    if (present[TH] && !built[TH]) buildThreadNow()
    if (present[L] && !built[L]) {
      buildLoose(targets[L], count, createRng(27))
      finishBuild(L)
    }
  }

  /* ---------------- input ---------------- */

  let pointerTX = 9
  let pointerTY = 9
  let pointerActive = 0
  let pX = 9
  let pY = 9
  let pOn = 0
  let parX = 0
  let parY = 0
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return
    const nx = (e.clientX / vw) * 2 - 1
    const ny = 1 - (e.clientY / vh) * 2
    pointerTX = nx * aspect
    pointerTY = ny
    if (pointerActive === 0) {
      pX = pointerTX
      pY = pointerTY
    }
    pointerActive = 1
  }
  const onPointerLeave = () => {
    pointerActive = 0
  }

  let resizeTimer: ReturnType<typeof setTimeout> | null = null
  let lastWidth = vw
  const onResize = () => {
    const widthChanged = window.innerWidth !== lastWidth
    // mobile URL-bar show/hide changes only the height: keep layout stable
    if (coarse && !widthChanged && Math.abs(window.innerHeight - vh) < 120) return
    lastWidth = window.innerWidth
    resizeRenderer()
    applyLayout()
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(measure, 150)
  }

  let scanTimer: ReturnType<typeof setTimeout> | null = null
  const mutation = new MutationObserver((records) => {
    // the engine's own attribute writes (data-step) do not count
    if (records.every((r) => r.type === "attributes")) return
    if (scanTimer) clearTimeout(scanTimer)
    scanTimer = setTimeout(scanSections, 120)
  })
  mutation.observe(document.body, { childList: true, subtree: true })

  let measureTimer: ReturnType<typeof setTimeout> | null = null
  const bodyResize = new ResizeObserver(() => {
    if (measureTimer) clearTimeout(measureTimer)
    measureTimer = setTimeout(measure, 100)
  })
  bodyResize.observe(document.body)

  const onContextLost = (e: Event) => {
    e.preventDefault()
    stop()
    opts.onContextLost?.()
  }
  canvas.addEventListener("webglcontextlost", onContextLost)

  window.addEventListener("pointermove", onPointerMove, { passive: true })
  document.addEventListener("pointerleave", onPointerLeave)
  window.addEventListener("blur", onPointerLeave)
  window.addEventListener("resize", onResize)

  /* ---------------- frame loop ---------------- */

  const READY_VARS = FORMATIONS.map((n) => `--${n}-ready`)
  const lastReady = new Float32Array(FORMATION_COUNT).fill(-1)
  const mRaw = new Float32Array(FORMATION_COUNT)
  const lead = { x: 0, y: 0, tx: 1, ty: 0 }

  let raf = 0
  let last = performance.now()
  let time = 0
  let lastScroll = window.scrollY
  let turb = 0
  // the straw falls in on first paint, unless the page opened mid-scroll
  const introStart = window.scrollY > window.innerHeight * 0.3 ? -1 : performance.now()
  let sweepX = SWEEP_START
  let flare = 0
  let rise = 0
  let ink = 0
  let stepShown = -1
  let knotT = -1
  let contactWasReady = false
  let live = false

  // Adaptive pixel ratio: if frames keep running slow (under ~45 fps for two
  // seconds of active rendering), step the pixel ratio down, never below 1.
  let slowTime = 0
  let sampleTime = 0
  function adaptQuality(rawDt: number) {
    if (rawDt > 0.25 || dprCap <= 1) return
    sampleTime += rawDt
    if (rawDt > 0.022) slowTime += rawDt
    if (sampleTime < 2) return
    const slow = slowTime / sampleTime > 0.5
    sampleTime = 0
    slowTime = 0
    if (!slow || (window.devicePixelRatio || 1) <= 1) return
    dprCap = Math.max(1, dprCap - 0.25)
    resizeRenderer()
  }

  function sweepTarget(sec: Section, sy: number) {
    if (sec.el.dataset.sweep === "still") return { x: SWEEP_STOPS[3], step: 3 }
    const span = Math.max(vh * 0.5, sec.height - vh)
    const p = (sy - sec.top) / span
    if (p <= 0) return { x: SWEEP_START, step: 0 }
    const seg = Math.min(4.999, p * 5)
    const i = Math.floor(seg)
    const f = smooth(clamp01((seg - i) * 2.5))
    const from = i === 0 ? SWEEP_START : SWEEP_STOPS[i - 1]
    return { x: from + (SWEEP_STOPS[i] - from) * f, step: i }
  }

  let skipFrame = false
  function frame(now: number) {
    raf = requestAnimationFrame(frame)
    // pages without formations (privacy): render at half rate
    if (!sections.length) {
      skipFrame = !skipFrame
      if (skipFrame) return
    }
    const rawDt = (now - last) / 1000
    const dt = Math.min(0.05, Math.max(0.0001, rawDt))
    last = now
    adaptQuality(sections.length ? rawDt : rawDt / 2)
    time += dt
    uniforms.uTime.value = time
    uniforms.uIntro.value = introStart < 0 ? 1 : clamp01((now - introStart) / 1700)

    // scroll velocity -> turbulence (about 150 ms smoothing)
    const sy = window.scrollY
    const v = Math.abs(sy - lastScroll) / vh / dt
    lastScroll = sy
    const tTarget = Math.min(1, v / 2.5)
    turb += (tTarget - turb) * (1 - Math.exp(-dt / 0.15))
    uniforms.uTurb.value = turb

    // timeline
    mRaw.fill(0)
    const pos = sy / vh
    let sweepSec: Section | null = null
    let needleSec: Section | null = null
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i]
      const t = clamp01((pos - s.start) / s.len)
      const m = smooth(t)
      if (m > mRaw[s.k]) mRaw[s.k] = m
      if (s.k === SW && !sweepSec) sweepSec = s
      if (s.k === N && !needleSec) needleSec = s
    }
    for (let k = 0; k < FORMATION_COUNT; k++) mUniform[k] = built[k] ? mRaw[k] : 0

    // readiness CSS vars: formed, and not yet leaving for the next shape
    for (let k = 0; k < FORMATION_COUNT; k++) {
      if (!present[k]) continue
      const nk = nextPresent[k]
      const leaving = nk >= 0 ? clamp01(mRaw[nk] / 0.15) : 0
      const ready = clamp01((mRaw[k] - 0.85) / 0.15) * (1 - leaving)
      const prev = lastReady[k]
      if (Math.abs(ready - prev) > 0.004 || ((ready === 0 || ready === 1) && ready !== prev)) {
        lastReady[k] = ready
        root.style.setProperty(READY_VARS[k], ready.toFixed(3))
      }
    }

    // sweep: the search line walks the five steps
    if (sweepSec) {
      const st = sweepTarget(sweepSec, sy)
      sweepX += (st.x - sweepX) * (1 - Math.exp(-dt * 7))
      const onGold = 1 - smoothstep01(Math.abs(sweepX - SWEEP_STOPS[3]) / 0.08)
      flare += (onGold - flare) * (1 - Math.exp(-dt * 5))
      uniforms.uSweepX.value = sweepX
      uniforms.uFlare.value = flare
      if (st.step !== stepShown) {
        stepShown = st.step
        sweepSec.el.dataset.step = String(st.step)
      }
    }

    // needle: rises out of the pile as its section scrolls in
    if (needleSec) {
      const target =
        needleSec.el.dataset.needle === "still" ? 1 : smooth(clamp01((sy - needleSec.top + vh * 0.55) / (vh * 0.9)))
      rise += (target - rise) * (1 - Math.exp(-dt * 6))
      uniforms.uRise.value = rise
    }

    // thread: stitches travel with scroll, and a little on their own
    uniforms.uThreadPhase.value = pos * 1.6 + time * 0.05

    // ink: paper-coloured particles while a dark band fills the screen
    let cover = 0
    for (const [a, b] of bands) cover += Math.max(0, Math.min(b, sy + vh) - Math.max(a, sy))
    const inkTarget = smoothstep01((cover / vh - 0.3) / 0.4)
    ink += (inkTarget - ink) * (1 - Math.exp(-dt * 6))
    uniforms.uInk.value = ink

    // shortlist stitch follows its cards and sews them in order
    if (stitchF.el && mRaw[ST] > 0) {
      const k = ST * 3
      offUniform[k] = ((stitchF.cx - vw / 2) / vh) * 2
      offUniform[k + 1] = -((stitchF.cy - sy - vh / 2) / vh) * 2
      const prog = clamp01((vh * 0.85 - (stitchTop - sy)) / (stitchH + vh * 0.35)) * stitchCards.length
      uniforms.uStitch.value = prog
      const ci = Math.min(stitchCards.length - 1, Math.floor(prog))
      if (stitchCards[ci]) {
        roundRectPoint(stitchCards[ci], Math.min(0.9999, prog - ci), lead)
        uniforms.uLead.value.set(lead.x, lead.y)
        uniforms.uLeadAng.value = Math.atan2(lead.ty, lead.tx)
      }
      uniforms.uLeadOn.value = prog > 0.002 && prog < stitchCards.length - 0.002 ? 1 : 0
    }

    // contact outline follows its CTA; the knot pulses once when it forms
    if (contactF.el && mRaw[C] > 0) {
      const k = C * 3
      offUniform[k] = ((contactF.cx - vw / 2) / vh) * 2
      offUniform[k + 1] = -((contactF.cy - sy - vh / 2) / vh) * 2
      const ready = lastReady[C] >= 0.99
      if (ready && !contactWasReady) knotT = 0
      contactWasReady = ready
    }
    if (knotT >= 0) {
      knotT += dt
      uniforms.uKnot.value = knotT < 0.9 ? Math.sin((knotT / 0.9) * Math.PI) : 0
      if (knotT >= 0.9) knotT = -1
    }

    // pointer: lerped position, strength springs in and out
    pX += (pointerTX - pX) * (1 - Math.exp(-dt * 9))
    pY += (pointerTY - pY) * (1 - Math.exp(-dt * 9))
    pOn += (pointerActive - pOn) * (1 - Math.exp(-dt * (pointerActive ? 6 : 2.5)))
    uniforms.uPointer.value.set(pX, pY)
    uniforms.uPointerOn.value = pOn

    // gentle parallax of the whole field
    const tx = pointerActive ? pX / Math.max(aspect, 0.5) : 0
    const ty = pointerActive ? pY : 0
    parX += (tx - parX) * (1 - Math.exp(-dt * 2))
    parY += (ty - parY) * (1 - Math.exp(-dt * 2))
    points.rotation.y = parX * 0.04
    points.rotation.x = -parY * 0.03

    renderer.render(scene, camera)
    if (!live) {
      live = true
      root.setAttribute("data-particles-live", "")
      particleStore.set({ engineReady: true })
    }
  }

  function start() {
    if (raf || disposed) return
    last = performance.now()
    lastScroll = window.scrollY
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }
  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }
  document.addEventListener("visibilitychange", onVisibility)

  /* ---------------- boot ---------------- */

  resizeRenderer()
  scanSections()
  root.setAttribute("data-particles", "on")
  // web fonts change the copy's width: measure again once they are in
  document.fonts?.ready.then(() => {
    if (!disposed) measure()
  })
  if (!document.hidden) start()

  return {
    dispose() {
      disposed = true
      stop()
      mutation.disconnect()
      bodyResize.disconnect()
      if (resizeTimer) clearTimeout(resizeTimer)
      if (scanTimer) clearTimeout(scanTimer)
      if (measureTimer) clearTimeout(measureTimer)
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerleave", onPointerLeave)
      window.removeEventListener("blur", onPointerLeave)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      for (const name of READY_VARS) root.style.removeProperty(name)
      root.removeAttribute("data-particles")
      root.removeAttribute("data-particles-live")
      for (const s of sections) delete s.el.dataset.step
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      particleStore.set({ engineReady: false })
    },
  }
}

function smoothstep01(t: number) {
  const x = t < 0 ? 0 : t > 1 ? 1 : t
  return x * x * (3 - 2 * x)
}
