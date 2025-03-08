import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError } from '@prisma/client/runtime/library'

export function handlePrismaError(error: any): { message: string; status: number } {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      // Unique constraint violation
      case 'P2002': {
        const target = (error.meta?.target as string[]) || []
        return {
          message: `A record with this ${target.join(', ')} already exists.`,
          status: 409,
        }
      }

      // Foreign key constraint violation
      case 'P2003': {
        const field = (error.meta?.field_name as string) || 'record'
        return {
          message: `Related ${field} not found.`,
          status: 404,
        }
      }

      // Record not found
      case 'P2001':
      case 'P2015':
      case 'P2025': {
        return {
          message: 'Record not found.',
          status: 404,
        }
      }

      // Invalid data
      case 'P2007': {
        return {
          message: 'Invalid data provided.',
          status: 400,
        }
      }

      // Default database error
      default:
        return {
          message: 'Database operation failed.',
          status: 500,
        }
    }
  }

  if (error instanceof PrismaClientValidationError) {
    return {
      message: 'Invalid data provided.',
      status: 400,
    }
  }

  if (error instanceof PrismaClientInitializationError) {
    console.error('Database initialization error:', error)
    return {
      message: 'Database connection failed.',
      status: 503,
    }
  }

  // Default error
  console.error('Unhandled database error:', error)
  return {
    message: 'An unexpected error occurred.',
    status: 500,
  }
}

export function isPrismaError(error: any): boolean {
  return (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientInitializationError
  )
}

export function isUniqueConstraintError(error: any): boolean {
  return (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2002'
  )
}

export function isForeignKeyError(error: any): boolean {
  return (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2003'
  )
}

export function isNotFoundError(error: any): boolean {
  return (
    error instanceof PrismaClientKnownRequestError &&
    ['P2001', 'P2015', 'P2025'].includes(error.code)
  )
}

export function getUniqueConstraintErrorMessage(error: PrismaClientKnownRequestError): string {
  const target = (error.meta?.target as string[]) || []
  const field = target[0] || 'field'
  
  switch (field) {
    case 'email':
      return 'This email is already registered.'
    case 'cpf':
      return 'This CPF is already registered.'
    default:
      return `A record with this ${field} already exists.`
  }
}
