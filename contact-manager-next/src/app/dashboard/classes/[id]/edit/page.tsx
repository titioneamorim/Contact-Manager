'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

interface Class {
  id: string
  name: string
  status: string
}

interface PageProps {
  params: { id: string }
}

const EditClassPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter()
  const [class_, setClass] = useState<Class | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchClass()
  }, [params.id])

  async function fetchClass() {
    try {
      const response = await fetch(`/api/classes/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch class')
      }
      const data = await response.json()
      setClass(data)
    } catch (error) {
      setError('Failed to load class details')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        status: formData.get('status') as string,
      }

      const response = await fetch(`/api/classes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update class')
      }

      router.push(`/dashboard/classes/${params.id}`)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred while updating the class')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !class_) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error || 'Class not found'}</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit Class
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={class_.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter class name"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={class_.status}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditClassPage
