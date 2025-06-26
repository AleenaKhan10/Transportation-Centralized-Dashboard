import axios, { AxiosResponse } from 'axios'
import { 
  LoginCredentials, 
  SignupCredentials,
  AuthResponse, 
  User, 
  ApiResponse 
} from '../types/index'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> => {
    return apiClient.post('/auth/login', credentials)
  },

  // Sign up user
  signup: async (credentials: SignupCredentials): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.post('/auth/signup', credentials)
  },

  // Logout user
  logout: async (): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/logout')
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AxiosResponse<AuthResponse>> => {
    return apiClient.post('/auth/refresh', { refreshToken })
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get('/auth/me')
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.put('/auth/profile', userData)
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/reset-password', { token, password })
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword })
  },

  // Verify email address
  verifyEmail: async (token: string): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/verify-email', { token })
  },

  // Resend verification email
  resendVerification: async (): Promise<AxiosResponse<ApiResponse>> => {
    return apiClient.post('/auth/resend-verification')
  },

  // Check if email exists
  checkEmail: async (email: string): Promise<AxiosResponse<ApiResponse<{ exists: boolean }>>> => {
    return apiClient.post('/auth/check-email', { email })
  },

  // Validate token
  validateToken: async (token: string): Promise<AxiosResponse<ApiResponse<{ valid: boolean }>>> => {
    return apiClient.post('/auth/validate-token', { token })
  },
}

// Mock Auth Service for Development
export const mockAuthService = {
  login: async (credentials: LoginCredentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (credentials.email === 'admin@agelogistics.com' && credentials.password === 'admin123') {
      const mockUser: User = {
        id: '1',
        email: 'admin@agelogistics.com',
        fullName: 'Age Logistics Admin',
        phone: '+1234567890',
        avatar: undefined,
        role: {
          id: '1',
          name: 'Super Admin',
          slug: 'super_admin',
          description: 'Full system access',
          level: 100,
          permissions: []
        },
        permissions: [
          {
            id: '1',
            name: 'Manage All',
            slug: 'manage_all',
            resource: 'system',
            action: 'manage',
            description: 'Full system access'
          }
        ],
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString()
      }

      return {
        data: {
          user: mockUser,
          token: 'mock_jwt_token_12345',
          refreshToken: 'mock_refresh_token_12345',
          expiresIn: 3600
        }
      } as any
    }

    throw new Error('Invalid credentials')
  },

  signup: async (credentials: SignupCredentials) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock validation
    if (!credentials.email || !credentials.password || !credentials.fullName) {
      throw new Error('All fields are required')
    }

    if (credentials.email === 'admin@agelogistics.com') {
      throw new Error('Email already exists')
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      fullName: credentials.fullName,
      phone: undefined,
      avatar: undefined,
      role: {
        id: '3',
        name: 'Pending User',
        slug: 'pending',
        description: 'Pending approval',
        level: 0,
        permissions: []
      },
      permissions: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return {
      data: mockUser
    } as any
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { data: { success: true } } as any
  },

  refreshToken: async (_refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        token: 'new_mock_jwt_token_12345',
        refreshToken: 'new_mock_refresh_token_12345',
        expiresIn: 3600
      }
    } as any
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    return {
      data: {
        user: JSON.parse(localStorage.getItem('auth_user') || '{}')
      }
    } as any
  },

  updateProfile: async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
    const updatedUser = { ...currentUser, ...userData, updatedAt: new Date().toISOString() }
    
    localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    
    return {
      data: updatedUser
    } as any
  },

  forgotPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (!email) {
      throw new Error('Email is required')
    }

    return {
      data: { 
        success: true,
        message: 'Password reset instructions sent to your email'
      }
    } as any
  },

  resetPassword: async (token: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (!token || !password) {
      throw new Error('Token and password are required')
    }

    return {
      data: { 
        success: true,
        message: 'Password reset successfully'
      }
    } as any
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (!currentPassword || !newPassword) {
      throw new Error('Current and new passwords are required')
    }

    return {
      data: { 
        success: true,
        message: 'Password changed successfully'
      }
    } as any
  }
}

// Export the configured axios instance for other services
export { apiClient } 