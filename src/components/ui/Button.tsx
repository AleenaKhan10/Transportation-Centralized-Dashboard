import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  glow?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    glow = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      {
        'w-full': fullWidth,
      }
    )

    const variants = {
      primary: cn(
        'bg-primary-500 hover:bg-primary-600 text-white',
        'focus:ring-primary-500 border border-transparent',
        glow && 'shadow-glow hover:shadow-glow-lg'
      ),
      secondary: cn(
        'bg-secondary-500 hover:bg-secondary-600 text-white',
        'focus:ring-secondary-500 border border-transparent'
      ),
      outline: cn(
        'border-2 border-primary-500 text-primary-500',
        'hover:bg-primary-500 hover:text-white',
        'focus:ring-primary-500'
      ),
      ghost: cn(
        'text-dark-300 hover:text-white hover:bg-dark-700',
        'focus:ring-dark-500'
      ),
      danger: cn(
        'bg-red-500 hover:bg-red-600 text-white',
        'focus:ring-red-500 border border-transparent'
      ),
    }

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-md',
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl',
    }

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    }

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    )

    const iconElement = loading ? (
      <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
    ) : icon ? (
      <span className={cn(iconSizes[size], 'flex-shrink-0')}>
        {icon}
      </span>
    ) : null

    const {
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onDragStart,
      onDragEnd,
      onDrag,
      onDragEnter,
      onDragExit,
      onDragLeave,
      onDragOver,
      onDrop,
      ...safeProps
    } = props

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...safeProps}
      >
        {iconElement && iconPosition === 'left' && (
          <span className={cn(children && 'mr-2')}>
            {iconElement}
          </span>
        )}
        
        {children && (
          <span className="truncate">
            {children}
          </span>
        )}
        
        {iconElement && iconPosition === 'right' && (
          <span className={cn(children && 'ml-2')}>
            {iconElement}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button } 