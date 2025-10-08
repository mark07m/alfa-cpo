import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  iconOnly?: boolean
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
    iconOnly = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 shadow-sm',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm'
    }
    
    const sizes = {
      xs: iconOnly ? 'h-7 px-1 text-xs' : 'h-7 px-2 text-xs',
      sm: iconOnly ? 'h-8 px-2 text-sm' : 'h-8 px-3 text-sm',
      md: iconOnly ? 'h-10 px-2 text-sm' : 'h-10 px-4 text-sm',
      lg: iconOnly ? 'h-11 px-3 text-base' : 'h-11 px-6 text-base',
      xl: iconOnly ? 'h-12 px-3 text-lg' : 'h-12 px-8 text-lg'
    }

    const iconSizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6'
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className={cn("animate-spin", iconSizes[size], iconPosition === 'left' ? 'mr-2' : 'ml-2')}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(iconSizes[size], iconOnly ? '' : 'mr-2')}>{icon}</span>
        )}
        
        {!iconOnly && children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(iconSizes[size], iconOnly ? '' : 'ml-2')}>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
