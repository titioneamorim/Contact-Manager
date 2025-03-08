import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        contacts: true,
        class: {
          select: {
            id: true,
            name: true,
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
        { error: 'Not authorized to view this student' },
        { status: 403 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, cpf, phone } = await req.json()

    // Find student and check permissions
    const student = await prisma.student.findUnique({
      where: { id: params.id },
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

    if (
      student.class.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to update this student' },
        { status: 403 }
      )
    }

    // Check if new CPF is already used by another student
    if (cpf !== student.cpf) {
      const existingStudent = await prisma.student.findUnique({
        where: { cpf },
      })

      if (existingStudent) {
        return NextResponse.json(
          { error: 'A student with this CPF already exists' },
          { status: 400 }
        )
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: {
        name,
        cpf,
        phone,
      },
      include: {
        contacts: true,
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find student and check permissions
    const student = await prisma.student.findUnique({
      where: { id: params.id },
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

    if (
      student.class.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to delete this student' },
        { status: 403 }
      )
    }

    // Delete all contacts first, then the student
    await prisma.$transaction([
      prisma.contact.deleteMany({
        where: { studentId: params.id },
      }),
      prisma.student.delete({
        where: { id: params.id },
      }),
    ])

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
