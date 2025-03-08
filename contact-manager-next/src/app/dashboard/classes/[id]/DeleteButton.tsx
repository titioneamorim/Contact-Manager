'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  classId: string
}

export default function DeleteButton({ classId }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete class')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delete Class
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete this class? This action cannot be
            undone, and all associated students and contacts will be deleted.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-800 transition-colors"
    >
      Delete Class
    </button>
  )
}
