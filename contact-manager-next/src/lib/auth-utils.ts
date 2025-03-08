import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return session
}

export async function requireCoordinator() {
  const session = await requireAuth()
  
  if (!['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
    redirect('/dashboard')
  }
  
  return session
}

export function canManageClass(userId: string, classCreatorId: string, userRole: string) {
  return (
    userRole === 'ADMIN' ||
    userRole === 'COORDINATOR' ||
    userId === classCreatorId
  )
}

export function canManageStudent(userId: string, classCreatorId: string, userRole: string) {
  return canManageClass(userId, classCreatorId, userRole)
}

export function canViewClass(userId: string, classCreatorId: string, userRole: string) {
  return (
    userRole === 'ADMIN' ||
    userRole === 'COORDINATOR' ||
    userId === classCreatorId
  )
}

export function canCreateClass(userRole: string) {
  return ['ADMIN', 'COORDINATOR', 'TEACHER'].includes(userRole)
}

export function canDeleteClass(userId: string, classCreatorId: string, userRole: string) {
  return (
    userRole === 'ADMIN' ||
    userRole === 'COORDINATOR' ||
    (userRole === 'TEACHER' && userId === classCreatorId)
  )
}

export function canManageContacts(userId: string, classCreatorId: string, userRole: string) {
  return canManageClass(userId, classCreatorId, userRole)
}
