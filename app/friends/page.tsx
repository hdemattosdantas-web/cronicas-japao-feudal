"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Friend {
  id: string
  friendId: string
  friendEmail: string
  friendName: string
  addedAt: string
  isOnline: boolean
  currentRoom?: string
}

interface FriendRequest {
  id: string
  fromUserId: string
  fromUserEmail: string
  fromUserName: string
  toUserId: string
  toUserEmail: string
  toUserName: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

interface OnlineUser {
  userId: string
  email: string
  name: string
  username?: string
  isOnline: boolean
  lastSeen: string
  currentRoom?: string
}

export default function FriendsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const inviteRoomId = searchParams.get('invite');

  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<OnlineUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<'email' | 'username'>('username');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadFriends();
    loadFriendRequests();

    // Se veio de um convite, mostrar aba de amigos
    if (inviteRoomId) {
      setActiveTab('friends');
    }
  }, [session, inviteRoomId]);

  useEffect(() => {
    // Atualizar status online a cada 30 segundos
    const interval = setInterval(() => {
      if (session) {
        loadOnlineFriends();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

  const loadFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineFriends = async () => {
    try {
      const response = await fetch('/api/users?friends=true');
      if (response.ok) {
        const data = await response.json();
        setOnlineFriends(data);

        // Atualizar status online na lista de amigos
        setFriends(prev => prev.map(friend => ({
          ...friend,
          isOnline: data.some((online: any) => online.userId === friend.friendId)
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar amigos online:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&type=${searchType}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (friendIdentifier: string, isUsername: boolean = false) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendIdentifier,
          searchType: isUsername ? 'username' : 'email'
        }),
      });

      if (response.ok) {
        alert('Pedido de amizade enviado!');
        setSearchTerm('');
        setSearchResults([]);
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido de amizade');
    }
  };

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/friends/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        alert(action === 'accept' ? 'Amizade aceita!' : 'Pedido recusado');
        loadFriends();
        loadFriendRequests();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert('Erro ao processar pedido');
    }
  };

  const inviteToRoom = (friendId: string, friendName: string, roomId?: string) => {
    const targetRoomId = roomId || inviteRoomId;
    if (!targetRoomId) {
      alert('Selecione uma sala primeiro');
      router.push('/rooms');
      return;
    }

    // TODO: Implementar sistema real de convites via API
    alert(`Convite enviado para ${friendName} para a sala ${targetRoomId}!`);
  };

  if (!session) {
    return null; // Redirecionará
  }

  if (loading) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <p>Carregando amigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              👥 Sistema de Amigos
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Conecte-se com outros aventureiros do Japão feudal
            </p>
          </div>
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

        {/* Convite pendente */}
        {inviteRoomId && (
          <div className="mb-6 p-4 rounded-lg border-2"
               style={{ borderColor: 'var(--accent)', backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">🎉 Convite Pendente!</h3>
                <p className="text-sm mt-1">
                  Você foi convidado para uma sala. Convide seus amigos online para jogar juntos!
                </p>
              </div>
              <Link href={`/rooms`}>
                <button style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px'
                }}>
                  🏰 Ver Sala
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Abas de navegação */}
        <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'friends', label: 'Meus Amigos', count: friends.length },
            { id: 'requests', label: 'Pedidos', count: friendRequests.length },
            { id: 'search', label: 'Encontrar Amigos', count: 0 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 text-current'
                  : 'text-gray-500 hover:text-current'
              }`}
              style={{
                borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : undefined
              }}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'friends' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Seus Amigos</h2>
              <button
                onClick={loadOnlineFriends}
                className="text-sm"
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px'
                }}
              >
                🔄 Atualizar Status
              </button>
            </div>

            {friends.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-gray-600 mb-4">Você ainda não tem amigos</p>
                <button
                  onClick={() => setActiveTab('search')}
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '6px'
                  }}
                >
                  Encontrar Amigos
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <div className="font-semibold">{friend.friendName}</div>
                          <div className="text-sm opacity-70">{friend.friendEmail}</div>
                        </div>
                      </div>
                      <div className="text-sm opacity-60">
                        {friend.isOnline ? '🟢 Online' : '⚫ Offline'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => inviteToRoom(friend.friendId, friend.friendName)}
                        disabled={!friend.isOnline}
                        className="flex-1 text-sm"
                        style={{
                          background: friend.isOnline ? 'var(--accent)' : '#ccc',
                          color: 'white',
                          padding: '6px',
                          borderRadius: '4px',
                          cursor: friend.isOnline ? 'pointer' : 'not-allowed'
                        }}
                      >
                        🏰 Convidar p/ Sala{inviteRoomId ? ` (${inviteRoomId})` : ''}
                      </button>
                      <button
                        className="px-3 py-1 text-sm"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)'
                        }}
                      >
                        💬 Mensagem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Pedidos de Amizade Pendentes</h2>

            {friendRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📨</div>
                <p className="text-gray-600">Nenhum pedido pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{request.fromUserName}</div>
                        <div className="text-sm opacity-70">{request.fromUserEmail}</div>
                        <div className="text-xs opacity-60 mt-1">
                          Enviado em {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFriendRequest(request.id, 'accept')}
                          style={{
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px'
                          }}
                        >
                          ✅ Aceitar
                        </button>
                        <button
                          onClick={() => handleFriendRequest(request.id, 'decline')}
                          style={{
                            background: 'transparent',
                            border: '1px solid #dc3545',
                            color: '#dc3545',
                            padding: '8px 16px',
                            borderRadius: '4px'
                          }}
                        >
                          ❌ Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Encontrar Novos Amigos</h2>

            {/* Seletor de tipo de busca */}
            <div className="mb-4">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="username"
                    checked={searchType === 'username'}
                    onChange={(e) => setSearchType(e.target.value as 'email' | 'username')}
                    className="mr-2"
                  />
                  📛 Buscar por nome de usuário
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="email"
                    checked={searchType === 'email'}
                    onChange={(e) => setSearchType(e.target.value as 'email' | 'username')}
                    className="mr-2"
                  />
                  📧 Buscar por email
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type={searchType === 'email' ? 'email' : 'text'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchType === 'email' ? "Digite o email do amigo..." : "Digite o nome de usuário..."}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                />
                <button
                  onClick={searchUsers}
                  disabled={isSearching || !searchTerm.trim()}
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    cursor: isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
                    opacity: isSearching || !searchTerm.trim() ? 0.7 : 1
                  }}
                >
                  {isSearching ? '🔍...' : '🔍 Buscar'}
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Resultados da Busca:</h3>
                {searchResults.map((user) => (
                  <div
                    key={user.userId}
                    className="p-3 rounded-lg border flex items-center justify-between"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div>
                      <div className="font-semibold">{user.name || 'Usuário'}</div>
                      {user.username && (
                        <div className="text-sm opacity-70">@{user.username}</div>
                      )}
                      <div className="text-sm opacity-70">{user.email}</div>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(
                        searchType === 'username' ? user.username || user.email : user.email,
                        searchType === 'username'
                      )}
                      style={{
                        background: 'var(--accent)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px'
                      }}
                    >
                      ➕ Adicionar Amigo
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
              <h3 className="font-semibold mb-2">💡 Como funciona:</h3>
              <ul className="text-sm space-y-1">
                <li>• Escolha buscar por <strong>nome de usuário</strong> ou <strong>email</strong></li>
                <li>• Para nome de usuário: digite exatamente como aparece (ex: @samurai_warrior)</li>
                <li>• Para email: digite o endereço completo</li>
                <li>• Clique em "Buscar" para encontrar o usuário</li>
                <li>• Clique em "Adicionar Amigo" para enviar pedido</li>
                <li>• O amigo precisa aceitar o pedido</li>
                <li>• Amigos online podem ser convidados para salas</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}