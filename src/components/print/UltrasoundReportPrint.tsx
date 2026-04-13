import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate } from '@/lib/utils'
import type { UltrasoundReport, UsStudyType } from '@/types'

interface UltrasoundReportPrintProps {
  report: UltrasoundReport
  patientName?: string
  patientAge?: string
  patientMrn?: string
  patientPhone?: string
  patientAddress?: string
  patientGender?: string
  radiologistName?: string
  printedBy?: string
  husbandsFatherName?: string
}

function getStudyTitle(studyType: UsStudyType | string): string {
  switch (studyType) {
    case 'Pelvic':
    case 'Pelvis':
      return 'PELVIC ULTRASOUND EXAMINATION'
    case 'Pelvic TVS':
      return 'PELVIC ULTRASOUND EXAMINATION T.V.S'
    case 'Abdominal':
    case 'Abdomen':
      return 'ABDOMINAL ULTRASOUND EXAMINATION'
    case 'Obstetric':
      return 'OBSTETRIC ULTRASOUND EXAMINATION'
    case 'Breast':
      return 'BREAST ULTRASOUND EXAMINATION'
    default:
      return `${studyType.toUpperCase()} ULTRASOUND EXAMINATION`
  }
}

export function UltrasoundReportPrint({
  report,
  patientName,
  patientAge,
  patientMrn,
  patientPhone,
  patientAddress,
  radiologistName,
  printedBy,
  husbandsFatherName,
}: UltrasoundReportPrintProps) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail = import.meta.env.VITE_HOSPITAL_EMAIL || 'alimkhatoon@gmail.com'

  const now = new Date()
  const printDateTime = now.toLocaleString('en-PK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const studyTitle = getStudyTitle(report.study_type)

  return (
    <div
      className="print-area bg-white"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '10mm 14mm',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.5',
        color: '#111',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <AKMLogo size={70} />
        </div>

        {/* Hospital name + contact */}
        <div style={{ flex: 1 }}>
          <div style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '18pt', lineHeight: '1.2', marginBottom: '2px' }}>
            Alim Khatoon Medicare
          </div>
          <div style={{ fontSize: '8.5pt', color: '#333', lineHeight: '1.4' }}>
            {hospitalAddress}
          </div>
          <div style={{ fontSize: '8.5pt', color: '#333', lineHeight: '1.4' }}>
            Tel: {hospitalPhone} | Email: {hospitalEmail}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '2px solid #111', marginBottom: '8px' }} />

      {/* ─── Patient Info Box ────────────────────────────── */}
      <div style={{ border: '1px solid #999', padding: '6px 10px', marginBottom: '10px', fontSize: '9.5pt' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold' }}>Name: </span>
              <span>{patientName ?? '——————————————————'}</span>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold' }}>MR#: </span>
              <span>{patientMrn ?? '——————'}</span>
            </div>
            {husbandsFatherName && (
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>W/O - D/O - S/O: </span>
                <span>{husbandsFatherName}</span>
              </div>
            )}
            <div style={{ marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold' }}>Age/Gender: </span>
              <span>{patientAge ?? '——— / ———'}</span>
            </div>
            {patientPhone && (
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Phone: </span>
                <span>{patientPhone}</span>
              </div>
            )}
            {patientAddress && (
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Address: </span>
                <span>{patientAddress}</span>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ minWidth: '150px', textAlign: 'right' }}>
            <div style={{ marginBottom: '3px' }}>
              <span style={{ fontWeight: 'bold' }}>Date: </span>
              <span>{formatDate(report.study_date)}</span>
            </div>
            {report.referring_doctor && (
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Doctor: </span>
                <span>{report.referring_doctor}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #bbb', marginTop: '6px' }} />
      </div>

      {/* ─── Study Title ─────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '11pt' }}>
          {studyTitle}
        </span>
      </div>

      {/* ─── Findings ────────────────────────────────────── */}
      <div style={{ marginBottom: '12px', whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.6' }}>
        {report.findings}
      </div>

      {/* ─── Conclusion / Impression ─────────────────────── */}
      {report.impression && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '11pt', marginBottom: '4px' }}>
            CONCLUSION
          </div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: '1.6' }}>
            {report.impression}
          </div>
        </div>
      )}

      {/* ─── History ─────────────────────────────────────── */}
      {report.history && (
        <div style={{ marginBottom: '10px', fontSize: '10pt' }}>
          <span style={{ fontWeight: 'bold' }}>*History : </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>{report.history}</span>
        </div>
      )}

      {/* ─── Presenting Complaints ───────────────────────── */}
      {report.presenting_complaints && (
        <div style={{ marginBottom: '10px', fontSize: '10pt' }}>
          <span style={{ fontWeight: 'bold' }}>*Presenting Complaints : </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>{report.presenting_complaints}</span>
        </div>
      )}

      {/* ─── Prescription ────────────────────────────────── */}
      {report.prescription && (
        <div style={{ marginBottom: '10px', fontSize: '10pt' }}>
          <span style={{ fontWeight: 'bold' }}>*Prescription : </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>{report.prescription}</span>
        </div>
      )}

      {/* ─── Radiologist / Signature ─────────────────────── */}
      <div style={{ marginTop: '24px', marginBottom: '12px', fontSize: '10pt' }}>
        <span style={{ fontWeight: 'bold' }}>Dr Name: </span>
        <span>{radiologistName ?? '___________________________________'}</span>
      </div>

      {/* ─── Printed By ──────────────────────────────────── */}
      {printedBy && (
        <div style={{ fontSize: '8.5pt', color: '#555', marginBottom: '8px' }}>
          <strong>Printed By:</strong> {printedBy} ({printDateTime})
        </div>
      )}

      {/* ─── Footer ──────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid #bbb',
        marginTop: '20px',
        paddingTop: '6px',
        textAlign: 'center',
        fontSize: '8pt',
        color: '#555',
        lineHeight: '1.5',
      }}>
        <div>This report is not for medicoligal proceedings and not valid for any court of law.</div>
        <div>Expert opinion from Radiologist required.</div>
        {report.status === 'draft' && (
          <div style={{ color: '#CA8A04', fontWeight: 600, marginTop: '4px' }}>DRAFT — NOT FOR CLINICAL USE</div>
        )}
      </div>
    </div>
  )
}
