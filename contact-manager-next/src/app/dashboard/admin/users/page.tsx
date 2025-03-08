'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import UserModal from '@/components/UserModal';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users', { cache: 'no-store' });
        if (!res.ok) throw new Error('Erro ao buscar usuários.');

        const data = await res.json();
        console.log('🔹 Dados da API:', data);
        setUsers(data);
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        setError('Erro ao carregar usuários.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Erro ao excluir usuário.');

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir usuário.');
    }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const method = updatedUser.id ? 'PUT' : 'POST';

      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      const savedUser = await res.json();
      if (!res.ok) throw new Error(savedUser.error || 'Erro ao salvar usuário.');

      setUsers((prevUsers) =>
        updatedUser.id
          ? prevUsers.map((user) => (user.id === savedUser.id ? savedUser : user))
          : [...prevUsers, savedUser]
      );

      setSelectedUser(null);
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao processar a solicitação.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gerenciar Usuários</h1>

      <button
        onClick={() => setIsAdding(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mb-6"
      >
        Adicionar Usuário
      </button>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id!)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onSave={handleSave} />}
      {isAdding && <UserModal user={null} onClose={() => setIsAdding(false)} onSave={handleSave} />}
    </div>
  );
}
