// Auto-generated Supabase Database types
// This mirrors the SQL schema defined in supabase/schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          mrn: string
          name: string
          dob: string | null
          gender: string
          phone: string
          address: string | null
          blood_group: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['patients']['Insert']>
      }
      doctors: {
        Row: {
          id: string
          name: string
          specialty: string
          phone: string
          whatsapp_number: string | null
          share_percent: number
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['doctors']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['doctors']['Insert']>
      }
      opd_tokens: {
        Row: {
          id: string
          token_number: string
          patient_id: string
          doctor_id: string
          date: string
          time_slot: string
          status: string
          type: string
          booking_source: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['opd_tokens']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['opd_tokens']['Insert']>
      }
      er_visits: {
        Row: {
          id: string
          patient_id: string
          token_number: string
          visit_date: string
          chief_complaint: string
          triage_level: number
          bp: string | null
          pulse: number | null
          temp: number | null
          spo2: number | null
          rr: number | null
          doctor_id: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['er_visits']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['er_visits']['Insert']>
      }
      ipd_admissions: {
        Row: {
          id: string
          patient_id: string
          admit_date: string
          discharge_date: string | null
          ward: string
          bed_number: string
          admitting_doctor_id: string
          diagnosis: string | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ipd_admissions']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ipd_admissions']['Insert']>
      }
      ipd_procedures: {
        Row: {
          id: string
          admission_id: string
          procedure_name: string
          procedure_date: string
          doctor_id: string
          fee: number
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['ipd_procedures']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['ipd_procedures']['Insert']>
      }
      ultrasound_reports: {
        Row: {
          id: string
          patient_id: string
          study_type: string
          study_date: string
          referring_doctor: string | null
          radiologist_id: string | null
          findings: string
          impression: string
          recommendations: string | null
          images_urls: string[]
          status: string
          obstetric_data: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ultrasound_reports']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ultrasound_reports']['Insert']>
      }
      invoices: {
        Row: {
          id: string
          patient_id: string
          visit_type: string
          visit_ref_id: string | null
          items: Json
          subtotal: number
          discount: number
          discount_type: string
          tax: number
          total: number
          paid_amount: number
          payment_method: string | null
          status: string
          invoice_number: string
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
        }
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>
      }
      birth_certificates: {
        Row: {
          id: string
          serial_number: string
          patient_id: string | null
          baby_name: string
          dob: string
          time_of_birth: string
          gender: string
          weight_kg: number | null
          mother_name: string
          mother_cnic: string | null
          father_name: string
          father_cnic: string | null
          doctor_id: string
          ward: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['birth_certificates']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['birth_certificates']['Insert']>
      }
      death_certificates: {
        Row: {
          id: string
          serial_number: string
          patient_id: string | null
          patient_name: string
          patient_cnic: string | null
          dod: string
          time_of_death: string
          cause_of_death_primary: string
          cause_of_death_contributing: string | null
          doctor_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['death_certificates']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['death_certificates']['Insert']>
      }
      doctor_earnings: {
        Row: {
          id: string
          doctor_id: string
          month: number
          year: number
          total_opd: number
          total_er: number
          total_ipd: number
          total_procedures: number
          gross_earnings: number
          share_amount: number
          paid: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['doctor_earnings']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['doctor_earnings']['Insert']>
      }
      notifications_log: {
        Row: {
          id: string
          patient_id: string | null
          channel: string
          message: string
          status: string
          sent_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications_log']['Row'], 'id' | 'sent_at'> & {
          id?: string
          sent_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications_log']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          doctor_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      online_bookings: {
        Row: {
          id: string
          patient_name: string
          phone: string
          doctor_id: string | null
          department: string
          preferred_date: string
          preferred_time_slot: string
          chief_complaint: string | null
          is_new_patient: boolean
          status: string
          rejection_reason: string | null
          token_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['online_bookings']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['online_bookings']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_opd_token: {
        Args: { token_date: string }
        Returns: string
      }
      get_next_er_token: {
        Args: { token_date: string }
        Returns: string
      }
      get_next_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
