import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
  fallbackPath?: string
  requireAll?: boolean // If true, user must have ALL permissions/roles, if false, just one
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login',
  requireAll = false,
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth()
  const location = useLocation()

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-dark-300">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission))

    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check roles if required
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every(role => hasRole(role))
      : requiredRoles.some(role => hasRole(role))

    if (!hasRequiredRoles) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

// Higher-order component for wrapping components with protection
export const withAuth = (
  Component: React.ComponentType<any>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  return (props: any) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// Hook for conditional rendering based on permissions
export const usePermissionGuard = () => {
  const { hasPermission, hasRole } = useAuth()

  const canRender = (permissions?: string[], roles?: string[], requireAll = false) => {
    let hasPermissionAccess = true
    let hasRoleAccess = true

    if (permissions && permissions.length > 0) {
      hasPermissionAccess = requireAll
        ? permissions.every(permission => hasPermission(permission))
        : permissions.some(permission => hasPermission(permission))
    }

    if (roles && roles.length > 0) {
      hasRoleAccess = requireAll
        ? roles.every(role => hasRole(role))
        : roles.some(role => hasRole(role))
    }

    return hasPermissionAccess && hasRoleAccess
  }

  return { canRender }
} 