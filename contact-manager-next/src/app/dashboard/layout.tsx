import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

async function DashboardHeader() {
  const session = await getServerSession(authOptions)
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-gray-900"
            >
              Contact Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {session?.user?.name || session?.user?.email}
              {session?.user?.role && (
                <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100">
                  {session.user.role.toLowerCase()}
                </span>
              )}
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
