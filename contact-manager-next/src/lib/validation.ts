type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
}

type ValidationRules = {
  [key: string]: ValidationRule
}

type ValidationErrors = {
  [key: string]: string[]
}

export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {}

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field]
    const fieldErrors: string[] = []

    // Required check
    if (rule.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(rule.message || `${field} is required`)
    }

    if (value) {
      // Min length check
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(
          rule.message || `${field} must be at least ${rule.minLength} characters`
        )
      }

      // Max length check
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(
          rule.message || `${field} must be no more than ${rule.maxLength} characters`
        )
      }

      // Pattern check
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message || `${field} is invalid`)
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  })

  return errors
}

// Common validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Name must be between 2 and 100 characters',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
  cpf: {
    required: true,
    pattern: /^\d{11}$/,
    message: 'CPF must be 11 digits',
  },
  phone: {
    required: true,
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message: 'Phone must be in format (XX) XXXXX-XXXX',
  },
}

// Helper function to format phone numbers
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

// Helper function to format CPF
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Helper function to clean phone numbers
export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '')
}

// Helper function to clean CPF
export function cleanCPF(value: string): string {
  return value.replace(/\D/g, '')
}

// Helper function to check if form has errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}

// Helper function to get first error message
export function getFirstError(errors: ValidationErrors): string | null {
  for (const field in errors) {
    if (errors[field].length > 0) {
      return errors[field][0]
    }
  }
  return null
}
