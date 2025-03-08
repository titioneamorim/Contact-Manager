import { NextResponse } from 'next/server'

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function errorResponse(error: string | Error, status = 400): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  )
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  )
}

export function notFoundResponse(message = 'Not Found'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 404 }
  )
}

export function validationErrorResponse(errors: Record<string, string[]>): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation Error',
      data: errors,
    },
    { status: 422 }
  )
}

export function serverErrorResponse(error?: Error): NextResponse<ApiResponse> {
  console.error('Server Error:', error)
  return NextResponse.json(
    {
      success: false,
      error: 'Internal Server Error',
    },
    { status: 500 }
  )
}
