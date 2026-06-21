import { create } from 'zustand'

export interface User {
  id: string
  fullName: string
  email: string
  role: string
  isVerified: boolean
  phoneNumber?: string
  savedAmount?: number
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  notifications: Notification[]
  error: string | null
  loading: boolean
  initialized: boolean
  login: (data: any) => Promise<User>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  clearNotifications: () => Promise<void>
  updateProfile: (data: { fullName: string; phoneNumber: string }) => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  notifications: [],
  error: null,
  loading: false,
  initialized: false,

  login: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (!response.ok) {
        throw new Error(res.error || 'Login failed')
      }

      set({
        user: res.user,
        isAuthenticated: true,
        loading: false,
      })

      // Fetch user notifications after login
      await get().checkSession()

      return res.user
    } catch (err: any) {
      set({ error: err.message || 'Login failed', loading: false })
      throw err
    }
  },

  register: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (!response.ok) {
        throw new Error(res.error || 'Registration failed')
      }
      set({ loading: false })
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', loading: false })
      throw err
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      set({
        user: null,
        isAuthenticated: false,
        notifications: [],
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  checkSession: async () => {
    try {
      const sessionRes = await fetch('/api/auth/me')
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json()
        if (sessionData.user) {
          // Fetch notifications
          let notifications: Notification[] = []
          try {
            const notifRes = await fetch('/api/notification')
            if (notifRes.ok) {
              notifications = await notifRes.json()
            }
          } catch {
            // Silence notification fetch failures
          }

          set({
            user: sessionData.user,
            isAuthenticated: true,
            notifications,
            initialized: true,
          })
          return
        }
      }
      set({ user: null, isAuthenticated: false, initialized: true })
    } catch {
      set({ user: null, isAuthenticated: false, initialized: true })
    }
  },

  markNotificationRead: async (id) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))

    // In a full production system, we'd make a PATCH/POST request to mark it read in SQL:
    // await fetch(`/api/notification/${id}/read`, { method: 'PATCH' })
  },

  clearNotifications: async () => {
    set({ notifications: [] })
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await response.json()
      if (!response.ok) {
        throw new Error(res.error || 'Failed to update profile')
      }
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
        loading: false,
      }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile', loading: false })
      throw err
    }
  },
}))

// Custom hook helper that triggers checkSession on first load if not initialized
import { useEffect } from 'react'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    if (!store.initialized && !store.loading) {
      store.checkSession()
    }
  }, [store.initialized, store.loading, store.checkSession])

  return store
}
