export type OpdTokenStatus = 'pending' | 'confirmed' | 'seen' | 'cancelled'
export type OpdTokenType = 'walk_in' | 'online' | 'whatsapp'
export type BookingStatus = 'pending' | 'confirmed' | 'rejected'

export interface OpdToken {
  id: string
  token_number: string
  patient_id: string
  doctor_id: string
  date: string
  time_slot: string
  status: OpdTokenStatus
  type: OpdTokenType
  booking_source: string | null
  notes: string | null
  bp?: string | null
  pulse?: number | null
  temp?: number | null
  spo2?: number | null
  rr?: number | null
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export interface OnlineBooking {
  id: string
  patient_name: string
  phone: string
  doctor_id: string | null
  department: 'opd' | 'ultrasound'
  preferred_date: string
  preferred_time_slot: string
  chief_complaint: string | null
  is_new_patient: boolean
  status: BookingStatus
  rejection_reason: string | null
  token_id: string | null
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
