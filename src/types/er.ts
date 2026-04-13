export type TriageLevel = 1 | 2 | 3 | 4 | 5
export type ErVisitStatus = 'active' | 'treated' | 'admitted' | 'discharged' | 'deceased'

export interface ErVisit {
  id: string
  patient_id: string
  token_number: string
  visit_date: string
  chief_complaint: string
  triage_level: TriageLevel
  bp: string | null
  pulse: number | null
  temp: number | null
  spo2: number | null
  rr: number | null
  doctor_id: string | null
  status: ErVisitStatus
  notes: string | null
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export const TRIAGE_LABELS: Record<TriageLevel, string> = {
  1: 'Immediate (Level 1)',
  2: 'Urgent (Level 2)',
  3: 'Less Urgent (Level 3)',
  4: 'Non-Urgent (Level 4)',
  5: 'Minor (Level 5)',
}

export const TRIAGE_COLORS: Record<TriageLevel, string> = {
  1: 'bg-red-600 text-white',
  2: 'bg-orange-500 text-white',
  3: 'bg-yellow-500 text-black',
  4: 'bg-green-600 text-white',
  5: 'bg-blue-600 text-white',
}
