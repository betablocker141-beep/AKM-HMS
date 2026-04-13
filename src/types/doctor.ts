export interface Doctor {
  id: string
  name: string
  specialty: string
  phone: string
  whatsapp_number: string | null
  share_percent: number
  is_active: boolean
  // Dexie extras
  sync_status?: 'synced' | 'pending' | 'conflict'
  local_id?: string
  server_id?: string | null
}
