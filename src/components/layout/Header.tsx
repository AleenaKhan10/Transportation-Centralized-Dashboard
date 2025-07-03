import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { NavigationItem } from '../../types/index'
import { cn } from '../../utils/cn'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  navigation: NavigationItem[]
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, navigation }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { user, logout, getUserDisplayName, getUserInitials } = useAuth()

  const currentPage = navigation.find(item => item.current)?.name || 'Dashboard'

  const notifications = [
    {
      id: 1,
      title: 'New shipment assigned',
      message: 'Shipment #12345 has been assigned to driver John Smith',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Vehicle maintenance due',
      message: 'Truck #ABC-123 is due for scheduled maintenance',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Route completed',
      message: 'Driver completed delivery route successfully',
      time: '2 hours ago',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-dark-700 bg-dark-800/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-dark-400 hover:text-white lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-dark-600 lg:hidden" />

      {/* Current page title */}
      <div className="flex-1 flex items-center">
        <h1 className="text-lg font-semibold text-white">
          {currentPage}
        </h1>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-dark-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-64 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative -m-2.5 p-2.5 text-dark-400 hover:text-white transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"
              />
            )}
          </motion.button>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50"
              >
                <div className="p-4 border-b border-dark-700">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-dark-400 mt-1">
                      You have {unreadCount} unread notifications
                    </p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      className={cn(
                        'p-4 border-b border-dark-700/50 cursor-pointer',
                        notification.unread && 'bg-primary-500/5'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-dark-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-dark-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-dark-700">
                  <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-x-3 p-1.5 text-sm leading-6 text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt={getUserDisplayName()}
                />
              ) : (
                getUserInitials()
              )}
            </div>
            <div className="hidden lg:flex lg:items-center">
              <span className="text-white font-medium">{getUserDisplayName()}</span>
              <ChevronDown className="ml-2 h-4 w-4 text-dark-400" />
            </div>
          </motion.button>

          {/* User menu dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50"
              >
                <div className="p-4 border-b border-dark-700">
                  <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                  <p className="text-xs text-secondary-400 mt-1">{user?.role.name}</p>
                </div>
                
                <div className="py-1">
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Your Profile
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </motion.button>
                </div>
                
                <div className="py-1 border-t border-dark-700">
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click away handlers */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setUserMenuOpen(false)
            setNotificationsOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default Header 