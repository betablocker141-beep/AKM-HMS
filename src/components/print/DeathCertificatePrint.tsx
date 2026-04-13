import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate } from '@/lib/utils'
import type { DeathCertificate, Doctor } from '@/types'

export function DeathCertificatePrint({ cert, doctor }: { cert: DeathCertificate; doctor?: Doctor }) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail = import.meta.env.VITE_HOSPITAL_EMAIL || 'alimkhatoon@gmail.com'
  return (
    <div className="print-area bg-white font-sans" style={{ width: '190mm', margin: '0 auto', padding: '12mm', border: '4px double #333', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><AKMLogo size={56} /></div>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#8B0000', margin: 0 }}>ALIM KHATOON MEDICARE</h1>
        <p style={{ fontSize: '10pt', color: '#555', margin: '4px 0' }}>{hospitalAddress} | Tel: {hospitalPhone} | {hospitalEmail}</p>
        <h2 style={{ fontSize: '16pt', fontWeight: 700, color: '#333', marginTop: '12px', textDecoration: 'underline' }}>DEATH CERTIFICATE</h2>
        <p style={{ fontSize: '10pt', color: '#666' }}>Serial No: <strong>{cert.serial_number}</strong></p>
      </div>
      <div style={{ fontSize: '11pt', lineHeight: '2', marginBottom: '20px' }}>
        <Row label="Deceased Name" value={cert.patient_name} />
        {cert.patient_cnic && <Row label="CNIC" value={cert.patient_cnic} />}
        <Row label="Date of Death" value={`${formatDate(cert.dod)} at ${cert.time_of_death}`} />
        <Row label="Primary Cause" value={cert.cause_of_death_primary} />
        {cert.cause_of_death_contributing && <Row label="Contributing Cause" value={cert.cause_of_death_contributing} />}
        <Row label="Attending Doctor" value={doctor?.name ?? '—'} />
        <Row label="Issue Date" value={formatDate(cert.created_at)} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '6px', width: '160px', marginTop: '48px' }}>
            <p style={{ fontSize: '10pt', fontWeight: 600 }}>{doctor?.name ?? 'Attending Doctor'}</p>
            <p style={{ fontSize: '9pt', color: '#555' }}>MBBS | Signature</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '90px', height: '90px', border: '2px dashed #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '8pt', color: '#aaa', textAlign: 'center' }}>Hospital<br/>Seal</p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '8px', textAlign: 'center', fontSize: '9pt', color: '#888' }}>
        Alim Khatoon Medicare | {hospitalAddress} | Tel: {hospitalPhone} | {hospitalEmail}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '16px', borderBottom: '1px dotted #ddd', padding: '4px 0' }}>
      <span style={{ fontWeight: 600, color: '#555', minWidth: '180px' }}>{label}:</span>
      <span style={{ color: '#111' }}>{value}</span>
    </div>
  )
}
