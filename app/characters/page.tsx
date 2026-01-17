"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Character {
  id: string;
  name: string;
  age: number;
  origin: string;
  profession: string;
  lore: string;
  attributes: any;
  createdAt: string;
  currentLocation?: string;
  evolutionLevel?: number;
  familyName?: string;
}

export default function CharactersPage() {
  const { data: session, status } = useSession();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    fetchCharacters();
  }, [session, status]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch("/api/characters");
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      }
    } catch (error) {
      console.error("Erro ao carregar personagens:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <p>Carregando personagens...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirecionará
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              🏯 Meus Personagens
            </h1>
            <p className="text-sm opacity-70 mt-1">
              {characters.length} personagem{characters.length !== 1 ? 's' : ''} criado{characters.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/character/create">
            <button>+ Novo Personagem</button>
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum personagem ainda</h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro personagem para a jornada no Japão feudal
            </p>
            <Link href="/character/create">
              <button>Criar Primeiro Personagem</button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{character.name}</h3>
                    <p className="text-sm opacity-70">
                      {character.age} anos • {character.origin}
                    </p>
                    {character.familyName && (
                      <p className="text-xs opacity-60">
                        Família: {character.familyName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">
                      {character.profession === "Samurai" && "⚔️"}
                      {character.profession === "Monge budista" && "🧘"}
                      {character.profession === "Mercador" && "💰"}
                      {character.profession === "Ferreiro" && "🔨"}
                      {character.profession === "Camponês" && "🌾"}
                      {character.profession === "Artista ambulante" && "🎨"}
                      {!["Samurai", "Monge budista", "Mercador", "Ferreiro", "Camponês", "Artista ambulante"].includes(character.profession) && "👤"}
                    </span>
                    {character.evolutionLevel && character.evolutionLevel > 1 && (
                      <div className="text-xs opacity-70 mt-1">
                        Nv. {character.evolutionLevel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span><strong>Profissão:</strong> {character.profession}</span>
                    {character.currentLocation && (
                      <span className="text-sm opacity-70">
                        📍 {character.currentLocation}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Corpo:</strong> {character.attributes.corpo}</div>
                    <div><strong>Força:</strong> {character.attributes.força}</div>
                    <div><strong>Agilidade:</strong> {character.attributes.agilidade}</div>
                    <div><strong>Percepção:</strong> {character.attributes.percepcao}</div>
                  </div>
                </div>

                <div className="text-xs opacity-60 mb-4">
                  Criado em {new Date(character.createdAt).toLocaleDateString('pt-BR')}
                </div>

                <div className="flex gap-2">
                  <Link href={`/game?character=${character.id}`} className="flex-1">
                    <button
                      className="w-full"
                      style={{
                        background: 'var(--accent)',
                        border: 'none',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      🎮 Jogar
                    </button>
                  </Link>
                  <button
                    className="px-3 py-1 text-sm"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    👁️ Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/">
            <button style={{
              background: 'transparent',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
              padding: '8px 16px',
              borderRadius: '6px'
            }}>
              ← Voltar ao Início
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}