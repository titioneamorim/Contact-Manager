import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const classes = await prisma.class.findMany({
      where: {
        OR: [
          { createdById: session.user.id },
          { createdBy: { role: 'ADMIN' } },
          { createdBy: { role: 'COORDINATOR' } },
        ],
      },
      include: {
        _count: {
          select: { students: true },
        },
      },
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, status } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        status: status || 'ACTIVE',
        createdById: session.user.id,
      },
      include: {
        _count: {
          select: { students: true },
        },
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}
