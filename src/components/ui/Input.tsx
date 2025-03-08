'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, ...props }, ref) => {
    const baseClasses = 'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variantClasses = error
      ? 'border-red-300 focus:border-red-300 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-300 focus:ring-blue-500'

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          className={twMerge(baseClasses, variantClasses, className)}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={`text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
