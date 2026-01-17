"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Room {
  id: string;
  name: string;
  description: string;
  maxPlayers: number;
  currentPlayers: number;
  isPrivate: boolean;
  campaignId: string;
  hostId: string;
  createdAt: string;
  isActive: boolean;
}

export default function RoomsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    maxPlayers: 4,
    campaignId: 'jornada-inicial'
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadRooms();
  }, [session]);

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        const newRoom = await response.json();
        setRooms(prev => [...prev, newRoom]);
        setShowCreateForm(false);
        setCreateForm({
          name: '',
          description: '',
          maxPlayers: 4,
          campaignId: 'jornada-inicial'
        });
      } else {
        const error = await response.json();
        alert(`Erro ao criar sala: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      alert('Erro ao criar sala. Tente novamente.');
    }
  };

  const handleJoinRoom = (roomId: string, characterId?: string) => {
    if (!characterId) {
      alert('Selecione um personagem primeiro!');
      router.push('/characters');
      return;
    }

    router.push(`/game?character=${characterId}&room=${roomId}`);
  };

  if (!session) {
    return null; // Redirecionará
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              🏰 Salas de Jornada
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Junte-se a outros aventureiros ou crie sua própria sala
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {showCreateForm ? '❌ Cancelar' : '➕ Criar Sala'}
            </button>
            <Link href="/characters">
              <button style={{
                background: 'transparent',
                border: '2px solid var(--border)',
                color: 'var(--foreground)',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                🎭 Meus Personagens
              </button>
            </Link>
          </div>
        </div>

        {/* Formulário de Criação */}
        {showCreateForm && (
          <div className="mb-6 p-6 rounded-lg border-2"
               style={{ borderColor: 'var(--accent)', backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
            <h3 className="text-lg font-bold mb-4">🏰 Criar Nova Sala</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nome da Sala *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Aventura na Floresta"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Máximo de Jogadores
                  </label>
                  <select
                    value={createForm.maxPlayers}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                    className="w-full"
                  >
                    <option value={2}>2 jogadores</option>
                    <option value={4}>4 jogadores</option>
                    <option value={6}>6 jogadores</option>
                    <option value={8}>8 jogadores</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Descrição
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a jornada que vocês vão enfrentar..."
                  rows={3}
                  className="w-full resize-vertical"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Campanha
                </label>
                <select
                  value={createForm.campaignId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, campaignId: e.target.value }))}
                  className="w-full"
                >
                  <option value="jornada-inicial">🏯 Jornada Inicial - Vila de Owari</option>
                  <option value="floresta-misteriosa">🌲 Floresta Encantada (Em breve)</option>
                  <option value="montanhas-proibidas">⛰️ Montanhas Proibidas (Em breve)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  🎮 Criar Sala
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    background: 'transparent',
                    border: '2px solid var(--border)',
                    color: 'var(--foreground)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Salas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
            <p>Carregando salas disponíveis...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏰</div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma sala disponível</h3>
            <p className="text-gray-600 mb-6">
              Seja o primeiro a criar uma jornada compartilhada!
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              🏰 Criar Primeira Sala
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-6 rounded-lg border-2 hover:shadow-lg transition-shadow"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold">{room.name}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    room.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.isActive ? '🎮 Ativa' : '⏳ Aguardando'}
                  </div>
                </div>

                <p className="text-sm opacity-80 mb-4 line-clamp-2">
                  {room.description || 'Uma jornada épica no Japão feudal...'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Jogadores:</span>
                    <span className="font-semibold">
                      {room.currentPlayers}/{room.maxPlayers}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Campanha:</span>
                    <span className="font-semibold">
                      {room.campaignId === 'jornada-inicial' ? '🏯 Inicial' : room.campaignId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Criado:</span>
                    <span className="text-xs opacity-60">
                      {new Date(room.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.currentPlayers >= room.maxPlayers}
                    className="flex-1"
                    style={{
                      background: room.currentPlayers >= room.maxPlayers ? '#ccc' : 'var(--accent)',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: room.currentPlayers >= room.maxPlayers ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {room.currentPlayers >= room.maxPlayers ? '🏰 Lotada' : '🚪 Entrar'}
                  </button>
                  <Link href={`/friends?invite=${room.id}`}>
                    <button
                      className="px-3 py-2 text-sm"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        borderRadius: '4px'
                      }}
                    >
                      👥 Convidar
                    </button>
                  </Link>
                  {room.isPrivate && (
                    <span className="text-xs opacity-60 self-center">🔒 Privada</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informações */}
        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
          <h3 className="font-semibold mb-3 flex items-center">
            🎲 Sobre as Salas Multiplayer
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🤝 Jogabilidade Cooperativa</h4>
              <ul className="space-y-1 opacity-80">
                <li>• Até 8 jogadores por sala</li>
                <li>• Narrativa compartilhada</li>
                <li>• IA adapta às escolhas do grupo</li>
                <li>• Chat em tempo real</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎭 IA Mestre do Mundo</h4>
              <ul className="space-y-1 opacity-80">
                <li>• Controla encontros e NPCs</li>
                <li>• Adapta mundo às escolhas</li>
                <li>• Gera eventos dinâmicos</li>
                <li>• Mantém atmosfera feudal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}