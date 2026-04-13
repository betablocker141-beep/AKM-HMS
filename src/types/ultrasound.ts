export type UsReportStatus = 'draft' | 'final'

export type UsStudyType =
  | 'Abdominal'
  | 'Pelvic TVS'
  | 'Abdomen'
  | 'Pelvis'
  | 'Obstetric'
  | 'Doppler OBS'
  | 'TVS USG'
  | 'Neck/Thyroid'
  | 'Scrotal'
  | 'MSK'
  | 'Doppler'
  | 'Echocardiography'
  | 'Breast'
  | 'KUB'
  | 'Renal'
  | 'Hepatobiliary'
  | 'Full Abdomen + Pelvis'

export const US_STUDY_TYPES: UsStudyType[] = [
  'Abdominal',
  'Pelvic TVS',
  'Abdomen',
  'Pelvis',
  'Obstetric',
  'Doppler OBS',
  'TVS USG',
  'Neck/Thyroid',
  'Scrotal',
  'MSK',
  'Doppler',
  'Echocardiography',
  'Breast',
  'KUB',
  'Renal',
  'Hepatobiliary',
  'Full Abdomen + Pelvis',
]

export interface ObstetricMeasurements {
  lmp?: string
  ga_weeks?: number
  ga_days?: number
  edd?: string
  bpd?: number
  fl?: number
  ac?: number
  hc?: number
  efw?: number
  placenta_position?: string
  liquor?: string
  fetal_heart_rate?: number
  presentation?: string
  number_of_fetuses?: number
}

export interface UltrasoundReport {
  id: string
  patient_id: string
  study_type: UsStudyType
  study_date: string
  referring_doctor: string | null
  radiologist_id: string | null
  findings: string
  impression: string
  recommendations: string | null
  images_urls: string[]
  status: UsReportStatus
  obstetric_data?: ObstetricMeasurements | null
  history?: string | null
  presenting_complaints?: string | null
  prescription?: string | null
  husbands_father_name?: string | null
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
