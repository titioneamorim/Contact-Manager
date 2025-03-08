import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { type, username, description, studentId } = await req.json()

    // Validate required fields
    if (!type || !username || !description || !studentId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if student exists and user has permission
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          select: {
            createdById: true,
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (
      student.class.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to add contacts for this student' },
        { status: 403 }
      )
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        type,
        username,
        description,
        studentId,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Check if student exists and user has permission
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          select: {
            createdById: true,
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (
      student.class.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to view contacts for this student' },
        { status: 403 }
      )
    }

    const contacts = await prisma.contact.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
