'use client'

import React, { useState, useEffect, useRef } from 'react'
import { JAPAN_FEUDAL_MAP, PlayerPosition, mapManager } from '../../lib/game/map-coordinates'

interface GameMapProps {
  currentPlayerId: string
  currentLocationId: string
  players: PlayerPosition[]
  onLocationSelect?: (locationId: string) => void
  onPlayerClick: (player: PlayerPosition) => void
  isMiniMap?: boolean
}

export default function GameMap({
  currentPlayerId,
  currentLocationId,
  players,
  onLocationSelect,
  onPlayerClick,
  isMiniMap = false
}: GameMapProps) {
  const MAP_WIDTH = isMiniMap ? 400 : 800
  const MAP_HEIGHT = isMiniMap ? 300 : 600

  const [viewBox, setViewBox] = useState(() => {
    if (isMiniMap) {
      return { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT }
    } else {
      return { x: 300, y: 200, width: 400, height: 300 }
    }
  })
  const [zoom, setZoom] = useState(isMiniMap ? 1 : 1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Zoom controls
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta))
    setZoom(newZoom)

    // Adjust viewBox to zoom towards center
    const centerX = viewBox.x + viewBox.width / 2
    const centerY = viewBox.y + viewBox.height / 2
    const newWidth = MAP_WIDTH / newZoom
    const newHeight = MAP_HEIGHT / newZoom

    setViewBox({
      x: Math.max(0, centerX - newWidth / 2),
      y: Math.max(0, centerY - newHeight / 2),
      width: newWidth,
      height: newHeight
    })
  }

  // Pan controls
  const handlePan = (dx: number, dy: number) => {
    setViewBox(prev => ({
      ...prev,
      x: Math.max(0, Math.min(MAP_WIDTH - prev.width, prev.x + dx)),
      y: Math.max(0, Math.min(MAP_HEIGHT - prev.height, prev.y + dy))
    }))
  }

  // Handle location click
  const handleLocationClick = (locationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedLocation(locationId)
    if (!isMiniMap && onLocationSelect) {
      onLocationSelect(locationId)
    }
  }

  // Handle player click
  const handlePlayerClick = (player: PlayerPosition, event: React.MouseEvent) => {
    event.stopPropagation()
    onPlayerClick(player)
  }

  // Get location color based on type and danger
  const getLocationColor = (location: typeof JAPAN_FEUDAL_MAP[string]) => {
    const typeColors = {
      village: '#8B4513',
      town: '#DAA520',
      castle: '#800080',
      temple: '#FF6347',
      forest: '#228B22',
      mountain: '#696969',
      river: '#4169E1',
      road: '#8B4513',
      mystical: '#9932CC'
    }

    let color = typeColors[location.type] || '#666'

    // Adjust based on danger
    if (location.danger === 'dangerous') color = '#DC143C'
    else if (location.danger === 'extreme') color = '#8B0000'

    return color
  }

  // Get player status color
  const getPlayerStatusColor = (status: PlayerPosition['status']) => {
    const statusColors = {
      traveling: '#00FF00',
      resting: '#FFFF00',
      exploring: '#FFA500',
      in_combat: '#FF0000',
      socializing: '#00FFFF'
    }
    return statusColors[status] || '#FFFFFF'
  }

  // Draw connections between locations
  const renderConnections = () => {
    const connections = new Set<string>()

    return Object.values(JAPAN_FEUDAL_MAP).map(location =>
      location.connections.map(connectedId => {
        const connectionKey = [location.id, connectedId].sort().join('-')

        if (connections.has(connectionKey)) return null
        connections.add(connectionKey)

        const connectedLocation = JAPAN_FEUDAL_MAP[connectedId]
        if (!connectedLocation) return null

        // Only show connections within view
        const isVisible = (
          location.coordinates.x >= viewBox.x && location.coordinates.x <= viewBox.x + viewBox.width &&
          location.coordinates.y >= viewBox.y && location.coordinates.y <= viewBox.y + viewBox.height &&
          connectedLocation.coordinates.x >= viewBox.x && connectedLocation.coordinates.x <= viewBox.x + viewBox.width &&
          connectedLocation.coordinates.y >= viewBox.y && connectedLocation.coordinates.y <= viewBox.y + viewBox.height
        )

        if (!isVisible) return null

        return (
          <line
            key={connectionKey}
            x1={location.coordinates.x}
            y1={location.coordinates.y}
            x2={connectedLocation.coordinates.x}
            y2={connectedLocation.coordinates.y}
            stroke="#8B4513"
            strokeWidth="2"
            opacity="0.6"
            strokeDasharray={location.type === 'road' ? '5,5' : 'none'}
          />
        )
      })
    )
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden">
      {/* Map Controls - Only show on full map */}
      {!isMiniMap && (
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg p-2 text-white">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => handleZoom(0.2)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              +
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              -
            </button>
            <span className="px-2 py-1 text-xs">{Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => handlePan(-50, 0)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              ←
            </button>
            <button
              onClick={() => handlePan(50, 0)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              →
            </button>
            <button
              onClick={() => handlePan(0, -50)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              ↑
            </button>
            <button
              onClick={() => handlePan(0, 50)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              ↓
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-lg p-3 text-white text-xs">
        <h3 className="font-bold mb-2">Legenda</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Você</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Jogadores</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 border-2 border-white"></div>
            <span>Em combate</span>
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-75 rounded-lg p-3 text-white max-w-xs">
          <h3 className="font-bold text-sm mb-1">
            {JAPAN_FEUDAL_MAP[selectedLocation]?.name || selectedLocation}
          </h3>
          <p className="text-xs opacity-90 mb-2">
            {JAPAN_FEUDAL_MAP[selectedLocation]?.description}
          </p>
          <div className="text-xs space-y-1">
            <div>Região: {JAPAN_FEUDAL_MAP[selectedLocation]?.region}</div>
            <div>Perigo: {JAPAN_FEUDAL_MAP[selectedLocation]?.danger}</div>
            <div>Supernatural: {JAPAN_FEUDAL_MAP[selectedLocation]?.supernaturalPresence}%</div>
            {JAPAN_FEUDAL_MAP[selectedLocation]?.population && (
              <div>População: {JAPAN_FEUDAL_MAP[selectedLocation].population}</div>
            )}
          </div>
        </div>
      )}

      {/* Main SVG Map */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className={isMiniMap ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}
        onClick={() => setSelectedLocation(null)}
      >
        {/* Background pattern */}
        <defs>
          <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#90EE90" />
            <circle cx="10" cy="10" r="1" fill="#228B22" opacity="0.3" />
          </pattern>

          {/* Map background image */}
          <pattern id="mapBackground" patternUnits="userSpaceOnUse" width="800" height="600">
            <image href="/images/japan-map-bg.jpeg" width="800" height="600" opacity="0.3"/>
          </pattern>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mapBackground)" />

        {/* Connections */}
        {renderConnections()}

        {/* Locations */}
        {Object.values(JAPAN_FEUDAL_MAP).map(location => {
          const isSelected = selectedLocation === location.id
          const isCurrentLocation = currentLocationId === location.id
          const size = location.type === 'village' ? 8 :
                      location.type === 'town' ? 12 :
                      location.type === 'castle' ? 16 :
                      location.type === 'temple' ? 10 : 6

          return (
            <g key={location.id}>
              {/* Location marker */}
              <circle
                cx={location.coordinates.x}
                cy={location.coordinates.y}
                r={size}
                fill={getLocationColor(location)}
                stroke={isSelected ? '#FFD700' : isCurrentLocation ? '#00FF00' : '#000'}
                strokeWidth={isSelected || isCurrentLocation ? 3 : 1}
                className="cursor-pointer hover:stroke-2 transition-all"
                onClick={(e) => handleLocationClick(location.id, e)}
              />

              {/* Supernatural aura */}
              {location.supernaturalPresence > 50 && (
                <circle
                  cx={location.coordinates.x}
                  cy={location.coordinates.y}
                  r={size + 5}
                  fill="none"
                  stroke="#9932CC"
                  strokeWidth="2"
                  opacity="0.6"
                  filter="url(#glow)"
                />
              )}

              {/* Location label */}
              <text
                x={location.coordinates.x}
                y={location.coordinates.y - size - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#000"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {location.name}
              </text>
            </g>
          )
        })}

        {/* Players */}
        {players.map(player => {
          const isCurrentPlayer = player.playerId === currentPlayerId
          const isHovered = hoveredPlayer === player.playerId

          return (
            <g key={player.playerId}>
              {/* Player marker */}
              <circle
                cx={player.coordinates.x}
                cy={player.coordinates.y}
                r={isCurrentPlayer ? 8 : 6}
                fill={isCurrentPlayer ? '#00FF00' : getPlayerStatusColor(player.status)}
                stroke="#000"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                filter={isHovered ? 'url(#glow)' : 'none'}
                onMouseEnter={() => setHoveredPlayer(player.playerId)}
                onMouseLeave={() => setHoveredPlayer(null)}
                onClick={(e) => handlePlayerClick(player, e)}
              />

              {/* Player name */}
              <text
                x={player.coordinates.x}
                y={player.coordinates.y - 15}
                textAnchor="middle"
                fontSize="9"
                fill="#000"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {player.userName}
              </text>

              {/* Status indicator */}
              {player.status === 'in_combat' && (
                <circle
                  cx={player.coordinates.x + 10}
                  cy={player.coordinates.y - 10}
                  r="3"
                  fill="#FF0000"
                  className="animate-pulse"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Player info tooltip */}
      {hoveredPlayer && (
        <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-75 rounded-lg p-3 text-white text-xs">
          {(() => {
            const player = players.find(p => p.playerId === hoveredPlayer)
            if (!player) return null

            return (
              <div>
                <h4 className="font-bold">{player.userName}</h4>
                <div>Status: {player.status}</div>
                <div>Local: {JAPAN_FEUDAL_MAP[player.locationId]?.name || player.locationId}</div>
                <div>Online: {player.isOnline ? 'Sim' : 'Não'}</div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}