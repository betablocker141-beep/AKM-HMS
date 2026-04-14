import { useState, useRef, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReactToPrint } from 'react-to-print'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Download, Printer, CheckCircle, CalendarDays, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AKMLogo } from '@/components/shared/AKMLogo'
import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/dexie/schema'
import { formatCurrency, formatDate, todayString } from '@/lib/utils'
import { fetchWithFallback } from '@/lib/utils/fetchWithFallback'
import { fetchActiveDoctors } from '@/lib/utils/doctorUtils'
import type { Doctor, Invoice, OpdToken, ErVisit, IpdAdmission } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

interface MonthlyRevenue { month: string; opd: number; er: number; ipd: number; us: number }

interface ComputedEarning {
  doctor: Doctor
  total_opd: number
  total_er: number
  total_ipd: number
  total_us: number
  gross: number
  share_amount: number
  paid: boolean
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash', card: 'Card', bank_transfer: 'Bank Transfer',
  jazzcash: 'JazzCash', easypaisa: 'EasyPaisa',
}
const TYPE_COLORS: Record<string, string> = {
  opd: 'bg-blue-100 text-blue-700',
  er:  'bg-orange-100 text-orange-700',
  ipd: 'bg-purple-100 text-purple-700',
  us:  'bg-yellow-100 text-yellow-700',
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

async function fetchRevenueSummary(year: number): Promise<MonthlyRevenue[]> {
  const monthly: Record<number, MonthlyRevenue> = {}
  for (let m = 1; m <= 12; m++) monthly[m] = { month: MONTHS[m - 1], opd: 0, er: 0, ipd: 0, us: 0 }

  const data = await fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('visit_type, paid_amount, created_at')
        .gte('created_at', `${year}-01-01`)
        .lt('created_at', `${year + 1}-01-01`)
      if (error) throw error
      return (data ?? []) as { visit_type: string; paid_amount: number; created_at: string }[]
    },
    async () => {
      const all = await db.invoices.orderBy('created_at').toArray()
      return all.filter(i => i.created_at.startsWith(String(year))) as unknown as { visit_type: string; paid_amount: number; created_at: string }[]
    },
  )

  data.forEach(inv => {
    const m = new Date(inv.created_at).getMonth() + 1
    if (monthly[m]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(monthly[m] as any)[inv.visit_type] = ((monthly[m] as any)[inv.visit_type] ?? 0) + (inv.paid_amount ?? 0)
    }
  })
  return Object.values(monthly)
}

async function fetchTotals() {
  const today = new Date()
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
  const { data: inv } = await supabase.from('invoices').select('total, paid_amount, status').gte('created_at', monthStart)
  const monthRev = (inv ?? []).reduce((s, i) => s + (i.paid_amount ?? 0), 0)
  const outstanding = (inv ?? []).filter(i => i.status !== 'paid').reduce((s, i) => s + Math.max(0, i.total - i.paid_amount), 0)
  const { count: opdCount } = await supabase.from('opd_tokens').select('*', { count: 'exact', head: true }).gte('created_at', monthStart)
  const { count: erCount }  = await supabase.from('er_visits').select('*', { count: 'exact', head: true }).gte('created_at', monthStart)
  const { count: ipdCount } = await supabase.from('ipd_admissions').select('*', { count: 'exact', head: true }).gte('created_at', monthStart)
  return { monthRev, outstanding, opdCount: opdCount ?? 0, erCount: erCount ?? 0, ipdCount: ipdCount ?? 0 }
}

async function fetchDailyInvoices(date: string): Promise<Invoice[]> {
  const next = new Date(date); next.setDate(next.getDate() + 1)
  const nextStr = next.toISOString().substring(0, 10)
  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('invoices').select('*')
        .gte('created_at', date).lt('created_at', nextStr)
        .order('created_at')
      if (error) throw error
      return (data ?? []) as Invoice[]
    },
    async () => {
      const all = await db.invoices.orderBy('created_at').toArray()
      return all.filter(i => i.created_at.startsWith(date)) as unknown as Invoice[]
    },
  )
}

async function fetchPatientNames(patientIds: string[]): Promise<Record<string, string>> {
  if (patientIds.length === 0) return {}
  const map: Record<string, string> = {}
  try {
    const { data } = await supabase.from('patients').select('id, name').in('id', patientIds)
    ;(data ?? []).forEach((p: { id: string; name: string }) => { map[p.id] = p.name })
  } catch {
    const all = await db.patients.toArray()
    all.forEach(p => {
      map[p.local_id] = p.name
      if (p.server_id) map[p.server_id] = p.name
    })
  }
  return map
}

