export type IpdStatus = 'admitted' | 'discharged'

export interface IpdAdmission {
  id: string
  patient_id: string
  admit_date: string
  discharge_date: string | null
  ward: string
  bed_number: string
  admitting_doctor_id: string
  diagnosis: string | null
  status: IpdStatus
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export interface IpdProcedure {
  id: string
  admission_id: string
  procedure_name: string
  procedure_date: string
  doctor_id: string
  fee: number
  notes: string | null
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export interface NursingNote {
  id: string
  admission_id: string
  note_date: string
  nurse_name: string
  note: string
  vitals: {
    bp?: string
    pulse?: number
    temp?: number
    spo2?: number
  }
}

export const WARDS = [
  'General Ward',
  'Room 101',
  'Room 102',
  'Room 103',
  'Room 104',
  'Room 105',
  'Room 106',
]

/** Number of beds per ward */
export const WARD_BEDS: Record<string, number> = {
  'General Ward': 6,
  'Room 101': 1,
  'Room 102': 1,
  'Room 103': 1,
  'Room 104': 1,
  'Room 105': 1,
  'Room 106': 1,
}
