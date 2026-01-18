'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erro ao verificar email.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro interno do servidor. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
      <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-[#d4af37]/30 shadow-xl">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-cinzel font-bold text-[#d4af37] mb-4">
                Verificando Email
              </h1>
              <p className="text-gray-300">
                Aguarde enquanto confirmamos sua conta...
              </p>
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto"></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-cinzel font-bold text-green-400 mb-4">
                Email Confirmado!
              </h1>
              <p className="text-gray-300 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Você será redirecionado para a página de login em alguns segundos...
              </p>
              <Link href="/auth/signin">
                <button className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                  🚪 Ir para Login
                </button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-cinzel font-bold text-red-400 mb-4">
                Erro na Verificação
              </h1>
              <p className="text-gray-300 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link href="/auth/register">
                  <button className="w-full px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                    📝 Criar Nova Conta
                  </button>
                </Link>
                <Link href="/auth/signin">
                  <button className="w-full px-6 py-3 bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                    🚪 Fazer Login
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}