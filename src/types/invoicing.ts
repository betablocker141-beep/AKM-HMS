export type InvoiceStatus = 'pending' | 'partial' | 'paid'
export type VisitType = 'opd' | 'er' | 'ipd' | 'us'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'jazzcash' | 'easypaisa'

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  patient_id: string
  visit_type: VisitType
  visit_ref_id: string | null
  items: InvoiceItem[]
  subtotal: number
  discount: number
  discount_type: 'amount' | 'percent'
  tax: number
  total: number
  paid_amount: number
  payment_method: PaymentMethod | null
  receipt_no: string | null
  status: InvoiceStatus
  invoice_number: string
  notes: string | null
  created_at: string
  created_by_id?: string | null
  created_by_name?: string | null
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
