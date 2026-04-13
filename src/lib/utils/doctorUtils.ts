/**
 * Shared doctor-fetching utilities used across all modules.
 *
 * Why centralised:
 *   Multiple pages (OPD, ER, IPD, Certificates, Accounts, Admin) each had
 *   their own fetchDoctors() — some missing offline fallback, some missing
 *   the merge of pending (not-yet-synced) local doctors. Centralising
 *   ensures every page sees the same, consistent doctor list.
 *
 * Merge strategy (online path):
 *   1. Fetch from Supabase (via fetchWithFallback so circuit-breaker applies)
 *   2. Fetch locally-pending doctors from Dexie (created offline, not yet pushed)
 *   3. Union: pending doctors that are NOT already in Supabase result are appended
 *   4. Deduplicate by server_id / name+phone
 */
import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/dexie/schema'
import { fetchWithFallback } from '@/lib/utils/fetchWithFallback'
import type { Doctor } from '@/types'

/** Deduplicate a raw Dexie doctor array (name+phone key, prefer server-synced record) */
function dedupeDexieDoctors<T extends { server_id?: string | null; name: string; phone: string }>(
  docs: T[],
): T[] {
  const seen = new Map<string, T>()
  for (const doc of docs) {
    const key = doc.server_id ?? `${doc.name.toLowerCase().trim()}|${doc.phone.trim()}`
    if (!seen.has(key)) seen.set(key, doc)
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Fetch ALL doctors (active + inactive) — used by the admin Doctors page.
 * Online: Supabase result merged with any locally-pending new doctors.
 * Offline: Dexie with deduplication.
 */
export async function fetchAllDoctors(): Promise<Doctor[]> {
  const dexieFallback = async () => {
    const all = await db.doctors.toArray()
    return dedupeDexieDoctors(all) as unknown as Doctor[]
  }

  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase.from('doctors').select('*').order('name')
      if (error) throw error
      const online = (data ?? []) as Doctor[]

      // Append pending local doctors not yet in Supabase
      const pending = await db.doctors.where('sync_status').equals('pending').toArray()
      const onlineIds = new Set(online.map((d) => d.id))
      const onlyLocal = pending.filter(
        (d) =>
          !onlineIds.has(d.server_id ?? '') &&
          !online.some(
            (o) =>
              o.name.toLowerCase().trim() === d.name.toLowerCase().trim() &&
              o.phone.trim() === d.phone.trim(),
          ),
      )
      return [...online, ...(onlyLocal as unknown as Doctor[])]
    },
    dexieFallback,
  )
}

/**
 * Fetch ACTIVE doctors only — used by OPD, ER, IPD, Certificates, etc.
 * Online: Supabase result merged with any locally-pending active doctors.
 * Offline: Dexie with deduplication.
 */
export async function fetchActiveDoctors(): Promise<Doctor[]> {
  const dexieFallback = async () => {
    const all = await db.doctors.toArray()
    const active = all.filter((d) => d.is_active !== false)
    return dedupeDexieDoctors(active) as unknown as Doctor[]
  }

  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      const online = (data ?? []) as Doctor[]

      // Append pending local active doctors not yet in Supabase
      const pending = await db.doctors
        .where('sync_status')
        .equals('pending')
        .toArray()
      const onlineIds = new Set(online.map((d) => d.id))
      const onlyLocal = pending.filter(
        (d) =>
          d.is_active !== false &&
          !onlineIds.has(d.server_id ?? '') &&
          !online.some(
            (o) =>
              o.name.toLowerCase().trim() === d.name.toLowerCase().trim() &&
              o.phone.trim() === d.phone.trim(),
          ),
      )
      return [...online, ...(onlyLocal as unknown as Doctor[])]
    },
    dexieFallback,
  )
}
