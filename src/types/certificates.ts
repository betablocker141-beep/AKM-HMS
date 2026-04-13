export interface BirthCertificate {
  id: string
  serial_number: string
  patient_id: string | null
  baby_name: string
  dob: string
  time_of_birth: string
  gender: 'Male' | 'Female'
  weight_kg: number | null
  mother_name: string
  mother_cnic: string | null
  father_name: string
  father_cnic: string | null
  doctor_id: string
  ward: string | null
  address: string
  created_at: string
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export interface DeathCertificate {
  id: string
  serial_number: string
  patient_id: string | null
  patient_name: string
  patient_cnic: string | null
  dod: string
  time_of_death: string
  cause_of_death_primary: string
  cause_of_death_contributing: string | null
  doctor_id: string
  created_at: string
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
