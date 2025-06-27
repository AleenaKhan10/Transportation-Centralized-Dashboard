import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { AuthState, User, LoginCredentials, Permission } from '../types/index'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: any) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  clearError: () => void
  
  // Permission checking
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  canAccess: (resource: string, action: string) => boolean
  
  // Token management
  setToken: (token: string, refreshToken?: string) => void
  clearTokens: () => void
  isTokenExpired: () => boolean
}

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const COOKIE_OPTIONS = {
  secure: import.meta.env.PROD,
  sameSite: 'strict' as const,
  expires: 7, // 7 days
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set((state) => ({
          ...state,
          isLoading: true,
          error: null
        }))

        try {
          // Import dynamically to avoid circular dependency
          const { mockAuthService } = await import('../services/authService')
          const response = await mockAuthService.login(credentials)
          const { user, token, refreshToken } = response.data

          // Store tokens securely
          get().setToken(token, refreshToken)

          set((state) => ({
            ...state,
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }))
        } catch (error: any) {
          set((state) => ({
            ...state,
            isLoading: false,
            error: error.message || 'Login failed',
            isAuthenticated: false
          }))
          throw error
        }
      },

      // Signup action
      signup: async (credentials: any) => {
        set((state) => ({
          ...state,
          isLoading: true,
          error: null
        }))

        try {
          // Import dynamically to avoid circular dependency
          const { mockAuthService } = await import('../services/authService')
          await mockAuthService.signup(credentials)

          set((state) => ({
            ...state,
            isLoading: false,
            error: null
          }))
        } catch (error: any) {
          set((state) => ({
            ...state,
            isLoading: false,
            error: error.message || 'Signup failed'
          }))
          throw error
        }
      },

      // Logout action
      logout: () => {
        // Clear tokens from cookies
        get().clearTokens()

        // Call logout API (fire and forget)
        import('../services/authService').then(({ mockAuthService }) => {
          mockAuthService.logout().catch(() => {
            // Ignore errors on logout
          })
        })

        set((state) => ({
          ...state,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        }))
      },

      // Refresh token action
      refreshToken: async () => {
        const refreshToken = Cookies.get(REFRESH_TOKEN_KEY)
        if (!refreshToken) {
          get().logout()
          return
        }

        try {
          const { mockAuthService } = await import('../services/authService')
          const response = await mockAuthService.refreshToken(refreshToken)
          const { token: newToken, refreshToken: newRefreshToken } = response.data

          get().setToken(newToken, newRefreshToken)

          set((state) => ({
            ...state,
            token: newToken,
            error: null
          }))
        } catch (error) {
          get().logout()
          throw error
        }
      },

      // Update user action
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },

      // Clear error action
      clearError: () => {
        set((state) => ({
          ...state,
          error: null
        }))
      },

      // Permission checking functions
      hasPermission: (permission: string) => {
        const { user } = get()
        if (!user) return false

        return user.permissions.some(
          (p: Permission) => p.slug === permission || p.slug === 'manage_all'
        )
      },

      hasRole: (role: string) => {
        const { user } = get()
        if (!user) return false

        return user.role.slug === role || user.role.slug === 'super_admin'
      },

      canAccess: (resource: string, action: string) => {
        const { user } = get()
        if (!user) return false

        return user.permissions.some(
          (p: Permission) => 
            (p.resource === resource && p.action === action) ||
            p.slug === 'manage_all'
        )
      },

      // Token management
      setToken: (token: string, refreshToken?: string) => {
        // Store in HTTP-only cookies for security
        Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS)
        
        if (refreshToken) {
          Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
            ...COOKIE_OPTIONS,
            expires: 30, // Refresh token lasts longer
          })
        }
      },

      clearTokens: () => {
        Cookies.remove(TOKEN_KEY)
        Cookies.remove(REFRESH_TOKEN_KEY)
      },

      isTokenExpired: () => {
        const { token } = get()
        if (!token) return true

        try {
          // Decode JWT token to check expiry
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          return payload.exp < currentTime
        } catch {
          return true
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Get token from cookies on rehydration
        const token = Cookies.get(TOKEN_KEY)
        if (token && state) {
          state.token = token
          // Validate token expiry
          if (state.isTokenExpired()) {
            state.logout()
          }
        }
      },
    }
  )
) 