export interface HrEmployee {
  id: string
  name: string
  cnic: string | null
  phone: string
  designation: string
  department: string
  join_date: string
  salary: number
  address: string | null
  emergency_contact: string | null
  status: 'active' | 'inactive'
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}

export interface SalaryRecord {
  id: string
  employee_id: string
  month: string          // format: "2026-04" (YYYY-MM)
  basic_salary: number   // from employee.salary
  advance_taken: number  // money given as advance during month
  fine: number           // deductions/fines
  bonus: number          // any bonus
  net_salary: number     // basic_salary - advance_taken - fine + bonus
  status: 'pending' | 'paid'
  paid_date: string | null
  notes: string | null
  created_at: string
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
