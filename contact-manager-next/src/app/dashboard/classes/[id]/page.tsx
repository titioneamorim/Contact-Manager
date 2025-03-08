import { prisma } from '@/lib/prisma'
import { ClassWithDetails } from '@/types/database'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import DeleteButton from './DeleteButton'

async function getClass(id: string): Promise<ClassWithDetails | null> {
  const class_ = await prisma.class.findUnique({
    where: { id },
    include: {
      createdBy: true,
      students: {
        include: {
          contacts: true,
        },
      },
    },
  })

  return class_
}

export default async function ClassPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const class_ = await getClass(params.id)

  if (!class_) {
    notFound()
  }

  const canEdit =
    session?.user.role === 'ADMIN' ||
    session?.user.role === 'COORDINATOR' ||
    class_.createdById === session?.user.id

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Classes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {class_.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Created by {class_.createdBy.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-2 py-1 text-sm rounded ${
                class_.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {class_.status.toLowerCase()}
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <Link
                href={`/dashboard/classes/${class_.id}/edit`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit Class
              </Link>
              <Link
                href={`/dashboard/classes/${class_.id}/students/new`}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                Add Student
              </Link>
            </div>
            <DeleteButton classId={class_.id} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Students ({class_.students.length})
          </h2>
          <div className="space-y-4">
            {class_.students.map((student) => (
              <div
                key={student.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-gray-600 text-sm">CPF: {student.cpf}</p>
                    <p className="text-gray-600 text-sm">
                      Phone: {student.phone}
                    </p>
                  </div>
                  {canEdit && (
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      Manage Contacts
                    </Link>
                  )}
                </div>
                {student.contacts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Recent Contacts
                    </h4>
                    <div className="space-y-2">
                      {student.contacts.slice(0, 2).map((contact) => (
                        <div
                          key={contact.id}
                          className="text-sm text-gray-600"
                        >
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded mr-2 ${
                              contact.type === 'PHONE'
                                ? 'bg-blue-100 text-blue-800'
                                : contact.type === 'EMAIL'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {contact.type.toLowerCase()}
                          </span>
                          {contact.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {class_.students.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No students in this class yet.</p>
                {canEdit && (
                  <Link
                    href={`/dashboard/classes/${class_.id}/students/new`}
                    className="text-blue-600 hover:text-blue-800 transition-colors mt-2 inline-block"
                  >
                    Add the first student
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
