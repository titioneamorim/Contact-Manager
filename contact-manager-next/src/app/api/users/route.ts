import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 🔹 Buscar usuários (GET)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

// 🔹 Criar usuário (POST)
export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();
    if (!name || !email || !role) return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });

    const newUser = await prisma.user.create({ data: { name, email, role } });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}

// 🔹 Atualizar usuário (PUT)
export async function PUT(req: NextRequest) {
  try {
    const { id, name, email, role } = await req.json();
    if (!id || !name || !email || !role) return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

// 🔹 Excluir usuário (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // 🔹 Extrai o ID da URL

    if (!id) return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'Usuário excluído com sucesso' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
