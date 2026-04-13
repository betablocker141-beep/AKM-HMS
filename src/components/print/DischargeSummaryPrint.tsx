import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate, todayString } from '@/lib/utils'
import type { IpdAdmission, Doctor } from '@/types'

interface DischargeSummaryPrintProps {
  admission: IpdAdmission
  doctor?: Doctor
  patientName?: string
  diagnosis?: string
}

export function DischargeSummaryPrint({ admission, doctor, patientName, diagnosis }: DischargeSummaryPrintProps) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail = import.meta.env.VITE_HOSPITAL_EMAIL || 'alimkhatoon@gmail.com'

  return (
    <div className="print-area bg-white font-sans p-6 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hospital Header */}
      <div className="flex items-center gap-4 border-b-2 pb-4 mb-4" style={{ borderColor: '#8B0000' }}>
        <AKMLogo size={56} />
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold" style={{ color: '#8B0000' }}>ALIM KHATOON MEDICARE</h1>
          <p className="text-sm text-gray-600">{hospitalAddress}</p>
          <p className="text-xs text-gray-500">Tel: {hospitalPhone} | {hospitalEmail} | Indoor Patient Department</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Date: {formatDate(todayString())}</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-2">
          DISCHARGE SUMMARY
        </h2>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="space-y-2">
          <Field label="Patient Name" value={patientName ?? '—'} />
          <Field label="Ward" value={admission.ward} />
          <Field label="Bed Number" value={admission.bed_number} />
          <Field label="Admission Date" value={formatDate(admission.admit_date)} />
        </div>
        <div className="space-y-2">
          <Field label="Discharge Date" value={formatDate(admission.discharge_date ?? todayString())} />
          <Field label="Admitting Doctor" value={doctor?.name ?? '—'} />
          <Field label="Specialty" value={doctor?.specialty ?? '—'} />
          <Field label="Duration" value={calcDuration(admission.admit_date, admission.discharge_date ?? todayString())} />
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Diagnosis</h3>
        <div className="border border-gray-300 rounded p-3 min-h-[60px] text-sm text-gray-800">
          {diagnosis ?? admission.diagnosis ?? 'See attached notes'}
        </div>
      </div>

      {/* Instructions placeholder */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Discharge Instructions / Medications
        </h3>
        <div className="border border-gray-300 rounded p-3 min-h-[80px] text-sm text-gray-400 italic">
          (To be filled by attending physician)
        </div>
      </div>

      {/* Follow-up */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Follow-up Appointment
        </h3>
        <div className="border border-gray-300 rounded p-3 min-h-[40px] text-sm text-gray-400 italic">
          (Date / Dept)
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-12">
            <p className="text-sm font-medium text-gray-700">{doctor?.name ?? 'Attending Physician'}</p>
            <p className="text-xs text-gray-500">{doctor?.specialty ?? ''}</p>
            <p className="text-xs text-gray-500">Signature & Stamp</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-12">
            <p className="text-sm font-medium text-gray-700">Hospital Seal</p>
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-6 pt-3 text-center text-xs text-gray-400">
        Alim Khatoon Medicare | Green Town, Lahore | {hospitalPhone}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 font-medium min-w-[120px]">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

function calcDuration(admit: string, discharge: string): string {
  try {
    const a = new Date(admit)
    const d = new Date(discharge)
    const days = Math.round((d.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} day${days !== 1 ? 's' : ''}`
  } catch {
    return '—'
  }
}
