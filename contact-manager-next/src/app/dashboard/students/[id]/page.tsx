'use client'

import { ContactWithStudent } from '@/types/database'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

interface Student {
  id: string
  name: string
  cpf: string
  phone: string
  contacts: ContactWithStudent[]
  class: {
    id: string
    name: string
  }
}

export default function StudentPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [params.id])

  async function fetchStudent() {
    try {
      const response = await fetch(`/api/students/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch student')
      }
      const data = await response.json()
      setStudent(data)
    } catch (error) {
      setError('Failed to load student details')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      type: formData.get('type') as 'PHONE' | 'EMAIL' | 'WHATSAPP',
      username: formData.get('username') as string,
      description: formData.get('description') as string,
      studentId: params.id,
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create contact')
      }

      setShowContactForm(false)
      fetchStudent() // Refresh student data
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred while creating the contact')
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

  if (error || !student) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error || 'Student not found'}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {student.name}
            </h1>
            <p className="text-gray-600 mt-1">Class: {student.class.name}</p>
            <p className="text-gray-600">CPF: {student.cpf}</p>
            <p className="text-gray-600">Phone: {student.phone}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact History
            </h2>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Contact
            </button>
          </div>

          {showContactForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PHONE">Phone</option>
                    <option value="EMAIL">Email</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Name of contact person"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Details about the contact"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
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
                    {isSubmitting ? 'Adding...' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {student.contacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      contact.type === 'PHONE'
                        ? 'bg-blue-100 text-blue-800'
                        : contact.type === 'EMAIL'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {contact.type.toLowerCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Contact: {contact.username}
                </p>
                <p className="text-gray-700">{contact.description}</p>
              </div>
            ))}

            {student.contacts.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No contact history yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
