'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage('✅ Email enviado! Verifique sua caixa de entrada com instruções para redefinir sua senha.');
      } else {
        setMessage(data.error || 'Erro ao enviar email. Tente novamente.');
      }
    } catch (error) {
      setMessage('Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
        <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-[#d4af37]/30 shadow-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-cinzel font-bold text-[#d4af37] mb-4">
              Email Enviado!
            </h1>
            <p className="text-gray-300 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              O link expira em 1 hora. Se não recebeu o email, verifique sua caixa de spam.
            </p>
            <Link href="/auth/signin">
              <button className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                ← Voltar ao Login
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
            🔒 Esqueci Minha Senha
          </h1>
          <p className="text-gray-400 text-sm">
            Digite seu email para receber instruções de redefinição
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
            disabled={isLoading || !email}
            className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '📤 Enviando...' : '📧 Enviar Instruções'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-sm text-[#d4af37] hover:underline">
            ← Voltar ao Login
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-lg text-xs text-gray-500 border border-gray-700">
          <p>
            <strong>🛡️ Segurança:</strong> O link de redefinição é válido por 1 hora e só pode ser usado uma vez.
          </p>
        </div>
      </div>
    </div>
  );
}