import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useReactToPrint } from 'react-to-print'
import { ChevronLeft, Printer } from 'lucide-react'
import { InvoicePrint } from '@/components/print/InvoicePrint'
import { WAButton } from '@/components/shared/WAButton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/dexie/schema'
import { useSyncStore } from '@/store/syncStore'
import { waInvoiceReady } from '@/lib/whatsapp/links'
import type { Invoice } from '@/types'

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const printRef = useRef<HTMLDivElement>(null)
  const { isOnline } = useSyncStore()

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (!id) return null
      if (!isOnline) {
        const r = await db.invoices.filter((inv) => inv.local_id === id || inv.server_id === id).first()
        return r as unknown as Invoice | undefined
      }
      const { data } = await supabase.from('invoices').select('*').eq('id', id).single()
      return data as Invoice | null
    },
    enabled: !!id,
  })

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice?.invoice_number}`,
  })

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>
  if (!invoice) return <div className="text-center py-16 text-gray-400">Invoice not found.</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/invoicing" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 px-3 py-2 rounded-lg">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-maroon-500 hover:bg-maroon-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
        <WAButton
          href={waInvoiceReady({
            patientName: invoice.patient_id,
            invoiceNumber: invoice.invoice_number,
            total: invoice.total,
            phone: '03000000000',
          })}
          label="Send on WhatsApp"
        />
      </div>
      <div ref={printRef}>
        <InvoicePrint invoice={invoice} />
      </div>
    </div>
  )
}
