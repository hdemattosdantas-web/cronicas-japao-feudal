"use client"

import { useState, useEffect } from 'react'
import { Inventory, InventorySlot, Item } from '@/types/inventory'
import { EquipmentSlots } from '@/types/inventory'

interface InventoryComponentProps {
  characterId: string
}

export function InventoryComponent({ characterId }: InventoryComponentProps) {
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<InventorySlot | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInventory()
  }, [characterId])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/characters/${characterId}/inventory`)
      if (!response.ok) {
        throw new Error('Erro ao carregar inventário')
      }
      const data = await response.json()
      setInventory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const equipItem = async (slotId: string, equipmentSlot: string) => {
    try {
      const response = await fetch(`/api/inventory/equip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: inventory?.id,
          slotId,
          equipmentSlot
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao equipar item')
      }

      await loadInventory()
      setSelectedSlot(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const unequipItem = async (slotId: string) => {
    try {
      const response = await fetch(`/api/inventory/unequip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: inventory?.id,
          slotId
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao desequipar item')
      }

      await loadInventory()
      setSelectedSlot(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comum': return '#9ca3af'
      case 'incomum': return '#10b981'
      case 'raro': return '#3b82f6'
      case 'epico': return '#8b5cf6'
      case 'legendario': return '#f59e0b'
      default: return '#9ca3af'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return '⚔️'
      case 'armor': return '🛡️'
      case 'tool': return '🔧'
      case 'consumable': return '🧪'
      case 'material': return '🪨'
      case 'treasure': return '💎'
      case 'special': return '✨'
      default: return '📦'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        <p className="font-semibold">❌ Erro:</p>
        <p>{error}</p>
        <button 
          onClick={loadInventory}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Inventário não encontrado</p>
      </div>
    )
  }

  const equippedItems = inventory.slots?.filter(slot => slot.isEquipped) || []
  const inventoryItems = inventory.slots?.filter(slot => !slot.isEquipped) || []

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Inventário */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
        <h2 className="text-xl font-bold text-amber-900 mb-2">🎒 Bolsa do Personagem</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-amber-700">Peso:</span>
            <span className="ml-2 font-semibold">
              {inventory.currentWeight.toFixed(1)} / {inventory.maxWeight} kg
            </span>
            <div className="w-full bg-amber-200 rounded-full h-2 mt-1">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all"
                style={{ width: `${(inventory.currentWeight / inventory.maxWeight) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <span className="text-amber-700">Slots:</span>
            <span className="ml-2 font-semibold">
              {inventory.usedSlots} / {inventory.maxSlots}
            </span>
            <div className="w-full bg-amber-200 rounded-full h-2 mt-1">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all"
                style={{ width: `${(inventory.usedSlots / inventory.maxSlots) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Itens Equipados */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2">⚔️</span>
          Equipamentos
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(EquipmentSlots).map(slot => {
            const equippedItem = equippedItems.find(item => item.equippedSlot === slot)
            return (
              <div key={slot} className="border rounded-lg p-3 bg-gray-50">
                <div className="text-xs text-gray-600 mb-1 capitalize">
                  {slot.replace('_', ' ')}
                </div>
                {equippedItem ? (
                  <div 
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => setSelectedSlot(equippedItem)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{equippedItem.item?.icon || getCategoryIcon(equippedItem.item?.category || '')}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{equippedItem.item?.name}</div>
                        <div 
                          className="text-xs font-semibold"
                          style={{ color: getRarityColor(equippedItem.item?.rarity || 'comum') }}
                        >
                          {equippedItem.item?.rarity}
                        </div>
                      </div>
                      {equippedItem.quantity > 1 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {equippedItem.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm text-center py-2">
                    Vazio
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Inventário Principal */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2">🎒</span>
          Itens na Bolsa
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: inventory.maxSlots }, (_, index) => {
            const slot = inventoryItems.find(item => item.slotPosition === index + 1)
            return (
              <div
                key={index}
                className={`aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all ${
                  slot 
                    ? 'border-amber-300 bg-amber-50 hover:border-amber-400' 
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                } ${selectedSlot?.id === slot?.id ? 'ring-2 ring-amber-500' : ''}`}
                onClick={() => slot && setSelectedSlot(slot)}
              >
                {slot ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">
                      {slot.item?.icon || getCategoryIcon(slot.item?.category || '')}
                    </span>
                    <div className="text-xs text-center font-medium truncate w-full">
                      {slot.item?.name}
                    </div>
                    {slot.quantity > 1 && (
                      <span className="bg-blue-500 text-white text-xs px-1 rounded mt-1">
                        {slot.quantity}
                      </span>
                    )}
                    <div 
                      className="text-xs font-semibold mt-1"
                      style={{ color: getRarityColor(slot.item?.rarity || 'comum') }}
                    >
                      {slot.item?.rarity === 'comum' ? '' : slot.item?.rarity}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <span className="text-3xl">+</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detalhes do Item Selecionado */}
      {selectedSlot && selectedSlot.item && (
        <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">
                {selectedSlot.item.icon || getCategoryIcon(selectedSlot.item.category)}
              </span>
              <div>
                <h4 className="font-bold text-lg">{selectedSlot.item.name}</h4>
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: getRarityColor(selectedSlot.item.rarity) }}
                  >
                    {selectedSlot.item.rarity}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedSlot.item.weight} kg • {selectedSlot.item.size}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-3">{selectedSlot.item.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-semibold">Categoria:</span>
              <span className="ml-2 text-sm">{selectedSlot.item.category}</span>
            </div>
            <div>
              <span className="text-sm font-semibold">Valor:</span>
              <span className="ml-2 text-sm">{selectedSlot.item.value} moedas</span>
            </div>
            {selectedSlot.quantity > 1 && (
              <div>
                <span className="text-sm font-semibold">Quantidade:</span>
                <span className="ml-2 text-sm">{selectedSlot.quantity}</span>
              </div>
            )}
          </div>

          {/* Ações do Item */}
          <div className="flex space-x-2">
            {selectedSlot.item.category === 'weapon' && !selectedSlot.isEquipped && (
              <button
                onClick={() => equipItem(selectedSlot.id, EquipmentSlots.MAIN_HAND)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Equipar na Mão Principal
              </button>
            )}
            
            {selectedSlot.item.category === 'armor' && !selectedSlot.isEquipped && (
              <button
                onClick={() => equipItem(selectedSlot.id, EquipmentSlots.CHEST)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Equipar Armadura
              </button>
            )}

            {selectedSlot.isEquipped && (
              <button
                onClick={() => unequipItem(selectedSlot.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Desequipar
              </button>
            )}

            {selectedSlot.item.category === 'special' && !selectedSlot.isEquipped && (
              <button
                onClick={() => equipItem(selectedSlot.id, EquipmentSlots.ACCESSORY1)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Equipar Acessório
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
