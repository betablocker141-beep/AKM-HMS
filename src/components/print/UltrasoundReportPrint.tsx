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
  const hospitalPhone   = import.meta.env.VITE_HOSPITAL_PHONE   || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail   = import.meta.env.VITE_HOSPITAL_EMAIL   || 'alimkhatoon@gmail.com'

  const now = new Date()
  const printDateTime = now.toLocaleString('en-PK', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  const studyTitle = getStudyTitle(report.study_type)

  const PAD = '14mm'   // left / right page margin

  return (
    /* us-report-page: min-height 297mm on screen, 100vh (=1 full page) on print */
    <div
      className="print-area us-report-page"
      style={{ background: '#fff', fontFamily: 'Arial, sans-serif', fontSize: '10pt', color: '#111', boxSizing: 'border-box', margin: '0 auto' }}
    >

      {/* ── Maroon top bar ───────────────────────────────── */}
      <div style={{ background: '#8B0000', height: '6px', width: '100%' }} />

      {/* ── Letterhead ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: `8mm ${PAD} 5mm ${PAD}` }}>
        <AKMLogo size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '20pt', lineHeight: 1.15, color: '#8B0000', marginBottom: '3px' }}>
            Alim Khatoon Medicare
          </div>
          <div style={{ fontSize: '9pt', color: '#444', lineHeight: 1.5 }}>{hospitalAddress}</div>
          <div style={{ fontSize: '9pt', color: '#444', lineHeight: 1.5 }}>
            Tel: {hospitalPhone}&nbsp;&nbsp;|&nbsp;&nbsp;Email: {hospitalEmail}
          </div>
        </div>
      </div>

      {/* ── Double-rule separator ────────────────────────── */}
      <div style={{ margin: `0 ${PAD}` }}>
        <div style={{ borderTop: '3px solid #8B0000' }} />
        <div style={{ borderTop: '1px solid #D4AF37', marginTop: '2px' }} />
      </div>

      {/* ── Body (grows to push footer down) ─────────────── */}
      {/* us-report-body: flex:1 + flex column so findings expand */}
      <div className="us-report-body" style={{ padding: `6mm ${PAD} 0 ${PAD}` }}>

        {/* Patient info box */}
        <div style={{ border: '1px solid #999', padding: '6px 10px', marginBottom: '8px', fontSize: '9.5pt', lineHeight: 1.5 }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div><strong>Name: </strong>{patientName ?? '——————————————————'}</div>
              <div><strong>MR#: </strong>{patientMrn ?? '——————'}</div>
              {husbandsFatherName && <div><strong>W/O - D/O - S/O: </strong>{husbandsFatherName}</div>}
              <div><strong>Age/Gender: </strong>{patientAge ?? '——— / ———'}</div>
              {patientPhone   && <div><strong>Phone: </strong>{patientPhone}</div>}
              {patientAddress && <div><strong>Address: </strong>{patientAddress}</div>}
            </div>
            <div style={{ minWidth: '150px', textAlign: 'right' }}>
              <div><strong>Date: </strong>{formatDate(report.study_date)}</div>
              {report.referring_doctor && <div><strong>Doctor: </strong>{report.referring_doctor}</div>}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #bbb', marginTop: '5px' }} />
        </div>

        {/* Study title */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '11pt' }}>
            {studyTitle}
          </span>
        </div>

        {/* Findings — us-report-findings: flex:1, expands to fill remaining space */}
        <div
          className="us-report-findings"
          style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: 1.65, marginBottom: '10px' }}
        >
          {report.findings}
        </div>

        {/* Conclusion */}
        {report.impression && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '11pt', marginBottom: '3px' }}>
              CONCLUSION
            </div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: 1.6 }}>
              {report.impression}
            </div>
          </div>
        )}

        {/* History */}
        {report.history && (
          <div style={{ marginBottom: '8px', fontSize: '10pt' }}>
            <strong>*History : </strong>
            <span style={{ whiteSpace: 'pre-wrap' }}>{report.history}</span>
          </div>
        )}

        {/* Presenting complaints */}
        {report.presenting_complaints && (
          <div style={{ marginBottom: '8px', fontSize: '10pt' }}>
            <strong>*Presenting Complaints : </strong>
            <span style={{ whiteSpace: 'pre-wrap' }}>{report.presenting_complaints}</span>
          </div>
        )}

        {/* Prescription */}
        {report.prescription && (
          <div style={{ marginBottom: '8px', fontSize: '10pt' }}>
            <strong>*Prescription : </strong>
            <span style={{ whiteSpace: 'pre-wrap' }}>{report.prescription}</span>
          </div>
        )}

        {/* Radiologist signature */}
        <div style={{ marginTop: '20px', marginBottom: '8px', fontSize: '10pt' }}>
          <strong>Dr Name: </strong>
          <span>{radiologistName ?? '___________________________________'}</span>
        </div>

        {/* Printed by */}
        {printedBy && (
          <div style={{ fontSize: '8pt', color: '#555', marginBottom: '6px' }}>
            <strong>Printed By:</strong> {printedBy} ({printDateTime})
          </div>
        )}
      </div>

      {/* ── Footer — always at page bottom ───────────────── */}
      <div style={{
        borderTop: '1px solid #8B0000',
        margin: `0 ${PAD}`,
        paddingTop: '5px',
        paddingBottom: '8mm',
        textAlign: 'center',
        fontSize: '8pt',
        color: '#555',
        lineHeight: 1.5,
      }}>
        <div>This report is not for medicolegal proceedings and not valid for any court of law.</div>
        <div>Expert opinion from Radiologist required.</div>
        {report.status === 'draft' && (
          <div style={{ color: '#CA8A04', fontWeight: 600, marginTop: '4px' }}>DRAFT — NOT FOR CLINICAL USE</div>
        )}
      </div>

    </div>
  )
}
