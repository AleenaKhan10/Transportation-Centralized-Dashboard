import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-8"
        >
          <ShieldX className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-white">
            Access Denied
          </h1>
          <p className="text-xl text-dark-300">
            You don't have permission to access this resource
          </p>
          <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
            <p className="text-sm text-dark-400">
              {user ? (
                <>
                  Logged in as: <span className="text-primary-400">{user.email}</span>
                  <br />
                  Role: <span className="text-secondary-400">{user.role.name}</span>
                </>
              ) : (
                'Please log in with an account that has the required permissions.'
              )}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              icon={<ArrowLeft />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              icon={<Home />}
              onClick={handleGoHome}
            >
              Go to Dashboard
            </Button>
          </div>

          {user && (
            <div className="pt-4 border-t border-dark-700">
              <p className="text-sm text-dark-400 mb-3">
                Need different permissions?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                Sign Out & Switch Account
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UnauthorizedPage 