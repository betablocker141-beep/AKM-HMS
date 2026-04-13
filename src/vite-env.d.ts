/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_HOSPITAL_PHONE: string
  readonly VITE_HOSPITAL_WHATSAPP: string
  readonly VITE_HOSPITAL_NAME: string
  readonly VITE_HOSPITAL_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
