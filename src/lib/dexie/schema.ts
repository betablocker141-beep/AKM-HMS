import Dexie, { type Table } from 'dexie'
import type {
  Patient, Doctor, OpdToken, OnlineBooking,
  ErVisit, IpdAdmission, IpdProcedure,
  UltrasoundReport, Invoice, BirthCertificate,
  DeathCertificate, HrEmployee, SalaryRecord,
} from '@/types'

// Extend types with Dexie sync fields
type WithSync<T> = T & {
  sync_status: 'synced' | 'pending' | 'conflict'
  local_id: string
  server_id: string | null
}

export class AKMDDB extends Dexie {
  patients!: Table<WithSync<Patient>>
  doctors!: Table<WithSync<Doctor>>
  opd_tokens!: Table<WithSync<OpdToken>>
  er_visits!: Table<WithSync<ErVisit>>
  ipd_admissions!: Table<WithSync<IpdAdmission>>
  ipd_procedures!: Table<WithSync<IpdProcedure>>
  ultrasound_reports!: Table<WithSync<UltrasoundReport>>
  invoices!: Table<WithSync<Invoice>>
  birth_certificates!: Table<WithSync<BirthCertificate>>
  death_certificates!: Table<WithSync<DeathCertificate>>
  online_bookings!: Table<WithSync<OnlineBooking>>
  hr_employees!: Table<WithSync<HrEmployee>>
  salary_records!: Table<WithSync<SalaryRecord>>

