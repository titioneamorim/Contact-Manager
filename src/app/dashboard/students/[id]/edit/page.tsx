'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [student, setStudent] = useState<{ name: string; cpf: string; phone: string; classId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [classId, setClassId] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${params.id}`);
        if (!res.ok) throw new Error('Falha ao carregar aluno.');
        const data = await res.json();

        setStudent(data);
        setName(data.name);
        setCpf(data.cpf);
        setPhone(data.phone);
        setClassId(data.class.id);
      } catch (error) {
        setError('Aluno não encontrado.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [params.id]);

  // 🔹 Validação para Nome Completo
  const validateName = (name: string) => {
    return name.trim().split(/\s+/).length >= 2;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value) ? null : 'O nome deve ter pelo menos duas palavras.');
  };

  // 🔹 Validação para CPF (deve ter 11 números)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length === 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setCpfError(null);
    } else {
      setCpfError('O CPF deve ter 11 números.');
    }
    setCpf(value);
  };

  // 🔹 Validação para Telefone (deve ter 10 ou 11 números)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length === 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      setPhoneError(null);
    } else if (value.length === 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      setPhoneError(null);
    } else {
      setPhoneError('O telefone deve ter 10 ou 11 números.');
    }
    setPhone(value);
  };

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (nameError || cpfError || phoneError) {
      return;
    }

    const updatedData = { name, cpf, phone };

    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Erro ao atualizar aluno.');

      const data = await res.json();
      router.push(data.redirectUrl);
      router.refresh();
    } catch (error) {
      setError('Erro ao atualizar aluno. Tente novamente.');
    }
  }

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Editar Aluno</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${nameError ? 'border-red-500' : 'border-gray-300'}`}
          />
          {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={handleCpfChange}
            required
            maxLength={14}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${cpfError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="000.000.000-00"
          />
          {cpfError && <p className="text-red-600 text-sm mt-1">{cpfError}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            required
            maxLength={15}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="(00) 00000-0000"
          />
          {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Cancelar
          </button>
          <button type="submit" disabled={!!nameError || !!cpfError || !!phoneError} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
