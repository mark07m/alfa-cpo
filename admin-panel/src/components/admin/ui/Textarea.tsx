import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label,
    error,
    helperText,
    size = 'md',
    variant = 'default',
    resize = 'vertical',
    id,
    ...props 
  }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    
    const sizeClasses = {
      sm: 'h-20 px-3 py-2 text-sm',
      md: 'h-24 px-3 py-2 text-sm',
      lg: 'h-32 px-4 py-3 text-base'
    }
    
    const variantClasses = {
      default: 'border-gray-300 bg-white focus:border-amber-500 focus:ring-amber-500',
      filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-amber-500 focus:ring-amber-500',
      outlined: 'border-2 border-gray-300 bg-transparent focus:border-amber-500 focus:ring-amber-500'
    }

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }
    
    const baseClasses = cn(
      'flex w-full rounded-md text-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      variantClasses[variant],
      resizeClasses[resize],
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    )

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          id={textareaId}
          className={cn(baseClasses, className)}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
export type { TextareaProps }