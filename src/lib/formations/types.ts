/**
 * Shared types for the Haystack particle formations.
 *
 * A formation is a target shape for the single particle cloud: a Float32Array
 * of `count * 4` floats, xyz in the formation's LOCAL space plus a packed
 * attribute in w (see `pack`). The vertex shader places local space on screen
 * with a per-formation offset/scale uniform, so a resize never forces a
 * rebuild of the procedural shapes.
 *
 * World space: the camera sees y in [-1, 1] and x in [-aspect, aspect] at z = 0.
 */

/** Scroll formations, in the order they appear on the home page (chain order). */
export const FORMATIONS = ["haystack", "sweep", "needle", "thread", "stitch", "loose", "contact"] as const

export type FormationName = (typeof FORMATIONS)[number]

export const FORMATION_INDEX: Record<FormationName, number> = FORMATIONS.reduce(
  (acc, name, i) => {
    acc[name] = i
    return acc
  },
  {} as Record<FormationName, number>,
)

export function isFormationName(v: string | null | undefined): v is FormationName {
  return !!v && (FORMATIONS as readonly string[]).includes(v)
}

/**
 * w packs three things: brightness b (0..2.9), a gold flag and a "special"
 * role (0 = plain, 1 or 2 = animated by the shader, meaning depends on the
 * formation). w = b + 3 * gold + 6 * special. The shader decodes it the same way.
 */
export function pack(b: number, gold = 0, special = 0): number {
  return Math.min(2.9, Math.max(0, b)) + 3 * gold + 6 * special
}

export function unpack(w: number): { b: number; gold: number; special: number } {
  const special = Math.floor(w / 6)
  const r = w - special * 6
  const gold = Math.floor(r / 3)
  return { b: r - gold * 3, gold, special }
}

/** A rounded rectangle in world units, centred at (cx, cy). */
export type RoundRect = { cx: number; cy: number; w: number; h: number; r: number }
