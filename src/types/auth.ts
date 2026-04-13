export type UserRole = 'admin' | 'receptionist' | 'doctor' | 'radiologist' | 'accountant'

export interface AppUser {
  id: string
  email: string
  name: string
  role: UserRole
  doctor_id: string | null
  created_at: string
}

export interface RolePermissions {
  canAccessOPD: boolean
  canAccessER: boolean
  canAccessIPD: boolean
  canAccessUltrasound: boolean
  canAccessInvoicing: boolean
  canAccessCertificates: boolean
  canAccessAccounts: boolean
  canAccessAdmin: boolean
  canAccessPortal: boolean
  canManageDoctors: boolean
  canManageUsers: boolean
  canFinalizeUsReports: boolean
  canMarkEarningsPaid: boolean
  canAccessHR: boolean
  canEditDelete: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canAccessOPD: true,
    canAccessER: true,
    canAccessIPD: true,
    canAccessUltrasound: true,
    canAccessInvoicing: true,
    canAccessCertificates: true,
    canAccessAccounts: true,
    canAccessAdmin: true,
    canAccessPortal: true,
    canManageDoctors: true,
    canManageUsers: true,
    canFinalizeUsReports: true,
    canMarkEarningsPaid: true,
    canAccessHR: true,
    canEditDelete: true,
  },
  receptionist: {
    canAccessOPD: true,
    canAccessER: true,
    canAccessIPD: true,
    canAccessUltrasound: false,
    canAccessInvoicing: true,
    canAccessCertificates: true,
    canAccessAccounts: false,
    canAccessAdmin: false,
    canAccessPortal: true,
    canManageDoctors: false,
    canManageUsers: false,
    canFinalizeUsReports: false,
    canMarkEarningsPaid: false,
    canAccessHR: false,
    canEditDelete: false,
  },
  doctor: {
    canAccessOPD: true,
    canAccessER: true,
    canAccessIPD: true,
    canAccessUltrasound: false,
    canAccessInvoicing: false,
    canAccessCertificates: true,
    canAccessAccounts: false,
    canAccessAdmin: false,
    canAccessPortal: false,
    canManageDoctors: false,
    canManageUsers: false,
    canFinalizeUsReports: false,
    canMarkEarningsPaid: false,
    canAccessHR: false,
    canEditDelete: false,
  },
  radiologist: {
    canAccessOPD: false,
    canAccessER: false,
    canAccessIPD: false,
    canAccessUltrasound: true,
    canAccessInvoicing: false,
    canAccessCertificates: false,
    canAccessAccounts: false,
    canAccessAdmin: false,
    canAccessPortal: false,
    canManageDoctors: false,
    canManageUsers: false,
    canFinalizeUsReports: true,
    canMarkEarningsPaid: false,
    canAccessHR: false,
    canEditDelete: false,
  },
  accountant: {
    canAccessOPD: false,
    canAccessER: false,
    canAccessIPD: false,
    canAccessUltrasound: false,
    canAccessInvoicing: true,
    canAccessCertificates: false,
    canAccessAccounts: true,
    canAccessAdmin: false,
    canAccessPortal: false,
    canManageDoctors: false,
    canManageUsers: false,
    canFinalizeUsReports: false,
    canMarkEarningsPaid: true,
    canAccessHR: false,
    canEditDelete: false,
  },
}
