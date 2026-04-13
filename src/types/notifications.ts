export type NotificationChannel = 'whatsapp' | 'sms'
export type NotificationStatus = 'sent' | 'failed' | 'pending'

export interface NotificationLog {
  id: string
  patient_id: string | null
  channel: NotificationChannel
  message: string
  status: NotificationStatus
  sent_at: string
}
