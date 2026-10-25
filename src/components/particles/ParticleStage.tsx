"use client"

import "./particles.css"
import { useEffect, useRef, useState } from "react"
import type { Engine } from "./engine"
import { particleStore, useParticlesMode } from "./store"

export type ParticleStageProps = {
  /** Particle count on desktop. Default 40 000. */
  count?: number
  /** Particle count on tablets (touch, shorter side 600px or more). Default 24 000. */
  tabletCount?: number
  /** Particle count on phones (touch or narrow screens). Default 15 000. */
  mobileCount?: number
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas")
    const gl = c.getContext("webgl2")
    if (!gl) return false
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Resolves once the window has loaded and the main thread has a gap (max ~1.5s after load). */
function afterFirstPaint(): Promise<void> {
  return new Promise((resolve) => {
    const idle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback
      if (ric) ric(() => resolve(), { timeout: 1500 })
      else setTimeout(resolve, 200)
    }
    if (document.readyState === "complete") idle()
    else window.addEventListener("load", idle, { once: true })
  })
}

function useReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

/**
 * The single fixed, full-viewport particle canvas behind the page. Mount once
 * (root layout). Decoration only: aria-hidden, pointer-events none, and three
 * is loaded with a dynamic import after hydration.
 */
export function ParticleStage({ count = 40000, tabletCount = 24000, mobileCount = 15000 }: ParticleStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const mode = useParticlesMode()

  useEffect(() => {
    if (reduced === null) return
    const root = document.documentElement
    const off = () => {
      particleStore.set({ mode: "static", engineReady: false })
      root.setAttribute("data-particles", "off")
      root.removeAttribute("data-particles-live")
    }
    // the boot script only checks that WebGL2 exists in this browser; probe a
    // real context before pulling in three.js, so a machine with WebGL turned
    // off goes straight to the static field without downloading the engine
    if (reduced || !webglAvailable()) {
      off()
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    let engine: Engine | null = null
    let cancelled = false
    // device tier: phones and tablets get fewer, larger particles and a lower
    // pixel ratio (fill rate is what costs on mobile GPUs, not vertices)
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const shortSide = Math.min(window.innerWidth, window.innerHeight)
    const tier = window.innerWidth < 768 || (coarse && shortSide < 600) ? "phone" : coarse ? "tablet" : "desktop"
    const cores = navigator.hardwareConcurrency || 8
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    const base = tier === "phone" ? mobileCount : tier === "tablet" ? tabletCount : count
    const n = Math.round(base * (cores <= 4 || memory <= 2 ? 0.6 : 1))
    const maxDpr = tier === "desktop" ? 2 : 1.5

    // Touch devices: let the page paint and settle first (the hero text is
    // the LCP element), then pull in three.js. Desktop loads it straight away.
    const boot = () => (coarse || tier !== "desktop" ? afterFirstPaint() : Promise.resolve())

    boot()
      .then(() => (cancelled ? Promise.reject(new Error("cancelled")) : import("./engine")))
      .then(({ createEngine }) => {
        if (cancelled) return
        engine = createEngine({
          canvas,
          count: n,
          maxDpr,
          onContextLost: () => {
            engine?.dispose()
            engine = null
            off()
          },
        })
        particleStore.set({ mode: "webgl" })
      })
      .catch(() => {
        if (cancelled) return
        off()
      })

    return () => {
      cancelled = true
      engine?.dispose()
      engine = null
    }
  }, [reduced, count, tabletCount, mobileCount])

  // the canvas stays mounted (empty in static mode) so turning reduced motion
  // off later can start the engine on it
  return (
    <div className="pf-stage" aria-hidden="true" hidden={mode === "static"}>
      <canvas ref={canvasRef} />
    </div>
  )
}
