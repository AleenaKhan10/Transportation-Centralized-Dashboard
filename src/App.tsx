import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

// Components
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full mx-auto"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-16 h-16 border-4 border-secondary-400/30 rounded-full mx-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-gradient">
              Age Logistics
            </h2>
            <p className="text-dark-400">Loading your dashboard...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Error Pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Default Redirects */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={isAuthenticated ? "/dashboard" : "/login"} 
                replace 
              />
            } 
          />
          
          {/* 404 - Catch all */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <h1 className="text-6xl font-heading font-bold text-gradient">
                    404
                  </h1>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">
                      Page Not Found
                    </h2>
                    <p className="text-dark-400">
                      The page you're looking for doesn't exist.
                    </p>
                  </div>
                  <motion.a
                    href={isAuthenticated ? "/dashboard" : "/"}
                    className="btn-primary inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go Home
                  </motion.a>
                </motion.div>
              </div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App 