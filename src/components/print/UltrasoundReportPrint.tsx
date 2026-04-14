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
    case 'Pelvis':       return 'PELVIC ULTRASOUND EXAMINATION'
    case 'Pelvic TVS':   return 'PELVIC ULTRASOUND EXAMINATION T.V.S'
    case 'Abdominal':
    case 'Abdomen':      return 'ABDOMINAL ULTRASOUND EXAMINATION'
    case 'Obstetric':    return 'OBSTETRIC ULTRASOUND EXAMINATION'
    case 'Breast':       return 'BREAST ULTRASOUND EXAMINATION'
    default:             return `${studyType.toUpperCase()} ULTRASOUND EXAMINATION`
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

  const printDateTime = new Date().toLocaleString('en-PK', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  const studyTitle = getStudyTitle(report.study_type)
  const LR = '14mm'

  /*
   * LAYOUT STRATEGY
   * ───────────────
   * Outer wrapper: position:relative, height:297mm (exact A4), overflow:hidden
   *   - Prevents content from spilling to page 2.
   *
   * Footer: position:absolute, bottom:0
   *   - Pinned to page bottom regardless of flex/block browser behaviour in print.
   *   - Does NOT depend on flex:1 expanding siblings.
   *
   * Content area: padding-bottom:24mm reserves space for the footer so
   *   body text never slides under the absolutely-positioned footer.
   *
   * This approach avoids the "blank space below footer" problem that
   * occurs when flex:1 body expansion fails in some browser print engines.
   */

  return (
    <>
      {/* @page must be in <head> for some browsers; the <style> here is
          also copied into the react-to-print iframe and works in Chrome/Edge. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: A4 portrait; margin: 0; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; }
        }
      `}} />

      <div
        className="print-area"
        style={{
          width: '210mm',
          height: '297mm',
          margin: '0 auto',
          background: '#fff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '10pt',
          color: '#111',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        {/* ── 1. Maroon top bar ───────────────────────────── */}
        <div style={{ background: '#8B0000', height: '7px' }} />

        {/* ── 2. Letterhead ─────────────────────────────────
              Logo on left; hospital name + contact on right.
              The row fills the full content width (210mm − 2×LR).
        */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: `6mm ${LR} 4mm ${LR}`,
          gap: '14px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ flexShrink: 0 }}>
            <AKMLogo size={72} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: '21pt',
              lineHeight: 1.1,
              color: '#8B0000',
              marginBottom: '3px',
            }}>
              Alim Khatoon Medicare
            </div>
            <div style={{ fontSize: '8.5pt', color: '#444', lineHeight: 1.5 }}>
              {hospitalAddress}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#444', lineHeight: 1.5 }}>
              Tel:&nbsp;{hospitalPhone}&nbsp;&nbsp;|&nbsp;&nbsp;Email:&nbsp;{hospitalEmail}
            </div>
          </div>
        </div>

        {/* ── 3. Double-rule separator ───────────────────── */}
        <div style={{ padding: `0 ${LR}`, marginBottom: '4mm' }}>
          <div style={{ borderTop: '3px solid #8B0000' }} />
          <div style={{ borderTop: '1px solid #D4AF37', marginTop: '2px' }} />
        </div>

        {/* ── 4. Body content — padding-bottom reserves space for the
              absolute footer (footer height ≈ 22mm) ─────────── */}
        <div style={{
          padding: `0 ${LR}`,
          paddingBottom: '24mm',
          boxSizing: 'border-box',
        }}>

          {/* Patient info box */}
          <div style={{
            border: '1px solid #999',
            padding: '5px 10px',
            marginBottom: '6px',
            fontSize: '9.5pt',
            lineHeight: 1.55,
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div><strong>Name: </strong>{patientName ?? '——————————————————'}</div>
                <div><strong>MR#: </strong>{patientMrn ?? '——————'}</div>
                {husbandsFatherName && (
                  <div><strong>W/O - D/O - S/O: </strong>{husbandsFatherName}</div>
                )}
                <div><strong>Age/Gender: </strong>{patientAge ?? '——— / ———'}</div>
                {patientPhone   && <div><strong>Phone: </strong>{patientPhone}</div>}
                {patientAddress && <div><strong>Address: </strong>{patientAddress}</div>}
              </div>
              <div style={{ minWidth: '140px', textAlign: 'right' }}>
                <div><strong>Date: </strong>{formatDate(report.study_date)}</div>
                {report.referring_doctor && (
                  <div><strong>Doctor: </strong>{report.referring_doctor}</div>
                )}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ccc', marginTop: '4px' }} />
          </div>

          {/* Study title */}
          <div style={{ textAlign: 'center', marginBottom: '7px' }}>
            <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '11pt' }}>
              {studyTitle}
            </span>
          </div>

          {/* Findings */}
          <div style={{
            whiteSpace: 'pre-wrap',
            fontSize: '10pt',
            lineHeight: 1.65,
            marginBottom: '8px',
          }}>
            {report.findings}
          </div>

          {/* Conclusion */}
          {report.impression && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10.5pt', marginBottom: '3px' }}>
                CONCLUSION
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '10pt', lineHeight: 1.6 }}>
                {report.impression}
              </div>
            </div>
          )}

          {/* History */}
          {report.history && (
            <div style={{ marginBottom: '6px', fontSize: '10pt' }}>
              <strong>*History: </strong>
              <span style={{ whiteSpace: 'pre-wrap' }}>{report.history}</span>
            </div>
          )}

          {/* Presenting complaints */}
          {report.presenting_complaints && (
            <div style={{ marginBottom: '6px', fontSize: '10pt' }}>
              <strong>*Presenting Complaints: </strong>
              <span style={{ whiteSpace: 'pre-wrap' }}>{report.presenting_complaints}</span>
            </div>
          )}

          {/* Prescription */}
          {report.prescription && (
            <div style={{ marginBottom: '6px', fontSize: '10pt' }}>
              <strong>*Prescription: </strong>
              <span style={{ whiteSpace: 'pre-wrap' }}>{report.prescription}</span>
            </div>
          )}

          {/* Signature */}
          <div style={{ marginTop: '16px', marginBottom: '4px', fontSize: '10pt' }}>
            <strong>Dr. Name: </strong>
            <span style={{ borderBottom: '1px solid #555', paddingBottom: '1px', minWidth: '160px', display: 'inline-block' }}>
              {radiologistName ?? ''}
            </span>
          </div>

          {/* Printed by */}
          {printedBy && (
            <div style={{ fontSize: '8pt', color: '#666', marginBottom: '2px' }}>
              <strong>Printed By:</strong> {printedBy} &nbsp;({printDateTime})
            </div>
          )}

        </div>

        {/* ── 5. Footer — position:absolute pins it to page bottom ──
              This works even if flex:1 expansion fails in print engines.
        */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: LR,
          right: LR,
          borderTop: '1px solid #8B0000',
          paddingTop: '4px',
          paddingBottom: '7mm',
          textAlign: 'center',
          fontSize: '7.5pt',
          color: '#666',
          lineHeight: 1.5,
          background: '#fff',
        }}>
          <div>This report is not for medicolegal proceedings and not valid for any court of law.</div>
          <div>Expert opinion from a Radiologist is required for medicolegal cases.</div>
          {report.status === 'draft' && (
            <div style={{ color: '#B45309', fontWeight: 700, marginTop: '3px' }}>
              DRAFT — NOT FOR CLINICAL USE
            </div>
          )}
        </div>

      </div>
    </>
  )
}
