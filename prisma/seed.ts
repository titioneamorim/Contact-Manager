import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create a coordinator
  const coordinatorPassword = await hash('coord123', 12)
  const coordinator = await prisma.user.create({
    data: {
      name: 'Coordinator User',
      email: 'coordinator@example.com',
      password: coordinatorPassword,
      role: 'COORDINATOR',
    },
  })

  // Create a teacher
  const teacherPassword = await hash('teacher123', 12)
  const teacher = await prisma.user.create({
    data: {
      name: 'Teacher User',
      email: 'teacher@example.com',
      password: teacherPassword,
      role: 'TEACHER',
    },
  })

  // Create some classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Mathematics 101',
      status: 'ACTIVE',
      createdById: teacher.id,
      students: {
        create: [
          {
            name: 'John Doe',
            cpf: '12345678901',
            phone: '(11) 98765-4321',
            contacts: {
              create: [
                {
                  type: 'PHONE',
                  username: 'Mother',
                  description: 'Called about homework assignment',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log({
    admin: { email: 'admin@example.com', password: 'admin123' },
    coordinator: { email: 'coordinator@example.com', password: 'coord123' },
    teacher: { email: 'teacher@example.com', password: 'teacher123' },
  })
  console.log('Database seeded with test data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
