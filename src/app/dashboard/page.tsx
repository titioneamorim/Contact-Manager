import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const classes = await prisma.class.findMany({
    where: {
      OR: [
        { createdById: session?.user.id },
        { createdBy: { role: 'ADMIN' } },
        { createdBy: { role: 'COORDINATOR' } },
      ],
    },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Painel Administrativo</h1>

        <div className="flex items-center gap-4">
          {/* Mostrar botão "Gerenciar Usuários" apenas para ADMIN */}
          {/* {session?.user.role === 'ADMIN' && (
            <Link
              href="/admin/users"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Gerenciar Usuários
            </Link>
          )} */}

          {/* Botão Criar Nova Classe (corrigido) */}
          <Link
            href="/dashboard/classes/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Nova Classe
          </Link>

          {/* Botão de Logout */}
     
        </div>
      </div>

      {/* Lista de Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((class_: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; status: string; _count: { students: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }; }) => (
          <div
            key={class_.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{class_.name}</h2>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  class_.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {class_.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{class_._count.students} alunos</p>
            <div className="flex justify-end">
              <Link
                href={`/dashboard/classes/${class_.id}`}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                Ver detalhes →
              </Link>
            </div>
          </div>
        ))}

        {/* Mensagem caso não haja classes */}
        {classes.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma classe encontrada</h3>
            <p className="text-gray-600">Crie sua primeira classe para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
