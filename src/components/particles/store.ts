"use client"

/**
 * Tiny shared store between the particle engine and the page. No
 * dependencies; React reads it through useSyncExternalStore.
 */
import { useSyncExternalStore } from "react"

export type ParticleMode = "pending" | "webgl" | "static"

export type ParticleState = {
  /** pending until ParticleStage decides; static = reduced motion or no WebGL */
  mode: ParticleMode
  /** engine built its first formations and is rendering */
  engineReady: boolean
}

let state: ParticleState = { mode: "pending", engineReady: false }
const serverState = state

const listeners = new Set<() => void>()

export const particleStore = {
  get: (): ParticleState => state,
  set(patch: Partial<ParticleState>) {
    let changed = false
    for (const k in patch) {
      const key = k as keyof ParticleState
      if (state[key] !== patch[key]) {
        changed = true
        break
      }
    }
    if (!changed) return
    state = { ...state, ...patch }
    listeners.forEach((l) => l())
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** "pending" on the server and first client render, then "webgl" or "static". */
export function useParticlesMode(): ParticleMode {
  return useSyncExternalStore(
    particleStore.subscribe,
    () => particleStore.get().mode,
    () => serverState.mode,
  )
}