  constructor() {
    super('AKMedicare')

    this.version(1).stores({
      patients:
        'local_id, server_id, mrn, phone, name, sync_status, created_at',
      doctors:
        'local_id, server_id, name, is_active, sync_status',
      opd_tokens:
        'local_id, server_id, token_number, patient_id, doctor_id, date, status, sync_status, created_at',
      er_visits:
        'local_id, server_id, token_number, patient_id, visit_date, status, sync_status, created_at',
      ipd_admissions:
        'local_id, server_id, patient_id, admit_date, status, sync_status, created_at',
      ipd_procedures:
        'local_id, server_id, admission_id, sync_status',
      ultrasound_reports:
        'local_id, server_id, patient_id, study_date, status, sync_status, created_at',
      invoices:
        'local_id, server_id, patient_id, invoice_number, status, sync_status, created_at',
      birth_certificates:
        'local_id, server_id, serial_number, dob, sync_status, created_at',
      death_certificates:
        'local_id, server_id, serial_number, dod, sync_status, created_at',
      online_bookings:
        'local_id, server_id, status, preferred_date, sync_status, created_at',
    })

    // Version 2 — adds HR employees table
    this.version(2).stores({
      patients:
        'local_id, server_id, mrn, phone, name, sync_status, created_at',
      doctors:
        'local_id, server_id, name, is_active, sync_status',
      opd_tokens:
        'local_id, server_id, token_number, patient_id, doctor_id, date, status, sync_status, created_at',
      er_visits:
        'local_id, server_id, token_number, patient_id, visit_date, status, sync_status, created_at',
      ipd_admissions:
        'local_id, server_id, patient_id, admit_date, status, sync_status, created_at',
      ipd_procedures:
        'local_id, server_id, admission_id, sync_status',
      ultrasound_reports:
        'local_id, server_id, patient_id, study_date, status, sync_status, created_at',
      invoices:
        'local_id, server_id, patient_id, invoice_number, status, sync_status, created_at',
      birth_certificates:
        'local_id, server_id, serial_number, dob, sync_status, created_at',
      death_certificates:
        'local_id, server_id, serial_number, dod, sync_status, created_at',
      online_bookings:
        'local_id, server_id, status, preferred_date, sync_status, created_at',
      hr_employees:
        'local_id, server_id, name, department, status, sync_status, created_at',
    })

    // Version 3 — adds created_by_name index on invoices for audit trail
    this.version(3).stores({
      patients:
        'local_id, server_id, mrn, phone, name, sync_status, created_at',
      doctors:
        'local_id, server_id, name, is_active, sync_status',
      opd_tokens:
        'local_id, server_id, token_number, patient_id, doctor_id, date, status, sync_status, created_at',
      er_visits:
        'local_id, server_id, token_number, patient_id, visit_date, status, sync_status, created_at',
      ipd_admissions:
        'local_id, server_id, patient_id, admit_date, status, sync_status, created_at',
      ipd_procedures:
        'local_id, server_id, admission_id, sync_status',
      ultrasound_reports:
        'local_id, server_id, patient_id, study_date, status, sync_status, created_at',
      invoices:
        'local_id, server_id, patient_id, invoice_number, status, sync_status, created_at, created_by_id, created_by_name',
      birth_certificates:
        'local_id, server_id, serial_number, dob, sync_status, created_at',
      death_certificates:
        'local_id, server_id, serial_number, dod, sync_status, created_at',
      online_bookings:
        'local_id, server_id, status, preferred_date, sync_status, created_at',
      hr_employees:
        'local_id, server_id, name, department, status, sync_status, created_at',
    })

    // Version 4 — adds salary_records table
    this.version(4).stores({
      patients:
        'local_id, server_id, mrn, phone, name, sync_status, created_at',
      doctors:
        'local_id, server_id, name, is_active, sync_status',
      opd_tokens:
        'local_id, server_id, token_number, patient_id, doctor_id, date, status, sync_status, created_at',
      er_visits:
        'local_id, server_id, token_number, patient_id, visit_date, status, sync_status, created_at',
      ipd_admissions:
        'local_id, server_id, patient_id, admit_date, status, sync_status, created_at',
      ipd_procedures:
        'local_id, server_id, admission_id, sync_status',
      ultrasound_reports:
        'local_id, server_id, patient_id, study_date, status, sync_status, created_at',
      invoices:
        'local_id, server_id, patient_id, invoice_number, status, sync_status, created_at, created_by_id, created_by_name',
      birth_certificates:
        'local_id, server_id, serial_number, dob, sync_status, created_at',
      death_certificates:
        'local_id, server_id, serial_number, dod, sync_status, created_at',
      online_bookings:
        'local_id, server_id, status, preferred_date, sync_status, created_at',
      hr_employees:
        'local_id, server_id, name, department, status, sync_status, created_at',
      salary_records:
        'local_id, server_id, employee_id, month, status, sync_status, created_at',
    })

    // Version 5 — same stores; keeps existing browsers from getting VersionError
    this.version(5).stores({
      patients:
        'local_id, server_id, mrn, phone, name, sync_status, created_at',
      doctors:
        'local_id, server_id, name, is_active, sync_status',
      opd_tokens:
        'local_id, server_id, token_number, patient_id, doctor_id, date, status, sync_status, created_at',
      er_visits:
        'local_id, server_id, token_number, patient_id, visit_date, status, sync_status, created_at',
      ipd_admissions:
        'local_id, server_id, patient_id, admit_date, status, sync_status, created_at',
      ipd_procedures:
        'local_id, server_id, admission_id, sync_status',
      ultrasound_reports:
        'local_id, server_id, patient_id, study_date, status, sync_status, created_at',
      invoices:
        'local_id, server_id, patient_id, invoice_number, status, sync_status, created_at, created_by_id, created_by_name',
      birth_certificates:
        'local_id, server_id, serial_number, dob, sync_status, created_at',
      death_certificates:
        'local_id, server_id, serial_number, dod, sync_status, created_at',
      online_bookings:
        'local_id, server_id, status, preferred_date, sync_status, created_at',
      hr_employees:
        'local_id, server_id, name, department, status, sync_status, created_at',
      salary_records:
        'local_id, server_id, employee_id, month, status, sync_status, created_at',
    })
  }
}

export const db = new AKMDDB()
