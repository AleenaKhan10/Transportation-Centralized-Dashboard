import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Truck } from 'lucide-react'
import { NavigationItem } from '../../types/index'
import { cn } from '../../utils/cn'

interface SidebarProps {
  navigation: NavigationItem[]
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-800 border-r border-dark-700 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-glow">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-gradient">
                  Age Logistics
                </h1>
                <p className="text-xs text-dark-400">Transportation Hub</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          item.current
                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-inner-glow'
                            : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                        )}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={cn(
                            'flex-shrink-0',
                            item.current
                              ? 'text-primary-400'
                              : 'text-dark-400 group-hover:text-white'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Footer */}
              <li className="mt-auto">
                <div className="bg-dark-700/50 rounded-lg p-4 border border-dark-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">System Status</p>
                      <p className="text-xs text-green-400">All systems operational</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-dark-800 border-r border-dark-700 px-6 pb-4 overflow-y-auto">
              {/* Header with close button */}
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-glow">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-heading font-bold text-gradient">
                      Age Logistics
                    </h1>
                    <p className="text-xs text-dark-400">Transportation Hub</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className="text-dark-400 hover:text-white p-2 rounded-lg hover:bg-dark-700"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-1 flex-col mt-5">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                              item.current
                                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-inner-glow'
                                : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                            )}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={cn(
                                'flex-shrink-0',
                                item.current
                                  ? 'text-primary-400'
                                  : 'text-dark-400 group-hover:text-white'
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                            </motion.div>
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar 