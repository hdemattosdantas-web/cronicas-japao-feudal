'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages = {
  Configuration: 'Há um problema na configuração do servidor.',
  AccessDenied: 'Acesso negado. Você não tem permissão para acessar este recurso.',
  Verification: 'O link de verificação pode estar inválido ou expirado.',
  Default: 'Ocorreu um erro durante a autenticação.',
  CredentialsSignin: 'Credenciais inválidas. Verifique seu email e senha.',
  EmailSignin: 'Erro ao enviar email de verificação.',
  OAuthSignin: 'Erro ao fazer login com o provedor externo.',
  OAuthCallback: 'Erro no callback do provedor externo.',
  OAuthCreateAccount: 'Erro ao criar conta com o provedor externo.',
  EmailCreateAccount: 'Erro ao criar conta com email.',
  Callback: 'Erro no callback de autenticação.',
  OAuthAccountNotLinked: 'Para confirmar sua identidade, faça login com a mesma conta que você usou originalmente.',
  SessionRequired: 'Faça login para acessar esta página.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as keyof typeof errorMessages;

  const getErrorMessage = (error: string) => {
    return errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;
  };

  const getErrorIcon = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return '🔐';
      case 'AccessDenied':
        return '🚫';
      case 'Configuration':
        return '⚙️';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'OAuthAccountNotLinked':
        return '🔗';
      case 'Verification':
        return '📧';
      default:
        return '❌';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
      <div className="max-w-md mx-auto bg-[#2a2a2a] p-8 rounded-lg border border-red-500/30 shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">{getErrorIcon(error)}</div>
          <h1 className="text-2xl font-cinzel font-bold text-red-400 mb-4">
            Erro de Autenticação
          </h1>
          <p className="text-gray-300 mb-6">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            {error === 'CredentialsSignin' && (
              <div className="text-left">
                <h3 className="font-semibold text-[#d4af37] mb-2">💡 Possíveis soluções:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Verifique se o email está correto</li>
                  <li>• Confirme se a senha está certa</li>
                  <li>• Certifique-se de ter confirmado seu email</li>
                  <li>• <Link href="/auth/forgot-password" className="text-[#d4af37] hover:underline">Clique aqui</Link> se esqueceu a senha</li>
                </ul>
              </div>
            )}

            {(error === 'OAuthSignin' || error === 'OAuthCallback') && (
              <div className="text-left">
                <h3 className="font-semibold text-[#d4af37] mb-2">💡 Possíveis soluções:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Verifique sua conexão com a internet</li>
                  <li>• Tente fazer login novamente</li>
                  <li>• Use o login por email como alternativa</li>
                </ul>
              </div>
            )}

            <div className="flex space-x-3 justify-center pt-4">
              <Link href="/auth/signin">
                <button className="px-6 py-3 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] transition-colors">
                  🔄 Tentar Novamente
                </button>
              </Link>
              <Link href="/">
                <button className="px-6 py-3 bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                  🏠 Ir para Início
                </button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-[#1a1a1a] rounded text-xs text-gray-500 border border-gray-700">
              <strong>Código do erro:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}