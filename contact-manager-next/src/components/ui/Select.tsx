'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  error?: string
  label?: string
  helperText?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, label, helperText, ...props }, ref) => {
    const baseClasses = 'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 appearance-none bg-white'
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
        <div className="relative">
          <select
            className={twMerge(baseClasses, variantClasses, className)}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
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
Select.displayName = 'Select'

export { Select }
