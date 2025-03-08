import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { name, cpf, phone, classId } = await req.json();

    // 🔹 Validação de campos obrigatórios
    if (!name || !cpf || !phone || !classId) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // 🔹 Verifica se a classe existe
    const class_ = await prisma.class.findUnique({
      where: { id: classId },
      select: { createdById: true },
    });

    if (!class_) {
      return NextResponse.json(
        { message: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // 🔹 Verifica permissões do usuário
    if (
      class_.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDENADOR'
    ) {
      return NextResponse.json(
        { message: 'Você não tem permissão para adicionar alunos nesta turma' },
        { status: 403 }
      );
    }

    // 🔹 Verifica se o CPF já está cadastrado
    const existingStudent = await prisma.student.findUnique({
      where: { cpf },
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: 'CPF já cadastrado' }, // ✅ Mensagem corrigida
        { status: 400 }
      );
    }

    // 🔹 Criação do aluno
    const student = await prisma.student.create({
      data: { name, cpf, phone, classId },
      include: { contacts: true },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);

    return NextResponse.json(
      { message: 'Erro interno ao cadastrar aluno' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json(
        { message: 'O ID da turma é obrigatório' },
        { status: 400 }
      );
    }

    // 🔹 Verifica se a turma existe
    const class_ = await prisma.class.findUnique({
      where: { id: classId },
      select: { createdById: true },
    });

    if (!class_) {
      return NextResponse.json(
        { message: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // 🔹 Verifica permissões do usuário
    if (
      class_.createdById !== session.user.id &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'COORDENADOR'
    ) {
      return NextResponse.json(
        { message: 'Você não tem permissão para visualizar os alunos desta turma' },
        { status: 403 }
      );
    }

    // 🔹 Retorna a lista de alunos
    const students = await prisma.student.findMany({
      where: { classId },
      include: { contacts: true },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);

    return NextResponse.json(
      { message: 'Erro interno ao buscar alunos' },
      { status: 500 }
    );
  }
}
