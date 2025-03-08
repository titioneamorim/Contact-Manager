'use client';

import { ContactWithStudent } from '@/types/database';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

interface Aluno {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  contacts: ContactWithStudent[];
  class: {
    id: string;
    name: string;
  };
}

export default function PaginaAluno({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormularioContato, setMostrarFormularioContato] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    buscarAluno();
  }, [params.id]);

  async function buscarAluno() {
    try {
      const resposta = await fetch(`/api/students/${params.id}`);
      if (!resposta.ok) {
        throw new Error('Erro ao buscar aluno.');
      }
      const dados = await resposta.json();
      setAluno(dados);
    } catch (erro) {
      setErro('Erro ao carregar os detalhes do aluno.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleEnviarContato(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const formData = new FormData(e.currentTarget);
    const dados = {
      type: formData.get('type') as 'PHONE' | 'EMAIL' | 'WHATSAPP',
      username: formData.get('username') as string,
      description: formData.get('description') as string,
      studentId: params.id,
    };

    try {
      const resposta = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message || 'Erro ao adicionar contato.');
      }

      setMostrarFormularioContato(false);
      buscarAluno(); // Atualiza os dados do aluno
    } catch (erro) {
      if (erro instanceof Error) {
        setErro(erro.message);
      } else {
        setErro('Ocorreu um erro ao adicionar o contato.');
      }
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (erro || !aluno) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{erro || 'Aluno não encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Voltar para a Turma
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{aluno.name}</h1>
            <p className="text-gray-600 mt-1">Turma: {aluno.class.name}</p>
            <p className="text-gray-600">CPF: {aluno.cpf}</p>
            <p className="text-gray-600">Telefone: {aluno.phone}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Histórico de Contatos</h2>
            <button
              onClick={() => setMostrarFormularioContato(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Adicionar Contato
            </button>
          </div>

          {mostrarFormularioContato && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <form onSubmit={handleEnviarContato} className="space-y-4">
                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {erro}
                  </div>
                )}

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Contato
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PHONE">Telefone</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Contato
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do contato"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detalhes sobre o contato"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setMostrarFormularioContato(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      enviando ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {enviando ? 'Adicionando...' : 'Adicionar Contato'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {aluno.contacts.map((contato) => (
              <div key={contato.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      contato.type === 'PHONE'
                        ? 'bg-blue-100 text-blue-800'
                        : contato.type === 'EMAIL'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {contato.type === 'PHONE'
                      ? 'Telefone'
                      : contato.type === 'EMAIL'
                      ? 'E-mail'
                      : 'WhatsApp'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Contato: {contato.username}</p>
                <p className="text-gray-700">{contato.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
