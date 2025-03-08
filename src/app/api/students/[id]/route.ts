import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  if (!params.id) {
    console.error('Erro: ID do aluno não fornecido.');
    return NextResponse.json({ message: 'ID do aluno não fornecido' }, { status: 400 });
  }

  try {
    console.log(`🔍 Buscando aluno com ID: ${params.id}`);
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        contacts: true,
        class: {
          select: { id: true, name: true, createdById: true }, // 🔹 Agora SEMPRE retorna `class.id`
        },
      },
    });

    if (!student) {
      console.error(`Erro: Nenhum aluno encontrado com ID ${params.id}`);
      return NextResponse.json({ message: 'Aluno não encontrado' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    return NextResponse.json({ message: 'Erro interno ao buscar aluno' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  if (!params.id) {
    return NextResponse.json({ message: 'ID do aluno não fornecido' }, { status: 400 });
  }

  try {
    const { name, cpf, phone } = await req.json();

    console.log(`✏️ Editando aluno com ID: ${params.id}`);
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: { class: { select: { id: true, createdById: true } } },
    });

    if (!student) {
      console.error(`Erro: Nenhum aluno encontrado com ID ${params.id}`);
      return NextResponse.json({ message: 'Aluno não encontrado' }, { status: 404 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: { name, cpf, phone },
    });

    console.log(`✅ Aluno atualizado: ${updatedStudent.id}, Redirecionando para: /dashboard/classes/${student.class.id}`);

    return NextResponse.json({
      student: updatedStudent,
      redirectUrl: `/dashboard/classes/${student.class.id}`, // 🔹 Agora retorna corretamente `/dashboard/classes/[id]`
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    return NextResponse.json({ message: 'Erro interno ao atualizar aluno' }, { status: 500 });
  }
}
