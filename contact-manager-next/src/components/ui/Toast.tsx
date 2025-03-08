'use client'

import { HTMLAttributes, forwardRef, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { createPortal } from 'react-dom'

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant
  title?: string
  description?: string
  duration?: number
  onClose?: () => void
}

const getVariantClasses = (variant: ToastVariant = 'default'): string => {
  const variants = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return variants[variant]
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', title, description, duration = 5000, onClose, ...props }, ref) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
      return () => setIsMounted(false)
    }, [])

    useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    if (!isMounted) return null

    const content = (
      <div
        ref={ref}
        role="alert"
        className={twMerge(
          'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border p-4 shadow-lg transition-all',
          getVariantClasses(variant),
          className
        )}
        {...props}
      >
        <div className="flex w-full items-start gap-4">
          <div className="flex-1">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className="mt-1 text-sm opacity-90">
                {description}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    )

    return createPortal(
      <div className="fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {content}
      </div>,
      document.body
    )
  }
)
Toast.displayName = 'Toast'

export { Toast }
