'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage('Token de redefinição inválido ou ausente.');
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Senha redefinida com sucesso!');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setMessage(data.error || 'Erro ao redefinir senha.');
      }
    } catch (error) {
      setMessage('Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
        <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-red-500/30 shadow-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-cinzel font-bold text-red-400 mb-4">
              Link Inválido
            </h1>
            <p className="text-gray-300 mb-6">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <Link href="/auth/forgot-password">
              <button className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                🔄 Solicitar Novo Link
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
      <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-[#d4af37]/30 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-cinzel font-bold text-[#d4af37] mb-2">
            🔑 Redefinir Senha
          </h1>
          <p className="text-gray-400 text-sm">
            Digite sua nova senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              🔒 Nova Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua nova senha"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded bg-[#1a1a1a] text-[#d4af37] placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              🔒 Confirmar Nova Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua nova senha"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded bg-[#1a1a1a] text-[#d4af37] placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              disabled={isLoading}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('✅')
                ? 'bg-green-900/50 text-green-200 border border-green-700'
                : 'bg-red-900/50 text-red-200 border border-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword}
            className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '🔄 Redefinindo...' : '✅ Redefinir Senha'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-sm text-[#d4af37] hover:underline">
            ← Voltar ao Login
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-lg text-xs text-gray-500 border border-gray-700">
          <p>
            <strong>🛡️ Segurança:</strong> Sua nova senha deve ter pelo menos 6 caracteres e será criptografada.
          </p>
        </div>
      </div>
    </div>
  );
}