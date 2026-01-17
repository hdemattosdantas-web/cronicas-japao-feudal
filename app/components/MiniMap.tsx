'use client'

import React, { useState } from 'react'
import GameMap from './GameMap'
import { PlayerPosition } from '../../lib/game/map-coordinates'

interface MiniMapProps {
  currentPlayerId: string
  currentLocationId: string
  players: PlayerPosition[]
  onPlayerClick: (player: PlayerPosition) => void
  onExpandMap: () => void
}

export default function MiniMap({
  currentPlayerId,
  currentLocationId,
  players,
  onPlayerClick,
  onExpandMap
}: MiniMapProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="fixed bottom-4 right-4 z-20 bg-black bg-opacity-75 rounded-lg border-2 border-gray-600 overflow-hidden shadow-lg"
      style={{ width: '200px', height: '150px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mini Map Content */}
      <div className="w-full h-full">
        <GameMap
          currentPlayerId={currentPlayerId}
          currentLocationId={currentLocationId}
          players={players}
          onPlayerClick={onPlayerClick}
          isMiniMap={true}
        />
      </div>

      {/* Expand Button - Only visible on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={onExpandMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            🗺️ Expandir Mapa
          </button>
        </div>
      )}

      {/* Mini Map Label */}
      <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        Japão Feudal
      </div>

      {/* Player Count Indicator */}
      <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
        👥 {players.filter(p => p.isOnline).length}
      </div>
    </div>
  )
}