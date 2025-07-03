import { useAuthStore } from '../store/authStore'
import { LoginCredentials } from '../types/index'

/**
 * Custom hook for authentication operations
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    updateUser,
    clearError,
    hasPermission,
    hasRole,
    canAccess,
    isTokenExpired,
  } = useAuthStore()

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  const handleSignup = async (credentials: any) => {
    try {
      await signup(credentials)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      }
    }
  }

  const handleLogout = () => {
    logout()
  }

  const isAdmin = () => {
    return hasRole('admin') || hasRole('super_admin')
  }

  const isSuperAdmin = () => {
    return hasRole('super_admin')
  }

  const getUserDisplayName = () => {
    if (!user) return 'Guest'
    return user.fullName || user.email
  }

  const getUserInitials = () => {
    if (!user) return 'G'
    const fullName = user.fullName || ''
    const nameParts = fullName.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    return fullName.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()
  }

  const needsTokenRefresh = () => {
    return isAuthenticated && isTokenExpired()
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    refreshToken,
    updateUser,
    clearError,
    
    // Permission checks
    hasPermission,
    hasRole,
    canAccess,
    isAdmin,
    isSuperAdmin,
    
    // Utilities
    getUserDisplayName,
    getUserInitials,
    needsTokenRefresh,
    isTokenExpired,
  }
} 