'use client'

import { HTMLAttributes, forwardRef, createContext, useContext, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFormSubmit } from '@/lib/ui-utils'

interface FormContextValue {
  isSubmitting: boolean
  error: string | null
}

const FormContext = createContext<FormContextValue | undefined>(undefined)

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  onSubmit: () => Promise<void>
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, children, ...props }, ref) => {
    const { isSubmitting, error, handleSubmit } = useFormSubmit()

    const handleFormSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault()
        await handleSubmit(onSubmit)
      },
      [handleSubmit, onSubmit]
    )

    return (
      <FormContext.Provider value={{ isSubmitting, error }}>
        <form
          ref={ref}
          className={twMerge('space-y-6', className)}
          onSubmit={handleFormSubmit}
          {...props}
        >
          {children}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormContext.Provider>
    )
  }
)
Form.displayName = 'Form'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  helperText?: string
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, helperText, children, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge('space-y-1', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {children}
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
FormField.displayName = 'FormField'

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {}

const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('flex items-center justify-end space-x-2', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormActions.displayName = 'FormActions'

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form')
  }
  return context
}

export { Form, FormField, FormActions }
