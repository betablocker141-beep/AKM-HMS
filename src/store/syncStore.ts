import { create } from 'zustand'

interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  lastSyncAt: string | null
  setOnline: (online: boolean) => void
  setSyncing: (syncing: boolean) => void
  setPendingCount: (count: number) => void
  setLastSyncAt: (at: string) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: navigator.onLine,
  isSyncing: false,
  pendingCount: 0,
  lastSyncAt: null,
  setOnline: (online) => set({ isOnline: online }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setLastSyncAt: (at) => set({ lastSyncAt: at }),
}))
