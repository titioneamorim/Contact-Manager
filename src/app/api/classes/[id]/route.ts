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
    const class_ = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        students: {
          include: {
            contacts: true,
          },
        },
        _count: {
          select: { students: true },
        },
      },
    })

    if (!class_) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(class_)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class' },
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
    const { name, status } = await req.json()

    // Check if class exists and user has permission
    const existingClass = await prisma.class.findUnique({
      where: { id: params.id },
      select: { createdById: true },
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    if (
      existingClass.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to update this class' },
        { status: 403 }
      )
    }

    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: {
        name,
        status,
      },
      include: {
        _count: {
          select: { students: true },
        },
      },
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
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
    // Check if class exists and user has permission
    const existingClass = await prisma.class.findUnique({
      where: { id: params.id },
      select: { createdById: true },
    })

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    if (
      existingClass.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDINATOR'
    ) {
      return NextResponse.json(
        { error: 'Not authorized to delete this class' },
        { status: 403 }
      )
    }

    // Delete all related contacts and students first
    await prisma.$transaction([
      prisma.contact.deleteMany({
        where: {
          student: {
            classId: params.id,
          },
        },
      }),
      prisma.student.deleteMany({
        where: {
          classId: params.id,
        },
      }),
      prisma.class.delete({
        where: { id: params.id },
      }),
    ])

    return NextResponse.json({ message: 'Class deleted successfully' })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}
