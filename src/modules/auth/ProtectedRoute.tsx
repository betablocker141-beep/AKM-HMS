import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { UserRole } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'

interface ProtectedRouteProps {
  permission?: keyof typeof ROLE_PERMISSIONS[UserRole]
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (permission) {
    const perms = ROLE_PERMISSIONS[user.role as UserRole]
    if (!perms || !perms[permission]) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <Outlet />
}
