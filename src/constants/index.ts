// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
}

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'auth_user',
  TOKEN_EXPIRY_BUFFER: 300, // 5 minutes in seconds
}

// Application
export const APP_CONFIG = {
  NAME: 'Age Logistics Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional Transportation Business Dashboard',
  COMPANY: 'Age Logistics',
}

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SHIPMENTS: '/dashboard/shipments',
  FLEET: '/dashboard/fleet',
  DRIVERS: '/dashboard/drivers',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  UNAUTHORIZED: '/unauthorized',
} as const

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  DISPATCHER: 'dispatcher',
  DRIVER: 'driver',
  VIEWER: 'viewer',
} as const

// Permissions
export const PERMISSIONS = {
  // Shipments
  CREATE_SHIPMENT: 'create_shipment',
  READ_SHIPMENT: 'read_shipment',
  UPDATE_SHIPMENT: 'update_shipment',
  DELETE_SHIPMENT: 'delete_shipment',
  MANAGE_SHIPMENTS: 'manage_shipments',

  // Fleet
  CREATE_VEHICLE: 'create_vehicle',
  READ_VEHICLE: 'read_vehicle',
  UPDATE_VEHICLE: 'update_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',
  MANAGE_FLEET: 'manage_fleet',

  // Drivers
  CREATE_DRIVER: 'create_driver',
  READ_DRIVER: 'read_driver',
  UPDATE_DRIVER: 'update_driver',
  DELETE_DRIVER: 'delete_driver',
  MANAGE_DRIVERS: 'manage_drivers',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_REPORTS: 'export_reports',

  // System
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ALL: 'manage_all',
} as const 