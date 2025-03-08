'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  fullScreen?: boolean
}

const getSizeClasses = (size: SpinnerSize = 'md'): string => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }
  return sizes[size]
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', fullScreen = false, ...props }, ref) => {
    const spinner = (
      <div
        ref={ref}
        className={twMerge(
          'inline-block animate-spin rounded-full border-current border-t-transparent text-blue-600',
          getSizeClasses(size),
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    )

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
          {spinner}
        </div>
      )
    }

    return spinner
  }
)
Spinner.displayName = 'Spinner'

export { Spinner }
