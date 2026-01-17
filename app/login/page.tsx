import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container fade-in">
      <div className="card text-center">
        <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
          🚪 Entrada no Mundo Feudal
        </h1>

        <div className="space-y-6 text-lg leading-relaxed mb-8">
          <p>
            Você está prestes a entrar em um mundo onde o ordinário encontra o extraordinário.
            Prepare-se para uma jornada de descoberta gradual.
          </p>

          <p className="italic">
            "Não há garantias neste mundo. Apenas escolhas e consequências."
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/character/create">
            <button className="w-full max-w-sm">
              🎭 Criar Novo Personagem
            </button>
          </Link>

          <Link href="/">
            <button style={{
              background: 'transparent',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            className="hover:opacity-80"
            >
              ← Voltar ao Início
            </button>
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'rgba(139, 69, 19, 0.1)' }}>
          <h3 className="font-semibold mb-2">🎯 O que esperar:</h3>
          <ul className="text-sm space-y-1">
            <li>• Criação de personagem detalhada e significativa</li>
            <li>• Sistema de progressão orgânica e realista</li>
            <li>• Descoberta gradual do mundo sobrenatural</li>
            <li>• Histórias que evoluem com suas escolhas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
