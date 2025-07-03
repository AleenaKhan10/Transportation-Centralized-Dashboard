import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Settings,
  MapPin
} from 'lucide-react'
import { NavigationItem } from '../../types/index'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const { user } = useAuth() // Uncomment when needed
  const location = useLocation()

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Trailers & Trips',
      href: '/dashboard/trailers',
      icon: MapPin,
      current: location.pathname.startsWith('/dashboard/trailers'),
    },
    {
      name: 'Shipments',
      href: '/dashboard/shipments',
      icon: Package,
      current: location.pathname.startsWith('/dashboard/shipments'),
      badge: '12', // Example badge
    },
    {
      name: 'Fleet',
      href: '/dashboard/fleet',
      icon: Truck,
      current: location.pathname.startsWith('/dashboard/fleet'),
    },
    {
      name: 'Drivers',
      href: '/dashboard/drivers',
      icon: Users,
      current: location.pathname.startsWith('/dashboard/drivers'),
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: location.pathname.startsWith('/dashboard/analytics'),
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname.startsWith('/dashboard/settings'),
    },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-dark-900/75 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
        />

        {/* Page content */}
        <main className="min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 