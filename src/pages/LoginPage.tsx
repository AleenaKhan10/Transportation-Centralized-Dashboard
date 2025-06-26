import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Truck, ArrowRight, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { LoginCredentials } from '../types/index'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

interface SignupCredentials {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const { login, signup, isLoading, error, clearError } = useAuth()
  
  const loginForm = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const signupForm = useForm<SignupCredentials>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onLoginSubmit = async (data: LoginCredentials) => {
    clearError()
    
    try {
      await login(data)
      toast.success('Welcome back!')
    } catch (err: any) {
      const message = err.message || 'Invalid credentials'
      toast.error(message)
      loginForm.setError('root', { message })
    }
  }

  const onSignupSubmit = async (data: SignupCredentials) => {
    clearError()
    
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

    try {
      const result = await signup(data)
      if (result.success) {
        toast.success('Account created successfully! Please wait for admin approval.')
        setIsLogin(true)
        signupForm.reset()
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      const message = err.message || 'Signup failed'
      toast.error(message)
      signupForm.setError('root', { message })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      x: isLogin ? 20 : -20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"></div>
      </div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-20 w-16 h-16 bg-primary-500/10 rounded-full blur-xl"
        animate={{ 
          y: [-10, 10, -10],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-32 w-24 h-24 bg-secondary-500/10 rounded-full blur-xl"
        animate={{ 
          y: [10, -10, 10],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-2xl"
          >
            <Truck className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Agy Logistics
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-dark-300"
          >
            Transportation Dashboard
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-dark-700/50"
        >
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-dark-300 text-sm">
              {isLogin ? 'Sign in to access your dashboard' : 'Join Agy Logistics team'}
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex bg-dark-700/50 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isLogin 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !isLogin 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <Input
                    icon={<Mail className="w-4 h-4 text-dark-400" />}
                    placeholder="Enter your email"
                    type="email"
                    {...loginForm.register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={loginForm.formState.errors.email?.message}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Input
                      icon={<Lock className="w-4 h-4 text-dark-400" />}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      error={loginForm.formState.errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-800"
                    />
                    <span className="text-dark-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Sign In
                </Button>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600/30">
                  <p className="text-xs text-dark-400 text-center mb-2">Demo Credentials:</p>
                  <p className="text-xs text-dark-300 text-center">Email: admin@agelogistics.com</p>
                  <p className="text-xs text-dark-300 text-center">Password: admin123</p>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-4"
              >
                {/* Full Name Field */}
                <div>
                  <Input
                    icon={<User className="w-4 h-4 text-dark-400" />}
                    placeholder="Enter your full name"
                    {...signupForm.register('fullName', { 
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    error={signupForm.formState.errors.fullName?.message}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Input
                    icon={<Mail className="w-4 h-4 text-dark-400" />}
                    placeholder="Enter your email"
                    type="email"
                    {...signupForm.register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={signupForm.formState.errors.email?.message}
                  />
                </div>



                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Input
                      icon={<Lock className="w-4 h-4 text-dark-400" />}
                      placeholder="Create a password"
                      type={showPassword ? 'text' : 'password'}
                      {...signupForm.register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain uppercase, lowercase, and number'
                        }
                      })}
                      error={signupForm.formState.errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="relative">
                    <Input
                      icon={<Lock className="w-4 h-4 text-dark-400" />}
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...signupForm.register('confirmPassword', { 
                        required: 'Please confirm your password'
                      })}
                      error={signupForm.formState.errors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Create Account
                </Button>

                {/* Terms Notice */}
                <p className="text-xs text-dark-400 text-center mt-4">
                  By creating an account, you agree to our{' '}
                  <span className="text-primary-400 cursor-pointer hover:text-primary-300">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-primary-400 cursor-pointer hover:text-primary-300">
                    Privacy Policy
                  </span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-dark-400 text-sm">
            © 2024 Agy Logistics. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage 