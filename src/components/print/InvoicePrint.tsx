import { AKMLogo } from '@/components/shared/AKMLogo'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types'

interface InvoicePrintProps {
  invoice: Invoice
  patientName?: string
  patientMrn?: string
}

export function InvoicePrint({ invoice, patientName, patientMrn }: InvoicePrintProps) {
  const hospitalPhone = import.meta.env.VITE_HOSPITAL_PHONE || '042-35977450'
  const hospitalAddress = import.meta.env.VITE_HOSPITAL_ADDRESS || '362-6-C2, Green Town, Lahore'
  const hospitalEmail = import.meta.env.VITE_HOSPITAL_EMAIL || 'alimkhatoon@gmail.com'
  const balance = invoice.total - invoice.paid_amount

  return (
    <div
      className="print-area bg-white font-sans"
      style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '14mm 16mm', fontFamily: 'Inter, sans-serif', fontSize: '11pt', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '3px solid #8B0000', paddingBottom: '12px', marginBottom: '16px' }}>
        <AKMLogo size={56} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#8B0000', margin: 0 }}>
            ALIM KHATOON MEDICARE
          </h1>
          <p style={{ fontSize: '10pt', color: '#555', margin: '2px 0' }}>{hospitalAddress}</p>
          <p style={{ fontSize: '10pt', color: '#555', margin: 0 }}>Tel: {hospitalPhone} | {hospitalEmail}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 700, color: '#8B0000', margin: 0 }}>INVOICE</h2>
          <p style={{ fontSize: '10pt', color: '#333', margin: '4px 0 0' }}># {invoice.invoice_number}</p>
          <p style={{ fontSize: '9pt', color: '#666' }}>Date: {formatDate(invoice.created_at)}</p>
        </div>
      </div>

      {/* Patient + Visit info */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '16px', fontSize: '10pt' }}>
        <div>
          <p style={{ fontWeight: 600, color: '#555', marginBottom: '4px' }}>BILLED TO:</p>
          <p style={{ fontWeight: 700, color: '#111' }}>{patientName ?? 'Patient'}</p>
          {patientMrn && (
            <p style={{ color: '#555' }}>MRN: <strong style={{ color: '#8B0000' }}>{patientMrn}</strong></p>
          )}
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ color: '#555' }}>Visit Type: <strong>{invoice.visit_type.toUpperCase()}</strong></p>
          <p style={{ color: '#555' }}>Payment: <strong>{invoice.payment_method?.replace('_', ' ').toUpperCase() ?? '—'}</strong></p>
          {invoice.receipt_no && (
            <p style={{ color: '#555' }}>Receipt No: <strong style={{ color: '#8B0000' }}>{invoice.receipt_no}</strong></p>
          )}
          <p style={{ color: '#555' }}>Status:{' '}
            <strong style={{ color: invoice.status === 'paid' ? '#16A34A' : invoice.status === 'partial' ? '#EA580C' : '#CA8A04' }}>
              {invoice.status.toUpperCase()}
            </strong>
          </p>
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '10pt' }}>
        <thead>
          <tr style={{ backgroundColor: '#8B0000', color: 'white' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>#</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Description</th>
            <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Qty</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>Unit Price</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(invoice.items) ? invoice.items : []).map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white' }}>
              <td style={{ padding: '8px 12px', color: '#666' }}>{idx + 1}</td>
              <td style={{ padding: '8px 12px' }}>{item.description}</td>
              <td style={{ padding: '8px 12px', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <table style={{ fontSize: '10pt', minWidth: '200px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 12px', color: '#555' }}>Subtotal:</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(invoice.subtotal)}</td>
            </tr>
            {invoice.discount > 0 && (
              <tr>
                <td style={{ padding: '4px 12px', color: '#555' }}>Discount:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', color: '#EA580C' }}>
                  - {formatCurrency(invoice.discount_type === 'percent' ? (invoice.subtotal * invoice.discount / 100) : invoice.discount)}
                </td>
              </tr>
            )}
            <tr style={{ borderTop: '2px solid #8B0000' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700, color: '#8B0000', fontSize: '12pt' }}>Total:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: '#8B0000', fontSize: '12pt' }}>{formatCurrency(invoice.total)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 12px', color: '#16A34A' }}>Amount Paid:</td>
              <td style={{ padding: '4px 0', textAlign: 'right', color: '#16A34A', fontWeight: 600 }}>{formatCurrency(invoice.paid_amount)}</td>
            </tr>
            {balance > 0 && (
              <tr>
                <td style={{ padding: '4px 12px', color: '#DC2626', fontWeight: 600 }}>Balance Due:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', color: '#DC2626', fontWeight: 700 }}>{formatCurrency(balance)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#f9f9f9', borderLeft: '3px solid #D4AF37', fontSize: '9.5pt', color: '#555' }}>
          <strong>Notes:</strong> {invoice.notes}
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '10px', textAlign: 'center', fontSize: '9pt', color: '#888' }}>
        <p style={{ fontWeight: 600, color: '#8B0000', marginBottom: '4px' }}>
          Thank you for choosing Alim Khatoon Medicare
        </p>
        <p>{hospitalAddress} | Tel: {hospitalPhone} | {hospitalEmail}</p>
      </div>
    </div>
  )
}
