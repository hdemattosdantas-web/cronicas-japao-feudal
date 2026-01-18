'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerifyRequestPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Tentar obter email do localStorage ou sessionStorage
    const storedEmail = localStorage.getItem('next-auth.email') ||
                       sessionStorage.getItem('next-auth.email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
      <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-[#d4af37]/30 shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-cinzel font-bold text-[#d4af37] mb-4">
            Verifique seu Email
          </h1>
          <p className="text-gray-300 mb-6">
            Enviamos um link mágico para {email ? <strong>{email}</strong> : 'seu email'}.
            Clique no link para entrar automaticamente no jogo.
          </p>

          <div className="bg-[#3a3a3a] p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-[#d4af37] mb-2">📧 O que fazer agora:</h3>
            <ul className="text-sm text-gray-300 text-left space-y-2">
              <li>• Abra seu email</li>
              <li>• Procure por "🏯 Crônicas do Japão Feudal"</li>
              <li>• Clique no botão "Entrar no Mundo Feudal"</li>
              <li>• Você será redirecionado automaticamente</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              Não recebeu o email? Verifique sua caixa de spam ou lixo eletrônico.
            </p>

            <div className="flex space-x-3 justify-center">
              <Link href="/auth/signin">
                <button className="px-4 py-2 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                  🔄 Tentar Novamente
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                  🏠 Voltar ao Início
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}