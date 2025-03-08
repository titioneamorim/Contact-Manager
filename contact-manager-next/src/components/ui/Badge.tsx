'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const getVariantClasses = (variant: BadgeVariant = 'default'): string => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }
  return variants[variant]
}

const getSizeClasses = (size: BadgeSize = 'md'): string => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }
  return sizes[size]
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={twMerge(
          'inline-flex items-center font-medium rounded-full',
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
