import { useState, useEffect } from 'react';

interface UserModalProps {
  user: { id?: string; name: string; email: string; role: string } | null;
  onClose: () => void;
  onSave: (user: { id?: string; name: string; email: string; role: string }) => Promise<void>;
}

export default function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'USER');
    }
  }, [user]);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    // Validação do nome (mínimo 2 palavras)
    // const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    // if (!nameRegex.test(name.trim())) {
    //   setError('O nome deve conter pelo menos duas palavras.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Digite um e-mail válido no formato exemplo@email.com.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave({ id: user?.id, name, email, role });
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {user?.id ? 'Editar Usuário' : 'Adicionar Usuário'}
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}

        <div className="flex flex-col gap-4">
          <label className="block">
            Nome:
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="block">
            E-mail:
            <input
              type="email"
              className="w-full border p-2 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            Função:
            <select
              className="w-full border p-2 rounded mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
              <option value="COORDINATOR">Coordenador</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded transition ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
