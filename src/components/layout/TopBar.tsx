import { Wifi, WifiOff, RefreshCw, LogOut, User, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useSyncStore } from '@/store/syncStore'
import { runSync } from '@/lib/sync/engine'
import { formatDateTime } from '@/lib/utils'

export function TopBar() {
  const { user, logout } = useAuthStore()
  const { isOnline, isSyncing, pendingCount, lastSyncAt } = useSyncStore()

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="offline-banner no-print">
          <WifiOff className="inline w-4 h-4 mr-1" />
          Working offline — data will sync when connected
        </div>
      )}

      <header className="top-bar no-print sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4">
        {/* Left: sync status */}
        <div className="flex items-center gap-3 text-sm">
          {isOnline ? (
            <span className="flex items-center gap-1.5 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">Online</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          )}

          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pendingCount} pending sync
            </span>
          )}

          {isOnline && (
            <button
              onClick={() => runSync()}
              disabled={isSyncing}
              className="text-gray-500 hover:text-maroon-500 transition-colors"
              title="Sync now"
            >
              <RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin')} />
            </button>
          )}

          {lastSyncAt && (
            <span className="hidden md:inline text-xs text-gray-400">
              Last sync: {formatDateTime(lastSyncAt)}
            </span>
          )}
        </div>

        {/* Right: user menu */}
        <div className="flex items-center gap-3">
          <button className="relative text-gray-500 hover:text-maroon-500 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-maroon-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="font-medium text-gray-800 leading-tight">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
    </>
  )
}
