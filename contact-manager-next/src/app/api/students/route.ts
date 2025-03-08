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
    const { name, cpf, phone, classId } = await req.json()

    // Validate required fields
    if (!name || !cpf || !phone || !classId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if class exists and user has permission
    const class_ = await prisma.class.findUnique({
      where: { id: classId },
      select: { createdById: true },
    })

    if (!class_) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (
      class_.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to add students to this class' },
        { status: 403 }
      )
    }

    // Check if CPF is already registered
    const existingStudent = await prisma.student.findUnique({
      where: { cpf },
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'A student with this CPF already exists' },
        { status: 400 }
      )
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        cpf,
        phone,
        classId,
      },
      include: {
        contacts: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
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
    const classId = searchParams.get('classId')

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }

    // Check if class exists and user has permission
    const class_ = await prisma.class.findUnique({
      where: { id: classId },
      select: { createdById: true },
    })

    if (!class_) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (
      class_.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to view students in this class' },
        { status: 403 }
      )
    }

    const students = await prisma.student.findMany({
      where: { classId },
      include: {
        contacts: true,
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
