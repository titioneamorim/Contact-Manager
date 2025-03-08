'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function NewStudentPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      phone: formData.get('phone') as string,
      classId: params.id,
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create student')
      }

      router.push(`/dashboard/classes/${params.id}`)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred while creating the student')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New Student
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
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter student's full name"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              required
              pattern="\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="000.000.000-00"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: 000.000.000-00 or 00000000000
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              pattern="\(\d{2}\) \d{5}-\d{4}|\d{11}|\d{10}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="(00) 00000-0000"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: (00) 00000-0000 or 00000000000
            </p>
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
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
