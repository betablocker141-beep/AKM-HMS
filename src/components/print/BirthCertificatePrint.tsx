import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate } from '@/lib/utils'
import type { BirthCertificate, Doctor } from '@/types'

export function BirthCertificatePrint({ cert, doctor }: { cert: BirthCertificate; doctor?: Doctor }) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail = import.meta.env.VITE_HOSPITAL_EMAIL || 'alimkhatoon@gmail.com'
  return (
    <div className="print-area bg-white font-sans" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '14mm 16mm', border: '4px double #8B0000', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #8B0000', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><AKMLogo size={56} /></div>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#8B0000', margin: 0 }}>ALIM KHATOON MEDICARE</h1>
        <p style={{ fontSize: '10pt', color: '#555', margin: '4px 0' }}>{hospitalAddress} | Tel: {hospitalPhone} | {hospitalEmail}</p>
        <h2 style={{ fontSize: '16pt', fontWeight: 700, color: '#333', marginTop: '12px', textDecoration: 'underline' }}>BIRTH CERTIFICATE</h2>
        <p style={{ fontSize: '10pt', color: '#666' }}>Serial No: <strong>{cert.serial_number}</strong></p>
      </div>
      {/* Content */}
      <div style={{ fontSize: '11pt', lineHeight: '2', marginBottom: '20px' }}>
        <Row label="Baby's Name" value={cert.baby_name} />
        <Row label="Date of Birth" value={`${formatDate(cert.dob)} at ${cert.time_of_birth}`} />
        <Row label="Gender" value={cert.gender} />
        {cert.weight_kg && <Row label="Birth Weight" value={`${cert.weight_kg} kg`} />}
        <Row label="Mother's Name" value={cert.mother_name} />
        {cert.mother_cnic && <Row label="Mother's CNIC" value={cert.mother_cnic} />}
        <Row label="Father's Name" value={cert.father_name} />
        {cert.father_cnic && <Row label="Father's CNIC" value={cert.father_cnic} />}
        <Row label="Attending Doctor" value={doctor?.name ?? '—'} />
        {cert.ward && <Row label="Ward" value={cert.ward} />}
        <Row label="Home Address" value={cert.address ?? '—'} />
        <Row label="Issue Date" value={formatDate(cert.created_at)} />
      </div>
      {/* Signatures */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '6px', width: '160px', marginTop: '48px' }}>
            <p style={{ fontSize: '10pt', fontWeight: 600 }}>{doctor?.name ?? 'Attending Doctor'}</p>
            <p style={{ fontSize: '9pt', color: '#555' }}>MBBS | Signature</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', border: '2px dashed #8B0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '8pt', color: '#8B0000', textAlign: 'center', fontWeight: 600 }}>Hospital<br/>Stamp</p>
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
