/**
 * Wraps a Supabase fetch with a timeout + automatic Dexie fallback.
 *
 * Circuit-breaker: after the first timeout/failure, Supabase is marked
 * "down" for 30 seconds. All subsequent calls go straight to Dexie without
 * waiting for the timeout. This makes the offline experience fast even when
 * Wi-Fi is connected but the internet is unreachable.
 */

let _supabaseDown = false
let _supabaseDownSince = 0
const CIRCUIT_RESET_MS = 60_000
const DEFAULT_TIMEOUT_MS = 8_000

/** Call this when Supabase is confirmed reachable (e.g. after a successful sync) */
export function markSupabaseOnline() {
  _supabaseDown = false
}

export async function fetchWithFallback<T>(
  onlineFn: () => Promise<T>,
  offlineFn: () => Promise<T>,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  // If browser knows it's offline, skip straight to Dexie
  if (!navigator.onLine) {
    return offlineFn()
  }

  // Circuit breaker: if Supabase failed recently, skip straight to Dexie
  if (_supabaseDown && Date.now() - _supabaseDownSince < CIRCUIT_RESET_MS) {
    return offlineFn()
  }

  try {
    const result = await Promise.race([
      onlineFn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('network-timeout')), timeoutMs),
      ),
    ])
    // Success — reset circuit breaker
    _supabaseDown = false
    return result
  } catch {
    // Supabase timed out or threw — trip the breaker and use Dexie
    _supabaseDown = true
    _supabaseDownSince = Date.now()
    return offlineFn()
  }
}
