// User and Authentication Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  permissions: Permission[];
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  level: number;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  resource: string;
  action: string;
  description: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard & Analytics Types
export interface DashboardStats {
  totalShipments: number;
  activeVehicles: number;
  totalDrivers: number;
  monthlyRevenue: number;
  trends: {
    shipments: number;
    revenue: number;
    efficiency: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
  color?: string;
}

// Transportation Business Types
export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'truck' | 'van' | 'motorcycle';
  model: string;
  year: number;
  status: 'available' | 'in-use' | 'maintenance';
  driver?: User;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  mileage: number;
  lastMaintenance?: string;
}

export interface Driver extends User {
  licenseNumber: string;
  licenseExpiry: string;
  vehicle?: Vehicle;
  rating: number;
  totalDeliveries: number;
}

// UI Component Types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: NavigationItem[];
  current?: boolean;
  badge?: string | number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: { value: string; label: string }[];
}

// Theme and UI Types
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface AppSettings {
  theme: Theme;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type Position = 'top' | 'bottom' | 'left' | 'right';

// Export common type utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Business Logic Types
export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  driver?: User;
  vehicle?: Vehicle;
  estimatedDelivery: string;
  actualDelivery?: string;
  value: number;
  weight: number;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    href: string;
  };
}

export interface Trailer {
  trailer_id: string;
  trip_ids: string[];
}

export interface TripAggregatedData {
  reefer_mode_id: number;
  reefer_mode: string;
  required_temp: number;
  driver_set_temp: number;
  samsara_temp: number;
  samsara_temp_time: number;
}

export interface TripData {
  trailer_id: string;
  trip_id: string;
  driver_id: string;
  truck_id: string;
  status_id: number;
  status: string;
  priority: string;
  aggregated_data: TripAggregatedData[];
  trip_start_time: number;
  trip_end_time: number;
  sub_trip_start_time: number;
  sub_trip_end_time: number;
}

export interface TrailerTripsResponse {
  trailers: Trailer[];
}

export interface TripDataResponse {
  trips: TripData[];
}

// Slack Tickets Types
export interface SlackTicket {
  id: number;
  message_id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  user_message: string;
  ai_response: string;
  confidence_score: number;
  response_sources: string;
  thread_ts: string;
  created_at: string;
  updated_at: string;
  is_mention: boolean;
  processed_at: string | null;
}

export interface SlackTicketsResponse {
  data: SlackTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type SlackTicketViewType = 'chat' | 'table' | 'card' | 'analytics' | 'timeline';

export interface SlackTicketsFilter {
  channel_name?: string;
  is_mention?: boolean;
  confidence_score_min?: number;
  confidence_score_max?: number;
  date_from?: string;
  date_to?: string;
} 