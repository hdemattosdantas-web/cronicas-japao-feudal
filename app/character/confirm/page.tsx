"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { calculateAttributes } from "@/lib/calculateAttributes";

function ConfirmCharacterContent() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const name = params.get("name") || "Desconhecido";
  const age = params.get("age") || "18";
  const origin = params.get("origin") || "Owari";
  const lore = params.get("lore") || "";
  const profession = params.get("profession") || "Camponês";
  const image = params.get("image") || "";

  const attributes = calculateAttributes(
    lore,
    Number(age),
    profession
  );

  const attributeDescriptions = {
    corpo: "Constituição física, saúde e resistência",
    força: "Força de vontade, determinação e coragem",
    agilidade: "Velocidade, reflexos e coordenação",
    percepção: "Awareness espiritual e sentidos aguçados",
    intelecto: "Conhecimento, raciocínio e aprendizado",
    vontade: "Força espiritual e resistência mental"
  };

  const handleSaveCharacter = async () => {
    if (!session?.user) {
      alert('Você precisa estar logado para salvar um personagem');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          origin,
          profession,
          lore,
          image,
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        alert('Personagem salvo com sucesso!');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar personagem');
      }
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      setSaveStatus('error');
      alert('Erro ao salvar personagem. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            ✨ Confirmação do Personagem
          </h1>
          <div className="space-x-3">
            <Link href="/character/create">
              <button style={{
                background: 'transparent',
                border: '2px solid var(--border)',
                color: 'var(--foreground)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                ← Editar
              </button>
            </Link>
            <Link href="/">
              <button style={{
                background: 'transparent',
                border: '2px solid var(--border)',
                color: 'var(--foreground)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                🏠 Início
              </button>
            </Link>
          </div>
        </div>

        {/* Character Image */}
        {image && (
          <div className="text-center mb-8">
            <img
              src={image}
              alt={`Imagem de ${name}`}
              className="character-image mx-auto"
            />
          </div>
        )}

        {/* Informações Básicas */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
              <div className="space-y-2 text-sm">
                <p><strong>🎂 Idade:</strong> {age} anos</p>
                <p><strong>🗺️ Província:</strong> {origin}</p>
                <p><strong>⚒️ Profissão:</strong> {profession}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              🎭 Status Inicial
            </h3>
            <div className="space-y-1 text-sm">
              <p>✨ <strong>Humano Comum</strong></p>
              <p>🌑 <strong>Espírito Adormecido</strong></p>
              <p>📊 <strong>Experiência: 0</strong></p>
            </div>
          </div>
        </div>

        {/* História */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            📖 História de Vida
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: 'var(--accent)' }}>
            <p className="text-sm leading-relaxed italic">"{lore}"</p>
          </div>
        </div>

        {/* Atributos */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            ⚡ Atributos Iniciais
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border"
                   style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <div>
                  <div className="font-semibold capitalize">{key}</div>
                  <div className="text-xs opacity-70">{attributeDescriptions[key as keyof typeof attributeDescriptions]}</div>
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Espiritual */}
        <div className="mb-6 p-4 rounded-lg border-2 border-dashed"
             style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
          <h3 className="font-semibold mb-2 flex items-center">
            🌑 Estado Espiritual
          </h3>
          <p className="text-sm opacity-80">
            Seus atributos espirituais ainda não foram despertos. O sobrenatural se revela gradualmente
            através de encontros com criaturas místicas e experiências transcendentais.
          </p>
          <div className="mt-3 text-xs opacity-60">
            <p><strong>Percepção Espiritual:</strong> Latente</p>
            <p><strong>Afinidade Mística:</strong> Indetectável</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/character/create" className="flex-1">
            <button
              className="w-full"
              style={{
                background: 'transparent',
                border: '2px solid var(--accent)',
                color: 'var(--accent)'
              }}
            >
              ✏️ Editar Personagem
            </button>
          </Link>

          <button
            onClick={handleSaveCharacter}
            disabled={isSaving || saveStatus === 'success'}
            className="flex-1"
            style={{
              background: saveStatus === 'success'
                ? 'linear-gradient(135deg, #28a745, #20c997)'
                : 'linear-gradient(135deg, var(--accent), #a0522d)',
              border: 'none',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving || saveStatus === 'success' ? 'not-allowed' : 'pointer'
            }}
          >
            {saveStatus === 'saving' && '💾 Salvando...'}
            {saveStatus === 'success' && '✅ Personagem Salvo!'}
            {saveStatus === 'idle' && '🎮 Salvar Personagem'}
            {saveStatus === 'error' && '❌ Tentar Novamente'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs opacity-60">
          <p>⚠️ Esta é uma versão de demonstração. O sistema completo estará disponível em breve.</p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmCharacterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmCharacterContent />
    </Suspense>
  );
}
