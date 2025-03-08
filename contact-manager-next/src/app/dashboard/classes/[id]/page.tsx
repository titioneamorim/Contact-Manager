import { prisma } from '@/lib/prisma';
import { ClassWithDetails } from '@/types/database';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DeleteButton from './DeleteButton';

async function getClass(id: string): Promise<ClassWithDetails | null> {
  const class_ = await prisma.class.findUnique({
    where: { id },
    include: {
      createdBy: true,
      students: {
        include: {
          contacts: true,
        },
      },
    },
  });

  return class_;
}

export default async function ClassPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const class_ = await getClass(params.id);

  if (!class_) {
    notFound();
  }

  const podeEditar =
    session?.user.role === 'ADMIN' ||
    session?.user.role === 'COORDINATOR' ||
    class_.createdById === session?.user.id;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Voltar para as Turmas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {class_.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Criado por {class_.createdBy.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
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
        </div>

        {podeEditar && (
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <Link
                href={`/dashboard/classes/${class_.id}/edit`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Editar Turma
              </Link>
              <Link
                href={`/dashboard/classes/${class_.id}/students/new`}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                Adicionar Aluno
              </Link>
            </div>

            {/* 🔹 Botão Excluir - Apenas para ADMIN */}
            {session?.user.role === 'ADMIN' && (
              <DeleteButton classId={class_.id} />
            )}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Alunos ({class_.students.length})
          </h2>
          <div className="space-y-4">
            {class_.students.map((student) => (
              <div
                key={student.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    {student.name}
                    {podeEditar && (
                      <Link
                        href={`/dashboard/students/${student.id}/edit`}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        title="Editar Aluno"
                      >
                        ✏️
                      </Link>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">CPF: {student.cpf}</p>
                  <p className="text-gray-600 text-sm">Telefone: {student.phone}</p>
                </div>
                {podeEditar && (
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                  >
                    Gerenciar Contatos
                  </Link>
                )}
              </div>
            ))}

            {class_.students.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Nenhum aluno nesta turma ainda.</p>
                {podeEditar && (
                  <Link
                    href={`/dashboard/classes/${class_.id}/students/new`}
                    className="text-blue-600 hover:text-blue-800 transition-colors mt-2 inline-block"
                  >
                    Adicionar o primeiro aluno
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
