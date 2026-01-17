"use client";

import { useState } from 'react';
import OnboardingModal from './components/OnboardingModal';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartJourney = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    window.location.href = '/character/create';
  };

  return (
    <div className="bg-feudal min-h-screen">
      <div className="container fade-in">
        <div className="scroll text-center">
          <h1 className="title-hero mb-8 text-center">
            Um Japão esquecido observa você.
          </h1>

          <div className="space-y-8">
            <p className="narrative-italic text-center max-w-3xl mx-auto">
              Nem todos os horrores vivem nos contos.<br />
              Alguns caminham pelas estradas, se escondem nos templos<br />
              e observam aqueles que ainda não despertaram.
            </p>

            <div className="space-y-6 max-w-4xl mx-auto">
              <p className="narrative-body">
                <strong className="font-title text-gold">Mesa Feudal</strong> é um RPG narrativo ambientado em um Japão feudal alternativo,
                onde a vida cotidiana, o perigo humano e o sobrenatural coexistem em silêncio.
              </p>

              <p className="narrative-body">
                Você começa como uma pessoa comum — camponês, mercador, monge, soldado —
                sem saber que o mundo guarda algo além do visível.
              </p>

              <p className="narrative-body">
                Conforme sua história se desenvolve, suas escolhas moldam seu corpo, sua mente
                e sua percepção do oculto… até o dia em que você não pode mais fingir que não vê.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <button
              onClick={handleStartJourney}
              className="btn-primary block mx-auto"
            >
              🏮 Começar Jornada
            </button>

            <p className="narrative-italic text-center">
              Crie seu personagem. Viva. Sobreviva. Desperte.
            </p>

            <div className="text-center">
              <span className="interface-small">Já é aventureiro? </span>
              <button
                onClick={() => window.location.href = '/auth/signin'}
                className="text-gold hover:underline"
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>

        <div className="parchment">
          <h2 className="title-section mb-8 text-center">
            🕯️ O Que Aguarda Aqueles que Caminham
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="title-card text-center text-gold">🧭 Evolução Silenciosa</h3>
              <p className="narrative-body text-center">
                Nada acontece de uma vez.<br />
                Cada decisão, rotina ou erro molda seu corpo, sua mente<br />
                e aquilo que você será capaz de perceber.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="title-card text-center" style={{ color: 'var(--coal-black)' }}>👤 Vidas Comuns</h3>
              <p className="narrative-body text-center">
                Você começa invisível para o mundo.<br />
                Um rosto entre muitos. Nenhum destino escrito.<br />
                Nenhuma proteção divina.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="title-card text-center text-gold">⏳ O Peso do Tempo</h3>
              <p className="narrative-body text-center">
                Os anos passam. O corpo muda. Relações surgem e se desfazem.<br />
                Você pode deixar filhos, histórias…<br />
                ou marcas que nunca desaparecem.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="title-card text-center text-red">🌑 Aquilo Que Não Deveria Ser Visto</h3>
              <p className="narrative-body text-center">
                Você não será avisado.<br />
                Você não será preparado.<br />
                Quando perceber que algo está errado, talvez já seja tarde.
              </p>
            </div>
          </div>
        </div>

        {showOnboarding && (
          <OnboardingModal
            onClose={() => setShowOnboarding(false)}
            onContinue={handleOnboardingComplete}
          />
        )}
      </div>
    </div>
  );
}
