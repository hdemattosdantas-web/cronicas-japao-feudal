"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { io, Socket } from 'socket.io-client';
import { Scene, GameState } from "@/lib/game/types";
import CreatureEncounter from "@/app/components/CreatureEncounter";
import { CreatureEncounter as CreatureEncounterType } from "@/lib/game/creature-types";
import GameMap from "@/app/components/GameMap";
import MiniMap from "@/app/components/MiniMap";
import CharacterEvolution from "@/app/components/CharacterEvolution";
import { PlayerPosition, JAPAN_FEUDAL_MAP } from "@/lib/game/map-coordinates";
import { ExpandedAttributes, CharacterEvolutionManager } from "@/lib/game/character-evolution";
import { gameMaster } from "@/lib/game-master/engine";
import { travelSystem, TravelMethod, ActiveTravel } from "@/lib/game/travel-system";

export default function GamePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get('character');
  const roomId = searchParams.get('room') || `solo_${characterId}`;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [makingChoice, setMakingChoice] = useState(false);

  // Multiplayer state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState(1);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentNarration, setCurrentNarration] = useState<string>('');
  const [narrationMood, setNarrationMood] = useState<string>('mysterious');
  const [activeCreatureEncounter, setActiveCreatureEncounter] = useState<CreatureEncounterType | null>(null);
  const [playersPositions, setPlayersPositions] = useState<PlayerPosition[]>([]);
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState<PlayerPosition | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionManager] = useState(() => new CharacterEvolutionManager());
  const [activeTravel, setActiveTravel] = useState<ActiveTravel | null>(null);
  const [showTravelOptions, setShowTravelOptions] = useState(false);
  const [expandedAttributes, setExpandedAttributes] = useState<ExpandedAttributes>({
    corpo: 5, forca: 5, agilidade: 5, percepcao: 5, intelecto: 5, vontade: 5,
    harmonia_espiritual: 0, resistencia_sobrenatural: 0, afinidade_elemental: 0,
    empatia_emocional: 0, memoria_ancestral: 0, adaptabilidade_mistica: 0
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!characterId) {
      router.push("/characters");
      return;
    }

    // Inicializar socket connection
    initSocketConnection();

    loadGame();

    return () => {
      // Cleanup socket on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [session, characterId, roomId]);

  const initSocketConnection = () => {
    const socketUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:4000';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🟢 Conectado ao servidor multiplayer');
      setIsConnected(true);

      // Entrar na sala
      newSocket.emit('join-room', {
        roomId,
        playerId: session?.user?.id || 'anonymous',
        characterId,
        userEmail: session?.user?.email || '',
        userName: session?.user?.name || 'Jogador',
        initialLocation: 'owari_village'
      });
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Desconectado do servidor');
      setIsConnected(false);
    });

    // Receber estado da sala
    newSocket.on('room-state', (data) => {
      setPlayersInRoom(data.players);
    });

    // Jogador entrou na sala
    newSocket.on('player-joined', (data) => {
      setPlayersInRoom(data.playerCount);
      addChatMessage({
        type: 'system',
        message: `Um novo aventureiro entrou na jornada! (${data.playerCount} jogadores)`,
        timestamp: new Date().toISOString()
      });
    });

    // Jogador saiu da sala
    newSocket.on('player-left', (data) => {
      setPlayersInRoom(data.playerCount);
      addChatMessage({
        type: 'system',
        message: `Um aventureiro deixou a jornada. (${data.playerCount} jogadores)`,
        timestamp: new Date().toISOString()
      });
    });

    // Receber narração do Game Master
    newSocket.on('narration-update', (data) => {
      setCurrentNarration(data.narration);
      setNarrationMood(data.mood);

      addChatMessage({
        type: 'narration',
        message: data.narration,
        mood: data.mood,
        timestamp: new Date().toISOString()
      });
    });

    // Mudança de cena
    newSocket.on('scene-change', (data) => {
      setCurrentScene(data.scene);
      setGameState(data.gameState);
    });

    // Encontro aleatório
    newSocket.on('random-encounter', (data) => {
      // Verificar se é um encontro com criatura misteriosa
      if (data.encounter.creatureData) {
        setActiveCreatureEncounter(data.encounter.creatureData);
      } else {
        // Encontro normal
        addChatMessage({
          type: 'encounter',
          message: `🎲 Encontro: ${data.encounter.description}`,
          encounter: data.encounter,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Atualizações do mapa e posições
    newSocket.on('players-positions-update', (positions: PlayerPosition[]) => {
      setPlayersPositions(positions);
      // Encontrar posição do jogador atual
      const currentPlayerPos = positions.find(p => p.playerId === characterId);
      if (currentPlayerPos) {
        setCurrentPlayerPosition(currentPlayerPos);
      }
    });

    newSocket.on('player-position-update', (data: { playerId: string, position: PlayerPosition }) => {
      setPlayersPositions(prev =>
        prev.map(p => p.playerId === data.playerId ? data.position : p)
      );

      // Atualizar posição própria se for o jogador atual
      if (data.playerId === characterId) {
        setCurrentPlayerPosition(data.position);
      }
    });

    newSocket.on('player-joined', (data) => {
      addChatMessage({
        type: 'system',
        message: `🟢 ${data.playerPosition?.userName || 'Jogador'} entrou no jogo`,
        timestamp: new Date().toISOString()
      });

      // Solicitar atualização das posições
      newSocket.emit('request-positions', { roomId });
    });

    newSocket.on('player-left', (data) => {
      addChatMessage({
        type: 'system',
        message: `🔴 ${data.userName || 'Jogador'} saiu do jogo`,
        timestamp: new Date().toISOString()
      });

      // Remover jogador das posições
      setPlayersPositions(prev => prev.filter(p => p.playerId !== data.playerId));
    });

    // Mensagens de chat
    newSocket.on('chat-message', (data) => {
      addChatMessage(data);
    });

    // Respostas de NPC
    newSocket.on('npc-response', (data) => {
      addChatMessage({
        type: 'npc',
        message: `${data.npcId}: ${data.response}`,
        attitude: data.attitude,
        timestamp: new Date().toISOString()
      });
    });

    // Erros
    newSocket.on('error', (data) => {
      addChatMessage({
        type: 'error',
        message: `❌ ${data.message}`,
        timestamp: new Date().toISOString()
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const addChatMessage = (message: any) => {
    setChatMessages(prev => [...prev.slice(-50), message]); // Manter últimas 50 mensagens
  };

  const handleCreatureResolution = async (choice: 'peaceful' | 'confrontational' | 'avoidance' | 'observe') => {
    if (!activeCreatureEncounter || !gameState) return;

    try {
      // Registrar evolução baseada na resolução
      const success = choice === 'peaceful' || choice === 'confrontational'
      gameMaster.processCreatureResolution(activeCreatureEncounter, choice, evolutionManager, success);

      // Atualizar atributos expandidos
      const newTotalAttributes = evolutionManager.calculateTotalAttributes(expandedAttributes);
      setExpandedAttributes(newTotalAttributes);

      // Processar a escolha através da API
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          choice: `creature_${choice}`,
          creatureEncounter: activeCreatureEncounter,
          resolutionType: choice
        })
      });

      if (response.ok) {
        const result = await response.json();

        // Adicionar narração da resolução ao chat
        addChatMessage({
          type: 'narration',
          message: result.narration || 'O encontro foi resolvido...',
          timestamp: new Date().toISOString()
        });

        // Aplicar mudanças nos atributos se houver
        if (result.attributeChanges) {
          setGameState(prev => prev ? {
            ...prev,
            attributes: {
              ...prev.attributes,
              ...result.attributeChanges
            }
          } : null);
        }
      }
    } catch (error) {
      console.error('Erro ao resolver encontro:', error);
    }

    // Fechar o modal
    setActiveCreatureEncounter(null);
  };

  const dismissCreatureEncounter = () => {
    setActiveCreatureEncounter(null);
  };

  const handleLocationSelect = (locationId: string) => {
    // Mapa apenas para visualização, sem viagem rápida
    console.log(`Visualizando local: ${locationId}`);
  };

  const handlePlayerClick = (player: PlayerPosition) => {
    addChatMessage({
      type: 'system',
      message: `👤 ${player.userName} está em ${player.locationId} (${player.status})`,
      timestamp: new Date().toISOString()
    });
  };

  const updatePlayerPosition = (locationId: string, coordinates: { x: number, y: number }, status: PlayerPosition['status'] = 'exploring') => {
    if (socket && currentPlayerPosition) {
      socket.emit('update-position', {
        roomId,
        playerId: characterId,
        locationId,
        coordinates,
        status
      });
    }
  };

  const handleExpandMap = () => {
    setShowMap(true);
  };

  const handleStartTravel = (destinationId: string, method: TravelMethod) => {
    try {
      const currentLocation = currentPlayerPosition?.locationId || 'owari_village';
      const travel = travelSystem.startTravel(characterId || 'unknown', currentLocation, destinationId, method);
      setActiveTravel(travel);
      setShowTravelOptions(false);

      addChatMessage({
        type: 'system',
        message: `🧳 Iniciando viagem de ${JAPAN_FEUDAL_MAP[currentLocation]?.name} para ${JAPAN_FEUDAL_MAP[destinationId]?.name} (${travel.totalDays} dias)`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao iniciar viagem:', error);
    }
  };

  const handleProgressTravel = () => {
    if (!activeTravel) return;

    try {
      const result = travelSystem.progressTravel(activeTravel.characterId);

      if (result.completed) {
        // Viagem completada
        addChatMessage({
          type: 'system',
          message: `✅ Chegada a ${JAPAN_FEUDAL_MAP[result.travel.toLocation]?.name}!`,
          timestamp: new Date().toISOString()
        });

        // Atualizar posição do jogador
        updatePlayerPosition(result.travel.toLocation, { x: 400, y: 350 }, 'resting');
        setActiveTravel(null);
      } else {
        // Eventos durante viagem
        result.events.forEach(event => {
          addChatMessage({
            type: 'narration',
            message: `🧳 ${event.title}: ${event.description}`,
            timestamp: new Date().toISOString()
          });
        });

        setActiveTravel(result.travel);
      }
    } catch (error) {
      console.error('Erro ao progredir viagem:', error);
    }
  };

  const loadGame = async () => {
    try {
      const response = await fetch(`/api/game-states?character=${characterId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // Se não há estado salvo, iniciar campanha
          await startNewCampaign();
        } else {
          throw new Error(result.error);
        }
      } else {
        setGameState(result.gameState);
        setCurrentScene(result.scene);
      }
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
      alert("Erro ao carregar o jogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const startNewCampaign = async () => {
    try {
      const response = await fetch('/api/game-states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId,
          campaignId: "jornada-inicial"
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao iniciar campanha');
      }

      const result = await response.json();
      setGameState(result.gameState);
      setCurrentScene(result.scene);
    } catch (error) {
      console.error("Erro ao iniciar campanha:", error);
      alert("Erro ao iniciar a campanha. Tente novamente.");
    }
  };

  const handleChoice = async (choiceId: string) => {
    if (!socket || !session?.user?.id || !characterId) return;

    setMakingChoice(true);

    try {
      // Enviar ação via WebSocket
      socket.emit('player-action', {
        roomId,
        playerId: session.user.id,
        action: `Escolheu: ${currentScene?.choices.find(c => c.id === choiceId)?.text || 'Opção desconhecida'}`,
        choiceId
      });

      // Feedback imediato
      addChatMessage({
        type: 'action',
        message: `🎯 Você escolheu: ${currentScene?.choices.find(c => c.id === choiceId)?.text}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Erro ao enviar escolha:", error);
      addChatMessage({
        type: 'error',
        message: '❌ Erro ao processar escolha',
        timestamp: new Date().toISOString()
      });
    } finally {
      setMakingChoice(false);
    }
  };

  const sendChatMessage = (message: string, type: 'message' | 'action' = 'message') => {
    if (!socket || !session?.user?.id || !message.trim()) return;

    socket.emit('chat-message', {
      roomId,
      playerId: session.user.id,
      message: message.trim(),
      type
    });
  };

  const handleNPCInteraction = (npcId: string, action: string) => {
    if (!socket || !session?.user?.id) return;

    socket.emit('npc-interaction', {
      roomId,
      playerId: session.user.id,
      npcId,
      action
    });
  };

  if (loading) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <div className="text-2xl mb-4">🎭</div>
          <p>Carregando sua jornada...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState || !currentScene) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">🏯 Jornada Concluída!</h2>
          <p className="mb-6">Parabéns! Você completou sua primeira jornada no Japão feudal.</p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{gameState?.experience || 0}</div>
              <div className="text-sm">Experiência Ganha</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{gameState?.level || 1}</div>
              <div className="text-sm">Nível Atual</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{gameState?.completedCampaigns?.length || 0}</div>
              <div className="text-sm">Campanhas Completadas</div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/campaigns">
              <button className="w-full max-w-xs">
                🗺️ Explorar Novas Campanhas
              </button>
            </Link>
            <Link href="/characters">
              <button style={{
                background: 'transparent',
                border: '2px solid var(--border)',
                color: 'var(--foreground)',
                padding: '12px 24px',
                borderRadius: '8px'
              }}>
                🏠 Voltar aos Personagens
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* HUD Superior */}
      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{gameState?.health || 100}</div>
          <div className="text-xs opacity-70">Vida</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{gameState?.experience || 0}</div>
          <div className="text-xs opacity-70">Experiência</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{gameState?.level || 1}</div>
          <div className="text-xs opacity-70">Nível</div>
        </div>
        <div className="card p-4 text-center">
          <div className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? '🟢' : '🔴'}
          </div>
          <div className="text-xs opacity-70">{playersInRoom} jogador{playersInRoom !== 1 ? 'es' : ''}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Área Principal do Jogo */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cena Principal */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {currentScene?.title || 'Carregando...'}
              </h1>
              <div className="text-sm opacity-70">
                📍 {currentScene?.location || "Local misterioso"}
                {currentScene?.timeOfDay && ` • ${currentScene.timeOfDay}`}
                {currentScene?.weather && ` • ${currentScene.weather}`}
              </div>
            </div>

            {/* Narração Atual */}
            {currentNarration && (
              <div className={`p-4 rounded-lg mb-4 border-l-4 ${
                narrationMood === 'peaceful' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                narrationMood === 'tense' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                narrationMood === 'mysterious' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                narrationMood === 'dramatic' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <p className="text-base leading-relaxed italic">"{currentNarration}"</p>
              </div>
            )}

            <div className="prose max-w-none mb-6">
              <p className="text-lg leading-relaxed mb-4">{currentScene?.description}</p>

              {currentScene?.narration && !currentNarration && (
                <div className="p-4 rounded-lg italic border-l-4"
                     style={{
                       backgroundColor: 'rgba(139, 69, 19, 0.05)',
                       borderLeftColor: 'var(--accent)'
                     }}>
                  <p className="text-base leading-relaxed">"{currentScene.narration}"</p>
                </div>
              )}
            </div>

            {/* NPCs Presentes */}
            {currentScene?.npcs && currentScene.npcs.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">👥 Personagens Presentes:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {currentScene.npcs.map((npc) => (
                    <div key={npc.id} className="p-3 rounded-lg border"
                         style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                      <div className="font-semibold">{npc.name}</div>
                      <div className="text-sm opacity-70">{npc.description}</div>
                      {npc.profession && (
                        <div className="text-xs mt-1 opacity-60">⚒️ {npc.profession}</div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleNPCInteraction(npc.id, 'conversar')}
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                        >
                          💬 Conversar
                        </button>
                        {npc.canTrade && (
                          <button
                            onClick={() => handleNPCInteraction(npc.id, 'negociar')}
                            className="text-xs px-2 py-1 rounded border"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            🛒 Negociar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Escolhas */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
              🤔 O que você faz?
            </h2>

            <div className="space-y-3">
              {currentScene?.choices.map((choice) => {
                const canChoose = !choice.requirements ||
                  (!choice.requirements.attribute ||
                   (gameState?.attributes[choice.requirements.attribute] || 0) >= (choice.requirements.minValue || 0));

                return (
                  <button
                    key={choice.id}
                    onClick={() => canChoose && handleChoice(choice.id)}
                    disabled={makingChoice || !canChoose}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      canChoose
                        ? 'hover:shadow-lg border-2 border-transparent hover:border-current'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      backgroundColor: canChoose ? 'rgba(255, 255, 255, 0.8)' : 'rgba(200, 200, 200, 0.3)',
                      borderColor: canChoose ? 'var(--border)' : 'var(--border)'
                    }}
                  >
                    <div className="font-semibold">{choice.text}</div>
                    {!canChoose && choice.requirements?.attribute && (
                      <div className="text-xs opacity-70 mt-1">
                        📊 Requer {choice.requirements.attribute}: {choice.requirements.minValue}+
                        (Você tem: {gameState?.attributes[choice.requirements.attribute] || 0})
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {makingChoice && (
              <div className="text-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mx-auto"></div>
                <p className="text-sm mt-2">Consultando o Mestre do Mundo...</p>
              </div>
            )}
          </div>
        </div>

        {/* Painel Lateral - Chat e Multiplayer */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="font-bold mb-3 flex items-center">
              💬 Jornada Compartilhada
              <span className={`ml-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? '🟢' : '🔴'}
              </span>
            </h3>

            {/* Status dos Jogadores */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Jogadores ativos:</span>
                  <span className="font-semibold">{playersInRoom}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Sala:</span>
                  <span className="font-semibold text-xs">{roomId.includes('solo') ? 'Solo' : 'Grupo'}</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto mb-3 p-2 rounded border"
                   style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 p-2 rounded text-sm ${
                    msg.type === 'system' ? 'bg-blue-100 text-blue-800' :
                    msg.type === 'narration' ? 'bg-purple-100 text-purple-800' :
                    msg.type === 'npc' ? 'bg-green-100 text-green-800' :
                    msg.type === 'encounter' ? 'bg-red-100 text-red-800' :
                    msg.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.type === 'narration' && '📖 '}
                    {msg.type === 'npc' && '👤 '}
                    {msg.type === 'encounter' && '⚔️ '}
                    {msg.type === 'system' && 'ℹ️ '}
                    {msg.type === 'error' && '❌ '}
                    {msg.message}
                  </div>
                ))}
              </div>

              {/* Input de Chat */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 rounded text-sm"
                  style={{ border: `1px solid var(--border)` }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        sendChatMessage(input.value);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Digite sua mensagem..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      sendChatMessage(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Inferior */}
      <div className="mt-6 flex justify-center space-x-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{gameState.health}</div>
          <div className="text-xs opacity-70">Vida</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{gameState.experience}</div>
          <div className="text-xs opacity-70">Experiência</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{gameState.level}</div>
          <div className="text-xs opacity-70">Nível</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{gameState.visitedScenes.length}</div>
          <div className="text-xs opacity-70">Cenas Visitadas</div>
        </div>
      </div>

      {/* Cena Principal */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {currentScene.title}
          </h1>
          <div className="text-sm opacity-70">
            📍 {currentScene.location || "Local desconhecido"}
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-lg leading-relaxed mb-4">{currentScene.description}</p>

          {currentScene.narration && (
            <div className="p-4 rounded-lg italic border-l-4"
                 style={{
                   backgroundColor: 'rgba(139, 69, 19, 0.05)',
                   borderLeftColor: 'var(--accent)'
                 }}>
              <p className="text-base leading-relaxed">"{currentScene.narration}"</p>
            </div>
          )}
        </div>

        {/* NPCs Presentes */}
        {currentScene.npcs && currentScene.npcs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">👥 Personagens Presentes:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {currentScene.npcs.map((npc) => (
                <div key={npc.id} className="p-3 rounded-lg border"
                     style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <div className="font-semibold">{npc.name}</div>
                  <div className="text-sm opacity-70">{npc.description}</div>
                  {npc.profession && (
                    <div className="text-xs mt-1 opacity-60">⚒️ {npc.profession}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Escolhas */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
          🤔 O que você faz?
        </h2>

        <div className="space-y-3">
          {currentScene.choices.map((choice) => {
            const canChoose = !choice.requirements ||
              (!choice.requirements.attribute ||
               (gameState.attributes[choice.requirements.attribute] || 0) >= (choice.requirements.minValue || 0));

            return (
              <button
                key={choice.id}
                onClick={() => canChoose && handleChoice(choice.id)}
                disabled={makingChoice || !canChoose}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  canChoose
                    ? 'hover:shadow-lg border-2 border-transparent hover:border-current'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: canChoose ? 'rgba(255, 255, 255, 0.8)' : 'rgba(200, 200, 200, 0.3)',
                  borderColor: canChoose ? 'var(--border)' : 'var(--border)'
                }}
              >
                <div className="font-semibold">{choice.text}</div>
                {!canChoose && choice.requirements?.attribute && (
                  <div className="text-xs opacity-70 mt-1">
                    📊 Requer {choice.requirements.attribute}: {choice.requirements.minValue}+
                    (Você tem: {gameState.attributes[choice.requirements.attribute] || 0})
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {makingChoice && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mx-auto"></div>
            <p className="text-sm mt-2">Processando sua escolha...</p>
          </div>
        )}
      </div>

      {/* Menu Inferior */}
      <div className="mt-6 flex justify-center space-x-4">
        <Link href="/characters">
          <button style={{
            background: 'transparent',
            border: '2px solid var(--border)',
            color: 'var(--foreground)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            🏠 Personagens
          </button>
        </Link>
        <button style={{
          background: 'transparent',
          border: '2px solid var(--border)',
          color: 'var(--foreground)',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          💾 Salvar Progresso
        </button>
        <button
          onClick={() => setShowEvolution(true)}
          style={{
            background: 'transparent',
            border: '2px solid var(--border)',
            color: 'var(--foreground)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          📈 Evolução
        </button>
        <button
          onClick={() => setShowTravelOptions(true)}
          disabled={activeTravel !== null}
          style={{
            background: activeTravel ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            border: '2px solid var(--border)',
            color: activeTravel ? '#ef4444' : 'var(--foreground)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: activeTravel ? 'not-allowed' : 'pointer'
          }}
        >
          {activeTravel ? '🧳 Viajando...' : '🧳 Viajar'}
        </button>
        {activeTravel && (
          <button
            onClick={handleProgressTravel}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              color: '#22c55e',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            📅 Avançar Dia ({Math.round(activeTravel.currentPosition)}%)
          </button>
        )}
        <button style={{
          background: 'transparent',
          border: '2px solid var(--border)',
          color: 'var(--foreground)',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          ⚙️ Configurações
        </button>
      </div>

      {/* Mini Map - Always visible */}
      <MiniMap
        currentPlayerId={characterId || 'unknown'}
        currentLocationId={currentPlayerPosition?.locationId || 'owari_village'}
        players={playersPositions}
        onPlayerClick={handlePlayerClick}
        onExpandMap={handleExpandMap}
      />

      {/* Mapa Interativo Completo */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Mapa do Japão Feudal</h2>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-full">
              <GameMap
                currentPlayerId={characterId || 'unknown'}
                currentLocationId={currentPlayerPosition?.locationId || 'owari_village'}
                players={playersPositions}
                onLocationSelect={handleLocationSelect}
                onPlayerClick={handlePlayerClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Encontro com Criatura */}
      {activeCreatureEncounter && (
        <CreatureEncounter
          encounter={activeCreatureEncounter}
          onResolve={handleCreatureResolution}
          onDismiss={dismissCreatureEncounter}
        />
      )}

      {/* Modal de Evolução do Personagem */}
      {showEvolution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Evolução do Personagem</h2>
              <button
                onClick={() => setShowEvolution(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-full overflow-y-auto">
              <CharacterEvolution
                characterId={characterId || 'unknown'}
                currentAttributes={expandedAttributes}
                onAttributesChange={setExpandedAttributes}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Opções de Viagem */}
      {showTravelOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Escolher Destino</h2>
                <button
                  onClick={() => setShowTravelOptions(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <TravelOptionsModal
                currentLocation={currentPlayerPosition?.locationId || 'owari_village'}
                onStartTravel={handleStartTravel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Modal de Opções de Viagem
interface TravelOptionsModalProps {
  currentLocation: string
  onStartTravel: (destinationId: string, method: TravelMethod) => void
}

function TravelOptionsModal({ currentLocation, onStartTravel }: TravelOptionsModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<TravelMethod>(TravelMethod.WALKING)

  const availableRoutes = travelSystem.getAvailableRoutes(currentLocation)
  const currentLocData = JAPAN_FEUDAL_MAP[currentLocation]

  const methodOptions = [
    { value: TravelMethod.WALKING, label: '🚶 A Pé', description: 'Lento mas stealth', cost: 'Nenhum' },
    { value: TravelMethod.HORSE, label: '🐎 A Cavalo', description: 'Rápido mas caro', cost: 'Alto' },
    { value: TravelMethod.CART, label: '🚜 De Carruagem', description: 'Confortável mas lento', cost: 'Médio' },
    { value: TravelMethod.BOAT, label: '🚢 De Barco', description: 'Rápido por água', cost: 'Variável' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Local Atual</h3>
        <p className="text-blue-700">
          📍 {currentLocData?.name || currentLocation} - {currentLocData?.region || 'Desconhecido'}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Método de Viagem</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {methodOptions.map(method => (
            <button
              key={method.value}
              onClick={() => setSelectedMethod(method.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMethod === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{method.label}</div>
              <div className="text-xs opacity-75">{method.description}</div>
              <div className="text-xs mt-1 opacity-60">Custo: {method.cost}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Destinos Disponíveis</h3>
        {availableRoutes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🗺️</div>
            <p>Nenhuma rota conhecida a partir daqui.</p>
            <p className="text-sm">Explore mais para descobrir novos caminhos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRoutes.map(route => {
              const destination = JAPAN_FEUDAL_MAP[route.to]
              if (!destination) return null

              const duration = route.typicalDuration[selectedMethod] || route.typicalDuration.walking

              return (
                <div key={route.to} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{destination.name}</h4>
                      <p className="text-sm text-gray-600">{destination.region}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      route.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      route.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      route.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {route.difficulty === 'easy' ? 'Fácil' :
                       route.difficulty === 'moderate' ? 'Moderado' :
                       route.difficulty === 'hard' ? 'Difícil' : 'Extremo'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{destination.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div>📏 Distância: {route.distance} km</div>
                    <div>⏱️ Duração ({methodOptions.find(m => m.value === selectedMethod)?.label}): {duration} dia{duration !== 1 ? 's' : ''}</div>
                    <div>🏔️ Terreno: {route.terrain === 'road' ? 'Estrada' :
                                      route.terrain === 'mountain' ? 'Montanha' :
                                      route.terrain === 'forest' ? 'Floresta' :
                                      route.terrain === 'river' ? 'Rio' : 'Costa'}</div>
                  </div>

                  {route.dangers.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-red-700 mb-1">⚠️ Perigos:</div>
                      <div className="flex flex-wrap gap-1">
                        {route.dangers.slice(0, 3).map((danger, index) => (
                          <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {danger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onStartTravel(route.to, selectedMethod)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
                  >
                    🚀 Iniciar Viagem ({duration} dia{duration !== 1 ? 's' : ''})
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg text-sm">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 Sobre Viagens</h4>
        <ul className="text-yellow-800 space-y-1">
          <li>• Durante a viagem, eventos aleatórios podem ocorrer</li>
          <li>• Leve suprimentos suficientes (comida, água, medicina)</li>
          <li>• Diferentes métodos afetam velocidade e fadiga</li>
          <li>• Condições climáticas podem atrasar a jornada</li>
        </ul>
      </div>
    </div>
  )
}