// Define the shape of our database types
export interface ClassWithDetails {
  id: string
  name: string
  status: string
  createdAt: Date
  updatedAt: Date
  createdById: string
  createdBy: {
    id: string
    name: string | null
    email: string
    role: string
  }
  students: Array<{
    id: string
    name: string
    cpf: string
    phone: string
    createdAt: Date
    updatedAt: Date
    classId: string
    contacts: Array<{
      id: string
      type: string
      username: string
      description: string
      createdAt: Date
      studentId: string
    }>
  }>
}

export interface ClassWithStudentCount {
  id: string
  name: string
  status: string
  createdAt: Date
  updatedAt: Date
  createdById: string
  _count: {
    students: number
  }
}

export interface StudentWithDetails {
  id: string
  name: string
  cpf: string
  phone: string
  createdAt: Date
  updatedAt: Date
  classId: string
  contacts: Array<{
    id: string
    type: string
    username: string
    description: string
    createdAt: Date
    studentId: string
  }>
  class: {
    id: string
    name: string
    createdById: string
  }
}

export interface ContactWithStudent {
  id: string
  type: string
  username: string
  description: string
  createdAt: Date
  studentId: string
  student: {
    id: string
    name: string
    cpf: string
    phone: string
    createdAt: Date
    updatedAt: Date
    classId: string
  }
}
