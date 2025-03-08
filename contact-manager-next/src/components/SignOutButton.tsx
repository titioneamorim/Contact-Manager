'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function SignOutButton() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Mostrar botão "Gerenciar Usuários" apenas para ADMIN */}
        {session?.user?.role === 'ADMIN' && (
          <a
          href="/dashboard/admin/users"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Gerenciar Usuários
          </a>
        )}

        {/* Botão de Logout - Abre o modal */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Tem certeza que deseja sair?
            </h2>
            <p className="text-gray-600 mb-6">Você precisará fazer login novamente para acessar sua conta.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
