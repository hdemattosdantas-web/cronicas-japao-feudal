'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChatRoom {
  id: string;
  name?: string;
  type: string;
  campaignId?: string;
  participants: Array<{
    user: {
      id: string;
      name?: string;
      username?: string;
      image?: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name?: string;
      username?: string;
      image?: string;
    };
  }>;
  _count: {
    messages: number;
    participants: number;
  };
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    username?: string;
    image?: string;
  };
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      loadRooms();
    }
  }, [status, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms');
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

  const loadMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          messageType: 'text'
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        loadRooms(); // Atualizar lista de salas
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadMessages(room.id);
  };

  const getRoomDisplayName = (room: ChatRoom) => {
    if (room.name) return room.name;

    // Para chat direto, mostrar nome do outro participante
    const otherParticipants = room.participants.filter(
      p => p.user.id !== session?.user?.id
    );

    if (otherParticipants.length === 1) {
      return otherParticipants[0].user.name || otherParticipants[0].user.username || 'Usuário';
    }

    return `Chat em Grupo (${room._count.participants})`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex items-center justify-center">
        <div className="text-xl">Carregando chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#d4af37] flex">
      {/* Sidebar com salas */}
      <div className="w-80 bg-[#2a2a2a] border-r border-[#d4af37]/20 flex flex-col">
        <div className="p-4 border-b border-[#d4af37]/20">
          <h2 className="text-xl font-bold font-cinzel text-[#d4af37]">💬 Conversas</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              Nenhuma conversa ainda
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`p-4 border-b border-[#d4af37]/10 cursor-pointer hover:bg-[#3a3a3a] transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-[#3a3a3a] border-l-4 border-[#d4af37]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold">
                    {room.type === 'direct' ? '👤' : '👥'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getRoomDisplayName(room)}
                    </div>
                    {room.messages.length > 0 && (
                      <div className="text-sm text-gray-400 truncate">
                        {room.messages[0].user.username}: {room.messages[0].content}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {room._count.messages} msgs
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Header da conversa */}
            <div className="p-4 border-b border-[#d4af37]/20 bg-[#2a2a2a]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold">
                  {selectedRoom.type === 'direct' ? '👤' : '👥'}
                </div>
                <div>
                  <h3 className="font-bold font-cinzel text-[#d4af37]">
                    {getRoomDisplayName(selectedRoom)}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {selectedRoom._count.participants} participantes
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.user.id === session?.user?.id ? 'justify-end' : ''
                  }`}
                >
                  {message.user.id !== session?.user?.id && (
                    <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                      {message.user.image ? (
                        <Image
                          src={message.user.image}
                          alt={message.user.name || 'User'}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        (message.user.name?.[0] || message.user.username?.[0] || '?').toUpperCase()
                      )}
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.user.id === session?.user?.id
                      ? 'bg-[#d4af37] text-black'
                      : 'bg-[#3a3a3a] text-[#d4af37]'
                  }`}>
                    {message.user.id !== session?.user?.id && (
                      <div className="text-xs font-medium mb-1 opacity-75">
                        {message.user.name || message.user.username}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-50 ${
                      message.user.id === session?.user?.id ? 'text-right' : ''
                    }`}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="p-4 border-t border-[#d4af37]/20 bg-[#2a2a2a]">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-lg text-[#d4af37] placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-[#d4af37] text-black font-medium rounded-lg hover:bg-[#b8941f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  📤 Enviar
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-cinzel text-[#d4af37] mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-400">
                Escolha uma conversa na lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}