// 백엔드 메모리 기반 Rate Limiter
// - 키(IP, 사용자, 기타 식별자)별로 sliding window 카운트를 유지
// - 같은 키로 windowMs 안에 max 회 초과 시 차단
// - 서버리스 환경에서는 인스턴스별 격리이므로 정확하지 않을 수 있음. 분산 환경에선 Upstash/Redis 권장.

type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()
let lastSweep = Date.now()
const SWEEP_INTERVAL_MS = 5 * 60 * 1000

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k)
  }
}

export type RateLimitOptions = {
  /** 식별 키 (예: `login:ip:1.2.3.4`) */
  key: string
  /** 윈도우 길이 (ms) */
  windowMs: number
  /** 윈도우 내 허용 횟수 */
  max: number
}

export type RateLimitResult = {
  ok: boolean
  /** 차단 시 남은 대기 시간 (ms) */
  retryAfterMs: number
  /** 차단 시 남은 대기 시간 (분, 올림) */
  retryAfterMinutes: number
  /** 윈도우 내 남은 횟수 */
  remaining: number
}

export function rateLimit(opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = store.get(opts.key)
  if (!bucket || bucket.resetAt <= now) {
    store.set(opts.key, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, retryAfterMs: 0, retryAfterMinutes: 0, remaining: opts.max - 1 }
  }

  if (bucket.count >= opts.max) {
    const retryAfterMs = bucket.resetAt - now
    return {
      ok: false,
      retryAfterMs,
      retryAfterMinutes: Math.ceil(retryAfterMs / 60000),
      remaining: 0,
    }
  }

  bucket.count += 1
  return {
    ok: true,
    retryAfterMs: 0,
    retryAfterMinutes: 0,
    remaining: opts.max - bucket.count,
  }
}

/** 특정 키의 카운트 초기화 (예: 로그인 성공 시) */
export function resetRateLimit(key: string) {
  store.delete(key)
}

/** Request에서 클라이언트 IP 추출 (프록시 헤더 우선) */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

/**
 * 두 가지 키 (예: IP + 사용자) 동시 검사 헬퍼.
 * 둘 중 하나라도 차단되면 차단으로 간주.
 */
export function rateLimitMulti(checks: RateLimitOptions[]): RateLimitResult {
  let blocked: RateLimitResult | null = null
  let minRemaining = Infinity
  for (const c of checks) {
    const r = rateLimit(c)
    if (!r.ok && (!blocked || r.retryAfterMs > blocked.retryAfterMs)) {
      blocked = r
    }
    if (r.remaining < minRemaining) minRemaining = r.remaining
  }
  if (blocked) return blocked
  return { ok: true, retryAfterMs: 0, retryAfterMinutes: 0, remaining: minRemaining }
}
