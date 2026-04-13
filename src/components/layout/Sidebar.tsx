import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, ClipboardList, AlertTriangle,
  BedDouble, Radio, Receipt, FileText, BarChart3,
  Globe, Settings, ChevronLeft, ChevronRight, UserCheck, UsersRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AKMLogo } from '@/components/shared/AKMLogo'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { ROLE_PERMISSIONS } from '@/types'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  permission: keyof typeof ROLE_PERMISSIONS[UserRole]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',        to: '/dashboard',     icon: LayoutDashboard, permission: 'canAccessAdmin' },
  { label: 'Patients',         to: '/patients',      icon: Users,           permission: 'canAccessOPD' },
  { label: 'OPD Tokens',       to: '/opd',           icon: ClipboardList,   permission: 'canAccessOPD' },
  { label: 'Emergency (ER)',   to: '/er',            icon: AlertTriangle,   permission: 'canAccessER' },
  { label: 'Indoor (IPD)',     to: '/ipd',           icon: BedDouble,       permission: 'canAccessIPD' },
  { label: 'Ultrasound',       to: '/ultrasound',    icon: Radio,           permission: 'canAccessUltrasound' },
  { label: 'Invoicing',        to: '/invoicing',     icon: Receipt,         permission: 'canAccessInvoicing' },
  { label: 'Certificates',     to: '/certificates',  icon: FileText,        permission: 'canAccessCertificates' },
  { label: 'Accounts',         to: '/accounts',      icon: BarChart3,       permission: 'canAccessAccounts' },
  { label: 'Online Bookings',  to: '/bookings',      icon: Globe,           permission: 'canAccessPortal' },
  { label: 'Doctors',          to: '/doctors',       icon: UserCheck,       permission: 'canManageDoctors' },
  { label: 'HR',               to: '/hr',            icon: UsersRound,      permission: 'canAccessHR' },
  { label: 'Admin',            to: '/admin',         icon: Settings,        permission: 'canAccessAdmin' },
]

export function Sidebar() {
  const { user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const userRole = user?.role as UserRole | undefined

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!userRole) return false
    return ROLE_PERMISSIONS[userRole][item.permission as keyof typeof ROLE_PERMISSIONS[UserRole]]
  })

  return (
    <aside
      className={cn(
        'sidebar fixed inset-y-0 left-0 z-40 flex flex-col bg-maroon-500 text-white transition-all duration-300 no-print',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-maroon-600">
        <AKMLogo size={36} className="flex-shrink-0" />
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-gold-400 leading-tight truncate">
              Alim Khatoon
            </p>
            <p className="text-xs text-white/70 truncate">Medicare HMS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-maroon-600',
                isActive ? 'bg-maroon-700 text-gold-400 font-medium' : 'text-white/85',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-full py-3 border-t border-maroon-600 hover:bg-maroon-600 transition-colors"
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <ChevronLeft className="w-4 h-4" />
            <span>Collapse</span>
          </div>
        )}
      </button>
    </aside>
  )
}
