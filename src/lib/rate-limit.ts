/**
 * Best-effort rate limit for the form routes: N requests per IP per window,
 * per server instance. Enough to stop a script hammering one lambda; not a
 * security boundary. Each route gets its own bucket.
 */
export function rateLimiter({ windowMs = 10 * 60 * 1000, max = 5 } = {}) {
  const hits = new Map<string, number[]>()
  return function limited(ip: string) {
    const now = Date.now()
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    hits.set(ip, recent)
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
    }
    return recent.length > max
  }
}

export const clientIp = (request: Request) =>
  (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
