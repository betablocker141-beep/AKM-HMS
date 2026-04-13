import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate } from '@/lib/utils'
import type { ErVisit } from '@/types'
import { TRIAGE_LABELS } from '@/types/er'

interface ErTokenPrintProps {
  visit: ErVisit
  moName?: string
  fee?: number
}

export function ErTokenPrint({ visit, moName, fee }: ErTokenPrintProps) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const triageColors: Record<number, string> = {
    1: '#DC2626', 2: '#EA580C', 3: '#CA8A04', 4: '#16A34A', 5: '#2563EB',
  }

  return (
    <div
      className="print-area bg-white font-sans"
      style={{ width: '72mm', padding: '6mm', border: '1px solid #e5e7eb', borderRadius: '4px' }}
    >
      <div className="text-center border-b-2 pb-3 mb-3" style={{ borderColor: '#EA580C' }}>
        <div className="flex justify-center mb-2">
          <AKMLogo size={40} />
        </div>
        <h2 className="text-sm font-bold leading-tight" style={{ color: '#EA580C' }}>
          ALIM KHATOON MEDICARE
        </h2>
        <p className="text-xs text-gray-600">{hospitalAddress}</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: '#EA580C' }}>
          ── EMERGENCY DEPARTMENT ──
        </p>
      </div>

      {/* Triage badge */}
      <div
        className="text-center text-white font-bold text-xs py-1.5 rounded mb-3"
        style={{ backgroundColor: triageColors[visit.triage_level] }}
      >
        TRIAGE LEVEL {visit.triage_level} —{' '}
        {TRIAGE_LABELS[visit.triage_level as 1|2|3|4|5].toUpperCase()}
      </div>

      {/* Token */}
      <div className="text-center my-3">
        <p className="text-xs text-gray-500 uppercase tracking-widest">ER Token</p>
        <p className="text-4xl font-bold leading-none mt-1" style={{ color: '#EA580C' }}>
          {visit.token_number}
        </p>
      </div>

      <div className="border-t border-dashed border-gray-300 my-3" />

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Date:</span>
          <span>{formatDate(visit.visit_date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Complaint:</span>
          <span className="text-right max-w-[60%]">{visit.chief_complaint}</span>
        </div>

        {/* Medical Officer */}
        {moName && (
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Medical Officer:</span>
            <span className="text-right font-semibold">{moName}</span>
          </div>
        )}

        {visit.bp && (
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">BP:</span>
            <span>{visit.bp}</span>
          </div>
        )}
        {visit.pulse && (
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Pulse:</span>
            <span>{visit.pulse} bpm</span>
          </div>
        )}
        {visit.spo2 && (
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">SpO2:</span>
            <span>{visit.spo2}%</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-300 my-3" />

      {/* Payment Paid */}
      {fee !== undefined && fee > 0 && (
        <div
          className="rounded px-3 py-2 mb-3 text-center font-bold text-xs"
          style={{ backgroundColor: '#FFF7ED', border: '1px solid #EA580C', color: '#9A3412' }}
        >
          ✔ PAYMENT PAID — Rs. {fee.toLocaleString()}
        </div>
      )}

      <div className="text-center text-xs text-gray-500">
        <p className="font-medium" style={{ color: '#EA580C' }}>EMERGENCY — Please wait for your name</p>
        <p>Tel: {hospitalPhone}</p>
        <p className="text-gray-400 mt-1">
          {new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