async function fetchMonthInvoices(month: number, year: number): Promise<Invoice[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const next = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`
  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('invoices').select('patient_id, visit_type, paid_amount, total, created_at')
        .gte('created_at', start).lt('created_at', next)
      if (error) throw error
      return (data ?? []) as Invoice[]
    },
    async () => {
      const all = await db.invoices.orderBy('created_at').toArray()
      return all.filter(i => i.created_at >= start && i.created_at < next) as unknown as Invoice[]
    },
  )
}

async function fetchMonthOpdTokens(month: number, year: number): Promise<OpdToken[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end   = `${year}-${String(month).padStart(2, '0')}-31`
  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('opd_tokens').select('patient_id, doctor_id, date')
        .gte('date', start).lte('date', end)
      if (error) throw error
      return (data ?? []) as OpdToken[]
    },
    async () => {
      const all = await db.opd_tokens.where('date').between(start, end, true, true).toArray()
      return all as unknown as OpdToken[]
    },
  )
}

async function fetchMonthErVisits(month: number, year: number): Promise<ErVisit[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end   = `${year}-${String(month).padStart(2, '0')}-31`
  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('er_visits').select('patient_id, doctor_id, visit_date')
        .gte('visit_date', start).lte('visit_date', end)
      if (error) throw error
      return (data ?? []) as ErVisit[]
    },
    async () => {
      const all = await db.er_visits.toArray()
      return all.filter(v => v.visit_date >= start && v.visit_date <= end) as unknown as ErVisit[]
    },
  )
}

async function fetchIpdAdmissions(): Promise<IpdAdmission[]> {
  return fetchWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('ipd_admissions').select('patient_id, admitting_doctor_id')
      if (error) throw error
      return (data ?? []) as IpdAdmission[]
    },
    () => db.ipd_admissions.toArray() as unknown as Promise<IpdAdmission[]>,
  )
}

async function fetchPaidSet(month: number, year: number): Promise<Set<string>> {
  try {
    const { data } = await supabase
      .from('doctor_earnings').select('doctor_id')
      .eq('month', month).eq('year', year).eq('paid', true)
    return new Set((data ?? []).map((r: { doctor_id: string }) => r.doctor_id))
  } catch { return new Set() }
}

// ── Earnings computation ──────────────────────────────────────────────────────

function computeEarnings(
  invoices: Invoice[],
  _opdTokens: OpdToken[],
  _erVisits: ErVisit[],
  _ipdAdmissions: IpdAdmission[],
  doctors: Doctor[],
  paidSet: Set<string>,
): ComputedEarning[] {
  const totals = new Map<string, { opd: number; er: number; ipd: number; us: number }>()
  doctors.forEach(d => totals.set(d.id, { opd: 0, er: 0, ipd: 0, us: 0 }))

  invoices.forEach(inv => {
    // Use doctor_id stored directly on the invoice (reliable direct link)
    const docId = (inv as Invoice & { doctor_id?: string | null }).doctor_id
    if (!docId || !totals.has(docId)) return

    const amount = inv.paid_amount > 0 ? inv.paid_amount : (inv.total ?? 0)
    const b = totals.get(docId)!
    if      (inv.visit_type === 'opd') b.opd += amount
    else if (inv.visit_type === 'er')  b.er  += amount
    else if (inv.visit_type === 'ipd') b.ipd += amount
    else if (inv.visit_type === 'us')  b.us  += amount
  })

  return doctors
    .map(d => {
      const t = totals.get(d.id)!
      const gross = t.opd + t.er + t.ipd + t.us
      return { doctor: d, total_opd: t.opd, total_er: t.er, total_ipd: t.ipd, total_us: t.us, gross, share_amount: Math.round(gross * d.share_percent / 100), paid: paidSet.has(d.id) }
    })
    .filter(e => e.gross > 0)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccountsPage() {
  const [selectedYear,  setSelectedYear]  = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [dailyDate,     setDailyDate]     = useState(todayString())
  const qc = useQueryClient()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Daily-Collection-${dailyDate}`,
  })

  const { data: doctors = [] } = useQuery({ queryKey: ['doctors-active'], queryFn: fetchActiveDoctors })
  const { data: totals }       = useQuery({ queryKey: ['accounts-totals'], queryFn: fetchTotals })

  const { data: revenue = [], isLoading: loadingRev } = useQuery({
    queryKey: ['revenue-monthly', selectedYear],
    queryFn:  () => fetchRevenueSummary(selectedYear),
  })

  const { data: dailyInvoices = [], isLoading: loadingDaily } = useQuery({
    queryKey: ['daily-collection', dailyDate],
    queryFn:  () => fetchDailyInvoices(dailyDate),
  })

  const dailyPatientIds = useMemo(
    () => [...new Set(dailyInvoices.map(i => i.patient_id))],
    [dailyInvoices],
  )
  const { data: patientNames = {} } = useQuery({
    queryKey: ['daily-patient-names', dailyPatientIds.sort().join(',')],
    queryFn:  () => fetchPatientNames(dailyPatientIds),
    enabled:  dailyPatientIds.length > 0,
  })

  const { data: monthInvoices  = [], isLoading: loadingMI  } = useQuery({ queryKey: ['month-invoices',   selectedMonth, selectedYear], queryFn: () => fetchMonthInvoices(selectedMonth, selectedYear) })
  const { data: monthOpdTokens = [], isLoading: loadingOPD } = useQuery({ queryKey: ['month-opd-tokens', selectedMonth, selectedYear], queryFn: () => fetchMonthOpdTokens(selectedMonth, selectedYear) })
  const { data: monthErVisits  = [] }                         = useQuery({ queryKey: ['month-er-visits',  selectedMonth, selectedYear], queryFn: () => fetchMonthErVisits(selectedMonth, selectedYear) })
  const { data: ipdAdmissions  = [] }                         = useQuery({ queryKey: ['ipd-admissions'], queryFn: fetchIpdAdmissions, staleTime: 5 * 60_000 })
  const { data: paidSet = new Set<string>() }                 = useQuery({ queryKey: ['earnings-paid', selectedMonth, selectedYear], queryFn: () => fetchPaidSet(selectedMonth, selectedYear) })

  const loadingEarnings = loadingMI || loadingOPD

  const earnings = useMemo(
    () => computeEarnings(monthInvoices, monthOpdTokens, monthErVisits, ipdAdmissions, doctors, paidSet),
    [monthInvoices, monthOpdTokens, monthErVisits, ipdAdmissions, doctors, paidSet],
  )

  const markPaid = useMutation({
    mutationFn: async (e: ComputedEarning) => {
      await supabase.from('doctor_earnings').upsert({
        doctor_id: e.doctor.id, month: selectedMonth, year: selectedYear,
        total_opd: e.total_opd, total_er: e.total_er, total_ipd: e.total_ipd,
        total_procedures: 0, gross_earnings: e.gross, share_amount: e.share_amount, paid: true,
      }, { onConflict: 'doctor_id,month,year' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['earnings-paid'] }),
  })

  const exportExcel = () => {
    import('xlsx').then(({ utils, writeFile }) => {
      const ws = utils.json_to_sheet(earnings.map(e => ({
        Doctor: e.doctor.name, Month: `${MONTHS[selectedMonth - 1]} ${selectedYear}`,
        'OPD': e.total_opd, 'ER': e.total_er, 'IPD': e.total_ipd,
        'Gross': e.gross, 'Share %': `${e.doctor.share_percent}%`,
        'Share Amount': e.share_amount, Paid: e.paid ? 'Yes' : 'No',
      })))
      const wb = utils.book_new(); utils.book_append_sheet(wb, ws, 'Doctor Earnings')
      writeFile(wb, `AKM-Earnings-${MONTHS[selectedMonth - 1]}-${selectedYear}.xlsx`)
    })
  }

  // Daily summaries
  const dailyCollected  = dailyInvoices.reduce((s, i) => s + (i.paid_amount ?? 0), 0)
  const dailyTotal      = dailyInvoices.reduce((s, i) => s + (i.total ?? 0), 0)
  const dailyPending    = Math.max(0, dailyTotal - dailyCollected)
  const dailyByType     = dailyInvoices.reduce<Record<string, number>>((a, i) => { a[i.visit_type] = (a[i.visit_type] ?? 0) + (i.paid_amount ?? 0); return a }, {})
  const dailyByMethod   = dailyInvoices.reduce<Record<string, number>>((a, i) => { const m = i.payment_method ?? 'cash'; a[m] = (a[m] ?? 0) + (i.paid_amount ?? 0); return a }, {})

  const totalRevenue = revenue.reduce((s, r) => s + r.opd + r.er + r.ipd + r.us, 0)
  const earningsTotal = earnings.reduce((s, e) => s + e.share_amount, 0)

  return (
    <div>
      <PageHeader
        title="Accounts & Financial Reports"
        subtitle="Daily collection, revenue overview, and doctor earnings"
        actions={
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        }
      />

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Month Revenue',   value: formatCurrency(totals?.monthRev    ?? 0), color: 'text-maroon-600' },
          { label: 'Outstanding Dues',value: formatCurrency(totals?.outstanding ?? 0), color: 'text-red-600'    },
          { label: 'OPD Visits',      value: totals?.opdCount ?? '—',                  color: 'text-blue-600'   },
          { label: 'ER Visits',       value: totals?.erCount  ?? '—',                  color: 'text-orange-600' },
          { label: 'IPD Admitted',    value: totals?.ipdCount ?? '—',                  color: 'text-purple-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{kpi.label}</p>
            <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ── Daily Collection ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-maroon-500" />
            Daily Collection Report
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dailyDate}
              onChange={e => setDailyDate(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-maroon-400"
            />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {loadingDaily ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-green-600 font-medium">Total Collected</p>
                <p className="text-lg font-bold text-green-700 mt-0.5">{formatCurrency(dailyCollected)}</p>
                <p className="text-xs text-green-500">{dailyInvoices.length} invoice{dailyInvoices.length !== 1 ? 's' : ''}</p>
              </div>
              {(['opd','er','ipd','us'] as const).map(t => (
                <div key={t} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 font-medium uppercase">{t}</p>
                  <p className="text-lg font-bold text-gray-800 mt-0.5">{formatCurrency(dailyByType[t] ?? 0)}</p>
                </div>
              ))}
            </div>

            {/* Payment method breakdown */}
            {Object.keys(dailyByMethod).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(dailyByMethod).map(([method, amt]) => (
                  <span key={method} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium">
                    {PAYMENT_LABELS[method] ?? method}: {formatCurrency(amt)}
                  </span>
                ))}
                {dailyPending > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-xs font-medium">
                    Pending: {formatCurrency(dailyPending)}
                  </span>
                )}
              </div>
            )}

            {/* Printable area */}
            <div ref={printRef}>
              {/* Print-only header */}
              <div className="hidden print:block mb-6 text-center border-b-2 border-maroon-500 pb-4">
                <div className="flex justify-center mb-2"><AKMLogo size={48} /></div>
                <h2 className="text-lg font-bold text-maroon-700">ALIM KHATOON MEDICARE</h2>
                <p className="text-sm text-gray-600">Daily Collection Report — {formatDate(dailyDate)}</p>
                <div className="flex justify-center gap-6 mt-3 text-sm">
                  <span>Total Collected: <strong>{formatCurrency(dailyCollected)}</strong></span>
                  <span>Invoices: <strong>{dailyInvoices.length}</strong></span>
                  {dailyPending > 0 && <span className="text-red-600">Pending: <strong>{formatCurrency(dailyPending)}</strong></span>}
                </div>
              </div>

              {dailyInvoices.length === 0 ? (
                <p className="text-center py-8 text-gray-400">No invoices found for {formatDate(dailyDate)}.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[650px]">
                    <thead className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">#</th>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">Invoice</th>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">Patient</th>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">Type</th>
                        <th className="text-right px-3 py-2.5 font-medium text-gray-600">Total</th>
                        <th className="text-right px-3 py-2.5 font-medium text-gray-600">Paid</th>
                        <th className="text-right px-3 py-2.5 font-medium text-gray-600 print:hidden">Balance</th>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">Method</th>
                        <th className="text-left px-3 py-2.5 font-medium text-gray-600">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dailyInvoices.map((inv, idx) => {
                        const bal = (inv.total ?? 0) - (inv.paid_amount ?? 0)
                        return (
                          <tr key={inv.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                            <td className="px-3 py-2.5 font-mono text-xs text-maroon-600">{inv.invoice_number}</td>
                            <td className="px-3 py-2.5 font-medium text-gray-800">
                              {patientNames[inv.patient_id] ?? `${inv.patient_id.slice(0, 8)}…`}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${TYPE_COLORS[inv.visit_type] ?? 'bg-gray-100 text-gray-600'}`}>
                                {inv.visit_type}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right">{formatCurrency(inv.total)}</td>
                            <td className="px-3 py-2.5 text-right text-green-600 font-medium">{formatCurrency(inv.paid_amount)}</td>
                            <td className={`px-3 py-2.5 text-right text-sm print:hidden ${bal > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              {bal > 0 ? formatCurrency(bal) : '—'}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-gray-500 capitalize">
                              {PAYMENT_LABELS[inv.payment_method ?? ''] ?? inv.payment_method ?? '—'}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-gray-400">
                              {new Date(inv.created_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                      <tr className="font-semibold">
                        <td colSpan={4} className="px-3 py-2.5 text-gray-700">TOTAL ({dailyInvoices.length} invoices)</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(dailyTotal)}</td>
                        <td className="px-3 py-2.5 text-right text-green-700">{formatCurrency(dailyCollected)}</td>
                        <td className={`px-3 py-2.5 text-right print:hidden ${dailyPending > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {dailyPending > 0 ? formatCurrency(dailyPending) : '—'}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Print-only footer */}
              <div className="hidden print:block mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  {Object.entries(dailyByMethod).map(([m, a]) => (
                    <span key={m}>{PAYMENT_LABELS[m] ?? m}: {formatCurrency(a)}</span>
                  ))}
                </div>
                Printed: {new Date().toLocaleString('en-PK')} · AKM Hospital Management System
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Monthly Revenue Chart ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-maroon-500" />
            Monthly Revenue — {selectedYear}
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
            >
              {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="text-sm font-semibold text-maroon-600">Total: {formatCurrency(totalRevenue)}</span>
          </div>
        </div>
        {loadingRev ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="opd" name="OPD" fill="#8B0000" radius={[3,3,0,0]} />
              <Bar dataKey="er"  name="ER"  fill="#EA580C" radius={[3,3,0,0]} />
              <Bar dataKey="ipd" name="IPD" fill="#7C3AED" radius={[3,3,0,0]} />
              <Bar dataKey="us"  name="US"  fill="#D4AF37" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Doctor Earnings ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">Doctor Earnings</h3>
            <p className="text-xs text-gray-500 mt-0.5">Computed live from invoices linked to OPD tokens, ER visits &amp; IPD admissions</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
            >
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
            >
              {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {loadingEarnings ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : earnings.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="font-medium">No earnings data for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
            <p className="text-sm mt-1">Earnings are computed from invoices where a doctor is linked via OPD/ER/IPD records.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Doctor</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">OPD</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">ER</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">IPD</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Gross</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Share</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earnings.map(e => (
                    <tr key={e.doctor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {e.doctor.name}
                        <span className="text-xs text-gray-400 ml-1.5">({e.doctor.share_percent}%)</span>
                        <span className="text-xs text-gray-400 block">{e.doctor.specialty}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{e.total_opd > 0 ? formatCurrency(e.total_opd) : '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{e.total_er  > 0 ? formatCurrency(e.total_er)  : '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{e.total_ipd > 0 ? formatCurrency(e.total_ipd) : '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(e.gross)}</td>
                      <td className="px-4 py-3 text-right font-bold text-maroon-600">{formatCurrency(e.share_amount)}</td>
                      <td className="px-4 py-3 text-center">
                        {e.paid ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-4 h-4" /> Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => markPaid.mutate(e)}
                            disabled={markPaid.isPending}
                            className="text-xs bg-maroon-50 text-maroon-600 hover:bg-maroon-100 px-3 py-1 rounded font-medium disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                  <tr className="font-semibold text-gray-700">
                    <td className="px-4 py-2.5">Total Payouts</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(earnings.reduce((s,e) => s+e.total_opd, 0))}</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(earnings.reduce((s,e) => s+e.total_er,  0))}</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(earnings.reduce((s,e) => s+e.total_ipd, 0))}</td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(earnings.reduce((s,e) => s+e.gross,    0))}</td>
                    <td className="px-4 py-2.5 text-right text-maroon-600">{formatCurrency(earningsTotal)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * US invoices are not attributed to a specific doctor. OPD amounts matched via token on same day; ER via visit on same day; IPD via admitting doctor.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
