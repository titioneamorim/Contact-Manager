'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            An error occurred while processing your request.
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
          <div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700 whitespace-pre-wrap">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
